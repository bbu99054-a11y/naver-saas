'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Search, LayoutTemplate, Copy, Scale, FileText, Send, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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
            PostSync
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mb-6 border border-indigo-200">
            <Scale className="w-4 h-4" /> 변호사, 세무사, 노무사 등 전문직 특화
          </motion.div>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            나의 승소 사례와 철학이<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">완벽한 전문가 칼럼</span>으로.
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            일반적인 AI 글쓰기가 아닙니다. 대표님의 프로필과 전문 지식(RAG)을 
            최우선으로 학습하여 진짜 전문가가 직접 쓴 듯한 압도적인 퀄리티의 글을 3초 만에 작성합니다.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 광고법 위반 제로
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 실무 판례 강제 RAG
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-indigo-100 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 실사 이미지 최우선 매칭
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-200 transition-all hover:scale-105">
                PostSync 무료 체험하기 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* How it Works / Demo Section */}
      <section className="py-24 bg-white relative border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">단 한 번의 클릭으로 끝나는 <span className="text-indigo-600">마케팅 자동화</span></h2>
            <p className="text-slate-600 text-lg">로그인부터 동시 발행까지, PostSync가 어떻게 작동하는지 확인해보세요.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative group-hover:bg-indigo-50 transition-colors">
                <FileText className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">1</div>
              </div>
              <h3 className="text-xl font-bold mb-3">RAG 지식베이스 입력</h3>
              <p className="text-slate-600 text-sm leading-relaxed">사무소 소개, 전문 분야, 주요 승소 사례 등을 텍스트로 미리 입력해 둡니다. AI가 이 내용을 완벽히 숙지합니다.</p>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative group-hover:bg-indigo-50 transition-colors">
                <BrainCircuitIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">2</div>
              </div>
              <h3 className="text-xl font-bold mb-3">AI 전문가 칼럼 자동 작성</h3>
              <p className="text-slate-600 text-sm leading-relaxed">타겟 키워드만 입력하면, AI가 최신 관련 판례/기사를 검색(Tavily)하고 나의 RAG 데이터를 결합하여 글을 씁니다.</p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 relative group-hover:bg-indigo-50 transition-colors">
                <Send className="w-8 h-8 text-slate-400 group-hover:text-indigo-600" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md">3</div>
              </div>
              <h3 className="text-xl font-bold mb-3">네이버/워프/티스토리 동시 발행</h3>
              <p className="text-slate-600 text-sm leading-relaxed">작성된 고품질 원고를 버튼 한 번으로 네이버 블로그, 워드프레스, 티스토리에 동시 배포합니다.</p>
            </div>
          </div>

          {/* Animated Demo Window */}
          <Card className="max-w-4xl mx-auto overflow-hidden rounded-2xl shadow-2xl border-0 bg-slate-900 text-slate-100">
            <div className="flex items-center px-4 py-3 bg-slate-800 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-xs text-slate-400 font-mono">dashboard / seo-write</div>
            </div>
            <div className="p-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#03C75A]" /> 광고법 위반 제로 (Compliance)
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#03C75A]" /> 실무 판례/행정해석 강제 RAG
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#03C75A]" /> 저작권 걱정 없는 고품질 실사 이미지
                </div>
              </div>
              <div className="flex gap-4 mb-6 mt-8">
                <div className="flex-1 bg-slate-800 p-4 rounded-lg border border-slate-700 animate-pulse">
                  <div className="h-4 bg-slate-700 rounded w-1/4 mb-4"></div>
                  <div className="h-3 bg-slate-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
                <div className="flex-1 bg-indigo-900/50 p-4 rounded-lg border border-indigo-500/30">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="text-indigo-400 w-4 h-4" />
                    <span className="text-sm font-bold text-indigo-300">RAG 지식 반영 중...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-indigo-400/20 rounded w-full"></div>
                    <div className="h-2 bg-indigo-400/20 rounded w-5/6"></div>
                    <div className="h-2 bg-indigo-400/20 rounded w-4/6"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <div className="px-4 py-2 bg-green-600 rounded text-sm font-bold">N 네이버 복사</div>
                <div className="px-4 py-2 bg-blue-600 rounded text-sm font-bold">W 워드프레스 발행</div>
                <div className="px-4 py-2 bg-orange-600 rounded text-sm font-bold">T 티스토리 발행</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">비교할 수 없는 <span className="text-indigo-600">전문가 맞춤형 기능</span></h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Search className="w-8 h-8 text-blue-500" />}
              title="자동 내부 링크 (SEO 2026)"
              desc="과거에 작성했던 관련 승소 사례나 전문 칼럼을 AI가 자동으로 찾아 새 글 본문에 하이퍼링크로 삽입하여, 블로그 체류시간과 주제 권위(Topical Authority)를 극대화합니다."
            />
            <FeatureCard 
              icon={<LayoutTemplate className="w-8 h-8 text-purple-500" />}
              title="다이내믹 템플릿 & 디자인"
              desc="변호사/세무사 등 직군에 어울리는 고급스럽고 신뢰감 있는 인포박스, 인용구, 목차 서식을 자동으로 구성합니다."
            />
            <FeatureCard 
              icon={<Copy className="w-8 h-8 text-green-500" />}
              title="멀티 플랫폼 동시 발행"
              desc="작성된 100% 호환 HTML 코드를 클릭 한 번으로 네이버 스마트에디터, 워드프레스, 티스토리에 동시에 뿌립니다."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">전문직 맞춤형 요금제</h2>
            <p className="text-slate-600 text-lg">가장 합리적인 비용으로 최고의 마케팅 직원을 고용하세요.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Basic</h3>
              <p className="text-slate-500 mb-6">1인 사무소 및 개업 초기 전문가</p>
              <div className="mb-6"><span className="text-4xl font-extrabold">₩49,000</span><span className="text-slate-500"> / 월</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 월 10건 원고 생성</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 기본 RAG (일반 웹 검색)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 기본 HTML 템플릿</li>
              </ul>
              <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold" variant="outline">시작하기</Button>
            </div>

            {/* Pro Plan */}
            <div className="bg-indigo-900 text-white p-8 rounded-3xl border border-indigo-700 shadow-2xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-indigo-400 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">가장 인기</div>
              <h3 className="text-2xl font-bold mb-2">Pro <span className="text-yellow-400 text-lg">⭐️</span></h3>
              <p className="text-indigo-200 mb-6">매일 발행하여 상위 노출을 노리는 분</p>
              <div className="mb-6"><span className="text-4xl font-extrabold">₩149,000</span><span className="text-indigo-200"> / 월</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-400" /> 월 30건 원고 생성</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-400" /> 광고법 위반 필터링 (Compliance)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-400" /> 과거 글 내부 링크 자동 주입</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-400" /> 1인칭 경험/사례 프롬프트 </li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-yellow-400" /> 네이버 블로그 원클릭 자동 발행</li>
              </ul>
              <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold border-none shadow-lg">10크레딧 무료 체험하기</Button>
            </div>

            {/* Premium Plan */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 flex flex-col hover:shadow-lg transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Premium</h3>
              <p className="text-slate-500 mb-6">다채널 운영 대형 법인</p>
              <div className="mb-6"><span className="text-4xl font-extrabold">₩290,000</span><span className="text-slate-500"> / 월</span></div>
              <ul className="space-y-4 mb-8 flex-1">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 월 100건 원고 생성 (다계정)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 전용 커스텀 페르소나 3개 학습</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 스톡 이미지 API 최우선 매칭</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 채널톡 핫라인 (우선 지원)</li>
              </ul>
              <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold" variant="outline">문의하기</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & CTA */}
      <section className="py-24 bg-indigo-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <Zap className="w-12 h-12 mx-auto text-yellow-400 mb-6" />
          <h2 className="text-4xl font-bold mb-6">전문가의 시간은 비쌉니다. 마케팅은 AI에게 맡기세요.</h2>
          <p className="text-xl text-indigo-200 mb-10">오늘 가입 시 10 크레딧을 즉시 지급하여 무료로 모든 기능을 체험하실 수 있습니다.</p>
          <Link href="/login">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-white text-indigo-900 hover:bg-slate-100 shadow-xl transition-transform hover:scale-105 font-bold">
              지금 무료로 시작하기
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 text-center text-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex gap-6 mb-6">
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-white transition-colors font-bold">개인정보 처리방침</Link>
          </div>
          <p>© 2026 PostSync SaaS. All rights reserved.</p>
          <p className="mt-2">Empowering Professionals with Advanced AI Marketing Automation.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  )
}

function BrainCircuitIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-5.224 4.487 4 4 0 0 0 4.195 4.888 3.001 3.001 0 0 0 4.545 3.051 4 4 0 0 0 6.96 0 3 3 0 0 0 4.544-3.05 4 4 0 0 0 4.196-4.889 4 4 0 0 0-5.225-4.487A3 3 0 1 0 12 5Z" />
      <path d="M9 13a4.5 4.5 0 0 0 3-1.4" />
      <path d="M15 13a4.5 4.5 0 0 1-3-1.4" />
      <path d="M12 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
    </svg>
  )
}
