'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')
  const plan = searchParams.get('plan') || 'basic'

  useEffect(() => {
    const confirmPayment = async () => {
      if (!paymentKey || !orderId || !amount) {
        setStatus('error')
        setErrorMessage('결제 정보가 올바르지 않습니다.')
        return
      }

      try {
        const response = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
            plan
          }),
        })

        if (response.ok) {
          setStatus('success')
        } else {
          const errorData = await response.json()
          setStatus('error')
          setErrorMessage(errorData.error || '결제 승인 중 오류가 발생했습니다.')
        }
      } catch (error) {
        setStatus('error')
        setErrorMessage('서버와 통신 중 오류가 발생했습니다.')
      }
    }

    confirmPayment()
  }, [paymentKey, orderId, amount, plan])

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">결제를 확인하고 있습니다...</h2>
        <p className="text-slate-500">창을 닫지 마세요. 최대 10초 정도 소요될 수 있습니다.</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-slate-900 mb-4">결제 승인 실패</h2>
        <p className="text-slate-600 mb-8">{errorMessage}</p>
        <Button onClick={() => router.push('/dashboard/billing')} variant="outline">
          결제 페이지로 돌아가기
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-24 text-center bg-white rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto mt-8">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-4">결제가 완료되었습니다! 🎉</h2>
      <p className="text-lg text-slate-600 mb-8">
        성공적으로 크레딧이 충전되었습니다. 이제 AI 포스팅을 마음껏 이용해 보세요.
      </p>
      
      <div className="flex gap-4">
        <Button 
          onClick={() => router.push('/dashboard/write')} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-6 font-bold"
        >
          포스팅 쓰러 가기
        </Button>
        <Button 
          onClick={() => router.push('/dashboard')} 
          variant="outline" 
          className="h-12 px-6"
        >
          대시보드 메인
        </Button>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-500" /></div>}>
      <SuccessContent />
    </Suspense>
  )
}
