import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Scale,
  Crop,
  Calculator,
  FileCode2,
  Coins,
  Sparkles,
  Lock,
  ExternalLink,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: '무료 비즈니스 초소형 웹 유틸리티 허브 | PostSync Tools',
  description:
    '설치 없이 브라우저에서 1초 만에 업무를 해결하는 무료 초소형 웹툴 모음. 전문직 광고 금칙어 스캐너, 상세페이지 자동 분할기, 플랫폼별 바이트 계산기, HWPX 파서.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'PostSync 무료 비즈니스 초소형 웹 유틸리티 허브',
    description:
      '설치 제로, 가입 제로, 서버 전송 제로. 브라우저에서 즉시 구동되는 100% 무료 비즈니스 웹 유틸리티 모음입니다.',
    url: 'https://www.postsyncapp.com/tools',
    siteName: 'PostSync Tools',
    locale: 'ko_KR',
    type: 'website',
  },
};

const TOOLS = [
  {
    id: 'adcheck',
    title: '전문직 법정 광고 금칙어 1초 스캐너',
    badge: '1호 킬러 툴 (LIVE)',
    isLive: true,
    href: '/tools/adcheck',
    icon: Scale,
    color: 'from-blue-600 to-indigo-600',
    borderGlow: 'border-2 border-blue-600 shadow-md shadow-blue-500/10 hover:shadow-xl',
    target: '변호사 · 의사 · 세무사 · 노무사 · 행정사',
    desc: '변호사법 제23조, 의료법 제56조 등 2026 법정 광고 규정을 실시간 대조하여 과태료 및 자격정지 리스크를 1초 만에 스캔하고 안전한 법률 대체어로 일괄 변환합니다.',
    features: ['100% 브라우저 메모리 연산', '준수도 100점 만점 산출', '원클릭 법률 안전 대체어 치환'],
  },
  {
    id: 'crop',
    title: '이커머스 상세페이지 자동 분할 & 리사이징 스튜디오',
    badge: '출시 예정',
    isLive: false,
    href: '#',
    icon: Crop,
    color: 'from-emerald-500 to-teal-600',
    borderGlow: 'border border-slate-200/90 shadow-sm',
    target: '스마트스토어 · 쿠팡 셀러 & 디자이너',
    desc: '20,000px 이상의 긴 상세페이지 이미지를 네이버(860px) 및 쿠팡(780px) 권장 너비로 자동 조절하고 3,000px 단위 무손실 슬라이싱 후 순서대로 ZIP 압축 다운로드합니다.',
    features: ['HTML5 Canvas 무손실 연산', 'ZIP 번들 즉시 생성', '서버 업로드 $0 무제한'],
  },
  {
    id: 'counter',
    title: '채용 플랫폼별 자소서 글자수 · 바이트 정밀 계산기',
    badge: '출시 예정',
    isLive: false,
    href: '#',
    icon: Calculator,
    color: 'from-amber-500 to-orange-600',
    borderGlow: 'border border-slate-200/90 shadow-sm',
    target: '취업 준비생 · 이직자 · 공시생',
    desc: '사람인, 잡코리아, 인크루트의 상이한 바이트 계산 로직(EUC-KR 2바이트, UTF-8 3바이트, 엔터키 1/2바이트)을 탭별로 동시 비교 분석하고 자동 임시 저장합니다.',
    features: ['3대 채용 사이트 바이트 완벽 지원', 'LocalStorage 자동 저장', '맞춤법/문장 가독성 분석'],
  },
  {
    id: 'hwpx',
    title: '공공문서 안심 HWPX to Markdown / TXT 변환기',
    badge: '출시 예정',
    isLive: false,
    href: '#',
    icon: FileCode2,
    color: 'from-purple-500 to-pink-600',
    borderGlow: 'border border-slate-200/90 shadow-sm',
    target: '공무원 · 연구원 · 수험생 · 개발자',
    desc: '별도 한컴오피스 뷰어 설치 없이 HWPX 파일을 웹 브라우저 메모리상에서 압축 해제하여 표와 본문 텍스트를 마크다운이나 텍스트 파일로 구조화해 즉시 복사합니다.',
    features: ['100% 로컬 프라이버시 처리', '표(Table) 마크다운 변환', '무설치 즉시 열람'],
  },
  {
    id: 'wage',
    title: '주휴수당 & 4대보험 실수령액 시뮬레이터',
    badge: '출시 예정',
    isLive: false,
    href: '#',
    icon: Coins,
    color: 'from-cyan-500 to-blue-600',
    borderGlow: 'border border-slate-200/90 shadow-sm',
    target: '단기 근로자 · 아르바이트생 · 소상공인 사업주',
    desc: '시급과 근로시간 입력 시 주 15시간 이상 여부를 판별하여 주휴수당 발생 여부와 실질 시급을 계산하고, 간이세액표 및 4대보험 공제 후 실수령액을 직관적으로 도출합니다.',
    features: ['최신 노무·세무 개정안 반영', '주휴수당 자동 산입 시급', '슬라이더 인터페이스'],
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

        {/* CLS 방지용 표준 광고 컨테이너 (라이트) */}
        <div className="w-full min-h-[90px] flex flex-col items-center justify-center p-3 mb-12 rounded-2xl bg-white border border-dashed border-slate-300 text-center relative overflow-hidden shadow-xs">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 mb-1">SPONSORED ADVERTISEMENT</span>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            <span>Google AdSense 공식 검증 광고 슬롯 (라이트 테마 최적화)</span>
          </div>
        </div>

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
