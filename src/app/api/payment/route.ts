import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { paymentId, plan } = body

    if (!paymentId || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // [실무 참고] 
    // 실제 운영 환경에서는 클라이언트가 보낸 paymentId를 신뢰하지 않고,
    // PortOne 서버에 API를 찔러 결제 금액과 상태(paid)를 검증(Validation)해야 합니다.
    // 여기서는 MVP 테스트 단계이므로 결제가 성공했다고 가정하고 DB를 업데이트합니다.

    // 1. 크레딧 충전량 결정
    let addCredits = 0
    if (plan === 'pro') addCredits = 100
    else if (plan === 'agency') addCredits = 99999
    
    // 2. DB 업데이트
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        plan_type: plan,
        credits: {
          increment: addCredits
        }
      }
    })

    return NextResponse.json({ 
      success: true, 
      plan: updatedUser.plan_type,
      credits: updatedUser.credits
    })
    
  } catch (error: any) {
    console.error('Payment API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', message: error.message },
      { status: 500 }
    )
  }
}
