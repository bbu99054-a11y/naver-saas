'use client'

import { useState } from 'react'
import { Send, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const INQUIRY_TYPES = [
  'SaaS 도입 및 요금제 안내',
  '로펌 맞춤 세팅 & 온보딩',
  '제휴 및 파트너십',
  '시스템 장애 및 기술 지원',
  '기타 일반 문의'
]

export default function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [inquiryType, setInquiryType] = useState(INQUIRY_TYPES[0])
  const [message, setMessage] = useState('')
  const [agreed, setAgreed] = useState(true)

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!name.trim()) {
      setErrorMessage('성함 또는 상호명을 입력해 주세요.')
      return
    }
    if (!phone.trim()) {
      setErrorMessage('회신받으실 연락처를 입력해 주세요.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('올바른 이메일 주소를 입력해 주세요.')
      return
    }
    if (!message.trim()) {
      setErrorMessage('문의 내용을 입력해 주세요.')
      return
    }
    if (!agreed) {
      setErrorMessage('개인정보 수집 및 이용에 동의해 주세요.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSource: 'contact',
          leadType: 'inquiry',
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          businessName: name.trim(),
          metadata: {
            inquiryType,
            message: message.trim(),
          },
        }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        throw new Error(data.error || '문의 접수 중 오류가 발생했습니다.')
      }

      setSuccess(true)
    } catch (err: any) {
      setErrorMessage(err.message || '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setName('')
    setPhone('')
    setEmail('')
    setMessage('')
    setInquiryType(INQUIRY_TYPES[0])
    setSuccess(false)
    setErrorMessage(null)
  }

  if (success) {
    return (
      <div className="bg-white/5 border border-emerald-500/30 rounded-3xl p-8 sm:p-12 text-center backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-5 border border-emerald-500/40">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">문의가 성공적으로 접수되었습니다</h3>
        <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed mb-6">
          기재해 주신 연락처(<strong className="text-white">{phone}</strong>)와 이메일(<strong className="text-white">{email}</strong>)로
          전담 매니저가 영업시간 기준 <strong className="text-emerald-400">4시간 이내</strong>에 신속히 회신드리겠습니다.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-4 py-2 rounded-full border border-white/10 mb-8">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>대표 관리자 텔레그램으로 접수 알림이 전송되었습니다.</span>
        </div>
        <div>
          <Button
            onClick={handleReset}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 text-xs font-semibold px-6 py-2.5 rounded-xl cursor-pointer"
          >
            새 문의 작성하기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div id="inquiry-form" className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            1:1 온라인 빠른 문의 양식
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            전문 상담 매니저에게 직접 문의하기
          </h2>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1.5 rounded-full self-start sm:self-auto text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>영업시간 내 평균 4시간 회신</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. 문의 유형 선택 */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-2.5">
            문의 유형 <span className="text-indigo-400">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {INQUIRY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInquiryType(type)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold text-left transition-all border ${
                  inquiryType === type
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 이름 / 상호명 & 연락처 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              성함 / 로펌(상호명) <span className="text-indigo-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동 변호사 / 법률사무소 OO"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              회신받으실 연락처 <span className="text-indigo-400">*</span>
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="예: 010-1234-5678"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* 3. 이메일 주소 */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            답변받으실 이메일 주소 <span className="text-indigo-400">*</span>
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="예: contact@lawfirm.com"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-800/80 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>

        {/* 4. 문의 상세 내용 */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            문의 상세 내용 <span className="text-indigo-400">*</span>
          </label>
          <textarea
            required
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="궁금하신 점이나 로펌 마케팅/도입 고민을 자유롭게 적어주세요. 상세히 남겨주실수록 더 정확한 상담이 가능합니다."
            className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-white/15 text-white placeholder-slate-500 text-xs focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-y leading-relaxed"
          />
        </div>

        {/* 5. 개인정보 동의 */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="privacy-consent"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-4 h-4 rounded-sm border-white/20 bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
          />
          <label htmlFor="privacy-consent" className="text-xs text-slate-400 select-none cursor-pointer">
            [필수] 문의 처리를 위한 성명, 연락처, 이메일 등 개인정보 수집 및 이용에 동의합니다.
          </label>
        </div>

        {/* 6. 제출 버튼 */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>문의 접수 중입니다...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>문의 접수하기</span>
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
