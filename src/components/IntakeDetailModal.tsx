'use client'

import { useState } from 'react'
import { 
  X, PhoneCall, ShieldCheck, AlertCircle, Clock, 
  Sparkles, CheckCircle2, User, HelpCircle, Phone, ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { IntakeLeadItem } from '@/actions/leads'
import { updateLeadStatus } from '@/actions/leads'

interface IntakeDetailModalProps {
  lead: IntakeLeadItem | null
  onClose: () => void
  onStatusChange?: (leadId: string, newStatus: 'NEW' | 'CONTACTED' | 'VISITING' | 'WON' | 'CLOSED') => void
}

export function IntakeDetailModal({ lead, onClose, onStatusChange }: IntakeDetailModalProps) {
  const [currentStatus, setCurrentStatus] = useState<'NEW' | 'CONTACTED' | 'VISITING' | 'WON' | 'CLOSED'>(lead?.status || 'NEW')
  const [isUpdating, setIsUpdating] = useState(false)

  if (!lead) return null

  const handleStatusUpdate = async (newStatus: 'NEW' | 'CONTACTED' | 'VISITING' | 'WON' | 'CLOSED') => {
    setIsUpdating(true)
    try {
      const res = await updateLeadStatus(lead.id, newStatus)
      if (res.success) {
        setCurrentStatus(newStatus)
        if (onStatusChange) {
          onStatusChange(lead.id, newStatus)
        }
      }
    } catch (err) {
      console.error('Failed to update lead status:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 상단 헤더 */}
        <div className="p-5 pb-4 bg-gradient-to-r from-sky-50 via-indigo-50/40 to-white border-b border-slate-100 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#0284C7] bg-[#E0F2FE] px-2 py-0.5 rounded-full flex items-center gap-1 border border-sky-200/60">
                <Sparkles className="w-2.5 h-2.5" /> Jev AI 사건 정밀 트리아지
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {lead.minutesAgo}분 전 접수
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-slate-700" />
              {lead.rawName || lead.name}
              <span className="text-xs font-normal text-slate-500 font-mono">({lead.rawPhone || lead.phoneMasked})</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 모달 바디 스크롤 영역 */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* 1. Jev AI 판별 결과 배너 */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${lead.jevScore >= 70 ? 'bg-rose-400 animate-ping' : 'bg-sky-400'}`} />
                <span className="text-xs font-extrabold tracking-wide text-slate-200">
                  수임 긴급도 지수
                </span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                  lead.jevScore >= 70 ? 'bg-rose-500/30 text-rose-300 border border-rose-400/40' : 'bg-sky-500/30 text-sky-200 border border-sky-400/40'
                }`}>
                  {lead.jevScore}% {lead.isUrgent ? '(🚨 골든타임)' : '(보통)'}
                </span>
              </div>
              <span className="text-sm font-black text-amber-300">
                💰 착수금 약 {lead.contractAmount}
              </span>
            </div>

            <div className="text-xs text-slate-300 bg-white/10 p-2.5 rounded-lg flex items-center justify-between">
              <span>{lead.actionText}</span>
              <span className="text-[11px] text-amber-200/90 font-medium">10분 내 통화 시 수임률 4.2배↑</span>
            </div>
          </div>

          {/* 2. 사건 개요 & 진행 단계 */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                ⚖️ 분야: <strong className="text-slate-900">{lead.category}</strong>
              </span>
              <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-semibold text-slate-600 text-[11px]">
                단계: {lead.stage}
              </span>
            </div>
            <div className="p-3 bg-white rounded-lg border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
              <strong className="block text-slate-900 font-bold mb-1">📝 의뢰인 사연:</strong>
              {lead.summary}
            </div>
          </div>

          {/* 3. 🎯 통화 시 반드시 확인할 핵심 질문 3가지 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
              <span>Jev 권장: 통화 시 확인해야 할 핵심 쟁점 3가지</span>
            </div>
            <div className="space-y-1.5">
              {lead.recommendedQuestions.map((q, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-indigo-50/50 border border-indigo-100 flex items-start gap-2 text-xs text-slate-700">
                  <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-snug">{q}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 4. 상태 변경 토글 바 */}
          <div className="pt-2">
            <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
              📌 수임 진행 상태 관리:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('NEW')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  currentStatus === 'NEW'
                    ? 'bg-rose-50 text-rose-700 border-rose-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🔴 긴급 대기 중
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('CONTACTED')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  currentStatus === 'CONTACTED'
                    ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📞 1차 통화 완료
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('VISITING')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  currentStatus === 'VISITING'
                    ? 'bg-indigo-50 text-indigo-700 border-indigo-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                📅 방문 상담 예약
              </button>
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => handleStatusUpdate('WON')}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  currentStatus === 'WON'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300 shadow-2xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                🏆 수임 계약 완료
              </button>
            </div>
          </div>
        </div>

        {/* 모달 하단 액션 버튼 */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs font-bold h-9 px-4"
          >
            닫기
          </Button>

          {lead.rawPhone ? (
            <a 
              href={`tel:${lead.rawPhone}`} 
              className="flex-1 max-w-[260px]"
              onClick={() => {
                if (currentStatus === 'NEW') {
                  handleStatusUpdate('CONTACTED')
                }
              }}
            >
              <Button 
                size="sm" 
                className="w-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs h-9 shadow-xs gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                의뢰인 전화 연결 ({lead.rawPhone})
              </Button>
            </a>
          ) : (
            <span className="text-xs text-slate-400">연락처 미기재</span>
          )}
        </div>
      </div>
    </div>
  )
}
