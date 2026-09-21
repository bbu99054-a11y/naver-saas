'use client'

import { useState, useEffect } from 'react'
import { 
  MapPin, 
  Search, 
  Trophy, 
  TrendingUp, 
  Users, 
  Star, 
  Copy, 
  Check, 
  Sparkles, 
  MessageSquare, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink,
  Building2,
  Phone,
  Calendar,
  AlertTriangle,
  FileText,
  Swords,
  ArrowUpRight,
  Flame,
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getProfile } from '@/actions/profile'

interface PlaceRankItem {
  rank: number
  id: string
  name: string
  category: string
  address: string
  phone: string
  hasBooking: boolean
  placeUrl: string
}

export default function PlaceManagementPage() {
  const [activeTab, setActiveTab] = useState<'rank' | 'intro' | 'review'>('rank')

  // 로펌 프로필 정보
  const [storeName, setStoreName] = useState('법무법인 세륜')
  const [locationName, setLocationName] = useState('문정동')
  const [specialtyName, setSpecialtyName] = useState('형사·이혼 전문')

  // 1. 순위 & 20위 경쟁사 분석 상태
  const [keyword, setKeyword] = useState('문정동 변호사')
  const [targetStore, setTargetStore] = useState('법무법인 세륜')
  const [isLoadingRank, setIsLoadingRank] = useState(false)
  const [rankResult, setRankResult] = useState<{
    query: string
    totalCount: number
    myPlace: (PlaceRankItem & { isTop5: boolean; isTop10: boolean; percentile: number }) | null
    rankingList: PlaceRankItem[]
  } | null>(null)
  const [rankError, setRankError] = useState('')

  // 5대 주력 쟁점 빠른 전환 칩
  const targetChips = [
    { label: '🏛️ 문정동 전체', query: '문정동 변호사' },
    { label: '🚨 음주운전', query: '문정동 음주운전 변호사' },
    { label: '⚖️ 이혼·재산분할', query: '문정동 이혼 변호사' },
    { label: '🏠 전세금·명도', query: '문정동 부동산 변호사' },
    { label: '🏢 기업 횡령·배임', query: '문정동 형사 변호사' },
    { label: '🛡️ 보이스피싱', query: '문정동 사기 변호사' },
  ]

  // 2. 소개글 생성기 상태
  const [introTone, setIntroTone] = useState<'trust' | 'authority' | 'empathy'>('trust')
  const [generatedIntro, setGeneratedIntro] = useState('')
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false)
  const [copiedIntro, setCopiedIntro] = useState(false)

  // 3. 리뷰 답글 생성기 상태
  const [reviewType, setReviewType] = useState<'won' | 'consult' | 'simple'>('won')
  const [customerReview, setCustomerReview] = useState(
    '음주운전 2진 적발로 너무 두렵고 막막했는데, 세륜 변호사님께서 초기 경찰 조사부터 직접 동행해 주시고 꼼꼼한 양형자료로 집행유예 선처를 받아주셨습니다. 진심으로 감사드립니다.'
  )
  const [generatedReply, setGeneratedReply] = useState('')
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [copiedReply, setCopiedReply] = useState(false)

  // 초기 프로필 로드 및 자동 순위 조회
  useEffect(() => {
    async function initProfileAndRank() {
      try {
        const profile = await getProfile()
        let initialStore = '법무법인 세륜'
        let initialKeyword = '문정동 변호사'
        let initialLocation = '문정동'

        if (profile) {
          if (profile.store_name) {
            initialStore = profile.store_name
            setStoreName(profile.store_name)
            setTargetStore(profile.store_name)
          }
          if (profile.industry) {
            initialKeyword = profile.industry
            setKeyword(profile.industry)
            setSpecialtyName(profile.industry)
          }
          if (profile.address) {
            const loc = profile.address.split(' ')[0] || '법조타운'
            setLocationName(loc)
          }
        }

        // 초기 자동 순위 조회 가동
        fetchRanking(initialKeyword, initialStore)
        // 기본 소개글 생성
        generateIntroText('trust', initialStore, initialLocation, initialKeyword)
        // 기본 리뷰 답글 생성
        generateReplyText('won', initialStore)
      } catch (e) {
        console.warn('Init place page error:', e)
        fetchRanking('문정동 변호사', '법무법인 세륜')
      }
    }
    initProfileAndRank()
  }, [])

  // 순위 조회 API 호출 함수
  const fetchRanking = async (searchQuery: string, storeTarget: string) => {
    if (!searchQuery.trim()) return
    setIsLoadingRank(true)
    setRankError('')

    try {
      const q = encodeURIComponent(searchQuery.trim())
      const t = encodeURIComponent(storeTarget.trim())
      const res = await fetch(`/api/place/rank?query=${q}&target=${t}`)
      const data = await res.json()

      if (data.success) {
        setRankResult({
          query: data.query,
          totalCount: data.totalCount,
          myPlace: data.myPlace,
          rankingList: data.rankingList || []
        })
      } else {
        setRankError(data.error || '순위 정보를 가져오지 못했습니다.')
      }
    } catch {
      setRankError('네이버 검색 서버와 통신 중 오류가 발생했습니다.')
    } finally {
      setIsLoadingRank(false)
    }
  }

  const handleCheckRank = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRanking(keyword, targetStore)
  }

  const handleChipClick = (chipQuery: string) => {
    setKeyword(chipQuery)
    fetchRanking(chipQuery, targetStore)
  }

  // 소개글 텍스트 생성기
  const generateIntroText = (
    tone: 'trust' | 'authority' | 'empathy',
    sName = storeName,
    lName = locationName,
    spec = specialtyName
  ) => {
    setIsGeneratingIntro(true)
    setTimeout(() => {
      let text = ''
      if (tone === 'trust') {
        text = `[${sName} - ${spec} 1:1 전담 조력]\n\n` +
          `안녕하십니까, ${lName} 법조타운에 위치한 ${sName}입니다.\n\n` +
          `${sName}은 의뢰인의 인생이 걸린 가장 절박한 순간, 객관적 증거와 철저한 판례 분석을 바탕으로 최적의 방어 전략을 실행합니다.\n\n` +
          `■ 핵심 조력 분야\n` +
          `· 초기 경찰·검찰 조사 직접 동행 및 불리한 진술 방어\n` +
          `· 사건별 쟁점 분석 및 맞춤형 양형자료 구축\n` +
          `· 대표 변호사 1:1 직접 상담 및 철저한 비밀 보장 (변호사법 제26조)\n\n` +
          `■ 상담 안내\n` +
          `첫 상담부터 사건 종결까지 대표 변호사가 직접 사건을 관제하며, 사전 예약 시 야간 및 주말 긴급 상담이 가능합니다.\n\n` +
          `※ 본 사무소는 변호사법 및 전문직 광고 규정을 100% 준수합니다.`
      } else if (tone === 'authority') {
        text = `[${sName} - 실력으로 입증하는 ${spec}]\n\n` +
          `${lName} 소재 ${sName}입니다.\n\n` +
          `수많은 무죄·기소유예 판결과 승소 노하우를 바탕으로, 복잡하고 까다로운 법적 쟁점을 명쾌하게 해결합니다. 의뢰인의 사건 하나하나에 집중하기 위해 무분별한 사건 수임을 지양하며, 철저한 법리 검토를 거쳐 실현 가능한 최선의 결과만을 약속드립니다.\n\n` +
          `■ 사무소 운영 원칙\n` +
          `1. 대표 변호사 직접 서면 작성 및 기일 직접 출석\n` +
          `2. 사건 진행 단계별 실시간 공유 시스템\n` +
          `3. 투명하고 합리적인 수임 기준 사전 고지\n\n` +
          `사건 1분 안심 진단 또는 네이버 플레이스 예약을 통해 신속히 상담 일정을 확정하실 수 있습니다.`
      } else {
        text = `[의뢰인의 불안을 덜어드리는 따뜻한 법률 동반자, ${sName}]\n\n` +
          `예상치 못한 사건으로 밤잠을 설치고 계신가요?\n\n` +
          `${lName}에 위치한 ${sName}은 혼자 감당하기 힘든 불안과 막막함을 덜어드리는 든든한 법률 조력자입니다.\n\n` +
          `사무장 대리 상담 없이 대표 변호사가 의뢰인의 사연을 처음부터 끝까지 직접 경청하며, 가족의 일처럼 진심을 다해 안전한 해결책을 찾아드립니다.\n\n` +
          `■ 상담 예약: 평일 09:00 ~ 19:00 (사전 예약 시 야간/주말 가능)\n` +
          `■ 위치: ${lName} 법조타운 중심\n\n` +
          `혼자 힘들어하지 마시고, 편안한 마음으로 문의해 주세요.`
      }
      setGeneratedIntro(text)
      setIsGeneratingIntro(false)
    }, 300)
  }

  // 리뷰 답글 생성기
  const generateReplyText = (type: 'won' | 'consult' | 'simple', sName = storeName) => {
    setIsGeneratingReply(true)
    setTimeout(() => {
      let reply = ''
      if (type === 'won') {
        reply = `소중한 후기를 남겨주셔서 진심으로 감사드립니다.\n\n처음 사무소를 찾아오셨을 때 많이 불안해하셨던 모습이 기억에 남습니다. 사건 진행 과정에서 변호인의 조언을 신뢰하고 일관되게 따라주신 덕분에 좋은 결과를 이끌어낼 수 있었습니다.\n\n다시금 평온한 일상을 되찾으신 것을 축하드리며, 앞으로 늘 건승하시기를 기원합니다. 법률적 도움이 필요하실 땐 언제든 ${sName}을 편히 찾아주십시오.`
      } else if (type === 'consult') {
        reply = `정성스러운 상담 후기 감사드립니다.\n\n답답하셨던 상황에서 법리적 해결 방안과 대응 순서를 명확히 짚어드릴 수 있어 다행이었습니다. 법적 분쟁은 초기 대응의 골든타임이 가장 중요한 만큼, 언제든 궁금하신 점이 있으시면 편하게 연락 주시기 바랍니다.\n\n늘 의뢰인의 곁에서 든든한 힘이 되어 드리겠습니다.`
      } else {
        reply = `따뜻한 격려 말씀 남겨주셔서 큰 보람과 힘이 됩니다.\n\n저희 ${sName}을 믿고 찾아와 주셔서 감사드리며, 의뢰인님의 앞날에 늘 기분 좋은 일만 가득하시길 진심으로 응원합니다. 환절기 건강 유의하십시오!`
      }
      setGeneratedReply(reply)
      setIsGeneratingReply(false)
    }, 250)
  }

  const copyToClipboard = (text: string, type: 'intro' | 'reply') => {
    navigator.clipboard.writeText(text)
    if (type === 'intro') {
      setCopiedIntro(true)
      setTimeout(() => setCopiedIntro(false), 2000)
    } else {
      setCopiedReply(true)
      setTimeout(() => setCopiedReply(false), 2000)
    }
  }

  // 1위 로펌과 내 로펌 비교 정보 계산
  const top1Item = rankResult?.rankingList && rankResult.rankingList.length > 0 ? rankResult.rankingList[0] : null
  const myPlaceItem = rankResult?.myPlace || null
  const rankDiff = myPlaceItem && top1Item ? myPlaceItem.rank - top1Item.rank : 0

  return (
    <div className="space-y-6 pb-12">
      {/* 🌟 상단 타이틀 & 3대 핵심 탭 네비게이션 */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-pulse" />
            <span className="text-xs font-black text-[#0284C7] tracking-wider uppercase">
              Naver Place Growth OS
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7]">
              실시간 20위 관제
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            네이버 스마트플레이스 통합 관리 센터
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            20위 전체 판세 분석, 1위 탈환 전략, 검색 색인 소개글 생성, 안심 리뷰 답글을 원스톱으로 처리합니다.
          </p>
        </div>

        {/* 3대 핵심 탭 전환 버튼 */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F8FC] rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('rank')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'rank'
                ? 'bg-white text-[#0284C7] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📍 20위 판세 & 1위 탈환
          </button>
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'intro'
                ? 'bg-white text-[#0284C7] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✍️ 2,000자 소개글 최적화
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-white text-[#0284C7] shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💬 AI 안심 리뷰 답글
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 탭 1: 실시간 20위 판세 분석 & 1위 탈환 전략 관제 */}
      {/* ========================================================================= */}
      {activeTab === 'rank' && (
        <div className="space-y-5">
          {/* 🔍 검색 바 & 5대 쟁점 빠른 전환 칩 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <form onSubmit={handleCheckRank} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                  실시간 조회 키워드
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#0284C7] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="예: 문정동 변호사, 문정동 음주운전 변호사"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">
                  내 로펌 상호명 (순위 하이라이트)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="예: 법무법인 세륜"
                    value={targetStore}
                    onChange={(e) => setTargetStore(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="self-end w-full sm:w-auto">
                <Button
                  type="submit"
                  disabled={isLoadingRank}
                  className="w-full sm:w-auto h-10 px-5 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl cursor-pointer"
                >
                  {isLoadingRank ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  ) : (
                    <Search className="w-3.5 h-3.5 mr-1.5" />
                  )}
                  {isLoadingRank ? '조회 중...' : '순위 새로고침'}
                </Button>
              </div>
            </form>

            {/* 5대 주력 쟁점 원클릭 전환 칩 */}
            <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-400 mr-1">
                빠른 쟁점 전환:
              </span>
              {targetChips.map((chip) => {
                const isActive = keyword === chip.query
                return (
                  <button
                    key={chip.query}
                    onClick={() => handleChipClick(chip.query)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#0284C7] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {chip.label}
                  </button>
                )
              })}
            </div>
          </div>

          {rankError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              <span>{rankError}</span>
            </div>
          )}

          {/* ⚔️ 1위 탈환 전략 관제 카드 (PostSync 브랜드 블루 그라데이션) */}
          {top1Item && (
            <div className="bg-gradient-to-br from-[#0369A1] via-[#0284C7] to-[#0284C7] p-5 sm:p-6 rounded-2xl text-white shadow-[0_4px_25px_-4px_rgba(2,132,199,0.35)] border border-sky-400/30 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-white/20 backdrop-blur-xs text-white border border-white/25">
                    <Swords className="w-4 h-4" />
                  </span>
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-2">
                      <span>[{rankResult?.query}] 1위 탈환 전략 관제탑</span>
                      {myPlaceItem ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white border border-white/30">
                          현재 내 순위: 실시간 {myPlaceItem.rank}위
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-300/30">
                          현재 20위 밖 진입 필요
                        </span>
                      )}
                    </h2>
                    <p className="text-[11px] text-sky-100 mt-0.5">
                      1위 로펌의 설정 허점을 공략하여 상위 순위를 선점하는 3대 핵심 액션 플랜
                    </p>
                  </div>
                </div>

                {/* 1위 맞불 칼럼 작성 버튼 (Lawmatics 시그니처 웜 오렌지) */}
                <Link href={`/dashboard/write?keyword=${encodeURIComponent(keyword)}`}>
                  <Button
                    size="sm"
                    className="h-9 px-4 text-xs font-black bg-[#FF6B00] hover:bg-[#E05D00] text-white rounded-xl shadow-md cursor-pointer flex items-center gap-1.5 transition-transform active:scale-95 border border-white/20"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>1위 제치기 맞불 칼럼 작성하기 ➔</span>
                  </Button>
                </Link>
              </div>

              {/* 3대 비교 분석 지표 (글래스모피즘) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* 1. 순위 격차 */}
                <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 space-y-1">
                  <span className="text-[10px] text-sky-100 font-bold block">1위 경쟁사</span>
                  <div className="text-sm font-black text-white truncate">
                    🥇 1위: {top1Item.name}
                  </div>
                  <p className="text-[11px] text-sky-100">
                    {myPlaceItem ? (
                      <span className="text-amber-300 font-black">
                        내 로펌({myPlaceItem.rank}위)과 단 {rankDiff}계단 격차 (가시권)
                      </span>
                    ) : (
                      <span className="text-sky-200 font-bold">20위권 진입을 위한 칼럼 필요</span>
                    )}
                  </p>
                </div>

                {/* 2. 네이버 예약 연동 여부 */}
                <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 space-y-1">
                  <span className="text-[10px] text-sky-100 font-bold block">네이버 예약 연동 상태</span>
                  <div className="text-sm font-black text-white flex items-center gap-1.5">
                    {top1Item.hasBooking ? (
                      <span className="text-emerald-300 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> 1위: 예약 켜짐
                      </span>
                    ) : (
                      <span className="text-amber-300 flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-3.5 h-3.5" /> 1위: 예약 꺼짐 (허점!)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-sky-100">
                    {myPlaceItem?.hasBooking 
                      ? '내 로펌: 예약 가동 중 (순위 가점 획득)' 
                      : '내 플레이스에 네이버 예약 장착 시 1위 추격 가속'}
                  </p>
                </div>

                {/* 3. 승부처 키워드 */}
                <div className="bg-white/15 backdrop-blur-xs p-3.5 rounded-xl border border-white/20 space-y-1">
                  <span className="text-[10px] text-sky-100 font-bold block">결정적 승부처</span>
                  <div className="text-sm font-black text-amber-300 truncate">
                    '{keyword}' 연관 포스팅
                  </div>
                  <p className="text-[11px] text-sky-100">
                    네이버 스마트블록 C-Rank 4단 칼럼 3편 발행 시 상위 점유율 역전
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 📊 1~20위 전체 순위 테이블 */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#0284C7]" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900">
                  '{rankResult?.query || keyword}' 네이버 모바일 플레이스 1~20위 전체 순위판
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                실시간 검색 기준
              </span>
            </div>

            {isLoadingRank ? (
              <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-[#0284C7]" />
                <p>네이버 플레이스 실시간 20위 순위를 스캔하고 있습니다...</p>
              </div>
            ) : !rankResult || rankResult.rankingList.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400">
                조회된 순위 정보가 없습니다. 상단의 [순위 새로고침] 버튼을 눌러주세요.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-black text-[11px]">
                      <th className="py-3 px-4 w-16 text-center">순위</th>
                      <th className="py-3 px-4">로펌 / 사무소 상호명</th>
                      <th className="py-3 px-4 w-28 text-center">노출 구역</th>
                      <th className="py-3 px-4 w-28 text-center">네이버 예약</th>
                      <th className="py-3 px-4 w-24 text-center">플레이스</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rankResult.rankingList.map((item) => {
                      const isMyPlace = targetStore && (
                        item.name.toLowerCase().includes(targetStore.toLowerCase()) ||
                        targetStore.toLowerCase().includes(item.name.toLowerCase())
                      )

                      // 구역 구분
                      let zoneBadge = (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0284C7]">
                          상위 골든존
                        </span>
                      )
                      if (item.rank > 5 && item.rank <= 10) {
                        zoneBadge = (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
                            추격권 (2페이지)
                          </span>
                        )
                      } else if (item.rank > 10) {
                        zoneBadge = (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                            위험권
                          </span>
                        )
                      }

                      return (
                        <tr
                          key={item.id || item.rank}
                          className={`transition-colors ${
                            isMyPlace 
                              ? 'bg-blue-50/70 font-bold border-l-4 border-l-[#0284C7]' 
                              : 'hover:bg-slate-50/50'
                          }`}
                        >
                          {/* 순위 번호 */}
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                              item.rank === 1 ? 'bg-amber-100 text-amber-800' :
                              item.rank <= 3 ? 'bg-slate-200 text-slate-800' :
                              item.rank <= 5 ? 'bg-blue-100 text-blue-800' :
                              'text-slate-500'
                            }`}>
                              {item.rank}
                            </span>
                          </td>

                          {/* 로펌 상호명 */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs ${isMyPlace ? 'text-[#0284C7] font-black' : 'text-slate-900 font-bold'}`}>
                                {item.name}
                              </span>
                              {isMyPlace && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#0284C7] text-white shadow-2xs">
                                  👑 내 로펌 (실시간 {item.rank}위)
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-400 font-normal block mt-0.5">
                              {item.category} · {item.address}
                            </span>
                          </td>

                          {/* 노출 구역 */}
                          <td className="py-3.5 px-4 text-center">
                            {zoneBadge}
                          </td>

                          {/* 네이버 예약 */}
                          <td className="py-3.5 px-4 text-center">
                            {item.hasBooking ? (
                              <span className="text-[11px] font-bold text-emerald-600 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> 연동됨
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-300">미연동</span>
                            )}
                          </td>

                          {/* 네이버 플레이스 링크 */}
                          <td className="py-3.5 px-4 text-center">
                            <a
                              href={item.placeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0284C7] hover:underline text-[11px] font-bold inline-flex items-center gap-0.5"
                            >
                              <span>지도</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 탭 2: 검색 색인용 2,000자 소개글 최적화 생성기 */}
      {/* ========================================================================= */}
      {activeTab === 'intro' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 좌측: 로펌 정보 및 톤앤매너 설정 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0284C7]" />
                <span>네이버 플레이스 2,000자 합법 소개글 설정</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                네이버 검색 봇이 가장 먼저 읽는 첫 100자에 주력 키워드를 배치하고 변호사법 제23조를 100% 준수합니다.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">로펌 / 사무소명</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">관할 / 중심 지역</label>
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">주력 전문 분야</label>
                  <input
                    type="text"
                    value={specialtyName}
                    onChange={(e) => setSpecialtyName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              {/* 3대 톤앤매너 선택 */}
              <div className="pt-2">
                <label className="text-[11px] font-bold text-slate-600 block mb-1.5">소개글 톤앤매너 선택</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['trust', 'authority', 'empathy'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setIntroTone(t)
                        generateIntroText(t)
                      }}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        introTone === t
                          ? 'border-[#0284C7] bg-[#E0F2FE]/50 text-[#0284C7] font-black ring-1 ring-[#0284C7]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs'
                      }`}
                    >
                      <span className="text-xs block">
                        {t === 'trust' && '🤝 신뢰·안심형'}
                        {t === 'authority' && '⚖️ 전문·권위형'}
                        {t === 'empathy' && ' 따뜻·공감형'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => generateIntroText(introTone)}
                  disabled={isGeneratingIntro}
                  className="w-full h-10 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl cursor-pointer"
                >
                  {isGeneratingIntro ? '소개글 생성 중...' : '소개글 다시 생성하기 ➔'}
                </Button>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p className="font-bold text-slate-700">🔒 변호사법 제23조 안심 검증</p>
                <p>'100% 승소', '최고의 변호사', '전관 출신' 등 광고 규정 위반 표현이 원천 배제되었습니다.</p>
              </div>
            </div>
          </div>

          {/* 우측: 완성된 2,000자 소개글 및 복사기 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900">네이버 플레이스 등록용 소개글 완성본</h3>
                <span className="text-[11px] font-mono text-slate-400">
                  글자수: <strong className="text-slate-700">{generatedIntro.length}자</strong> / 최대 2,000자
                </span>
              </div>

              <Button
                size="sm"
                onClick={() => copyToClipboard(generatedIntro, 'intro')}
                className="h-8 px-3.5 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl cursor-pointer"
              >
                {copiedIntro ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedIntro ? '복사 완료!' : '소개글 복사'}
              </Button>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 font-sans text-xs text-slate-700 leading-relaxed max-h-[420px] overflow-y-auto whitespace-pre-line">
              {generatedIntro}
            </div>

            <p className="text-[11px] text-slate-400">
              💡 [스마트플레이스 관리자 ➔ 기본정보 ➔ 상세소개]에 그대로 붙여넣으시면 됩니다.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 탭 3: 변호사법 제26조(비밀유지) 준수 AI 리뷰 감사 답글기 */}
      {/* ========================================================================= */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* 좌측: 의뢰인 리뷰 입력 & 유형 선택 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div>
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#0284C7]" />
                <span>네이버 영수증·예약 리뷰 감사 답글기</span>
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                의뢰인의 민감한 사건 내용을 보호(비밀유지)하면서도, 플레이스 체류 점수를 높이는 품격 있는 답글을 생성합니다.
              </p>
            </div>

            {/* 3대 후기 유형 칩 */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1.5">의뢰인 후기 유형</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setReviewType('won')
                    generateReplyText('won')
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    reviewType === 'won'
                      ? 'border-[#0284C7] bg-[#E0F2FE]/50 text-[#0284C7] font-black ring-1 ring-[#0284C7]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs'
                  }`}
                >
                  <span className="text-xs block">🏆 ① 승소·선처 감사</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReviewType('consult')
                    generateReplyText('consult')
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    reviewType === 'consult'
                      ? 'border-[#0284C7] bg-[#E0F2FE]/50 text-[#0284C7] font-black ring-1 ring-[#0284C7]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs'
                  }`}
                >
                  <span className="text-xs block">🤝 ② 친절 상담 만족</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReviewType('simple')
                    generateReplyText('simple')
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    reviewType === 'simple'
                      ? 'border-[#0284C7] bg-[#E0F2FE]/50 text-[#0284C7] font-black ring-1 ring-[#0284C7]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 text-xs'
                  }`}
                >
                  <span className="text-xs block">⭐ ③ 단순 격려 후기</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 block mb-1">
                의뢰인이 남긴 리뷰 본문 (복사해서 붙여넣기)
              </label>
              <textarea
                rows={4}
                value={customerReview}
                onChange={(e) => setCustomerReview(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0284C7] resize-none"
                placeholder="의뢰인의 네이버 플레이스 리뷰 내용을 붙여넣으세요."
              />
            </div>

            <Button
              onClick={() => generateReplyText(reviewType)}
              disabled={isGeneratingReply}
              className="w-full h-10 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl cursor-pointer"
            >
              {isGeneratingReply ? '답글 생성 중...' : '안심 감사 답글 1초 생성하기 ➔'}
            </Button>
          </div>

          {/* 우측: 완성된 AI 감사 답글 및 복사기 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900">대표 변호사 명의 공식 감사 답글</h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  글자수: <strong className="text-slate-700">{generatedReply.length}자</strong>
                </span>
              </div>

              <Button
                size="sm"
                onClick={() => copyToClipboard(generatedReply, 'reply')}
                className="h-8 px-3.5 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white rounded-xl cursor-pointer"
              >
                {copiedReply ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                {copiedReply ? '복사 완료!' : '답글 복사'}
              </Button>
            </div>

            <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 font-sans text-xs text-slate-700 leading-relaxed min-h-[160px] whitespace-pre-line">
              {generatedReply}
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[11px] text-emerald-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>변호사법 제26조(비밀유지의무) 안심 필터링 적용</span>
              </p>
              <p className="text-emerald-700">
                의뢰인의 구체적 죄명이나 민감한 사생활을 노출하지 않고, 따뜻한 감사와 전문성만을 강조하여 플레이스 신뢰 지수를 높입니다.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
