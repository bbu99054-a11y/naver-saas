'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
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
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-indigo-600 text-white p-1 rounded-md"><Sparkles size={18} /></span>
            LocalSEO AI
          </Link>
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

      {/* Pricing Section */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            가장 합리적인 비용으로<br />최고의 마케팅 성과를
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            원하는 요금제를 선택하고 즉시 상위 노출 블로그 포스팅을 시작하세요.
          </p>
        </div>

        <motion.div 
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Starter Plan */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Starter</h3>
            <p className="text-slate-500 text-sm mb-6">개인 블로거 및 소상공인용</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₩19,000</span>
              <span className="text-slate-500 font-medium">/월</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> <span>월 30회 AI 포스팅 생성</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> <span>실시간 네이버 RAG 검색</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> <span>네이버 스마트에디터 원클릭 복사</span></li>
            </ul>
            <Link href="/dashboard/billing">
              <Button className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold">
                Starter 시작하기
              </Button>
            </Link>
          </motion.div>

          {/* Pro Plan (Highlighted) */}
          <motion.div variants={itemVariants} className="bg-indigo-900 text-white rounded-3xl p-8 shadow-2xl shadow-indigo-200 relative flex flex-col scale-105 z-10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Most Popular
            </div>
            <h3 className="text-xl font-bold mb-2">Pro</h3>
            <p className="text-indigo-200 text-sm mb-6">전문 마케터 및 다점포 사장님용</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₩49,000</span>
              <span className="text-indigo-200 font-medium">/월</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" /> <span>월 100회 AI 포스팅 생성</span></li>
              <li className="flex items-start gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" /> <span>Claude 5 Sonnet 최고 품질 모델</span></li>
              <li className="flex items-start gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" /> <span>AI 썸네일 & 본문 이미지 무제한</span></li>
              <li className="flex items-start gap-3 text-sm text-white"><CheckCircle2 className="w-5 h-5 text-pink-400 shrink-0" /> <span>네이버 스마트에디터 원클릭 복사</span></li>
            </ul>
            <Link href="/dashboard/billing">
              <Button className="w-full h-12 rounded-xl bg-white hover:bg-slate-100 text-indigo-900 font-bold shadow-lg">
                Pro 시작하기
              </Button>
            </Link>
          </motion.div>

          {/* Agency Plan */}
          <motion.div variants={itemVariants} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col">
            <h3 className="text-xl font-bold mb-2">Agency</h3>
            <p className="text-slate-500 text-sm mb-6">대형 대행사 및 기업용</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">₩99,000</span>
              <span className="text-slate-500 font-medium">/월</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> <span>무제한 AI 포스팅 생성</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> <span>모든 기능 무제한 접근</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> <span>API 접근 권한 제공</span></li>
              <li className="flex items-start gap-3 text-sm text-slate-700"><CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> <span>전담 엔지니어 지원</span></li>
            </ul>
            <Link href="/dashboard/billing">
              <Button className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold">
                문의하기
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  )
}
