'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  ShieldCheck, 
  FileText, 
  Search, 
  RefreshCw,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  DollarSign,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { IntakeLeadItem } from '@/actions/leads'
import { getIntakeLeads, updateLeadStatus } from '@/actions/leads'
import { IntakeDetailModal } from '@/components/IntakeDetailModal'

type PipelineStage = 'NEW' | 'CONTACTED' | 'VISITING' | 'WON'

const STAGE_ORDER: PipelineStage[] = ['NEW', 'CONTACTED', 'VISITING', 'WON']

const COLUMNS: {
  id: PipelineStage
  title: string
  badgeBg: string
  badgeText: string
  borderColor: string
  subText: string
}[] = [
  { 
    id: 'NEW', 
    title: '1. 신규 접수', 
    badgeBg: 'bg-[#E0F2FE]', 
    badgeText: 'text-[#0284C7]', 
    borderColor: 'border-[#0284C7]',
    subText: '골든타임 10분 내 유선 연결'
  },
  { 
    id: 'CONTACTED', 
    title: '2. 1차 유선 상담', 
    badgeBg: 'bg-amber-50', 
    badgeText: 'text-amber-700', 
    borderColor: 'border-amber-400',
    subText: '사실관계 청취 및 사건성 검토'
  },
  { 
    id: 'VISITING', 
    title: '3. 방문 상담 예약', 
    badgeBg: 'bg-indigo-50', 
    badgeText: 'text-indigo-700', 
    borderColor: 'border-indigo-400',
    subText: '사무소 대면 미팅 및 서류 확인'
  },
  { 
    id: 'WON', 
    title: '4. 수임 계약 완료', 
    badgeBg: 'bg-emerald-50', 
    badgeText: 'text-emerald-700', 
    borderColor: 'border-emerald-500',
    subText: '착수금 입금 및 정식 위임 체결'
  }
]

export default function PipelinePage() {
  const [leads, setLeads] = useState<IntakeLeadItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLead, setSelectedLead] = useState<IntakeLeadItem | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const loadLeads = async () => {
    setIsLoading(true)
    try {
      const data = await getIntakeLeads()
      setLeads(data)
    } catch (e) {
      console.warn('Load pipeline leads error:', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  // 단계 이동 및 DB 영구 저장
  const handleAdvanceStage = async (id: string, currentStage: PipelineStage) => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage)
    if (currentIndex < STAGE_ORDER.length - 1) {
      const nextStage = STAGE_ORDER[currentIndex + 1]
      // 낙관적 UI 업데이트
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: nextStage } : l))
      try {
        await updateLeadStatus(id, nextStage)
      } catch (err) {
        console.error('Advance stage error:', err)
        loadLeads()
      }
    }
  }

  const handleRewindStage = async (id: string, currentStage: PipelineStage) => {
    const currentIndex = STAGE_ORDER.indexOf(currentStage)
    if (currentIndex > 0) {
      const prevStage = STAGE_ORDER[currentIndex - 1]
      // 낙관적 UI 업데이트
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status: prevStage } : l))
      try {
        await updateLeadStatus(id, prevStage)
      } catch (err) {
        console.error('Rewind stage error:', err)
        loadLeads()
      }
    }
  }

  const handleModalStatusChange = (leadId: string, newStatus: IntakeLeadItem['status']) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l))
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(prev => prev ? { ...prev, status: newStatus } : null)
    }
  }

  // 검색 필터링
  const filteredLeads = leads.filter(lead => {
    const term = searchTerm.toLowerCase().trim()
    if (!term) return true
    return (
      lead.name.toLowerCase().includes(term) ||
      lead.rawName.toLowerCase().includes(term) ||
      lead.phoneMasked.includes(term) ||
      lead.category.toLowerCase().includes(term) ||
      lead.summary.toLowerCase().includes(term)
    )
  })

  // 상단 KPI 계산
  const totalLeadsCount = leads.length
  const newLeadsCount = leads.filter(l => l.status === 'NEW').length
  const visitingLeadsCount = leads.filter(l => l.status === 'VISITING').length
  const wonLeads = leads.filter(l => l.status === 'WON')
  
  // 수임 확정액 계산 (예: '550만 원' -> 5,500,000)
  const wonTotalAmount = wonLeads.reduce((sum, l) => {
    const match = l.contractAmount.replace(/[^0-9]/g, '')
    const num = parseInt(match, 10) || 0
    return sum + (num > 0 ? num * 10000 : 0)
  }, 0)

  return (
    <div className="space-y-6 pb-12">
      {/* 🌟 헤더 안내 바 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="text-xs font-black text-[#0284C7] tracking-wider uppercase">
              Lawmatics Style Intake Pipeline CRM
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
              실시간 DB 직결 가동
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            수임 파이프라인 관리 (단계별 상담·계약 관제)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            블로그, 플레이스, 1분 진단 폼에서 유입된 잠재 의뢰인을 수임 계약까지 4단계로 한눈에 추적합니다.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/dashboard/intake">
            <Button variant="outline" size="sm" className="h-9 text-xs font-bold border-slate-200 text-slate-700 hover:bg-slate-50 cursor-pointer">
              📋 1분 진단 폼 배너 복사
            </Button>
          </Link>
          <Link href="/consult" target="_blank">
            <Button size="sm" className="h-9 text-xs font-black bg-[#FF6B00] hover:bg-[#E05D00] text-white rounded-xl shadow-xs cursor-pointer">
              + 모바일 진단 폼 열기
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={loadLeads}
            disabled={isLoading}
            variant="ghost"
            className="h-9 px-3 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* 🌟 4대 실시간 수임 성과 요약 바 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 1. 진행 중인 의뢰인 */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500">진행 중인 의뢰인</div>
          <div className="text-xl font-black text-slate-900 mt-1 tabular-nums">
            {totalLeadsCount}명
          </div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">
            전체 인바운드 접수 누계
          </span>
        </div>

        {/* 2. 신규 미처리 상담 */}
        <div className="bg-white p-4 rounded-xl border border-[#0284C7]/30 bg-[#E0F2FE]/20 shadow-2xs">
          <div className="text-[11px] font-bold text-[#0284C7] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>신규 미처리 상담</span>
          </div>
          <div className="text-xl font-black text-[#0284C7] mt-1 tabular-nums">
            {newLeadsCount}건
          </div>
          <span className="text-[10px] text-[#0284C7]/80 mt-0.5 block">
            10분 내 유선 연결 골든타임
          </span>
        </div>

        {/* 3. 대면 방문 상담 예약 */}
        <div className="bg-white p-4 rounded-xl border border-indigo-200/80 bg-indigo-50/20 shadow-2xs">
          <div className="text-[11px] font-bold text-indigo-700 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>방문 상담 예약</span>
          </div>
          <div className="text-xl font-black text-indigo-900 mt-1 tabular-nums">
            {visitingLeadsCount}건
          </div>
          <span className="text-[10px] text-indigo-600/80 mt-0.5 block">
            사무소 대면 미팅 확정
          </span>
        </div>

        {/* 4. 이번 달 수임 확정액 */}
        <div className="bg-white p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />
            <span>수임 계약 확정</span>
          </div>
          <div className="text-xl font-black text-emerald-900 mt-1 tabular-nums">
            {wonTotalAmount > 0 ? `${(wonTotalAmount / 10000).toLocaleString()}만 원` : '₩0원'}
          </div>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">
            완료 사건 {wonLeads.length}건 착수금 기준
          </span>
        </div>
      </div>

      {/* 🔍 검색 바 */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2">
        <Search className="w-4 h-4 text-slate-400 ml-2" />
        <input
          type="text"
          placeholder="의뢰인 성함, 연락처, 사건 분야(음주운전, 이혼 등)로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none bg-transparent"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm('')} 
            className="text-xs text-slate-400 hover:text-slate-600 px-2 cursor-pointer font-bold"
          >
            초기화
          </button>
        )}
      </div>

      {/* 🌟 4단계 Lawmatics 스타일 칸반보드 (Drag & Click Stage Move) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colLeads = filteredLeads.filter(l => l.status === col.id)
          const colAmount = colLeads.reduce((sum, l) => {
            const match = l.contractAmount.replace(/[^0-9]/g, '')
            return sum + (parseInt(match, 10) || 0)
          }, 0)

          return (
            <div 
              key={col.id} 
              className="bg-[#F8FAFC] rounded-2xl border border-slate-200/90 flex flex-col min-h-[520px] shadow-2xs overflow-hidden"
            >
              {/* 컬럼 헤더 */}
              <div className="p-3.5 bg-white border-b border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${
                      col.id === 'NEW' ? 'bg-[#0284C7]' :
                      col.id === 'CONTACTED' ? 'bg-amber-500' :
                      col.id === 'VISITING' ? 'bg-indigo-500' :
                      'bg-emerald-500'
                    }`} />
                    <h3 className="text-xs font-black text-slate-900">{col.title}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${col.badgeBg} ${col.badgeText}`}>
                    {colLeads.length}명
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>{col.subText}</span>
                  {colAmount > 0 && (
                    <span className="font-bold text-slate-600">{colAmount.toLocaleString()}만</span>
                  )}
                </div>
              </div>

              {/* 컬럼 내부 카드 리스트 */}
              <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="py-12 text-center text-xs text-slate-400">
                    불러오는 중...
                  </div>
                ) : colLeads.length === 0 ? (
                  <div className="py-16 text-center text-[11px] text-slate-400 space-y-1">
                    <div className="text-xl">📭</div>
                    <p className="font-medium">대기 중인 의뢰인이 없습니다</p>
                  </div>
                ) : (
                  colLeads.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl border border-slate-200/80 hover:border-[#0284C7] hover:shadow-xs transition-all space-y-3 cursor-pointer group"
                      onClick={() => setSelectedLead(item)}
                    >
                      {/* 카드 상단 배지 & 시간 */}
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          item.isUrgent ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.isUrgent ? '🚨 골든타임' : '⚖️ 일반 상담'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.minutesAgo}분 전
                        </span>
                      </div>

                      {/* 의뢰인 성함 및 사건 분야 */}
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-900 group-hover:text-[#0284C7] transition-colors">
                            {item.name}
                          </h4>
                          <span className="text-[11px] font-bold text-slate-900 tabular-nums">
                            {item.contractAmount}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                          {item.phoneMasked}
                        </span>
                      </div>

                      {/* 사건 요약 */}
                      <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-800">[{item.category}]</span> {item.summary}
                      </p>

                      {/* 카드 하단 단계 이동 원클릭 액션 버튼 */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
                        {col.id !== 'NEW' ? (
                          <button
                            onClick={() => handleRewindStage(item.id, col.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
                            title="이전 단계로 이동"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        ) : <div />}

                        {col.id !== 'WON' ? (
                          <Button
                            size="sm"
                            onClick={() => handleAdvanceStage(item.id, col.id)}
                            className="h-7 px-2.5 text-[10px] font-bold bg-slate-900 hover:bg-[#0284C7] text-white rounded-lg cursor-pointer transition-colors flex items-center gap-1"
                          >
                            <span>
                              {col.id === 'NEW' && '1차 상담 완료 ➔'}
                              {col.id === 'CONTACTED' && '방문 예약 확정 ➔'}
                              {col.id === 'VISITING' && '수임 계약 체결 ➔'}
                            </span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </Button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> 수임 완료
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Jev 의뢰인 심층 분석 & 원클릭 전화 연결 모달 */}
      <IntakeDetailModal
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={handleModalStatusChange}
      />
    </div>
  )
}
