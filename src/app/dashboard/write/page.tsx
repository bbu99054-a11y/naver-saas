'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCompletion } from '@ai-sdk/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Loader2, Sparkles, PenTool, Monitor, Smartphone, 
  PanelLeftClose, PanelLeftOpen, Copy, Check, FileText, Clock 
} from 'lucide-react'
import { CopyToNaverBtn } from '@/components/CopyToNaverBtn'
import { AutoPublishBtn } from '@/components/AutoPublishBtn'
import { MultiPublishBtn } from '@/components/MultiPublishBtn'
import { checkKeywordDuplicate } from '@/actions/articles'

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
  const [experience, setExperience] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [viewMode, setViewMode] = useState<'pc' | 'mobile'>('pc')
  const [isTitleCopied, setIsTitleCopied] = useState(false)
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

  // 실시간 스트리밍 중 제목 파싱
  useEffect(() => {
    const titleMatch = completion.match(/<post_title>([\s\S]*?)<\/post_title>/i);
    if (titleMatch && titleMatch[1]) {
      setPostTitle(titleMatch[1].trim());
    }
  }, [completion]);

  // Parse markdown / HTML completion and normalize to natural left-aligned text
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

    // <post_title> 태그 제거
    let clean = content.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').trim();

    // 단락(<p>)의 강제 중앙정렬 스타일을 자연스러운 좌측 정렬로 변환
    clean = clean.replace(/style="([^"]*?)text-align:\s*center;?([^"]*?)"/gi, (m, before, after) => {
      return `style="${before}text-align: left;${after}"`;
    });

    return clean;
  }, [completion]);

  // 원고 실시간 통계 메트릭 계산
  const textMetrics = useMemo(() => {
    if (!parsedHtml) return { charsWithSpaces: 0, charsNoSpaces: 0, readTimeMin: 0 };
    const pureText = parsedHtml.replace(/<[^>]*>/g, '').trim();
    const charsWithSpaces = pureText.length;
    const charsNoSpaces = pureText.replace(/\s/g, '').length;
    const readTimeMin = Math.max(1, Math.ceil(charsNoSpaces / 500));
    return { charsWithSpaces, charsNoSpaces, readTimeMin };
  }, [parsedHtml]);

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

  return (
    <div className="flex gap-4 h-[calc(100vh-6.5rem)] relative overflow-hidden">
      
      {/* 좌측 패널: 설정 (원클릭 접기/펼치기 지원) */}
      {isSidebarOpen && (
        <Card className="w-[380px] shrink-0 flex flex-col h-full border-slate-200 shadow-sm transition-all duration-300 animate-in fade-in-50">
          <CardHeader className="bg-slate-50/70 border-b py-3.5 px-5 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
                <PenTool className="w-4 h-4 text-indigo-600" />
                SEO 블로그 쓰기
              </CardTitle>
              <CardDescription className="text-xs mt-0.5">
                타겟 키워드와 톤을 설정하고 생성합니다.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(false)}
              className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
              title="설정 패널 접기 (와이드 뷰)"
            >
              <PanelLeftClose className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-5 flex-1 flex flex-col gap-5 overflow-auto">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">타겟 키워드</label>
                <Input 
                  placeholder="예: 송파 아파트 상속세 감정평가 세금 절감" 
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  disabled={isLoading}
                  className="h-9 text-sm focus-visible:ring-indigo-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">톤앤매너 (문체)</label>
                <Select value={tone} onValueChange={(val) => setTone(val || '')} disabled={isLoading}>
                  <SelectTrigger className="w-full h-9 text-sm">
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

              <div className="space-y-1.5 bg-indigo-50/50 p-3.5 rounded-lg border border-indigo-100">
                <label className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  오늘의 핵심 상담 사례 / 판례 포인트 (선택)
                </label>
                <p className="text-[11px] text-indigo-700 leading-snug">
                  특이 케이스나 강조하고 싶은 사례를 1줄만 적어주시면 1인칭 후킹에 반영됩니다.
                </p>
                <textarea 
                  className="flex min-h-[70px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="예: 다주택자 양도세 절세 상담 중 일시적 2주택 비과세 특례 요건을 구제한 사례." 
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !keyword}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all h-10 text-sm font-bold mt-2"
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

            <div className="bg-slate-50 text-slate-700 p-3.5 rounded-lg text-xs leading-relaxed mt-auto border border-slate-200">
              <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                💡 작성 팁
              </p>
              <ul className="list-disc pl-3.5 space-y-1 text-[11px] text-slate-600">
                <li>1회 생성 시 1 크레딧이 차감됩니다.</li>
                <li>네이버 스마트에디터 ONE 전용 HTML로 자동 서식화됩니다.</li>
                <li>생성 후 우측 상단의 <strong>[모바일 뷰]</strong>로 스마트폰 화면을 미리 확인해보세요.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 우측 패널: 스마트에디터 렌더링 뷰어 (와이드 자동 확장) */}
      <Card className="flex-1 flex flex-col h-full border-slate-200 shadow-sm overflow-hidden bg-slate-50 transition-all duration-300">
        
        {/* 상단 1단 헤더: 사이드바 토글 버튼 + 제목 + 상태 + PC/모바일 뷰 스위처 */}
        <CardHeader className="bg-white border-b py-2.5 px-4 flex flex-row items-center justify-between shadow-xs z-10 gap-3">
          <div className="flex items-center gap-2.5">
            {!isSidebarOpen && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="h-8 px-2.5 text-xs text-indigo-700 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-100 flex items-center gap-1 font-semibold"
                title="설정 패널 열기"
              >
                <PanelLeftOpen className="w-4 h-4" />
                설정창 열기
              </Button>
            )}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]"></span>
              <CardTitle className="text-sm font-bold text-slate-800">
                스마트에디터 미리보기
              </CardTitle>
            </div>
            {isLoading && (
              <span className="text-xs text-indigo-600 font-semibold animate-pulse ml-1 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                ● 실시간 스트리밍 중...
              </span>
            )}
          </div>

          {/* PC / 모바일 뷰 전환 스위처 */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('pc')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'pc'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              PC 뷰
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                viewMode === 'mobile'
                  ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              모바일 뷰
            </button>
          </div>
        </CardHeader>
        
        {/* 상단 2단: 제목 생성창 + 제목 복사 버튼 + 실시간 글자수 통계 */}
        <div className="bg-slate-50/90 border-b border-slate-200 px-4 py-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-bold text-indigo-700 bg-indigo-100/80 px-2 py-1 rounded shrink-0 border border-indigo-200/60">
              제목
            </span>
            <Input 
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              placeholder="생성된 글의 제목이 여기에 표시됩니다."
              className="font-bold text-slate-900 bg-white border-slate-300 focus-visible:ring-indigo-500 h-9 text-sm flex-1"
            />
            <Button 
              variant="outline" 
              size="sm"
              className="h-9 shrink-0 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold px-3"
              onClick={() => {
                if (!postTitle) return;
                navigator.clipboard.writeText(postTitle);
                setIsTitleCopied(true);
                toast({ title: '복사 완료', description: '제목이 클립보드에 복사되었습니다.' });
                setTimeout(() => setIsTitleCopied(false), 2000);
              }}
            >
              {isTitleCopied ? (
                <><Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> 복사됨</>
              ) : (
                <><Copy className="w-3.5 h-3.5 mr-1" /> 제목 복사</>
              )}
            </Button>
          </div>

          {/* 원고 실시간 메트릭 */}
          {parsedHtml && (
            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0 self-end sm:self-center">
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1 font-medium shadow-2xs">
                <FileText className="w-3 h-3 text-slate-400" />
                공백포함 <strong className="text-slate-800 font-bold">{textMetrics.charsWithSpaces.toLocaleString()}</strong>자
              </span>
              <span className="bg-white px-2.5 py-1 rounded border border-slate-200 flex items-center gap-1 font-medium shadow-2xs">
                <Clock className="w-3 h-3 text-slate-400" />
                약 <strong className="text-slate-800 font-bold">{textMetrics.readTimeMin}</strong>분 읽기
              </span>
            </div>
          )}
        </div>

        {/* 중앙 본문 렌더링 영역 (좌측 정렬 및 PC vs 모바일 뷰 전환) */}
        <CardContent className="p-0 flex-1 overflow-auto bg-slate-100/60">
          {!parsedHtml && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 p-8">
              <PenTool className="w-8 h-8 text-slate-300" />
              <p className="text-sm font-medium">좌측 패널에서 타겟 키워드를 입력하고 생성하기 버튼을 눌러주세요.</p>
            </div>
          ) : viewMode === 'mobile' ? (
            /* 모바일 스마트폰 뷰 프레임 (390px 스마트폰 규격 재현) */
            <div className="py-6 px-2 flex justify-center">
              <div className="w-[390px] bg-white rounded-[36px] border-[6px] border-slate-800 shadow-2xl overflow-hidden min-h-[700px] flex flex-col">
                {/* 모바일 상단 상태바 */}
                <div className="bg-slate-800 text-white text-[11px] px-6 py-1.5 flex justify-between items-center font-medium">
                  <span>9:41</span>
                  <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto" />
                  <span>5G 100%</span>
                </div>
                {/* 네이버 블로그 앱 헤더 */}
                <div className="bg-[#03C75A] text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-xs">
                  <span>NAVER Blog</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">스마트에디터 ONE</span>
                </div>
                {/* 모바일 본문 (좌측 정렬) */}
                <div 
                  id="editor-preview"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  className="p-5 flex-1 bg-white text-left prose prose-slate prose-headings:text-slate-900 prose-h2:text-lg prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-1.5 prose-h3:text-base prose-p:text-slate-700 prose-p:leading-[1.85] prose-p:text-[15px] prose-p:mb-4 outline-none select-text"
                  dangerouslySetInnerHTML={{ __html: parsedHtml }}
                />
              </div>
            </div>
          ) : (
            /* PC 데스크톱 와이드 뷰 (좌측 정렬) */
            <div className="py-6 px-4 flex justify-center">
              <div 
                id="editor-preview"
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="p-10 max-w-3xl w-full bg-white text-left min-h-[750px] shadow-xs rounded-xl border border-slate-200 prose prose-slate prose-headings:text-slate-900 prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-slate-800 prose-p:text-slate-700 prose-p:leading-[1.9] prose-p:text-[16px] prose-p:mb-5 outline-none focus:ring-2 focus:ring-indigo-500 transition-all select-text"
                dangerouslySetInnerHTML={{ __html: parsedHtml }}
              />
            </div>
          )}
        </CardContent>
        
        {/* 하단 고정 액션 버튼 툴바 */}
        <div className="p-3.5 bg-white border-t border-slate-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.03)] z-10 flex flex-col xl:flex-row gap-2 items-stretch">
          <CopyToNaverBtn content={parsedHtml} className="flex-1 h-11 shadow-sm font-bold text-sm" />
          <AutoPublishBtn title={postTitle} content={parsedHtml} className="flex-1 h-11 shadow-sm font-bold text-sm" />
          <MultiPublishBtn title={postTitle} content={parsedHtml} />
        </div>
      </Card>

    </div>
  )
}
