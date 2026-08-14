import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Sparkles, Calendar, Clock, ChevronLeft } from 'lucide-react'
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
    title: `${post.title} | PostSync Blog`,
    description: post.excerpt,
    openGraph: {
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded-md"><Sparkles size={18} /></span>
            PostSync
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/seo-check" className="text-sm font-bold text-red-500">무료 진단</Link>
            <Link href="/blog" className="text-sm font-bold text-indigo-600">블로그</Link>
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">로그인</Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 font-semibold shadow-md shadow-indigo-200">
                무료로 시작하기
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Content Area */}
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Main Article */}
        <article className="flex-1 max-w-3xl">
          <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
            <ChevronLeft className="w-4 h-4 mr-1" /> 목록으로 돌아가기
          </Link>
          
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-6">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-sm font-medium text-slate-500 mb-8 border-b border-slate-200 pb-8">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {post.readTime}</span>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{post.author}</span>
          </div>

          {/* Featured Image */}
          <div 
            className="w-full h-[400px] bg-slate-200 bg-cover bg-center rounded-2xl mb-12 shadow-sm"
            style={{ backgroundImage: `url(${post.imageUrl})` }}
          />

          {/* Markdown Content */}
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-12 prose-h2:border-b prose-h2:pb-2 prose-h2:border-slate-100 prose-a:text-indigo-600 prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:py-1 prose-blockquote:px-6 prose-blockquote:rounded-r-lg prose-blockquote:not-italic prose-blockquote:font-medium">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
        </article>

        {/* Sidebar Sticky CTA (핵심 퍼널) */}
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-28 bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 blur-2xl rounded-full" />
            
            <div className="relative z-10">
              <span className="bg-indigo-100 text-indigo-800 text-xs font-black px-3 py-1 rounded-full inline-block mb-4">
                🔥 전문직 마케팅 자동화
              </span>
              <h3 className="text-xl font-black leading-tight mb-3">
                블로그 쓰느라<br/>퇴근을 못하고 계신가요?
              </h3>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                검색량 분석부터 1인칭 후킹 원고 작성까지. C-Rank 알고리즘을 꿰뚫는 AI 비서가 1분 만에 포스팅을 완성해 드립니다.
              </p>
              
              <Link href="/login" className="block w-full">
                <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md shadow-indigo-200">
                  PostSync 3회 무료 체험
                </Button>
              </Link>
              
              <p className="text-xs text-slate-400 text-center mt-4">
                신용카드 등록 없이 가입 즉시 시작
              </p>
            </div>
          </div>
        </aside>

      </div>
      
      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-50">
        <Link href="/login" className="block w-full">
          <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md">
            블로그 자동화 무료 체험하기
          </Button>
        </Link>
      </div>

    </div>
  )
}
