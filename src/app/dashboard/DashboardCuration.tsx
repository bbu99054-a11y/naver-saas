'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, TrendingUp, Loader2 } from 'lucide-react'
import { getCurationClusters } from '@/actions/curation'
import { CurationLinkBtn } from './CurationLinkBtn'
import { Button } from '@/components/ui/button'

export function DashboardCuration({ profile }: { profile: any }) {
  const [clusters, setClusters] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 프로필의 주소(구/동)와 업종을 결합하여 필러 키워드 생성
  const localRegion = profile.address.split(' ').slice(1, 3).join(' ') // "강남구 역삼동"
  const pillarKeyword = `${localRegion} ${profile.industry}`

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getCurationClusters(pillarKeyword)
      
      if (result.error) {
        setError(result.error)
      } else {
        // 상위 3개 노출
        setClusters(result.clusters.slice(0, 3))
      }
    } catch (err: any) {
      setError(err.message || "알 수 없는 에러가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
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
          <div className="bg-white p-4 rounded-md border border-red-100 text-sm font-mono text-red-800 break-words mb-4">
            {error}
          </div>
          <Button onClick={handleGenerate} variant="outline" className="w-full">
            다시 시도하기
          </Button>
        </CardContent>
      </Card>
    );
  }

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
        {!clusters ? (
          <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <h3 className="text-lg font-bold text-slate-700 mb-2">어떤 키워드로 글을 쓸지 고민되시나요?</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md">
              AI가 사장님의 업종과 지역 데이터를 분석하여, 지금 당장 쓰기 좋고 네이버 검색량이 있는 블루오션 키워드 3개를 발굴해 드립니다.
            </p>
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-8 shadow-md"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> 상권 데이터 분석 중...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> ✨ 오늘의 맞춤형 로컬 키워드 발굴하기</>
              )}
            </Button>
          </div>
        ) : clusters.length === 0 ? (
          <div className="text-center py-8 text-slate-500">추천할 만한 키워드를 찾지 못했습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {clusters.map((cluster: any, idx: number) => {
              const vol = cluster.monthlyPcQcCnt + cluster.monthlyMobileQcCnt
              return (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full animate-in fade-in zoom-in duration-300" style={{ animationDelay: `${idx * 100}ms` }}>
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

                  <CurationLinkBtn keyword={cluster.keyword} />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
