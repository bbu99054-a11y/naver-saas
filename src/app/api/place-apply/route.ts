import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, location, industry, leadId } = body

    if (!name || !email) {
      return NextResponse.json({ error: '상호명과 이메일 주소는 필수 입력 사항입니다.' }, { status: 400 })
    }

    const cleanName = String(name).trim()
    const cleanEmail = String(email).trim().toLowerCase()
    const targetIndustry = industry || (cleanName.includes('세무') || cleanName.includes('회계') ? '세무' : (cleanName.includes('치과') ? '치과' : (cleanName.includes('학원') ? '학원' : '변호사')))
    const nowTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })

    // 1. Telegram Notification to Representative
    const tgToken = process.env.TELEGRAM_BOT_TOKEN
    const tgChatId = process.env.TELEGRAM_CHAT_ID

    if (tgToken && tgChatId) {
      try {
        const msg = `🔔 [플레이스 분석 신규 신청 접수 - postsyncapp.com]\n\n🏢 상호명: ${cleanName}\n📧 수신처: ${cleanEmail}\n📍 상권/업종: ${location || '반경 2km'} (${targetIndustry})\n⏱ 접수일시: ${nowTime}\n\n👉 신청 고객에게 naver_place 파이프라인으로 리포트를 발송하려면 승인하세요.`
        await fetch(`https://api.telegram.org/bot${tgToken.trim()}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: tgChatId, text: msg })
        })
      } catch (e) {
        console.error('[Place Apply Telegram Error]:', e)
      }
    }

    // 2. Resend Admin Email Alert (if RESEND_API_KEY is configured in Vercel)
    const resendKey = process.env.RESEND_API_KEY
    const adminEmail = process.env.ADMIN_EMAIL || 'contact@postsyncapp.com'

    if (resendKey) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey.trim()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'PostSync 알림 <contact@postsyncapp.com>',
            to: [adminEmail],
            subject: `[신청 접수] ${cleanName} (${cleanEmail}) 반경 2km 플레이스 분석 요청`,
            html: `
              <div style="font-family: sans-serif; font-size: 15px; line-height: 1.7; color: #334155;">
                <h2 style="color: #1e3a8a;">🔔 신규 플레이스 분석 신청 접수</h2>
                <p>postsyncapp.com 공식 가이드 페이지에서 고객이 리포트를 신청했습니다.</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
                  <p><strong>🏢 상호명:</strong> ${cleanName}</p>
                  <p><strong>📧 수신 이메일:</strong> ${cleanEmail}</p>
                  <p><strong>📍 상권/업종:</strong> ${location || '반경 2km'} (${targetIndustry})</p>
                  <p><strong>⏱ 접수 일시:</strong> ${nowTime}</p>
                </div>
                <p>로컬 PC의 PostSync 또는 naver_place 파이프라인에서 발송을 승인해 주세요.</p>
              </div>
            `
          })
        })
      } catch (e) {
        console.error('[Place Apply Resend Error]:', e)
      }
    }

    console.log(`[Place Apply Success] ${cleanName} (${cleanEmail}) at ${nowTime}`)

    return NextResponse.json({
      success: true,
      message: '성공적으로 신청되었습니다. 담당 연구팀 검토 후 리포트가 발송됩니다.',
      name: cleanName,
      email: cleanEmail
    })
  } catch (err: any) {
    console.error('Place Apply API Exception:', err)
    return NextResponse.json({ error: err.message || '서버 오류가 발생했습니다.' }, { status: 500 })
  }
}
