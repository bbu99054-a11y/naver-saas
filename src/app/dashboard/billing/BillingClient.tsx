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
  const router = useRouter()

  const handlePayment = (plan: 'basic' | 'pro', amount: number) => {
    router.push(`/dashboard/billing/checkout?plan=${plan}&amount=${amount}`)
  }

  const getPlanName = () => {
    if (planType === 'pro') return 'Pro (월 149,000원)'
    if (planType === 'basic') return 'Basic (월 49,000원)'
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
                style={{ width: `${Math.min((credits / (planType === 'pro' ? 30 : 10)) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-2 text-right">
              {planType === 'free' ? '무료 제공량 초과 시 결제가 필요합니다.' : '크레딧 충전은 실시간 반영됩니다.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 결제 업그레이드 카드 */}
      <Card className="border-slate-200 shadow-sm flex flex-col">
        <CardHeader className="bg-indigo-50 border-b border-indigo-100">
          <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            크레딧 충전하기
          </CardTitle>
          <CardDescription className="text-indigo-700/70">가장 스마트한 상위노출, 지금 시작하세요.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex-1 space-y-4">
          <div className="p-4 border border-slate-200 rounded-xl bg-white hover:border-slate-300 transition-colors">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg text-slate-900">Basic 플랜</h4>
              <span className="font-extrabold text-slate-700">₩49,000</span>
            </div>
            <ul className="space-y-1 mb-4">
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-slate-400" /> 10 크레딧 충전</li>
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-slate-400" /> 주 2회 포스팅 생명력 유지</li>
            </ul>
            <Button 
              variant="outline"
              onClick={() => handlePayment('basic', 49000)} 
              className="w-full font-bold cursor-pointer hover:bg-slate-50"
            >
              Basic 무통장 입금 신청 (₩49,000)
            </Button>
          </div>

          <div className="relative p-5 border-2 border-indigo-500 rounded-xl bg-gradient-to-b from-white to-indigo-50/30 shadow-md">
            <div className="absolute -top-3 right-4 bg-gradient-to-r from-amber-500 to-indigo-600 text-white text-[11px] font-black px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <span>🔥 선착순 10명 한정 (잔여 3자리)</span>
            </div>
            <div className="flex justify-between items-baseline mb-1">
              <h4 className="font-extrabold text-lg text-slate-900">Pro 플랜</h4>
              <div className="flex items-baseline gap-1.5">
                <span className="text-slate-400 line-through text-xs font-bold">₩149,000</span>
                <span className="font-black text-indigo-600 text-xl">₩74,500</span>
                <span className="text-xs text-indigo-700 font-bold">/ 월</span>
              </div>
            </div>
            <p className="text-[11px] text-indigo-800/80 mb-3 font-medium">
              * 최초 결제 후 구독 유지 시 <strong>평생 ₩74,500으로 영구 자동 갱신</strong>됩니다.
            </p>
            <ul className="space-y-1.5 mb-4 text-xs text-slate-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> <strong>월 30 크레딧 충전</strong> (매일 1위 상위 노출)</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> 1080px 실사 인포그래픽 카드 자동 생성</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" /> 워드프레스 · 티스토리 원클릭 동시 발행</li>
            </ul>
            <Button 
              onClick={() => handlePayment('pro', 74500)} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 shadow-md shadow-indigo-200 cursor-pointer"
            >
              Pro 50% 특가 입금 신청 (₩74,500)
            </Button>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              * 무통장 입금 신청 즉시 입금 계좌 안내 및 세금계산서/현금영수증 발행 지원
            </p>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
