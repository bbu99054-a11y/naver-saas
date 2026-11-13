import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  MapPin,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  QrCode,
  Scale,
  Sparkles,
  BookOpen,
  MessageSquareText,
  HelpCircle,
  BarChart3,
} from 'lucide-react'
import GlobalHeader from '@/components/common/GlobalHeader'
import HeroPlaceSearch from '@/components/home/HeroPlaceSearch'
import CopyTemplateButton from '@/components/place/CopyTemplateButton'
import { getPostBySlug } from '@/lib/blogData'
import {
  INDUSTRY_PLACE_LIST,
  getIndustryProfile,
} from '@/lib/industryPlaceData'

export const dynamicParams = false

export async function generateStaticParams() {
  return INDUSTRY_PLACE_LIST.map((item) => ({
    industry: item.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ industry: string }>
}): Promise<Metadata> {
  const { industry } = await params
  const profile = getIndustryProfile(industry)
  if (!profile) {
    return { title: '업종별 스마트플레이스 진단 | PostSync' }
  }

  const canonicalUrl = `https://www.postsyncapp.com/place/${profile.slug}`

  return {
    title: profile.metaTitle,
    description: profile.metaDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: profile.metaTitle,
      description: profile.metaDescription,
      url: canonicalUrl,
      siteName: 'PostSync 플레이스 연구소',
      locale: 'ko_KR',
      type: 'website',
      images: [
        {
          url: 'https://www.postsyncapp.com/place_verified_organic.png',
          width: 1200,
          height: 630,
          alt: profile.h1Title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: profile.metaTitle,
      description: profile.metaDescription,
      images: ['https://www.postsyncapp.com/place_verified_organic.png'],
    },
  }
}

export default async function IndustryPlacePage({
  params,
}: {
  params: Promise<{ industry: string }>
}) {
  const { industry } = await params
  const profile = getIndustryProfile(industry)

  if (!profile) {
    notFound()
  }

  const relatedPosts = profile.relatedPostSlugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is NonNullable<typeof post> => Boolean(post))

  const canonicalUrl = `https://www.postsyncapp.com/place/${profile.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: profile.metaTitle,
        description: profile.metaDescription,
        inLanguage: 'ko-KR',
        dateModified: '2026-11-13',
        isPartOf: {
          '@id': 'https://www.postsyncapp.com/#organization',
        },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonicalUrl}#software`,
        name: `PostSync ${profile.shortName} 스마트플레이스 순위 진단기`,
        url: `https://www.postsyncapp.com/place?q=${encodeURIComponent(profile.defaultKeyword)}`,
        operatingSystem: 'All',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'KRW',
        },
        description: profile.answerFirstSummary,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '포털 홈',
            item: 'https://www.postsyncapp.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: '플레이스 순위 조회',
            item: 'https://www.postsyncapp.com/place',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: `${profile.shortName} 맞춤 진단`,
            item: canonicalUrl,
          },
        ],
      },
      {
        '@type': 'Organization',
        '@id': 'https://www.postsyncapp.com/#organization',
        name: 'PostSync 플레이스 연구소 (와이엠랩스)',
        url: 'https://www.postsyncapp.com/about',
        email: 'support@postsyncapp.com',
      },
    ],
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans break-keep break-words">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <GlobalHeader currentPath="/place" />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="현재 위치" className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            포털 홈
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link href="/place" className="hover:text-slate-900 transition-colors">
            플레이스 순위 조회
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-blue-600">{profile.shortName} 맞춤 진단</span>
        </nav>

        {/* Hero + Immediate Rank Search Widget */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span>{profile.badgeLabel}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 leading-[1.3] text-balance">
              {profile.h1Title}
            </h1>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border-l-4 border-blue-600 border border-slate-200/80 max-w-[46rem]">
              <div className="text-xs font-extrabold text-blue-700 mb-1.5">
                결론 요약 (Answer-First)
              </div>
              <p className="text-sm sm:text-base text-slate-800 leading-[1.7] text-pretty">
                {profile.answerFirstSummary}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <HeroPlaceSearch
              variant="hero"
              defaultKeyword={profile.defaultKeyword}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
            <span className="font-semibold text-slate-500">업종 대표 검색 조합:</span>
            {profile.sampleKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/place?q=${encodeURIComponent(kw)}`}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 font-semibold transition-colors"
              >
                {kw} 순위 바로 보기 &rarr;
              </Link>
            ))}
          </div>
        </section>

        {/* 1. Industry Algorithm Deep Analysis */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.35] text-balance">
              {profile.name} 상권에서 순위와 예약 전환을 가르는 핵심 구조
            </h2>
          </div>
          <div className="space-y-4 max-w-[42rem]">
            {profile.algorithmAnalysis.map((paragraph, index) => (
              <p
                key={index}
                className="text-sm sm:text-base text-slate-700 leading-[1.72] text-pretty"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* 2. TOP 5 Benchmark Table */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <BarChart3 className="w-4 h-4" />
                <span>상위 1~5위 매장 기준 실무 목표치</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.35] text-balance">
                {profile.shortName} 스마트플레이스 4대 정량 기준 비교표
              </h2>
            </div>
            <Link
              href={`/place?q=${encodeURIComponent(profile.defaultKeyword)}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 min-h-11 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-colors shrink-0"
            >
              <span>내 매장과 1위 매장 지금 대조하기</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
                <tr>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold">평가 지표</th>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold">상위 5위 진입 기준</th>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold">반영 신호</th>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold">현장 실행 액션</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {profile.benchmarks.map((row) => (
                  <tr key={row.metric} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{row.metric}</td>
                    <td className="py-3.5 px-4 font-semibold text-blue-700">{row.top5Target}</td>
                    <td className="py-3.5 px-4 text-slate-600">{row.weighting}</td>
                    <td className="py-3.5 px-4 leading-[1.6]">{row.practicalAction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Ad Law & Platform Penalty Traps Table */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700">
                <ShieldAlert className="w-4 h-4" />
                <span>노출 제한 · 행정처분 예방</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.35] text-balance">
                {profile.shortName} 업종에서 자주 적발되는 광고·등록 위반 TOP 5
              </h2>
            </div>
            <Link
              href={`/adcheck?prof=${encodeURIComponent(profile.adcheckProf)}`}
              className="inline-flex items-center justify-center gap-1.5 px-4 min-h-11 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors shrink-0"
            >
              <Scale className="w-4 h-4" />
              <span>소개글·원고 금칙어 무료 검사</span>
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
                <tr>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold">위험 유형</th>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold">관련 법령 · 정책</th>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-rose-700">위험 표현 예시</th>
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-emerald-700">안전한 대체 표현</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm text-slate-700">
                {profile.adLawTraps.map((trap) => (
                  <tr key={trap.riskCategory} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{trap.riskCategory}</td>
                    <td className="py-3.5 px-4 text-slate-600">{trap.lawOrPolicy}</td>
                    <td className="py-3.5 px-4 text-rose-700 font-medium leading-[1.6]">{trap.prohibitedSample}</td>
                    <td className="py-3.5 px-4 text-emerald-800 font-medium leading-[1.6]">{trap.safeReplacement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Weekly Routine Checklist & Integrated Tool Actions */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 leading-[1.35] text-balance">
              {profile.shortName} 담당자가 매주 점검하는 4단계 루틴
            </h2>
            <ul className="space-y-3">
              {profile.weeklyChecklist.map((step, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 leading-[1.65]"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-1 shrink-0" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-lg flex flex-col justify-between space-y-5">
            <div className="space-y-2">
              <div className="text-xs font-bold text-emerald-400">무료 실행 도구 연계</div>
              <h2 className="text-lg sm:text-xl font-black leading-[1.35] text-balance">
                진단에서 끝내지 말고 매장 세팅까지 5분 안에 마치세요
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-[1.65]">
                회원가입 없이 브라우저에서 즉시 사용 가능하며 모든 결과물은 바로 매장 운영에 쓰실 수 있습니다.
              </p>
            </div>
            <div className="space-y-2.5">
              <Link
                href={`/reply?mode=intro&kw=${encodeURIComponent(profile.defaultKeyword)}`}
                className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> AI 2,000자 소개글·답글 생성기
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href="/utm"
                className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" /> 매장 영수증 리뷰·저장 QR 인쇄판
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
              <Link
                href={`/adcheck?prof=${encodeURIComponent(profile.adcheckProf)}`}
                className="w-full min-h-11 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs sm:text-sm font-bold flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Scale className="w-4 h-4" /> 업종별 광고 심의 금칙어 스캐너
                </span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 5. Industry Review Reply Templates */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <MessageSquareText className="w-4 h-4" />
                <span>복붙 후 1단어만 수정해서 사용하세요</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-[1.35] text-balance">
                {profile.shortName} 상황별 영수증 리뷰 답글 표준 템플릿 3종
              </h2>
            </div>
            <Link
              href={`/reply?mode=reply&kw=${encodeURIComponent(profile.defaultKeyword)}`}
              className="text-xs sm:text-sm font-bold text-blue-600 hover:underline shrink-0"
            >
              AI 맞춤 답글 더 생성하기 &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {profile.replySamples.map((sample) => (
              <div
                key={sample.situation}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/80 px-2.5 py-0.5 rounded-full inline-block">
                    {sample.toneLabel}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {sample.situation}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-[1.68] text-pretty">
                    {sample.template}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200/80">
                  <CopyTemplateButton text={sample.template} label="답글 문구 복사" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. FAQ */}
        <section className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs space-y-5">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2 leading-[1.35] text-balance">
              <HelpCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <span>{profile.shortName} 플레이스 운영 자주 묻는 질문</span>
            </h2>
          </div>

          <div className="space-y-4">
            {profile.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 max-w-[46rem]"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Q{idx + 1}. {faq.q}
                </h3>
                <p className="text-xs sm:text-sm text-slate-700 leading-[1.7] text-pretty">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Related Guides & Cross-Industry Hub */}
        <section className="space-y-6">
          {relatedPosts.length > 0 && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>함께 읽으면 좋은 {profile.shortName} 실무 칼럼</span>
                </h2>
                <Link href="/blog" className="text-xs font-bold text-blue-600 hover:underline">
                  전체 칼럼 보기
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {relatedPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-blue-50/40 hover:border-blue-300 transition-colors flex flex-col justify-between gap-2"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500">
                        {post.categoryLabel}
                      </span>
                      <div className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {post.title}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-[1.6]">
                        {post.excerpt}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-blue-600">칼럼 읽기 &rarr;</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other Industry Hubs (Internal PageRank Mesh) */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xs space-y-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900">
              다른 업종별 스마트플레이스 진단 기준 바로 보기
            </h2>
            <div className="flex flex-wrap gap-2">
              {INDUSTRY_PLACE_LIST.map((item) => {
                const isCurrent = item.slug === profile.slug
                return (
                  <Link
                    key={item.slug}
                    href={`/place/${item.slug}`}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                      isCurrent
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border-slate-200'
                    }`}
                  >
                    {item.shortName}
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-slate-200/80 py-10 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-bold text-slate-700">
            © 2026 PostSync 플레이스 연구소 (와이엠랩스 · YM Labs)
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">포털 홈</Link>
            <Link href="/place" className="hover:text-slate-900 transition-colors">순위 조회</Link>
            <Link href="/tools" className="hover:text-slate-900 transition-colors">전체 도구</Link>
            <Link href="/blog" className="hover:text-slate-900 transition-colors">공략 칼럼</Link>
            <Link href="/about" className="hover:text-slate-900 transition-colors">서비스 소개</Link>
            <Link href="/privacy" className="text-slate-900 font-bold hover:underline">개인정보처리방침</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">이용약관</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">문의하기</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
