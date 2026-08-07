'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Search, LayoutTemplate, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-200">
      
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/70 backdrop-blur-md z-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded-md"><Sparkles size={18} /></span>
            LocalSEO AI
          </div>
          <nav className="flex items-center gap-4">
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
      <section className="pt-40 pb-20 px-6 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm mb-6 border border-indigo-200">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            2026년 네이버 C-Rank & D.I.A+ 알고리즘 완벽 대응
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            단 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">3초</span> 만에 터지는<br/>
            블로그 포스팅 완성
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            더 이상 빈 화면을 보며 고민하지 마세요. 타겟 키워드 하나면 AI가 실시간 뉴스를 검색하고, 이미지를 그리며, 전문가 수준의 글을 대신 써드립니다.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 transition-all hover:scale-105">
                지금 바로 5,000 크레딧 받기 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-slate-500 sm:ml-4">✨ 가입 즉시 무료 이용 가능</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">사람이 쓴 것과 구별할 수 없는 <span className="text-indigo-600">초격차 퀄리티</span></h2>
            <p className="text-slate-600">수많은 자영업자와 마케터가 이미 AI의 압도적인 효율을 경험하고 있습니다.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-blue-500" />}
              title="실시간 RAG 웹 검색"
              desc="Tavily AI 검색 엔진을 통해 2026년 기준의 최신 트렌드와 팩트체크된 기사를 본문에 자동 인용하여 신뢰도(C-Rank)를 극대화합니다."
            />
            <FeatureCard 
              icon={<LayoutTemplate className="w-8 h-8 text-purple-500" />}
              title="AI 썸네일 & 본문 이미지"
              desc="저작권 걱정 없는 고품질의 일러스트와 사진을 AI가 스스로 문맥을 파악하여 알맞은 자리에 삽입해 줍니다."
            />
            <FeatureCard 
              icon={<Copy className="w-8 h-8 text-green-500" />}
              title="스마트에디터 100% 호환"
              desc="복사 버튼 한 번이면 네이버 글쓰기 창이 열립니다. 서식 깨짐 없이 이미지와 글꼴 굵기까지 완벽하게 붙여넣어 발행하세요."
            />
          </div>
        </div>
      </section>

      {/* Social Proof & CTA */}
      <section className="py-24 bg-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Zap className="w-12 h-12 mx-auto text-yellow-400 mb-6" />
          <h2 className="text-4xl font-bold mb-6">압도적인 마케팅 성과, 지금 시작하세요</h2>
          <p className="text-xl text-indigo-200 mb-10">매일 수많은 글을 스트레스 없이, 최상의 퀄리티로 발행할 수 있습니다.</p>
          <Link href="/login">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-indigo-900 hover:bg-slate-100 shadow-xl transition-transform hover:scale-105 font-bold">
              무료로 첫 글 작성해보기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2026 LocalSEO AI SaaS. All rights reserved.</p>
          <p className="mt-2">Made for business owners to thrive in the local ecosystem.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}
