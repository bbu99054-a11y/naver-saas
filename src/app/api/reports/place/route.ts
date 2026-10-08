import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PlaceReportSnapshot, calculatePlaceAuditScore, buildDeepAuditBundle, generateSaaSReportSummary } from '@/lib/email/placeReportTemplate'
import { fetchPlaceRealDetails } from '@/lib/naver/placeDetailScraper'
import { getClientIp, checkIpRateLimit } from '@/lib/rateLimit'
import crypto from 'crypto'

export async function GET(req: Request) {
  try {
    // 🛡️ IP 기반 Rate Limiting (1분당 최대 30회 조회 제한 - 무차별 크롤링 및 DB 과부하 차단)
    const clientIp = getClientIp(req)
    const ipCheck = checkIpRateLimit(clientIp, 30, 60000)
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: `리포트 조회 요청이 너무 빈번합니다. ${ipCheck.remainingSec}초 후 다시 시도해 주세요.` },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: '리포트 ID가 필요합니다.' }, { status: 400 })
    }

    // 1. Lead id로 검색
    let lead = await prisma.lead.findUnique({
      where: { id }
    })

    // 2. 만약 id가 Lead CUID가 아닌 경우, metadata->reportId로 검색
    if (!lead) {
      try {
        lead = await prisma.lead.findFirst({
          where: {
            metadata: {
              path: ['reportId'],
              equals: id
            }
          }
        })
      } catch (pathErr) {
        console.warn('[Reports Place] Prisma path query fallback:', pathErr)
      }

      // 3. Fallback: 최근 리드 200건에서 metadata->reportId 매칭
      if (!lead) {
        const recentLeads = await prisma.lead.findMany({
          orderBy: { createdAt: 'desc' },
          take: 200
        })
        lead = recentLeads.find(l => {
          const meta = l.metadata as any
          return meta && (meta.reportId === id || meta.id === id)
        }) || null
      }
    }

    if (!lead || !lead.metadata) {
      return NextResponse.json({ error: '해당 진단 리포트를 찾을 수 없습니다.' }, { status: 404 })
    }

    const meta = lead.metadata as any
    const snapshot: PlaceReportSnapshot = meta.reportSnapshot || {
      storeName: lead.businessName || meta.store_name || '신청 매장',
      targetKeyword: meta.target_keyword || meta.keyword || '플레이스',
      myRank: (meta.myRank !== undefined && meta.myRank !== null) ? meta.myRank : null,
      top1Name: meta.top1Name || '1위 매장',
      myReviews: meta.myReviews || 0,
      top1Reviews: meta.top1Reviews || 0,
      myBlogReviews: meta.myBlogReviews || 0,
      top1BlogReviews: meta.top1BlogReviews || 0,
      myBooking: meta.myBooking ?? false,
      top1Booking: meta.top1Booking ?? false,
      myCoupon: meta.myCoupon ?? false,
      top1Coupon: meta.top1Coupon ?? false,
      mySaves: meta.mySaves || '미집계',
      top1Saves: meta.top1Saves || '미집계',
      reportId: id,
      reportDate: lead.createdAt.toLocaleDateString('ko-KR')
    }

    // 실측 데이터가 없으면 실시간 네이버 실측 분석 실행
    if (!snapshot.realDetails && snapshot.storeName) {
      try {
        snapshot.realDetails = await fetchPlaceRealDetails(snapshot.storeName, snapshot.targetKeyword)
      } catch (scrapeErr) {
        console.warn('[Reports Place GET] fetchPlaceRealDetails fallback:', scrapeErr)
      }
    }

    // 항상 최신 2026 규정 및 가속도 알고리즘에 맞게 점수와 심층 번들을 실시간 재산출하여 보장
    snapshot.totalScore = calculatePlaceAuditScore(snapshot)
    snapshot.deepAudit = buildDeepAuditBundle(snapshot)
    snapshot.saasSummary = snapshot.deepAudit.saasSummary || generateSaaSReportSummary(snapshot)

    return NextResponse.json({
      success: true,
      id,
      snapshot,
      createdAt: lead.createdAt
    })
  } catch (error: any) {
    console.error('[Reports Place GET Error]:', error)
    return NextResponse.json({ error: '리포트 조회 중 오류가 발생했습니다.' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { snapshot, email = '', phone = '', storeName = '', targetKeyword = '' } = body

    if (!snapshot && !storeName) {
      return NextResponse.json({ error: '진단 데이터가 누락되었습니다.' }, { status: 400 })
    }

    // 8자리 암호학적 랜덤 슬러그 생성 (예: 'ps7a3f9c2d')
    const reportSlug = 'ps' + crypto.randomBytes(4).toString('hex')

    const finalSnapshot: PlaceReportSnapshot = snapshot || {
      storeName,
      targetKeyword,
      myRank: (body.myRank !== undefined && body.myRank !== null) ? body.myRank : (body.rank ?? null),
      top1Name: body.top1Name || '1위 매장',
      myReviews: body.myReviews || 0,
      top1Reviews: body.top1Reviews || 0,
      myBlogReviews: body.myBlogReviews || 0,
      top1BlogReviews: body.top1BlogReviews || 0,
      myBooking: body.myBooking ?? false,
      top1Booking: body.top1Booking ?? false,
      myCoupon: body.myCoupon ?? false,
      top1Coupon: body.top1Coupon ?? false,
      mySaves: body.mySaves || '미집계',
      top1Saves: body.top1Saves || '미집계',
      reportId: reportSlug,
      reportDate: new Date().toLocaleDateString('ko-KR')
    }

    // 실측 데이터가 없으면 실시간 네이버 실측 분석 실행
    if (!finalSnapshot.realDetails && finalSnapshot.storeName) {
      try {
        finalSnapshot.realDetails = await fetchPlaceRealDetails(finalSnapshot.storeName, finalSnapshot.targetKeyword)
      } catch (scrapeErr) {
        console.warn('[Reports Place POST] fetchPlaceRealDetails fallback:', scrapeErr)
      }
    }

    finalSnapshot.totalScore = finalSnapshot.totalScore || calculatePlaceAuditScore(finalSnapshot)
    finalSnapshot.deepAudit = finalSnapshot.deepAudit || buildDeepAuditBundle(finalSnapshot)
    finalSnapshot.saasSummary = finalSnapshot.saasSummary || finalSnapshot.deepAudit.saasSummary || generateSaaSReportSummary(finalSnapshot)

    // DB에 스냅샷 저장
    const createdLead = await prisma.lead.create({
      data: {
        toolSource: 'place',
        leadType: 'audit_report',
        email: email || `guest_${reportSlug}@postsync.report`,
        phone: phone || null,
        businessName: finalSnapshot.storeName,
        metadata: {
          reportId: reportSlug,
          reportSnapshot: finalSnapshot,
          target_keyword: finalSnapshot.targetKeyword,
          createdVia: 'place_tool_snapshot'
        }
      }
    })

    const reportUrl = `/report/place-audit.html?id=${reportSlug}`

    return NextResponse.json({
      success: true,
      reportId: reportSlug,
      leadId: createdLead.id,
      reportUrl,
      snapshot: finalSnapshot
    })
  } catch (error: any) {
    console.error('[Reports Place POST Error]:', error)
    return NextResponse.json({ error: '리포트 스냅샷 저장 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
