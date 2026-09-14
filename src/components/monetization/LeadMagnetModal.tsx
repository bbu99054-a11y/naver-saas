'use client'

import React, { useState } from 'react'
import {
  X,
  FileText,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  Loader2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Download
} from 'lucide-react'

export interface LeadMagnetModalProps {
  isOpen: boolean
  onClose: () => void
  toolSource?: string
  title?: string
  description?: string
  leadType?: 'audit_report' | 'ebook' | 'saas_trial' | 'contact'
  downloadUrl?: string
  metadata?: Record<string, any>
}

export default function LeadMagnetModal({
  isOpen,
  onClose,
  toolSource = 'adcheck',
  title = '2026 전문직 법정 광고 금칙어 500제 가이드북 무료 다운로드',
  description = '변호사·세무사·의료법 필수 필터링 단어와 적법 대체 문안 총망라 PDF (A4 28P)',
  leadType = 'audit_report',
  downloadUrl,
  metadata = {}
}: LeadMagnetModalProps) {
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() && !phone.trim()) {
      setErrorMsg('이메일 주소 또는 휴대폰 번호 중 하나는 반드시 입력해 주세요.')
      return
    }

    setSubmitting(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSource,
          leadType,
          email: email.trim(),
          phone: phone.trim() || undefined,
          businessName: businessName.trim() || undefined,
          industry: industry.trim() || undefined,
          metadata
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSuccess(true)
      } else {
        setErrorMsg(data.error || '신청 처리 중 오류가 발생했습니다. 다시 시도해 주세요.')
      }
    } catch (err: any) {
      setErrorMsg('네트워크 통신 오류가 발생했습니다: ' + (err.message || '잠시 후 다시 시도해 주세요.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setSuccess(false)
    setBusinessName('')
    setEmail('')
    setPhone('')
    setIndustry('')
    setErrorMsg('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* 상단 엑센트 바 */}
        <div className="h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500" />

        {/* 닫기 버튼 */}
        <button
          onClick={handleReset}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {success ? (
            <div className="text-center py-4 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                신청이 완료되었습니다!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                입력하신 <strong className="text-emerald-700 font-mono">{email || phone}</strong>으로<br />
                심층 진단 리포트 및 가이드북이 안전하게 전송됩니다.
              </p>

              {downloadUrl && (
                <div className="mb-6">
                  <a
                    href={downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
                  >
                    <Download className="w-4 h-4" />
                    PDF 자료 즉시 열기 / 다운로드
                  </a>
                </div>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-500 text-left space-y-1">
                <p className="flex items-center gap-1.5 font-bold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 개인정보 안전 암호화 완료
                </p>
                <p>본 자료는 전문직 광고 규정 및 마케팅 준수 가이드 목적으로만 제공됩니다.</p>
              </div>

              <button
                onClick={handleReset}
                className="mt-6 w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm transition-all"
              >
                확인
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-blue-700 text-xs font-extrabold mb-3">
                  <Sparkles className="w-3.5 h-3.5" /> 100% 무료 제공 (한정 배포)
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                  {title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  {description}
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    상호명 / 성함 (선택)
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="예: 법무법인 포스트 / 홍길동 세무사"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    자료 수신 이메일 <span className="text-rose-500 font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="report@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    휴대폰 번호 (문자 알림 희망 시 선택)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    업종 / 분야 (선택)
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-700"
                  >
                    <option value="">업종을 선택해 주세요</option>
                    <option value="변호사/법률">변호사 / 법률사무소</option>
                    <option value="세무사/회계">세무사 / 회계법인</option>
                    <option value="병원/의료">병원 / 의원 / 치과 / 한의원</option>
                    <option value="노무사/행정사">노무사 / 행정사</option>
                    <option value="이커머스/셀러">스마트스토어 / 쇼핑몰 셀러</option>
                    <option value="기타/일반">기타 자영업 / 전문직</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold rounded-xl text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        안전하게 신청 중...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4" />
                        무료 진단서 및 가이드북 즉시 신청하기
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> 스팸 없음 · 입력 정보는 리포트 발송 용도 외 일체 사용되지 않습니다.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
