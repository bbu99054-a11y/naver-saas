'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCompletion } from '@ai-sdk/react'
import { marked } from 'marked'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles, PenTool, Smartphone, Monitor } from 'lucide-react'
import { CopyToNaverBtn } from '@/components/CopyToNaverBtn'
import { AutoPublishBtn } from '@/components/AutoPublishBtn'
import { MultiPublishBtn } from '@/components/MultiPublishBtn'
import { checkKeywordDuplicate, getLatestArticleCitations } from '@/actions/articles'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

export default function WritePage() {
  console.log("HELLO WORLD FROM WRITE PAGE");
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get('keyword') || ''

  const [keyword, setKeyword] = useState(initialKeyword)
  const [tone, setTone] = useState('친근하고 전문적인 블로거 톤 (20~30대 타겟)')
  const [experience, setExperience] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [citations, setCitations] = useState<any[] | null>(null)
  const [isMobileView, setIsMobileView] = useState(false)
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
    onFinish: async () => {
      toast({
        title: '작성 완료',
        description: 'SEO 최적화 블로그 글이 생성되었습니다.',
      })
      // DB 저장이 완료될 시간을 약간 대기 후 출처(Citations) 불러오기
      setTimeout(async () => {
        const refs = await getLatestArticleCitations(keyword.trim())
        if (refs && Array.isArray(refs)) {
          setCitations(refs)
        }
      }, 1500)
    }
  })

  // 실시간 스트리밍 중 제목 파싱
  useEffect(() => {
    const titleMatch = completion.match(/<post_title>([\s\S]*?)<\/post_title>/i);
    if (titleMatch && titleMatch[1]) {
      setPostTitle(titleMatch[1].trim());
    }
  }, [completion]);

  // Parse markdown completion to HTML
  const parsedHtml = useMemo(() => {
    if (!completion) return '';
    
    // 1. JSON 스트리밍에서 에러 발생 시 처리
    if (completion.includes('"error"')) {
      return `<div style="color:red; padding:20px;">생성 중 오류가 발생했습니다. 크레딧 부족이거나 서버 일시적 장애일 수 있습니다.</div>`
    }

    let content = completion;
    const match = completion.match(/```(?:html)?\n([\s\S]*?)```/i);
    if (match) {
      content = match[1].trim();
    } else {
      content = completion
        .replace(/^[\s\S]*?```(?:html)?\n?/i, '')
        .replace(/\n?```$/i, '')
        .trim();
    }

    return content.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').trim();
  }, [completion]);

  const handleGenerate = async () => {
    if (!keyword.trim()) {
      toast({ title: '알림', description: '타겟 키워드를 입력해 주세요.' })
      return
    }

    const isDuplicate = await checkKeywordDuplicate(keyword.trim())
    if (isDuplicate) {
      const proceed = window.confirm('⚠️ 중복 키워드 경고\n\n최근 30일 내에 동일한 키워드로 작성된 글이 있습니다.\n네이버 로직상 유사문서(저품질)로 분류될 위험이 높습니다.\n\n정말 이 키워드로 계속 작성하시겠습니까?')
      if (!proceed) return;
    }

    toast({
      title: '생성 시작',
      description: 'AI가 C-Rank 및 DIA 알고리즘에 맞춰 글을 작성합니다. (약 30~60초 소요)',
    })

    setPostTitle(`${keyword.trim()} (AI 제목 생성 중...)`)

    complete(keyword, {
      body: {
        tone,
        experience
      }
    })
  }

  const showCitations = (citations && citations.length > 0) || isLoading

  const gridColsClass = showCitations 
    ? "grid gap-6 lg:grid-cols-[350px_1fr_300px] h-[calc(100vh-8rem)]"
    : "grid gap-6 lg:grid-cols-[400px_1fr] h-[calc(100vh-8rem)]"

  return (
    <div className={gridColsClass}>
      
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
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm font-medium text-slate-700 flex items-center">
              <span className="w-2 h-2 rounded-full bg-[#03C75A] mr-2"></span>
              스마트에디터 미리보기
            </CardTitle>
            {isLoading && <span className="text-xs text-indigo-500 font-medium animate-pulse">스트리밍 중...</span>}
          </div>
          
          {/* 모바일 뷰 토글 버튼 */}
          <div className="flex items-center bg-slate-100 rounded-md p-1 border border-slate-200">
            <button
              onClick={() => setIsMobileView(false)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                !isMobileView ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              PC 뷰
            </button>
            <button
              onClick={() => setIsMobileView(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
                isMobileView ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              모바일 뷰
            </button>
          </div>
        </CardHeader>
        
        {/* HTML 렌더링 영역 */}
        <CardContent className="p-0 flex-1 overflow-auto bg-[#f9f9f9] flex justify-center">
          {!parsedHtml && !isLoading ? (
            <div className="flex items-center justify-center h-full text-slate-400 w-full">
              좌측 패널에서 생성하기 버튼을 눌러주세요.
            </div>
          ) : (
            <div 
              id="editor-preview"
              contentEditable={true}
              suppressContentEditableWarning={true}
              className={`p-8 bg-white min-h-full prose prose-slate prose-headings:text-slate-800 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-slate-700 prose-p:text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 ${
                isMobileView 
                  ? 'w-[390px] shadow-[0_0_15px_rgba(0,0,0,0.1)] border-x border-slate-200' 
                  : 'w-full max-w-3xl rounded-lg'
              }`}
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
               className="font-bold text-slate-800 focus-visible:ring-indigo-500 h-10 flex-1"
             />
             <Button 
               variant="outline" 
               className="h-10 shrink-0 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
               onClick={() => {
                 navigator.clipboard.writeText(postTitle)
                 toast({ title: '복사 완료', description: '제목이 클립보드에 복사되었습니다.' })
               }}
             >
               제목 복사
             </Button>
           </div>
           <div className="flex flex-col xl:flex-row gap-2 items-stretch">
             <CopyToNaverBtn content={parsedHtml} className="flex-1 h-11" />
             <AutoPublishBtn title={postTitle} content={parsedHtml} className="flex-1 h-11" />
             <MultiPublishBtn title={postTitle} content={parsedHtml} />
           </div>
        </div>
      </Card>

      {/* 우측 팩트체크 패널 (Citations) */}
      {showCitations && (
        <Card className="flex flex-col h-full border-slate-200 shadow-sm overflow-hidden bg-slate-50">
          <CardHeader className="bg-white border-b py-3 px-4 shadow-sm z-10">
            <CardTitle className="text-sm font-medium text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI 팩트체크 패널
            </CardTitle>
            <CardDescription className="text-xs mt-1">
              본문에 인용된 출처 [1], [2] 와 원문을 대조하여 사실관계를 검증하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 flex-1 overflow-auto flex flex-col gap-4">
            {isLoading && (!citations || citations.length === 0) ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                <span className="text-xs text-center leading-relaxed">에이전트가 국가법령정보센터 등<br/>신뢰할 수 있는 출처를 실시간으로<br/>수집하고 검증하고 있습니다...</span>
              </div>
            ) : citations?.map((c, idx) => (
              <div key={idx} className="bg-white p-3 rounded-md border border-slate-200 shadow-sm text-sm">
                <div className="font-bold text-slate-800 mb-1 flex items-start gap-1">
                  <span className="text-indigo-600">[{idx + 1}]</span> 
                  <span className="line-clamp-2">{c.title}</span>
                </div>
                <p className="text-slate-600 text-xs line-clamp-4 mb-2">{c.content}</p>
                <a 
                  href={c.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline break-all"
                >
                  원문 보기 &rarr;
                </a>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

    </div>
  )
}
