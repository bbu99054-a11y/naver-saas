import type { Metadata } from 'next';
import Link from 'next/link';
import GoogleAdSlot from '@/components/monetization/GoogleAdSlot';
import EbookPromoCard from '@/components/monetization/EbookPromoCard';
import {
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Scale,
  Crop,
  Calculator,
  FileCode2,
  MapPin,
  QrCode,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: '무료 비즈니스 초소형 웹 유틸리티 허브 | PostSync Tools',
  description:
    '설치 없이 브라우저에서 1초 만에 업무를 해결하는 무료 초소형 웹툴 7종 모음. 네이버 플레이스 순위 조회기, 상세페이지 슬라이서, 전문직 광고 금칙어 스캐너, 자소서 바이트 계산기, HWPX 안심 뷰어, 캠페인 UTM & QR 빌더, 웹 포맷 변환기.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'PostSync 무료 비즈니스 초소형 웹 유틸리티 허브 (7대 웹툴)',
    description:
      '설치 제로, 가입 제로, 서버 전송 제로. 브라우저에서 즉시 구동되는 100% 무료 비즈니스 웹 유틸리티 7종 모음입니다.',
    url: 'https://www.postsyncapp.com/tools',
    siteName: 'PostSync Tools',
    locale: 'ko_KR',
    type: 'website',
  },
};

const TOOLS = [
  {
    id: 'place',
    title: '네이버 플레이스 실시간 순위 조회기',
    badge: '1위~75위 실시간 분석 (LIVE)',
    isLive: true,
    href: '/place',
    icon: MapPin,
    color: 'from-emerald-500 to-teal-600',
    borderGlow: 'border-2 border-emerald-600 shadow-md shadow-emerald-500/10 hover:shadow-xl',
    target: '소상공인 · 병원 · 식당 · 전문직',
    desc: '키워드와 상호명만 입력하면 네이버 스마트플레이스 1위부터 75위까지 내 매장의 실시간 노출 순위와 1페이지 진입률을 1초 만에 분석하고 진단 리포트를 제공합니다.',
    features: ['1위~75위 실시간 순위 추적', '1페이지 진입률 진단', '네이버 예약 연동 여부 점검'],
  },
  {
    id: 'crop',
    title: '이커머스 상세페이지 자동 분할 & 리사이징 스튜디오',
    badge: '무손실 1초 분할 (LIVE)',
    isLive: true,
    href: '/crop',
    icon: Crop,
    color: 'from-blue-600 to-indigo-600',
    borderGlow: 'border-2 border-blue-600 shadow-md shadow-blue-500/10 hover:shadow-xl',
    target: '스마트스토어 · 쿠팡 셀러 & 디자이너',
    desc: '20,000px 이상의 긴 상세페이지 이미지를 네이버(860px) 및 쿠팡(780px) 권장 너비로 자동 조절하고 3,000px 단위 무손실 슬라이싱 후 순서대로 ZIP 압축 다운로드합니다.',
    features: ['HTML5 Canvas 무손실 연산', 'ZIP 번들 즉시 생성', '서버 업로드 $0 무제한'],
  },
  {
    id: 'adcheck',
    title: '전문직 법정 광고 규정 & 금칙어 1초 스캐너',
    badge: '2026 법정 규정 완벽 대조 (LIVE)',
    isLive: true,
    href: '/adcheck',
    icon: Scale,
    color: 'from-violet-600 to-purple-600',
    borderGlow: 'border-2 border-violet-600 shadow-md shadow-violet-500/10 hover:shadow-xl',
    target: '변호사 · 의사 · 세무사 · 노무사 · 행정사',
    desc: '변호사법 제23조, 의료법 제56조 등 2026 법정 광고 규정을 실시간 대조하여 과태료 및 자격정지 리스크를 1초 만에 스캔하고 안전한 법률 대체어로 일괄 변환합니다.',
    features: ['100% 브라우저 메모리 연산', '준수도 100점 만점 산출', '원클릭 법률 안전 대체어 치환'],
  },
  {
    id: 'byte',
    title: '취업 포털별 자소서 글자수 & 바이트 정밀 계산기',
    badge: '사람인·잡코리아 3사 공식 로직 (LIVE)',
    isLive: true,
    href: '/byte',
    icon: Calculator,
    color: 'from-amber-500 to-orange-600',
    borderGlow: 'border-2 border-amber-600 shadow-md shadow-amber-500/10 hover:shadow-xl',
    target: '취업 준비생 · 이직자 · 공시생',
    desc: '사람인, 잡코리아, 인크루트의 상이한 바이트 계산 로직(EUC-KR 2바이트, UTF-8 3바이트, 엔터키 1/2바이트)을 탭별로 동시 비교 분석하고 키워드 밀도를 시각화합니다.',
    features: ['3대 채용 사이트 바이트 공식 지원', '키워드 반복 밀도 시각화', 'LocalStorage 실시간 자동 저장'],
  },
  {
    id: 'hwpx',
    title: '공공기관 HWPX 무설치 안심 뷰어 & 텍스트 변환기',
    badge: '100% 무설치 안심 열람 (LIVE)',
    isLive: true,
    href: '/hwpx',
    icon: FileCode2,
    color: 'from-pink-500 to-rose-600',
    borderGlow: 'border-2 border-pink-600 shadow-md shadow-pink-500/10 hover:shadow-xl',
    target: '공무원 · 연구원 · 수험생 · 기획자',
    desc: '한컴오피스 뷰어 설치 없이 공공기관 HWPX 문서를 브라우저 메모리에서 안전하게 압축 해제하여 표(Table)와 서식을 보존하며 마크다운 및 텍스트로 즉시 변환합니다.',
    features: ['서버 전송 $0 100% 로컬 보안', '표(Table) 마크다운 자동 변환', '이미지 및 텍스트 원클릭 복사'],
  },
  {
    id: 'utm',
    title: '한국형 마케팅 캠페인 UTM & 고화질 QR코드 빌더',
    badge: '원클릭 단축 & QR 생성 (LIVE)',
    isLive: true,
    href: '/utm',
    icon: QrCode,
    color: 'from-cyan-500 to-blue-600',
    borderGlow: 'border-2 border-cyan-600 shadow-md shadow-cyan-500/10 hover:shadow-xl',
    target: '퍼포먼스 마케터 · 인플루언서 · 오프라인 매장',
    desc: '네이버 블로그, 인스타그램, 당근마켓, 카카오톡 등 한국형 매체별 맞춤 파라미터 프리셋을 지원하며 인쇄용 고해상도 QR코드를 1초 만에 즉시 제작합니다.',
    features: ['한국형 주요 매체 프리셋 내장', '인쇄용 고화질 SVG/PNG QR 생성', '파라미터 즉시 복사 및 검증'],
  },
  {
    id: 'convert',
    title: 'ChatGPT·노션 ➔ 네이버 블로그 서식 1초 변환기',
    badge: '스마트에디터 ONE 서식 완벽 호환 (LIVE)',
    isLive: true,
    href: '/convert',
    icon: Layers,
    color: 'from-emerald-600 to-green-600',
    borderGlow: 'border-2 border-emerald-600 shadow-md shadow-emerald-500/10 hover:shadow-xl',
    target: '블로거 · 마케터 · 노션/ChatGPT 사용자',
    desc: 'ChatGPT, Claude, Notion에서 작성한 마크다운 및 표(Table)를 네이버 블로그 스마트에디터 ONE에 서식 깨짐 없이 원클릭 복사·붙여넣기할 수 있는 전용 클립보드 변환기입니다.',
    features: ['표(Table) & 소제목 서식 100% 보존', '1초 원클릭 HTML 클립보드 복사', '100% 브라우저 로컬 안전 연산'],
  },
];

export default function ToolsHubPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* 부드러운 라이트 글로우 배경 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/50 via-indigo-50/30 to-transparent blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* 상단 브레드크럼 */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-mono mb-8">
          <Link href="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-semibold">Tools Hub</span>
        </nav>

        {/* 히어로 영역 (토스 스타일 클린 헤드라인) */}
        <div className="text-center space-y-4 mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>PostSync 초소형 유틸리티 웹 소프트웨어 허브</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            업무 생산성을 10배 높이는 <br className="hidden sm:inline" />
            <span className="text-blue-600">무료 초소형 웹 유틸리티</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            복잡한 회원가입도, 소프트웨어 설치도 없습니다. <br className="hidden sm:inline" />
            브라우저 메모리상에서 100% 로컬 연산되어 <strong>서버 전송 비용 $0</strong>, <strong>개인정보 유출 리스크 $0</strong>를 보장합니다.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 font-mono pt-2">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-1.5 text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% 무료 무제한
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-1.5 text-blue-700 font-semibold">
              <Lock className="w-4 h-4 text-blue-600" /> 서버 저장 없는 로컬 처리
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center gap-1.5 text-indigo-700 font-semibold">
              <Zap className="w-4 h-4 text-indigo-600" /> 1초 즉시 연산
            </span>
          </div>
        </div>

        {/* 상단 반응형 애드센스 슬롯 */}
        <GoogleAdSlot adFormat="horizontal" className="mb-12 max-w-[728px] mx-auto" />

        {/* 5대 유틸리티 툴 카드 그리드 (토스 스타일 카드) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`group rounded-3xl p-7 md:p-8 bg-white transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${
                  tool.isLive
                    ? `${tool.borderGlow} hover:-translate-y-1`
                    : `${tool.borderGlow} hover:border-slate-300`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center bg-gradient-to-br ${tool.color} text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${
                        tool.isLive
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}
                    >
                      {tool.badge}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-blue-600 mb-1 font-mono tracking-tight">{tool.target}</div>
                  <h2 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-600 transition">
                    {tool.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                    {tool.desc}
                  </p>

                  {/* 세부 특징 태그 */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tool.features.map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 font-mono"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 링크 액션 */}
                <div>
                  {tool.isLive ? (
                    <Link
                      href={tool.href}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                    >
                      <span>지금 바로 무료 진단하기</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                    </Link>
                  ) : (
                    <div className="w-full py-3 px-4 rounded-xl font-medium text-xs bg-slate-100 text-slate-400 text-center border border-slate-200">
                      정식 런칭 준비 중입니다 (Coming Soon)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 2026 전문직 마케팅 PDF 전자책 프로모션 카드 */}
        <div className="mb-12">
          <EbookPromoCard toolSource="tools_hub" />
        </div>

        {/* B2B SaaS 메인 전환 배너 (토스 스타일 로열 블루 카드) */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 md:p-11 shadow-lg text-white relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" /> POSTSYNC AI SAAS
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                전문직 마케팅 자동화의 완전한 무인화 솔루션
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl leading-relaxed">
                PostSync AI는 단순한 웹툴을 넘어, 변호사·의사·세무사의 네이버 블로그 스마트블록 상위 노출 원고 작성부터
                Playwright 원클릭 예약 발행, 스레드 요약 배포, 크몽/카페 실시간 의뢰 감지까지 전 과정을 자동화합니다.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-shrink-0">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-slate-100 text-blue-600 shadow-md transition text-center flex items-center justify-center gap-2"
              >
                <span>3회 무료 체험 시작</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/pricing"
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition text-center flex items-center justify-center gap-1.5"
              >
                <span>요금제 보기</span>
                <ExternalLink className="w-3 h-3 text-white" />
              </Link>
            </div>
          </div>
        </div>

        {/* 하단 반응형 멀티플렉스 애드센스 슬롯 */}
        <GoogleAdSlot adFormat="auto" className="mt-12" />

        {/* 푸터 */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <p>© 2026 PostSync Tools. Zero Server Cost, High Speed Micro Utility Web Engine.</p>
          <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-mono">
            <Link href="/privacy" className="hover:text-slate-900 transition">개인정보처리방침</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-slate-900 transition">이용약관</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-slate-900 transition">고객지원</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
