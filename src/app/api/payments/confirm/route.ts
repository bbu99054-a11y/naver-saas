import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

// 서버 공인 요금제 및 가격 정책 (Price Tampering 방지)
const PLAN_CONFIG: Record<string, { amount: number; credits: number }> = {
  basic: { amount: 49000, credits: 10 },
  pro: { amount: 149000, credits: 30 },
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { paymentKey, orderId, amount, plan } = body

    if (!paymentKey || !orderId || !amount || !plan) {
      return NextResponse.json({ error: '필수 결제 파라미터가 누락되었습니다.' }, { status: 400 })
    }

    // 1. 결제 금액 및 요금제 정합성 엄격 검증 (Price Tampering Prevention)
    const validPlan = PLAN_CONFIG[plan]
    if (!validPlan || validPlan.amount !== Number(amount)) {
      console.error(`[Security Alert] 결제 금액 위변조 감지: plan=${plan}, requestedAmount=${amount}, expectedAmount=${validPlan?.amount}`)
      return NextResponse.json({ error: '비정상적인 결제 요청입니다. 결제 금액이 일치하지 않습니다.' }, { status: 400 })
    }

    // 2. 토스페이먼츠 승인(Confirm) API 호출
    const secretKey = process.env.TOSS_SECRET_KEY || (process.env.NODE_ENV !== 'production' ? 'test_sk_Z1aOwX7K8m2Yvq7Kx17yQxRvBDPn' : '')
    if (!secretKey) {
      throw new Error('서버 결제 환경변수(TOSS_SECRET_KEY)가 설정되지 않았습니다.')
    }
    const encryptedSecretKey = Buffer.from(`${secretKey}:`).toString('base64')

    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${encryptedSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount: validPlan.amount,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Toss Payments Confirm Error:', errorData)
      return NextResponse.json({ error: '결제 승인 실패', details: errorData }, { status: 400 })
    }

    const paymentData = await response.json()

    // 3. DB 업데이트: PaymentHistory 생성 및 User 크레딧 증가
    const addedCredits = validPlan.credits
    
    await prisma.$transaction([
      prisma.paymentHistory.create({
        data: {
          user_id: user.id,
          order_id: orderId,
          payment_key: paymentKey,
          amount: amount,
          status: 'DONE',
          plan_type: plan,
          receipt_url: paymentData.receipt?.url || null,
          completed_at: new Date(),
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          credits: { increment: addedCredits },
          plan_type: plan,
        }
      })
    ])

    return NextResponse.json({ success: true, paymentData })
  } catch (error: any) {
    console.error('Payment confirm exception:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
