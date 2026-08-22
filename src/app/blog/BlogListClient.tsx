'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Sparkles, ArrowRight, Calendar, Clock, Search, Filter, 
  BookOpen, ChevronRight, CheckCircle2, ShieldCheck, Zap 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { blogPosts, CATEGORIES, BlogPost } from '@/lib/blogData'

export default function BlogListClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // 카테고리 및 검색어 필터링
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchCategory = selectedCategory === 'all' || post.category === selectedCategory
      const matchQuery = 
        searchQuery.trim() === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())
      
      return matchCategory && matchQuery
    })
  }, [selectedCategory, searchQuery])

  // 대표 추천 글 (featured)
  const featuredPost = blogPosts.find(p => p.featured) || blogPosts[0]

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* 2026 Modern Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-purple-800/10 blur-[140px] rounded-full" />
        <div className="absolute top-[50%] right-[-150px] w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff04_1px,transparent_1px),linear-gradient(to_bottom,#ffffff04_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>

      {/* Navbar */}
      <header className="fixed top-0 w-full bg-[#0A0D14]/85 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight text-white flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            PostSync
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Blog & Insights
            </span>
          </Link>

          <nav className="flex items-center gap-5 text-sm font-medium text-slate-300">
            <Link href="/" className="hover:text-white transition-colors hidden sm:inline">홈으로</Link>
            <Link href="/seo-check" className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1">
              무료 진단 <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            </Link>
            <Link href="/pricing" className="hover:text-white transition-colors hidden md:inline">요금제</Link>
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">로그인</Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 h-9 font-bold text-xs shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                무료 3회 시작
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-12 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-6">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> 2026 전문직 인바운드 마케팅 & SEO 전략 칼럼
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">
            전문직 마케팅의 <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-violet-400">새로운 표준</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            월 수백만 원 대행사 수수료의 실체와 2026 개정 광고 규정 징계 리스크.<br className="hidden sm:inline" />
            네이버 C-Rank와 구글 GEO를 꿰뚫는 실전 수임 칼럼을 공개합니다.
          </p>
        </div>
      </section>

      {/* Category Filter & Search Bar */}
      <section className="px-6 py-6 relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 border-b border-white/10">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40'
                      : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="칼럼 검색 (예: 변호사, 징계, 세무사)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="py-8 px-6 relative z-10 max-w-7xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center text-slate-500">
            <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-base font-medium">검색 결과에 해당하는 칼럼이 없습니다.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 text-xs text-indigo-400 hover:underline cursor-pointer"
            >
              전체 칼럼 보기
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <Card className="h-full bg-[#111622]/80 border-white/10 hover:border-indigo-500/40 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 flex flex-col justify-between">
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                      <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url(${post.imageUrl})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111622] via-transparent to-transparent opacity-80" />
                      
                      {/* Category Badge & Special Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-md">
                          {post.categoryLabel}
                        </span>
                        {post.badge && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-500/90 text-slate-950 backdrop-blur-md uppercase tracking-wider">
                            {post.badge}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400 mb-2.5">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-500" /> {post.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {post.readTime}</span>
                      </div>
                      
                      <h2 className="text-lg font-bold text-white mb-2 leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 pb-5 pt-0 border-t border-white/5 mt-auto flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">{post.author}</span>
                    <span className="text-indigo-400 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      칼럼 전문 읽기 <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Free Audit & Trial Banner */}
      <section className="py-20 px-6 relative z-10 max-w-5xl mx-auto mt-12">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden bg-gradient-to-br from-indigo-900/50 via-slate-900/80 to-purple-900/40 border border-indigo-500/30 shadow-2xl">
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/20 blur-3xl rounded-full" />

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-4">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> 1분 안에 완성되는 전문직 SEO 원고
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 leading-tight">
              더 이상 대행사에 끌려다니지 마세요.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
              2026년 전문직 광고 규정 100% 준수 필터링과 C-Rank 알고리즘 최적화.<br className="hidden sm:inline" />
              대표님의 실무 이력만 넣으면 상위 노출 원고가 1분 만에 완성됩니다.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl px-8 h-12 shadow-lg shadow-indigo-600/30 border border-indigo-400/30">
                  PostSync 3회 무료 체험하기
                </Button>
              </Link>
              <Link href="/seo-check">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border-white/10 font-bold rounded-xl px-6 h-12">
                  내 블로그 무료 SEO 진단 &rarr;
                </Button>
              </Link>
            </div>
            
            <p className="text-slate-500 text-xs mt-4">신용카드 등록 없이 가입 즉시 무료 3회 제공</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center text-xs text-slate-500 relative z-10">
        <p>© 2026 와이엠랩스 (YM Labs) PostSync. All rights reserved.</p>
      </footer>

    </div>
  )
}
