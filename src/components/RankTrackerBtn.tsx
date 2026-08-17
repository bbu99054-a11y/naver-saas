'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Trophy, Sparkles, ExternalLink, TrendingUp, Search } from 'lucide-react'
import { trackNaverRank, RankResult } from '@/actions/articles'

interface RankTrackerBtnProps {
  keyword: string
  title?: string
  storeName?: string
}

export function RankTrackerBtn({ keyword, title = '', storeName = '' }: RankTrackerBtnProps) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<RankResult | null>(null)

  const handleCheckRank = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setLoading(true)
    try {
      const data = await trackNaverRank(keyword, title, storeName)
      setResult(data)
    } catch (err) {
      console.error('Failed to track rank:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-bold border border-indigo-100 animate-pulse">
        <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
        <span>네이버 순위 조회 중...</span>
      </div>
    )
  }

  if (result) {
    if (result.isRanked && result.rank) {
      return (
        <div className="inline-flex items-center gap-1.5 flex-wrap">
          <a 
            href={result.searchUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            title="네이버 실제 검색결과 새 탭으로 확인하기"
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-extrabold border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
          >
            <Trophy className="w-3 h-3 text-amber-500 shrink-0" />
            <span>1페이지 {result.rank}위 노출</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60 ml-0.5" />
          </a>
          <span className="text-[10px] text-slate-500 hidden xl:inline font-medium">
            (월 유입 ~{result.estimatedMonthlyViews}명 / {Math.round(result.savedAdCost / 10000)}만 원 절감)
          </span>
        </div>
      )
    }

    return (
      <div className="inline-flex items-center gap-1.5 flex-wrap">
        <a 
          href={result.searchUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          title="네이버에 글을 복사해 발행 후 15~30분 뒤에 다시 조회해 보세요. (클릭 시 네이버 검색창 이동)"
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
        >
          <span>⏳ 네이버 미발행 / 색인 대기</span>
          <ExternalLink className="w-2.5 h-2.5 opacity-50 ml-0.5" />
        </a>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCheckRank}
      className="h-6 px-2 text-[11px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border-slate-200 shadow-2xs gap-1 cursor-pointer"
      title="네이버 실시간 검색 노출 순위 및 광고비 절감액 조회"
    >
      <Search className="w-3 h-3 text-slate-400" />
      <span>노출 순위 조회</span>
    </Button>
  )
}
