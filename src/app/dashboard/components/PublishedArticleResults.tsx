'use client'

import { Award, Eye, Users } from 'lucide-react'

interface PublishedResult {
  id: string
  title: string
  category: string
  publishedDate: string
  rankingBadge: string
  estimatedViews: number
  leadContribution: number
  thumbnailUrl: string
}

const PUBLISHED_RESULTS: PublishedResult[] = [
  {
    id: '1',
    title: '음주운전 2진 아웃 경찰 피의자 신문 전 선처 양형 3원칙',
    category: '형사 · 음주운전',
    publishedDate: '3일 전 발행',
    rankingBadge: '스마트블록 3위 안착 🏆',
    estimatedViews: 412,
    leadContribution: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=200&q=80'
  },
  {
    id: '2',
    title: '서초 상간자 위자료 청구 소송 3,500만 원 승소 인용 사례',
    category: '이혼 · 상간자',
    publishedDate: '5일 전 발행',
    rankingBadge: 'VIEW탭 2위 노출 📈',
    estimatedViews: 680,
    leadContribution: 3,
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=200&q=80'
  },
  {
    id: '3',
    title: '전세보증금 미반환 명도 및 임차권등기명령 강제집행 절차',
    category: '부동산 · 명도',
    publishedDate: '1주일 전 발행',
    rankingBadge: '플레이스 상단 노출 ✓',
    estimatedViews: 290,
    leadContribution: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&q=80'
  }
]

export function PublishedArticleResults() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden">
      {/* 헤더 */}
      <div className="p-5 pb-3 bg-gradient-to-r from-sky-50/50 via-blue-50/30 to-white flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
              Search Performance & ROI
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#0284C7]" />
            최근 발행한 글 네이버 검색 노출 성과
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            네이버 스마트블록 및 검색 상위에 안착된 칼럼 랭킹입니다.
          </p>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
          노출율 100%
        </span>
      </div>

      {/* 3열(1/3 너비) 환경에 최적화된 세로 컴팩트 카드 리스트 */}
      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {PUBLISHED_RESULTS.map((article) => (
            <div
              key={article.id}
              className="p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition-all flex items-center gap-3"
            >
              {/* 미니 썸네일 */}
              <div className="w-13 h-13 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                <img
                  src={article.thumbnailUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 본문 정보 */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[10px] font-bold text-[#0284C7]">
                    {article.category}
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                    {article.rankingBadge}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                  {article.title}
                </h4>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-slate-400" />
                    {article.estimatedViews}회 조회
                  </span>
                  <span className="flex items-center gap-1 font-bold text-slate-600">
                    <Users className="w-3 h-3 text-[#0284C7]" />
                    상담 {article.leadContribution}건 기여
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 요약 안내 바 */}
        <div className="p-3 rounded-xl bg-sky-50/70 flex items-center justify-between text-xs mt-2">
          <span className="text-sky-950 font-bold text-[11px]">
            📈 3건 모두 네이버 스마트블록 1페이지 상위 점유 중
          </span>
          <span className="text-[11px] text-[#0284C7] font-semibold">
            상담 전환 기여 ✓
          </span>
        </div>
      </div>
    </div>
  )
}
