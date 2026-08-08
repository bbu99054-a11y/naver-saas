import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { paymentKey, orderId, amount, plan } = body

    // 1. 토스페이먼츠 승인(Confirm) API 호출
    const secretKey = process.env.TOSS_SECRET_KEY || 'test_sk_Z1aOwX7K8m2Yvq7Kx17yQxRvBDPn'
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
        amount,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Toss Payments Confirm Error:', errorData)
      return NextResponse.json({ error: '결제 승인 실패', details: errorData }, { status: 400 })
    }

    const paymentData = await response.json()

    // 2. DB 업데이트: PaymentHistory 생성 및 User 크레딧 증가
    // Basic: 49000원 -> +10 크레딧
    // Pro: 149000원 -> +30 크레딧
    const addedCredits = plan === 'pro' ? 30 : 10
    
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
