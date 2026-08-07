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
  articleId: string;
}

export function MultiPublishBtn({ articleId }: MultiPublishBtnProps) {
  const [wpLoading, setWpLoading] = useState(false)
  const [tsLoading, setTsLoading] = useState(false)
  const { toast } = useToast()

  const handlePublish = async (platform: 'wordpress' | 'tistory') => {
    if (platform === 'wordpress') setWpLoading(true)
    else setTsLoading(true)

    try {
      const response = await fetch(`/api/publish/${platform}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId })
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
    <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-100">
      <p className="text-sm font-bold text-slate-700 mb-1">🔗 타 플랫폼 원클릭 동시 발행</p>
      
      <Button 
        onClick={() => handlePublish('wordpress')}
        disabled={wpLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white flex justify-between items-center h-12"
      >
        <span className="flex items-center gap-2">
          {wpLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
          워드프레스에 원클릭 발행
        </span>
        <ExternalLink className="w-4 h-4 opacity-50" />
      </Button>

      <Button 
        onClick={() => handlePublish('tistory')}
        disabled={tsLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white flex justify-between items-center h-12"
      >
        <span className="flex items-center gap-2">
          {tsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
          티스토리에 원클릭 발행
        </span>
        <ExternalLink className="w-4 h-4 opacity-50" />
      </Button>
    </div>
  )
}
