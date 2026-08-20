'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Sparkles, TrendingUp, Loader2, RefreshCw, Calendar, MapPin, Gem, Layers, Clock, CheckCircle2 } from 'lucide-react'
import { getCurationClusters, RecommendedKeyword } from '@/actions/curation'
import { CurationLinkBtn } from './CurationLinkBtn'
import { Button } from '@/components/ui/button'

type CategoryFilter = 'ALL' | 'SEASON' | 'LOCAL' | 'HIGH_VALUE'

interface CurationCache {
  clusters: RecommendedKeyword[]
  timestamp: number
  pillarKeyword: string
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24시간

export function DashboardCuration({ profile }: { profile: any }) {
  const [clusters, setClusters] = useState<RecommendedKeyword[] | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [isCacheLoaded, setIsCacheLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cacheKey = `postsynk_curation_cache_${profile?.id || profile?.user_id || 'default'}`

  // 프로필 주소와 업종 기반 필러 키워드
  const address = profile?.address || ''
  const industry = profile?.industry || '전문직'
  const localRegion = address ? address.split(' ').slice(1, 3).join(' ') : ''
  const pillarKeyword = `${localRegion} ${industry}`.trim() || '전문직 블로그 마케팅'

  // 1. 대시보드 마운트 시 24시간 유효 캐시 즉시 복원 (0.01초 렌더링)
  useEffect(() => {
    try {
      const cachedRaw = localStorage.getItem(cacheKey)
      if (cachedRaw) {
        const cached: CurationCache = JSON.parse(cachedRaw)
        if (cached.clusters && Array.isArray(cached.clusters) && cached.clusters.length > 0) {
          setClusters(cached.clusters)
          setLastUpdated(cached.timestamp)
        }
      }
    } catch (e) {
      console.warn('[Curation Cache] 캐시 로드 실패:', e)
    } finally {
      setIsCacheLoaded(true)
    }
  }, [cacheKey])

  const saveCache = (newClusters: RecommendedKeyword[]) => {
    try {
      const cacheData: CurationCache = {
        clusters: newClusters,
        timestamp: Date.now(),
        pillarKeyword
      }
      localStorage.setItem(cacheKey, JSON.stringify(cacheData))
      setLastUpdated(cacheData.timestamp)
    } catch (e) {
      console.warn('[Curation Cache] 캐시 저장 실패:', e)
    }
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const result = await getCurationClusters(pillarKeyword, 'gemini-3.7-flash', {
        address,
        industry,
      })
      
      if (result.error) {
        setError(result.error)
      } else {
        const top10 = result.clusters.slice(0, 10)
        setClusters(top10)
        saveCache(top10)
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 24시간 경과 여부 계산
  const isCacheExpired = lastUpdated ? Date.now() - lastUpdated > CACHE_TTL_MS : false

  const formatTimeAgo = (ts: number | null) => {
    if (!ts) return ''
    const diffMs = Date.now() - ts
    const diffMin = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMin / 60)
    
    if (diffMin < 1) return '방금 전'
    if (diffMin < 60) return `${diffMin}분 전`
    if (diffHours < 24) return `${diffHours}시간 전`
    
    const date = new Date(ts)
    return `${date.getMonth() + 1}월 ${date.getDate()}일`
  }

  // 카테고리 필터링
  const filteredClusters = clusters
    ? clusters.filter((item) => {
        if (selectedCategory === 'ALL') return true
        return item.category === selectedCategory
      })
    : []

  const seasonCount = clusters?.filter((c) => c.category === 'SEASON').length || 0
  const localCount = clusters?.filter((c) => c.category === 'LOCAL').length || 0
  const highValueCount = clusters?.filter((c) => c.category === 'HIGH_VALUE').length || 0

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'SEASON':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            시즌·이슈
          </span>
        )
      case 'LOCAL':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            지역 롱테일
          </span>
        )
      case 'HIGH_VALUE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
            <Gem className="w-3.5 h-3.5 text-amber-600" />
            고단가 수임
          </span>
        )
      default:
        return null
    }
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            ⚠️ 실시간 키워드 분석 실패
          </CardTitle>
          <CardDescription className="text-red-600 font-medium">
            실시간 검색 데이터를 분석하는 중 오류가 발생했습니다.
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
    )
  }

  return (
    <Card className="border-indigo-100 shadow-md relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600"></div>
      
      {/* 카드 헤더 */}
      <CardHeader className="bg-indigo-50/40 pb-4 border-b border-indigo-100/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-xl flex items-center gap-2 text-indigo-950 font-bold">
              <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
              오늘의 추천 로컬 키워드 Top 10
            </CardTitle>
            <CardDescription className="text-indigo-800/80 mt-1">
              네이버 실시간 검색 시그널 & 상권 이슈를 반영한 <strong>{profile?.address || '사업장 소재지'}</strong> 맞춤 롱테일 키워드입니다.
            </CardDescription>
          </div>
          
          {clusters && (
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              {lastUpdated && (
                <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
                  isCacheExpired 
                    ? 'bg-amber-50 text-amber-700 border-amber-200' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <Clock className="w-3 h-3" />
                  {isCacheExpired ? '24시간 경과됨' : `${formatTimeAgo(lastUpdated)} 분석 (24h 캐시)`}
                </span>
              )}
              <Button
                onClick={handleGenerate}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="bg-white hover:bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? '분석 중...' : '트렌드 새로고침'}
              </Button>
            </div>
          )}
        </div>

        {/* 카테고리 탭 필터 (결과가 있을 때만 노출) */}
        {clusters && clusters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              전체 ({clusters.length})
            </button>

            <button
              onClick={() => setSelectedCategory('SEASON')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'SEASON'
                  ? 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300'
                  : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              시즌·이슈 ({seasonCount})
            </button>

            <button
              onClick={() => setSelectedCategory('LOCAL')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'LOCAL'
                  ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              지역 롱테일 ({localCount})
            </button>

            <button
              onClick={() => setSelectedCategory('HIGH_VALUE')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'HIGH_VALUE'
                  ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                  : 'bg-white text-amber-800 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              고단가 수임 ({highValueCount})
            </button>
          </div>
        )}
      </CardHeader>

      {/* 카드 본문 */}
      <CardContent className="pt-6">
        {!clusters ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3 text-indigo-600">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">어떤 키워드로 글을 쓸지 고민되시나요?</h3>
            <p className="text-sm text-slate-500 mb-6 max-w-md leading-relaxed">
              네이버 실시간 자동완성 검색어와 최신 지역 트렌드를 결합하여, <strong>시즌 이슈 · 로컬 롱테일 · 고단가 수임</strong> 목적별 최적 키워드 10개를 발굴해 드립니다.
            </p>
            <Button 
              onClick={handleGenerate} 
              disabled={isLoading}
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full px-8 shadow-md cursor-pointer transition-transform active:scale-95"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> 실시간 검색어 및 상권 트렌드 분석 중...</>
              ) : (
                <><Sparkles className="w-5 h-5 mr-2" /> ✨ 오늘의 맞춤형 로컬 키워드 발굴하기</>
              )}
            </Button>
          </div>
        ) : filteredClusters.length === 0 ? (
          <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-slate-200">
            선택하신 카테고리의 추천 키워드가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredClusters.map((cluster, idx) => {
              const keywordTitle = cluster.title || (cluster as any).keyword || ''
              const keywordDesc = cluster.description || (cluster as any).reason || ''
              const competition = cluster.competition || (cluster as any).competitionLevel || '낮음'
              const compColor = competition === '낮음' 
                ? 'text-teal-700 bg-teal-50 border-teal-200' 
                : 'text-orange-700 bg-orange-50 border-orange-200'

              return (
                <div 
                  key={idx} 
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col h-full animate-in fade-in zoom-in-95 duration-200"
                >
                  {/* 상단 뱃지 영역 */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {getCategoryBadge(cluster.category)}
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      추천 {cluster.score}점
                    </span>
                  </div>

                  {/* 키워드 제목 */}
                  <h4 className="font-bold text-base text-slate-900 leading-snug mb-2 flex-none">
                    {keywordTitle}
                  </h4>

                  {/* 경쟁 강도 */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md font-medium border ${compColor}`}>
                      <TrendingUp className="w-3 h-3" />
                      경쟁도: {competition}
                    </span>
                  </div>
                  
                  {/* 설명/마케팅 의도 */}
                  <p className="text-xs text-slate-600 mb-5 flex-1 leading-relaxed bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                    {keywordDesc}
                  </p>

                  {/* 원클릭 글쓰기 시작 버튼 */}
                  <div className="mt-auto pt-2">
                    <CurationLinkBtn keyword={keywordTitle} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
