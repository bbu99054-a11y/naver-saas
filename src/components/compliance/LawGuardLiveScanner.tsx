'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ShieldCheck, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Check, 
  Loader2, 
  FileText, 
  Scale, 
  RotateCcw,
  Zap,
  Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ViolationItem {
  word: string
  law: string
  article: string
  reason: string
  replacement: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  contextSentence?: string
}

interface ScanResult {
  isCompliant: boolean
  violationProbability: number
  riskLevel: 'SAFE' | 'CAUTION' | 'CRITICAL'
  violations: ViolationItem[]
  jevAnalysis?: {
    isResultGuaranteed: number
    isSuperlative: number
    isInfluencePeddling: number
    isPredatoryPricing: number
    summary: string
  }
}

const PRESET_EXAMPLES = [
  {
    label: '🚨 대행사 단골 위반 원고 (형사/음주)',
    badge: '위반 3건',
    text: '음주운전 2진 아웃 100% 승소 보장! 서초동 1위 부장판사 출신 전관 변호사의 힘으로 구속영장 기각과 불송치를 이끌어냅니다. 타 로펌 대비 50% 저렴한 최저가 수임료와 무료 상담을 약속합니다.'
  },
  {
    label: '⚠️ 교묘한 우회 과장형 (이혼/가사)',
    badge: '위반 2건',
    text: '이혼 재산분할 승소율 1위, 국내 유일한 가사 전담 로펌! 다른 변호사는 못하는 완벽한 승소로 착수금 0원에 위자료를 전액 환급받아 드립니다.'
  },
  {
    label: '✅ 로가드 23 합법 모범 원고',
    badge: '적법 100%',
    text: '음주운전 2진 아웃 위기, 대법원 양형 기준과 축적된 실무 판례를 토대로 구속영장 실질심사 및 면허취소 감경을 위한 체계적인 법리 방어를 제공합니다. 1차 사건 쟁점 사전 검토를 통해 투명하고 정직한 조력을 약속드립니다.'
  }
]

export default function LawGuardLiveScanner() {
  const [inputText, setInputText] = useState(PRESET_EXAMPLES[0].text)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [cleanedText, setCleanedText] = useState('')
  const [copied, setCopied] = useState(false)
  const [hasScanned, setHasScanned] = useState(false)

  // 검사 실행
  const handleScan = async (textToScan?: string) => {
    const targetText = textToScan !== undefined ? textToScan : inputText
    if (!targetText.trim()) return

    setIsLoading(true)
    setHasScanned(true)

    try {
      const res = await fetch('/api/adcheck/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: targetText })
      })

      if (!res.ok) {
        throw new Error('검사 요청 실패')
      }

      const data: ScanResult = await res.json()
      setResult(data)

      // 위반 단어 대체본(합법 정화본) 생성
      let sanitized = targetText
      if (data.violations && data.violations.length > 0) {
        for (const v of data.violations) {
          if (v.word && v.replacement && !v.word.startsWith('[')) {
            // 정규식 특수문자 이스케이프
            const escaped = v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
            sanitized = sanitized.replace(new RegExp(escaped, 'g'), v.replacement)
          }
        }
      }
      setCleanedText(sanitized)
    } catch (err) {
      console.error('[LawGuardLiveScanner] Scan error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 예시 불러오기
  const handleLoadPreset = (text: string) => {
    setInputText(text)
    setResult(null)
    setHasScanned(false)
    setCleanedText('')
    // 즉시 자동 검사 트리거
    handleScan(text)
  }

  // 텍스트 초기화
  const handleReset = () => {
    setInputText('')
    setResult(null)
    setHasScanned(false)
    setCleanedText('')
  }

  // 정화본 복사
  const handleCopyCleaned = async () => {
    if (!cleanedText) return
    try {
      await navigator.clipboard.writeText(cleanedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed', err)
    }
  }

  return (
    <div className="w-full bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden">
      {/* 1. 상단 컨트롤 바 */}
      <div className="bg-slate-900 text-white p-5 sm:p-7 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-400 flex items-center justify-center font-black text-sm">
              <Scale className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm sm:text-base tracking-tight text-white">
                  로가드 23 (LawGuard 23)
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500 text-slate-950">
                  실시간 검역 LIVE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                대한민국 변호사법 제23조 및 변협 광고규정 120대 금칙어 0.05초 심층 검역
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>엔진 가동 중</span>
          </div>
        </div>

        {/* 원클릭 예시 불러오기 칩 버튼 */}
        <div className="pt-2">
          <p className="text-[11px] text-slate-400 font-medium mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>원클릭 실제 대행사 원고 테스트:</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESET_EXAMPLES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadPreset(preset.text)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-sky-400 text-xs text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
              >
                <span>{preset.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${
                  idx === 2 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {preset.badge}
                </span>
              </button>
            ))}
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>초기화</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 원고 입력 에디터 & 검사 버튼 */}
      <div className="p-5 sm:p-7 space-y-4 bg-slate-50/50">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <label htmlFor="lawguard-input" className="font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>검사할 블로그·플레이스 원고 붙여넣기</span>
            </label>
            <span className="font-mono text-[11px]">
              {inputText.length} / 3,000자
            </span>
          </div>

          <textarea
            id="lawguard-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="대행사가 작성해준 블로그 원고나 홈페이지 소개글을 이곳에 붙여넣으세요..."
            rows={4}
            className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-[#0284C7] focus:ring-2 focus:ring-[#0284C7]/20 outline-none text-xs sm:text-sm text-slate-800 bg-white leading-relaxed resize-y transition-all"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <p className="text-[11px] text-slate-500 leading-tight">
            * 입력하신 텍스트는 서버에 저장되지 않으며, 변호사법 제23조 검역 즉시 파기됩니다.
          </p>

          <Button
            type="button"
            onClick={() => handleScan()}
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto h-12 px-6 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-98"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>로가드 23 심층 검역 중...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-sky-200" />
                <span>로가드 23 1초 안심 검사 실행</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* 3. 진단 결과 표시 영역 */}
      {result && (
        <div className="p-5 sm:p-7 border-t border-slate-200/90 bg-white space-y-6 animate-in fade-in duration-300">
          {/* A. 종합 진단 헤더 카드 */}
          <div className={`p-5 rounded-2xl border-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
            result.riskLevel === 'CRITICAL'
              ? 'bg-rose-50/70 border-rose-300 text-rose-950'
              : result.riskLevel === 'CAUTION'
              ? 'bg-amber-50/70 border-amber-300 text-amber-950'
              : 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3.5">
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                result.riskLevel === 'CRITICAL'
                  ? 'bg-rose-500 text-white'
                  : result.riskLevel === 'CAUTION'
                  ? 'bg-amber-500 text-white'
                  : 'bg-emerald-500 text-white'
              }`}>
                {result.riskLevel === 'CRITICAL' ? (
                  <ShieldAlert className="w-6 h-6" />
                ) : result.riskLevel === 'CAUTION' ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <ShieldCheck className="w-6 h-6" />
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${
                    result.riskLevel === 'CRITICAL'
                      ? 'bg-rose-600 text-white'
                      : result.riskLevel === 'CAUTION'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}>
                    {result.riskLevel === 'CRITICAL' ? '🚨 징계 위험 (CRITICAL)' : result.riskLevel === 'CAUTION' ? '⚠️ 주의 요망 (CAUTION)' : '✅ 100% 안심 적법 (SAFE)'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    위반 확률: {result.violationProbability}%
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-slate-900">
                  {result.riskLevel === 'CRITICAL'
                    ? '변호사법 제23조 위반 소지가 매우 높습니다 (변협 징계·과태료 위험)'
                    : result.riskLevel === 'CAUTION'
                    ? '경미한 과장 표현이 감지되었습니다 (수정 권고)'
                    : '대한변호사협회 광고 규정에 완벽히 부합하는 품격 있는 원고입니다'}
                </h4>
                <p className="text-xs text-slate-600">
                  {result.riskLevel === 'CRITICAL'
                    ? '적발된 표현은 타 로펌의 악의적 진정 대상이 될 수 있으므로 즉시 수정을 강력히 권고합니다.'
                    : result.riskLevel === 'CAUTION'
                    ? '소비자 오도 우려가 있는 단어를 객관적 실무 안내 문구로 순화하세요.'
                    : '징계 걱정 없이 네이버 블로그 및 스마트플레이스에 바로 게시하실 수 있습니다.'}
                </p>
              </div>
            </div>

            <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200/80 text-center shrink-0 w-full md:w-auto shadow-2xs">
              <span className="text-[10px] font-bold text-slate-500 block">검역 적발 건수</span>
              <span className={`text-2xl font-black ${
                result.violations.length > 0 ? 'text-rose-600' : 'text-emerald-600'
              }`}>
                {result.violations.length}건
              </span>
            </div>
          </div>

          {/* B. 로가드 23 4대 문맥 지표 미터기 */}
          {result.jevAnalysis && (
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-sky-600" />
                  <span>로가드 23 의미론적 4대 문맥 심층 감별</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  평가: {result.jevAnalysis.summary}
                </span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                {/* 1. 결과 보장 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">결과 보장/승소율</span>
                    <span className={`font-mono font-black ${result.jevAnalysis.isResultGuaranteed > 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {result.jevAnalysis.isResultGuaranteed}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.jevAnalysis.isResultGuaranteed > 50 ? 'bg-rose-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${Math.min(100, result.jevAnalysis.isResultGuaranteed)}%` }}
                    />
                  </div>
                </div>

                {/* 2. 최상급 표방 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">최상급/순위 표방</span>
                    <span className={`font-mono font-black ${result.jevAnalysis.isSuperlative > 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {result.jevAnalysis.isSuperlative}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.jevAnalysis.isSuperlative > 50 ? 'bg-rose-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${Math.min(100, result.jevAnalysis.isSuperlative)}%` }}
                    />
                  </div>
                </div>

                {/* 3. 전관예우 암시 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">전관예우/인맥 표방</span>
                    <span className={`font-mono font-black ${result.jevAnalysis.isInfluencePeddling > 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {result.jevAnalysis.isInfluencePeddling}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.jevAnalysis.isInfluencePeddling > 50 ? 'bg-rose-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${Math.min(100, result.jevAnalysis.isInfluencePeddling)}%` }}
                    />
                  </div>
                </div>

                {/* 4. 부당 염가 */}
                <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">부당 염가/덤핑 유인</span>
                    <span className={`font-mono font-black ${result.jevAnalysis.isPredatoryPricing > 50 ? 'text-rose-600' : 'text-slate-700'}`}>
                      {result.jevAnalysis.isPredatoryPricing}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.jevAnalysis.isPredatoryPricing > 50 ? 'bg-rose-500' : 'bg-sky-500'
                      }`}
                      style={{ width: `${Math.min(100, result.jevAnalysis.isPredatoryPricing)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* C. 적발된 위반 단어 카드 리스트 */}
          {result.violations.length > 0 && (
            <div className="space-y-3">
              <span className="text-xs font-black text-slate-800 block">
                적발된 위반 조항 및 대체 표현 ({result.violations.length}건)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.violations.map((violation, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-rose-200 bg-rose-50/30 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-black text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                        {violation.word}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">
                        {violation.article}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      <strong className="text-slate-800">위반 사유:</strong> {violation.reason}
                    </p>

                    <div className="p-2.5 bg-white rounded-xl border border-emerald-200 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-[11px]">
                        <span className="font-bold text-emerald-700">추천 대체 표현:</span>
                        <p className="text-slate-800 font-medium mt-0.5">{violation.replacement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* D. 로가드 23 합법 정화본 원클릭 미리보기 & 복사 */}
          {cleanedText && result.violations.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-sky-50/60 border-2 border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="font-black text-emerald-950 text-xs sm:text-sm">
                    ✨ 로가드 23 원클릭 합법 정화 완성본
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCleaned}
                  className="px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>복사 완료!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>정화본 복사하기</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-200 text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {cleanedText}
              </div>
            </div>
          )}

          {/* E. B2B SaaS 고전환 CTA 카드 */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-[#0369A1] to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg">
            <div className="space-y-1.5 text-center md:text-left">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-sky-200 text-[10px] font-black uppercase">
                Zero Disciplinary Guarantee
              </span>
              <h4 className="text-base sm:text-lg font-black tracking-tight text-white">
                매달 300만 원 내면서 징계 걱정에 불안해하지 마세요
              </h4>
              <p className="text-xs text-sky-100 max-w-xl leading-relaxed">
                로가드 23이 24시간 실시간 감시하는 징계 0건 원고 생성부터, 1분 안심 진단 폼과 실시간 수임 파이프라인까지. PostSync Pro에서 월 19만 원에 전자동으로 구축하세요.
              </p>
            </div>

            <Link href="/dashboard" className="shrink-0 w-full md:w-auto">
              <Button className="w-full md:w-auto h-12 px-6 rounded-full bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs sm:text-sm shadow-md cursor-pointer flex items-center justify-center gap-2">
                <span>무료로 수임 시스템 시작하기</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
