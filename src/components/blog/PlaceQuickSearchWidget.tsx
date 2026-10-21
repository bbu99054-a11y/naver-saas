'use client'

import React, { useState } from 'react'
import { Search, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

interface PlaceQuickSearchWidgetProps {
  defaultKeyword?: string
  defaultTarget?: string
}

export default function PlaceQuickSearchWidget({
  defaultKeyword = '',
  defaultTarget = '',
}: PlaceQuickSearchWidgetProps) {
  const [keyword, setKeyword] = useState(defaultKeyword)
  const [target, setTarget] = useState(defaultTarget)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const kw = keyword.trim()
    const tgt = target.trim()

    if (!kw) {
      alert('확인할 키워드(예: 역삼역 카페)를 입력해 주세요.')
      return
    }

    setIsSubmitting(true)

    // GA4 이벤트 로깅 (설정된 경우)
    try {
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'click_blog_quick_search', {
          keyword: kw,
          target_store: tgt,
          source_page: window.location.pathname,
        })
      }
    } catch {
      // ignore
    }

    const params = new URLSearchParams()
    params.set('q', kw)
    if (tgt) {
      params.set('target', tgt)
    }

    window.location.href = `/place?${params.toString()}`
  }

  return (
    <div className="my-8 p-5 sm:p-7 rounded-2xl bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white shadow-xl border border-indigo-500/30 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30 uppercase tracking-wider">
            <Zap className="w-3 h-3 text-amber-300" /> 실시간 무료 측정
          </span>
          <span className="text-xs text-slate-300 hidden sm:inline">1위 매장 격차 분석</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-2">
          내 매장 네이버 플레이스 순위 1초 조회
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          가입 없이 키워드와 매장명만 입력하면, 지금 즉시 실시간 순위와 저장수·방문자리뷰 격차를 분석합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색 키워드 (예: 강남역 맛집)"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-indigo-400 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="내 매장명 (선택, 예: 스타벅스)"
                className="w-full px-3.5 py-2.5 text-sm bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-indigo-400 rounded-xl text-white placeholder-slate-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-70"
          >
            <span>{isSubmitting ? '조회 페이지 이동 중...' : '지금 바로 실시간 순위 무료 조회하기'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 pt-3.5 border-t border-white/10 text-[11px] text-slate-300">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 네이버 공식 실시간 연동
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 로그인·회원가입 없음
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1위 매장 4대 지표 비교
          </span>
        </div>
      </div>
    </div>
  )
}
