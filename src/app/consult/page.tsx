'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, CheckCircle2, Clock, Lock, ArrowLeft, PhoneCall, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'

const SPECIALTIES = [
  { id: 'criminal_dui', label: '형사 사건 (음주운전, 사기, 마약 등)', icon: '⚖️' },
  { id: 'family_divorce', label: '가사 · 이혼 · 상간자 · 재산분할', icon: '👨‍👩‍👧' },
  { id: 'realestate_lease', label: '부동산 · 명도소송 · 전세사기 · 보증금', icon: '🏠' },
  { id: 'corporate_crime', label: '기업법무 · 횡령/배임 · 영업비밀', icon: '🏢' },
  { id: 'warrant_urgent', label: '긴급 구속영장 실질심사 · 압수수색', icon: '🚨' },
  { id: 'civil_tort', label: '민사소송 · 손해배상 · 대여금 반환', icon: '📝' }
]

const STAGES = [
  '경찰/검찰 출석 통보 전 (사전 대응 및 양형자료 준비)',
  '경찰 출석 요구서 수령 / 피의자 신문 조사 예정',
  '1차 경찰 조사 완료 (불리한 진술 번복/방어 필요)',
  '구속영장 청구 / 긴급체포 등 영장실질심사 대기',
  '검찰 송치 및 기소 / 법원 1심 재판 진행 중',
  '소장(민사/이혼) 수령 후 30일 답변서 제출 기한 임박'
]

export default function ConsultIntakePage() {
  const [selectedSpecialty, setSelectedSpecialty] = useState('')
  const [selectedStage, setSelectedStage] = useState('')
  const [caseSummary, setCaseSummary] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientPhone || clientPhone.length < 9) {
      setErrorMessage('연락받으실 전화번호를 올바르게 입력해 주세요.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSource: 'consult_intake',
          leadType: 'consulting',
          name: clientName || '익명 의뢰인',
          phone: clientPhone,
          email: clientEmail || `${clientPhone.replace(/[^0-9]/g, '')}@postsync.consult`,
          businessName: '1분 안심 진단 신청',
          industry: selectedSpecialty || '법률·세무',
          metadata: {
            specialty: selectedSpecialty,
            stage: selectedStage,
            summary: caseSummary,
            submittedAt: new Date().toISOString()
          }
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setIsSuccess(true)
      } else {
        setErrorMessage(data.error || '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      }
    } catch {
      setErrorMessage('서버와 통신할 수 없습니다. 전화로 직접 문의해 주세요.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F8FC] flex flex-col justify-between text-slate-800">
      {/* 🌟 상단 클린 헤더 */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <Link href="/" className="flex items-center gap-2 text-slate-900 font-black text-lg hover:opacity-80 transition-opacity">
          <span className="w-8 h-8 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-bold text-sm shadow-xs">
            P
          </span>
          <span>PostSync <span className="text-[#0284C7] font-semibold text-xs ml-1 bg-[#E0F2FE] px-2 py-0.5 rounded-full">안심 진단</span></span>
        </Link>
        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-[#0284C7]" />
          <span>100% 비밀 보장 상담</span>
        </div>
      </header>

      {/* 🌟 메인 진단 컨테이너 */}
      <main className="max-w-xl w-full mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-sm">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl shadow-xs">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                사건 상담 신청이 정상 접수되었습니다!
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
                담당 변호사 사무실로 실시간 전달되었습니다.<br />
                골든타임 내에 남겨주신 연락처(<strong className="text-slate-900">{clientPhone}</strong>)로 비밀 보장 유선 안내를 드립니다.
              </p>
              <div className="pt-4">
                <Link href="/">
                  <Button className="bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-full px-6 text-xs font-bold h-10">
                    홈으로 돌아가기
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 상단 타이틀 */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-extrabold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>사건 1분 안심 진단 센터</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  현재 처하신 상황을 선택해 주세요
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  사무소 방문 전, 전담 변호사가 1차 법적 쟁점을 신속히 사전 검토해 드립니다.
                </p>
              </div>

              {/* 단계 1: 사건 분야 선택 */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <span>1. 상담 분야를 선택해 주세요</span>
                  <span className="text-[#FF6B00]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SPECIALTIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedSpecialty(item.label)}
                      className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                        selectedSpecialty === item.label
                          ? 'border-[#0284C7] bg-[#E0F2FE]/50 text-[#0284C7] ring-1 ring-[#0284C7]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="text-base">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 단계 2: 현재 진행 단계 */}
              <div className="space-y-2.5">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <span>2. 현재 어떤 단계이신가요?</span>
                </label>
                <div className="space-y-2">
                  {STAGES.map((stg) => (
                    <label
                      key={stg}
                      onClick={() => setSelectedStage(stg)}
                      className={`flex items-center gap-3 p-3 rounded-2xl border text-xs font-semibold cursor-pointer transition-all ${
                        selectedStage === stg
                          ? 'border-[#0284C7] bg-[#E0F2FE]/50 text-[#0284C7]'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="stage"
                        checked={selectedStage === stg}
                        onChange={() => setSelectedStage(stg)}
                        className="text-[#0284C7] focus:ring-[#0284C7]"
                      />
                      <span>{stg}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 단계 3: 연락처 및 성함 입력 */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-xs font-black text-slate-700 flex items-center gap-1">
                  <span>3. 비밀 상담 결과를 수신할 연락처</span>
                  <span className="text-[#FF6B00]">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder="성함 (또는 익명)"
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder="연락처 (예: 010-1234-5678)"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7]"
                    />
                  </div>
                </div>
                <div>
                  <textarea
                    rows={3}
                    placeholder="간단한 사건 경위나 가장 궁금하신 점 (선택사항 - 자세할수록 정확한 상담이 가능합니다)"
                    value={caseSummary}
                    onChange={(e) => setCaseSummary(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7] focus:ring-1 focus:ring-[#0284C7] resize-none"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMessage}
                </p>
              )}

              {/* 액션 버튼 (Lawmatics 대표 시그니처 웜 오렌지) */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-13 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-sm rounded-full shadow-md transition-transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>안전하게 접수 중...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>비밀 상담 무료 진단 접수하기 ➔</span>
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  변호사법·세무사법 비밀보장
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#0284C7]" />
                  골든타임 내 순차 연락
                </span>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        © 2026 PostSync Pro Client Intake Center · 본 서비스는 전문직 광고 규정을 철저히 준수합니다.
      </footer>
    </div>
  )
}
