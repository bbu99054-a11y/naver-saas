'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck,
  Gift,
  FileText,
  ArrowRight
} from 'lucide-react'
import GoogleAdSlot from './GoogleAdSlot'
import EbookPromoCard from './EbookPromoCard'
import SaasBridgeBanner from './SaasBridgeBanner'
import LeadMagnetModal from './LeadMagnetModal'

export interface ToolContainerProps {
  children: React.ReactNode
  toolId: 'place' | 'adcheck' | 'crop' | 'byte' | 'hwpx' | 'utm' | 'convert'
  title: string
  subtitle?: string
  badge?: string
  description?: string
  showTopAd?: boolean
  showBottomAd?: boolean
  showSidebar?: boolean
  leadMagnetTitle?: string
  leadMagnetDesc?: string
}

export default function ToolContainer({
  children,
  toolId,
  title,
  subtitle,
  badge = '100% 무료 초소형 웹 유틸리티',
  description,
  showTopAd = true,
  showBottomAd = true,
  showSidebar = true,
  leadMagnetTitle,
  leadMagnetDesc
}: ToolContainerProps) {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* 1. 상단 미니 네비게이션 헤더 */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <Link href="/" className="font-bold text-slate-800 hover:text-blue-600 transition-colors">
              PostSync AI
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/tools" className="hover:text-blue-600 transition-colors">
              무료 웹툴 허브
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-bold text-blue-600 truncate max-w-[150px] sm:max-w-xs">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-all"
            >
              <Gift className="w-3.5 h-3.5 text-emerald-600" />
              무료 리포트 신청
            </button>

            <Link
              href="/dashboard/write"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-extrabold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              SaaS 체험
            </Link>
          </div>
        </div>
      </header>

      {/* 2. 상단 애드센스 슬롯 (가로형 728x90) */}
      {showTopAd && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-3">
          <GoogleAdSlot adFormat="horizontal" className="max-w-[728px] mx-auto" />
        </div>
      )}

      {/* 3. 툴 헤더 소개 영역 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-extrabold w-fit">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {badge}
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-base sm:text-lg font-semibold text-slate-700">
              {subtitle}
            </p>
          )}
          {description && (
            <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* 4. 메인 작업 영역: 7:3 분할 반응형 그리드 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-2">
        <div className={`grid grid-cols-1 ${showSidebar ? 'lg:grid-cols-12 gap-8' : 'gap-6'}`}>
          {/* 좌측 메인 툴 컴포넌트 영역 */}
          <div className={showSidebar ? 'lg:col-span-8 space-y-6' : 'col-span-1 space-y-6'}>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
              {children}
            </div>

            {/* 메인 툴 하단 인라인 리드마그넷 트리거 바 */}
            <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border border-emerald-200 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    1초 진단 연동
                  </span>
                  <span className="text-xs font-bold text-slate-700">무료 심층 A4 리포트</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {leadMagnetTitle || '지금 검사한 결과를 공식 심층 리포트로 받아보시겠습니까?'}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {leadMagnetDesc || '전문 연구팀의 알고리즘 검증을 거친 정밀 분석서가 이메일로 1초 만에 전송됩니다.'}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(true)}
                className="shrink-0 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <FileText className="w-4 h-4" />
                무료 리포트 전송받기
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 우측 4대 수익화 사이드바 영역 */}
          {showSidebar && (
            <aside className="lg:col-span-4 space-y-6">
              {/* 수익화 블록 1: 전문직 전자책 카드 */}
              <EbookPromoCard toolSource={toolId} />

              {/* 수익화 블록 2: SaaS 유료 전환 배너 */}
              <SaasBridgeBanner toolName={title} />

              {/* 수익화 블록 3: 사이드바 반응형 광고 슬롯 */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <GoogleAdSlot adFormat="rectangle" />
              </div>
            </aside>
          )}
        </div>
      </main>

      {/* 5. 하단 멀티플렉스 애드센스 슬롯 */}
      {showBottomAd && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            <GoogleAdSlot adFormat="auto" />
          </div>
        </div>
      )}

      {/* 6. 공통 리드 수집 모달 */}
      <LeadMagnetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        toolSource={toolId}
        leadType="audit_report"
        title={leadMagnetTitle || `${title} 심층 분석 리포트 무료 신청`}
        description={leadMagnetDesc || '이메일과 상호명을 남겨주시면 연구팀의 상세 진단서(PDF)를 안전하게 발송해 드립니다.'}
      />
    </div>
  )
}
