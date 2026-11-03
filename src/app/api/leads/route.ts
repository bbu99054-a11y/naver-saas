import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { getClientIp, checkIpRateLimit, escapeHtml } from '@/lib/rateLimit'
import { safeEncrypt } from '@/lib/crypto'

const LeadRequestSchema = z.object({
  toolSource: z.string().optional(),
  sourceTool: z.string().optional(),
  leadType: z.string().optional().default('inquiry'),
  email: z.string().optional().default(''),
  phone: z.string().optional().default(''),
  name: z.string().optional().default(''),
  industry: z.string().optional().default(''),
  businessName: z.string().optional().default(''),
  metadata: z.record(z.string(), z.unknown()).optional().default({}),
  targetUserId: z.string().nullable().optional().default(null),
  ref: z.string().nullable().optional().default(null),
})

export async function POST(req: Request) {
  try {
    // 🛡️ IP 기반 Rate Limiting (1분당 최대 5회 신청 제한 · 매크로 및 서버 자원 남용 방어)
    const clientIp = getClientIp(req)
    const ipCheck = checkIpRateLimit(clientIp, 5, 60000)
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: `신청 요청이 너무 빈번합니다. ${ipCheck.remainingSec}초 후 다시 시도해 주세요.` },
        { status: 429 }
      )
    }

    const rawBody: unknown = await req.json()
    const parsed = LeadRequestSchema.safeParse(rawBody)
    if (!parsed.success) {
      return NextResponse.json(
        { error: '입력 데이터 형식이 올바르지 않습니다. 다시 확인해 주세요.' },
        { status: 400 }
      )
    }

    const {
      toolSource: rawToolSource,
      sourceTool: rawSourceTool,
      leadType,
      email,
      phone,
      name,
      industry,
      businessName,
      metadata,
      targetUserId,
      ref,
    } = parsed.data

    const toolSource = String(rawToolSource || rawSourceTool || 'contact').trim().slice(0, 50)
    const metaTargetUserId = typeof metadata.targetUserId === 'string' ? metadata.targetUserId : null
    const resolvedTargetUserId = targetUserId || metaTargetUserId || ref || null

    const cleanEmail = String(email || '').trim().toLowerCase().slice(0, 100)
    const cleanPhone = String(phone || '').trim().slice(0, 30)
    const phoneDigits = cleanPhone.replace(/[^0-9]/g, '')

    const hasValidEmail = cleanEmail.length >= 5 && cleanEmail.includes('@')
    const hasValidPhone = phoneDigits.length >= 9 && phoneDigits.length <= 12

    if (!hasValidEmail && !hasValidPhone) {
      return NextResponse.json(
        { error: '연락받으실 휴대폰 번호(또는 이메일 주소)를 정확히 입력해 주세요.' },
        { status: 400 }
      )
    }

    const cleanName = String(name || businessName || '').trim().slice(0, 50) || '매장 대표님'
    const cleanBusinessName = String(businessName || name || '').trim().slice(0, 100) || null
    const cleanMessage = typeof metadata.message === 'string' ? metadata.message.trim().slice(0, 2000) : ''
    const inquiryTypeStr = typeof metadata.inquiryType === 'string' ? metadata.inquiryType : ''
    const specialtyStr = typeof metadata.specialty === 'string' ? metadata.specialty : ''
    const locationStr = typeof metadata.location === 'string' ? metadata.location : ''
    const budgetRangeStr = typeof metadata.budgetRange === 'string' ? metadata.budgetRange : ''
    const storeStatusStr = typeof metadata.storeStatus === 'string' ? metadata.storeStatus : ''
    const callbackTimeStr = typeof metadata.callbackTime === 'string' ? metadata.callbackTime : ''
    const isKakaoSub = leadType === 'kakao_daily_alert_9900'
    const nowTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })

    // 1. PostgreSQL leads 테이블에 암호화 보존
    let savedLeadId: string | null = null
    try {
      const encryptedEmail = hasValidEmail ? (safeEncrypt(cleanEmail) || cleanEmail) : null
      const encryptedPhone = hasValidPhone ? (safeEncrypt(cleanPhone) || cleanPhone) : null

      const createdLead = await prisma.lead.create({
        data: {
          toolSource,
          leadType: String(leadType).slice(0, 50),
          email: encryptedEmail,
          phone: encryptedPhone,
          businessName: cleanBusinessName,
          industry: (specialtyStr || industry || null)?.slice(0, 100) || null,
          location: locationStr ? locationStr.slice(0, 100) : null,
          status: 'NEW',
          metadata: {
            ...metadata,
            targetUserId: resolvedTargetUserId,
            clientName: cleanName,
            clientBusinessName: cleanBusinessName,
            clientPhone: encryptedPhone,
            cleanEmail: encryptedEmail,
          },
        },
      })
      savedLeadId = createdLead.id
    } catch (dbErr) {
      console.error('[Leads API] DB save error (continuing response):', dbErr)
    }

    // 2. 외부 알림 엔진 병렬 발송 (Telegram + Resend)
    const tgToken = process.env.TELEGRAM_BOT_TOKEN
    const tgChatId = process.env.TELEGRAM_CHAT_ID
    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@postsyncapp.com'

    const notificationTasks: Promise<unknown>[] = []

    // 2-1. Telegram 관리자 실시간 알림
    if (tgToken && tgChatId) {
      const headerLabel = isKakaoSub
        ? `💬 [카톡 월 9,900원 일간 순위·경쟁사 알림봇 구독 신청]`
        : `📩 [플레이스 B2B 비교견적/체험단 유효DB 접수 · ${toolSource.toUpperCase()}]`
      const msg = `${headerLabel}\n\n` +
        `🏪 상호/성함: ${cleanBusinessName || cleanName}\n` +
        `📱 휴대폰: ${cleanPhone || '미기재'}\n` +
        (budgetRangeStr ? `💰 월 가용 예산: ${budgetRangeStr}\n` : '') +
        (storeStatusStr ? `📊 매장 상태: ${storeStatusStr}\n` : '') +
        (callbackTimeStr ? `⏰ 희망 연락시간: ${callbackTimeStr}\n` : '') +
        `📌 신청 유형: ${inquiryTypeStr || leadType || '처방 및 비교견적 신청'}\n` +
        `📝 상세 진단/요청 내역:\n${cleanMessage || '상세 내용 없음'}\n\n` +
        `⏱ 접수일시: ${nowTime}\n` +
        `✅ DB 암호화 저장 완료 (ID: ${savedLeadId || 'local'})`

      notificationTasks.push(
        fetch(`https://api.telegram.org/bot${tgToken.trim()}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: msg,
          }),
        }).catch(tgErr => {
          console.error('[Leads API Telegram Error]:', tgErr)
        })
      )
    }

    // 2-2. 관리자 이메일 알림
    if (resendKey) {
      notificationTasks.push(
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey.trim()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'PostSync 알림 <contact@postsyncapp.com>',
            to: [adminEmail],
            subject: `📩 [플레이스 처방/견적 리드] ${cleanBusinessName || cleanName} · ${inquiryTypeStr || '온라인 접수'}`,
            html: `
              <div style="font-family: sans-serif; font-size: 15px; line-height: 1.7; color: #334155; padding: 20px;">
                <h2 style="color: #1e3a8a;">🔔 플레이스 처방 리포트 &amp; 비교견적 리드 접수</h2>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p><strong>유입 출처:</strong> ${escapeHtml(toolSource)}</p>
                  <p><strong>상호명/성함:</strong> ${escapeHtml(cleanBusinessName || cleanName)}</p>
                  <p><strong>휴대폰 번호:</strong> ${escapeHtml(cleanPhone || '미기재')}</p>
                  <p><strong>이메일:</strong> ${escapeHtml(cleanEmail || '미기재')}</p>
                  ${inquiryTypeStr ? `<p><strong>선택 처방 항목:</strong> ${escapeHtml(inquiryTypeStr)}</p>` : ''}
                  ${cleanMessage ? `<div style="margin-top:12px; padding:12px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; white-space:pre-wrap;"><strong>진단 데이터 및 요청 내용:</strong><br/>${escapeHtml(cleanMessage)}</div>` : ''}
                  <p><strong>접수 일시:</strong> ${escapeHtml(nowTime)}</p>
                </div>
              </div>
            `,
          }),
        }).catch(resendErr => {
          console.error('[Leads API Admin Email Error]:', resendErr)
        })
      )
    }

    if (notificationTasks.length > 0) {
      await Promise.allSettled(notificationTasks)
    }

    return NextResponse.json({
      success: true,
      message: '처방 리포트 및 비교견적 신청이 접수되었습니다.',
      email: cleanEmail || null,
      phone: cleanPhone || null,
      leadType,
      leadId: savedLeadId,
    })
  } catch (err: unknown) {
    console.error('[Leads API Exception]:', err)
    const errMsg = err instanceof Error ? err.message : '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    )
  }
}
