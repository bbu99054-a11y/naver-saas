import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getClientIp, checkIpRateLimit, escapeHtml } from '@/lib/rateLimit'
import { safeEncrypt } from '@/lib/crypto'

export async function POST(req: Request) {
  try {
    // 🛡️ IP 기반 Rate Limiting (1분당 최대 5회 신청 제한 - 매크로 및 서버 자원 남용 방어)
    const clientIp = getClientIp(req)
    const ipCheck = checkIpRateLimit(clientIp, 5, 60000)
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
      leadType = 'inquiry',
      email,
      phone = '',
      name = '',
      industry = '',
      businessName = '',
      metadata = {},
      targetUserId = null,
      ref = null,
    } = body

    const toolSource = String(rawToolSource || rawSourceTool || 'contact').trim().slice(0, 50)
    const resolvedTargetUserId = targetUserId || metadata.targetUserId || ref || null

    if (!email || !String(email).includes('@')) {
      return NextResponse.json(
        { error: '올바른 이메일 주소를 입력해 주세요.' },
        { status: 400 }
      )
    }

    const cleanEmail = String(email).trim().toLowerCase().slice(0, 100)
    const cleanPhone = String(phone).trim().slice(0, 30)
    const cleanName = String(name).trim().slice(0, 50) || '고객'
    const cleanBusinessName = String(businessName || name).trim().slice(0, 100) || null
    const nowTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })

    // 1. PostgreSQL leads 테이블에 암호화 보존
    let savedLeadId: string | null = null
    try {
      const encryptedEmail = safeEncrypt(cleanEmail) || cleanEmail
      const encryptedPhone = cleanPhone ? safeEncrypt(cleanPhone) : null

      const createdLead = await prisma.lead.create({
        data: {
          toolSource,
          leadType: String(leadType).slice(0, 50),
          email: encryptedEmail,
          phone: encryptedPhone,
          businessName: cleanBusinessName,
          industry: (metadata.specialty || industry || null)?.slice(0, 100) || null,
          location: metadata.location ? String(metadata.location).slice(0, 100) : null,
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

    const notificationTasks: Promise<any>[] = []

    // 2-1. Telegram 관리자 실시간 알림
    if (tgToken && tgChatId) {
      const msg = `📩 [온라인 문의/리드 접수 - ${toolSource.toUpperCase()}]\n\n` +
        `👤 성함/상호: ${cleanName}\n` +
        `📱 연락처: ${cleanPhone || '미기재'}\n` +
        `📧 이메일: ${cleanEmail}\n` +
        `📌 문의 유형: ${metadata.inquiryType || leadType || '일반 문의'}\n` +
        `📝 문의 내용:\n${metadata.message || '상세 내용 없음'}\n\n` +
        `⏱ 접수일시: ${nowTime}\n` +
        `👉 확인 후 신속하게 유선 연락 또는 이메일 회신을 진행하세요.`

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
            subject: `📩 [고객 문의] ${cleanName}님 - ${metadata.inquiryType || '온라인 문의 접수'}`,
            html: `
              <div style="font-family: sans-serif; font-size: 15px; line-height: 1.7; color: #334155; padding: 20px;">
                <h2 style="color: #1e3a8a;">🔔 고객 1:1 온라인 문의 접수</h2>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p><strong>유입 출처:</strong> ${escapeHtml(toolSource)}</p>
                  <p><strong>이름/상호명:</strong> ${escapeHtml(cleanName)}</p>
                  <p><strong>이메일:</strong> ${escapeHtml(cleanEmail)}</p>
                  <p><strong>연락처:</strong> ${escapeHtml(cleanPhone || '미기재')}</p>
                  ${metadata.inquiryType ? `<p><strong>문의 유형:</strong> ${escapeHtml(String(metadata.inquiryType))}</p>` : ''}
                  ${metadata.message ? `<div style="margin-top:12px; padding:12px; background:#ffffff; border:1px solid #cbd5e1; border-radius:6px; font-size:14px; white-space:pre-wrap;"><strong>문의 내용:</strong><br/>${escapeHtml(String(metadata.message))}</div>` : ''}
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
      message: '문의가 정상적으로 접수되었습니다. 전담 매니저가 확인 후 신속히 회신드리겠습니다.',
      email: cleanEmail,
      leadType,
      leadId: savedLeadId,
    })
  } catch (err: any) {
    console.error('[Leads API Exception]:', err)
    return NextResponse.json(
      { error: err.message || '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' },
      { status: 500 }
    )
  }
}
