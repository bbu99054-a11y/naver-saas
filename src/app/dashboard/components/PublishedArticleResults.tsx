'use client'

import { Award, Eye, Users, FileText, ArrowRight, PenTool } from 'lucide-react'
import Link from 'next/link'

export interface ArticleItem {
  id: string
  title: string
  target_keyword: string
  status: string
  created_at: Date | string
}

interface PublishedArticleResultsProps {
  articles?: ArticleItem[]
}

export function PublishedArticleResults({ articles = [] }: PublishedArticleResultsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden border border-slate-100">
      {/* 헤더 */}
      <div className="p-5 pb-3 bg-gradient-to-r from-sky-50/50 via-blue-50/30 to-white flex flex-row items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${articles.length > 0 ? 'bg-emerald-500' : 'bg-slate-300'}`} />
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              노출 관제
            </span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5 break-keep">
            <Award className="w-4 h-4 text-[#0284C7] shrink-0" />
            발행 글 검색 노출 성과
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5 break-keep">
            네이버 스마트블록 상위 노출 랭킹
          </p>
        </div>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 shrink-0">
          이달 {articles.length}건
        </span>
      </div>

      {/* 본문 영역 */}
      <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between">
        {articles.length > 0 ? (
          <div className="space-y-2">
            {articles.slice(0, 4).map((article) => {
              const createdDate = new Date(article.created_at)
              const dateText = `${createdDate.getMonth() + 1}월 ${createdDate.getDate()}일 발행`

              return (
                <div
                  key={article.id}
                  className="p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/70 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-bold text-[#0284C7]">
                        {article.target_keyword || '전문 칼럼'}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        {article.status === 'PUBLISHED' ? '네이버 발행 완료 ✓' : '원고 보관 중 📄'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {article.title}
                    </h4>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{dateText}</span>
                      <Link 
                        href={`/dashboard/archive/${article.id}`} 
                        className="text-indigo-600 font-semibold hover:underline"
                      >
                        원고 보기 ➔
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* 원고 0건일 때의 단정하고 신뢰감 있는 빈 화면 (Empty State) */
          <div className="py-10 px-4 text-center space-y-3 bg-slate-50/60 rounded-xl border border-dashed border-slate-200 my-auto">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-5 h-5 text-slate-400" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-700">아직 발행된 전문 칼럼이 없습니다 (0건)</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                전문 칼럼 스튜디오에서 고단가 수임 키워드로 첫 번째 칼럼을 발행해 보세요. 발행 즉시 네이버 검색 노출 성과가 추적됩니다.
              </p>
            </div>
            <Link 
              href="/dashboard/write"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5" />
              첫 전문 칼럼 작성하기 ➔
            </Link>
          </div>
        )}

        {/* 하단 요약 안내 바 */}
        <div className="p-3 rounded-xl bg-sky-50/70 flex items-center justify-between text-xs mt-2">
          <span className="text-sky-950 font-bold text-[11px]">
            {articles.length > 0 
              ? `📈 총 ${articles.length}건의 전문 칼럼이 수임 파이프라인에 기여 중` 
              : '💡 칼럼 1건 발행 시마다 대행사 외주비 15만 원 절감'}
          </span>
          <Link href="/dashboard/archive" className="text-[11px] text-[#0284C7] font-semibold hover:underline">
            보관함 ➔
          </Link>
        </div>
      </div>
    </div>
  )
}
