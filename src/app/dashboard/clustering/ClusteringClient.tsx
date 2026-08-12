'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Network, Search, PenTool, TrendingUp, Target, BarChart2, Sparkles } from 'lucide-react'

// Mock useToast fallback
const useToast = () => {
  return {
    toast: (props: { title: string, description: string, variant?: string }) => {
      console.log('Toast:', props);
    }
  }
}

interface Cluster {
  keyword: string;
  intent: string;
  reason: string;
  competitionLevel: string;
  score: number;
}

export default function ClusteringClient() {
  const [pillarKeyword, setPillarKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [clusters, setClusters] = useState<Cluster[]>([])
  const { toast } = useToast()
  const router = useRouter()

  const handleGenerate = async () => {
    if (!pillarKeyword.trim()) {
      toast({ title: '알림', description: '메인 주제(필러 키워드)를 입력해 주세요.' })
      return
    }

    setIsLoading(true)
    setClusters([])
    
    try {
      toast({
        title: '클러스터링 기획 중',
        description: 'AI가 세부 주제를 발굴하고 네이버 검색량을 매칭하고 있습니다. (약 10~20초 소요)',
      })

      const res = await fetch('/api/generate-clusters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pillarKeyword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '클러스터 생성 실패')
      }

      setClusters(data.clusters)
      toast({ title: '기획 완료', description: '연재 주제 기획이 완성되었습니다.' })
    } catch (error: any) {
      toast({ title: '에러 발생', description: error.message, variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  const navigateToWrite = (keyword: string) => {
    router.push(`/dashboard/write?keyword=${encodeURIComponent(keyword)}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Network className="w-6 h-6 text-indigo-500" />
            블로그 연재 기획기
          </h1>
          <p className="text-slate-500 mt-1">메인 주제(Pillar)를 입력하면 블로그 지수를 높일 세부 연재 주제(Cluster)들을 발굴합니다.</p>
        </div>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium text-slate-700">메인 주제 (필러 키워드)</label>
              <Input 
                placeholder="예: 상속세, 이혼 소송, 근로기준법, 강남 피부과" 
                value={pillarKeyword}
                onChange={(e) => setPillarKeyword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                disabled={isLoading}
                className="h-11"
              />
            </div>
            


            <Button 
              onClick={handleGenerate} 
              disabled={isLoading || !pillarKeyword}
              className="h-11 px-8 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> 기획 중...</>
              ) : (
                <><Search className="w-4 h-4 mr-2" /> 연재 주제 발굴</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {isLoading && (
        <div className="py-20 flex flex-col items-center justify-center text-slate-500 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-lg font-medium">블로그 전문성을 높일 황금 키워드 트리를 구성하는 중입니다...</p>
        </div>
      )}

      {!isLoading && clusters.length > 0 && (
        <div className="space-y-6">
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5 flex items-start gap-3">
            <Target className="w-6 h-6 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-indigo-900 text-lg">💡 기획 완료! 총 {clusters.length}개의 클러스터가 발굴되었습니다.</h3>
              <p className="text-indigo-700 mt-1">아래 카드들을 하나씩 [SEO 블로그 쓰기] 탭으로 넘겨서 포스팅을 발행하세요. 이 글들이 서로 내부 링크로 연결되면 블로그의 <strong>Topical Authority(주제별 권위)</strong> 점수가 급상승합니다.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {clusters.map((cluster, idx) => {
              return (
                <Card key={idx} className="flex flex-col h-full hover:shadow-md transition-shadow border-slate-200">
                  <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-bold text-slate-800 break-keep leading-tight">
                        {cluster.keyword}
                      </CardTitle>
                      <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                        클러스터 {idx + 1}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-4 space-y-4 flex-1">
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <Target className="w-3 h-3" /> 검색 의도 (Intent)
                        </div>
                        <p className="text-sm text-slate-700 bg-slate-50 p-2 rounded-md border border-slate-100 leading-relaxed">
                          {cluster.intent}
                        </p>
                      </div>
                      
                      <div>
                        <div className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" /> 추천 이유
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed">
                          {cluster.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="bg-white border border-slate-200 rounded-md p-3 flex-1 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1.5 rounded-md">
                            <Sparkles className="w-4 h-4 text-blue-700" />
                          </div>
                          <span className="text-xs font-medium text-slate-600">추천 점수</span>
                        </div>
                        <span className="font-bold text-slate-800">
                          {cluster.score} <span className="text-xs font-normal text-slate-500">점</span>
                        </span>
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-md p-3 flex-1 flex justify-between items-center shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="bg-green-100 p-1.5 rounded-md">
                            <BarChart2 className="w-4 h-4 text-green-700" />
                          </div>
                          <span className="text-xs font-medium text-slate-600">경쟁 강도</span>
                        </div>
                        <span className="font-bold text-slate-800">
                          {cluster.competitionLevel}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 pb-4 px-4">
                    <Button 
                      onClick={() => navigateToWrite(cluster.keyword)}
                      className="w-full bg-slate-800 hover:bg-slate-900 text-white"
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      이 주제로 자동 글쓰기
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
