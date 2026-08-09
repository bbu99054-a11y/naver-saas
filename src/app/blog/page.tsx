import Link from 'next/link'
import { Sparkles, ArrowRight, Calendar, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { blogPosts } from '@/lib/blogData'

export const metadata = {
  title: '인바운드 마케팅 블로그 | PostSync',
  description: '전문직(변호사, 세무사, 행정사)을 위한 네이버 상위노출 SEO 및 마케팅 전략 칼럼',
}

export default function BlogIndexPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200">
      {/* Navbar (Same as Landing) */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded-md"><Sparkles size={18} /></span>
            PostSync
          </Link>
          <nav className="flex items-center gap-4">
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

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            전문직 마케팅의 <span className="text-indigo-600">모든 것</span>
          </h1>
          <p className="text-lg text-slate-600">
            광고 대행사에 끌려다니지 마세요. 알고리즘과 고객 심리를 관통하는 완벽한 인바운드 마케팅 전략을 공개합니다.
          </p>
        </div>
      </section>

      {/* Blog List Section */}
      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-slate-200 overflow-hidden group">
                <div 
                  className="h-48 bg-slate-200 w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url(${post.imageUrl})` }}
                />
                <CardContent className="p-6 relative bg-white z-10">
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-3">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="text-indigo-600 text-sm font-bold flex items-center gap-1">
                    칼럼 읽기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 bg-indigo-900 text-white mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">블로그 마케팅, 이제 직접 쓰지 마세요.</h2>
          <p className="text-indigo-200 mb-8">AI가 대표님의 이력을 분석해 1분 만에 완벽한 상위노출 원고를 뽑아드립니다.</p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-indigo-900 hover:bg-slate-100 font-bold rounded-full px-8 h-14 text-lg">
              PostSync 무료 체험하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
