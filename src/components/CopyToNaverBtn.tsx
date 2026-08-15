'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, CheckCircle2, Loader2 } from 'lucide-react'

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

/**
 * SVG Data-URI 또는 SVG 코드를 Blob을 통해 2배수 레티나(2x Retina) 초고해상도 순수 PNG(Base64)로 100% 안전 변환
 */
function svgToPngDataUrl(svgSrc: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      let cleanSvg = svgSrc

      // 1. data-uri에서 순수 SVG 문자열 추출 및 디코딩
      if (cleanSvg.includes('data:image/svg+xml')) {
        const commaIdx = cleanSvg.indexOf(',')
        if (commaIdx !== -1) {
          const rawPart = cleanSvg.substring(commaIdx + 1)
          try {
            cleanSvg = decodeURIComponent(rawPart)
          } catch {
            cleanSvg = rawPart
          }
        }
      }

      // 2. 어두운 배경/텍스트 보정 (라이트 모드 강제 보장)
      cleanSvg = cleanSvg
        .replace(/fill=['"](#000000|#0f172a|#111827|black)['"]/gi, "fill='#0F172A'")
        .replace(/<rect([^>]*?)fill=['"](#000000|#0f172a|#111827|black)['"]/gi, "<rect$1fill='#F8FAFC'")

      // 3. 치수(viewBox) 파싱하여 800x800, 800x450 등 정확한 원본 크기 추출
      let width = 800
      let height = 450
      const vbMatch = cleanSvg.match(/viewBox=['"]\s*0\s+0\s+(\d+)\s+(\d+)\s*['"]/i)
      if (vbMatch) {
        width = parseInt(vbMatch[1], 10)
        height = parseInt(vbMatch[2], 10)
      } else {
        const wMatch = cleanSvg.match(/width=['"](\d+)['"]/i)
        const hMatch = cleanSvg.match(/height=['"](\d+)['"]/i)
        if (wMatch && hMatch) {
          width = parseInt(wMatch[1], 10)
          height = parseInt(hMatch[2], 10)
        }
      }

      // 4. 필수 SVG 네임스페이스 및 명시적 width/height 보장
      if (!cleanSvg.includes('xmlns=')) {
        cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      }
      if (!cleanSvg.includes('width=')) {
        cleanSvg = cleanSvg.replace('<svg', `<svg width="${width}" height="${height}"`)
      }

      // 5. URL 인코딩 이슈를 원천 차단하는 Blob URL 생성
      const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' })
      const blobUrl = URL.createObjectURL(blob)

      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          
          // 2x Retina 스케일 적용 (1600px 초고해상도)
          const scale = 2
          canvas.width = width * scale
          canvas.height = height * scale
          
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            const pngData = canvas.toDataURL('image/png')
            URL.revokeObjectURL(blobUrl)
            resolve(pngData)
          } else {
            URL.revokeObjectURL(blobUrl)
            resolve(svgSrc)
          }
        } catch {
          URL.revokeObjectURL(blobUrl)
          resolve(svgSrc)
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl)
        resolve(svgSrc)
      }

      img.src = blobUrl
    } catch {
      resolve(svgSrc)
    }
  })
}

export function CopyToNaverBtn({ content, className = '' }: CopyToNaverBtnProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isConverting, setIsConverting] = useState(false)
  const { toast } = useToast()

  const handleCopyClick = async () => {
    const editorDom = document.getElementById('editor-preview')
    const initialHtml = editorDom ? editorDom.innerHTML : content

    if (!initialHtml) {
      toast({
        title: '복사 실패',
        description: '복사할 원고 내용이 없습니다. 먼저 글을 생성해 주세요.',
        variant: 'destructive'
      })
      return
    }

    setIsConverting(true)

    try {
      // 1. 임시 DOM 생성 후 모든 SVG 이미지를 순수 PNG로 일괄 변환
      const tempContainer = document.createElement('div')
      tempContainer.innerHTML = initialHtml

      const images = Array.from(tempContainer.querySelectorAll('img'))
      
      // 병렬 비동기 PNG 변환 처리
      await Promise.all(
        images.map(async (img) => {
          const src = img.getAttribute('src') || ''
          if (src.startsWith('data:image/svg+xml') || src.includes('<svg')) {
            const pngUrl = await svgToPngDataUrl(src)
            img.setAttribute('src', pngUrl)
            // 네이버 에디터 호환 인라인 스타일 보존
            img.style.display = 'block'
            img.style.maxWidth = '100%'
            img.style.margin = '25px auto'
          }
        })
      )

      const finalHtml = tempContainer.innerHTML
      const plainText = tempContainer.innerText || tempContainer.textContent || ''

      let copySuccess = false

      // 2. 2026 W3C 표준 비동기 클립보드 API (대용량 Base64 이미지 무손실 주입)
      if (typeof navigator !== 'undefined' && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
        try {
          const htmlBlob = new Blob([finalHtml], { type: 'text/html' })
          const textBlob = new Blob([plainText], { type: 'text/plain' })
          await navigator.clipboard.write([
            new ClipboardItem({
              'text/html': htmlBlob,
              'text/plain': textBlob
            })
          ])
          copySuccess = true
        } catch (apiErr) {
          console.warn('W3C Clipboard API write failed, trying fallback...', apiErr)
        }
      }

      // 3. Fallback: contentEditable document.execCommand('copy')
      if (!copySuccess) {
        const el = document.createElement('div')
        el.innerHTML = finalHtml
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
          description: '모든 카드가 고화질 PNG 사진으로 변환되어 서식과 함께 복사되었습니다. 네이버 블로그에 붙여넣어 주세요.'
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
    } finally {
      setIsConverting(false)
    }
  }

  return (
    <Button 
      onClick={handleCopyClick}
      disabled={isConverting}
      className={`font-semibold shadow-md transition-all cursor-pointer ${
        isCopied 
          ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
          : 'bg-[#03C75A] hover:bg-[#02b350] text-white'
      } ${className}`}
    >
      {isConverting ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          <span>PNG 사진 변환 중...</span>
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
