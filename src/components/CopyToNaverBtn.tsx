'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, CheckCircle2, ArrowRight } from 'lucide-react'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

interface CopyToNaverBtnProps {
  content: string;
}

export function CopyToNaverBtn({ content }: CopyToNaverBtnProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [showIdModal, setShowIdModal] = useState(false)
  const [naverIdInput, setNaverIdInput] = useState('')
  const { toast } = useToast()

  // Load Naver ID from local storage on mount
  useEffect(() => {
    const savedId = localStorage.getItem('naver_id')
    if (savedId) {
      setNaverIdInput(savedId)
    }
  }, [])

  const executeCopy = async (idToUse?: string) => {
    if (!content) return

    try {
      // 가장 완벽한 네이버 에디터 호환성을 위한 contentEditable 트릭 복사
      const el = document.createElement('div')
      el.innerHTML = content
      el.style.position = 'fixed'
      el.style.left = '-9999px'
      el.style.top = '0'
      el.contentEditable = 'true'
      document.body.appendChild(el)

      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(el)
      selection?.removeAllRanges()
      selection?.addRange(range)

      let success = false
      try {
        success = document.execCommand('copy')
      } catch (err) {
        console.error('Fallback copy failed', err)
      }

      selection?.removeAllRanges()
      document.body.removeChild(el)

      if (success) {
        setIsCopied(true)
        toast({
          title: '복사 완료!',
          description: '서식이 완벽하게 복사되었습니다. 네이버 블로그에 붙여넣어 주세요.'
        })

        // 옵션 A: 아이디가 있으면 자동 팝업
        const finalId = idToUse || localStorage.getItem('naver_id')
        if (finalId) {
          window.open(`https://blog.naver.com/${finalId}/postwrite`, '_blank')
        }

        setTimeout(() => setIsCopied(false), 3000)
      } else {
        throw new Error('Copy failed')
      }
    } catch (error) {
      console.error('Clipboard copy failed:', error)
      toast({
        title: '복사 실패',
        description: '브라우저가 클립보드 복사를 지원하지 않거나 권한이 없습니다.',
        variant: 'destructive'
      })
    }
  }

  const handleCopyClick = () => {
    const savedId = localStorage.getItem('naver_id')
    if (!savedId) {
      // 아이디가 없으면 입력 팝업 노출
      setShowIdModal(true)
    } else {
      // 아이디가 있으면 즉시 복사 후 이동
      executeCopy(savedId)
    }
  }

  const handleSaveIdAndCopy = () => {
    if (naverIdInput.trim()) {
      localStorage.setItem('naver_id', naverIdInput.trim())
      setShowIdModal(false)
      executeCopy(naverIdInput.trim())
    } else {
      toast({ title: '알림', description: '네이버 아이디를 입력해 주세요.', variant: 'destructive' })
    }
  }

  const handleSkipId = () => {
    setShowIdModal(false)
    executeCopy()
  }

  return (
    <>
      <Button 
        onClick={handleCopyClick}
        className={`w-full font-semibold shadow-md transition-all ${isCopied ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[#03C75A] hover:bg-[#02b350] text-white'}`}
      >
        {isCopied ? (
          <><CheckCircle2 className="w-4 h-4 mr-2" /> 클립보드 저장 완료!</>
        ) : (
          <><Copy className="w-4 h-4 mr-2" /> 네이버 블로그 완벽 호환 복사</>
        )}
      </Button>

      {/* Naver ID Input Modal */}
      {showIdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">🚀 원클릭 네이버 자동 발행</h3>
              <p className="text-sm text-slate-500 mb-6">
                네이버 아이디를 입력해두시면, 앞으로 복사 버튼을 누를 때마다 <strong className="text-indigo-600">네이버 블로그 글쓰기 창이 새 탭으로 자동 실행</strong>됩니다.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">네이버 아이디</label>
                  <Input 
                    placeholder="예: naver_user_123" 
                    value={naverIdInput}
                    onChange={(e) => setNaverIdInput(e.target.value)}
                    className="h-12 border-slate-300 focus:ring-indigo-500"
                    autoFocus
                  />
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1 h-12 text-slate-600" onClick={handleSkipId}>
                    건너뛰기 (수동 접속)
                  </Button>
                  <Button className="flex-1 h-12 bg-[#03C75A] hover:bg-[#02b350] text-white font-bold" onClick={handleSaveIdAndCopy}>
                    저장 및 복사 <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 text-xs text-slate-400 border-t">
              * 입력하신 아이디는 대표님의 브라우저에만 안전하게 저장됩니다.
            </div>
          </div>
        </div>
      )}
    </>
  )
}
