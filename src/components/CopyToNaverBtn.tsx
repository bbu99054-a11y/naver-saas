'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle2 } from 'lucide-react'

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
  className?: string;
}

export function CopyToNaverBtn({ content, className = '' }: CopyToNaverBtnProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopyClick = async () => {
    // 사용자가 직접 편집한 DOM을 가져옴 (editor-preview)
    const editorDom = document.getElementById('editor-preview')
    const finalContent = editorDom ? editorDom.innerHTML : content

    if (!finalContent) {
      toast({
        title: '복사 실패',
        description: '복사할 원고 내용이 없습니다. 먼저 글을 생성해 주세요.',
        variant: 'destructive'
      })
      return
    }

    try {
      // 가장 완벽한 네이버 에디터 호환성을 위한 contentEditable 트릭 복사
      const el = document.createElement('div')
      el.innerHTML = finalContent
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

  return (
    <Button 
      onClick={handleCopyClick}
      className={`font-semibold shadow-md transition-all cursor-pointer ${
        isCopied 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
          : 'bg-[#03C75A] hover:bg-[#02b350] text-white'
      } ${className}`}
    >
      {isCopied ? (
        <>
          <CheckCircle2 className="w-4 h-4 mr-2" />
          <span>복사 완료!</span>
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          <span>블로그 복사</span>
        </>
      )}
    </Button>
  )
}
