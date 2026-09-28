'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, CheckCircle2, Zap, ShieldCheck, Flame, Building2, Sparkles } from 'lucide-react'
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
    if (planType === 'enterprise') return 'PostSync Pro 올인원 (대형)'
    if (planType === 'pro') return 'PostSync Pro 수임 OS (월 190,000원)'
    if (planType === 'starter' || planType === 'basic') return '기본 플랜'
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
              <span><strong>광고 규정 위반 배상 안심:</strong> 변호사법 제23조 광고 가이드라인에 맞춘 실시간 컴플라이언스 가드가 100% 기본 작동합니다.</span>
            </div>
          </CardContent>
          <div className="p-4 bg-white/60 border-t border-sky-100 text-[11px] text-slate-500 rounded-b-xl">
            문의 및 대형 로펌 다계정 맞춤 상담: 카카오톡 채널 또는 고객센터 실시간 접수
          </div>
        </Card>
      </div>

      {/* 요금제 충전: 단일 올인원 패스 카드 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-slate-900">PostSync Pro 수임 OS 플랜</h3>
            <p className="text-xs text-slate-500">외주비 300만 원을 대체하는 단 하나의 사건 수임 올인원 패스입니다.</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            전자세금계산서 100% 즉시 발행
          </span>
        </div>

        {/* 단일 올인원 패스 카드 (Hero Card) */}
        <div className="max-w-2xl mx-auto border-2 border-[#0284C7] rounded-3xl bg-white shadow-xl shadow-sky-100/70 overflow-hidden relative">
          <div className="bg-gradient-to-r from-[#0B1527] via-slate-900 to-[#0B1527] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-6 bg-[#FF6B00] text-white text-[11px] font-black px-3.5 py-1 rounded-b-xl shadow-md flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>단일 올인원 추천</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-sky-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>대한민국 1등 로펌 6대 엔진 통합 탑재</span>
            </div>

            <h4 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              PostSync Pro 수임 OS 올인원 패스
            </h4>
            <p className="text-xs text-slate-300 mt-1.5">
              월 35회 전문 칼럼 + 1080px 벤토 카드 + 투트랙 발행 + 1분 진단폼 + 법률 가드
            </p>

            <div className="mt-5 flex items-baseline justify-center gap-1.5">
              <span className="text-slate-400 line-through text-sm">월 3,000,000원 (대행사 외주비)</span>
              <span className="text-4xl font-black text-[#38BDF8] ml-2">₩190,000</span>
              <span className="text-slate-300 text-xs font-medium"> / 월 (VAT 포함)</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            <div className="grid sm:grid-cols-2 gap-3.5 text-xs text-slate-700 font-medium">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>월 35회 AI 전문 칼럼</strong> 생성 (매일 1편 안심 발행)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>정예 8종 벤토 인포그래픽 카드</strong> 자동 생성 (1080px)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>투트랙 네이버 발행</strong> (1초 자동 임시저장 + 무설치 복사)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>1분 안심 진단폼 CRM 연동</strong> (텔레그램 실시간 알림)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>변호사법 제23조 실시간 감시</strong> (금칙어 1-클릭 치환)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                <span><strong>플레이스 15개 키워드 & 경쟁사 분석</strong> 로컬 관제</span>
              </div>
            </div>

            <div className="pt-2">
              <Button 
                onClick={() => handlePayment('pro', 190000)} 
                className="w-full bg-[#FF6B00] hover:bg-[#E56000] text-white font-black text-sm h-13 rounded-2xl shadow-lg shadow-orange-200 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                🚀 Pro 수임 OS 올인원 패스 신청하기 (₩190,000)
              </Button>
              <p className="text-center text-[11px] text-slate-400 mt-2.5">
                * 입금 신청 즉시 전용 가상계좌 또는 법인 입금 계좌 및 세금계산서 발급 정보가 안내됩니다.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            🏢 3개 지점 이상 대형 로펌 다계정 맞춤 구축 및 전용 RAG는{' '}
            <a href="https://pf.kakao.com" target="_blank" rel="noopener noreferrer" className="text-[#0284C7] font-bold underline">
              고객센터 1:1 상담
            </a>
            을 이용해 주세요.
          </p>
        </div>
      </div>
      
    </div>
  )
}
