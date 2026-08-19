'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Search,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Activity,
  FileText,
  Image as ImageIcon,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Clock,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

interface AnalysisResult {
  success: boolean
  message?: string
  post: {
    title: string
    link: string
    pubDate: string
    blogId: string
    logNo?: string
  }
  score: number
  resultType: 'EXCELLENT' | 'NEEDS_IMPROVEMENT'
  badge: string
  headline: string
  subHeadline: string
  salesPitch: string
  ctaText: string
  metrics: {
    charCount: {
      withSpaces: number
      withoutSpaces: number
      status: 'good' | 'warning' | 'danger'
      message: string
      solution: string
    }
    keywordDensity: {
      topKeywords: Array<{ word: string; count: number; density: number }>
      status: 'good' | 'warning' | 'danger'
      message: string
      solution: string
    }
    imageCount: {
      count: number
      status: 'good' | 'warning' | 'danger'
      message: string
      solution: string
    }
    adLaw: {
      flaggedWords: string[]
      status: 'good' | 'danger'
      message: string
      solution: string
    }
  }
}

export default function SeoCheckPage() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'result' | 'error'>('idle')
  const [progressText, setProgressText] = useState('')
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  const handleAnalyze = async () => {
    const trimmed = url.trim()
    if (!trimmed) {
      alert('네이버 블로그 주소 또는 아이디를 입력해주세요.')
      return
    }

    setStatus('analyzing')
    setErrorMessage('')

    const steps = [
      '🌐 네이버 블로그 최신 공개 글 수집 중...',
      '📏 실시간 글자 수 및 단락 구조 정밀 측정 중...',
      '🔍 키워드 반복 빈도 및 어뷰징 밀도 연산 중...',
      '🖼️ 첨부 이미지 및 모바일 체류시간 분석 중...',
      '⚖️ 2026 전문직 광고법 금지어 사전 대조 중...',
      '📊 최종 C-Rank 최적화 점수 산출 중...'
    ]

    let stepIdx = 0
    setProgressText(steps[0])
    const interval = setInterval(() => {
      stepIdx++
      if (stepIdx < steps.length) {
        setProgressText(steps[stepIdx])
      }
    }, 600)

    try {
      const response = await fetch('/api/seo-check/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed })
      })

      const data = await response.json()
      clearInterval(interval)

      if (response.ok && data.success) {
        setResult(data)
        setStatus('result')
      } else {
        setErrorMessage(data.message || '블로그 분석 중 오류가 발생했습니다.')
        setStatus('error')
      }
    } catch (err: any) {
      clearInterval(interval)
      setErrorMessage('네트워크 연결이 원활하지 않습니다. 잠시 후 다시 시도해주세요.')
      setStatus('error')
    }
  }

  const handleReset = () => {
    setStatus('idle')
    setResult(null)
    setErrorMessage('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-600/20 via-purple-600/10 to-transparent blur-[140px] pointer-events-none" />

      {/* Navbar */}
      <header className="w-full bg-slate-950/80 backdrop-blur-md z-50 border-b border-slate-800/80 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2 text-white">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg shadow-md shadow-indigo-500/30">
              <Sparkles size={18} />
            </span>
            PostSync
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 ml-1">
              2026 Engine
            </span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold text-slate-300">
            <Link href="/seo-check" className="text-indigo-400 font-bold flex items-center gap-1.5">
              실시간 진단 <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
            </Link>
            <Link href="/blog" className="hover:text-white transition-colors">블로그</Link>
            <Link href="/login" className="hover:text-white transition-colors">로그인</Link>
            <Link href="/login">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full px-4 text-xs shadow-lg shadow-indigo-600/30">
                무료 시작
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: IDLE (입력창) */}
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-3xl w-full text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 shadow-inner">
                <Activity size={14} className="text-indigo-400" />
                네이버 공식 RSS & 실시간 본문 팩트 진단
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-6 text-white leading-tight">
                내 블로그 최신 글,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
                  네이버 C-Rank 기준
                </span>에 맞을까?
              </h1>

              <p className="text-base sm:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                글자 수, 키워드 도배 밀도, 이미지 체류시간, 2026 전문직 광고법 위반 단어까지.<br className="hidden sm:inline"/>
                고객님의 실제 최신 포스팅을 <strong className="text-slate-200">1초 만에 실시간 팩트 체크</strong>해 드립니다.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto bg-slate-900/90 p-2.5 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input
                    placeholder="blog.naver.com/아이디 (또는 아이디)"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-13 pl-12 border-0 bg-transparent text-slate-100 text-base shadow-none focus-visible:ring-0 placeholder:text-slate-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                </div>
                <Button
                  onClick={handleAnalyze}
                  className="h-13 px-8 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-base shadow-lg shadow-indigo-600/30 transition-transform active:scale-95 cursor-pointer border border-indigo-400/30"
                >
                  실시간 팩트 진단
                </Button>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mt-5">
                <span className="flex items-center gap-1"><Check size={13} className="text-emerald-400" /> 비공개 글 제외</span>
                <span className="flex items-center gap-1"><Check size={13} className="text-emerald-400" /> 실시간 본문 텍스트 분석</span>
                <span className="flex items-center gap-1"><Check size={13} className="text-emerald-400" /> 광고법 사전 검사</span>
              </div>
            </motion.div>
          )}

          {/* STEP 2: ANALYZING (로딩 연출) */}
          {status === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md w-full text-center"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-400">
                  <Search className="w-10 h-10 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">블로그 최신 포스팅 정밀 분석 중...</h2>
              <p className="text-indigo-400 font-medium text-sm h-6 animate-pulse">{progressText}</p>
            </motion.div>
          )}

          {/* STEP 3: ERROR (오류 및 비공개 처리) */}
          {status === 'error' && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg w-full text-center"
            >
              <Card className="bg-slate-900 border-red-500/30 shadow-2xl p-8 rounded-3xl">
                <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <AlertTriangle size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">분석할 수 없습니다</h3>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">
                  {errorMessage}
                </p>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="rounded-full border-slate-700 hover:bg-slate-800 text-slate-200 font-semibold"
                >
                  <RotateCcw className="w-4 h-4 mr-2" /> 다른 주소로 다시 시도하기
                </Button>
              </Card>
            </motion.div>
          )}

          {/* STEP 4: RESULT (실제 데이터 기반 리포트 & 전환) */}
          {status === 'result' && result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl w-full"
            >
              {/* 상단 실제 분석 포스팅 정보 배너 */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    <span>실제 분석된 최신 포스팅</span>
                    <span className="text-slate-500">|</span>
                    <span className="text-slate-400">{result.post.blogId}</span>
                  </div>
                  <h4 className="text-base font-bold text-white truncate max-w-2xl" title={result.post.title}>
                    {result.post.title}
                  </h4>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <a
                    href={result.post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 bg-slate-800 hover:bg-slate-700/80 px-3 py-2 rounded-lg transition-colors border border-slate-700"
                  >
                    원문 보기 <ExternalLink size={12} />
                  </a>
                  <Button
                    onClick={handleReset}
                    variant="ghost"
                    size="sm"
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    <RotateCcw size={12} className="mr-1" /> 다시 진단
                  </Button>
                </div>
              </div>

              {/* 종합 점수 헤더 카드 */}
              <Card
                className={`border overflow-hidden relative shadow-2xl mb-6 ${
                  result.resultType === 'EXCELLENT'
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-emerald-500/30 shadow-emerald-950/20'
                    : 'bg-gradient-to-b from-slate-900 to-slate-950 border-rose-500/30 shadow-rose-950/20'
                }`}
              >
                <div
                  className={`h-2 w-full ${
                    result.resultType === 'EXCELLENT'
                      ? 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                      : 'bg-gradient-to-r from-rose-500 to-amber-500'
                  }`}
                />
                <CardContent className="p-8 sm:p-10">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-800/80">
                    <div className="flex-1 text-center md:text-left">
                      <div
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 border ${
                          result.resultType === 'EXCELLENT'
                            ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        }`}
                      >
                        {result.resultType === 'EXCELLENT' ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
                        {result.badge}
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
                        {result.headline}
                      </h2>
                      <p className="text-sm sm:text-base text-slate-300">
                        {result.subHeadline}
                      </p>
                    </div>

                    {/* 점수 게이지 */}
                    <div className="flex flex-col items-center justify-center flex-shrink-0 bg-slate-950/70 p-6 rounded-2xl border border-slate-800/80 min-w-[170px] shadow-inner">
                      <div className="text-xs font-bold text-slate-400 mb-1">C-Rank 종합 점수</div>
                      <div
                        className={`text-5xl font-black tracking-tight ${
                          result.resultType === 'EXCELLENT' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {result.score}
                        <span className="text-xl font-medium text-slate-500 ml-1">/100</span>
                      </div>
                    </div>
                  </div>

                  {/* 4대 정밀 분석 지표 (2x2 그리드) */}
                  <div className="grid md:grid-cols-2 gap-4 my-8">
                    
                    {/* 1. 글자 수 */}
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                            <FileText size={15} className="text-indigo-400" />
                            1. 본문 글자 수
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              result.metrics.charCount.status === 'good'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : result.metrics.charCount.status === 'warning'
                                ? 'bg-amber-500/10 text-amber-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {result.metrics.charCount.withSpaces.toLocaleString()}자
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {result.metrics.charCount.message}
                        </p>
                      </div>
                      <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                        <span className="font-bold text-indigo-300 block mb-1">✨ PostSync 솔루션:</span>
                        {result.metrics.charCount.solution}
                      </div>
                    </div>

                    {/* 2. 키워드 밀도 */}
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                            <Activity size={15} className="text-indigo-400" />
                            2. 핵심 키워드 밀도
                          </span>
                          <div className="flex gap-1">
                            {result.metrics.keywordDensity.topKeywords.map((k, i) => (
                              <span key={i} className="text-[11px] font-medium bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                                {k.word} ({k.count}회)
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {result.metrics.keywordDensity.message}
                        </p>
                      </div>
                      <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                        <span className="font-bold text-indigo-300 block mb-1">✨ PostSync 솔루션:</span>
                        {result.metrics.keywordDensity.solution}
                      </div>
                    </div>

                    {/* 3. 이미지 수 */}
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                            <ImageIcon size={15} className="text-indigo-400" />
                            3. 첨부 이미지 & 체류시간
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              result.metrics.imageCount.status === 'good'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {result.metrics.imageCount.count}장 감지
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {result.metrics.imageCount.message}
                        </p>
                      </div>
                      <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                        <span className="font-bold text-indigo-300 block mb-1">✨ PostSync 솔루션:</span>
                        {result.metrics.imageCount.solution}
                      </div>
                    </div>

                    {/* 4. 광고법 안전성 */}
                    <div className="bg-slate-950/60 p-5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                            <ShieldCheck size={15} className="text-indigo-400" />
                            4. 2026 전문직 광고법 안전성
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                              result.metrics.adLaw.status === 'good'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}
                          >
                            {result.metrics.adLaw.status === 'good' ? '100% 안전' : '위험 단어 감지'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-3">
                          {result.metrics.adLaw.message}
                        </p>
                      </div>
                      <div className="bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20 text-xs text-indigo-200">
                        <span className="font-bold text-indigo-300 block mb-1">✨ PostSync 솔루션:</span>
                        {result.metrics.adLaw.solution}
                      </div>
                    </div>
                  </div>

                  {/* 세일즈 전환 CTA 박스 */}
                  <div className="bg-gradient-to-r from-indigo-900/90 via-violet-900/90 to-purple-900/90 p-8 rounded-3xl border border-indigo-500/40 text-center relative overflow-hidden shadow-2xl">
                    <div className="relative z-10 max-w-2xl mx-auto">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-bold mb-4 backdrop-blur-md">
                        {result.resultType === 'EXCELLENT' ? <Clock size={13} /> : <Zap size={13} />}
                        PostSync 2026 AI 솔루션
                      </div>
                      <p className="text-sm sm:text-base text-indigo-100 mb-8 leading-relaxed font-medium">
                        {result.salesPitch}
                      </p>
                      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Link href="/login" className="w-full sm:w-auto">
                          <Button className="w-full sm:w-auto h-14 px-8 bg-white hover:bg-slate-100 text-indigo-950 font-black rounded-xl text-base shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                            <Sparkles className="mr-2 w-5 h-5 text-indigo-600" />
                            {result.ctaText}
                            <ArrowRight className="ml-2 w-5 h-5 text-indigo-600" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-center text-slate-500 mt-6">
                    ※ 본 진단은 네이버 공식 공개 데이터(RSS 및 모바일 뷰어)를 기반으로 C-Rank 권장 가이드에 대조한 팩트 리포트입니다.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  )
}
