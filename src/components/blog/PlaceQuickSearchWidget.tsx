'use client'

import React, { useState } from 'react'
import { Search, ArrowRight, Zap, CheckCircle2, MapPin } from 'lucide-react'

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
      alert('확인할 키워드(예: 성수동 카페, 강남역 피부과)를 입력해 주세요.')
      return
    }

    setIsSubmitting(true)

    try {
      if (typeof window !== 'undefined' && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag) {
        ;(window as unknown as { gtag: (...args: unknown[]) => void }).gtag('event', 'click_blog_quick_search', {
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
    <div className="my-8 p-5 sm:p-7 rounded-2xl bg-slate-900 text-white shadow-lg border border-slate-800 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider">
            <Zap className="w-3 h-3 text-emerald-400" /> 실시간 무료 측정
          </span>
          <span className="text-xs text-slate-300 hidden sm:inline">1위 매장 4대 격차 &amp; 월간 검색량 분석</span>
        </div>

        <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight mb-2">
          내 매장 네이버 플레이스 순위 1초 조회
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 mb-5 leading-relaxed">
          회원가입 없이 키워드와 매장명만 입력하면, 지금 즉시 실시간 순위와 1위 매장 대비 리뷰·예약·쿠폰 격차를 분석합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="지역+업종 키워드 (예: 강남역 맛집)"
                className="w-full pl-10 pr-3 py-2.5 text-sm bg-white text-slate-900 placeholder-slate-400 font-semibold rounded-xl border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-colors"
                required
              />
            </div>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="내 매장명 (선택, 예: 스타벅스)"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-white text-slate-900 placeholder-slate-400 font-semibold rounded-xl border-2 border-transparent focus:border-emerald-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? '실시간 순위 측정 페이지로 이동 중...' : '무료로 실시간 순위 & 1위 격차 확인하기'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 회원가입·설치 없음
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 네이버 모바일 통합검색 실시간 1~20위 대조
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 자가 검색 어뷰징 위험 0%
          </span>
        </div>
      </div>
    </div>
  )
}
