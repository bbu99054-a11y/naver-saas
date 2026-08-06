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
}

export function CopyToNaverBtn({ content }: CopyToNaverBtnProps) {
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const handleCopy = async () => {
    if (!content) return

    try {
      // 1. 순수 텍스트(Fallback) 추출
      // 간단히 HTML 태그를 제거하여 plain text 생성
      const plainText = content.replace(/<[^>]+>/g, '')

      // 2. Blob 객체 생성
      const htmlBlob = new Blob([content], { type: 'text/html' })
      const plainBlob = new Blob([plainText], { type: 'text/plain' })

      // 3. ClipboardItem 생성 (최신 브라우저 API)
      const clipboardItem = new ClipboardItem({
        'text/html': htmlBlob,
        'text/plain': plainBlob
      })

      // 4. 클립보드에 적재
      await navigator.clipboard.write([clipboardItem])

      setIsCopied(true)
      toast({
        title: '복사 완료!',
        description: '네이버 블로그 쓰기 창에서 Ctrl+V를 누르세요. 서식이 완벽하게 복사됩니다.'
      })

      setTimeout(() => setIsCopied(false), 3000)
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
      onClick={handleCopy}
      className={`w-full font-semibold shadow-md transition-all ${isCopied ? 'bg-green-600 hover:bg-green-700' : 'bg-[#03C75A] hover:bg-[#02b350] text-white'}`}
    >
      {isCopied ? (
        <><CheckCircle2 className="w-4 h-4 mr-2" /> 복사 완료! 블로그에 붙여넣으세요</>
      ) : (
        <><Copy className="w-4 h-4 mr-2" /> 스마트에디터 양식 그대로 복사하기</>
      )}
    </Button>
  )
}
