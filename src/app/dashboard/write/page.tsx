'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCompletion } from '@ai-sdk/react'
import { marked } from 'marked'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles, PenTool } from 'lucide-react'
import { CopyToNaverBtn } from '@/components/CopyToNaverBtn'
import { AutoPublishBtn } from '@/components/AutoPublishBtn'
import { MultiPublishBtn } from '@/components/MultiPublishBtn'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

export default function WritePage() {
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get('keyword') || ''

  const [keyword, setKeyword] = useState(initialKeyword)
  const [tone, setTone] = useState('친근하고 전문적인 블로거 톤 (20~30대 타겟)')
  const [model, setModel] = useState('gemini-3.6-flash')
  const [experience, setExperience] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const { toast } = useToast()

  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/generate-seo',
    streamProtocol: 'text',
    onError: (err) => {
      toast({
        title: '생성 에러',
        description: err.message || '글 생성 중 오류가 발생했습니다 (크레딧 부족 등).',
        variant: 'destructive'
      })
    },
    onFinish: () => {
      toast({
        title: '작성 완료',
        description: 'SEO 최적화 블로그 글이 생성되었습니다.',
      })
    }
  })

  // Parse markdown completion to HTML
  const parsedHtml = useMemo(() => {
    if (!completion) return '';
    
    // 스트리밍 중이 아닐 때 완벽히 닫힌 코드블록 추출
    const match = completion.match(/```(?:html)?\n([\s\S]*?)```/i);
    if (match) {
      return match[1].trim();
    }
    
    // 스트리밍 중이거나 코드블록이 없을 때 앞뒤 백틱 제거
    return completion
      .replace(/^[\s\S]*?```(?:html)?\n?/i, '') // 시작 백틱과 그 앞의 잡담 제거
      .replace(/\n?```$/i, '')
      .trim();
  }, [completion]);

  const handleGenerate = () => {
    if (!keyword.trim()) {
      toast({ title: '알림', description: '타겟 키워드를 입력해 주세요.' })
      return
    }

    toast({
      title: '생성 시작',
      description: 'AI가 C-Rank 및 DIA 알고리즘에 맞춰 글을 작성합니다. (약 30~60초 소요)',
    })

    setPostTitle(`${keyword.trim()} (SEO 최적화)`)

    complete(keyword, {
      body: {
        tone,
        model,
        experience
      }
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr] h-[calc(100vh-8rem)]">
      
      {/* 좌측 패널: 설정 */}
      <Card className="flex flex-col h-full border-slate-200 shadow-sm">
        <CardHeader className="bg-slate-50/50 border-b">
          <CardTitle className="flex items-center gap-2">
            <PenTool className="w-5 h-5 text-indigo-500" />
            SEO 블로그 쓰기
          </CardTitle>
          <CardDescription>
            타겟 키워드와 톤앤매너를 설정하면 네이버 알고리즘에 최적화된 HTML 글을 생성합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex-1 flex flex-col gap-6 overflow-auto">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">타겟 키워드</label>
              <Input 
                placeholder="예: 강남 세무사 증여세 상담" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">AI 모델 (Multi-LLM)</label>
              <Select value={model} onValueChange={(val) => setModel(val || '')} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="AI 모델 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="claude-5-sonnet-latest">Claude 5 Sonnet (최고 품질/추천)</SelectItem>
                  <SelectItem value="gemini-3.6-flash">Gemini 3.6 Flash (초고속/대량생산)</SelectItem>
                  <SelectItem value="gpt-5.6-luna">GPT-5.6 Luna (가성비)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">톤앤매너 (문체)</label>
              <Select value={tone} onValueChange={(val) => setTone(val || '')} disabled={isLoading}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="톤앤매너 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="친근하고 전문적인 블로거 톤 (20~30대 타겟)">친근한 블로거 (2030 타겟)</SelectItem>
                  <SelectItem value="매우 객관적이고 정보 전달에 충실한 전문가 톤">정보 전달형 전문가</SelectItem>
                  <SelectItem value="직접 내돈내산으로 경험한 듯한 솔직한 후기 톤">내돈내산 솔직 후기</SelectItem>
                  <SelectItem value="감성적이고 부드러운 일상 에세이 톤">감성적인 에세이</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
              <label className="text-sm font-bold text-indigo-900 flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                오늘의 핵심 상담 사례 / 판례 포인트 1줄 (선택)
              </label>
              <p className="text-xs text-indigo-700 mb-2">
                기계적인 글을 피하기 위해 전문가님께서 오늘 겪으신 특이 케이스나 중요하게 다룬 이슈를 한 줄만 적어주세요.
              </p>
              <textarea 
                className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="예: 오늘 다주택자 양도소득세 절세 상담을 진행했는데, 일시적 2주택 비과세 특례 요건을 놓칠 뻔한 사례가 있었음." 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isLoading || !keyword}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all mt-4"
          >
            {isLoading ? (
              !completion ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 상위 블로그 분석 중...</>
              ) : (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI 원고 작성 중...</>
              )
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" /> AI 블로그 생성하기</>
            )}
          </Button>

          <div className="bg-indigo-50 text-indigo-800 p-4 rounded-lg text-sm leading-relaxed mt-auto border border-indigo-100">
            <p className="font-semibold mb-1">💡 작성 가이드</p>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>1회 생성 시 1 크레딧이 차감됩니다.</li>
              <li>생성된 글은 네이버 스마트에디터 환경에 맞게 순수 HTML로 구성됩니다.</li>
              <li>우측 하단의 [복사하기] 버튼을 통해 네이버에 붙여넣어 보세요.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 우측 패널: 렌더링 뷰어 */}
      <Card className="flex flex-col h-full border-slate-200 shadow-sm overflow-hidden bg-[#f9f9f9]">
        <CardHeader className="bg-white border-b py-3 px-4 flex-row items-center justify-between shadow-sm z-10">
          <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
            <span className="w-2 h-2 rounded-full bg-[#03C75A] mr-2"></span>
            스마트에디터 미리보기
          </CardTitle>
          {isLoading && <span className="text-xs text-indigo-500 font-medium animate-pulse">스트리밍 중...</span>}
        </CardHeader>
        
        {/* HTML 렌더링 영역 */}
        <CardContent className="p-0 flex-1 overflow-auto">
          {!parsedHtml && !isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400">
              좌측 패널에서 생성하기 버튼을 눌러주세요.
            </div>
          ) : (
            <div 
              className="p-8 max-w-3xl mx-auto bg-white min-h-full prose prose-slate prose-headings:text-slate-800 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-slate-700 prose-p:text-slate-600"
              dangerouslySetInnerHTML={{ __html: parsedHtml }}
            />
          )}
        </CardContent>
        
        {/* 하단 복사 버튼 영역 */}
        <div className="p-4 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 flex flex-col gap-3">
           <div className="flex items-center gap-2">
             <label className="text-sm font-bold text-slate-700 whitespace-nowrap">제목</label>
             <Input 
               value={postTitle}
               onChange={(e) => setPostTitle(e.target.value)}
               placeholder="생성된 글의 제목이 여기에 표시됩니다."
               className="font-bold text-slate-800 focus-visible:ring-indigo-500 h-10"
             />
           </div>
           <div className="flex flex-col xl:flex-row gap-2 items-stretch">
             <CopyToNaverBtn content={parsedHtml} className="flex-1 h-11" />
             <AutoPublishBtn title={postTitle} content={parsedHtml} className="flex-1 h-11" />
             <MultiPublishBtn title={postTitle} content={parsedHtml} />
           </div>
        </div>
      </Card>

    </div>
  )
}
