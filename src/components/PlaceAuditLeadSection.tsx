'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Gift, Zap, FileText, CheckCircle2, ArrowRight, Loader2, Sparkles } from 'lucide-react'

function PlaceAuditLeadContent() {
  const searchParams = useSearchParams()
  const paramName = searchParams.get('name') || ''
  const paramEmail = searchParams.get('email') || ''
  const paramLeadId = searchParams.get('lead_id') || ''

  const [isManual, setIsManual] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [successData, setSuccessData] = useState<{ name: string; email: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (paramName) setName(paramName)
    if (paramEmail) setEmail(paramEmail)
  }, [paramName, paramEmail])

  const hasPreFill = Boolean(paramName && paramEmail) && !isManual

  const handleSubmit = async (submitName: string, submitEmail: string) => {
    if (!submitName.trim() || !submitEmail.trim()) {
      setErrorMsg('상호명과 이메일을 모두 입력해 주세요.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await fetch('/api/place-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: submitName.trim(),
          email: submitEmail.trim(),
          leadId: paramLeadId || null
        })
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSuccessData({ name: submitName, email: submitEmail })
      } else {
        setErrorMsg(data.error || '신청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
      }
    } catch (err: any) {
      setErrorMsg('서버 통신 오류: ' + (err.message || '다시 시도해 주세요.'))
    } finally {
      setLoading(false)
    }
  }

  if (successData) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 text-center shadow-lg animate-in fade-in zoom-in-95 duration-300">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">
          신청이 정상 접수되었습니다!
        </h3>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          <strong className="text-emerald-700">[{successData.name}]</strong> 귀하의 분석 요청이 등록되었습니다.<br />
          담당 연구팀의 승인 즉시 네이버 플레이스 데이터를 실시간 분석하여<br />
          <span className="font-mono font-bold text-slate-800 underline">{successData.email}</span>로 A4 1장 PDF 리포트가 발송됩니다.
        </p>
        <div className="mt-5 inline-block bg-white border border-emerald-200 text-emerald-800 text-xs px-4 py-2 rounded-full font-bold shadow-sm">
          ⏱ 영업시간 내 평균 1~2분 소요
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 border-2 border-blue-200 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500" />

      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full border border-blue-200">
          <Gift className="w-3.5 h-3.5 text-blue-600" />
          공식 배포 기념 무상 지원 혜택 (회원가입 ZERO)
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug mb-2">
        {hasPreFill ? (
          <>
            <span className="text-blue-600">[{paramName}]</span> 귀하를 위한 반경 2km 경쟁사 분석 리포트
          </>
        ) : (
          '네이버 플레이스 반경 2km 경쟁사 분석 & 상위 노출 순위 관리 리포트'
        )}
      </h2>

      <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
        변호사·세무사·의료광고 심의 규정을 100% 준수한 A4 1장 실전 브리핑 덱(PDF)을 발급해 드립니다.<br className="hidden sm:inline" />
        <strong>복잡한 회원가입 없이</strong> 신청 즉시 담당 연구팀이 데이터를 정밀 분석하여 이메일로 전달합니다.
      </p>

      {/* Mode 1: 1-Click for Cold Email Traffic */}
      {hasPreFill ? (
        <div className="bg-white border border-blue-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[11px]">신청 고객사</span>
              <strong className="text-slate-900 text-sm">{paramName}</strong>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-500 block text-[11px]">리포트 수신 이메일</span>
              <strong className="text-slate-900 text-sm font-mono">{paramEmail}</strong>
            </div>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleSubmit(paramName, paramEmail)}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>분석 신청 접수 중...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-current text-yellow-300" />
                <span>1초 만에 무료 분석 신청하기 (클릭)</span>
              </>
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsManual(true)}
              className="text-xs text-slate-500 underline hover:text-slate-800 transition"
            >
              다른 상호명이나 이메일로 받으시겠습니까? (직접 입력하기)
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: 2-Field Form for General Traffic */
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit(name, email)
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                🏢 상호명 또는 네이버 플레이스 링크 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 강남더블유치과 또는 링크"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                📧 리포트 받아보실 이메일 주소 <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>

          {errorMsg && (
            <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base py-3.5 px-6 rounded-xl shadow-lg shadow-blue-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>신청 접수 중...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-blue-200" />
                <span>반경 2km 분석 리포트 무료 신청하기 (3초 소요)</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-slate-500 text-center leading-normal">
            ※ 수집된 정보는 반경 2km 경쟁사 순위 및 리뷰 분석 리포트 발송 목적으로만 사용되며, 불필요한 광고 스팸을 발송하지 않습니다.
          </p>
        </form>
      )}
    </div>
  )
}

export default function PlaceAuditLeadSection() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">혜택 정보 로딩 중...</div>}>
      <PlaceAuditLeadContent />
    </Suspense>
  )
}
