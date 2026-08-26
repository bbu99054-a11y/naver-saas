'use client'

import { ExternalLink, Search } from 'lucide-react'

interface RankTrackerBtnProps {
  keyword: string
  title?: string
  storeName?: string
}

export function RankTrackerBtn({ keyword }: RankTrackerBtnProps) {
  const cleanKeyword = (keyword || '').trim()
  const searchUrl = `https://search.naver.com/search.naver?query=${encodeURIComponent(cleanKeyword)}`

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <a 
        href={searchUrl} 
        target="_blank" 
        rel="noopener noreferrer"
        title={`네이버에서 '${cleanKeyword}' 검색결과를 새 탭으로 실시간 확인합니다.`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#03C75A]/10 text-[#029b46] hover:bg-[#03C75A]/20 text-[11px] font-bold border border-[#03C75A]/30 transition-all cursor-pointer shadow-2xs group"
      >
        <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-xs bg-[#03C75A] text-white font-black text-[9px]">
          N
        </span>
        <span className="group-hover:underline">실시간 노출 확인</span>
        <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-transform" />
      </a>
    </div>
  )
}
