'use client'

import { useState } from 'react'
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
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

  // 1. 순위 & 경쟁사 분석 상태
  const [keyword, setKeyword] = useState('서초동 변호사')
  const [targetStore, setTargetStore] = useState('')
  const [isLoadingRank, setIsLoadingRank] = useState(false)
  const [rankResult, setRankResult] = useState<{
    query: string
    totalCount: number
    myPlace: (PlaceRankItem & { isTop5: boolean; isTop10: boolean; percentile: number }) | null
    rankingList: PlaceRankItem[]
  } | null>(null)
  const [rankError, setRankError] = useState('')

  // 2. 소개글 생성기 상태
  const [introSpecialty, setIntroSpecialty] = useState('형사 전문 (음주운전, 재산범죄)')
  const [introOfficeName, setIntroOfficeName] = useState('법무법인 율정')
  const [introLocation, setIntroLocation] = useState('서울 서초구 서초대로 (교대역 10번 출구)')
  const [introTone, setIntroTone] = useState<'trust' | 'authority' | 'empathy'>('trust')
  const [generatedIntro, setGeneratedIntro] = useState('')
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false)
  const [copiedIntro, setCopiedIntro] = useState(false)

  // 3. 리뷰 답글 생성기 상태
  const [customerReview, setCustomerReview] = useState(
    '음주운전 적발로 눈앞이 캄캄했는데, 초기 경찰 조사부터 꼼꼼히 챙겨주셔서 집행유예로 마무리되었습니다. 대표 변호사님께서 주말에도 직접 연락 주시고 상담해 주셔서 너무 감사했습니다.'
  )
  const [reviewTone, setReviewTone] = useState<'gratitude' | 'expert' | 'friendly'>('gratitude')
  const [generatedReply, setGeneratedReply] = useState('')
  const [isGeneratingReply, setIsGeneratingReply] = useState(false)
  const [copiedReply, setCopiedReply] = useState(false)

  // 순위 조회 실행
  const handleCheckRank = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setIsLoadingRank(true)
    setRankError('')

    try {
      const q = encodeURIComponent(keyword.trim())
      const t = encodeURIComponent(targetStore.trim())
      const res = await fetch(`/api/place/rank?query=${q}&target=${t}`)
      const data = await res.json()

      if (data.success) {
        setRankResult({
          query: data.query,
          totalCount: data.totalCount,
          myPlace: data.myPlace,
          rankingList: data.rankingList
        })
      } else {
        setRankError(data.error || '순위 정보를 가져오지 못했습니다.')
      }
    } catch {
      setRankError('서버 통신 중 오류가 발생했습니다.')
    } finally {
      setIsLoadingRank(false)
    }
  }

  // 소개글 AI 생성 (규정 준수)
  const handleGenerateIntro = () => {
    setIsGeneratingIntro(true)
    setTimeout(() => {
      let text = ''
      if (introTone === 'trust') {
        text = `[${introOfficeName} 소개]\n\n` +
          `안녕하십니까, ${introLocation}에 위치한 ${introOfficeName}입니다.\n\n` +
          `저희는 ${introSpecialty} 분야를 중심으로 의뢰인이 가장 절박한 순간, 법리와 객관적 증거를 토대로 최선의 해결 방안을 모색합니다.\n\n` +
          `■ 핵심 조력 분야\n` +
          `· 수사 초기 경찰·검찰 조사 직접 동행\n` +
          `· 사건별 쟁점 분석 및 맞춤형 양형자료 구축\n` +
          `· 대표 전문가 1:1 직접 상담 및 철저한 비밀 보장\n\n` +
          `■ 상담 안내\n` +
          `의뢰인의 소중한 일상을 지키기 위해 첫 상담부터 사건 종결까지 빈틈없이 함께합니다. 사전 예약 시 야간 및 주말 상담이 가능합니다.\n\n` +
          `※ 본 사무소는 변호사법 및 전문직 광고 규정을 철저히 준수합니다.`
      } else if (introTone === 'authority') {
        text = `[${introOfficeName} - ${introSpecialty} 중점 조력]\n\n` +
          `${introLocation} 소재 ${introOfficeName}입니다.\n\n` +
          `수많은 판례와 세법 실무 경험을 바탕으로, 복잡하고 까다로운 쟁점을 명쾌하게 풀어냅니다. 의뢰인의 사건 하나하나에 집중하기 위해 무분별한 사건 수임을 지양하며, 철저한 법리 검토를 거쳐 가능성 높은 대응 전략만을 제안합니다.\n\n` +
          `■ 사무소 운영 원칙\n` +
          `1. 대표 변호사·세무사의 직접 서면 작성 및 기일 출석\n` +
          `2. 사건 진행 단계별 실시간 공유 시스템\n` +
          `3. 합리적이고 투명한 수임료 기준 고지\n\n` +
          `상담 예약은 네이버 플레이스 예약 또는 유선으로 접수해 주시면 신속히 안내해 드리겠습니다.`
      } else {
        text = `[의뢰인의 마음을 먼저 헤아리는 ${introOfficeName}]\n\n` +
          `예상치 못한 법률·세무 문제로 밤잠을 설치고 계신가요?\n\n` +
          `${introLocation}에 위치한 ${introOfficeName}은 혼자 감당하기 힘든 불안과 막막함을 덜어드리는 따뜻하고 든든한 법률 동반자입니다.\n\n` +
          `사무장 대리 상담 없이 대표 전문가가 직접 의뢰인의 이야기를 경청하며, 비밀 보장을 최우선으로 하여 안전하고 실질적인 해결책을 마련해 드립니다.\n\n` +
          `■ 진료/상담 시간: 평일 09:00~19:00 (사전 예약제 운영)\n` +
          `■ 위치: ${introLocation}\n\n` +
          `혼자 고민하지 마시고, 편안한 마음으로 문의해 주세요.`
      }

      setGeneratedIntro(text)
      setIsGeneratingIntro(false)
    }, 600)
  }

  // 리뷰 답글 AI 생성 (규정 준수)
  const handleGenerateReply = () => {
    setIsGeneratingReply(true)
    setTimeout(() => {
      let reply = ''
      if (reviewTone === 'gratitude') {
        reply = `소중한 후기를 남겨주셔서 진심으로 감사드립니다.\n\n처음 사무소를 찾아오셨을 때 많이 불안해하셨던 모습이 기억에 남습니다. 사건 진행 과정에서 변호인의 조언을 신뢰하고 일관되게 따라주신 덕분에 좋은 결과를 이끌어낼 수 있었습니다.\n\n다시금 일상을 되찾으신 것을 축하드리며, 앞으로 늘 평안하시기를 기원합니다. 도움이 필요하실 땐 언제든 편히 찾아주십시오.`
      } else if (reviewTone === 'expert') {
        reply = `정성스러운 리뷰 감사드립니다.\n\n본 사건은 초기 경찰 조사 단계의 진술 방향과 객관적 양형자료 준비가 핵심 쟁점이었던 사안으로, 의뢰인님의 빠른 대응과 협조가 있었기에 적절한 법리적 방어가 가능했습니다.\n\n앞으로도 모든 의뢰인의 사건을 내 일처럼 깊이 있게 고민하고 최선의 해답을 제시하는 전문가가 되겠습니다.`
      } else {
        reply = `따뜻한 말씀 남겨주셔서 큰 보람과 힘이 됩니다.\n\n어려운 시기에 저희를 믿고 함께해 주셔서 감사드리며, 의뢰인님의 앞날에 늘 기분 좋은 일만 가득하시길 응원합니다.\n\n주변에 비슷한 고민으로 힘들어하시는 분이 계시다면 언제든 든든한 조력자가 되어 드리겠습니다. 건강 유의하십시오!`
      }

      setGeneratedReply(reply)
      setIsGeneratingReply(false)
    }, 500)
  }

  const copyText = (text: string, type: 'intro' | 'reply') => {
    navigator.clipboard.writeText(text)
    if (type === 'intro') {
      setCopiedIntro(true)
      setTimeout(() => setCopiedIntro(false), 2000)
    } else {
      setCopiedReply(true)
      setTimeout(() => setCopiedReply(false), 2000)
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* 🌟 상단 타이틀 & 탭 네비게이션 */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] animate-pulse"></span>
            <span className="text-xs font-black text-[#0284C7] tracking-wider uppercase">
              Naver SmartPlace Growth Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
            네이버 스마트플레이스 통합 관리 센터
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            로컬 키워드 순위 추적, 상위 경쟁사 분석, 합법 소개글 생성, AI 리뷰 응대를 원스톱으로 처리합니다.
          </p>
        </div>

        {/* 3대 핵심 탭 버튼 */}
        <div className="flex items-center gap-1.5 p-1 bg-[#F4F8FC] rounded-xl border border-slate-200 shrink-0">
          <button
            onClick={() => setActiveTab('rank')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'rank'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📍 실시간 순위 & 경쟁사
          </button>
          <button
            onClick={() => setActiveTab('intro')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'intro'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✍️ 소개글 최적화
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'review'
                ? 'bg-white text-[#0284C7] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💬 AI 리뷰 감사 답글
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 탭 1: 실시간 순위 추적 & 경쟁사 분석 */}
      {/* ========================================================================= */}
      {activeTab === 'rank' && (
        <div className="space-y-5">
          {/* 검색 폼 카드 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
            <form onSubmit={handleCheckRank} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">검색할 로컬 키워드</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#0284C7] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="예: 서초동 변호사, 강남역 세무사, 양재동 이혼전문"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 mb-1 block">내 상호명 (선택 - 순위 하이라이트)</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="예: 법무법인 율정, 세무회계 정인"
                    value={targetStore}
                    onChange={(e) => setTargetStore(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0284C7]"
                  />
                </div>
              </div>

              <div className="sm:self-end">
                <Button
                  type="submit"
                  disabled={isLoadingRank}
                  className="w-full sm:w-auto h-10 px-6 bg-[#0284C7] hover:bg-[#0369A1] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isLoadingRank ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Search className="w-3.5 h-3.5" />
                  )}
                  <span>실시간 순위 조회</span>
                </Button>
              </div>
            </form>

            {rankError && (
              <p className="mt-3 text-xs text-rose-600 font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {rankError}
              </p>
            )}
          </div>

          {/* 순위 결과 및 경쟁사 분석 대시보드 */}
          {rankResult && (
            <div className="space-y-4">
              {/* 내 플레이스 성과 배너 */}
              {rankResult.myPlace ? (
                <div className="bg-gradient-to-r from-[#E0F2FE] via-white to-[#E0F2FE] border-2 border-[#0284C7] p-5 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#0284C7] text-white flex items-center justify-center font-black text-xl shadow-md">
                      {rankResult.myPlace.rank}위
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-black text-base text-slate-900">{rankResult.myPlace.name}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-[#0284C7] text-white font-bold text-[10px]">
                          상위 {rankResult.myPlace.percentile}%
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        '{rankResult.query}' 검색 결과 총 {rankResult.totalCount}개 업체 중 현재 <strong className="text-[#0284C7]">{rankResult.myPlace.rank}위</strong>에 노출 중입니다.
                      </p>
                    </div>
                  </div>

                  <a href={rankResult.myPlace.placeUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="outline" className="text-xs font-bold border-[#0284C7] text-[#0284C7] hover:bg-[#E0F2FE] gap-1">
                      <span>내 플레이스 바로가기</span>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </a>
                </div>
              ) : targetStore ? (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    상위 목록에서 '{targetStore}'을(를) 찾지 못했습니다. 키워드 최적화 및 방문자 리뷰 관리가 시급합니다.
                  </span>
                </div>
              ) : null}

              {/* 경쟁사 순위 리스트 (1위~N위) */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
                <div className="p-4 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-black text-slate-900">
                      '{rankResult.query}' 실시간 플레이스 상위 랭킹 & 경쟁사 분석
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    총 {rankResult.rankingList.length}개 노출
                  </span>
                </div>

                <div className="divide-y divide-slate-100">
                  {rankResult.rankingList.map((item) => {
                    const isTop3 = item.rank <= 3
                    return (
                      <div 
                        key={item.id}
                        className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                          isTop3 ? 'bg-[#F0F7FF]/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 ${
                            item.rank === 1 ? 'bg-amber-400 text-slate-950 shadow-xs' :
                            item.rank === 2 ? 'bg-slate-300 text-slate-800' :
                            item.rank === 3 ? 'bg-amber-600 text-white' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.rank}
                          </span>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-xs text-slate-900 truncate">
                                {item.name}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600">
                                {item.category}
                              </span>
                              {item.hasBooking && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  네이버 예약 연동
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">
                              {item.address}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <a href={item.placeUrl} target="_blank" rel="noopener noreferrer">
                            <Button size="sm" variant="ghost" className="h-8 px-2.5 text-xs text-slate-500 hover:text-[#0284C7] cursor-pointer">
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 탭 2: 플레이스 소개글 AI 최적화 생성기 */}
      {/* ========================================================================= */}
      {activeTab === 'intro' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900">소개글 기본 정보 설정</h3>
              <p className="text-[11px] text-slate-400">변호사법 및 세무사법 광고 가이드라인을 100% 반영합니다.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">사무소 상호명</label>
                <input
                  type="text"
                  value={introOfficeName}
                  onChange={(e) => setIntroOfficeName(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">중점 전문 분야</label>
                <input
                  type="text"
                  value={introSpecialty}
                  onChange={(e) => setIntroSpecialty(e.target.value)}
                  placeholder="예: 형사 전문, 상속세·증여세 감정평가"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">사무소 위치 및 찾아오시는 길</label>
                <input
                  type="text"
                  value={introLocation}
                  onChange={(e) => setIntroLocation(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0284C7]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">소개글 톤앤매너</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setIntroTone('trust')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      introTone === 'trust'
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    신뢰·객관형
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntroTone('authority')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      introTone === 'authority'
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    전문·권위형
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntroTone('empathy')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      introTone === 'empathy'
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    공감·경청형
                  </button>
                </div>
              </div>

              <Button
                onClick={handleGenerateIntro}
                disabled={isGeneratingIntro}
                className="w-full h-10 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>합법 소개글 AI 생성하기</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-black text-slate-900">생성된 스마트플레이스 소개글</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  광고 법규 안심
                </span>
              </div>

              {generatedIntro && (
                <Button
                  size="sm"
                  onClick={() => copyText(generatedIntro, 'intro')}
                  className="h-8 px-3 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer"
                >
                  {copiedIntro ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedIntro ? '복사 완료' : '원클릭 복사'}
                </Button>
              )}
            </div>

            {generatedIntro ? (
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line min-h-[320px]">
                {generatedIntro}
              </div>
            ) : (
              <div className="h-72 flex flex-col items-center justify-center text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 space-y-2">
                <FileText className="w-8 h-8 text-slate-300" />
                <p className="font-bold">좌측 설정 후 [소개글 AI 생성하기]를 클릭하세요.</p>
                <p className="text-[11px] text-slate-400">네이버 스마트플레이스 글자 수 규격에 최적화된 텍스트가 완성됩니다.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 탭 3: 방문자 리뷰 AI 감사 답글기 */}
      {/* ========================================================================= */}
      {activeTab === 'review' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-900">방문자 영수증/예약 리뷰 입력</h3>
              <p className="text-[11px] text-slate-400">의뢰인의 리뷰를 붙여넣으면 신뢰감 높은 감사 답글을 작성합니다.</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">의뢰인 리뷰 원문</label>
                <textarea
                  rows={4}
                  value={customerReview}
                  onChange={(e) => setCustomerReview(e.target.value)}
                  placeholder="플레이스에 등록된 리뷰를 복사하여 붙여넣으세요"
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-[#0284C7] resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 mb-1 block">답글 톤앤매너</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setReviewTone('gratitude')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      reviewTone === 'gratitude'
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    정중·감사형
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewTone('expert')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      reviewTone === 'expert'
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    전문·신뢰형
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewTone('friendly')}
                    className={`p-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                      reviewTone === 'friendly'
                        ? 'border-[#0284C7] bg-[#E0F2FE] text-[#0284C7]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    따뜻·응원형
                  </button>
                </div>
              </div>

              <Button
                onClick={handleGenerateReply}
                disabled={isGeneratingReply}
                className="w-full h-10 bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5 mt-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI 감사 답글 생성하기</span>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#0284C7]" />
                <span className="text-xs font-black text-slate-900">추천 AI 감사 답글</span>
              </div>

              {generatedReply && (
                <Button
                  size="sm"
                  onClick={() => copyText(generatedReply, 'reply')}
                  className="h-8 px-3 text-xs font-black bg-[#0284C7] hover:bg-[#0369A1] text-white cursor-pointer"
                >
                  {copiedReply ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                  {copiedReply ? '복사됨' : '원클릭 복사'}
                </Button>
              )}
            </div>

            {generatedReply ? (
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans whitespace-pre-line min-h-[220px]">
                {generatedReply}
              </div>
            ) : (
              <div className="h-60 flex flex-col items-center justify-center text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-6 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300" />
                <p className="font-bold">좌측에 리뷰를 넣고 [AI 감사 답글 생성하기]를 클릭하세요.</p>
                <p className="text-[11px] text-slate-400">스마트플레이스 관리자 페이지에 그대로 복사할 수 있는 정중한 답글이 생성됩니다.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
