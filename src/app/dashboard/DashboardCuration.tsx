'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { 
  Sparkles, TrendingUp, Loader2, RefreshCw, Calendar, MapPin, 
  Gem, Layers, Clock, ShieldCheck, ChevronDown, ChevronUp, Zap, ArrowRight, FileText
} from 'lucide-react'
import { getCurationClusters, RecommendedKeyword } from '@/actions/curation'
import { Button } from '@/components/ui/button'

type CategoryFilter = 'ALL' | 'HIGH_VALUE' | 'LOCAL' | 'SEASON'

interface CurationCache {
  clusters: RecommendedKeyword[]
  timestamp: number
  pillarKeyword: string
}

const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24시간
const MAX_DAILY_CURATION = 5 // 1일 최대 키워드 발굴 횟수 (비용 과다 방지)
const COOLDOWN_SECONDS = 60 // 연타 방지 쿨다운 (초)

export function DashboardCuration({ profile }: { profile: any }) {
  const router = useRouter()
  const [clusters, setClusters] = useState<RecommendedKeyword[] | null>(null)
  const [lastUpdated, setLastUpdated] = useState<number | null>(null)
  const [isCacheLoaded, setIsCacheLoaded] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('HIGH_VALUE')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quotaNotice, setQuotaNotice] = useState<string | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  
  // 연타 방지 쿨다운 & 일일 5회 쿼터 상태
  const [dailyUsedCount, setDailyUsedCount] = useState<number>(0)
  const [cooldownLeft, setCooldownLeft] = useState<number>(0)

  const userId = profile?.id || profile?.user_id || 'default'
  const cacheKey = `postsynk_curation_cache_${userId}`
  const todayKey = new Date().toISOString().split('T')[0] // 'YYYY-MM-DD'
  const dailyQuotaKey = `postsynk_curation_daily_${userId}_${todayKey}`
  const cooldownKey = `postsynk_curation_cooldown_${userId}`

  // 프로필 주소와 업종 기반 필러 키워드
  const address = profile?.address || ''
  const industry = profile?.industry || '전문직'
  const localRegion = address ? address.split(' ').slice(1, 3).join(' ') : ''
  const pillarKeyword = `${localRegion} ${industry}`.trim() || '전문직 블로그 마케팅'

  // 1. 대시보드 마운트 시 24시간 캐시 및 일일 쿼터/쿨다운 복원
  useEffect(() => {
    try {
      // 1) 24시간 캐시 로드
      const cachedRaw = localStorage.getItem(cacheKey)
      if (cachedRaw) {
        const cached: CurationCache = JSON.parse(cachedRaw)
        if (cached.clusters && Array.isArray(cached.clusters) && cached.clusters.length > 0) {
          setClusters(cached.clusters)
          setLastUpdated(cached.timestamp)
        }
      }

      // 2) 오늘 사용 횟수 로드
      const savedCount = localStorage.getItem(dailyQuotaKey)
      if (savedCount) {
        setDailyUsedCount(parseInt(savedCount, 10) || 0)
      }

      // 3) 쿨다운 잔여 시간 로드
      const savedCooldownTarget = localStorage.getItem(cooldownKey)
      if (savedCooldownTarget) {
        const targetMs = parseInt(savedCooldownTarget, 10) || 0
        const remainingSec = Math.max(0, Math.ceil((targetMs - Date.now()) / 1000))
        if (remainingSec > 0) {
          setCooldownLeft(remainingSec)
        }
      }
    } catch (e) {
      console.warn('[Curation Cache] 캐시 로드 실패:', e)
    } finally {
      setIsCacheLoaded(true)
    }
  }, [cacheKey, dailyQuotaKey, cooldownKey])

  // 쿨다운 1초마다 카운트다운 타이머
  useEffect(() => {
    if (cooldownLeft <= 0) return

    const timer = setInterval(() => {
      setCooldownLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [cooldownLeft])

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
    // 1. 일일 5회 한도 체크
    if (dailyUsedCount >= MAX_DAILY_CURATION) {
      setQuotaNotice(`오늘의 맞춤 키워드 발굴 한도(${MAX_DAILY_CURATION}회)를 모두 사용하셨습니다. 발굴된 키워드로 원고를 작성해 보세요!`)
      return
    }

    // 2. 60초 쿨다운 체크
    if (cooldownLeft > 0) {
      return
    }

    setIsLoading(true)
    setError(null)
    setQuotaNotice(null)
    
    try {
      const result = await getCurationClusters(pillarKeyword, 'gpt-5.6-luna', {
        address,
        industry,
      })
      
      if (result.error) {
        setError(result.error)
      } else {
        const top10 = result.clusters.slice(0, 10)
        setClusters(top10)
        saveCache(top10)

        // 일일 사용 횟수 증가 및 저장
        const nextCount = dailyUsedCount + 1
        setDailyUsedCount(nextCount)
        localStorage.setItem(dailyQuotaKey, nextCount.toString())

        // 60초 쿨다운 시작 및 타겟 시간 저장
        setCooldownLeft(COOLDOWN_SECONDS)
        localStorage.setItem(cooldownKey, (Date.now() + COOLDOWN_SECONDS * 1000).toString())
      }
    } catch (err: any) {
      setError(err.message || '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 1초 글쓰기 페이지 이동
  const handleWriteArticle = (keywordTitle: string) => {
    router.push(`/dashboard/write?keyword=${encodeURIComponent(keywordTitle)}`)
  }

  // 5대 채널 OSMU 스튜디오로 실시간 쟁점 전송
  const handleSendToOsmu = (cluster: RecommendedKeyword) => {
    const keywordTitle = cluster.title || (cluster as any).keyword || ''
    window.dispatchEvent(new CustomEvent('postsynk:select-topic', {
      detail: {
        title: keywordTitle,
        category: cluster.category,
        caseQuote: cluster.retainerEstimate || '대법원 실무 판례 연동'
      }
    }))

    const osmuEl = document.getElementById('osmu-station')
    if (osmuEl) {
      osmuEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 24시간 경과 여부 계산
  const isCacheExpired = lastUpdated ? Date.now() - lastUpdated > CACHE_TTL_MS : false
  const remainingQuota = Math.max(0, MAX_DAILY_CURATION - dailyUsedCount)

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

  const highValueCount = clusters?.filter((c) => c.category === 'HIGH_VALUE').length || 0
  const localCount = clusters?.filter((c) => c.category === 'LOCAL').length || 0
  const seasonCount = clusters?.filter((c) => c.category === 'SEASON').length || 0

  const getCategoryBadge = (category: string, tier?: string) => {
    switch (category) {
      case 'HIGH_VALUE':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <Gem className="w-3.5 h-3.5 text-amber-600" />
            {tier === 'S' ? '👑 S급 고액 사건' : '💎 A급 고수임 사건'}
          </span>
        )
      case 'LOCAL':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            지역 롱테일
          </span>
        )
      case 'SEASON':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
            <Calendar className="w-3.5 h-3.5 text-purple-600" />
            시즌·이슈
          </span>
        )
      default:
        return null
    }
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50/50 shadow-sm rounded-2xl">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2 text-base">
            ⚠️ 실시간 키워드 분석 실패
          </CardTitle>
          <CardDescription className="text-red-600 font-medium text-xs">
            실시간 검색 데이터를 분석하는 중 오류가 발생했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-3.5 rounded-xl border border-red-100 text-xs font-mono text-red-800 break-words mb-3">
            {error}
          </div>
          <Button onClick={handleGenerate} variant="outline" className="w-full text-xs font-bold h-9">
            다시 시도하기
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-[0_4px_25px_-4px_rgba(0,0,0,0.05)] relative overflow-hidden">
      {/* 프리미엄 액센트 라인 (앰버-스카이 그라데이션) */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-amber-500 via-[#0284C7] to-indigo-600"></div>
      
      {/* 카드 헤더 */}
      <div className="bg-gradient-to-r from-amber-50/40 via-sky-50/30 to-white p-5 pb-4 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-wider">
                High-Value Retainer Curation
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100/80 text-amber-800">
                Jev AI 심사 연동
              </span>
            </div>
            <CardTitle className="text-lg sm:text-xl flex items-center gap-2 text-slate-900 font-extrabold">
              <Gem className="w-5 h-5 text-amber-600" />
              오늘의 고단가 수임 키워드 자동 선별기
            </CardTitle>
            <CardDescription className="text-slate-600 text-xs mt-0.5">
              네이버 실시간 검색 시그널과 Jev 0.05초 감별 AI가 선별한 <strong>{profile?.address || '사업장 소재지'}</strong> 수임 직결 롱테일 키워드입니다.
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
            {clusters && (
              <>
                {/* 일일 5회 발굴 한도 배지 */}
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                  remainingQuota === 0
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  남은 발굴: {remainingQuota}/{MAX_DAILY_CURATION}회
                </span>

                {lastUpdated && (
                  <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full border ${
                    isCacheExpired 
                      ? 'bg-amber-50 text-amber-700 border-amber-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    <Clock className="w-3 h-3" />
                    {isCacheExpired ? '24시간 경과' : `${formatTimeAgo(lastUpdated)} 분석`}
                  </span>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isLoading || cooldownLeft > 0 || remainingQuota === 0}
                  variant="outline"
                  size="sm"
                  className="bg-white hover:bg-amber-50 text-amber-900 border-amber-200 shadow-2xs h-8 text-xs font-bold disabled:opacity-60 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                  {isLoading ? (
                    '분석 중...'
                  ) : cooldownLeft > 0 ? (
                    `재발굴 (${cooldownLeft}초)`
                  ) : remainingQuota === 0 ? (
                    '한도 소진'
                  ) : (
                    '새로고침'
                  )}
                </Button>
              </>
            )}

            {/* 접기/펼치기 토글 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900 rounded-lg cursor-pointer"
              title={isCollapsed ? '펼치기' : '접기'}
            >
              {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* 일일 한도 소진 알림 배너 */}
        {quotaNotice && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center justify-between">
            <span>💡 {quotaNotice}</span>
            <button 
              onClick={() => setQuotaNotice(null)} 
              className="text-amber-700 font-bold ml-2 hover:underline cursor-pointer"
            >
              닫기
            </button>
          </div>
        )}

        {/* 카테고리 탭 필터 (결과가 있을 때만 노출) */}
        {!isCollapsed && clusters && clusters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3">
            <button
              onClick={() => setSelectedCategory('HIGH_VALUE')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedCategory === 'HIGH_VALUE'
                  ? 'bg-amber-500 text-white shadow-2xs ring-2 ring-amber-300'
                  : 'bg-amber-50/80 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <Gem className="w-3.5 h-3.5" />
              💎 고단가 수임 ({highValueCount})
            </button>

            <button
              onClick={() => setSelectedCategory('LOCAL')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'LOCAL'
                  ? 'bg-emerald-600 text-white shadow-2xs ring-2 ring-emerald-300'
                  : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              지역 롱테일 ({localCount})
            </button>

            <button
              onClick={() => setSelectedCategory('SEASON')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'SEASON'
                  ? 'bg-purple-600 text-white shadow-2xs ring-2 ring-purple-300'
                  : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              시즌·이슈 ({seasonCount})
            </button>

            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              전체 ({clusters.length})
            </button>
          </div>
        )}
      </div>

      {/* 카드 본문 (접힌 상태가 아닐 때 노출) */}
      {!isCollapsed && (
        <div className="p-5">
          {!clusters ? (
            <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 flex items-center justify-center mb-3 text-amber-700 shadow-2xs">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-800 mb-1.5">
                수임료 500만~1,000만 원 상당의 고단가 사건을 선별하시겠습니까?
              </h3>
              <p className="text-xs text-slate-500 mb-5 max-w-md leading-relaxed">
                네이버 실시간 검색 시그널과 Jev 0.05초 심층 감별 AI를 가동하여, <strong>단순 잡상식 문의는 버리고 실제 유료 수임으로 직결되는 10대 알짜 키워드</strong>를 추출합니다.
              </p>
              <Button 
                onClick={handleGenerate} 
                disabled={isLoading || cooldownLeft > 0 || remainingQuota === 0}
                className="bg-[#FF6B00] hover:bg-[#E05D00] text-white font-extrabold text-xs rounded-xl px-6 h-10 shadow-sm cursor-pointer transition-transform active:scale-95 disabled:opacity-60"
              >
                {isLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Jev AI 고단가 수임 키워드 정밀 선별 중...</>
                ) : cooldownLeft > 0 ? (
                  `재발굴 대기 중 (${cooldownLeft}초)`
                ) : remainingQuota === 0 ? (
                  '오늘 발굴 한도 소진 (내일 초기화)'
                ) : (
                  <><Sparkles className="w-4 h-4 mr-1.5" /> 💎 오늘의 고단가 수임 키워드 1초 발굴</>
                )}
              </Button>
            </div>
          ) : filteredClusters.length === 0 ? (
            <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              선택하신 카테고리의 추천 키워드가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredClusters.map((cluster, idx) => {
                const keywordTitle = cluster.title || (cluster as any).keyword || ''
                const keywordDesc = cluster.description || (cluster as any).reason || ''
                const competition = cluster.competition || (cluster as any).competitionLevel || '낮음'
                const isHighValue = cluster.category === 'HIGH_VALUE'
                const retainerEstimate = cluster.retainerEstimate || (isHighValue ? '건당 500만~1,000만 원 상당' : '사건 수임 연계')
                const urgencyLevel = cluster.urgencyLevel || (isHighValue ? 'HIGH' : 'MEDIUM')

                return (
                  <div 
                    key={idx} 
                    className={`rounded-2xl p-5 transition-all flex flex-col justify-between border ${
                      isHighValue
                        ? 'bg-gradient-to-b from-amber-50/30 via-white to-white border-amber-300 shadow-2xs hover:shadow-md'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-md'
                    }`}
                  >
                    <div>
                      {/* 상단 뱃지 영역 */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {getCategoryBadge(cluster.category, cluster.retainerTier)}
                        <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          전환지수 {cluster.score}점
                        </span>
                      </div>

                      {/* 키워드 제목 */}
                      <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug mb-2.5">
                        {keywordTitle}
                      </h4>

                      {/* 💰 고단가 수임 지표 박스 */}
                      <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-amber-900 flex items-center gap-1 text-[11px]">
                            💰 {retainerEstimate}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            urgencyLevel === 'CRITICAL' 
                              ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                              : 'bg-sky-50 text-sky-800'
                          }`}>
                            {urgencyLevel === 'CRITICAL' ? '🚨 긴급 골든타임' : '⚖️ 고관여 소송'}
                          </span>
                        </div>
                        {cluster.urgencyReason && (
                          <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
                            {cluster.urgencyReason}
                          </p>
                        )}
                      </div>
                      
                      {/* 설명/마케팅 의도 */}
                      <p className="text-[11px] text-slate-600 mb-4 leading-relaxed line-clamp-2">
                        {keywordDesc}
                      </p>
                    </div>

                    {/* 하단 안심 인증 & 1-클릭 액션 버튼 2종 */}
                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> 변호사법 제23조 안심 통과
                        </span>
                        <span className="text-slate-400">경쟁도: {competition}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <Button
                          size="sm"
                          onClick={() => handleWriteArticle(keywordTitle)}
                          className="h-8 text-[11px] font-extrabold bg-[#FF6B00] hover:bg-[#E05D00] text-white rounded-xl shadow-2xs gap-1 cursor-pointer transition-transform active:scale-95"
                        >
                          <FileText className="w-3 h-3" />
                          <span>1초 칼럼 쓰기 ➔</span>
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendToOsmu(cluster)}
                          className="h-8 text-[11px] font-bold border-[#0284C7]/30 text-[#0284C7] hover:bg-sky-50 rounded-xl shadow-2xs gap-1 cursor-pointer transition-transform active:scale-95"
                        >
                          <Zap className="w-3 h-3" />
                          <span>5채널 동시 보기</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
