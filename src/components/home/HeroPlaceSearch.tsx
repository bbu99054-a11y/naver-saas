'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, ArrowRight, Store, CheckCircle2, QrCode, Scale, Sparkles } from 'lucide-react'

interface HeroPlaceSearchProps {
  variant?: 'hero' | 'sidebar'
  defaultKeyword?: string
  defaultTarget?: string
}

const SAMPLE_KEYWORDS = [
  { label: '#성수동카페', kw: '성수동 카페', target: '' },
  { label: '#강남역피부과', kw: '강남역 피부과', target: '' },
  { label: '#홍대미용실', kw: '홍대 미용실', target: '' },
  { label: '#송파세무사', kw: '송파 세무사', target: '' },
  { label: '#역삼역맛집', kw: '역삼역 맛집', target: '' },
]

export default function HeroPlaceSearch({
  variant = 'hero',
  defaultKeyword = '',
  defaultTarget = '',
}: HeroPlaceSearchProps) {
  const [keyword, setKeyword] = useState(defaultKeyword)
  const [target, setTarget] = useState(defaultTarget)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigateToPlace = (kwInput: string, targetInput: string) => {
    const kw = kwInput.trim()
    const tgt = targetInput.trim()

    if (!kw) {
      setErrorMessage('조회할 지역과 키워드(예: 성수동 카페, 강남역 피부과)를 입력해 주세요.')
      return
    }

    setErrorMessage('')
    setIsSubmitting(true)

    try {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void }
      if (typeof window !== 'undefined' && w.gtag) {
        w.gtag('event', variant === 'hero' ? 'click_hero_place_search' : 'click_sidebar_place_search', {
          keyword: kw,
          target_store: tgt || '전체',
          source_page: window.location.pathname,
        })
      }
    } catch {
      // ignore analytics error
    }

    const params = new URLSearchParams()
    params.set('q', kw)
    if (tgt) {
      params.set('target', tgt)
    }

    window.location.href = `/place?${params.toString()}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigateToPlace(keyword, target)
  }

  const handleQuickChip = (kw: string, tgt: string) => {
    setKeyword(kw)
    setTarget(tgt)
    navigateToPlace(kw, tgt)
  }

  if (variant === 'sidebar') {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden break-keep">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-600" /> 실시간 무료 실측
          </span>
          <span className="text-[11px] font-bold text-slate-400">무설치 · 회원가입 없음</span>
        </div>

        <h3 className="text-base font-black text-slate-900 leading-snug mb-1.5 text-balance">
          내 매장 플레이스 순위 진단
        </h3>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed break-keep">
          키워드와 상호명을 입력하면 1위 매장과의 리뷰·예약·저장수 격차를 즉시 분석합니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                if (errorMessage) setErrorMessage('')
              }}
              placeholder="지역+업종 (예: 강남역 피부과)"
              maxLength={50}
              className={`w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 focus:bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition ${
                errorMessage ? 'border-red-500 focus:border-red-600' : 'border-slate-200 focus:border-slate-800'
              }`}
            />
          </div>
          {errorMessage && (
            <p className="text-[11px] text-red-600 font-bold flex items-center gap-1">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </p>
          )}
          <div className="relative">
            <Store className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              placeholder="내 매장 상호명 (선택 입력)"
              maxLength={50}
              className="w-full pl-8 pr-3 py-2.5 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-slate-800 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>{isSubmitting ? '실시간 순위 분석 중...' : '순위 진단하기'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-400 mr-0.5">샘플:</span>
          {SAMPLE_KEYWORDS.slice(0, 3).map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleQuickChip(chip.kw, chip.target)}
              className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 transition cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
          <Link
            href="/utm"
            className="py-2 px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition"
          >
            <QrCode className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="truncate">매장 리뷰 QR</span>
          </Link>
          <Link
            href="/adcheck"
            className="py-2 px-2.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-100 text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 transition"
          >
            <Scale className="w-3 h-3 text-slate-600 shrink-0" />
            <span className="truncate">금칙어 스캐너</span>
          </Link>
        </div>
      </div>
    )
  }

  // Concept A (Dub.co + Toss Style) Hero Floating Pill Search
  return (
    <div className="w-full max-w-4xl mx-auto space-y-3 break-keep">
      <form
        onSubmit={handleSubmit}
        className={`bg-white rounded-2xl sm:rounded-full border p-2 sm:p-2.5 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition-all ${
          errorMessage
            ? 'border-red-400 shadow-xl shadow-red-500/10 focus-within:border-red-500'
            : 'border-slate-200/90 shadow-xl shadow-slate-200/50 focus-within:border-slate-400 focus-within:shadow-2xl'
        }`}
      >
        {/* 키워드 인풋 */}
        <div className="flex-1 relative flex items-center min-w-0">
          <MapPin
            className={`w-4 h-4 absolute left-4 shrink-0 pointer-events-none transition-colors ${
              errorMessage ? 'text-red-500' : 'text-slate-400'
            }`}
          />
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value)
              if (errorMessage) setErrorMessage('')
            }}
            placeholder="지역+업종 (예: 성수동 카페, 강남역 피부과)"
            maxLength={50}
            className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 font-medium bg-transparent border-0 focus:outline-none focus:ring-0"
          />
        </div>

        {/* 데스크톱 구분선 */}
        <div className="hidden sm:block w-[1px] h-8 bg-slate-200 shrink-0" />

        {/* 매장명 인풋 */}
        <div className="flex-1 relative flex items-center min-w-0">
          <Store className="w-4 h-4 text-slate-400 absolute left-4 shrink-0 pointer-events-none" />
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="내 매장명 (선택, 미입력 시 전체)"
            maxLength={50}
            className="w-full pl-11 pr-4 py-3 sm:py-3.5 text-sm sm:text-base text-slate-900 placeholder-slate-400 font-medium bg-transparent border-0 focus:outline-none focus:ring-0"
          />
        </div>

        {/* 실행 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="shrink-0 px-6 py-3.5 rounded-xl sm:rounded-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-extrabold text-sm sm:text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>{isSubmitting ? '순위 분석 중...' : '순위 진단하기'}</span>
          <ArrowRight className="w-4 h-4 text-slate-300" />
        </button>
      </form>

      {errorMessage && (
        <p className="text-xs text-red-600 font-bold flex items-center justify-center sm:justify-start gap-1.5 px-3">
          <span>⚠️</span>
          <span>{errorMessage}</span>
        </p>
      )}

      {/* 하단 보조 칩 및 신뢰 뱃지 */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-2 text-xs">
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-slate-400" />
            <span>원클릭 예시:</span>
          </span>
          {SAMPLE_KEYWORDS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleQuickChip(chip.kw, chip.target)}
              className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200/80 text-slate-600 hover:text-slate-900 font-medium transition cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 text-slate-400 font-medium text-[11px]">
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>어뷰징 방지</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>실시간 1위~20위</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>무료 실측</span>
          </span>
        </div>
      </div>
    </div>
  )
}
