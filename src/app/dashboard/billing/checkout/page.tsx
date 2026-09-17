'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CheckoutForm from './CheckoutForm'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedParams = await searchParams
  const planParam = (typeof resolvedParams.plan === 'string' ? resolvedParams.plan : 'starter') as 'starter' | 'pro' | 'enterprise' | 'basic'
  const rawAmount = typeof resolvedParams.amount === 'string' ? Number(resolvedParams.amount) : null
  
  const defaultAmount = planParam === 'enterprise' ? 399000 : planParam === 'pro' ? 199000 : 99000
  const amount = rawAmount || defaultAmount

  // 기본 계좌 정보 (환경변수 설정 시 최우선 반영)
  const bankInfo = {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || '국민은행',
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT || '93043922640',
    holder: process.env.NEXT_PUBLIC_BANK_HOLDER || '유영무',
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <CheckoutForm
        userEmail={user.email || ''}
        userName={user.user_metadata?.name || ''}
        plan={planParam}
        amount={amount}
        bankInfo={bankInfo}
      />
    </div>
  )
}
