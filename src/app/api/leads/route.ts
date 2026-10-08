import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { triageConsultLead, LeadTriageResult } from '@/lib/ai/jevClient'
import { generatePlaceReportEmailHtml, PlaceReportSnapshot, calculatePlaceAuditScore, buildDeepAuditBundle } from '@/lib/email/placeReportTemplate'
import { getClientIp, checkIpRateLimit, checkEmailCoolDown, escapeHtml } from '@/lib/rateLimit'
import { safeEncrypt } from '@/lib/crypto'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    // 🛡️ IP 기반 Rate Limiting (1분당 최대 4회 신청 제한 - 매크로 및 서버 자원 남용 방어)
    const clientIp = getClientIp(req)
    const ipCheck = checkIpRateLimit(clientIp, 4, 60000)
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: `신청 요청이 너무 빈번합니다. ${ipCheck.remainingSec}초 후 다시 시도해 주세요.` },
        { status: 429 }
      )
    }
    const body = await req.json()
    const {
      toolSource: rawToolSource,
      sourceTool: rawSourceTool,
      leadType = 'lead_magnet', // 'lead_magnet' | 'ebook_order' | 'consulting'
      email,
      phone = '',
      name = '',
      industry = '',
      businessName = '',
      metadata = {},
      targetUserId = null,
      ref = null,
    } = body

    const toolSource = String(rawToolSource || rawSourceTool || (body.details?.store_name || String(body.rewardName || '').includes('플레이스') ? 'place' : 'unknown')).trim()
    const resolvedTargetUserId = targetUserId || metadata.targetUserId || ref || null

    let validEmail = email
    if (!validEmail || !String(validEmail).includes('@')) {
      if (leadType === 'consulting' && phone) {
        validEmail = `${String(phone).replace(/[^0-9]/g, '') || 'client'}@postsync.consult`
      } else {
        return NextResponse.json(
          { error: '올바른 이메일 주소를 입력해 주세요.' },
          { status: 400 }
        )
      }
    }

    const cleanEmail = String(validEmail).trim().toLowerCase()
    const cleanPhone = String(phone).trim()
    const cleanName = String(name).trim() || String(businessName).trim() || '고객'
    const nowTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })

    // 계산서 / 현금영수증 요청 정보
    const taxType = metadata.taxDeductionType || body.taxDeductionType || 'NONE'
    const taxNum = String(metadata.taxDeductionNum || body.taxDeductionNum || '').trim()
    let taxDeductionText = '미발행'
    if (taxType === 'PERSONAL') {
      taxDeductionText = `개인 소득공제용 현금영수증 (${taxNum || cleanPhone || '번호 미기재'})`
    } else if (taxType === 'BUSINESS') {
      taxDeductionText = `사업자 지출증빙용 세금계산서 (${taxNum || '사업자번호 미기재'})`
    }

    // 🧠 Jev (TypeSafe AI System One) 초고속 실시간 긴급도/수임가치 판별 (0.05초)
    let jevTriage: LeadTriageResult | null = null
    if (leadType === 'consulting') {
      jevTriage = await triageConsultLead({
        specialty: metadata.specialty || industry,
        stage: metadata.stage,
        summary: metadata.summary,
        name: cleanName,
        phone: cleanPhone,
      })
    }

    // 📍 플레이스 실측 리포트 자동 발급 및 스냅샷 구성
    const isPlaceLead = toolSource === 'place' || String(body.rewardName || '').includes('플레이스') || !!body.details?.store_name
    const reportSlug = 'ps' + crypto.randomBytes(4).toString('hex')
    const reportUrl = `https://postsyncapp.com/report/place-audit.html?id=${reportSlug}`

    let placeSnapshot: PlaceReportSnapshot | null = null
    if (isPlaceLead) {
      const details = body.details || {}
      placeSnapshot = {
        storeName: details.store_name || body.storeName || cleanName,
        targetKeyword: details.target_keyword || body.keyword || metadata.target_keyword || '플레이스',
        myRank: (details.myRank !== undefined && details.myRank !== null) ? details.myRank : (body.myRank ?? null),
        top1Name: details.top1Name || body.top1Name || '1위 매장',
        myReviews: details.myReviews || body.myReviews || 0,
        top1Reviews: details.top1Reviews || body.top1Reviews || 0,
        myBlogReviews: details.myBlogReviews || body.myBlogReviews || 0,
        top1BlogReviews: details.top1BlogReviews || body.top1BlogReviews || 0,
        myBooking: details.myBooking ?? body.myBooking ?? false,
        top1Booking: details.top1Booking ?? body.top1Booking ?? false,
        myCoupon: details.myCoupon ?? body.myCoupon ?? false,
        top1Coupon: details.top1Coupon ?? body.top1Coupon ?? false,
        mySaves: details.mySaves || body.mySaves || '미집계',
        top1Saves: details.top1Saves || body.top1Saves || '미집계',
        reportId: reportSlug,
        reportDate: nowTime.split(' ')[0],
        top3Places: details.top3Places || body.top3Places || []
      }
      placeSnapshot.totalScore = placeSnapshot.totalScore || calculatePlaceAuditScore(placeSnapshot)
      placeSnapshot.deepAudit = buildDeepAuditBundle(placeSnapshot)
    }

    // 1. Telegram 실시간 알림 발송 (대표님 텔레그램 봇)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN
    const tgChatId = process.env.TELEGRAM_CHAT_ID

    if (tgToken && tgChatId) {
      try {
        let msg = ''
        if (leadType === 'consulting') {
          const urgentBadge = jevTriage?.isUrgent ? '🚨 [골든타임 긴급]' : '⚖️ [일반 상담]'
          msg = `${urgentBadge} 사건 1분 안심 진단 접수 - ${toolSource.toUpperCase()}\n\n` +
            `🧠 [Jev AI 실시간 긴급도 판별 결과]\n` +
            `• 긴급도 지수: ${jevTriage ? jevTriage.urgencyScore : 85}% (${jevTriage?.isUrgent ? '골든타임 대응 요망' : '일반 대응'})\n` +
            `• 추정 수임 가치: ${jevTriage ? jevTriage.retainerAmountLabel : '상담 후 산정'}\n` +
            `• 권장 액션: ${jevTriage ? jevTriage.actionText : '10분 내 유선 연결 권장'}\n\n` +
            `⚖️ 상담 분야: ${metadata.specialty || industry || '미선택'}\n` +
            `📍 진행 단계: ${metadata.stage || '미선택'}\n` +
            `👤 의뢰인: ${cleanName}\n` +
            `📱 연락처: ${cleanPhone || '미기재'}\n` +
            `📧 이메일: ${cleanEmail}\n` +
            `📝 사건 요약: ${metadata.summary || '상세 사연 미기재'}\n` +
            `⏱ 신청일시: ${nowTime}\n\n` +
            `🔥 [수임 골든타임 10분] 지금 바로 의뢰인에게 유선 전화를 연결하여 방문 상담을 확정하세요!`
        } else if (leadType === 'ebook_order') {
          const bankName = process.env.NEXT_PUBLIC_BANK_NAME || '국민은행'
          const bankAccount = process.env.NEXT_PUBLIC_BANK_ACCOUNT || ''
          const bankHolder = process.env.NEXT_PUBLIC_BANK_HOLDER || ''
          const bankInfoStr = bankAccount ? `[${bankName} ${bankAccount} ${bankHolder}]` : '[등록 계좌 정보]'

          msg = `💰 [전자책 계좌이체 주문 접수 - ${toolSource.toUpperCase()}]\n\n` +
            `📚 상품명: ${metadata.bookTitle || '2026 변호사·세무사 네이버 상위 1% 인바운드 마케팅 실전 지침서 (PDF)'}\n` +
            `💵 결제금액: ${metadata.amount ? Number(metadata.amount).toLocaleString() + '원' : '39,000원'}\n` +
            `👤 입금자명: ${cleanName}\n` +
            `📧 수신 이메일: ${cleanEmail}\n` +
            `📱 연락처: ${cleanPhone || '미기재'}\n` +
            `🧾 증빙요청: ${taxDeductionText}\n` +
            `⏱ 신청일시: ${nowTime}\n\n` +
            `👉 ${bankInfoStr} 입금 확인 후 PDF 발송 및 홈택스 영수증/계산서를 발행하세요.`
        } else if (toolSource === 'place' || body.rewardName?.includes('플레이스')) {
          msg = `📍 [플레이스 1위 격차 심층 리포트 신청 - ${toolSource.toUpperCase()}]\n\n` +
            `🏢 상호명: ${placeSnapshot?.storeName || cleanName}\n` +
            `🎯 타깃 키워드: ${placeSnapshot?.targetKeyword || '미기재'}\n` +
            `📧 수신 이메일: ${cleanEmail}\n` +
            `📱 연락처: ${cleanPhone || '미기재'}\n` +
            `📊 산출 종합점수: ${placeSnapshot?.totalScore || 70}점\n` +
            `⏱ 신청일시: ${nowTime}\n\n` +
            `🔗 고객 발급 진단서: ${reportUrl}\n` +
            `👉 고객 이메일로 1:1 맞춤형 정량 실측 진단서가 자동 발송되었습니다.`
        } else if (leadType === 'inquiry') {
          msg = `📩 [고객센터 1:1 온라인 문의 접수 - ${toolSource.toUpperCase()}]\n\n` +
            `👤 성함/로펌: ${cleanName}\n` +
            `📱 연락처: ${cleanPhone || '미기재'}\n` +
            `📧 수신 이메일: ${cleanEmail}\n` +
            `📌 문의 유형: ${metadata.inquiryType || '일반 문의'}\n` +
            `📝 문의 내용:\n${metadata.message || '상세 내용 없음'}\n\n` +
            `⏱ 접수일시: ${nowTime}\n` +
            `👉 신속하게 확인 후 유선 연락 또는 이메일 회신을 진행하세요.`
        } else {
          msg = `🎁 [무료 리드 마그넷 신청 접수 - ${toolSource.toUpperCase()}]\n\n` +
            `📄 신청자료: ${metadata.docTitle || '[무료 퀵가이드] 네이버 플레이스 1위 세팅법 & 변호사·세무사 합법 수임 칼럼 템플릿 (PDF)'}\n` +
            `📧 수신 이메일: ${cleanEmail}\n` +
            `📱 연락처: ${cleanPhone || '미기재'}\n` +
            `⚖️ 업종/상호: ${industry || businessName || '일반'}\n` +
            `⏱ 신청일시: ${nowTime}\n\n` +
            `👉 신청 고객에게 맞춤 가이드북 PDF를 발송하세요.`
        }

        await fetch(`https://api.telegram.org/bot${tgToken.trim()}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: msg,
          }),
        })
      } catch (tgErr) {
        console.error('[Leads API Telegram Error]:', tgErr)
      }
    }

    // 2. Resend 이메일 발송 엔진 (고객 맞춤 리포트 발송 + 관리자 알림)
    // 🛡️ 동일 이메일 3분 쿨다운 체크 (Resend API 무료 한도 소진 및 메일 폭탄 악용 방어)
    const emailCoolDown = checkEmailCoolDown(cleanEmail, 180000)
    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@postsyncapp.com'

    if (resendKey && emailCoolDown.allowed) {
      try {
        // [플레이스 전용 엔진] 고객에게 1:1 맞춤형 실측 리포트 이메일 1초 자동 발송
        if (isPlaceLead && placeSnapshot) {
          const emailReport = generatePlaceReportEmailHtml(placeSnapshot, reportUrl)
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${resendKey.trim()}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'PostSync AI 진단센터 <contact@postsyncapp.com>',
              to: [cleanEmail],
              subject: emailReport.subject,
              html: emailReport.html,
            }),
          })
          console.log(`[Leads API] Place Report Email successfully dispatched to: ${cleanEmail}`)
        }

        // 관리자 알림 이메일 발송
        let subject = `[신규 리드] ${cleanEmail} - ${toolSource} 가이드북 신청`
        let titleText = '신규 리드 마그넷 신청'

        if (leadType === 'consulting') {
          subject = `🚨 [사건 진단 접수] ${cleanName}님 (${cleanPhone}) - ${metadata.specialty || '법률 상담'}`
          titleText = '사건 1분 안심 진단 접수 (골든타임)'
        } else if (leadType === 'ebook_order') {
          subject = `[전자책 주문] ${cleanName}님 39,000원 계좌이체 신청 (${cleanEmail})`
          titleText = '전자책 무통장 입금 신청'
        } else if (leadType === 'inquiry') {
          subject = `📩 [고객 문의] ${cleanName}님 - ${metadata.inquiryType || '온라인 문의 접수'}`
          titleText = '고객센터 1:1 온라인 문의 접수'
        } else if (isPlaceLead) {
          subject = `📍 [플레이스 진단] ${placeSnapshot?.storeName || cleanName} (${placeSnapshot?.targetKeyword || ''}) 리포트 발급`
          titleText = '플레이스 1위 격차 진단서 자동 발급'
        }

        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'PostSync 알림 <contact@postsyncapp.com>',
            to: [adminEmail],
            subject: subject,
            html: `
              <div style="font-family: sans-serif; font-size: 15px; line-height: 1.7; color: #334155; padding: 20px;">
                <h2 style="color: #1e3a8a;">🔔 ${escapeHtml(titleText)}</h2>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p><strong>유입 출처:</strong> ${escapeHtml(toolSource)}</p>
                  <p><strong>이름/상호명:</strong> ${escapeHtml(cleanName)}</p>
                  <p><strong>이메일:</strong> ${escapeHtml(cleanEmail)}</p>
                  <p><strong>연락처:</strong> ${escapeHtml(cleanPhone || '미기재')}</p>
                  ${metadata.inquiryType ? `<p><strong>문의 유형:</strong> ${escapeHtml(metadata.inquiryType)}</p>` : ''}
                  ${metadata.message ? `<div style="margin-top:12px; padding:12px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; white-space:pre-wrap;"><strong>문의 내용:</strong><br/>${escapeHtml(String(metadata.message))}</div>` : ''}
                  ${isPlaceLead ? `<p><strong>🔗 발급 리포트 링크:</strong> <a href="${reportUrl}">${escapeHtml(reportUrl)}</a></p>` : ''}
                  <p><strong>증빙 요청:</strong> ${escapeHtml(taxDeductionText)}</p>
                  <p><strong>신청 일시:</strong> ${escapeHtml(nowTime)}</p>
                  ${metadata.amount ? `<p><strong>주문 금액:</strong> ${Number(metadata.amount).toLocaleString()}원</p>` : ''}
                </div>
              </div>
            `,
          }),
        })
      } catch (resendErr) {
        console.error('[Leads API Resend Error]:', resendErr)
      }
    } else if (!emailCoolDown.allowed) {
      console.log(`[Leads API] 쿨다운 제한으로 중복 이메일 발송 건너뜀: ${cleanEmail} (남은 시간: ${emailCoolDown.remainingSec}초)`)
    }

    // 3. PostgreSQL leads 테이블에 암호화 보존 (헌법 제6조 컴플라이언스 준수)
    let savedLeadId: string | null = null
    try {
      const encryptedEmail = safeEncrypt(cleanEmail) || cleanEmail
      const encryptedPhone = cleanPhone ? safeEncrypt(cleanPhone) : null

      const createdLead = await prisma.lead.create({
        data: {
          toolSource: String(toolSource),
          leadType: String(leadType),
          email: encryptedEmail,
          phone: encryptedPhone,
          businessName: cleanName || null,
          industry: metadata.specialty || industry || null,
          location: metadata.location || null,
          status: 'NEW',
          metadata: {
            ...metadata,
            targetUserId: resolvedTargetUserId,
            clientName: cleanName,
            clientPhone: encryptedPhone,
            cleanEmail: encryptedEmail,
            earlyBirdKakaoAlert: Boolean(body.details?.kakao_alert_opt_in || metadata?.kakao_alert_opt_in),
            taxDeductionText,
            reportId: isPlaceLead ? reportSlug : undefined,
            reportSnapshot: placeSnapshot || undefined,
            webReportUrl: isPlaceLead ? reportUrl : undefined,
            jevTriage: jevTriage ? {
              isUrgent: jevTriage.isUrgent,
              urgencyScore: jevTriage.urgencyScore,
              retainerTier: jevTriage.retainerTier,
              retainerAmountLabel: jevTriage.retainerAmountLabel,
              recommendedAction: jevTriage.recommendedAction,
              actionText: jevTriage.actionText,
              confidence: jevTriage.confidence,
              model: jevTriage.model
            } : null,
          }
        }
      })
      savedLeadId = createdLead.id
      console.log(`[Leads API] Lead successfully saved to DB: ${savedLeadId}`)
    } catch (dbErr) {
      console.error('[Leads API] DB save error (continuing response):', dbErr)
    }

    return NextResponse.json({
      success: true,
      message: leadType === 'inquiry'
        ? '문의가 정상적으로 접수되었습니다. 전담 매니저가 확인 후 4시간 이내에 회신드리겠습니다.'
        : leadType === 'ebook_order'
          ? '입금 신청이 정상 접수되었습니다. 입금 확인 후 기재하신 이메일로 전자책이 즉시 발송됩니다.'
          : isPlaceLead
            ? '🎉 플레이스 1위 격차 실측 진단서가 발급되었습니다. 기재하신 이메일로도 상세 리포트가 발송되었습니다.'
            : '신청이 정상 완료되었습니다. 기재하신 이메일로 가이드북이 순차 발송됩니다.',
      email: cleanEmail,
      leadType,
      leadId: savedLeadId,
      reportId: isPlaceLead ? reportSlug : undefined,
      reportUrl: isPlaceLead ? `/report/place-audit.html?id=${reportSlug}` : undefined,
      triage: jevTriage,
    })
  } catch (err: any) {
    console.error('[Leads API Exception]:', err)
    return NextResponse.json(
      { error: err.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    )
  }
}
