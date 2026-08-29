'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send, CheckCircle2, Loader2, AlertCircle, Laptop, ExternalLink, AtSign, Settings2 } from 'lucide-react'

interface NaverAutoPublishBtnProps {
  title: string
  content: string
  tags?: string[]
  blogId?: string
  className?: string
}

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
  const [naverBlogId, setNaverBlogId] = useState('')
  const [statusText, setStatusText] = useState('')

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

  // 3. 실제 발행 전송 실행 함수
  const executePublish = async (targetBlogId: string) => {
    setIsPublishing(true)
    setStatusText('인포그래픽 이미지 무손실 준비 중...')

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

      setStatusText('네이버 전용 브라우저 실행 중...')

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
        setIsPublished(true)
        setTimeout(() => setIsPublished(false), 5000)
      } else {
        throw new Error(data.error || '네이버 임시저장에 실패했습니다.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '로컬 헬퍼 통신 중 오류가 발생했습니다.'
      alert(`⚠️ 네이버 발행 안내: ${msg}`)
    } finally {
      setIsPublishing(false)
      setStatusText('')
    }
  }

  // 4. 원클릭 버튼 클릭 핸들러
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

  // 5. 아이디 저장 및 즉시 발행 시작
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
              <span>{statusText || '네이버 자동 발행 중...'}</span>
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
                <span className="ml-1.5 w-2 h-2 rounded-full bg-emerald-300 animate-pulse" title="로컬 헬퍼 연결됨" />
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

      {/* 2. 로컬 헬퍼 미실행 시 안내 모달 */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 text-center animate-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
              <Laptop className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-extrabold text-slate-900">
                PostSynk 헬퍼 실행이 필요합니다 🖥️
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                네이버의 강력한 보안 정책을 100% 안전하게 통과하기 위해, <br />
                내 컴퓨터에서 실행되는 <strong>초경량 로컬 헬퍼 프로그램</strong>이 필요합니다.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-left text-xs space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#03C75A]" />
                1초 실행 방법:
              </p>
              <ol className="list-decimal list-inside space-y-1 text-slate-600 pl-1 font-medium">
                <li>프로젝트 폴더 내 <code>local-helper/start-helper.bat</code> 더블 클릭</li>
                <li>까만 창이 뜨면 이 화면으로 돌아와 <strong>[다시 시도]</strong> 클릭</li>
              </ol>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => {
                  checkHelperStatus().then(online => {
                    if (online) {
                      setShowHelperModal(false)
                      handleAutoPublish()
                    } else {
                      alert('아직 헬퍼 프로그램이 실행되지 않았습니다. start-helper.bat 파일을 실행해 주세요.')
                    }
                  })
                }}
                className="flex-1 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold text-xs h-9 cursor-pointer"
              >
                연결 확인 및 발행 시작
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
