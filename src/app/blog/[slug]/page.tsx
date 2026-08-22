import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Calendar, Clock, ChevronLeft, ArrowRight, Share2, CheckCircle2, ShieldCheck, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { blogPosts, getPostBySlug } from '@/lib/blogData'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.title} | PostSync 전문직 칼럼`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.imageUrl],
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
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  // Schema.org Article Structured Data (GEO / Google SGE 최적화)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.imageUrl,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'PostSync 마케팅 연구소',
      url: 'https://postsyncapp.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PostSync',
      logo: {
        '@type': 'ImageObject',
        url: 'https://postsyncapp.com/favicon.ico',
      },
    },
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200">
      
      {/* JSON-LD for Google AI Overviews & SGE */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-slate-950 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-4 h-4" />
            </div>
            PostSync
          </Link>
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link href="/blog" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
              칼럼 목록
            </Link>
            <Link href="/seo-check" className="text-rose-600 font-bold hover:text-rose-700 transition-colors hidden sm:inline">
              무료 진단
            </Link>
            <Link href="/pricing" className="text-slate-600 hover:text-slate-900 transition-colors hidden md:inline">
              요금제
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-5 h-9 font-bold text-xs shadow-md shadow-indigo-100">
                무료 시작하기
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content Area */}
      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Main Article */}
        <article className="flex-1 max-w-3xl">
          <div className="flex items-center justify-between mb-6">
            <Link href="/blog" className="inline-flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
              <ChevronLeft className="w-4 h-4 mr-1" /> 전체 칼럼 목록으로
            </Link>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {post.categoryLabel}
              </span>
              {post.badge && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {post.badge}
                </span>
              )}
            </div>
          </div>
          
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 leading-tight mb-6">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-slate-500 mb-8 border-b border-slate-200 pb-6">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {post.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400" /> {post.readTime}</span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">{post.author}</span>
          </div>

          {/* Featured Image */}
          <div 
            className="w-full h-[320px] sm:h-[420px] bg-slate-200 bg-cover bg-center rounded-2xl mb-10 shadow-md border border-slate-200/60"
            style={{ backgroundImage: `url(${post.imageUrl})` }}
          />

          {/* Markdown Content */}
          <div className="prose prose-slate prose-lg max-w-none 
            prose-headings:font-extrabold prose-headings:text-slate-900 
            prose-h1:text-2xl sm:prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
            prose-h2:text-xl sm:prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-slate-200 prose-h2:pb-2
            prose-h3:text-lg sm:prose-h3:text-xl prose-h3:mt-6 prose-h3:text-indigo-950
            prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
            prose-strong:text-slate-900 prose-strong:font-bold
            prose-a:text-indigo-600 prose-a:font-bold prose-a:underline hover:prose-a:text-indigo-800
            prose-blockquote:border-l-4 prose-blockquote:border-indigo-600 prose-blockquote:bg-indigo-50/70 prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl prose-blockquote:not-italic prose-blockquote:text-slate-800 prose-blockquote:font-medium
            prose-table:w-full prose-table:border-collapse prose-table:my-8
            prose-th:bg-slate-100 prose-th:p-3 prose-th:text-slate-900 prose-th:border prose-th:border-slate-200 prose-th:text-sm prose-th:font-bold
            prose-td:p-3 prose-td:border prose-td:border-slate-200 prose-td:text-sm prose-td:text-slate-700
            prose-ul:list-disc prose-ul:pl-6 prose-li:my-1 prose-li:text-slate-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Bottom Article CTA Card */}
          <div className="mt-14 p-8 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-2">
              <Zap className="w-4 h-4 text-amber-400" /> PostSync 실전 솔루션
            </div>
            <h3 className="text-xl sm:text-2xl font-black mb-3">
              대행사 리스크 없이 직접 5분 만에 해결하세요.
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              복잡한 2026 전문직 광고 규정 검증부터 네이버 C-Rank 알고리즘 대응까지.
              AI가 대표님의 승소 및 상담 실무 사례를 완벽한 1인칭 원고로 완성합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/login">
                <Button className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl px-6 h-11 shadow-md">
                  3회 무료 체험 시작 &rarr;
                </Button>
              </Link>
              <Link href="/seo-check">
                <Button variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20 font-semibold rounded-xl px-5 h-11">
                  내 블로그 무료 진단
                </Button>
              </Link>
            </div>
          </div>
        </article>

        {/* Sidebar Sticky CTA */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-28 space-y-6">
            
            {/* Conversion Box */}
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-2xl rounded-full" />
              
              <div className="relative z-10">
                <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full inline-block mb-4">
                  🔥 전문직 마케팅 자동화
                </span>
                <h3 className="text-xl font-black text-slate-900 leading-tight mb-3">
                  블로그 쓰느라<br/>퇴근을 못하고 계신가요?
                </h3>
                <p className="text-xs text-slate-600 mb-6 leading-relaxed">
                  검색량 분석부터 1인칭 후킹 원고 작성까지. C-Rank 알고리즘을 꿰뚫는 AI 비서가 1분 만에 포스팅을 완성해 드립니다.
                </p>
                
                <Link href="/login" className="block w-full">
                  <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200">
                    PostSync 3회 무료 체험
                  </Button>
                </Link>
                
                <Link href="/seo-check" className="block w-full mt-2.5">
                  <Button variant="outline" className="w-full h-10 border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs">
                    내 블로그 무료 SEO 진단
                  </Button>
                </Link>
                
                <p className="text-[11px] text-slate-400 text-center mt-3">
                  신용카드 등록 없이 즉시 시작
                </p>
              </div>
            </div>

            {/* Other Columns Box */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
              <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
                <span>추천 인기 칼럼</span>
                <Link href="/blog" className="text-xs text-indigo-600 font-semibold hover:underline">전체보기</Link>
              </h4>
              <div className="space-y-3">
                {blogPosts.filter(p => p.id !== post.id).slice(0, 3).map(p => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="block group">
                    <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">
                      {p.title}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 inline-block">{p.date} • {p.categoryLabel}</span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </aside>

      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-md border-t border-slate-200 z-50 flex gap-2">
        <Link href="/login" className="flex-1">
          <Button className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md text-xs sm:text-sm">
            3회 무료 체험하기
          </Button>
        </Link>
        <Link href="/seo-check">
          <Button variant="outline" className="h-11 border-slate-300 text-slate-700 font-bold rounded-xl px-4 text-xs">
            무료 진단
          </Button>
        </Link>
      </div>

    </div>
  )
}
