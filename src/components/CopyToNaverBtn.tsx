'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle2, Loader2 } from 'lucide-react'
import { preUploadCardImages } from '@/lib/cardImageUploader'
import { stripInternalMetadata } from '@/lib/utils/postSanitizer'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string; description: string; variant?: string }) => {
      console.log('Toast:', props)
    },
  }
}

interface CopyToNaverBtnProps {
  content: string
  className?: string
  isImagesReady?: boolean
  onEnsureReady?: () => Promise<string>
}

export function CopyToNaverBtn({
  content,
  className = '',
  isImagesReady = true,
  onEnsureReady,
}: CopyToNaverBtnProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isCopying, setIsCopying] = useState(false)
  const { toast } = useToast()

  const handleCopyClick = async () => {
    const editorDom = document.getElementById('editor-preview')
    let htmlToCopy = editorDom ? editorDom.innerHTML : content

    // 내부 기획 메모([팩트 체크], [목표 분량], [탈 양산화 설계도]) 원천 정제
    htmlToCopy = stripInternalMetadata(htmlToCopy)

    // 마크다운 소제목을 22px 대제목 HTML로 확실하게 변환
    htmlToCopy = htmlToCopy.replace(/^##\s+(.*?)$/gm, '<h2 style="font-size: 22px; font-weight: bold; color: #0F172A; margin: 36px 0 16px 0; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px;">$1</h2>')
    htmlToCopy = htmlToCopy.replace(/^###\s+(.*?)$/gm, '<h3 style="font-size: 18px; font-weight: bold; color: #1E293B; margin: 24px 0 12px 0;">$1</h3>')

    // 문단(<p>) 태그에 16px 표준 인라인 스타일 보장 (네이버 에디터 11pt 다운그레이드 방지)
    htmlToCopy = htmlToCopy.replace(/<p(?![^>]*style=)([^>]*)>/gi, '<p style="font-size: 16px; line-height: 1.85; margin: 16px 0; color: #1F2937;"$1>')

    if (!htmlToCopy) {
      toast({
        title: '복사 실패',
        description: '복사할 원고 내용이 없습니다. 먼저 글을 생성해 주세요.',
        variant: 'destructive',
      })
      return
    }

    setIsCopying(true)

    try {
      // 1. 이미지가 아직 사전 업로드되지 않은 상태라면 즉시 업로드 완료 후 진행
      if (!isImagesReady && onEnsureReady) {
        htmlToCopy = await onEnsureReady()
      } else if (
        htmlToCopy.includes('data:image/svg+xml') ||
        htmlToCopy.includes('data:image/png') ||
        htmlToCopy.includes('<svg')
      ) {
        const { updatedHtml } = await preUploadCardImages(htmlToCopy)
        htmlToCopy = updatedHtml
      }

      // 2. 순수 텍스트(Fallback) 및 서식 HTML 추출
      const tempContainer = document.createElement('div')
      tempContainer.innerHTML = htmlToCopy
      const plainText = tempContainer.innerText || tempContainer.textContent || ''

      let copySuccess = false

      // 3. 2026 W3C 표준 클립보드 API: text/html + text/plain 듀얼 번들링
      if (
        typeof navigator !== 'undefined' &&
        navigator.clipboard &&
        typeof ClipboardItem !== 'undefined'
      ) {
        try {
          const htmlBlob = new Blob([htmlToCopy], { type: 'text/html' })
          const textBlob = new Blob([plainText], { type: 'text/plain' })
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html': htmlBlob,
              'text/plain': textBlob,
            }),
          ])
          copySuccess = true
        } catch (apiErr) {
          console.warn('W3C Clipboard API write failed, trying fallback...', apiErr)
        }
      }

      // 4. Fallback: contentEditable document.execCommand('copy')
      if (!copySuccess) {
        const el = document.createElement('div')
        el.innerHTML = htmlToCopy
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

        try {
          copySuccess = document.execCommand('copy')
        } catch (err) {
          console.error('Fallback execCommand failed', err)
        }

        selection?.removeAllRanges()
        document.body.removeChild(el)
      }

      if (copySuccess) {
        setIsCopied(true)
        toast({
          title: '복사 완료!',
          description:
            '글과 모든 고화질 사진이 복사되었습니다. 네이버 블로그 스마트에디터에 [Ctrl + V]로 붙여넣어 주세요.',
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
        variant: 'destructive',
      })
    } finally {
      setIsCopying(false)
    }
  }

  return (
    <Button
      onClick={handleCopyClick}
      disabled={isCopying}
      className={`font-semibold shadow-md transition-all cursor-pointer ${
        isCopied
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
          : 'bg-[#03C75A] hover:bg-[#02b350] text-white'
      } ${className}`}
    >
      {isCopying ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>복사 준비 중...</span>
        </>
      ) : isCopied ? (
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
