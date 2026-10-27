'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin,
  ArrowRight,
  Calendar,
  Clock,
  Search,
  Filter,
  BookOpen,
  ChevronRight,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { blogPosts } from '@/lib/blogData'
import GoogleAdSlot from '@/components/monetization/GoogleAdSlot'

const CURATED_CATEGORIES = [
  { id: 'all', label: '전체 보기' },
  { id: 'place', label: '📍 스마트플레이스' },
  { id: 'strategy', label: '🔑 마케팅 전략 & C-Rank' },
  { id: 'medical', label: '🩺 병의원 · 로컬매장' },
  { id: 'pro', label: '⚖️ 전문직(법무·세무)' },
] as const

export default function BlogListClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      let matchCategory = false
      if (selectedCategory === 'all') {
        matchCategory = true
      } else if (selectedCategory === 'place') {
        matchCategory = post.categoryLabel === '스마트플레이스'
      } else if (selectedCategory === 'strategy') {
        matchCategory = post.category === 'strategy' && post.categoryLabel !== '스마트플레이스'
      } else if (selectedCategory === 'medical') {
        matchCategory = post.category === 'medical'
      } else if (selectedCategory === 'pro') {
        matchCategory = ['lawyer', 'tax', 'labor', 'admin'].includes(post.category)
      } else {
        matchCategory = post.category === selectedCategory
      }

      const q = searchQuery.trim().toLowerCase()
      const matchQuery =
        q === '' ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.categoryLabel.toLowerCase().includes(q)

      return matchCategory && matchQuery
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-slate-900 font-sans selection:bg-slate-900 selection:text-white break-keep break-words">
      {/* 1. 상단 글로벌 네비게이션 헤더 (플레이스 툴 및 메인 도메인과 100% 통일된 딥 슬레이트 다크 테마) */}
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
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white transition border border-slate-700"
            >
              <span>포털 홈</span>
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

      {/* 2. 히어로 섹션 (한국어 조판 표준 적용) */}
      <section className="pt-12 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-2xs text-center max-w-5xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-slate-600" />
            <span>2026 스마트플레이스(NPlaceRank) &amp; 로컬 마케팅 실증 리포트 ({blogPosts.length}편)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 leading-[1.2] text-balance">
            데이터로 검증된 <span className="text-slate-900">스마트플레이스 상위노출</span> &amp; 마케팅 실전 칼럼
          </h1>
          <p className="text-slate-600 text-xs sm:text-base max-w-2xl mx-auto leading-[1.65] font-normal text-pretty">
            단순 리뷰 작업이나 불법 트래픽에 의존하지 않고, 2026년 네이버 지도 노출 알고리즘(연관도·인기도·신뢰도·최신성)과 C-Rank 블로그로 1페이지에 진입하는 실무 매뉴얼을 공개합니다.
          </p>
        </div>
      </section>

      {/* 3. 카테고리 탭 & 검색 필터 바 */}
      <section className="px-4 sm:px-6 lg:px-8 py-2 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
          {/* 정돈된 카테고리 탭 */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {CURATED_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer border ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 border-slate-200/90'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>

          {/* 검색 인풋 */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="칼럼 검색 (예: 순위 상승, 영수증 리뷰, 저장수)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-full text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-800 transition-all shadow-2xs"
            />
          </div>
        </div>
      </section>

      {/* 상단 애드센스 슬롯 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 my-4">
        <GoogleAdSlot adFormat="horizontal" className="max-w-[728px] mx-auto" />
      </div>

      {/* 4. 칼럼 카드 그리드 (제8조 한국어 조판 최적화) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/90 text-slate-500">
            <Filter className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-base font-bold text-slate-700">검색 조건에 해당하는 칼럼이 없습니다.</p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              className="mt-4 text-xs font-bold text-slate-900 hover:underline cursor-pointer"
            >
              전체 칼럼 목록 다시 보기
            </button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post) => {
              const isPlacePost = post.categoryLabel === '스마트플레이스'
              return (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                  <Card className="h-full bg-white border-slate-200/90 hover:border-slate-300 rounded-3xl overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between">
                    <div>
                      {/* 썸네일 이미지 */}
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden border-b border-slate-100">
                        <div
                          className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${post.imageUrl})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />

                        {/* 카테고리 뱃지 */}
                        <div className="absolute top-3 left-3 flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-xs ${
                              isPlacePost
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-800 text-slate-200'
                            }`}
                          >
                            {post.categoryLabel}
                          </span>
                          {post.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                              {post.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 카드 본문 */}
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center gap-3 text-[11px] font-medium text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" /> {post.date}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" /> {post.readTime}
                          </span>
                        </div>

                        <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2 text-balance">
                          {post.title}
                        </h2>

                        <p className="text-xs text-slate-600 line-clamp-3 leading-[1.65] text-pretty">
                          {post.excerpt}
                        </p>
                      </CardContent>
                    </div>

                    {/* 카드 푸터 */}
                    <div className="px-5 pb-4 pt-3 border-t border-slate-100 mt-auto flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium">{post.author}</span>
                      <span className="text-slate-900 font-bold flex items-center gap-1 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all">
                        칼럼 읽기 <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* 5. 플레이스 실시간 순위 조회 브릿지 배너 */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl p-7 sm:p-10 bg-slate-900 text-white border border-slate-800 shadow-xl text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5 text-emerald-400" /> 회원가입 없는 독립 서버 실시간 측정
          </span>
          <h2 className="text-xl sm:text-3xl font-black text-white leading-tight text-balance">
            칼럼에서 확인한 플레이스 상위노출 공식, 지금 내 매장에 바로 대입해 보세요
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-[1.65] text-pretty">
            네이버 스마트플레이스 1위~75위 실시간 노출 순위 조회부터 1위 매장과의 방문자리뷰·블로그리뷰·예약·쿠폰 격차까지 1초 만에 진단합니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/place">
              <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-full px-7 h-12 cursor-pointer shadow-sm">
                플레이스 실시간 순위 조회하기 <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/adcheck">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white border-white/20 font-bold rounded-full px-6 h-12 cursor-pointer">
                소개글·체험단 금칙어 스캐너
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 하단 애드센스 슬롯 */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mb-12">
        <GoogleAdSlot adFormat="auto" className="mx-auto" />
      </div>

      {/* 6. 글로벌 푸터 */}
      <footer className="bg-white py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="font-black text-slate-900 text-sm">PostSync 플레이스 연구소</div>
          <div className="flex flex-wrap items-center justify-center gap-5 font-semibold text-slate-600">
            <Link href="/" className="hover:text-slate-900 transition-colors">포털 홈</Link>
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
    </div>
  )
}
