'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { XCircle, Loader2 } from 'lucide-react'

function FailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const message = searchParams.get('message') || '결제가 사용자에 의해 취소되었거나 실패했습니다.'
  const code = searchParams.get('code') || 'UNKNOWN_ERROR'

  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-24 text-center bg-white rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto mt-8">
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <XCircle className="w-12 h-12 text-red-500" />
      </div>
      <h2 className="text-3xl font-extrabold text-slate-900 mb-4">결제 실패</h2>
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 mb-8 max-w-md w-full">
        <p className="text-slate-700 font-medium">{message}</p>
        <p className="text-sm text-slate-400 mt-2">에러 코드: {code}</p>
      </div>
      
      <div className="flex gap-4">
        <Button 
          onClick={() => router.push('/dashboard/billing')} 
          className="bg-slate-800 hover:bg-slate-900 text-white h-12 px-6 font-bold"
        >
          다시 결제 시도하기
        </Button>
        <Button 
          onClick={() => router.push('/dashboard')} 
          variant="outline" 
          className="h-12 px-6"
        >
          대시보드 홈
        </Button>
      </div>
    </div>
  )
}

export default function FailPage() {
  return (
    <Suspense fallback={<div className="p-24 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-slate-400" /></div>}>
      <FailContent />
    </Suspense>
  )
}
