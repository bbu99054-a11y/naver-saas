import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { UserCircle, Network, PenTool, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function GuidePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
          📖 PostSync 사용 가이드
        </h1>
        <p className="text-slate-600 text-lg">
          상위 노출과 실제 수임(매출)을 이끌어내는 완벽한 AI 블로그 운영 비법을 알려드립니다.
        </p>
      </div>

      <div className="grid gap-8">
        
        {/* Step 1 */}
        <Card className="border-indigo-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500"></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                <UserCircle className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Step 1. 내 정보 관리 (AI 맞춤 학습)</CardTitle>
                <CardDescription className="text-sm mt-1">블로그 전문성을 높이기 위한 필수 초기 셋팅</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              PostSync의 AI는 단순한 템플릿 글이 아닌, <strong>"전문가님의 실제 경험(1인칭 스토리텔링)"</strong>이 녹아든 원고를 작성합니다. 
              이를 위해 AI가 대표님의 배경지식을 학습할 수 있도록 기본 정보를 입력해 주세요.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600"><strong className="text-slate-800">직군 및 상호명:</strong> 글의 신뢰도를 높이는 데 사용됩니다. (예: "강남 서초 법무법인 포스트싱크의 김대표 변호사입니다.")</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600"><strong className="text-slate-800">사무실 소개/철학:</strong> AI가 글의 서론이나 결론에 자연스럽게 삽입하여 잠재 고객의 마음을 움직입니다.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link href="/dashboard/settings/profile">
                <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                  내 정보 설정하러 가기 &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500"></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                <Network className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Step 2. 연재 기획 (롱테일 키워드 발굴)</CardTitle>
                <CardDescription className="text-sm mt-1">네이버 검색량을 싹쓸이할 황금 키워드 찾기</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              막연히 <span className="line-through text-slate-400">'강남 행정사'</span>처럼 경쟁이 치열한 단어만 쓰면 상위 노출이 어렵습니다. 
              대표님의 비즈니스와 관련된 <strong>핵심 단어(예: 영업정지 구제)</strong>를 입력하시면, 실제 고객이 다급하게 검색하는 구체적인 <strong>롱테일 키워드 10개</strong>를 AI가 즉시 발굴해 줍니다.
            </p>
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
              <p className="text-sm text-slate-600 font-medium mb-2">💡 이렇게 활용하세요!</p>
              <p className="text-xs text-slate-500">
                발굴된 키워드를 보면 "식당 미성년자 주류 판매 영업정지 구제 방법" 처럼 매우 구체적인 상황이 나옵니다. 
                이런 키워드는 경쟁이 낮아 <strong>글을 쓰는 즉시 상위에 노출</strong>되며, 실제 수임(매출)으로 직결될 확률이 매우 높습니다.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/dashboard/clustering">
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                  키워드 발굴하러 가기 &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="border-purple-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-purple-500"></div>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-xl">Step 3. SEO 블로그 쓰기 및 발행</CardTitle>
                <CardDescription className="text-sm mt-1">클릭 한 번으로 1분 만에 끝나는 포스팅</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">
              발굴된 키워드 옆의 <strong>[바로 글쓰기]</strong> 버튼을 누르거나, 쓰기 페이지에서 직접 키워드를 입력해 보세요. 
              네이버 C-Rank 및 DIA+ 알고리즘에 완벽히 최적화된 HTML 원고가 순식간에 작성됩니다.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600"><strong className="text-slate-800">오늘의 핵심 사례 추가:</strong> 기계적인 글을 피하려면, 입력창에 "오늘 다주택자 절세 상담을 했는데 요건을 놓칠 뻔함" 처럼 1줄만 적어주세요. AI가 그 내용을 뼈대로 소름 돋는 글을 써줍니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-600"><strong className="text-slate-800">복사 붙여넣기:</strong> 글이 완성되면 우측 하단의 [복사하기] 버튼을 누르고 네이버 스마트에디터에 붙여넣기만 하시면 모든 서식과 형광펜 효과가 그대로 적용됩니다.</span>
              </li>
            </ul>
            <div className="pt-2">
              <Link href="/dashboard/write">
                <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                  지금 바로 글 써보기 &rarr;
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
