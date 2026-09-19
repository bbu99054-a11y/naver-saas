'use client'

import { useState } from 'react'
import { 
  Plus, 
  Phone, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Search, 
  Filter,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface LeadCard {
  id: string
  name: string
  phone: string
  specialty: string
  source: string
  stage: 'NEW' | 'CONSULTING' | 'VISITING' | 'RETAINED'
  estimatedFee: string
  createdAt: string
  summary: string
}

const INITIAL_LEADS: LeadCard[] = [
  {
    id: 'lead-1',
    name: '김*현 의뢰인',
    phone: '010-8472-****',
    specialty: '음주운전 2진 구제',
    source: '블로그 [음주운전 판례 분석]',
    stage: 'NEW',
    estimatedFee: '5,500,000원',
    createdAt: '10분 전',
    summary: '혈중알코올농도 0.082%, 생계형 화물 운전 기사로 면허취소 구제 행정심판 및 형사 조력 희망'
  },
  {
    id: 'lead-2',
    name: '이*우 의뢰인',
    phone: '010-3321-****',
    specialty: '상간자 위자료 청구 소송',
    source: '블로그 [상간 소송 승소 요건]',
    stage: 'NEW',
    estimatedFee: '5,500,000원',
    createdAt: '45분 전',
    summary: '배우자 부정행위 증거(메신저/차량 블랙박스) 확보 완료, 위자료 3,000만 원 청구 소송 상담 희망'
  },
  {
    id: 'lead-3',
    name: '박*서 의뢰인',
    phone: '010-9120-****',
    specialty: '이혼 및 재산분할',
    source: '네이버 스마트플레이스',
    stage: 'CONSULTING',
    estimatedFee: '7,000,000원',
    createdAt: '어제',
    summary: '1차 유선 통화 완료. 혼인 기간 14년, 특유재산 기여도 입증 관련 방문 일정 조율 중'
  },
  {
    id: 'lead-4',
    name: '최*민 의뢰인',
    phone: '010-4491-****',
    specialty: '업무상 횡령 피의사건 방어',
    source: '블로그 [횡령죄 성립요건 및 양형]',
    stage: 'VISITING',
    estimatedFee: '15,000,000원',
    createdAt: '2일 전',
    summary: '법인 자금 2억 5천만 원 횡령 혐의 피소. 내일 오후 2시 대표변호사 대면 미팅 및 구속영장 실질심사 대비'
  },
  {
    id: 'lead-5',
    name: '정*훈 의뢰인',
    phone: '010-6712-****',
    specialty: '상가 명도 및 보증금 반환',
    source: '블로그 [명도소송 3대 주의점]',
    stage: 'RETAINED',
    estimatedFee: '4,400,000원',
    createdAt: '3일 전',
    summary: '계약서 날인 및 착수금 입금 완료. 점유이전금지가처분 신청서 법원 접수 진행'
  }
]

const COLUMNS = [
  { 
    id: 'NEW', 
    title: '1. 신규 접수', 
    badgeBg: 'bg-[#E0F2FE]', 
    badgeText: 'text-[#0284C7]', 
    borderColor: 'border-[#0284C7]',
    subText: '골든타임 10분 내 1차 전화 연결'
  },
  { 
    id: 'CONSULTING', 
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
    id: 'RETAINED', 
    title: '4. 수임 계약 완료', 
    badgeBg: 'bg-emerald-50', 
    badgeText: 'text-emerald-700', 
    borderColor: 'border-emerald-500',
    subText: '착수금 입금 및 정식 위임 체결'
  }
]

export default function PipelinePage() {
  const [leads, setLeads] = useState<LeadCard[]>(INITIAL_LEADS)
  const [selectedLead, setSelectedLead] = useState<LeadCard | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // 다음 단계로 이동
  const advanceStage = (id: string, currentStage: LeadCard['stage']) => {
    const stageOrder: LeadCard['stage'][] = ['NEW', 'CONSULTING', 'VISITING', 'RETAINED']
    const nextIndex = stageOrder.indexOf(currentStage) + 1
    if (nextIndex < stageOrder.length) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: stageOrder[nextIndex] } : l))
    }
  }

  // 이전 단계로 이동
  const rewindStage = (id: string, currentStage: LeadCard['stage']) => {
    const stageOrder: LeadCard['stage'][] = ['NEW', 'CONSULTING', 'VISITING', 'RETAINED']
    const prevIndex = stageOrder.indexOf(currentStage) - 1
    if (prevIndex >= 0) {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, stage: stageOrder[prevIndex] } : l))
    }
  }

  const filteredLeads = leads.filter(l => 
    l.name.includes(searchTerm) || 
    l.specialty.includes(searchTerm) || 
    l.summary.includes(searchTerm)
  )

  return (
    <div className="space-y-6 pb-12">
      {/* 🌟 상단 타이틀 & Lawmatics 액션 바 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-pulse"></span>
            <span className="text-xs font-black text-[#0284C7] tracking-wider uppercase">
              PostSync Intake & Retainer Pipeline
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            수임 파이프라인 관리 (단계별 상담·계약 현황)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            블로그와 1분 진단 폼에서 유입된 의뢰인을 수임 계약까지 한눈에 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        </div>
      </div>

      {/* 🌟 통계 지표 요약 바 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500">진행 중인 의뢰인</div>
          <div className="text-xl font-black text-slate-900 mt-1">{leads.length}명</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-[#0284C7]/30 bg-[#E0F2FE]/20 shadow-2xs">
          <div className="text-[11px] font-bold text-[#0284C7]">신규 미처리 상담</div>
          <div className="text-xl font-black text-[#0284C7] mt-1">
            {leads.filter(l => l.stage === 'NEW').length}건
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200/70 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500">방문 상담 확정</div>
          <div className="text-xl font-black text-indigo-600 mt-1">
            {leads.filter(l => l.stage === 'VISITING').length}건
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-700">이달 수임 계약액</div>
          <div className="text-xl font-black text-emerald-600 mt-1">
            {leads.filter(l => l.stage === 'RETAINED').length * 4.4}백만원
          </div>
        </div>
      </div>

      {/* 🌟 4단계 Lawmatics형 칸반 보드 컬럼 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colLeads = filteredLeads.filter(l => l.stage === col.id)
          return (
            <div 
              key={col.id} 
              className="bg-[#F8FAFC] border border-slate-200 rounded-2xl p-3.5 flex flex-col min-h-[480px]"
            >
              {/* 컬럼 헤더 */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <span>{col.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${col.badgeBg} ${col.badgeText}`}>
                      {colLeads.length}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">{col.subText}</p>
                </div>
              </div>

              {/* 의뢰인 카드 목록 */}
              <div className="space-y-3 flex-1 overflow-y-auto">
                {colLeads.length === 0 ? (
                  <div className="h-32 flex flex-col items-center justify-center text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-white/50">
                    <span>해당 단계의 의뢰인이 없습니다.</span>
                  </div>
                ) : (
                  colLeads.map((lead) => (
                    <div
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white border border-slate-200/90 hover:border-[#0284C7] rounded-xl p-3.5 shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-900 group-hover:text-[#0284C7] transition-colors">
                          {lead.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">{lead.createdAt}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="inline-block px-2 py-0.5 rounded-md bg-[#E0F2FE] text-[#0284C7] font-bold text-[10px]">
                          {lead.specialty}
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                          {lead.summary}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="font-bold text-slate-700">{lead.estimatedFee}</span>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {col.id !== 'NEW' && (
                            <button
                              onClick={() => rewindStage(lead.id, lead.stage)}
                              className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold"
                              title="이전 단계로"
                            >
                              ◀
                            </button>
                          )}
                          {col.id !== 'RETAINED' && (
                            <button
                              onClick={() => advanceStage(lead.id, lead.stage)}
                              className="px-2 py-0.5 rounded bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black"
                              title="다음 단계로 이동"
                            >
                              진행 ▶
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 🌟 카드 클릭 시 상세 팝업 모달 */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full">
                  {selectedLead.specialty}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedLead.name} 의뢰인 상세</h3>
              </div>
              <button 
                onClick={() => setSelectedLead(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 bg-[#F8FAFC] rounded-xl border border-slate-200/80 space-y-1">
                <p className="text-slate-500 font-medium">연락처:</p>
                <p className="font-black text-slate-900 text-sm">{selectedLead.phone}</p>
                <p className="text-slate-500 font-medium mt-2">유입 출처:</p>
                <p className="font-bold text-[#0284C7]">{selectedLead.source}</p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">사건 1분 진단 요약 및 의뢰인 호소 내용:</p>
                <p className="p-3 bg-white rounded-xl border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedLead.summary}
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-slate-700">예상 수임료 (기준액):</p>
                <p className="text-base font-black text-emerald-600">{selectedLead.estimatedFee}</p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <Button 
                variant="outline"
                onClick={() => setSelectedLead(null)}
                className="text-xs font-bold h-9"
              >
                닫기
              </Button>
              <a href={`tel:${selectedLead.phone}`}>
                <Button className="bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold text-xs h-9 gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  유선 상담 전화걸기
                </Button>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
