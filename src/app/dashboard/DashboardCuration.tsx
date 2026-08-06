import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, TrendingUp } from 'lucide-react'
import { getCurationClusters } from '@/actions/curation'
import { CurationLinkBtn } from './CurationLinkBtn'

export async function DashboardCuration({ profile }: { profile: any }) {
  // 프로필의 주소(구/동)와 업종을 결합하여 필러 키워드 생성
  const localRegion = profile.address.split(' ').slice(1, 3).join(' ') // "강남구 역삼동"
  const pillarKeyword = `${localRegion} ${profile.industry}`

  // 서버 측에서 바로 데이터 패칭 (Server Component)
  const result = await getCurationClusters(pillarKeyword)
  
  if (result.error) {
    return (
      <Card className="border-red-200 bg-red-50/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            ⚠️ 키워드 분석 실패
          </CardTitle>
          <CardDescription className="text-red-600 font-medium">
            다음 오류로 인해 AI가 키워드를 생성하지 못했습니다. (Vercel 환경 변수를 확인해 주세요)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-4 rounded-md border border-red-100 text-sm font-mono text-red-800 break-words">
            {result.error}
          </div>
        </CardContent>
      </Card>
    );
  }

  let clusters = result.clusters;
  if (!clusters || clusters.length === 0) {
    return null; // 데이터가 없을 경우 숨김
  }

  // 상위 3개 노출
  clusters = clusters.slice(0, 3)

  return (
    <Card className="border-indigo-100 shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
      <CardHeader className="bg-indigo-50/30 pb-4">
        <CardTitle className="text-xl flex items-center gap-2 text-indigo-900">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          오늘의 추천 로컬 키워드 Top 3
        </CardTitle>
        <CardDescription className="text-indigo-700">
          사장님의 매장({profile.address}) 주변에서 검색량이 발생하는 유효 키워드입니다. 바로 글을 작성해 보세요!
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {clusters.map((cluster: any, idx: number) => {
            const vol = cluster.monthlyPcQcCnt + cluster.monthlyMobileQcCnt
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
                <div className="mb-4">
                  <h4 className="font-bold text-lg text-slate-800 leading-tight mb-2">
                    {cluster.keyword}
                  </h4>
                  <div className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs px-2 py-1 rounded-md font-medium border border-green-100">
                    <TrendingUp className="w-3 h-3" />
                    월 검색량: {vol > 0 ? vol.toLocaleString() : '10미만'}
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 mb-6 flex-1">
                  {cluster.reason}
                </p>

                {/* 클라이언트 컴포넌트로 분리한 네비게이션 버튼 */}
                <CurationLinkBtn keyword={cluster.keyword} />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
