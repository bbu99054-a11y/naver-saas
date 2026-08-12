'use client'

import { useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { searchCoupangProducts } from '@/actions/coupang'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Sparkles, Search, Loader2 } from 'lucide-react'

// 실제 프로덕션에서는 next-themes 등의 toast 훅을 사용하지만, Shadcn 초기화 시 기본 제공되는 toast를 가정
// Mock useToast for now
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      // alert(`${props.title}: ${props.description}`);
      console.log('Toast:', props);
    }
  }
}

export default function GeneratorClient() {
  const [keyword, setKeyword] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/generate',
    onError: (err) => {
      toast({
        title: '생성 에러',
        description: err.message || '글 생성 중 오류가 발생했습니다.',
        variant: 'destructive'
      })
    },
    onFinish: () => {
      toast({
        title: '작성 완료',
        description: '초안이 성공적으로 생성되어 데이터베이스에 저장되었습니다.',
      })
    }
  })

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast({ title: '알림', description: '타겟 키워드를 입력해 주세요.' })
      return
    }

    setIsSearching(true)
    
    // 1. 쿠팡 상품 검색 API 호출 (Server Action)
    const productRes = await searchCoupangProducts(keyword)
    
    setIsSearching(false)

    if (!productRes.success || !productRes.data) {
      toast({
        title: '쿠팡 검색 실패',
        description: productRes.error || '상품 정보를 불러오지 못했습니다.',
        variant: 'destructive'
      })
      return
    }

    if (productRes.data.length === 0) {
      toast({ title: '검색 결과 없음', description: '해당 키워드로 검색된 쿠팡 상품이 없습니다.' })
      return
    }

    toast({
      title: '생성 시작',
      description: 'AI가 콘텐츠를 작성하고 있습니다. 잠시만 기다려 주세요.',
    })

    // 2. AI 콘텐츠 생성 API 호출
    complete(keyword, {
      body: {
        targetKeyword: keyword,
        products: productRes.data
      }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr] h-[calc(100vh-8rem)]">
      
      {/* 좌측 패널: 설정 및 동작 */}
      <Card className="flex flex-col h-full border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            콘텐츠 생성기
          </CardTitle>
          <CardDescription>
            키워드를 입력하면 쿠팡 파트너스 상품을 검색하고 SEO 최적화된 글을 작성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-auto">
          <div className="space-y-2">
            <label htmlFor="keyword" className="text-sm font-medium text-slate-700">타겟 키워드</label>
            <div className="flex gap-2">
              <Input 
                id="keyword" 
                placeholder="예: 가성비 노트북 추천" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading || isSearching}
                className="flex-1"
              />
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || isSearching || !keyword}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            {isSearching ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 쿠팡 상품 검색 중...</>
            ) : isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI 작성 중...</>
            ) : (
              <><Search className="w-4 h-4 mr-2" /> 자동 생성 시작</>
            )}
          </Button>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm leading-relaxed mt-auto">
            <p className="font-semibold mb-1">💡 작성 가이드</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>키워드를 기반으로 연관 상품 10개를 불러옵니다.</li>
              <li>Claude 3.5 모델이 APB 프레임워크와 마크다운 표를 포함한 블로그 글을 실시간 작성합니다.</li>
              <li>작성이 완료되면 초안으로 자동 저장됩니다.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 우측 패널: 실시간 에디터/프리뷰 */}
      <Card className="flex flex-col h-full border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b py-3 px-4 flex-row items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-700">미리보기 (실시간 렌더링)</CardTitle>
          {isLoading && <span className="flex items-center text-xs text-indigo-500 font-medium"><span className="relative flex h-2 w-2 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span></span>스트리밍 중...</span>}
        </CardHeader>
        <CardContent className="p-0 flex-1 overflow-auto bg-white">
          <div className="prose prose-slate prose-sm md:prose-base max-w-none p-6 lg:p-10">
            {!completion && !isLoading ? (
              <div className="flex items-center justify-center h-full text-slate-400 min-h-[300px] border-2 border-dashed border-slate-100 rounded-xl m-6">
                좌측 패널에서 키워드를 입력하고 생성 버튼을 눌러주세요.
              </div>
            ) : (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({node, ...props}) => <div className="overflow-x-auto my-6"><table className="min-w-full divide-y divide-slate-300 border border-slate-200 rounded-lg" {...props} /></div>,
                  th: ({node, ...props}) => <th className="bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-slate-900 border-b border-slate-200" {...props} />,
                  td: ({node, ...props}) => <td className="px-4 py-3 text-sm text-slate-600 border-b border-slate-100" {...props} />,
                  a: ({node, ...props}) => <a className="text-indigo-600 font-medium hover:underline" target="_blank" rel="noopener noreferrer" {...props} />
                }}
              >
                {completion}
              </ReactMarkdown>
            )}
          </div>
        </CardContent>
      </Card>

    </div>
  )
}
