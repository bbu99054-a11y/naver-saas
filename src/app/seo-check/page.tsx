'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Search, AlertTriangle, XCircle, ChevronRight, Activity, Database, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

export default function SeoCheckPage() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'result'>('idle')
  const [progressText, setProgressText] = useState('')

  const handleAnalyze = () => {
    if (!url.includes('blog.naver.com')) {
      alert('네이버 블로그 주소(blog.naver.com/아이디)를 정확히 입력해주세요.')
      return
    }

    setStatus('analyzing')
    
    // 시뮬레이션: 단계별 로딩 연출
    const steps = [
      '🌐 블로그 구조 크롤링 시작...',
      '🔍 네이버 C-Rank 알고리즘 대조 중...',
      '⚠️ 과거 발행 문서 전수 조사 중...',
      '🤖 키워드 카니발라이제이션(유사문서) 패턴 분석 중...',
      '📊 최종 저품질 위험도 산출 중...'
    ]
    
    let stepIndex = 0
    setProgressText(steps[0])

    const interval = setInterval(() => {
      stepIndex++
      if (stepIndex < steps.length) {
        setProgressText(steps[stepIndex])
      } else {
        clearInterval(interval)
        setStatus('result')
      }
    }, 1200) // 약 6초 소요
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200 flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white/70 backdrop-blur-md z-50 border-b border-slate-200/50 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded-md"><Sparkles size={18} /></span>
            PostSync
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/seo-check" className="text-sm font-bold text-red-500">무료 진단</Link>
            <Link href="/blog" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">블로그</Link>
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">로그인</Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />

        <AnimatePresence mode="wait">
          
          {/* STEP 1: IDLE (입력창) */}
          {status === 'idle' && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl w-full text-center z-10"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold mb-6">
                <AlertTriangle size={14} /> 무료 이벤트 진행 중
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
                내 블로그, <span className="text-red-600">저품질(나락)</span> 위험은 없을까?
              </h1>
              <p className="text-lg text-slate-600 mb-10">
                전문직 마케팅의 치명적 실수 '키워드 카니발라이제이션'.<br/>
                네이버 AI에 의해 블로그가 통째로 날아가기 전에 지금 바로 점검하세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <Input 
                    placeholder="https://blog.naver.com/아이디" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="h-14 pl-12 border-0 bg-transparent text-lg shadow-none focus-visible:ring-0 placeholder:text-slate-300"
                    onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  />
                </div>
                <Button 
                  onClick={handleAnalyze}
                  className="h-14 px-8 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg transition-transform active:scale-95"
                >
                  위험도 진단하기
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-4">* 입력하신 주소는 진단 목적으로만 사용되며 저장되지 않습니다.</p>
            </motion.div>
          )}

          {/* STEP 2: ANALYZING (로딩 연출) */}
          {status === 'analyzing' && (
            <motion.div 
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-md w-full text-center z-10"
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                <div className="absolute inset-0 border-4 border-slate-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-red-500 rounded-full border-t-transparent animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center text-red-500">
                  <Search className="w-10 h-10 animate-pulse" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">블로그 정밀 진단 중...</h2>
              <p className="text-red-600 font-medium h-6 animate-pulse">{progressText}</p>
            </motion.div>
          )}

          {/* STEP 3: RESULT (공포 소구 및 전환) */}
          {status === 'result' && (
            <motion.div 
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-3xl w-full z-10"
            >
              <Card className="border-red-200 shadow-2xl shadow-red-900/10 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-red-500" />
                <CardContent className="p-8 md:p-12">
                  <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <XCircle size={40} />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                      🚨 심각: 저품질 전락 위험 감지
                    </h2>
                    <p className="text-lg text-slate-600">
                      입력하신 블로그(<span className="font-semibold text-slate-900">{url}</span>) 분석 결과,<br/>
                      <span className="text-red-600 font-bold">향후 3개월 이내에 네이버 검색에서 영구 누락될 위험이 87%</span>로 측정되었습니다.
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-10">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                        <Database size={18} /> 카니발라이제이션 (중복 문서)
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        최근 발행된 문서 중 4건이 기존 문서와 타겟 키워드가 겹쳐 유사문서 어뷰징으로 분류될 위험이 매우 높습니다.
                      </p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2 text-orange-600 font-bold mb-2">
                        <Activity size={18} /> 체류 시간(Dwell Time) 경고
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        단순 정보 나열식 작성으로 인해 방문자 이탈률이 90%에 달합니다. 1인칭 후킹 스토리텔링 부재가 원인입니다.
                      </p>
                    </div>
                  </div>

                  <div className="bg-indigo-900 text-white p-8 rounded-3xl text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/30 blur-[80px] rounded-full" />
                    <div className="relative z-10">
                      <h3 className="text-2xl font-bold mb-3">더 늦기 전에 블로그를 구조하세요!</h3>
                      <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
                        PostSync의 <strong>[중복 키워드 방어 시스템]</strong>과 <strong>[AI 1인칭 후킹 원고 생성]</strong> 기능을 통해 네이버가 사랑하는 완벽한 SEO 블로그로 즉시 탈바꿈할 수 있습니다.
                      </p>
                      <Link href="/login">
                        <Button className="w-full sm:w-auto h-14 px-8 bg-white text-indigo-900 hover:bg-slate-100 font-black rounded-xl text-lg shadow-xl transition-transform hover:-translate-y-1">
                          <Zap className="mr-2 w-5 h-5" /> PostSync 3회 무료로 복구 시작하기
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
