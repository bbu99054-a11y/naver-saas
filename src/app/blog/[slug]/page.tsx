import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Clock,
  ChevronLeft,
  Zap,
  Search,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { blogPosts, getPostBySlug } from '@/lib/blogData'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import GoogleAdSlot from '@/components/monetization/GoogleAdSlot'
import PlaceQuickSearchWidget from '@/components/blog/PlaceQuickSearchWidget'
import HeroPlaceSearch from '@/components/home/HeroPlaceSearch'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = getPostBySlug(resolvedParams.slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} | PostSync 플레이스 연구소`,
    description: post.excerpt,
    alternates: {
      canonical: `https://www.postsyncapp.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
      url: `https://www.postsyncapp.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const post = getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  const recommendedPlacePosts = blogPosts
    .filter((p) => p.id !== post.id && p.categoryLabel === '스마트플레이스')
    .slice(0, 5)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.postsyncapp.com/blog/${post.slug}`,
    },
    author: {
      '@type': 'Organization',
      name: 'PostSync 스마트플레이스 연구소',
      url: 'https://www.postsyncapp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PostSync',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.postsyncapp.com/favicon.ico',
      },
    },
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white break-keep break-words">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. 상단 글로벌 네비게이션 헤더 (플레이스 툴·메인·블로그 목록과 100% 통일된 딥 슬레이트 다크 테마) */}
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
              <Link href="/place" className="hover:text-white transition flex items-center gap-1">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>플레이스 순위 조회</span>
              </Link>
              <Link href="/utm" className="hover:text-white transition">
                매장 리뷰·QR 생성
              </Link>
              <Link href="/adcheck" className="hover:text-white transition">
                소개글 금칙어 검사
              </Link>
              <Link href="/blog" className="text-white hover:text-emerald-400 font-bold transition">
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
              <span>칼럼 목록</span>
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

      {/* 2. 본문 + 우측 고정 사이드바 컨테이너 */}
      <div className="py-10 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        {/* 메인 칼럼 컨테이너 */}
        <article className="flex-1 max-w-3xl bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-slate-200/90 shadow-2xs">
          {/* 상단 카테고리 & 뒤로가기 */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <Link href="/blog" className="inline-flex items-center text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> 전체 칼럼 목록
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                {post.categoryLabel}
              </span>
              {post.badge && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                  {post.badge}
                </span>
              )}
            </div>
          </div>

          {/* 메인 제목 (제8조 text-balance & break-keep 적용) */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-[1.25] mb-6 tracking-tight text-balance">
            {post.title}
          </h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-slate-400 mb-8 pb-6 border-b border-slate-200/80">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" /> {post.date}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" /> {post.readTime}
            </span>
            <span>·</span>
            <span className="text-slate-700 font-bold bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              {post.author}
            </span>
          </div>

          {/* 대표 이미지 */}
          <div
            className="w-full h-[260px] sm:h-[360px] bg-slate-200 bg-cover bg-center rounded-2xl mb-8 shadow-xs border border-slate-200 overflow-hidden"
            style={{ backgroundImage: `url(${post.imageUrl})` }}
          />

          {/* 본문 상단 플레이스 즉시 검색 위젯 */}
          <PlaceQuickSearchWidget />

          {/* 상단 애드센스 슬롯 */}
          <div className="my-8">
            <GoogleAdSlot adFormat="horizontal" className="max-w-[728px] mx-auto" />
          </div>

          {/* 마크다운 커스텀 컴포넌트 렌더링 영역 (제8조 조판 규칙 적용) */}
          <div className="blog-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-12 mb-5 pb-3 border-b-2 border-slate-100 flex items-center gap-3 text-balance">
                    <span className="w-2.5 h-6 bg-slate-900 rounded-full inline-block shrink-0" />
                    <span>{children}</span>
                  </h2>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-12 mb-5 pb-3 border-b-2 border-slate-100 flex items-center gap-3 text-balance">
                    <span className="w-2.5 h-6 bg-slate-900 rounded-full inline-block shrink-0" />
                    <span>{children}</span>
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-8 mb-3 flex items-center gap-2 text-balance">
                    <span className="text-slate-900 font-extrabold text-sm">▶</span>
                    <span>{children}</span>
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-6 mb-2 text-balance">
                    {children}
                  </h4>
                ),
                p: ({ children }) => (
                  <p className="text-slate-700 leading-[1.7] text-base sm:text-[17px] mb-5 font-normal text-pretty">
                    {children}
                  </p>
                ),
                blockquote: ({ children }) => (
                  <div className="my-8 p-6 rounded-2xl bg-slate-50 border-l-4 border-slate-900 shadow-2xs border border-slate-200/80">
                    <div className="text-slate-800 font-medium text-base sm:text-[17px] leading-[1.7] text-pretty">
                      {children}
                    </div>
                  </div>
                ),
                table: ({ children }) => (
                  <div className="my-8 overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs bg-white">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-900">
                    {children}
                  </thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {children}
                  </tbody>
                ),
                tr: ({ children }) => (
                  <tr className="hover:bg-slate-50/60 transition-colors">
                    {children}
                  </tr>
                ),
                th: ({ children }) => (
                  <th className="py-3.5 px-4 text-xs sm:text-sm font-bold text-slate-800 border-r border-slate-200 last:border-r-0 tracking-tight">
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td className="py-3.5 px-4 text-xs sm:text-sm text-slate-700 border-r border-slate-100 last:border-r-0 leading-relaxed">
                    {children}
                  </td>
                ),
                ul: ({ children }) => (
                  <ul className="my-5 space-y-2.5 pl-2 text-slate-700 text-base sm:text-[17px]">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="my-5 space-y-2.5 pl-6 list-decimal text-slate-700 text-base sm:text-[17px]">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2.5 text-slate-700 leading-[1.7] text-pretty">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900 mt-2.5 shrink-0 inline-block" />
                    <span className="flex-1">{children}</span>
                  </li>
                ),
                hr: () => (
                  <hr className="my-10 border-0 h-px bg-slate-200" />
                ),
                strong: ({ children }) => (
                  <strong className="font-extrabold text-slate-950 bg-amber-100/70 px-1.5 py-0.5 rounded text-[15px] sm:text-[16px]">
                    {children}
                  </strong>
                ),
                a: ({ href, children }) => (
                  <a
                    href={href}
                    className="text-slate-900 font-bold underline underline-offset-4 hover:text-emerald-700 transition-colors"
                  >
                    {children}
                  </a>
                ),
                code: ({ children }) => (
                  <code className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 text-sm font-mono font-semibold border border-slate-200/60">
                    {children}
                  </code>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>

          {/* 하단 애드센스 슬롯 */}
          <div className="my-10 pt-6 border-t border-slate-100">
            <GoogleAdSlot adFormat="auto" className="mx-auto" />
          </div>

          {/* 칼럼 하단 CTA 배너 */}
          <div className="mt-14 p-8 sm:p-10 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
              <Zap className="w-4 h-4 text-emerald-400" /> PostSync 스마트플레이스 실시간 분석
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-balance">
              지금 내 매장 플레이스 순위와 1위 매장 격차를 1초 만에 확인하세요
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed text-pretty">
              회원가입이나 프로그램 설치 없이 브라우저에서 즉시 작동합니다. 네이버 스마트플레이스 1위 매장과의 4대 정량 격차 분석과 소개글 금칙어 검사를 무료로 이용해 보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/place">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-full px-7 h-12 cursor-pointer shadow-sm">
                  플레이스 실시간 순위 조회 &rarr;
                </Button>
              </Link>
              <Link href="/adcheck">
                <Button variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold rounded-full px-6 h-12 cursor-pointer">
                  소개글·블로그 금칙어 스캐너
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {/* 3. 데스크톱 우측 고정(Sticky) 사이드바 */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* 즉시 검색 가능한 플레이스 미니 위젯 */}
            <HeroPlaceSearch variant="sidebar" />

            {/* 스마트플레이스 필독 칼럼 박스 */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
              <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center justify-between">
                <span>📍 플레이스 필독 칼럼</span>
                <Link href="/blog" className="text-xs text-slate-500 hover:text-slate-900 font-bold transition-colors">
                  전체보기
                </Link>
              </h4>
              <div className="space-y-3">
                {recommendedPlacePosts.map((p) => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="block group pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug text-balance">
                      {p.title}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">
                      {p.date} · {p.categoryLabel}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* 사이드바 애드센스 슬롯 */}
            <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs flex items-center justify-center overflow-hidden">
              <GoogleAdSlot adFormat="rectangle" />
            </div>
          </div>
        </aside>
      </div>

      {/* 푸터 */}
      <footer className="bg-white border-t border-slate-200/80 py-12 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="font-black text-slate-900 text-sm">PostSync 플레이스 연구소</div>
          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">포털 홈</Link>
            <Link href="/blog" className="hover:text-slate-900 transition-colors">플레이스 칼럼</Link>
            <Link href="/place" className="text-slate-900 font-bold hover:text-emerald-700 transition-colors">플레이스 순위 조회</Link>
            <Link href="/utm" className="hover:text-slate-900 transition-colors">매장 리뷰·QR 빌더</Link>
            <Link href="/adcheck" className="hover:text-slate-900 transition-colors">금칙어 스캐너</Link>
            <Link href="/guide/ad-law-2026" className="hover:text-slate-900 transition-colors">2026 광고법 백서</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-slate-900 transition-colors font-bold text-slate-700">개인정보처리방침</Link>
            <Link href="/contact" className="hover:text-slate-900 transition-colors">고객지원</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-6 text-[11px] text-slate-400 space-y-1 text-center sm:text-left">
          <p>상호명: 와이엠랩스 (YM Labs) · 대표자: 유영무 · 사업자등록번호: 736-48-01186 · 사업장 소재지: 서울특별시 송파구 송파대로 345, 103동 204호</p>
          <p>문의 이메일: support@postsyncapp.com · © 2026 PostSync (YM Labs). All rights reserved.</p>
        </div>
      </footer>

      {/* 모바일 하단 플로팅 CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-3.5 bg-white/95 backdrop-blur-md border-t border-slate-200 z-50 flex gap-2">
        <Link href="/place" className="flex-1">
          <Button className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-full shadow-sm text-xs sm:text-sm">
            플레이스 실시간 순위 조회
          </Button>
        </Link>
        <Link href="/adcheck">
          <Button variant="outline" className="h-11 border-slate-300 text-slate-700 font-bold rounded-full px-4 text-xs">
            금칙어 검사
          </Button>
        </Link>
      </div>
    </div>
  )
}
