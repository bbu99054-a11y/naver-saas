import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Building2,
  Database,
  FileCheck2,
  Scale,
  ShieldCheck,
  ArrowRight,
  Mail,
} from 'lucide-react'
import GlobalHeader from '@/components/common/GlobalHeader'

export const metadata: Metadata = {
  title: '서비스 소개 및 데이터 검증 원칙 | PostSync',
  description:
    'PostSync(와이엠랩스 운영)의 스마트플레이스 순위 측정 방식, 공식 검색량 데이터 기준, 광고 심의 검수 원칙과 편집 투명성을 안내합니다.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/about',
  },
  openGraph: {
    title: '서비스 소개 및 데이터 검증 원칙 | PostSync',
    description:
      'PostSync의 스마트플레이스 분석 방법론, 편집 기준, 운영자 정보 및 광고·개인정보 투명성 정책을 확인하세요.',
    url: 'https://www.postsyncapp.com/about',
    type: 'website',
    images: [
      {
        url: 'https://www.postsyncapp.com/placesync_profile_A.jpg',
        width: 1200,
        height: 630,
        alt: 'PostSync 서비스 소개 및 데이터 검증 원칙',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '서비스 소개 및 데이터 검증 원칙 | PostSync',
    description:
      'PostSync의 스마트플레이스 분석 방법론, 편집 기준 및 운영자 안내.',
    images: ['https://www.postsyncapp.com/placesync_profile_A.jpg'],
  },
}

export default function AboutPage() {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PostSync (와이엠랩스 · YM Labs)',
    url: 'https://www.postsyncapp.com',
    email: 'support@postsyncapp.com',
    founder: {
      '@type': 'Person',
      name: '유영무',
      jobTitle: '대표 / 스마트플레이스 데이터 연구원',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '송파대로 345, 103동 204호(가락동, 헬리오시티)',
      addressLocality: '송파구',
      addressRegion: '서울특별시',
      addressCountry: 'KR',
    },
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans break-keep break-words">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />

      <GlobalHeader currentPath="/about" />

      <main className="max-w-4xl mx-auto px-5 sm:px-6 py-12 sm:py-16 space-y-10">
        {/* 상단 소개 헤더 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Building2 className="w-3.5 h-3.5" />
            <span>PostSync 연구소 소개 · Editorial &amp; Data Policy</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight text-balance">
            자영업자와 전문직을 위한 비대면 마케팅 데이터 도구 포털
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-[1.7] max-w-3xl text-pretty">
            PostSync(운영사 와이엠랩스 · YM Labs)는 대행사에 의존하지 않고 매장 대표님과 1인 전문직이 스스로 검색 노출 상태를 점검하고 실무 홍보물을 제작할 수 있도록 만든 무료 웹 유틸리티 및 리서치 플랫폼입니다. 회원가입이나 영업 전화 없이 브라우저에서 바로 결과를 확인할 수 있는 도구와 실무 가이드를 제공합니다.
          </p>
        </section>

        {/* 데이터 측정 및 검증 원칙 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Database className="w-5 h-5 text-blue-600 shrink-0" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              데이터 측정 및 검수 방법론
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                1. 실시간 스마트플레이스 순위 비교
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-[1.65] text-pretty">
                개인 검색 기록이나 기기 로그인 상태를 배제한 상태에서 네이버 지도 공개 검색 결과를 1위부터 20위까지 조회합니다. 방문자 리뷰·블로그 리뷰·예약·쿠폰 보유 여부는 확인된 공개 데이터만 표기하며, 확인되지 않는 값은 임의로 추측하지 않고 미측정 상태로 표시합니다.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                2. 공식 월간 검색량 연동 및 캐싱
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-[1.65] text-pretty">
                키워드 월간 PC·모바일 검색량은 네이버 검색광고 공식 API 응답을 기준으로 표기합니다. 동일 키워드의 반복 호출로 인한 서버 부하를 줄이기 위해 10분 단위 공용 캐시를 운영하며, API 미응답 시 추정 숫자를 생성하지 않습니다.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                3. 로컬 연산 기반 개인정보 보호
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-[1.65] text-pretty">
                리뷰 QR 생성기(/utm), 광고법 금칙어 검사기(/adcheck), 상세페이지 분할기(/crop), 글자수 계산기(/byte), 블로그 서식 변환기(/convert), HWPX 뷰어(/hwpx)는 사용자 브라우저 메모리 안에서만 연산하며 입력 문안이나 이미지를 서버에 저장하지 않습니다.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200/70 p-5 space-y-2">
              <h3 className="text-sm font-extrabold text-slate-900">
                4. 법정 광고 심의 규정 참고 자료
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-[1.65] text-pretty">
                업종별 금칙어 사전과 2026 광고법 백서는 의료법, 변호사법, 세무사법, 행정사법, 표시광고법의 공개 심의 기준을 참고하여 정리합니다. 모든 문구는 1차 작성 보조 용도이며, 최종 게시 전에는 소속 협회 및 법률 자문을 통한 확인을 권장합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 편집 원칙 및 수익 운영 투명성 */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <FileCheck2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              콘텐츠 편집 기준 및 수익 운영 투명성
            </h2>
          </div>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-600 leading-[1.7] list-disc pl-5">
            <li>
              <strong className="text-slate-900">불법 트래픽 · 어뷰징 배제:</strong> PostSync는 가짜 영수증 리뷰 작성, 유령 계정 작업, 비인가 트래픽 프로그램 판매를 일체 취급하거나 권장하지 않습니다.
            </li>
            <li>
              <strong className="text-slate-900">검증 후 콘텐츠 발행:</strong> 모든 칼럼과 가이드는 실제 네이버 검색 결과 패턴과 공식 API 스펙을 기준으로 작성하며, 알고리즘이나 관련 법령 개정 시 본문과 최종 수정일을 갱신합니다.
            </li>
            <li>
              <strong className="text-slate-900">광고와 본문의 명확한 분리:</strong> 무료 도구와 정보 칼럼 운영을 유지하기 위해 제3자 디스플레이 광고(Google AdSense) 또는 제휴 파트너 링크가 게재될 수 있으며, 모든 광고와 제휴 안내는 본문 정보와 명확히 구분하고 대가성 고지 문구와 <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">sponsored</code> 속성을 적용합니다.
            </li>
          </ul>
        </section>

        {/* 운영 주체 및 연락처 */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 sm:p-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <ShieldCheck className="w-4 h-4" />
              <span>운영 주체 및 책임자</span>
            </div>
            <h2 className="text-lg font-extrabold text-white">와이엠랩스 (YM Labs)</h2>
            <div className="text-xs sm:text-sm text-slate-300 space-y-1.5 leading-relaxed">
              <p>대표자 · 수석 연구원: 유영무</p>
              <p>사업자등록번호: 736-48-01186</p>
              <p>사업장 소재지: 서울특별시 송파구 송파대로 345, 103동 204호(가락동, 헬리오시티)</p>
              <p>
                공식 문의:{' '}
                <a
                  href="mailto:support@postsyncapp.com"
                  className="text-amber-300 underline hover:text-amber-200"
                >
                  support@postsyncapp.com
                </a>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-600">
                <Scale className="w-4 h-4" />
                <span>바로 이용해 보기</span>
              </div>
              <h2 className="text-lg font-extrabold text-slate-900">
                무료 도구와 실무 칼럼으로 확인하세요
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                매장 순위 진단, 영수증 리뷰 QR 제작, 광고법 금칙어 검수 등 주요 기능을 별도 가입 없이 무료로 실행할 수 있습니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/place"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition"
              >
                <span>플레이스 순위 진단</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-bold transition"
              >
                <Mail className="w-4 h-4" />
                <span>고객지원 문의</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 px-6 text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-slate-900">PostSync (와이엠랩스 · YM Labs)</div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900">홈</Link>
            <Link href="/place" className="hover:text-slate-900">순위 조회</Link>
            <Link href="/blog" className="hover:text-slate-900">칼럼</Link>
            <Link href="/privacy" className="hover:text-slate-900 font-bold text-slate-800">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-slate-900">이용약관</Link>
            <Link href="/contact" className="hover:text-slate-900">고객지원</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
