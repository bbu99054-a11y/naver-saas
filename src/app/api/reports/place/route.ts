import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { PlaceReportSnapshot, calculatePlaceAuditScore, buildDeepAuditBundle } from '@/lib/email/placeReportTemplate'

export async function GET(req: Request) {
  try {
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
      myRank: meta.myRank || 2,
      top1Name: meta.top1Name || '1위 매장',
      myReviews: meta.myReviews || 0,
      top1Reviews: meta.top1Reviews || 0,
      myBlogReviews: meta.myBlogReviews || 0,
      top1BlogReviews: meta.top1BlogReviews || 0,
      myBooking: meta.myBooking ?? false,
      top1Booking: meta.top1Booking ?? true,
      myCoupon: meta.myCoupon ?? true,
      top1Coupon: meta.top1Coupon ?? true,
      mySaves: meta.mySaves || '10,000+',
      top1Saves: meta.top1Saves || '50,000+',
      reportId: id,
      reportDate: lead.createdAt.toLocaleDateString('ko-KR')
    }

    if (!snapshot.totalScore) {
      snapshot.totalScore = calculatePlaceAuditScore(snapshot)
    }

    if (!snapshot.deepAudit) {
      snapshot.deepAudit = buildDeepAuditBundle(snapshot)
    }

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

    // 8자리 랜덤 슬러그 생성 (예: 'ps7k9a2f')
    const reportSlug = 'ps' + Math.random().toString(36).substring(2, 8)

    const finalSnapshot: PlaceReportSnapshot = snapshot || {
      storeName,
      targetKeyword,
      myRank: body.myRank || 2,
      top1Name: body.top1Name || '1위 매장',
      myReviews: body.myReviews || 0,
      top1Reviews: body.top1Reviews || 0,
      myBlogReviews: body.myBlogReviews || 0,
      top1BlogReviews: body.top1BlogReviews || 0,
      myBooking: body.myBooking ?? false,
      top1Booking: body.top1Booking ?? true,
      myCoupon: body.myCoupon ?? true,
      top1Coupon: body.top1Coupon ?? true,
      mySaves: body.mySaves || '10,000+',
      top1Saves: body.top1Saves || '50,000+',
      reportId: reportSlug,
      reportDate: new Date().toLocaleDateString('ko-KR')
    }

    finalSnapshot.totalScore = finalSnapshot.totalScore || calculatePlaceAuditScore(finalSnapshot)
    finalSnapshot.deepAudit = finalSnapshot.deepAudit || buildDeepAuditBundle(finalSnapshot)

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
