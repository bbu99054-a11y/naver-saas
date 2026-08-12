'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Globe, FileText, Loader2, ExternalLink } from 'lucide-react'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
      alert(`${props.title}\n${props.description}`);
    }
  }
}

interface MultiPublishBtnProps {
  articleId?: string;
  title?: string;
  content?: string;
}

export function MultiPublishBtn({ articleId, title, content }: MultiPublishBtnProps) {
  const [wpLoading, setWpLoading] = useState(false)
  const [tsLoading, setTsLoading] = useState(false)
  const { toast } = useToast()

  const handlePublish = async (platform: 'wordpress' | 'tistory') => {
    if (platform === 'wordpress') setWpLoading(true)
    else setTsLoading(true)

    try {
      const editorDom = document.getElementById('editor-preview')
      const finalContent = editorDom ? editorDom.innerHTML : content

      const response = await fetch(`/api/publish/${platform}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, title, content: finalContent })
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: '발행 완료 🎉',
          description: `${platform === 'wordpress' ? '워드프레스' : '티스토리'}에 글이 성공적으로 발행되었습니다.`
        })
        if (data.url) {
          window.open(data.url, '_blank')
        }
      } else {
        throw new Error(data.error || '알 수 없는 오류가 발생했습니다.')
      }

    } catch (error: any) {
      toast({
        title: '발행 실패',
        description: error.message || 'API 연동 정보를 다시 확인해주세요.',
        variant: 'destructive'
      })
    } finally {
      if (platform === 'wordpress') setWpLoading(false)
      else setTsLoading(false)
    }
  }

  return (
    <div className="flex gap-2 h-full">
      <Button 
        onClick={() => handlePublish('wordpress')}
        disabled={wpLoading}
        title="워드프레스에 발행"
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-3 flex-1 h-11 shadow-sm overflow-hidden"
      >
        {wpLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" /> : <Globe className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
        <span className="ml-1 sm:ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">워드프레스</span>
      </Button>

      <Button 
        onClick={() => handlePublish('tistory')}
        disabled={tsLoading}
        title="티스토리에 발행"
        className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-3 flex-1 h-11 shadow-sm overflow-hidden"
      >
        {tsLoading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin shrink-0" /> : <FileText className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />}
        <span className="ml-1 sm:ml-2 whitespace-nowrap overflow-hidden text-ellipsis text-xs sm:text-sm">티스토리</span>
      </Button>
    </div>
  )
}
