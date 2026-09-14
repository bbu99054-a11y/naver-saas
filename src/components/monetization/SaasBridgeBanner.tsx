'use client'

import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

interface SaasBridgeBannerProps {
  toolName?: string
  className?: string
}

export default function SaasBridgeBanner({
  toolName = '이 작업',
  className = ''
}: SaasBridgeBannerProps) {
  return (
    <div
      className={`bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 border-2 border-blue-200/80 rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-lg transition-all relative overflow-hidden ${className}`}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold tracking-wide shadow-sm">
          <Zap className="w-3 h-3 fill-white" /> AI 자동화 솔루션
        </span>
        <span className="text-[11px] text-blue-700 font-bold">PostSync AI Cloud</span>
      </div>

      <h4 className="text-base sm:text-lg font-black text-slate-900 leading-snug mb-2">
        매일 수작업하지 마세요.<br />
        키워드 1개로 전문직 블로그 칼럼 1초 완성
      </h4>

      <p className="text-xs text-slate-600 leading-relaxed mb-4">
        네이버 스마트블록 알고리즘과 2026 법정 광고 규정을 100% 준수한 고품질 칼럼을 AI가 원클릭으로 작성하고 네이버 블로그에 즉시 발행합니다.
      </p>

      <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-700 font-semibold mb-4">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>광고법 금칙어 원천 차단</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>네이버 원클릭 복사 서식</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>정예 8종 벤토 인포그래픽</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>가입 즉시 3편 무료 작성</span>
        </div>
      </div>

      <Link
        href="/dashboard/write"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        PostSync AI 7일 무료체험 시작하기
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
