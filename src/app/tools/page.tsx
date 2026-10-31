import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Layers,
  ArrowRight,
  Scale,
  MapPin,
  QrCode,
  Sparkles,
  Lock,
  ChevronRight,
  CheckCircle2,
  Zap,
  Scissors,
  Binary,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '스마트플레이스 & 마케팅 무료 초소형 웹 유틸리티 허브 | PostSync Tools',
  description:
    '설치 없이 브라우저에서 1초 만에 업무를 해결하는 무료 초소형 웹툴 모음. 네이버 스마트플레이스 실시간 순위 조회기, 매장 영수증 리뷰·저장 QR 빌더, 플레이스 상세설명 및 광고법 금칙어 스캐너, 블로그 스마트에디터 서식 변환기.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'PostSync 스마트플레이스 & 로컬 마케팅 무료 웹 유틸리티 허브',
    description:
      '설치 제로, 가입 제로, 서버 전송 제로. 브라우저에서 즉시 구동되는 100% 무료 비즈니스 웹 유틸리티 모음입니다.',
    url: 'https://www.postsyncapp.com/tools',
    siteName: 'PostSync Tools',
    locale: 'ko_KR',
    type: 'website',
    images: [
      {
        url: 'https://www.postsyncapp.com/placesync_profile_A.jpg',
        width: 1200,
        height: 630,
        alt: 'PostSync 스마트플레이스 & 로컬 마케팅 무료 웹 유틸리티 허브',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PostSync 스마트플레이스 & 로컬 마케팅 무료 웹 유틸리티 허브',
    description: '설치 제로, 가입 제로, 서버 전송 제로. 브라우저에서 즉시 구동되는 100% 무료 비즈니스 웹 유틸리티 모음입니다.',
    images: ['https://www.postsyncapp.com/placesync_profile_A.jpg'],
  },
};

const CORE_TOOLS = [
  {
    id: 'place',
    title: '네이버 플레이스 실시간 순위 조회기',
    badge: '1위~20위 실시간 정밀 순위 (LIVE)',
    isLive: true,
    href: '/place',
    icon: MapPin,
    color: 'from-emerald-500 to-teal-600',
    borderGlow: 'border-2 border-emerald-600 shadow-md shadow-emerald-500/10 hover:shadow-xl',
    target: '소상공인 · 병원 · 식당 · 학원 · 전문직',
    desc: '키워드와 상호명만 입력하면 네이버 스마트플레이스 1위부터 20위까지 내 매장의 실시간 노출 순위, 공식 월간 검색량, 1위 경쟁점과의 4대 정량 격차를 1초 만에 실측합니다.',
    features: ['1위~20위 실시간 순위 추적', '공식 월간 검색량 측정', '1위 매장 4대 정량 격차 진단'],
  },
  {
    id: 'utm',
    title: '매장 카운터 저장·영수증 리뷰 & 캠페인 고화질 QR 빌더',
    badge: '인쇄용 PNG/SVG QR 즉시 생성 (LIVE)',
    isLive: true,
    href: '/utm',
    icon: QrCode,
    color: 'from-blue-600 to-indigo-600',
    borderGlow: 'border-2 border-blue-600 shadow-md shadow-blue-500/10 hover:shadow-xl',
    target: '오프라인 매장 사장님 · 로컬 마케터',
    desc: '테이블이나 카운터에 비치하여 방문 고객이 스마트폰 카메라로 스캔 즉시 네이버 플레이스 저장하기·영수증 리뷰·네이버 예약으로 이동하게 만드는 고화질 QR과 추적 링크를 1초 만에 생성합니다.',
    features: ['네이버 플레이스 저장/리뷰 프리셋', '인쇄용 고화질 SVG/PNG QR 생성', 'GA4 유입 추적 파라미터 내장'],
  },
  {
    id: 'adcheck',
    title: '플레이스 상세설명 & 의료·전문직 광고법 금칙어 스캐너',
    badge: '2026 법정 규정 완벽 대조 (LIVE)',
    isLive: true,
    href: '/adcheck',
    icon: Scale,
    color: 'from-violet-600 to-purple-600',
    borderGlow: 'border-2 border-violet-600 shadow-md shadow-violet-500/10 hover:shadow-xl',
    target: '병의원 · 전문직 · 로컬 매장 · 체험단 운영자',
    desc: '플레이스 상세설명이나 블로그 홍보 원고 등록 전, 검색 누락(저품질) 및 과태료를 유발하는 과장·보장성 금칙어를 1초 만에 검출하고 안전한 합법 대체 문구로 원클릭 치환합니다.',
    features: ['100% 브라우저 메모리 로컬 연산', '2026 의료법·변호사법 규정 완벽 대조', '원클릭 안전 대체어 치환'],
  },
];

const UTILITY_TOOLS = [
  {
    id: 'convert',
    title: '블로그 스마트에디터 서식 변환기',
    badge: 'ONE 서식 호환',
    href: '/convert',
    icon: Layers,
    desc: 'ChatGPT·노션 마크다운을 네이버 블로그 스마트에디터 ONE 서식으로 원클릭 변환 및 복사합니다.',
  },
  {
    id: 'crop',
    title: '상세페이지 분할 & 크롭 스튜디오',
    badge: '무손실 이미지 슬라이서',
    href: '/crop',
    icon: Scissors,
    desc: '스마트스토어·상세페이지 규격에 맞게 이미지를 고화질로 자동 분할 및 리사이징합니다.',
  },
  {
    id: 'byte',
    title: '포털별 글자수 & 바이트 계산기',
    badge: '네이버 공식 기준',
    href: '/byte',
    icon: Binary,
    desc: '네이버 블로그 및 주요 포털 기준 공백 포함/제외 글자수와 바이트 수를 실시간 계산합니다.',
  },
  {
    id: 'hwpx',
    title: '공공기관 HWPX 무설치 뷰어',
    badge: '로컬 메모리 추출',
    href: '/hwpx',
    icon: FileText,
    desc: '소상공인 지원사업 등 공공기관 한글(HWPX) 문서를 별도 설치 없이 브라우저에서 즉시 열람합니다.',
  },
];

export default function ToolsHubPage() {
  const allTools = [...CORE_TOOLS, ...UTILITY_TOOLS];
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'PostSync 스마트플레이스 & 로컬 마케팅 무료 웹 유틸리티',
    description: '설치 없이 브라우저에서 1초 만에 구동되는 100% 무료 비즈니스 웹 유틸리티 모음',
    itemListElement: allTools.map((t, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      item: {
        '@type': 'WebApplication',
        name: t.title,
        url: `https://www.postsyncapp.com${t.href}`,
        description: t.desc,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white break-keep break-words">
      {/* Search Engine Structured Data: ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

        {/* 히어로 영역 */}
        <div className="text-center space-y-4 mb-14 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>PostSync 스마트플레이스 &amp; 로컬 마케팅 웹 유틸리티 허브</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            스마트플레이스 상위노출과 매장 관리를 위한 <br className="hidden sm:inline" />
            <span className="text-blue-600">3대 무료 핵심 웹 유틸리티</span>
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

        {/* 3대 플레이스 핵심 툴 카드 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {CORE_TOOLS.map((tool) => {
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
                  <Link
                    href={tool.href}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 group-hover:scale-[1.01]"
                  >
                    <span>지금 바로 무료 사용하기</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🛠️ 소상공인 실무 보조 유틸리티 섹션 */}
        <div className="mb-16">
          <div className="mb-6">
            <span className="text-xs font-bold text-slate-400 font-mono tracking-wider uppercase">SUB UTILITIES</span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-0.5">
              소상공인 &amp; 마케터 실무 보조 유틸리티
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              매장 운영과 콘텐츠 발행에 필요한 초경량 웹툴 모음입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {UTILITY_TOOLS.map((u) => {
              const Icon = u.icon;
              return (
                <Link
                  key={u.id}
                  href={u.href}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 text-slate-600 flex items-center justify-center mb-3 transition">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">{u.badge}</span>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition mt-0.5 mb-1.5">
                      {u.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {u.desc}
                    </p>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600 group-hover:text-blue-600">
                    <span>도구 열기</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* 📚 2026 비즈니스 & 플레이스 상위노출 실전 가이드 */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <span className="text-xs font-bold text-blue-600 font-mono tracking-tight">KNOWLEDGE BASE</span>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1">
                2026 스마트플레이스 &amp; 비즈니스 상위노출 실전 가이드
              </h3>
            </div>
            <Link
              href="/blog"
              className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition flex items-center gap-1.5"
            >
              <span>전체 칼럼 보기</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/blog/naver-place-rank-checker-free"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 transition group block"
            >
              <div className="text-[11px] font-extrabold text-blue-600 mb-1.5">실시간 순위 분석</div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug mb-1.5">
                네이버 플레이스 순위 확인 사이트 추천 및 1초 진단
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                내 매장의 실시간 노출 순위와 1위 경쟁점과의 4대 정량 격차 분석법
              </p>
            </Link>

            <Link
              href="/blog/smart-place-top-setting-checklist"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 transition group block"
            >
              <div className="text-[11px] font-extrabold text-emerald-600 mb-1.5">오픈 매장 필독</div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition leading-snug mb-1.5">
                스마트플레이스 1위 세팅 7대 필수 체크리스트
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                신규 매장이 오픈 2주 만에 지역 1~3위에 진입하는 핵심 세팅 공식
              </p>
            </Link>

            <Link
              href="/blog/place-rank-drop-causes-and-fix"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-rose-50/50 border border-slate-200 hover:border-rose-300 transition group block"
            >
              <div className="text-[11px] font-extrabold text-rose-600 mb-1.5">순위 급락 처방</div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition leading-snug mb-1.5">
                플레이스 순위 급락 원인과 48시간 내 복구법
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                최신성 결여, 가짜 영수증 페널티, 자가 검색 감점 원인과 긴급 복구
              </p>
            </Link>

            <Link
              href="/blog/naver-place-save-count-boost"
              className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-300 transition group block"
            >
              <div className="text-[11px] font-extrabold text-amber-600 mb-1.5">저장수 극대화</div>
              <div className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition leading-snug mb-1.5">
                네이버 플레이스 저장하기 늘리는 합법적 방법
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">
                슬롯 대행사 없이 실제 방문 고객의 자발적 저장을 10배 늘리는 노하우
              </p>
            </Link>
          </div>
        </div>

        {/* 푸터 */}
        <div className="mt-16 pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2.5">
          <p className="font-bold text-slate-700">© 2026 PostSync (와이엠랩스 · YM Labs). All rights reserved.</p>
          <p className="text-[11px] text-slate-400">
            상호명: 와이엠랩스 (YM Labs) | 대표자: 유영무 | 사업자등록번호: 736-48-01186 | 소재지: 서울특별시 송파구 송파대로 345, 103동 204호
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-500 font-mono pt-1">
            <Link href="/" className="hover:text-slate-900 transition">홈</Link>
            <span>•</span>
            <Link href="/place" className="hover:text-slate-900 transition">플레이스 순위</Link>
            <span>•</span>
            <Link href="/utm" className="hover:text-slate-900 transition">매장 QR</Link>
            <span>•</span>
            <Link href="/adcheck" className="hover:text-slate-900 transition">금칙어 검사</Link>
            <span>•</span>
            <Link href="/blog" className="hover:text-slate-900 transition">인사이트 칼럼</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-slate-900 transition font-bold text-slate-700">개인정보처리방침</Link>
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
