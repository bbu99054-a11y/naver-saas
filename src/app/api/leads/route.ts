import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { triageConsultLead, LeadTriageResult } from '@/lib/ai/jevClient'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      toolSource = 'unknown',
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

    // 1. Telegram 실시간 알림 발송 (대표님 텔레그램 봇)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN || '8314703344:AAGoFyPTWjHCRjPWq32Pdq0dti0TG8zZahE'
    const tgChatId = process.env.TELEGRAM_CHAT_ID || '8650197247'

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
          msg = `💰 [전자책 계좌이체 주문 접수 - ${toolSource.toUpperCase()}]\n\n` +
            `📚 상품명: ${metadata.bookTitle || '2026 변호사·세무사 네이버 상위 1% 인바운드 마케팅 실전 지침서 (PDF)'}\n` +
            `💵 결제금액: ${metadata.amount ? Number(metadata.amount).toLocaleString() + '원' : '39,000원'}\n` +
            `👤 입금자명: ${cleanName}\n` +
            `📧 수신 이메일: ${cleanEmail}\n` +
            `📱 연락처: ${cleanPhone || '미기재'}\n` +
            `🧾 증빙요청: ${taxDeductionText}\n` +
            `⏱ 신청일시: ${nowTime}\n\n` +
            `👉 [국민은행 93043922640 유영무] 입금 확인 후 PDF 발송 및 홈택스 영수증/계산서를 발행하세요.`
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

    // 2. Resend 관리자 알림 이메일 (환경변수 설정 시)
    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@postsyncapp.com'

    if (resendKey) {
      try {
        let subject = `[신규 리드] ${cleanEmail} - ${toolSource} 가이드북 신청`
        let titleText = '신규 리드 마그넷 신청'

        if (leadType === 'consulting') {
          subject = `🚨 [사건 진단 접수] ${cleanName}님 (${cleanPhone}) - ${metadata.specialty || '법률 상담'}`
          titleText = '사건 1분 안심 진단 접수 (골든타임)'
        } else if (leadType === 'ebook_order') {
          subject = `[전자책 주문] ${cleanName}님 39,000원 계좌이체 신청 (${cleanEmail})`
          titleText = '전자책 무통장 입금 신청'
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
                <h2 style="color: #1e3a8a;">🔔 ${titleText}</h2>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p><strong>유입 출처:</strong> ${toolSource}</p>
                  <p><strong>이름/입금자명:</strong> ${cleanName}</p>
                  <p><strong>이메일:</strong> ${cleanEmail}</p>
                  <p><strong>연락처:</strong> ${cleanPhone || '미기재'}</p>
                  <p><strong>증빙 요청:</strong> ${taxDeductionText}</p>
                  <p><strong>신청 일시:</strong> ${nowTime}</p>
                  ${metadata.amount ? `<p><strong>주문 금액:</strong> ${Number(metadata.amount).toLocaleString()}원</p>` : ''}
                </div>
              </div>
            `,
          }),
        })
      } catch (resendErr) {
        console.error('[Leads API Resend Error]:', resendErr)
      }
    }

    // 3. PostgreSQL leads 테이블에 영구 보존
    let savedLeadId: string | null = null
    try {
      const createdLead = await prisma.lead.create({
        data: {
          toolSource: String(toolSource),
          leadType: String(leadType),
          email: cleanEmail,
          phone: cleanPhone || null,
          businessName: cleanName || null,
          industry: metadata.specialty || industry || null,
          location: metadata.location || null,
          status: 'NEW',
          metadata: {
            ...metadata,
            targetUserId: resolvedTargetUserId,
            clientName: cleanName,
            clientPhone: cleanPhone,
            cleanEmail,
            taxDeductionText,
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
      message: leadType === 'ebook_order'
        ? '입금 신청이 정상 접수되었습니다. 입금 확인 후 기재하신 이메일로 전자책이 즉시 발송됩니다.'
        : '신청이 정상 완료되었습니다. 기재하신 이메일로 가이드북이 순차 발송됩니다.',
      email: cleanEmail,
      leadType,
      leadId: savedLeadId,
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
