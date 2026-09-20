'use client'

import { useState, useEffect } from 'react'
import { PhoneCall, Clock, CheckCircle2, AlertCircle, Sparkles, RefreshCw, ChevronRight } from 'lucide-react'
import type { IntakeLeadItem } from '@/actions/leads'
import { getIntakeLeads } from '@/actions/leads'
import { IntakeDetailModal } from '@/components/IntakeDetailModal'
import Link from 'next/link'

export function IntakeCrmPanel() {
  const [leads, setLeads] = useState<IntakeLeadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<IntakeLeadItem | null>(null)

  const loadLeads = async () => {
    setIsLoading(true)
    try {
      const data = await getIntakeLeads()
      setLeads(data)
    } catch (e) {
      console.warn('Load intake leads error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleStatusChange = (leadId: string, newStatus: 'NEW' | 'CONTACTED' | 'WON' | 'CLOSED') => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  // 통계 계산
  const urgentCount = leads.filter(l => l.status === 'NEW' && l.isUrgent).length
  const reviewingCount = leads.filter(l => l.status === 'NEW' && !l.isUrgent).length
  const wonCount = leads.filter(l => l.status === 'WON').length

  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] flex flex-col h-full overflow-hidden border border-slate-100">
        {/* 헤더 */}
        <div className="p-5 pb-3 bg-gradient-to-r from-sky-50/60 via-blue-50/40 to-white flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Lead Intake Cockpit
              </span>
              <span className="text-[10px] font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.2 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Jev AI 트리아지 가동 중
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#0284C7]" />
              실시간 의뢰인 상담 접수 관제탑
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              1분 안심 진단 폼을 통해 유입된 의뢰인을 Jev AI가 실시간 자동 판별합니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadLeads}
              disabled={isLoading}
              title="새로고침"
              className="p-1.5 rounded-lg text-slate-400 hover:text-[#0284C7] hover:bg-sky-50 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#0284C7]' : ''}`} />
            </button>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7]">
              이달 {leads.length}건 접수
            </span>
          </div>
        </div>

        <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
          {/* 골든타임 현황 바 */}
          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[#0284C7]">⏱️</span>
              <span className="font-bold text-slate-800">수임 골든타임 (10분 내 유선 통화 권장)</span>
            </div>
            <span className="text-[11px] font-bold text-[#0284C7] font-mono bg-white px-2.5 py-0.5 rounded-full shadow-2xs border border-sky-100">
              긴급 대기 {urgentCount}건 · 검토 {reviewingCount}건
            </span>
          </div>

          {/* 의뢰인 접수 리스트 (클릭 시 상세 모달 열림) */}
          <div className="space-y-2.5">
            {leads.slice(0, 4).map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLead(lead)}
                className="p-3.5 rounded-xl bg-slate-50/80 hover:bg-sky-50/50 hover:border-sky-200 border border-transparent transition-all space-y-1.5 cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#0284C7] transition-colors">
                      {lead.name}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">({lead.phoneMasked})</span>
                    {lead.jevScore !== undefined && (
                      <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                        lead.jevScore >= 70 ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-sky-50 text-[#0284C7] border border-sky-100'
                      }`}>
                        Jev 긴급도 {lead.jevScore}%
                      </span>
                    )}
                  </div>

                  {lead.status === 'NEW' ? (
                    lead.isUrgent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        긴급 ({lead.minutesAgo}분 전)
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-200/70 px-2 py-0.5 rounded-full">
                        검토 중 ({lead.minutesAgo}분 전)
                      </span>
                    )
                  ) : lead.status === 'CONTACTED' ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                      통화 완료 ({lead.minutesAgo}분 전)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      수임 완료 ({lead.contractAmount})
                    </span>
                  )}
                </div>

                <div className="space-y-0.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800 text-[11px]">
                      {lead.category} · <span className="text-slate-400 font-normal">{lead.stage}</span>
                    </p>
                    {lead.contractAmount && lead.status !== 'WON' && (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        💰 추정 {lead.contractAmount}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-1 group-hover:text-slate-700">
                    {lead.summary}
                  </p>
                </div>

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-indigo-600 font-medium group-hover:underline flex items-center gap-0.5">
                    사건 상세 및 Jev 통화 가이드 보기 ➔
                  </span>
                  <span className="font-mono">{lead.actionText}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 바로가기 바 */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs mt-1">
            <span className="text-slate-500 text-[11px]">
              전체 의뢰인 목록 및 파이프라인 관리
            </span>
            <Link 
              href="/dashboard/intake"
              className="text-[#0284C7] font-bold text-xs hover:underline flex items-center gap-1"
            >
              인테이크 전체보기 <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Jev 의뢰인 심층 분석 & 원클릭 전화 모달 */}
      <IntakeDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleStatusChange}
      />
    </>
  )
}
