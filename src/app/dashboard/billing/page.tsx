import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { redirect } from 'next/navigation'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 최신 유저 정보 조회
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (!dbUser) {
    redirect('/login')
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">결제 및 크레딧 관리</h1>
        <p className="text-slate-500">현재 이용 중인 요금제와 남은 포스팅 횟수를 확인하고 충전하세요.</p>
      </div>

      <BillingClient 
        userId={dbUser.id}
        email={dbUser.email}
        planType={dbUser.plan_type}
        credits={dbUser.credits}
      />
    </div>
  )
}
