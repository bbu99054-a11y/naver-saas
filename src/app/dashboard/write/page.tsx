'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useCompletion } from '@ai-sdk/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Loader2, Sparkles, PenTool, Monitor, Smartphone, 
  Copy, Check, FileText, Clock, BookOpen 
} from 'lucide-react'
import { CopyToNaverBtn } from '@/components/CopyToNaverBtn'
import { MultiPublishBtn } from '@/components/MultiPublishBtn'
import { checkKeywordDuplicate } from '@/actions/articles'
import { preUploadCardImages, processPostInfographics } from '@/lib/cardImageUploader'




// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

import { stripInternalMetadata } from '@/lib/utils/postSanitizer'

export default function WritePage() {
  const searchParams = useSearchParams()
  const initialKeyword = searchParams.get('keyword') || ''

  const [keyword, setKeyword] = useState(initialKeyword)
  const [tone, setTone] = useState('신뢰형 전문가 칼럼 (법리·판례 중심의 차분하고 명쾌한 분석)')
  const [experience, setExperience] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [viewMode, setViewMode] = useState<'pc' | 'mobile'>('pc')
  const [isTitleCopied, setIsTitleCopied] = useState(false)
  const [readyHtml, setReadyHtml] = useState('')
  const [isImagesReady, setIsImagesReady] = useState(false)
  const [showQuotaModal, setShowQuotaModal] = useState(false)
  const [quotaMessage, setQuotaMessage] = useState('')
  const { toast } = useToast()

  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/generate-seo',
    streamProtocol: 'text',
    onError: (err) => {
      const errMsg = err.message || ''
      if (errMsg.includes('DAILY_LIMIT_EXCEEDED') || errMsg.includes('일일 생성 한도') || errMsg.includes('크레딧이 부족') || errMsg.includes('INSUFFICIENT_CREDITS')) {
        setQuotaMessage('무료 체험 크레딧(3회)을 모두 소진하셨습니다.')
        setShowQuotaModal(true)
        return
      }
      if (errMsg.includes('CONCURRENT_LOCK') || errMsg.includes('다른 창에서')) {
        toast({
          title: '⚠️ 동시 생성 제한',
          description: '현재 다른 창에서 원고 생성이 진행 중입니다. 생성이 완료된 후 다시 시도해 주세요.',
          variant: 'destructive'
        })
        return
      }
      if (errMsg.includes('RATE_LIMIT') || errMsg.includes('너무 빠른')) {
        toast({
          title: '⏳ 호출 속도 제한',
          description: '너무 빠른 요청입니다. 잠시 후 다시 시도해 주세요.',
          variant: 'destructive'
        })
        return
      }
      toast({
        title: '생성 에러',
        description: errMsg || '글 생성 중 오류가 발생했습니다 (크레딧 부족 등).',
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

    // <post_title> 태그 제거 (완성형 및 스트리밍 중인 미완성 태그 모두 제거)
    let clean = content.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').replace(/<post_title>[\s\S]*$/i, '').trim();

    // 내부 기획 메모([팩트 체크], [목표 분량], [탈 양산화 설계도]) 원천 정제
    clean = stripInternalMetadata(clean);

    // 마크다운 소제목(##, ###)을 네이버 100% 호환 22px 대제목 HTML로 자동 변환 (2중 안전장치)
    clean = clean.replace(/^##\s+(.*?)$/gm, '<h2 style="font-size: 22px; font-weight: bold; color: #0F172A; margin: 36px 0 16px 0; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px;">$1</h2>');
    clean = clean.replace(/^###\s+(.*?)$/gm, '<h3 style="font-size: 18px; font-weight: bold; color: #1E293B; margin: 24px 0 12px 0;">$1</h3>');

    // 문단(<p>) 태그에 표준 16px 인라인 스타일 보장
    clean = clean.replace(/<p(?![^>]*style=)([^>]*)>/gi, '<p style="font-size: 16px; line-height: 1.85; margin: 16px 0; color: #1F2937;"$1>');

    // 단락(<p>) 태그에 한해서만 중앙정렬을 좌측정렬로 보정 (1:1 썸네일 카드, 테이블, 뱃지 중앙정렬 완벽 보존)
    clean = clean.replace(/(<p[^>]*style="[^"]*?)text-align:\s*center;?([^"]*">)/gi, '$1text-align: left;$2');

    // SVG Data-URI 자동 정규화 및 라이트 모드 고대비 컬러 가드 (따옴표 쪼개짐 및 검은 화면 원천 차단)
    clean = clean.replace(/<img([^>]+)src=(["'])(data:image\/svg\+xml[\s\S]*?)\2([^>]*)>/gi, (match, beforeSrc, quote, rawDataUri, afterSrc) => {
      try {
        const commaIdx = rawDataUri.indexOf(',');
        if (commaIdx === -1) return match;

        let svgContent = rawDataUri.substring(commaIdx + 1);
        try {
          if (svgContent.startsWith('%3C') || svgContent.includes('%20') || svgContent.includes('%23')) {
            svgContent = decodeURIComponent(svgContent);
          }
        } catch {}

        // 1. 어두운 배경을 화사한 라이트 배경(#F8FAFC, #FDFBF7)으로 실시간 자동 치환
        svgContent = svgContent
          .replace(/<rect([^>]*?)fill=['"](#000000|#0f172a|#111827|black)['"]/gi, "<rect$1fill='#F8FAFC'")
          .replace(/<rect([^>]*?)fill=['"]#0[fF]172[aA]['"]/gi, "<rect$1fill='#FDFBF7'");

        // 2. fill이 누락된 <text>에 짙은 네이비(#0F172A) 강제 주입
        svgContent = svgContent.replace(/<text(?![^>]*fill=)([^>]*)>/gi, "<text fill='#0F172A'$1>");

        // 3. 필수 SVG 네임스페이스 보장
        if (!svgContent.includes('xmlns=')) {
          svgContent = svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        const safeEncoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
        return `<img${beforeSrc}src="${safeEncoded}"${afterSrc}>`;
      } catch {}
      return match;
    });

    // 0. 본문 마크다운 이미지 및 엑스박스 이미지 태그 자동 탐지 및 고화질 카드 URL로 치환
    clean = processPostInfographics(clean, keyword || 'postsynk_post_seed');

    // 카드 이미지 미리보기 스타일 보정
    clean = clean.replace(/<img([^>]+src=["']\/api\/card-image\/[^"']+["'][^>]*)>/gi, (match) => {
      if (!match.includes('style=')) {
        return match.replace('<img', '<img style="display:block;max-width:100%;height:auto;margin:20px auto;border-radius:14px;box-shadow:0 8px 24px rgba(0,0,0,0.06);"')
      }
      return match
    });

    // 유니코드 결합 제어 문자 (바코드 글리프 잔여물) 완전 제거
    clean = clean.replace(/[\uFE00-\uFE0F\u200B-\u200D\u20E0-\u20E3]+/g, '');

    return clean;
  }, [completion, keyword]);




  // 원고 실시간 통계 메트릭 계산
  const textMetrics = useMemo(() => {
    if (!parsedHtml) return { charsWithSpaces: 0, charsNoSpaces: 0, readTimeMin: 0 };
    const pureText = parsedHtml.replace(/<[^>]*>/g, '').trim();
    const charsWithSpaces = pureText.length;
    const charsNoSpaces = pureText.replace(/\s/g, '').length;
    const readTimeMin = Math.max(1, Math.ceil(charsNoSpaces / 500));
    return { charsWithSpaces, charsNoSpaces, readTimeMin };
  }, [parsedHtml]);

  // 원고 스트리밍 완료 시 백그라운드 사전 업로드 (0.01초 무손실 복사 준비)
  useEffect(() => {
    let isMounted = true;
    if (!isLoading && parsedHtml && parsedHtml.length > 50) {
      setIsImagesReady(false);
      preUploadCardImages(parsedHtml).then(({ updatedHtml }) => {
        if (isMounted) {
          setReadyHtml(updatedHtml);
          setIsImagesReady(true);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [isLoading, parsedHtml]);

  const ensurePreUploadReady = async (): Promise<string> => {
    if (readyHtml) return readyHtml;
    const { updatedHtml } = await preUploadCardImages(parsedHtml);
    setReadyHtml(updatedHtml);
    setIsImagesReady(true);
    return updatedHtml;
  };

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
    <div className="flex gap-3.5 h-[calc(100vh-6.2rem)] max-h-[calc(100vh-6.2rem)] relative overflow-hidden pb-0.5">
      
      {/* 좌측 패널: 설정 (고정 폭 및 최적 비율) */}
      <Card className="w-[360px] xl:w-[370px] shrink-0 flex flex-col h-full border-slate-200 shadow-2xs bg-white">
        <CardHeader className="bg-slate-50/70 border-b py-2.5 px-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
              <PenTool className="w-4 h-4 text-indigo-600" />
              SEO 블로그 쓰기
            </CardTitle>
            <CardDescription className="text-[11px] text-slate-500 mt-0.5">
              타겟 키워드와 톤을 설정하고 생성합니다.
            </CardDescription>
          </div>
          <Link 
            href="/dashboard/guide" 
            target="_blank"
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 px-2 py-1 rounded-md flex items-center gap-1 transition-all"
            title="사용 가이드 새창으로 보기"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>가이드</span>
          </Link>
        </CardHeader>
        <CardContent className="p-4 flex-1 flex flex-col gap-3.5 overflow-auto">
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">타겟 키워드</label>
              <Input 
                placeholder="예: 송파 아파트 상속세 감정평가 세금 절감" 
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={isLoading}
                className="h-8.5 text-xs focus-visible:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">톤앤매너 (문체)</label>
              <Select value={tone} onValueChange={(val) => setTone(val || '')} disabled={isLoading}>
                <SelectTrigger className="w-full h-8.5 text-xs">
                  <SelectValue placeholder="톤앤매너 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="신뢰형 전문가 칼럼 (법리·판례 중심의 차분하고 명쾌한 분석)">
                    <span className="flex items-center gap-2 w-full">
                      <span className="inline-flex items-center justify-center w-5 shrink-0 text-center text-sm">⚖️</span>
                      <span className="truncate">신뢰형 전문가 칼럼 (기본 권장)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="친절한 1:1 상담사 (어려운 용어를 쉬운 일상 비유로 설명)">
                    <span className="flex items-center gap-2 w-full">
                      <span className="inline-flex items-center justify-center w-5 shrink-0 text-center text-sm">🤝</span>
                      <span className="truncate">친절한 1:1 상담사 (초보 의뢰인 맞춤)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="긴급 리스크 경고형 (기한 경과 시 불이익 및 즉각 조치 강조)">
                    <span className="flex items-center gap-2 w-full">
                      <span className="inline-flex items-center justify-center w-5 shrink-0 text-center text-sm">🚨</span>
                      <span className="truncate">긴급 리스크 경고형 (골든타임 대응)</span>
                    </span>
                  </SelectItem>
                  <SelectItem value="성공 사례 스토리텔링 (의뢰인의 고민 접수부터 전략적 해결 서사)">
                    <span className="flex items-center gap-2 w-full">
                      <span className="inline-flex items-center justify-center w-5 shrink-0 text-center text-sm">🏆</span>
                      <span className="truncate">성공 사례 스토리텔링 (실제 사건 해결)</span>
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100">
              <label className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                오늘의 핵심 상담 사례 / 판례 포인트 (선택)
              </label>
              <p className="text-[10px] text-indigo-700 leading-snug">
                특이 케이스를 1줄만 적어주시면 1인칭 후킹에 반영됩니다.
              </p>
              <textarea 
                className="flex min-h-[65px] w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs ring-offset-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-all h-9 text-xs font-bold mt-1"
          >
            {isLoading ? (
              !completion ? (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> 상위 블로그 분석 중...</>
              ) : (
                <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> AI 원고 작성 중...</>
              )
            ) : (
              <><Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI 블로그 생성하기</>
            )}
          </Button>

          <div className="bg-slate-50 text-slate-700 p-2.5 rounded-lg text-xs leading-relaxed mt-auto border border-slate-200">
            <p className="font-bold text-slate-800 text-[11px] mb-0.5 flex items-center gap-1">
              💡 작성 팁
            </p>
            <ul className="list-disc pl-3.5 space-y-0.5 text-[10px] text-slate-600">
              <li>1회 생성 시 1 크레딧이 차감됩니다.</li>
              <li>네이버 스마트에디터 ONE 전용 HTML로 자동 서식화됩니다.</li>
              <li>생성 후 우측 상단의 <strong>[모바일 뷰]</strong>로 스마트폰 화면을 확인해보세요.</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 우측 패널: 스마트에디터 렌더링 뷰어 (초슬림 상/하단 & 세로 공간 극대화) */}
      <Card className="flex-1 flex flex-col h-full border-slate-200 shadow-2xs overflow-hidden bg-slate-50">
        
        {/* 상단 1단 헤더: 스마트에디터 미리보기 + 메트릭 + PC/모바일 뷰 토글 (초슬림) */}
        <div className="bg-white border-b py-1.5 px-3 flex flex-row items-center justify-between shadow-2xs z-10 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#03C75A]"></span>
            <span className="text-xs font-bold text-slate-800">스마트에디터 미리보기</span>
            {isLoading && (
              <span className="text-[11px] text-indigo-600 font-semibold animate-pulse ml-1 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                ● 실시간 스트리밍 중...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* 원고 실시간 메트릭 */}
            {parsedHtml && (
              <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-500">
                <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1 font-medium">
                  <FileText className="w-3 h-3 text-slate-400" />
                  공백포함 <strong className="text-slate-800">{textMetrics.charsWithSpaces.toLocaleString()}</strong>자
                </span>
                <span className="bg-slate-50 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  약 <strong className="text-slate-800">{textMetrics.readTimeMin}</strong>분
                </span>
              </div>
            )}

            {/* PC / 모바일 뷰 전환 스위처 */}
            <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-md border border-slate-200">
              <button
                onClick={() => setViewMode('pc')}
                className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                  viewMode === 'pc'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Monitor className="w-3 h-3" />
                PC 뷰
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded transition-all ${
                  viewMode === 'mobile'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                모바일 뷰
              </button>
            </div>
          </div>
        </div>
        
        {/* 상단 2단: 제목 생성창 + 제목 복사 버튼 (초슬림 바로 위로 바짝 밀착) */}
        <div className="bg-slate-50/90 border-b border-slate-200 px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded shrink-0 border border-indigo-200/60">
            제목
          </span>
          <Input 
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
            placeholder="생성된 글의 제목이 여기에 표시됩니다."
            className="font-bold text-slate-900 bg-white border-slate-300 focus-visible:ring-indigo-500 h-8 text-xs flex-1"
          />
          <Button 
            variant="outline" 
            size="sm"
            className="h-8 shrink-0 border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold px-2.5 text-xs"
            onClick={() => {
              if (!postTitle) return;
              navigator.clipboard.writeText(postTitle);
              setIsTitleCopied(true);
              toast({ title: '복사 완료', description: '제목이 클립보드에 복사되었습니다.' });
              setTimeout(() => setIsTitleCopied(false), 2000);
            }}
          >
            {isTitleCopied ? (
              <><Check className="w-3 h-3 mr-1 text-emerald-600" /> 복사됨</>
            ) : (
              <><Copy className="w-3 h-3 mr-1" /> 제목 복사</>
            )}
          </Button>
        </div>

        {/* 중앙 본문 렌더링 영역 (세로 공간 극대화 및 좌측 정렬) */}
        <CardContent className="p-0 flex-1 overflow-auto bg-slate-100/50">
          {!parsedHtml && !isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2 p-6">
              <PenTool className="w-7 h-7 text-slate-300" />
              <p className="text-xs font-medium">좌측 패널에서 타겟 키워드를 입력하고 생성하기 버튼을 눌러주세요.</p>
            </div>
          ) : viewMode === 'mobile' ? (
            /* 모바일 스마트폰 뷰 프레임 */
            <div className="py-4 px-2 flex justify-center">
              <div className="w-[380px] bg-white rounded-[32px] border-[5px] border-slate-800 shadow-xl overflow-hidden min-h-[600px] flex flex-col">
                {/* 모바일 상태바 */}
                <div className="bg-slate-800 text-white text-[10px] px-5 py-1 flex justify-between items-center font-medium">
                  <span>9:41</span>
                  <div className="w-14 h-3 bg-slate-900 rounded-full mx-auto" />
                  <span>5G 100%</span>
                </div>
                {/* 네이버 블로그 앱 헤더 */}
                <div className="bg-[#03C75A] text-white px-3.5 py-1.5 text-xs font-bold flex items-center justify-between shadow-2xs">
                  <span>NAVER Blog</span>
                  <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">스마트에디터 ONE</span>
                </div>
                {/* 모바일 본문 (좌측 정렬) */}
                <div 
                  id="editor-preview"
                  contentEditable={true}
                  suppressContentEditableWarning={true}
                  className="p-4 flex-1 bg-white text-left prose prose-slate prose-headings:text-slate-900 prose-h2:text-[19px] prose-h2:font-bold prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-1.5 prose-h3:text-sm prose-p:text-slate-700 prose-p:leading-[1.8] prose-p:text-[15px] prose-p:mb-3.5 outline-none select-text"
                  dangerouslySetInnerHTML={{ __html: parsedHtml }}
                />
              </div>
            </div>
          ) : (
            /* PC 데스크톱 와이드 뷰 (좌측 정렬) */
            <div className="py-4 px-4 flex justify-center">
              <div 
                id="editor-preview"
                contentEditable={true}
                suppressContentEditableWarning={true}
                className="p-8 max-w-3xl w-full bg-white text-left min-h-[650px] shadow-2xs rounded-lg border border-slate-200 prose prose-slate prose-headings:text-slate-900 prose-h2:text-[22px] prose-h2:font-bold prose-h2:border-b-2 prose-h2:border-slate-100 prose-h2:pb-2 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-[1.9] prose-p:text-[16px] prose-p:mb-4.5 outline-none focus:ring-1 focus:ring-indigo-500 transition-all select-text"
                dangerouslySetInnerHTML={{ __html: parsedHtml }}
              />
            </div>
          )}
        </CardContent>
        
        {/* 하단 고정 액션 버튼 툴바 (초슬림 & 컴팩트) */}
        <div className="p-2 bg-white border-t border-slate-200 shadow-2xs z-10 flex gap-2 items-stretch">
          <CopyToNaverBtn 
            content={readyHtml || parsedHtml} 
            isImagesReady={isImagesReady}
            onEnsureReady={ensurePreUploadReady}
            className="flex-[1.3] h-8.5 shadow-2xs font-bold text-xs" 
          />
          <MultiPublishBtn title={postTitle} content={readyHtml || parsedHtml} className="flex-1" buttonClassName="h-8.5 text-xs font-bold" />
        </div>

      </Card>

      {/* 🚀 [신규] 무료 체험 소진 시 Pro 요금제 업그레이드 유도 모달 팝업 */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center space-y-5 relative animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-center mx-auto text-amber-600 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold text-slate-900">
                무료 체험 3회를 모두 사용하셨습니다 💡
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                가입 시 제공된 <strong>3회 무료 체험 크레딧이 모두 소진</strong>되었습니다. <br />
                계속해서 1위 노출 전문 블로그를 작성하시려면 요금제를 업그레이드해 주세요.
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100/80 rounded-xl p-4 text-left space-y-2 text-xs">
              <p className="font-bold text-indigo-950 flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-indigo-600" /> Pro 요금제 업그레이드 혜택:</span>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-extrabold">50% 평생 특가</span>
              </p>
              <ul className="space-y-1.5 text-slate-700 font-medium pl-3.5 list-disc">
                <li><strong>월 30건 (주 3~5회)</strong> 넉넉한 정기 포스팅 발행</li>
                <li><strong>1080px 고화질 실사 인포그래픽 카드</strong> 자동 생성</li>
                <li>전문직 맞춤 <strong>RAG 지식베이스 & 4대 톤앤매너</strong> 최적화</li>
                <li>워드프레스 · 티스토리 <strong>원클릭 동시 발행</strong> 지원</li>
              </ul>
            </div>

            <div className="space-y-2 pt-1">
              <Link href="/dashboard/billing" className="block w-full">
                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs h-10 shadow-md gap-1.5 cursor-pointer">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Pro 요금제 업그레이드하러 가기 →</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => setShowQuotaModal(false)}
                className="w-full text-xs text-slate-500 hover:text-slate-800 h-8 font-medium cursor-pointer"
              >
                다음에 하기 (닫기)
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
