'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Flame,
  Download
} from 'lucide-react'
import LeadMagnetModal from './LeadMagnetModal'

interface EbookPromoCardProps {
  toolSource?: string
  className?: string
}

export default function EbookPromoCard({
  toolSource = 'adcheck',
  className = ''
}: EbookPromoCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <div
        className={`bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden group ${className}`}
      >
        {/* 배경 은은한 빛 효과 */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/30 transition-all pointer-events-none" />

        {/* 상단 뱃지 */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold tracking-wide">
            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" /> 2026 최신판 전자책
          </span>
          <span className="text-[11px] text-slate-400 font-mono">PDF 48P 분량</span>
        </div>

        {/* 도서 정보 */}
        <div className="flex gap-4 items-start mb-4">
          <div className="w-14 h-18 sm:w-16 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-2 shadow-lg flex flex-col justify-between shrink-0 border border-blue-400/30">
            <BookOpen className="w-5 h-5 text-blue-200" />
            <span className="text-[9px] font-black leading-tight text-white/90">
              POSTSYNC<br />GUIDE
            </span>
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-bold leading-snug group-hover:text-blue-300 transition-colors">
              전문직 네이버 상위 1% 로직 & 법정 광고 규정 바이블
            </h4>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xs text-slate-400 line-through">79,000원</span>
              <span className="text-lg font-extrabold text-emerald-400">무료 배포 중</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-bold">100% OFF</span>
            </div>
          </div>
        </div>

        {/* 핵심 목차 체크리스트 */}
        <ul className="space-y-1.5 text-xs text-slate-300 mb-5 border-t border-slate-700/60 pt-3">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>2026 네이버 C-Rank & 스마트블록 최신 알고리즘</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>변호사·세무사·의료법 복지부 필터링 500제 완벽 해설</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>고객 유입 3.8배 상승 전문직 인포그래픽 카드 서식</span>
          </li>
        </ul>

        {/* 액션 버튼 */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          가이드북 PDF 1초 무료 다운받기
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 직통 리드 수집 모달 */}
      <LeadMagnetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        toolSource={toolSource}
        leadType="ebook"
        title="『2026 전문직 네이버 상위 1% 로직 바이블』 신청"
        description="이메일과 연락처를 남겨주시면 연구팀에서 검증한 고화질 PDF 전자책(48P)을 즉시 발송해 드립니다."
      />
    </>
  )
}
