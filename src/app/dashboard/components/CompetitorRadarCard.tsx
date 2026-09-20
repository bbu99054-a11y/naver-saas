'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, Building2, Sparkles, Swords, RefreshCw, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { CompetitorAnalysisItem } from '@/actions/competitors'
import { getCompetitorRadar } from '@/actions/competitors'

export function CompetitorRadarCard() {
  const [competitors, setCompetitors] = useState<CompetitorAnalysisItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadData = async () => {
    setIsLoading(true)
    try {
      const data = await getCompetitorRadar()
      setCompetitors(data)
    } catch (e) {
      console.warn('Load competitor radar error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden border border-slate-100">
      {/* 헤더 */}
      <div className="p-5 pb-3 bg-gradient-to-r from-sky-50/60 via-blue-50/40 to-white flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
              Competitor Radar & Counter
            </span>
            <span className="text-[10px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.2 rounded-full flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Jev 허점 간파 가동 중
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#0284C7]" />
            인근 경쟁사 실시간 레이더 & 맞불 공략
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            반경 1.5km 내 활동성 경쟁사의 글을 분석해 허점을 찌르는 반격 칼럼을 제안합니다.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={loadData}
            disabled={isLoading}
            title="새로고침"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0284C7]' : ''}`} />
          </button>
          <Link href="/dashboard/place">
            <Button variant="ghost" size="sm" className="h-7 text-[11px] font-semibold text-[#0284C7] hover:text-[#0369A1] px-2 cursor-pointer">
              순위 분석 ➔
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        {/* 경쟁사 리스트 */}
        <div className="space-y-3">
          {competitors.map((comp) => (
            <div
              key={comp.id}
              className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-slate-100/90 border border-slate-200/60 transition-all space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900">{comp.name}</span>
                  <span className="text-[10px] text-slate-400">{comp.location}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-800 tabular-nums">
                    {comp.placeRank}위
                  </span>
                  {comp.rankChange === 'UP' && (
                    <span className="inline-flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded-full">
                      <TrendingUp className="w-2.5 h-2.5 mr-0.5" /> 상승
                    </span>
                  )}
                  {comp.rankChange === 'SAME' && (
                    <span className="inline-flex items-center text-[10px] text-slate-400">
                      <Minus className="w-2.5 h-2.5" /> 유지
                    </span>
                  )}
                  {comp.rankChange === 'DOWN' && (
                    <span className="inline-flex items-center text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                      <TrendingDown className="w-2.5 h-2.5 mr-0.5" /> 하락
                    </span>
                  )}
                </div>
              </div>

              {/* 최근 발행 글 제목 */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-700 shrink-0">
                  최근 글 ({comp.publishedDaysAgo}일 전)
                </span>
                <span className="truncate text-slate-800 font-semibold">
                  {comp.recentArticleTitle}
                </span>
              </div>

              {/* 🧠 Jev 간파 허점 (Weakness Callout) */}
              <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100/80 text-[11px] text-rose-900 leading-snug space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-rose-700 flex items-center gap-1 text-[10px]">
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    Jev 간파 허점 (경쟁사 빈틈)
                  </span>
                  <span className="text-[10px] font-bold text-rose-600">
                    위협도 {comp.threatScore}%
                  </span>
                </div>
                <p className="text-[11px] text-rose-950 font-medium">
                  {comp.flaw}
                </p>
              </div>

              {/* 🎯 맞불 추천 키워드 & 원클릭 반격 버튼 */}
              <div className="flex items-center justify-between pt-1 gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] text-slate-400 font-medium block">
                    🎯 1위 탈환 맞불 키워드:
                  </span>
                  <span className="text-xs font-bold text-indigo-900 truncate block">
                    {comp.counterKeyword}
                  </span>
                </div>

                <Link 
                  href={`/dashboard/write?keyword=${encodeURIComponent(comp.counterKeyword)}&competitor=${encodeURIComponent(comp.name)}&gap=${encodeURIComponent(comp.flaw)}`}
                >
                  <Button 
                    size="sm" 
                    className="h-7.5 px-3 text-[11px] font-black bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs gap-1.5 cursor-pointer shrink-0 transition-all hover:scale-[1.02]"
                  >
                    <Swords className="w-3.5 h-3.5" /> 맞불 쓰기 ➔
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 인사이트 바 */}
        <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs mt-1">
          <div className="flex items-center gap-1.5 text-sky-950 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
            <span>경쟁사 평균 주 2.4건 발행 중 · 허점 공략 칼럼으로 유입 선점</span>
          </div>
          <Link href="/dashboard/write">
            <span className="text-[11px] font-bold text-[#0284C7] hover:underline cursor-pointer">
              칼럼 쓰기 ➔
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
