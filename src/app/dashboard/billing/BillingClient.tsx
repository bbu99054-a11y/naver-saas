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
              className="w-full font-bold"
            >
              Basic 충전하기
            </Button>
          </div>

          <div className="relative p-4 border-2 border-indigo-500 rounded-xl bg-white shadow-md">
            <div className="absolute -top-3 right-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
              가장 인기 ⭐️
            </div>
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-bold text-lg text-slate-900">Pro 플랜</h4>
              <span className="font-extrabold text-indigo-600">₩149,000</span>
            </div>
            <ul className="space-y-1 mb-4">
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 30 크레딧 충전 (3배)</li>
              <li className="flex items-center gap-2 text-sm text-slate-600"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> 매일 포스팅으로 C-Rank 노출</li>
            </ul>
            <Button 
              onClick={() => handlePayment('pro', 149000)} 
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200"
            >
              Pro 충전하기
            </Button>
          </div>
        </CardContent>
      </Card>
      
    </div>
  )
}
