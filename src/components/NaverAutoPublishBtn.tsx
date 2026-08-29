'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Send,
  CheckCircle2,
  Loader2,
  Laptop,
  ExternalLink,
  AtSign,
  Settings2,
  ShieldCheck,
  Sparkles,
  Layers,
  FileCheck2,
  X
} from 'lucide-react'

interface NaverAutoPublishBtnProps {
  title: string
  content: string
  tags?: string[]
  blogId?: string
  className?: string
}

interface PublishProgress {
  stage: 'packaging' | 'connecting' | 'typing' | 'inserting_images' | 'saving' | 'done' | 'error' | 'idle'
  step: number
  totalSteps: number
  message: string
  percent: number
}

const STAGES = [
  { step: 1, key: 'packaging', label: '인포그래픽 이미지 무손실 패키징', desc: '카드뉴스 4장 및 하단 CTA 배너 무손실 바이너리 추출' },
  { step: 2, key: 'connecting', label: '네이버 공식 보안 세션 안전 연결', desc: '고객 PC 로컬 보안 브라우저 세션 안전 가동' },
  { step: 3, key: 'typing', label: '스마트에디터 ONE 구조화 타이핑', desc: 'C-Rank SEO 최적화 제목 및 소제목/본문 자동 작성' },
  { step: 4, key: 'inserting_images', label: '인포그래픽 카드뉴스 정밀 배치', desc: '본문 최적 문맥 위치에 정품 이미지 순차 삽입' },
  { step: 5, key: 'saving', label: '네이버 블로그 안전 임시저장 & 검증', desc: '작성 데이터 무결성 검증 및 임시저장 최종 완료' }
]

export function NaverAutoPublishBtn({
  title,
  content,
  tags = [],
  blogId = '',
  className = ''
}: NaverAutoPublishBtnProps) {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const [isHelperOnline, setIsHelperOnline] = useState<boolean | null>(null)
  const [showHelperModal, setShowHelperModal] = useState(false)
  const [showIdModal, setShowIdModal] = useState(false)
  const [showCockpitModal, setShowCockpitModal] = useState(false)
  const [naverBlogId, setNaverBlogId] = useState('')
  const [currentStep, setCurrentStep] = useState(1)
  const [progressPercent, setProgressPercent] = useState(15)
  const [statusMessage, setStatusMessage] = useState('인포그래픽 이미지 무손실 준비 중...')
  const [errorMessage, setErrorMessage] = useState('')

  const statusPollingRef = useRef<NodeJS.Timeout | null>(null)

  // 1. 저장된 네이버 블로그 ID 불러오기
  useEffect(() => {
    if (blogId) {
      setNaverBlogId(blogId)
    } else {
      const saved = localStorage.getItem('postsynk_naver_blog_id')
      if (saved) {
        setNaverBlogId(saved)
      }
    }
  }, [blogId])

  // 2. 로컬 헬퍼 온라인 여부 주기적 확인 (Heartbeat)
  const checkHelperStatus = async () => {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 1200)
      const res = await fetch('http://127.0.0.1:49152/health', {
        method: 'GET',
        signal: controller.signal
      })
      clearTimeout(timeoutId)
      if (res.ok) {
        setIsHelperOnline(true)
        return true
      }
    } catch {
      setIsHelperOnline(false)
      return false
    }
    setIsHelperOnline(false)
    return false
  }

  useEffect(() => {
    checkHelperStatus()
    const interval = setInterval(checkHelperStatus, 5000)
    return () => clearInterval(interval)
  }, [])

  // 3. 실시간 관제창 상태 폴링
  const startStatusPolling = () => {
    if (statusPollingRef.current) clearInterval(statusPollingRef.current)
    statusPollingRef.current = setInterval(async () => {
      try {
        const res = await fetch('http://127.0.0.1:49152/publish/status')
        if (res.ok) {
          const data = await res.json()
          if (data.progress) {
            const stepNum = data.progress.step || 1
            setCurrentStep(stepNum)
            if (data.progress.message) {
              setStatusMessage(data.progress.message)
            }
            if (stepNum === 1) setProgressPercent(20)
            else if (stepNum === 2) setProgressPercent(40)
            else if (stepNum === 3) setProgressPercent(65)
            else if (stepNum === 4) setProgressPercent(85)
            else if (stepNum === 5) {
              if (data.progress.stage === 'done') setProgressPercent(100)
              else setProgressPercent(95)
            }
          }
        }
      } catch {}
    }, 600)
  }

  const stopStatusPolling = () => {
    if (statusPollingRef.current) {
      clearInterval(statusPollingRef.current)
      statusPollingRef.current = null
    }
  }

  // 4. 실제 발행 전송 실행 함수
  const executePublish = async (targetBlogId: string) => {
    setIsPublishing(true)
    setShowCockpitModal(true)
    setErrorMessage('')
    setCurrentStep(1)
    setProgressPercent(15)
    setStatusMessage('고화질 인포그래픽 이미지 무손실 패키징 중...')
    startStatusPolling()

    try {
      // 1. 본문 HTML 내의 모든 카드뉴스 및 하단 배너 이미지를 Base64 바이너리로 전수 추출
      const base64Images: string[] = []
      try {
        const imgMatches = Array.from(content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi))
        for (const match of imgMatches) {
          const src = match[1]
          if (!src) continue
          if (src.startsWith('data:image/')) {
            base64Images.push(src)
            continue
          }
          const fullUrl = src.startsWith('http') ? src : `${window.location.origin}${src.startsWith('/') ? '' : '/'}${src}`
          const res = await fetch(fullUrl)
          const blob = await res.blob()
          const b64 = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(blob)
          })
          if (b64) base64Images.push(b64)
        }
      } catch (e) {
        console.warn('이미지 추출 오류:', e)
      }

      setCurrentStep(2)
      setProgressPercent(35)
      setStatusMessage('네이버 공식 보안 브라우저 세션 연결 중...')

      const response = await fetch('http://127.0.0.1:49152/publish/naver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content,
          tags: tags.length ? tags : ['전문직블로그', 'SEO최적화', '법률상담'],
          blogId: targetBlogId,
          images: base64Images
        })
      })

      const data = await response.json()
      if (data.success) {
        setCurrentStep(5)
        setProgressPercent(100)
        setStatusMessage('네이버 스마트에디터 임시저장이 완벽하게 완료되었습니다! 🎉')
        setIsPublished(true)
      } else {
        throw new Error(data.error || '네이버 임시저장에 실패했습니다.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'AI 다이렉트 엔진 통신 중 오류가 발생했습니다.'
      setErrorMessage(msg)
    } finally {
      setIsPublishing(false)
      stopStatusPolling()
    }
  }

  // 5. 원클릭 버튼 클릭 핸들러
  const handleAutoPublish = async () => {
    if (!title || !content) {
      alert('발행할 제목과 본문 내용이 없습니다. 먼저 글을 생성해 주세요.')
      return
    }

    const online = await checkHelperStatus()
    if (!online) {
      setShowHelperModal(true)
      return
    }

    // 네이버 블로그 ID가 없으면 입력 팝업 노출
    const currentId = naverBlogId || localStorage.getItem('postsynk_naver_blog_id') || ''
    if (!currentId) {
      setShowIdModal(true)
      return
    }

    await executePublish(currentId)
  }

  // 6. 아이디 저장 및 즉시 발행 시작
  const handleSaveIdAndPublish = async (e: React.FormEvent) => {
    e.preventDefault()
    const cleanId = naverBlogId.trim().replace(/^@/, '')
    if (!cleanId) {
      alert('네이버 아이디(Blog ID)를 입력해 주세요.')
      return
    }
    localStorage.setItem('postsynk_naver_blog_id', cleanId)
    setNaverBlogId(cleanId)
    setShowIdModal(false)
    await executePublish(cleanId)
  }

  return (
    <>
      <div className="relative inline-flex items-center group">
        <Button
          onClick={handleAutoPublish}
          disabled={isPublishing}
          className={`relative font-bold shadow-md transition-all cursor-pointer ${
            isPublished
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-gradient-to-r from-[#03C75A] to-[#00B04B] hover:from-[#02b350] hover:to-[#009b42] text-white'
          } ${className}`}
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
              <span>AI 다이렉트 발행 중 ({progressPercent}%)...</span>
            </>
          ) : isPublished ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-1.5" />
              <span>네이버 발행 완료! 🎉</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-1.5" />
              <span>🚀 네이버 원클릭 자동 발행</span>
              {isHelperOnline === true && (
                <span className="ml-1.5 w-2 h-2 rounded-full bg-emerald-300 animate-pulse" title="PostSynk AI 다이렉트 엔진 연결됨" />
              )}
            </>
          )}
        </Button>

        {/* 블로그 ID 수정 버튼 (작은 아이콘) */}
        {naverBlogId && (
          <button
            type="button"
            onClick={() => setShowIdModal(true)}
            title={`발행 대상: blog.naver.com/${naverBlogId} (클릭하여 아이디 변경)`}
            className="ml-1 p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 🚀 [핵심] 실시간 라이브 발행 관제 모달 (Live Cockpit HUD) */}
      {showCockpitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-white animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* 상단 엠블럼 헤더 */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#03C75A] to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-950">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5">
                    PostSynk AI 다이렉트 엔진 관제창
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-mono px-1.5 py-0.5 rounded border border-emerald-500/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    발행 대상: <span className="text-emerald-400 font-mono font-bold">blog.naver.com/{naverBlogId || '내블로그'}</span>
                  </p>
                </div>
              </div>

              {!isPublishing && (
                <button
                  type="button"
                  onClick={() => setShowCockpitModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* 프로그레스 바 영역 */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 flex items-center gap-1.5">
                  {isPublishing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-[#03C75A]" />
                      <span>{statusMessage}</span>
                    </>
                  ) : errorMessage ? (
                    <span className="text-rose-400">⚠️ {errorMessage}</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">🎉 네이버 블로그 안전 임시저장 완료!</span>
                  )}
                </span>
                <span className="text-emerald-400 font-mono font-extrabold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    errorMessage
                      ? 'bg-rose-500'
                      : progressPercent === 100
                      ? 'bg-gradient-to-r from-emerald-500 to-[#03C75A]'
                      : 'bg-gradient-to-r from-[#03C75A] to-teal-400 animate-pulse'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* 5단계 실시간 체크리스트 */}
            <div className="space-y-2 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
              {STAGES.map((s) => {
                const isPassed = currentStep > s.step || (currentStep === s.step && progressPercent === 100)
                const isCurrent = currentStep === s.step && isPublishing
                const isPending = currentStep < s.step

                return (
                  <div
                    key={s.key}
                    className={`flex items-start gap-3 p-2 rounded-lg transition-all text-xs ${
                      isCurrent
                        ? 'bg-emerald-950/40 border border-emerald-500/30'
                        : isPassed
                        ? 'bg-slate-900/40 opacity-90'
                        : 'opacity-40'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#03C75A]" />
                      ) : isCurrent ? (
                        <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500">
                          {s.step}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${isCurrent ? 'text-emerald-300' : isPassed ? 'text-slate-200' : 'text-slate-400'}`}>
                          [{s.step}/5] {s.label}
                        </span>
                        {isPassed && <span className="text-[10px] text-emerald-500 font-mono">완료 ✓</span>}
                        {isCurrent && <span className="text-[10px] text-emerald-400 font-mono animate-pulse">진행 중...</span>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{s.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 하단 버튼 및 결과 액션 */}
            <div className="pt-1">
              {progressPercent === 100 && !isPublishing ? (
                <div className="space-y-2">
                  <a
                    href={`https://blog.naver.com/${naverBlogId || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs h-10 rounded-xl shadow-lg shadow-emerald-950 transition-all cursor-pointer"
                  >
                    <span>🎉 내 네이버 블로그 글 확인하러 가기</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCockpitModal(false)}
                    className="w-full text-xs text-slate-400 hover:text-white h-8 cursor-pointer"
                  >
                    관제창 닫기
                  </Button>
                </div>
              ) : errorMessage ? (
                <div className="flex gap-2">
                  <Button
                    type="button"
                    onClick={() => executePublish(naverBlogId)}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs h-9 cursor-pointer"
                  >
                    다시 시도하기
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCockpitModal(false)}
                    className="text-xs text-slate-400 hover:text-white h-9 cursor-pointer"
                  >
                    닫기
                  </Button>
                </div>
              ) : (
                <p className="text-center text-[11px] text-slate-500">
                  🔒 네이버 공식 에디터 ONE 보안 규정에 맞춰 안전하게 작성 중입니다...
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1. 네이버 블로그 ID 최초 1회 등록 모달 */}
      {showIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
              <AtSign className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">
                네이버 블로그 아이디를 입력해 주세요 📝
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                글이 작성될 <strong>내 블로그 주소(아이디)</strong>를 알려주세요. <br />
                <span className="text-[11px] text-emerald-600 font-bold">🔒 비밀번호는 절대 요구하지 않으며, 1회 저장 후 영구 보존됩니다.</span>
              </p>
            </div>

            <form onSubmit={handleSaveIdAndPublish} className="space-y-3 pt-2 text-left">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  네이버 아이디 (Blog ID)
                </label>
                <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
                  <span className="text-xs text-slate-400 font-mono select-none">blog.naver.com/</span>
                  <input
                    type="text"
                    value={naverBlogId}
                    onChange={(e) => setNaverBlogId(e.target.value)}
                    placeholder="bbu99054"
                    className="w-full bg-transparent border-0 text-xs font-bold text-slate-900 focus:outline-none pl-1"
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="submit"
                  className="flex-1 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs h-9 cursor-pointer"
                >
                  아이디 저장 및 즉시 발행 시작
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowIdModal(false)}
                  className="text-xs text-slate-500 hover:text-slate-800 h-9 font-medium cursor-pointer"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 공식 보안 커넥터 미실행 시 안내 모달 (리브랜딩 완료) */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
              <ShieldCheck className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">
                PostSynk AI 다이렉트 엔진 연결 안내 🚀
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                네이버의 보안 정책을 100% 안전하게 통과하고 저품질을 방지하기 위해, <br />
                내 컴퓨터에서 실행되는 <strong>공식 다이렉트 엔진(무음)</strong>이 필요합니다.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-2.5">
              <a
                href="/api/download/direct-engine"
                className="w-full flex items-center justify-center gap-1.5 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs h-9 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                <span>📥 PostSynk 다이렉트 엔진 1초 다운로드 (.zip)</span>
              </a>

              <div className="pt-1 space-y-1.5 text-slate-600 font-medium text-[11px]">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#03C75A]" />
                  초간단 실행 순서:
                </p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>다운로드된 ZIP 압축 해제 후 <code>register-startup.bat</code> 1회 실행</li>
                  <li>이 화면으로 돌아와 아래 <strong>[연결 확인 및 발행 시작]</strong> 클릭</li>
                </ol>
                <p className="text-[10px] text-emerald-600 font-bold">
                  🔒 비밀번호는 절대 요구하지 않으며, 윈도우 시작 시 무음으로 자동 대기합니다.
                </p>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                onClick={() => {
                  checkHelperStatus().then(online => {
                    if (online) {
                      setShowHelperModal(false)
                      handleAutoPublish()
                    } else {
                      alert('아직 엔진이 실행되지 않았습니다. 다운로드 후 register-startup.bat 또는 start-engine-silent.vbs를 실행해 주세요.')
                    }
                  })
                }}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-9 cursor-pointer"
              >
                연결 확인 및 즉시 발행
              </Button>
              <Button
                variant="ghost"
                onClick={() => setShowHelperModal(false)}
                className="text-xs text-slate-500 hover:text-slate-800 h-9 font-medium cursor-pointer"
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
