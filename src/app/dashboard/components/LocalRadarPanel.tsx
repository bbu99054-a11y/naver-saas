'use client'

import { useState, useEffect } from 'react'
import { MapPin, RefreshCw, AlertTriangle, ExternalLink } from 'lucide-react'

export interface ArticleItem {
  id: string
  title: string
  target_keyword: string
  status: string
  created_at: Date | string
}

interface PlaceCompetitor {
  rank: number
  id: string
  name: string
  category: string
  address: string
  placeUrl: string
}

export function LocalRadarPanel({
  storeName,
  targetKeyword,
  address,
  articles = [],
}: {
  storeName?: string | null
  targetKeyword?: string | null
  address?: string | null
  articles?: ArticleItem[]
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [livePlaceRank, setLivePlaceRank] = useState<number | null>(null)
  const [realCompetitors, setRealCompetitors] = useState<PlaceCompetitor[]>([])
  const [top1Competitor, setTop1Competitor] = useState<string>('상위 로펌')
  const [lastRefreshedAt, setLastRefreshedAt] = useState<string>('방금 전')

  // Clean parameters
  const cleanStore = (storeName || '우리 사무소').trim()
  const cleanKeyword = (targetKeyword || '전문 변호사').trim()

  const fetchLivePlaceRank = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/place/rank?query=${encodeURIComponent(cleanKeyword)}&target=${encodeURIComponent(cleanStore)}`)
      const data = await res.json()

      if (data.success) {
        if (data.myPlace) {
          setLivePlaceRank(data.myPlace.rank)
        } else {
          setLivePlaceRank(null) // 20위 밖 미노출
        }

        if (data.rankingList && data.rankingList.length > 0) {
          setRealCompetitors(data.rankingList.slice(0, 5))
          const top1 = data.rankingList[0]
          setTop1Competitor(top1.name || '경쟁 로펌 1위')
        }

        const now = new Date()
        setLastRefreshedAt(`${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`)
      }
    } catch (e) {
      console.warn('Live place ranking fetch error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLivePlaceRank()
  }, [cleanKeyword, cleanStore])

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden border border-slate-200">
      {/* 헤더 */}
      <div className="p-4 sm:p-5 pb-3 bg-white border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              실시간 연동
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5 break-keep">
            <MapPin className="w-4 h-4 text-[#0284C7] shrink-0" />
            플레이스 실시간 순위
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 break-keep">
            기준 키워드: <strong className="text-slate-800">[{cleanKeyword}]</strong>
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchLivePlaceRank}
            disabled={isLoading}
            title="실시간 네이버 재조회"
            className="p-1.5 rounded-lg text-slate-400 hover:text-[#0284C7] hover:bg-slate-50 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0284C7]' : ''}`} />
          </button>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {lastRefreshedAt}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        {/* 내 사무소 실시간 순위 판정 배너 */}
        <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
          livePlaceRank && livePlaceRank <= 5 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
            : 'bg-amber-50/70 border-amber-200/80 text-amber-950'
        }`}>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold">
              {livePlaceRank && livePlaceRank <= 5 ? (
                <>
                  <span className="text-emerald-600">🏆</span>
                  <span>{cleanStore} 실시간 상위 {livePlaceRank}위 안착!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>{cleanStore}: 현재 네이버 모바일 20위 밖 미노출</span>
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-600 break-keep">
              {livePlaceRank && livePlaceRank <= 5 
                ? '현재 1~5위 상위 노출 방어 중입니다. 지속적인 타겟 관리가 필요합니다.'
                : `현재 1위는 "${top1Competitor}"입니다. 순위 진입을 위한 타겟 관리가 시급합니다.`}
            </p>
          </div>

          <div className="text-right shrink-0 ml-2">
            <span className={`text-lg font-black tabular-nums ${
              livePlaceRank && livePlaceRank <= 5 ? 'text-emerald-700' : 'text-amber-700'
            }`}>
              {livePlaceRank ? `${livePlaceRank}위` : '20위 밖'}
            </span>
          </div>
        </div>

        {/* 네이버 플레이스 실제 TOP 5 목록 (순수 랭킹 뷰 & 풀네임 노출) */}
        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between px-0.5 text-[11px] font-bold text-slate-500">
            <span>네이버 실제 노출 TOP 5</span>
            <span className="text-[10px] text-slate-400 font-normal">클릭 시 네이버 지도로 이동</span>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#0284C7]" />
              네이버 실시간 플레이스 순위 조회 중...
            </div>
          ) : realCompetitors.length > 0 ? (
            realCompetitors.map((comp) => {
              const isMe = comp.name.includes(cleanStore) || cleanStore.includes(comp.name)
              return (
                <a
                  key={comp.id || comp.rank}
                  href={comp.placeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all group cursor-pointer ${
                    isMe 
                      ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-500/20' 
                      : 'bg-slate-50/70 border-slate-200/70 hover:bg-sky-50/60 hover:border-sky-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                      comp.rank === 1 
                        ? 'bg-amber-400 text-amber-950 shadow-2xs' 
                        : comp.rank === 2 
                          ? 'bg-slate-300 text-slate-800' 
                          : comp.rank === 3 
                            ? 'bg-amber-700/20 text-amber-900' 
                            : 'bg-slate-200 text-slate-600'
                    }`}>
                      {comp.rank}
                    </span>
                    <div className="min-w-0 flex-1 pr-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug break-keep group-hover:text-[#0284C7] transition-colors line-clamp-2">
                          {comp.name}
                        </h4>
                        {isMe && (
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                            내 로펌
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {comp.category || '전문직 로펌'}
                      </p>
                    </div>
                  </div>

                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0284C7] shrink-0 transition-colors ml-1" />
                </a>
              )
            })
          ) : (
            <div className="py-8 text-center text-xs text-slate-400">
              네이버 플레이스 검색 결과를 가져오는 중입니다.
            </div>
          )}
        </div>

        {/* 하단 네이버 검색 전체보기 링크 */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>네이버 모바일 플레이스 기준</span>
          <a
            href={`https://m.search.naver.com/search.naver?query=${encodeURIComponent(cleanKeyword)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0284C7] font-semibold hover:underline flex items-center gap-0.5"
          >
            네이버 검색 결과 전체보기 ↗
          </a>
        </div>
      </div>
    </div>
  )
}
