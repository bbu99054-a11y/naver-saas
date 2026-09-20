'use client'

import { useState } from 'react'
import { MapPin, TrendingUp, TrendingDown, Minus, Building2 } from 'lucide-react'

type KeywordCategory = 'DISTRICT' | 'SUBWAY' | 'HIGH_VALUE'

interface KeywordRankItem {
  id: string
  keyword: string
  rank: number
  status: 'UP' | 'DOWN' | 'SAME'
  searchVolume: string
  topCompetitor: string
}

const KEYWORD_DATA: Record<KeywordCategory, { label: string; items: KeywordRankItem[] }> = {
  DISTRICT: {
    label: '지역구 + 키워드',
    items: [
      { id: '1', keyword: '서초구 형사전문변호사', rank: 2, status: 'SAME', searchVolume: '5.2k', topCompetitor: '법무법인 태양 (1위)' },
      { id: '2', keyword: '서초구 이혼전문변호사', rank: 3, status: 'UP', searchVolume: '6.4k', topCompetitor: '법률사무소 청람 (1위)' },
      { id: '3', keyword: '서초구 전세사기변호사', rank: 4, status: 'DOWN', searchVolume: '2.8k', topCompetitor: '법무법인 정진 (2위)' },
    ]
  },
  SUBWAY: {
    label: '지하철역 + 키워드',
    items: [
      { id: '4', keyword: '교대역 음주운전변호사', rank: 3, status: 'UP', searchVolume: '3.6k', topCompetitor: '서초 로펌 A (1위)' },
      { id: '5', keyword: '서초역 법무법인', rank: 2, status: 'SAME', searchVolume: '2.9k', topCompetitor: '교대 법률사무소 B (1위)' },
      { id: '6', keyword: '양재역 가사소송변호사', rank: 5, status: 'DOWN', searchVolume: '1.8k', topCompetitor: '법무법인 한빛 (3위)' },
    ]
  },
  HIGH_VALUE: {
    label: '고수임단가 키워드',
    items: [
      { id: '7', keyword: '기업 횡령 배임 전문 변호사', rank: 1, status: 'UP', searchVolume: '1.9k', topCompetitor: '우리 로펌 독점 🏆' },
      { id: '8', keyword: '구속영장 실질심사 긴급 변호사', rank: 3, status: 'SAME', searchVolume: '2.4k', topCompetitor: '형사법인 명문 (2위)' },
      { id: '9', keyword: '상간자 위자료 청구 소송', rank: 4, status: 'UP', searchVolume: '4.5k', topCompetitor: '가사전문 바른 (1위)' },
    ]
  }
}

export function LocalRadarPanel({ address }: { address?: string | null }) {
  const [selectedCategory, setSelectedCategory] = useState<KeywordCategory>('DISTRICT')
  const currentData = KEYWORD_DATA[selectedCategory]

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden">
      {/* 헤더 */}
      <div className="p-5 pb-3 bg-gradient-to-r from-sky-50/50 via-blue-50/30 to-white flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0284C7]" />
            <span className="text-[11px] font-bold text-[#0284C7] uppercase tracking-wider">
              Place & Competitor Radar
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0284C7]" />
            네이버 플레이스 순위 & 경쟁사 현황판
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            3대 전략 키워드별 내 플레이스 노출 순위와 인근 경쟁사 판세입니다.
          </p>
        </div>
      </div>

      {/* 🌟 3대 키워드 선택 세그먼트 버튼 (지역구 / 지하철역 / 고수임단가) */}
      <div className="px-5 pt-3">
        <div className="inline-flex p-1 bg-slate-100/90 rounded-xl text-xs font-medium w-full sm:w-auto">
          {(Object.keys(KEYWORD_DATA) as KeywordCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-lg transition-all cursor-pointer text-center ${
                selectedCategory === cat
                  ? 'bg-white text-[#0284C7] shadow-2xs font-bold'
                  : 'text-slate-500 hover:text-slate-900 font-medium'
              }`}
            >
              {KEYWORD_DATA[cat].label}
            </button>
          ))}
        </div>
      </div>

      {/* 순위 및 경쟁사 현황 테이블 (자잘한 버튼 없는 클린 뷰) */}
      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {currentData.items.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-50/80 flex items-center justify-between gap-3 transition-colors hover:bg-slate-100/70"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs truncate">
                    {item.keyword}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    월 {item.searchVolume}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-slate-400" />
                  <span>경쟁사: {item.topCompetitor}</span>
                </p>
              </div>

              {/* 내 순위 배지 */}
              <div className="flex items-center gap-2 shrink-0 tabular-nums">
                <div className="text-right">
                  <span className={`text-base font-extrabold ${
                    item.rank === 1 ? 'text-[#0284C7]' : item.rank <= 3 ? 'text-emerald-700' : 'text-slate-800'
                  }`}>
                    {item.rank}위
                  </span>
                </div>

                <span className="w-4 flex justify-center">
                  {item.status === 'UP' && (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  {item.status === 'DOWN' && (
                    <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                  )}
                  {item.status === 'SAME' && (
                    <Minus className="w-3 h-3 text-slate-300" />
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 요약 판세 바 */}
        <div className="p-3 rounded-xl bg-sky-50/70 flex items-center justify-between text-xs mt-2">
          <span className="text-sky-950 font-bold text-[11px]">
            📍 {currentData.label} 3위권 방어율 88% 유지 중
          </span>
          <span className="text-[11px] text-[#0284C7] font-semibold">
            실시간 갱신됨 ✓
          </span>
        </div>
      </div>
    </div>
  )
}
