'use client'

import { useState } from 'react'
import * as PortOne from '@portone/browser-sdk/v2'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle2, Zap, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

interface BillingClientProps {
  userId: string;
  email: string;
  planType: string;
  credits: number;
}

export default function BillingClient({ userId, email, planType, credits }: BillingClientProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handlePayment = async (plan: 'pro' | 'agency', amount: number) => {
    setLoading(true)
    
    try {
      // 1. 주문번호 생성 (실무에서는 백엔드에서 채번)
      const paymentId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      
      // 2. 포트원 결제창 호출 (테스트 환경에서는 실제 결제 없이 샌드박스로 동작)
      let paymentIdToVerify = paymentId;
      
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY
      
      if (channelKey) {
        // V2 SDK 기준 requestPayment 호출
        const response = await PortOne.requestPayment({
          storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID || '', 
          channelKey: channelKey,
          paymentId,
          orderName: `LocalSEO AI - ${plan.toUpperCase()} 요금제`,
          totalAmount: amount,
          currency: 'KRW',
          payMethod: 'CARD',
          customer: {
            customerId: userId,
            email: email,
          }
        })

        if (response?.code !== undefined) {
          // 결제 실패 또는 취소
          toast({
            title: '결제 취소',
            description: response.message || '결제가 취소되었거나 실패했습니다.',
            variant: 'destructive'
          })
          setLoading(false)
          return
        }
        paymentIdToVerify = response?.paymentId || paymentId;
      } else {
        // API 키가 없는 데모 환경일 경우 가상 결제 진행
        await new Promise(resolve => setTimeout(resolve, 1500))
        toast({
          title: '테스트 모드',
          description: 'PortOne 연동 키가 없어 가상 결제로 진행됩니다.'
        })
      }

      // 3. 결제 성공 시 서버 검증 및 DB 업데이트 요청
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentIdToVerify,
          plan: plan
        })
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: '결제 성공! 🎉',
          description: `${plan.toUpperCase()} 요금제로 업그레이드 되었습니다.`
        })
        router.refresh()
      } else {
        throw new Error(data.error || '결제 검증 실패')
      }
      
    } catch (error: any) {
      console.error('Payment error:', error)
      toast({
        title: '오류 발생',
        description: error.message || '결제 처리 중 문제가 발생했습니다.',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getPlanName = () => {
    if (planType === 'pro') return 'Pro (월 100회)'
    if (planType === 'agency') return 'Agency (무제한)'
    return 'Free (기본 제공)'
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      
      {/* 현재 상태 카드 */}
      <Card className="border-slate-200 shadow-sm flex flex-col">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-500" />
            나의 이용 현황
          </CardTitle>
          <CardDescription>현재 사용 중인 플랜과 남은 크레딧입니다.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-500 mb-1">현재 요금제</p>
            <p className="text-3xl font-bold text-slate-900">{getPlanName()}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-slate-500 mb-2 flex justify-between">
              <span>남은 AI 포스팅 횟수</span>
              <span className="font-bold text-indigo-600">{credits}회</span>
            </p>
            <div className="w-full bg-slate-100 rounded-full h-3">
              <div 
                className="bg-indigo-500 h-3 rounded-full transition-all duration-500" 
                style={{ width: `${Math.min((credits / 100) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
              {planType === 'free' ? '무료 제공량 초과 시 결제가 필요합니다.' : '크레딧은 매월 1일 초기화됩니다.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 결제 업그레이드 카드 */}
      <Card className="border-slate-200 shadow-sm flex flex-col">
        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
          <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            요금제 업그레이드
          </CardTitle>
          <CardDescription className="text-indigo-700/70">더 많은 기능과 크레딧이 필요하신가요?</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex-1 space-y-4">
          <div className="p-4 border border-indigo-100 rounded-xl bg-white hover:border-indigo-300 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg text-slate-900">Pro 요금제</h4>
              <span className="font-extrabold text-indigo-600">₩49,000<span className="text-sm font-normal text-slate-500">/월</span></span>
            </div>
            <ul className="space-y-1 mb-4">
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 월 100회 포스팅 (매일 3개)</li>
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 최고급 모델 (Claude 5) 무제한</li>
            </ul>
            <Button 
              onClick={() => handlePayment('pro', 49000)} 
              disabled={loading || planType === 'pro'}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : planType === 'pro' ? '현재 이용 중' : 'Pro 결제하기 (테스트)'}
            </Button>
          </div>

          <div className="p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg text-slate-900">Agency 요금제</h4>
              <span className="font-extrabold text-slate-700">₩99,000<span className="text-sm font-normal text-slate-500">/월</span></span>
            </div>
            <ul className="space-y-1 mb-4">
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-slate-400" /> 무제한 AI 포스팅 생성</li>
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-slate-400" /> 모든 기능 무제한 및 API 연동</li>
            </ul>
            <Button 
              variant="outline"
              onClick={() => handlePayment('agency', 99000)} 
              disabled={loading || planType === 'agency'}
              className="w-full"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : planType === 'agency' ? '현재 이용 중' : 'Agency 결제하기 (테스트)'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
