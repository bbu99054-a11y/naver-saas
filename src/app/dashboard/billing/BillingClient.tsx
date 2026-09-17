'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle2, Zap, ShieldCheck, Flame, Building2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BillingClientProps {
  userId: string;
  email: string;
  planType: string;
  credits: number;
}

export default function BillingClient({ userId, email, planType, credits }: BillingClientProps) {
  const router = useRouter()

  const handlePayment = (plan: 'starter' | 'pro' | 'enterprise', amount: number) => {
    router.push(`/dashboard/billing/checkout?plan=${plan}&amount=${amount}`)
  }

  const getPlanName = () => {
    if (planType === 'enterprise') return 'Firm Growth (월 399,000원)'
    if (planType === 'pro') return 'Pro-Pilot (월 199,000원)'
    if (planType === 'starter') return 'Starter (월 99,000원)'
    if (planType === 'basic') return 'Starter (월 99,000원)'
    return '무료 체험 중'
  }

  const getMaxCredits = () => {
    if (planType === 'enterprise') return 100
    if (planType === 'pro') return 35
    if (planType === 'starter') return 12
    return 3
  }

  return (
    <div className="space-y-8">
      
      {/* 상단 2단 그리드: 현황 & 세금계산서 안내 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* 나의 이용 현황 카드 */}
        <Card className="border-slate-200 shadow-sm flex flex-col bg-white">
          <CardHeader className="bg-slate-50/70 border-b border-slate-100">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-900">
              <Zap className="w-5 h-5 text-[#0284C7]" />
              나의 구독 및 크레딧 현황
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              현재 활성화된 요금제와 잔여 AI 생성 크레딧입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-center space-y-6">
            <div>
              <p className="text-xs font-semibold text-slate-400 mb-1">현재 적용 플랜</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-slate-900">{getPlanName()}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-[#0284C7]">
                  정상 이용 중
                </span>
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-slate-500 mb-2 flex justify-between">
                <span>잔여 전문 칼럼 생성 횟수</span>
                <span className="font-bold text-[#0284C7]">{credits}회 남음</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-[#0284C7] h-3 rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min((credits / getMaxCredits()) * 100, 100)}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-right">
                * 입금 확인 즉시 실시간으로 크레딧이 계정에 자동 충전됩니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 결제 보증 및 안내 카드 */}
        <Card className="border-sky-100 bg-sky-50/50 shadow-xs flex flex-col justify-between">
          <CardHeader className="border-b border-sky-100/80">
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-sky-950">
              <ShieldCheck className="w-5 h-5 text-[#0284C7]" />
              전문직 안심 결제 보장
            </CardTitle>
            <CardDescription className="text-xs text-sky-800/80">
              와이엠랩스는 세무/회계 투명성을 준수합니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-3 text-xs text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
              <span><strong>전자세금계산서 100% 즉시 발행:</strong> 무통장 입금 신청 시 사업자등록번호를 기재하시면 국세청으로 자동 발행됩니다.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
              <span><strong>미사용 크레딧 이월 보장:</strong> 당월에 다 쓰지 못한 크레딧은 소멸되지 않고 안전하게 유지됩니다.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
              <span><strong>광고 규정 위반 배상 안심:</strong> 전문직 법률 광고 가이드라인에 맞춘 금칙어 필터링이 100% 기본 작동합니다.</span>
            </div>
          </CardContent>
          <div className="p-4 bg-white/60 border-t border-sky-100 text-[11px] text-slate-500 rounded-b-xl">
            문의 및 대량 결제 상담: 카카오톡 채널 또는 고객센터 실시간 접수
          </div>
        </Card>
      </div>

      {/* 요금제 충전 선택 3단 카드 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">플랜 선택 및 크레딧 충전</h3>
            <p className="text-xs text-slate-500">사무소 규모에 맞는 최적의 플랜을 선택하세요.</p>
          </div>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            무통장 입금 전용 (세금계산서 발행)
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3 items-stretch">
          {/* Starter Plan */}
          <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-extrabold text-lg text-slate-900">Starter</h4>
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">1인 사무소</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">월 12회 전문 칼럼 + 기본 플레이스 관리</p>
              
              <div className="mb-4">
                <span className="font-black text-2xl text-slate-900">₩99,000</span>
                <span className="text-xs text-slate-500 font-medium"> / 월</span>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> <strong>월 12회 크레딧</strong> 충전</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> 플레이스 키워드 3개 순위 추적</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> 광고 법규 안심 체크</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> 1분 진단 폼 연동</li>
              </ul>
            </div>

            <Button 
              variant="outline"
              onClick={() => handlePayment('starter', 99000)} 
              className="w-full font-bold text-xs h-11 border-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              Starter 신청하기 (₩99,000)
            </Button>
          </div>

          {/* Pro-Pilot Plan (Hero) */}
          <div className="relative p-6 border-2 border-[#0284C7] rounded-2xl bg-white shadow-lg shadow-sky-100 flex flex-col justify-between">
            <div className="absolute -top-3 right-5 bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white text-[10px] font-black px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span>가장 인기 있는 플랜</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1 mt-1">
                <h4 className="font-black text-lg text-[#0284C7]">Pro-Pilot</h4>
                <span className="text-xs font-bold text-[#0284C7] bg-sky-50 px-2.5 py-0.5 rounded-full">주력 로펌 추천</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">매일 1위 수임 독점 + 정예 8종 벤토 카드</p>

              <div className="mb-4">
                <span className="font-black text-2xl text-slate-900">₩199,000</span>
                <span className="text-xs text-slate-500 font-medium"> / 월</span>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-700">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> <strong>월 35회 크레딧</strong> 충전 (매일 발행)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> 플레이스 <strong>15개 키워드 & 경쟁사 분석</strong></li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> <strong>정예 8종 벤토 인포그래픽</strong> 자동 생성</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> 의뢰인 상담 파이프라인 CRM 연동</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#0284C7] shrink-0" /> 1:1 맞춤 온보딩 지원</li>
              </ul>
            </div>

            <Button 
              onClick={() => handlePayment('pro', 199000)} 
              className="w-full bg-[#FF6B00] hover:bg-[#E56000] text-white font-black text-xs h-11 shadow-md shadow-orange-200 cursor-pointer"
            >
              Pro-Pilot 신청하기 (₩199,000)
            </Button>
          </div>

          {/* Firm Growth Plan */}
          <div className="p-6 border border-slate-200 rounded-2xl bg-white hover:border-slate-300 transition-all flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex justify-between items-center mb-1">
                <h4 className="font-extrabold text-lg text-slate-900">Firm Growth</h4>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">대형 법인</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">다지점 통합 관리 + 법인 전용 맞춤 RAG</p>

              <div className="mb-4">
                <span className="font-black text-2xl text-slate-900">₩399,000</span>
                <span className="text-xs text-slate-500 font-medium"> / 월</span>
              </div>

              <ul className="space-y-2 mb-6 text-xs text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> <strong>월 100회 크레딧</strong> 충전</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> <strong>지점 3곳 통합 & 키워드 50개</strong> 관리</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> 사무장/마케터 다중 계정 3개</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" /> 법인 승소사례 전용 RAG 구축</li>
              </ul>
            </div>

            <Button 
              variant="outline"
              onClick={() => handlePayment('enterprise', 399000)} 
              className="w-full font-bold text-xs h-11 border-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              Firm Growth 신청하기 (₩399,000)
            </Button>
          </div>
        </div>
      </div>
      
    </div>
  )
}
