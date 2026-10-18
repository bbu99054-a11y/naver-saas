import type { Metadata } from 'next'
import Link from 'next/link'
import {
  BookOpen,
  MapPin,
  Scale,
  Crop,
  Calculator,
  FileCode2,
  QrCode,
  Layers,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  FileText,
  Clock,
  ChevronRight,
  Search,
  BarChart3,
  AlertTriangle,
  Lock,
  Building2,
  HelpCircle
} from 'lucide-react'
import { blogPosts } from '@/lib/blogData'

export const metadata: Metadata = {
  title: 'PostSync - 비즈니스 마케팅 데이터 연구소 & 무료 웹 유틸리티 포털',
  description:
    '2026 네이버 스마트플레이스 노출 알고리즘(NPlaceRank) 정량 분석 칼럼, C-Rank·AI 브리핑 검색 최적화 리포트, 전문직 광고 컴플라이언스 백서 및 100% 무료 비즈니스 웹 유틸리티 7종을 제공하는 데이터 미디어 허브입니다.',
  alternates: {
    canonical: 'https://www.postsyncapp.com',
  },
  openGraph: {
    title: 'PostSync - 비즈니스 마케팅 데이터 연구소 & 무료 웹 유틸리티 포털',
    description:
      '네이버 스마트플레이스 실시간 순위 분석, 2026 검색 알고리즘 심층 칼럼, 법정 광고 금칙어 스캐너 등 실무자를 위한 데이터 리포트와 무료 웹툴 7종을 제공합니다.',
    url: 'https://www.postsyncapp.com',
    siteName: 'PostSync',
    locale: 'ko_KR',
    type: 'website',
  },
}

const FREE_WEB_TOOLS = [
  {
    id: 'place',
    name: '네이버 스마트플레이스 실시간 순위 조회기',
    href: '/place',
    badge: '실시간 1위~75위 추적',
    target: '소상공인 · 병의원 · 로컬 매장 · 전문직',
    desc: '검색 키워드와 상호명만 입력하면 네이버 플레이스 1위부터 75위까지 실시간 노출 순위와 1페이지 진입률, 1위 경쟁 매장과의 정량 지표 격차를 1초 만에 분석합니다.',
    icon: MapPin,
    accent: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  },
  {
    id: 'adcheck',
    name: '전문직 법정 광고 규정 & 금칙어 1초 스캐너',
    href: '/adcheck',
    badge: '2026 법정 심의 기준',
    target: '변호사 · 의사 · 세무사 · 노무사 · 마케터',
    desc: '변호사법 제23조, 의료법 제56조, 세무사법 제12조 및 표시광고법상 금지된 과장·보장성 단어를 브라우저에서 즉시 검출하고 합법적인 대체 문구를 제안합니다.',
    icon: Scale,
    accent: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    btnClass: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  },
  {
    id: 'convert',
    name: 'ChatGPT·노션 ➔ 네이버 블로그 서식 1초 변환기',
    href: '/convert',
    badge: '스마트에디터 ONE 호환',
    target: '블로그 운영자 · 콘텐츠 마케터 · 에디터',
    desc: 'ChatGPT, Claude, Notion에서 작성한 마크다운 원고와 비교 표(Table)를 네이버 블로그 스마트에디터 ONE에 서식 깨짐 없이 원클릭으로 붙여넣을 수 있도록 변환합니다.',
    icon: Layers,
    accent: 'text-teal-700 bg-teal-50 border-teal-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
  {
    id: 'crop',
    name: '이커머스 상세페이지 자동 분할 & 리사이징 스튜디오',
    href: '/crop',
    badge: '무손실 캔버스 연산',
    target: '스마트스토어 · 쿠팡 셀러 · 웹 디자이너',
    desc: '세로로 긴 고해상도 상세페이지 이미지를 스마트스토어(860px) 및 쿠팡(780px) 권장 규격에 맞춰 자동 리사이징하고 무손실 분할 후 ZIP 파일로 즉시 압축합니다.',
    icon: Crop,
    accent: 'text-blue-700 bg-blue-50 border-blue-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
  {
    id: 'byte',
    name: '취업 포털별 자소서 글자수 & 바이트 정밀 계산기',
    href: '/byte',
    badge: '3대 채용포털 공식 로직',
    target: '취업 준비생 · 인사 담당자 · 카피라이터',
    desc: '사람인, 잡코리아, 인크루트 등 채용 플랫폼마다 상이한 바이트(EUC-KR/UTF-8, 줄바꿈 바이트) 계산 공식을 동시에 비교하고 핵심 키워드 반복 밀도를 분석합니다.',
    icon: Calculator,
    accent: 'text-amber-700 bg-amber-50 border-amber-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
  {
    id: 'hwpx',
    name: '공공기관 HWPX 무설치 안심 뷰어 & 텍스트 추출기',
    href: '/hwpx',
    badge: '100% 브라우저 로컬 해독',
    target: '연구원 · 기획자 · 공무원 · 수험생',
    desc: '별도의 뷰어 프로그램 설치나 외부 서버 업로드 없이 공공기관 HWPX 문서를 브라우저 메모리에서 안전하게 열어 본문 텍스트와 표 구조를 즉시 추출합니다.',
    icon: FileCode2,
    accent: 'text-rose-700 bg-rose-50 border-rose-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
  {
    id: 'utm',
    name: '한국형 마케팅 캠페인 UTM 파라미터 & 고화질 QR 빌더',
    href: '/utm',
    badge: '국내 매체 프리셋 내장',
    target: '퍼포먼스 마케터 · 오프라인 매장 운영자',
    desc: '네이버 블로그, 인스타그램, 당근마켓, 카카오 채널 등 국내 주요 매체별 UTM 추적 링크를 규격화하여 생성하고 인쇄용 고해상도 PNG/SVG QR코드를 즉시 제작합니다.',
    icon: QrCode,
    accent: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    btnClass: 'bg-slate-900 hover:bg-slate-800 text-white',
  },
]

const EDITORIAL_FAQS = [
  {
    q: 'PostSync 비즈니스 마케팅 데이터 연구소는 어떤 정보와 도구를 제공하나요?',
    a: 'PostSync(와이엠랩스 운영)는 2026년 네이버 스마트플레이스 노출 알고리즘(NPlaceRank), 블로그 C-Rank 및 D.I.A.+ 문서 품질 평가 모델, 생성형 AI 검색(GEO · 네이버 AI 브리핑) 인용 구조를 연구하여 실무 칼럼으로 발행하는 디지털 마케팅 전문 미디어입니다. 아울러 마케터와 소상공인, 전문직 종사자가 회원가입이나 프로그램 설치 없이 브라우저에서 즉시 사용할 수 있는 7종의 무료 웹 유틸리티(/place, /adcheck, /convert, /crop, /byte, /hwpx, /utm)를 무상으로 개방하고 있습니다.',
  },
  {
    q: '네이버 스마트플레이스 순위가 갑자기 하락했을 때 가장 먼저 점검해야 할 지표는 무엇인가요?',
    a: '2026년 플레이스 노출 순위 하락의 3대 핵심 원인은 ① 최근 14일 이내 실제 길찾기·저장하기·예약 등 진성 행동 지표(체류 및 전환 시그널)의 상대적 감소, ② 경쟁 매장의 신규 영수증 리뷰 및 키워드 매칭 상세설명 업데이트에 따른 최신성(Freshness) 격차 발생, ③ 불법 트래픽 슬롯이나 동일 IP 반복 클릭 등 인위적 조작 시도로 인한 알고리즘 어뷰징 필터링(가중치 차감)입니다. 실시간 순위 조회기(/place)를 통해 1위~5위 경쟁 매장과 방문자 리뷰·블로그 리뷰·상세설명 키워드 밀도 격차를 정량적으로 먼저 대조해야 합니다.',
  },
  {
    q: '전문직(변호사·병의원·세무사·노무사) 블로그 운영 시 가장 빈번하게 적발되는 법정 광고 위반 사례는 무엇인가요?',
    a: '대표적인 위반 유형은 ① 객관적 근거 없는 최상급·유일성 표방("국내 최고", "지역 1위", "유일한 전문"), ② 결과 단정 및 보장성 문구("100% 승소 보장", "기각 시 전액 환불", "완치 보장", "부작용 없는 시술"), ③ 부당한 가격 유인 및 비로그인 공간의 환자 치료경험담 게시 등입니다. 원고 발행 전 반드시 2026 광고법 공식 지침서(/guide/ad-law-2026)와 금칙어 1초 스캐너(/adcheck)를 통해 위반 소지가 있는 단어를 합법적인 절차 안내 및 판례·의학 정보 중심 표현으로 치환해야 합니다.',
  },
  {
    q: '제공되는 7종의 웹 유틸리티에 입력한 매장 정보나 원고 데이터가 외부 서버에 저장되나요?',
    a: '저장되지 않습니다. 광고 금칙어 스캐너(/adcheck), 상세페이지 분할 스튜디오(/crop), 자소서 바이트 계산기(/byte), HWPX 뷰어(/hwpx), 블로그 서식 변환기(/convert), UTM 빌더(/utm)는 사용자 기기의 웹 브라우저 메모리(Client-side) 내에서만 연산이 이루어지며 외부 서버로 원고나 파일을 전송하지 않습니다. 플레이스 실시간 순위 조회기(/place) 또한 입력하신 검색어에 대한 공개 검색 결과 순위만을 실시간 조회하여 화면에 표시합니다.',
  },
  {
    q: '2026년 네이버 AI 브리핑과 구글 AI 개요(AI Overviews)에 내 블로그 글이 인용되게 하려면 어떻게 작성해야 하나요?',
    a: '생성형 검색 엔진(GEO)은 모호한 인사말이나 감성적인 서론이 긴 문서를 인용 대상에서 배제합니다. 본문 첫 문단 2~3줄 이내에 사용자의 질문에 대한 명확한 결론과 수치를 먼저 제시하는 두괄식(Answer-First) 구조를 채택해야 하며, 본문 내에 비교 표(Table), 단계별 체크리스트, 관련 법령 조항이나 통계 출처를 구조화하여 배치할 때 AI 인용 확률과 스마트블록 상위 노출 유지력이 크게 높아집니다.',
  },
]

export default function HomePage() {
  const placePosts = blogPosts.filter((p) => p.categoryLabel === '스마트플레이스')
  const complianceAndSeoPosts = blogPosts.filter((p) => p.categoryLabel !== '스마트플레이스')

  const featuredPosts = [
    blogPosts.find((p) => p.slug === 'naver-place-rank-algorithm-2026') || placePosts[0],
    blogPosts.find((p) => p.slug === 'naver-place-rank-checker-free') || complianceAndSeoPosts[0],
  ].filter(Boolean)

  const curatedPlacePosts = placePosts.slice(0, 6)
  const curatedProfessionalPosts = complianceAndSeoPosts.slice(0, 9)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://www.postsyncapp.com/#website',
        url: 'https://www.postsyncapp.com',
        name: 'PostSync 비즈니스 마케팅 데이터 연구소',
        description:
          '2026 네이버 스마트플레이스 알고리즘 분석, 검색 최적화(SEO/GEO) 칼럼, 전문직 광고 컴플라이언스 가이드 및 무료 비즈니스 웹 유틸리티 7종 포털',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. 최상단 플레이스 순위 조회 다이렉트 안내 배너 */}
      <div className="bg-slate-900 text-white border-b border-slate-800 px-4 py-2.5 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold text-[11px]">
              LIVE UTILITY
            </span>
            <span className="text-slate-200 font-medium">
              네이버 스마트플레이스 1위~75위 실시간 노출 순위 및 경쟁사 정량 비교 진단기 무료 가동 중
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/place"
              className="inline-flex items-center gap-1 font-extrabold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition"
            >
              <span>플레이스 실시간 순위 조회 바로가기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1 font-bold text-slate-300 hover:text-white transition"
            >
              <span>무료 웹툴 7종 허브</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. 상단 글로벌 네비게이션 헤더 */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-xs group-hover:bg-blue-700 transition">
                P
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-black tracking-tight text-slate-900">PostSync</span>
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    DATA LAB
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none mt-0.5">
                  비즈니스 마케팅 데이터 연구소 &amp; 웹 유틸리티
                </p>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-600">
              <Link href="/blog" className="hover:text-blue-600 transition">
                인사이트 칼럼 ({blogPosts.length})
              </Link>
              <Link href="/tools" className="hover:text-blue-600 transition">
                무료 웹툴 7종
              </Link>
              <Link href="/place" className="text-emerald-700 hover:text-emerald-800 transition flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>플레이스 순위 조회</span>
              </Link>
              <Link href="/adcheck" className="hover:text-blue-600 transition">
                광고법 금칙어 스캐너
              </Link>
              <Link href="/guide/ad-law-2026" className="hover:text-blue-600 transition">
                2026 광고법 공식 백서
              </Link>
              <Link href="/contact" className="hover:text-blue-600 transition">
                고객지원
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/blog"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span>전체 칼럼 열람</span>
            </Link>
            <Link
              href="/place"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition"
            >
              <Search className="w-3.5 h-3.5" />
              <span>플레이스 순위 1초 조회</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-16">
        {/* 3. 히어로 섹션: 마케팅 미디어 & 무료 웹툴 포털 정의 (Answer-First) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>2026 검색 알고리즘 &amp; 로컬 마케팅 실증 데이터 리포트</span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.22]">
                데이터로 검증하는 로컬 비즈니스 성장과 <br className="hidden sm:inline" />
                <span className="text-blue-600">검색 최적화(SEO·GEO) 실무 지식 허브</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
                PostSync 데이터 연구소는 카더라식 마케팅 속설을 배제합니다. 2026년 네이버 스마트플레이스 노출 알고리즘(<strong>NPlaceRank</strong>), 블로그 <strong>C-Rank · D.I.A.+</strong> 문서 품질 모델, 생성형 AI 검색(<strong>AI 브리핑</strong>) 인용 원리 및 전문직 법정 광고 규정을 정량적으로 분석한 <strong>{blogPosts.length}편의 심층 리포트</strong>와 <strong>7종의 무설치 웹 유틸리티</strong>를 무료로 제공합니다.
              </p>

              {/* 핵심 바로가기 액션 버튼 그룹 */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/place"
                  className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-sm transition inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>스마트플레이스 실시간 순위 조회하기</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/blog"
                  className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow-sm transition inline-flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>마케팅 연구 칼럼 전체보기 ({blogPosts.length}편)</span>
                </Link>
                <Link
                  href="/tools"
                  className="px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition inline-flex items-center gap-1.5"
                >
                  <span>무료 웹툴 7종 모음</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block">발행된 연구 아티클</span>
                  <strong className="text-slate-900 text-base font-black">{blogPosts.length}편 전문 수록</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">무료 비즈니스 웹툴</span>
                  <strong className="text-slate-900 text-base font-black">7종 무설치 구동</strong>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block">법정 광고 심의 기준</span>
                  <strong className="text-slate-900 text-base font-black">2026 개정법 반영</strong>
                </div>
              </div>
            </div>

            {/* 우측: 핵심 유틸리티 & 필독 백서 퀵 액세스 패널 */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  실무자 최다 활용 도구 &amp; 공식 지침서
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  100% 무료 개방
                </span>
              </div>

              <div className="space-y-2.5">
                <Link
                  href="/place"
                  className="block p-3.5 rounded-xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-xs transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-emerald-700">로컬 매장 · 병의원 · 전문직 필수</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 mt-0.5">
                    네이버 스마트플레이스 1위~75위 실시간 순위 조회기
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    키워드별 실시간 노출 순위 및 1위 매장과의 리뷰·저장수 정량 비교
                  </p>
                </Link>

                <Link
                  href="/adcheck"
                  className="block p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-indigo-700">변호사 · 의료 · 세무 광고 심의 대비</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-700 mt-0.5">
                    전문직 법정 광고 규정 &amp; 금칙어 1초 스캐너
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    과태료 및 행정처분 위험 단어 즉시 검출 및 합법 대체어 원클릭 변환
                  </p>
                </Link>

                <Link
                  href="/guide/ad-law-2026"
                  className="block p-3.5 rounded-xl bg-white border border-slate-200 hover:border-blue-500 hover:shadow-xs transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-blue-700">문서번호 PSK-2026-LAW-01</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 group-hover:text-blue-700 mt-0.5">
                    2026 전문직 온라인 광고 규정 &amp; AI 검색 대응 공식 백서
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    20대 핵심 금지어 사전 및 네이버 AI 브리핑 인용 최적화 매뉴얼
                  </p>
                </Link>

                <Link
                  href="/convert"
                  className="block p-3.5 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-xs transition group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-teal-700">블로그 에디터 생산성 도구</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 group-hover:translate-x-0.5 transition" />
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 group-hover:text-teal-700 mt-0.5">
                    ChatGPT·노션 마크다운 ➔ 네이버 스마트에디터 서식 변환기
                  </div>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                    표(Table)와 인용구, 소제목 스타일 깨짐 없는 원클릭 클립보드 복사
                  </p>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 에디터 추천 심층 리포트 (Featured Deep-Dive Columns) */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
                FEATURED RESEARCH REPORTS
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                2026 검색 알고리즘 &amp; 로컬 마케팅 핵심 분석 리포트
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-extrabold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              <span>전체 연구 칼럼 아카이브 ({blogPosts.length}편)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* 대표 심층 칼럼 2선 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {featuredPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:border-blue-400 transition flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-extrabold">
                      {post.categoryLabel} 심층 리포트
                    </span>
                    <div className="flex items-center gap-3 text-slate-500 font-medium">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition">
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {post.excerpt}
                  </p>

                  {post.badge && (
                    <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800">핵심 주제 분류: {post.badge}</span>
                      <span className="text-blue-600 font-bold">Answer-First 구조 적용</span>
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-semibold">
                    집필: {post.author}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-xs font-extrabold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                  >
                    <span>전문 열람하기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* 카테고리 1: 스마트플레이스 노출 알고리즘 & 순위 복구 실전 시리즈 */}
          <div className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>스마트플레이스 노출 알고리즘(NPlaceRank) &amp; 순위 관리 실전 가이드</span>
              </h3>
              <Link href="/place" className="text-xs font-extrabold text-emerald-700 hover:underline">
                내 매장 순위 먼저 조회하기 →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {curatedPlacePosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-emerald-500 hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-2">
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {post.categoryLabel}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-emerald-700 transition">
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-slate-800 hover:text-emerald-700 inline-flex items-center gap-1"
                    >
                      <span>칼럼 읽기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* 카테고리 2: 전문직 법정 광고 규정 준수 & 블로그 C-Rank 최적화 시리즈 */}
          <div className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                <span>전문직(변호사·병의원·세무·노무) 광고 컴플라이언스 &amp; C-Rank 칼럼</span>
              </h3>
              <Link href="/adcheck" className="text-xs font-extrabold text-indigo-700 hover:underline">
                광고법 금칙어 스캐너 실행 →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {curatedProfessionalPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-indigo-500 hover:shadow-xs transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500 mb-2">
                      <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {post.categoryLabel}
                      </span>
                      <span>{post.readTime}</span>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug mb-2">
                      <Link href={`/blog/${post.slug}`} className="hover:text-indigo-700 transition">
                        {post.title}
                      </Link>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{post.date}</span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-bold text-slate-800 hover:text-indigo-700 inline-flex items-center gap-1"
                    >
                      <span>칼럼 읽기</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 5. 본문 내장 정량 데이터 브리핑 (AdSense 크롤러 및 독자를 위한 고유 텍스트/표 아카이브) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="space-y-2 border-b border-slate-200 pb-5">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              2026 SEARCH &amp; COMPLIANCE DATA BRIEFING
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              2026 네이버 검색 노출 알고리즘 및 법정 광고 심의 핵심 기준표
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              로컬 비즈니스와 전문직 사무소가 온라인 마케팅을 집행할 때 반드시 숙지해야 할 <strong>스마트플레이스 4대 랭킹 요소</strong>와 <strong>직역별 법정 광고 금지 규정</strong>을 한눈에 대조할 수 있도록 정리한 표준 레퍼런스입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 표 1: 스마트플레이스 NPlaceRank 4대 요소 */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>[표 1] 2026 스마트플레이스(NPlaceRank) 4대 평가 지표 및 관리 기준</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                네이버 스마트플레이스 검색 결과는 단순 리뷰 개수가 아니라 <strong>연관도(Relevance), 인기도(Popularity), 신뢰도(Trust), 최신성(Freshness)</strong>의 복합 가중치로 산출됩니다.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-extrabold">평가 영역</th>
                      <th className="py-2.5 px-3 font-extrabold">세부 반영 시그널</th>
                      <th className="py-2.5 px-3 font-extrabold">실무 최적화 핵심 액션</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">연관도 (Relevance)</td>
                      <td className="py-2.5 px-3">대표 키워드 5개, 상세설명 텍스트, 메뉴/진료과목명 일치도</td>
                      <td className="py-2.5 px-3">지역명+핵심 업종 키워드를 상세설명 첫 3줄 내 자연스럽게 배치</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">인기도 (Popularity)</td>
                      <td className="py-2.5 px-3">실사용자 저장하기, 길찾기 실행, 전화 걸기, 네이버 예약 전환율</td>
                      <td className="py-2.5 px-3">매장 내 고화질 QR(/utm) 비치로 실방문객의 자발적 저장 및 쿠폰 유도</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">신뢰도 (Trust)</td>
                      <td className="py-2.5 px-3">영수증 실결제 리뷰 비율, 외부 블로그 진성 후기, 어뷰징 클린 지수</td>
                      <td className="py-2.5 px-3">불법 트래픽 슬롯 절대 금지 및 사진 포함 실결제 영수증 리뷰 확보</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">최신성 (Freshness)</td>
                      <td className="py-2.5 px-3">최근 7~14일 내 새소식 공지, 신규 사진 업로드, 리뷰 답글 주기</td>
                      <td className="py-2.5 px-3">주 2회 이상 새소식 발행 및 영업시간·휴무일 정보 상시 최신화</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 표 2: 전문직 4대 직역 법정 광고 컴플라이언스 요약 */}
            <div className="space-y-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>[표 2] 전문직 직역별 온라인 광고 근거 법령 및 원천 금지 표현</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                전문직 광고는 일반 상업 광고와 달리 <strong>개별 법률과 소속 협회의 엄격한 사전·사후 심의</strong>를 받으며, 대행사 과실이라도 법적 처벌은 사업주 본인에게 귀속됩니다.
              </p>
              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 font-extrabold">직역 구분</th>
                      <th className="py-2.5 px-3 font-extrabold">적용 법령</th>
                      <th className="py-2.5 px-3 font-extrabold text-rose-700">대표 금지 문구</th>
                      <th className="py-2.5 px-3 font-extrabold text-emerald-700">권장 대체 방향</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">변호사 · 법무법인</td>
                      <td className="py-2.5 px-3">변호사법 제23조</td>
                      <td className="py-2.5 px-3 text-rose-700 font-semibold">100% 승소, 최고/유일, 전관예우 암시</td>
                      <td className="py-2.5 px-3">대법원 판례 법리 분석 및 절차 안내, 광고책임변호사 명시</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">병의원 · 치과 · 한의원</td>
                      <td className="py-2.5 px-3">의료법 제56조</td>
                      <td className="py-2.5 px-3 text-rose-700 font-semibold">완치 보장, 부작용 없는, 비로그인 치료후기</td>
                      <td className="py-2.5 px-3">질환 원인·예방 수칙, 시술 원리 및 발생 가능 부작용 고지</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">세무사 · 회계사</td>
                      <td className="py-2.5 px-3">세무사법 제12조</td>
                      <td className="py-2.5 px-3 text-rose-700 font-semibold">환급률 1위, 조건 없는 평균 환급액, 무료/최저가</td>
                      <td className="py-2.5 px-3">개정 세법 해설, 적법한 공제·감면 요건 체크리스트 제시</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-bold text-slate-900">노무사 · 행정사</td>
                      <td className="py-2.5 px-3">공인노무사법·행정사법</td>
                      <td className="py-2.5 px-3 text-rose-700 font-semibold">100% 구제/인가 장담, 공무원 사적 연고 선전</td>
                      <td className="py-2.5 px-3">노동위원회 판정 사례, 인허가 구비 서류 및 법정 요건 설명</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 6. 무료 비즈니스 웹 유틸리티 7종 전체 섹션 */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">
                FREE BUSINESS WEB UTILITIES (7 TOOLS)
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                설치·가입 없이 브라우저에서 즉시 작동하는 무료 웹 유틸리티 7종
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                모든 유틸리티는 별도의 프로그램 설치나 회원가입을 요구하지 않으며, 브라우저 로컬 메모리 연산을 통해 개인정보와 문서를 안전하게 보호합니다.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs sm:text-sm font-extrabold text-slate-800 hover:text-blue-600 inline-flex items-center gap-1 shrink-0"
            >
              <span>유틸리티 허브 자세히 보기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FREE_WEB_TOOLS.map((tool) => {
              const Icon = tool.icon
              return (
                <div
                  key={tool.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 transition flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${tool.accent}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${tool.accent}`}>
                        {tool.badge}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-slate-400">{tool.target}</div>
                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      <Link href={tool.href} className="hover:text-blue-600 transition">
                        {tool.name}
                      </Link>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100">
                    <Link
                      href={tool.href}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${tool.btnClass}`}
                    >
                      <span>무료 도구 실행하기</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 7. 상시 오픈형 FAQ 섹션 (크롤러 100% 색인 보장) */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              <span>비즈니스 마케팅 연구소 및 무료 웹툴 이용 안내 (FAQ)</span>
            </h2>
          </div>

          <div className="space-y-4">
            {EDITORIAL_FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-start gap-2">
                  <span className="text-blue-600 font-black shrink-0">Q{idx + 1}.</span>
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 8. 글로벌 푸터 (사업자 정보 및 법적 고지 100% 투명 공개) */}
      <footer className="bg-white border-t border-slate-200 mt-16 py-12 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
                  P
                </div>
                <span className="text-base font-black text-slate-900">PostSync 비즈니스 마케팅 데이터 연구소</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                PostSync(와이엠랩스 운영)는 2026 네이버 스마트플레이스 노출 알고리즘, 검색 최적화(SEO/GEO), 전문직 법정 광고 컴플라이언스를 연구하는 비즈니스 미디어이자 무료 초소형 웹 유틸리티 포털입니다.
              </p>
              <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                <p>상호명: 와이엠랩스 (YM Labs) | 대표자: 유영무 | 사업자등록번호: 736-48-01186</p>
                <p>사업장 소재지: 서울특별시 송파구 송파대로 345, 103동 204호 | 고객지원 및 제휴 문의: support@postsyncapp.com</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">무료 웹 유틸리티 7종</div>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/place" className="hover:text-slate-900 transition">네이버 플레이스 실시간 순위 조회기</Link></li>
                <li><Link href="/adcheck" className="hover:text-slate-900 transition">전문직 광고 금칙어 1초 스캐너</Link></li>
                <li><Link href="/convert" className="hover:text-slate-900 transition">네이버 블로그 스마트에디터 서식 변환기</Link></li>
                <li><Link href="/crop" className="hover:text-slate-900 transition">상세페이지 자동 분할 &amp; 리사이징</Link></li>
                <li><Link href="/byte" className="hover:text-slate-900 transition">취업 포털별 자소서 바이트 계산기</Link></li>
                <li><Link href="/hwpx" className="hover:text-slate-900 transition">공공기관 HWPX 무설치 안심 뷰어</Link></li>
                <li><Link href="/utm" className="hover:text-slate-900 transition">한국형 마케팅 UTM &amp; QR코드 빌더</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <div className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">리서치 &amp; 약관 안내</div>
              <ul className="space-y-1.5 text-xs">
                <li><Link href="/blog" className="hover:text-slate-900 transition">마케팅 인사이트 칼럼 ({blogPosts.length}편)</Link></li>
                <li><Link href="/guide/ad-law-2026" className="hover:text-slate-900 transition">2026 전문직 광고 규정 공식 백서</Link></li>
                <li><Link href="/tools" className="hover:text-slate-900 transition">무료 비즈니스 웹툴 허브</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900 transition">서비스 이용약관</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-900 transition font-bold text-slate-700">개인정보처리방침</Link></li>
                <li><Link href="/contact" className="hover:text-slate-900 transition">고객지원 및 문의처</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© 2026 PostSync (YM Labs). All rights reserved.</p>
            <p>본 사이트의 모든 연구 리포트와 가이드는 정보 제공을 목적으로 하며, 법률·세무·의료적 최종 판단은 자문 전문가와 상의하시기 바랍니다.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
