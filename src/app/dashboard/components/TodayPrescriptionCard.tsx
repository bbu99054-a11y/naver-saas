'use client'

import { useState } from 'react'
import { Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Zap, TrendingUp, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface PrescriptionData {
  urgencyLevel: 'HIGH' | 'MEDIUM'
  reason: string
  targetKeyword: string
  suggestedTopic: string
  competitorName: string
  expectedImpact: string
  caseQuote: string
}

const TODAY_PRESCRIPTION: PrescriptionData = {
  urgencyLevel: 'HIGH',
  reason: '경쟁 로펌 A가 [재산분할 기여도 판례] 글을 발행하여 내 순위가 5위 ➔ 7위로 2계단 밀렸습니다.',
  targetKeyword: '서초 이혼변호사 재산분할',
  suggestedTopic: '서초 이혼 재산분할 승소사례: 특유재산 분할 기여도 45% 인정 판례 분석',
  competitorName: '서초 B 로펌',
  expectedImpact: '오늘 발행 시 72시간 내 3위권 재진입 및 월 18건 상담 유출 방어',
  caseQuote: '대법원 2024다28419 판결 인용'
}

export function TodayPrescriptionCard() {
  const [completed, setCompleted] = useState(false)

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden">
      <div className="p-5 pb-3 bg-gradient-to-r from-[#E0F2FE]/60 via-sky-50/30 to-white flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
              AI Daily Prescription
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFF7ED] text-[#FF6B00]">
              긴급 방어 필요
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#0284C7]" />
            오늘의 1일 1처방 (순위 방어 액션)
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            순위 하락을 막기 위해 오늘 변호사님이 발행해야 할 최적의 주제입니다.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0369A1] text-[11px] font-bold">
          <Sparkles className="w-3 h-3 text-[#0284C7]" />
          <span>성공 확률 94%</span>
        </div>
      </div>

      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        {/* 원인 분석 알림 박스 */}
        <div className="p-3.5 rounded-xl bg-sky-50/50 text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 text-sky-950 font-semibold text-xs">
            <AlertTriangle className="w-3.5 h-3.5 text-[#FF6B00]" />
            <span>경쟁사 급상승 감지: {TODAY_PRESCRIPTION.competitorName}</span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            {TODAY_PRESCRIPTION.reason}
          </p>
        </div>

        {/* 오늘 추천할 맞춤 원고 카드 */}
        <div className="p-3.5 rounded-xl bg-slate-50/80 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-md">
              목표: {TODAY_PRESCRIPTION.targetKeyword}
            </span>
            <span className="text-slate-400 font-mono">
              {TODAY_PRESCRIPTION.caseQuote}
            </span>
          </div>

          <p className="text-xs font-bold text-slate-900 leading-snug">
            {TODAY_PRESCRIPTION.suggestedTopic}
          </p>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>기대 효과: {TODAY_PRESCRIPTION.expectedImpact}</span>
          </div>
        </div>

        {/* 하단 1-클릭 실행 버튼 (랜딩페이지 시그니처 오렌지 #FF6B00) */}
        <div className="pt-2 flex items-center gap-2">
          <Link 
            href={`/dashboard/write?topic=${encodeURIComponent(TODAY_PRESCRIPTION.suggestedTopic)}`}
            className="flex-1"
          >
            <Button
              className="w-full h-10 text-xs font-bold rounded-xl bg-[#FF6B00] hover:bg-[#E05D00] text-white shadow-sm gap-1.5 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              오늘 방어 칼럼 1초 만에 생성 ➔
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCompleted(!completed)}
            className={`h-10 px-3 text-xs font-semibold rounded-xl cursor-pointer transition-colors ${
              completed
                ? 'bg-emerald-50 text-emerald-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {completed ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 완료됨
              </span>
            ) : (
              '완료 체크'
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
