import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  MapPin,
  Scale,
  QrCode,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Clock,
  ChevronRight,
  Search,
  HelpCircle,
  BarChart3,
  CheckCircle2,
} from 'lucide-react'
import { blogPosts } from '@/lib/blogData'
import HeroPlaceSearch from '@/components/home/HeroPlaceSearch'

export const metadata: Metadata = {
  title: 'PostSync - 네이버 스마트플레이스 실시간 순위 조회 & 로컬 마케팅 분석 포털',
  description:
    '네이버 스마트플레이스 1위~75위 실시간 순위 조회, 1위 매장과의 4대 정량 격차(방문자리뷰·블로그리뷰·예약·쿠폰) 분석, 월간 키워드 검색량 측정, 매장 리뷰 QR 빌더 및 소개글 금칙어 스캐너를 제공하는 로컬 비즈니스 마케팅 포털입니다.',
  alternates: {
    canonical: 'https://www.postsyncapp.com',
  },
  openGraph: {
    title: 'PostSync - 네이버 스마트플레이스 실시간 순위 조회 & 로컬 마케팅 분석 포털',
    description:
      '키워드와 상호명만 입력하면 네이버 플레이스 실시간 순위와 1위 매장 대비 리뷰·예약·저장수 격차를 1초 만에 분석합니다.',
    url: 'https://www.postsyncapp.com',
    siteName: 'PostSync 플레이스 연구소',
    locale: 'ko_KR',
    type: 'website',
  },
}

const CORE_PLACE_TOOLS = [
  {
    id: 'place',
    name: '스마트플레이스 실시간 순위 & 1위 격차 조회기',
    href: '/place',
    badge: '실시간 1위~75위 · 검색량 측정',
    target: '자영업 매장 · 병의원 · 미용실 · 학원 · 전문직',
    desc: '검색 키워드와 상호명을 입력하면 네이버 플레이스 실시간 노출 등수, 공식 월간 검색량, 1위 경쟁 매장과의 방문자리뷰·블로그리뷰·예약·쿠폰 격차를 즉시 실측합니다.',
    icon: MapPin,
    btnLabel: '순위 확인하기',
    accent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  {
    id: 'utm',
    name: '매장 영수증 리뷰 & 캠페인 고화질 QR코드 빌더',
    href: '/utm',
    badge: '인쇄용 PNG/SVG QR 즉시 생성',
    target: '오프라인 매장 사장님 · 로컬 마케터',
    desc: '테이블이나 카운터에 비치하여 방문 고객이 스마트폰 카메라로 스캔 즉시 네이버 플레이스 리뷰·예약·인스타그램 페이지로 이동하게 만드는 고화질 QR코드와 추적 링크를 생성합니다.',
    icon: QrCode,
    btnLabel: 'QR 생성하기',
    accent: 'text-blue-700 bg-blue-50 border-blue-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
  {
    id: 'adcheck',
    name: '플레이스 상세설명 & 블로그 원고 금칙어 스캐너',
    href: '/adcheck',
    badge: '노출 제한 · 심의 위반 사전 차단',
    target: '병의원 · 전문직 · 로컬 매장 · 체험단 운영자',
    desc: '플레이스 상세설명이나 블로그 홍보 원고 등록 전, 검색 누락(저품질) 및 행정처분을 유발하는 과장·보장성 금칙어를 1초 만에 검출하고 안전한 대체 문구를 제안합니다.',
    icon: Scale,
    btnLabel: '금칙어 검사하기',
    accent: 'text-purple-700 bg-purple-50 border-purple-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
]

const SECONDARY_UTILITIES = [
  {
    name: 'ChatGPT·노션 ➔ 네이버 블로그 서식 변환기',
    href: '/convert',
    desc: '스마트에디터 ONE 표·인용구 깨짐 방지 복사',
  },
  {
    name: '상세페이지 자동 분할 & 리사이징 스튜디오',
    href: '/crop',
    desc: '스마트스토어·쿠팡 규격 무손실 이미지 슬라이서',
  },
  {
    name: '채용 포털별 자소서 글자수 & 바이트 계산기',
    href: '/byte',
    desc: '3대 취업포털 바이트 공식 및 키워드 밀도 계산',
  },
  {
    name: '공공기관 HWPX 무설치 브라우저 뷰어',
    href: '/hwpx',
    desc: '서버 업로드 없는 로컬 메모리 HWPX 본문 추출',
  },
]

const EDITORIAL_FAQS = [
  {
    q: '내 스마트폰으로 매일 직접 네이버에 우리 가게를 검색하면 왜 순위에 불리한가요?',
    a: '매장 와이파이(동일 IP)나 사장님 개인 스마트폰으로 매일 같은 키워드를 반복 검색하고 내 매장을 클릭하면, 네이버 검색 알고리즘이 이를 인위적인 자가 트래픽(어뷰징)으로 판단해 순위 가중치를 차감할 수 있습니다. 또한 개인화 검색 기록 때문에 실제 손님에게 보이는 순위보다 높게 왜곡되어 보이므로, 독립된 서버에서 객관적인 순위를 측정하는 PostSync 실시간 순위 조회기(/place)를 이용하는 것이 안전합니다.',
  },
  {
    q: '네이버 스마트플레이스 순위가 갑자기 하락했을 때 가장 먼저 점검해야 할 지표는 무엇인가요?',
    a: '2026년 플레이스 노출 순위 하락의 3대 핵심 원인은 ① 최근 14~30일 이내 실제 길찾기·저장하기·예약 등 진성 행동 지표의 상대적 감소, ② 경쟁 매장의 신규 영수증 리뷰 및 키워드 매칭 상세설명 업데이트에 따른 최신성(Freshness) 격차 발생, ③ 불법 트래픽 프로그램이나 공장형 작업 등 인위적 조작 시도로 인한 알고리즘 필터링입니다. 먼저 실시간 순위 조회기(/place)로 1위~5위 경쟁 매장과 방문자 리뷰·블로그 리뷰·예약·쿠폰 격차를 정량적으로 비교해야 합니다.',
  },
  {
    q: '리뷰가 수천 개인 경쟁 매장을 제치고 1페이지(상위 5위)에 진입하려면 어떻게 해야 하나요?',
    a: '네이버 스마트플레이스 알고리즘(NPlaceRank)은 과거 3년간 쌓인 누적 리뷰 개수보다 최근 30일 동안 꾸준히 발생하는 신규 영수증 포토 리뷰 속도(Velocity)와 예약·쿠폰 클릭 반응에 훨씬 높은 가중치를 부여합니다. 상세설명 첫 3줄에 지역+세부 업종 키워드를 정확히 배치하고, 네이버 예약과 플레이스 쿠폰을 활성화한 뒤 매장 내 QR코드(/utm)로 실방문객의 리뷰와 저장하기를 유도하면 누적 리뷰 격차를 빠르게 극복할 수 있습니다.',
  },
  {
    q: '플레이스 상세설명이나 블로그 체험단 원고 작성 시 주의해야 할 금칙어는 무엇인가요?',
    a: '객관적 근거 없는 최상급·유일성 표현("국내 최고", "지역 1위", "유일한"), 결과 단정 및 보장성 문구("100% 완치/해결", "부작용 없는", "무조건 보장")는 알고리즘 스팸 필터링 및 의료법·표시광고법·전문직 광고 규정 위반 대상입니다. 소개글 반영 전 금칙어 스캐너(/adcheck)로 위험 단어를 점검하고 객관적인 서비스 안내 문구로 치환하시기 바랍니다.',
  },
  {
    q: '제공되는 웹 유틸리티에 입력한 매장 정보나 원고 데이터가 외부에 노출되나요?',
    a: '노출되지 않습니다. 플레이스 실시간 순위 조회기(/place)는 네이버 지도의 공개된 검색 결과 순위와 공식 월간 검색량만을 실시간으로 대조하여 화면에 보여주며, 금칙어 스캐너(/adcheck)와 QR 빌더(/utm) 등 모든 유틸리티는 회원가입 없이 브라우저에서 즉시 안전하게 작동합니다.',
  },
]

export default function HomePage() {
  const placePosts = blogPosts.filter((p) => p.categoryLabel === '스마트플레이스')
  const complianceAndSeoPosts = blogPosts.filter((p) => p.categoryLabel !== '스마트플레이스')

  const featuredPosts = [
    blogPosts.find((p) => p.slug === 'naver-place-rank-algorithm-2026') || placePosts[0],
    blogPosts.find((p) => p.slug === 'naver-place-rank-checker-free') || placePosts[1] || complianceAndSeoPosts[0],
  ].filter(Boolean)

  const curatedPlacePosts = placePosts.slice(0, 6)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.postsyncapp.com/#website',
        url: 'https://www.postsyncapp.com',
        name: 'PostSync 스마트플레이스 & 로컬 마케팅 분석 포털',
        description:
          '2026 네이버 스마트플레이스 실시간 순위 조회, 1위 매장 격차 분석, 검색 최적화(SEO/GEO) 실전 칼럼 및 무료 비즈니스 웹 유틸리티 포털',
        inLanguage: 'ko-KR',
        publisher: {
          '@id': 'https://www.postsyncapp.com/#organization',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.postsyncapp.com/#organization',
        name: '와이엠랩스 (YM Labs)',
        alternateName: 'PostSync',
        url: 'https://www.postsyncapp.com',
        email: 'support@postsyncapp.com',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '송파대로 345, 103동 204호',
          addressLocality: '송파구',
          addressRegion: '서울특별시',
          addressCountry: 'KR',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: EDITORIAL_FAQS.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.a,
          },
        })),
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white break-keep break-words">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. 상단 글로벌 네비게이션 헤더 (플레이스 툴과 100% 일치시킨 딥 슬레이트 다크 테마) */}
      <header className="sticky top-0 z-50 bg-[#0f172a] text-white border-b border-slate-800/90 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm group-hover:bg-blue-500 transition">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-white">PostSync</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30">
                    PLACE LAB
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium hidden sm:block leading-none mt-0.5">
                  스마트플레이스 순위 분석 &amp; 로컬 마케팅 포털
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-300">
              <Link href="/place" className="text-white hover:text-emerald-400 transition flex items-center gap-1 font-bold">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>플레이스 순위 조회</span>
              </Link>
              <Link href="/utm" className="hover:text-white transition">
                매장 리뷰·QR 생성
              </Link>
              <Link href="/adcheck" className="hover:text-white transition">
                소개글 금칙어 검사
              </Link>
              <Link href="/blog" className="hover:text-white transition">
                플레이스 공략 칼럼 ({blogPosts.length})
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white transition border border-slate-700"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>상위노출 칼럼</span>
            </Link>
            <Link
              href="/place"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-sm transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>순위 1초 진단</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 와이드 컨테이너 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-20 md:space-y-24">
        {/* 2. 히어로 섹션 (정돈된 한글 카피라이팅 & 플로팅 검색 위젯) */}
        <section className="text-center space-y-8 max-w-4xl mx-auto pt-4 md:pt-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NPlaceRank 2026 LIVE · 네이버 스마트플레이스 실시간 순위 분석 엔진</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.18] text-balance">
              내 매장의 스마트플레이스 순위와 <br />
              <span className="text-slate-900">1위 매장과의 4대 격차를 실시간으로 확인하세요</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-[1.65] font-normal max-w-2xl mx-auto text-pretty">
              매장 와이파이나 스마트폰으로 반복 검색할 때 발생하는 자가 어뷰징 감점 없이, 독립된 실시간 엔진으로 현재 노출 순위와 공식 월간 검색량, 1위 매장의 리뷰·예약 4대 격차를 1초 만에 진단합니다.
            </p>
          </div>

          {/* 단일 플로팅 검색창 컴포넌트 */}
          <div className="pt-2">
            <HeroPlaceSearch variant="hero" />
          </div>

          {/* 핵심 데이터 3대 신뢰 지표 바 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">BENCHMARK</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  4대 정량 격차
                </span>
              </div>
              <strong className="text-sm sm:text-base font-extrabold text-slate-900 block pt-1">
                1위 매장 대비 격차 실측
              </strong>
              <p className="text-xs text-slate-500 leading-relaxed">
                방문자리뷰 · 블로그리뷰 · 네이버 예약 · 쿠폰 발급 현황 비교
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">SEARCH VOLUME</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  공식 월간 검색량
                </span>
              </div>
              <strong className="text-sm sm:text-base font-extrabold text-slate-900 block pt-1">
                PC · 모바일 검색 수요 측정
              </strong>
              <p className="text-xs text-slate-500 leading-relaxed">
                네이버 공식 월간 검색 횟수(PC·모바일) 및 키워드 노출 경쟁 강도 분석
              </p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-400">COVERAGE</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  전수 1위~75위
                </span>
              </div>
              <strong className="text-sm sm:text-base font-extrabold text-slate-900 block pt-1">
                어뷰징 없는 독립 서버 실측
              </strong>
              <p className="text-xs text-slate-500 leading-relaxed">
                개인화 검색 기록 왜곡을 배제한 객관적 플레이스 노출 순위 산출
              </p>
            </div>
          </div>
        </section>

        {/* 3. 핵심 3대 솔루션 카드 그리드 (Dub.co 스타일의 단정한 피처 쇼케이스) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-5">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                CORE SMART PLACE TOOLKIT
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 text-balance">
                플레이스 상위노출과 매장 운영을 위한 3대 핵심 도구
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                순위 확인 후 매장 내 리뷰 QR 비치와 상세설명 금칙어 점검까지 회원가입 없이 바로 실행할 수 있습니다.
              </p>
            </div>
            <Link
              href="/place"
              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 shrink-0 transition"
            >
              <span>플레이스 순위 조회기 전체화면</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_PLACE_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <div
                  key={tool.id}
                  className="bg-white rounded-3xl border border-slate-200/90 p-7 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${tool.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tool.accent}`}>
                        {tool.badge}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-slate-400 block">{tool.target}</span>
                      <h3 className="text-lg font-black text-slate-900 leading-snug">
                        <Link href={tool.href} className="hover:text-emerald-700 transition">
                          {tool.name}
                        </Link>
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
                        {tool.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100">
                    <Link
                      href={tool.href}
                      className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${tool.btnClass}`}
                    >
                      <span>{tool.btnLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 4. 2026 스마트플레이스 4대 랭킹 요소 & 법정 심의 기준표 (정밀 테이블 쇼케이스) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-8">
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              2026 NPLACERANK &amp; COMPLIANCE REFERENCE
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 text-balance">
              2026 네이버 스마트플레이스 노출 알고리즘 및 광고 심의 핵심 기준표
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
              플레이스 1페이지(상위 5위) 진입을 위해 반드시 관리해야 할 <strong>스마트플레이스 4대 정량 평가 지표</strong>와 <strong>업종별 온라인 광고 법정 금칙어</strong> 요약본입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 표 1: 스마트플레이스 NPlaceRank 4대 요소 */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>[표 1] 2026 스마트플레이스 4대 평가 지표 및 최적화 액션</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                네이버 스마트플레이스 순위는 단순 리뷰 수가 아니라 <strong>연관도, 인기도, 신뢰도, 최신성</strong>의 복합 가중치로 결정됩니다.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5 font-bold">평가 영역</th>
                      <th className="py-3 px-3.5 font-bold">세부 반영 시그널</th>
                      <th className="py-3 px-3.5 font-bold">실무 최적화 핵심 액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">연관도 (Relevance)</td>
                      <td className="py-3 px-3.5">대표 키워드 5개, 상세설명 텍스트, 메뉴명 일치도</td>
                      <td className="py-3 px-3.5">지역명+핵심 업종 키워드를 상세설명 첫 3줄 내 자연스럽게 배치</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">인기도 (Popularity)</td>
                      <td className="py-3 px-3.5">실사용자 저장하기, 길찾기 실행, 네이버 예약 전환율</td>
                      <td className="py-3 px-3.5">매장 내 고화질 QR(/utm) 비치로 실방문객의 자발적 저장 및 쿠폰 유도</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">신뢰도 (Trust)</td>
                      <td className="py-3 px-3.5">영수증 실결제 리뷰 비율, 진성 후기, 어뷰징 클린 지수</td>
                      <td className="py-3 px-3.5">불법 트래픽 슬롯 절대 금지 및 사진 포함 실결제 영수증 리뷰 확보</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">최신성 (Freshness)</td>
                      <td className="py-3 px-3.5">최근 7~14일 내 새소식 공지, 신규 사진, 리뷰 답글</td>
                      <td className="py-3 px-3.5">주 2회 이상 새소식 발행 및 영업시간·휴무일 정보 상시 최신화</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 표 2: 전문직·병의원 온라인 광고 컴플라이언스 요약 */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>[표 2] 병의원·전문직 플레이스 및 블로그 광고 원천 금지 표현</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                병의원·법무·세무 업종은 플레이스 소개글이나 블로그 홍보글에 <strong>법정 금지어 포함 시 노출 제한 및 행정처분</strong> 대상이 됩니다.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-3.5 font-bold">업종 구분</th>
                      <th className="py-3 px-3.5 font-bold">적용 법령</th>
                      <th className="py-3 px-3.5 font-bold text-rose-700">대표 금지 문구</th>
                      <th className="py-3 px-3.5 font-bold text-emerald-700">권장 대체 방향</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">병의원 · 치과 · 한의원</td>
                      <td className="py-3 px-3.5">의료법 제56조</td>
                      <td className="py-3 px-3.5 text-rose-700 font-semibold">완치 보장, 부작용 없는, 비로그인 치료후기</td>
                      <td className="py-3 px-3.5">질환 원인·예방 수칙, 시술 원리 및 발생 가능 부작용 고지</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">변호사 · 법무법인</td>
                      <td className="py-3 px-3.5">변호사법 제23조</td>
                      <td className="py-3 px-3.5 text-rose-700 font-semibold">100% 승소, 최고/유일, 전관예우 암시</td>
                      <td className="py-3 px-3.5">판례 법리 분석 및 절차 안내, 광고책임변호사 명시</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">세무사 · 회계사</td>
                      <td className="py-3 px-3.5">세무사법 제12조</td>
                      <td className="py-3 px-3.5 text-rose-700 font-semibold">환급률 1위, 무조건 평균 환급액, 무료/최저가</td>
                      <td className="py-3 px-3.5">개정 세법 해설, 적법한 공제·감면 요건 체크리스트 제시</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-3.5 font-bold text-slate-900">노무사 · 행정사</td>
                      <td className="py-3 px-3.5">공인노무사법·행정사법</td>
                      <td className="py-3 px-3.5 text-rose-700 font-semibold">100% 구제/인가 장담, 공무원 사적 연고 선전</td>
                      <td className="py-3 px-3.5">노동위원회 판정 사례, 인허가 구비 서류 및 요건 설명</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 스마트플레이스 상위노출 실전 공략 칼럼 (Toss Journal 스타일의 정갈한 아티클 뷰) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-5">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                SMART PLACE PLAYBOOK
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 text-balance">
                2026 네이버 스마트플레이스 노출 알고리즘(NPlaceRank) 실전 칼럼
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-bold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition"
            >
              <span>플레이스 &amp; 마케팅 칼럼 전체보기 ({blogPosts.length}편)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 필독 대표 칼럼 2선 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 font-bold border border-slate-200">
                      📍 {post.categoryLabel} 핵심 분석
                    </span>
                    <div className="flex items-center gap-3 text-slate-400 font-medium">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug text-balance">
                    <Link href={`/blog/${post.slug}`} className="hover:text-emerald-700 transition">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>

                  {post.badge && (
                    <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">핵심 주제: {post.badge}</span>
                      <span className="text-slate-500 font-medium">2026 실측 데이터 기반</span>
                    </div>
                  )}
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    집필: {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-bold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition"
                  >
                    <span>칼럼 읽기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* 스마트플레이스 실전 가이드 6편 그리드 */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>플레이스 순위 상승 · 영수증 리뷰 · 대표키워드 세팅 실무 칼럼</span>
              </h3>
              <Link href="/place" className="text-xs font-bold text-slate-700 hover:text-emerald-700 transition">
                내 매장 순위 먼저 조회하기 →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {curatedPlacePosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 hover:border-slate-300 hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                        {post.categoryLabel}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-emerald-700 transition">
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-slate-900 hover:text-emerald-700 inline-flex items-center gap-1 transition"
                    >
                      <span>읽기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. 상시 오픈형 FAQ 섹션 (Answer-First 두괄식 답변) */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="border-b border-slate-200/80 pb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 flex items-center gap-2 text-balance">
              <HelpCircle className="w-6 h-6 text-slate-900" />
              <span>스마트플레이스 순위 조회 및 상위노출 자주 묻는 질문 (FAQ)</span>
            </h2>
          </div>

          <div className="space-y-4">
            {EDITORIAL_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-start gap-2.5">
                  <span className="text-slate-900 font-black shrink-0">Q{idx + 1}.</span>
                  <span className="text-balance">{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-[1.65] pl-6 text-pretty">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 7. 글로벌 푸터 (법정 상용 웹 표준 & 유틸리티 안전 격리) */}
      <footer className="bg-white border-t border-slate-200/80 mt-20 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  P
                </div>
                <span className="text-base font-black text-slate-900">PostSync 플레이스 연구소</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                PostSync(와이엠랩스 운영)는 2026 네이버 스마트플레이스 노출 알고리즘(NPlaceRank), 로컬 검색 최적화(SEO/GEO), 광고 컴플라이언스를 분석하는 데이터 연구 플랫폼이자 비즈니스 웹 유틸리티 포털입니다.
              </p>
              <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                <p>상호명: 와이엠랩스 (YM Labs) · 대표자: 유영무 · 사업자등록번호: 736-48-01186</p>
                <p>사업장 소재지: 서울특별시 송파구 송파대로 345, 103동 204호 · 고객지원: support@postsyncapp.com</p>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2.5">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">플레이스 &amp; 마케팅 핵심 툴</div>
              <ul className="space-y-1.5 text-xs">
                <li>
                  <Link href="/place" className="text-slate-900 font-bold hover:text-emerald-700 transition">
                    네이버 플레이스 실시간 순위 조회기
                  </Link>
                </li>
                <li>
                  <Link href="/utm" className="hover:text-slate-900 transition">
                    매장 영수증 리뷰 &amp; QR코드 빌더
                  </Link>
                </li>
                <li>
                  <Link href="/adcheck" className="hover:text-slate-900 transition">
                    플레이스 소개글 금칙어 스캐너
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-slate-900 transition">
                    플레이스 상위노출 실전 칼럼 ({blogPosts.length}편)
                  </Link>
                </li>
                <li>
                  <Link href="/guide/ad-law-2026" className="hover:text-slate-900 transition">
                    2026 온라인 광고 심의 공식 백서
                  </Link>
                </li>
              </ul>
            </div>

            {/* 부가 업무 무료 유틸리티 안전 보존 구역 */}
            <div className="md:col-span-2 space-y-2.5">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">부가 업무 유틸리티</div>
              <ul className="space-y-1.5 text-xs text-slate-400">
                {SECONDARY_UTILITIES.map((util) => (
                  <li key={util.href}>
                    <Link href={util.href} className="hover:text-slate-700 transition" title={util.desc}>
                      {util.name}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/tools" className="hover:text-slate-700 transition font-medium">
                    전체 도구 모음 보기 →
                  </Link>
                </li>
              </ul>
            </div>

            <div className="md:col-span-2 space-y-2.5">
              <div className="font-bold text-slate-900 text-xs uppercase tracking-wider">약관 및 지원</div>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/terms" className="hover:text-slate-900 transition">서비스 이용약관</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-900 transition font-bold text-slate-700">개인정보처리방침</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 transition">고객지원 및 문의</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 PostSync (YM Labs). All rights reserved.</p>
            <p>본 사이트의 모든 연구 리포트와 가이드는 정보 제공을 목적으로 하며, 법률·세무·의료적 판단은 자문 전문가와 상의하시기 바랍니다.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
