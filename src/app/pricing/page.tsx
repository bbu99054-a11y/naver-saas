'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, Building2, Flame } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-slate-900 font-sans selection:bg-sky-200">
      
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tighter flex items-center gap-2">
            <span className="bg-[#0284C7] text-white p-1.5 rounded-lg shadow-sm">
              <Sparkles size={18} />
            </span>
            <span className="text-slate-900 font-extrabold">PostSync</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 text-[#0284C7] font-bold">Pro</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-[#0284C7] transition-colors">
              로그인
            </Link>
            <Link href="/consult">
              <Button variant="outline" className="hidden sm:inline-flex border-slate-200 text-xs font-bold rounded-full">
                1분 진단 체험
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-[#FF6B00] hover:bg-[#E56000] text-white rounded-full px-5 py-2 font-bold text-xs shadow-md shadow-orange-200 cursor-pointer">
                무료 체험 시작
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Pricing Section Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold mb-5">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            대한민국 1등 변호사 및 법률사무소 전용 사건 수임 OS
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-5 leading-tight">
            외주 대행비 월 300만 원 대비 <span className="text-[#0284C7]">93% 절감</span><br />
            실제 의뢰인이 사건 수임으로 이어지는 실속 요금제
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            단순 블로그 글쓰기가 아닌, 네이버 블로그·플레이스부터 옴니채널 수임 파이프라인까지<br className="hidden sm:inline" />
            대표님의 법률사무소에 알짜 사건 수임을 물어다 주는 원스톱 시스템을 누려보세요.
          </p>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="pb-20 px-6">
        <motion.div 
          className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 items-stretch"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* 1. Starter Plan */}
          <motion.div 
            variants={itemVariants} 
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-slate-900">Starter</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  개업 및 1인 사무소
                </span>
              </div>
              <p className="text-slate-500 text-xs mb-6">
                기본적인 블로그 칼럼 연재와 플레이스 관리를 시작하는 전문직
              </p>
              
              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₩99,000</span>
                  <span className="text-slate-500 font-medium text-sm">/ 월</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">포스팅 1건당 약 8,250원 (원고료의 1/10)</p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span><strong>월 12회 전문 칼럼 생성</strong> (주 3회 연재 권장)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>네이버 플레이스 <strong>핵심 키워드 3개</strong> 순위 추적</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span><strong>광고 법규 안심 체크</strong> (변호사법 제23조 및 변협 규정)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>1분 간편 진단 폼 연동 (월 50건 유입 상담)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>스마트에디터 ONE 원클릭 복사 포맷</span>
                </li>
              </ul>
            </div>

            <Link href="/dashboard/billing/checkout?plan=starter&amount=99000">
              <Button className="w-full h-12 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer shadow-sm">
                Starter 시작하기
              </Button>
            </Link>
          </motion.div>

          {/* 2. Pro-Pilot Plan (Hero / Most Popular) */}
          <motion.div 
            variants={itemVariants} 
            className="bg-white rounded-3xl p-8 shadow-xl shadow-sky-100 border-2 border-[#0284C7] relative flex flex-col justify-between scale-105 z-10"
          >
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B00] to-orange-500 text-white px-4 py-1 rounded-full text-xs font-black shadow-md flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" />
              <span>가장 많은 로펌이 선택한 플랜</span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <h3 className="text-xl font-black text-[#0284C7]">Pro-Pilot</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0284C7]">
                  선착순 특가
                </span>
              </div>
              <p className="text-slate-600 text-xs mb-6">
                매일 상위 노출과 잠재 의뢰인 상담 전환을 극대화하는 주력 플랜
              </p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-slate-900">₩199,000</span>
                  <span className="text-slate-500 font-medium text-sm">/ 월</span>
                </div>
                <p className="text-[11px] text-[#0284C7] font-semibold mt-1">
                  대행사 300만 원 패키지 대비 93% 비용 절감 효과
                </p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span><strong>월 35회 원클릭 생성</strong> (매일 1편씩 수임 독점 발행)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>네이버 플레이스 <strong>15개 키워드 실시간 순위 & 경쟁사 분석</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span><strong>정예 8종 벤토 인포그래픽 카드</strong> 자동 생성 (1080px 실사)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span><strong>의뢰인 상담 파이프라인 관리</strong> (미처리 건수 0건 알림)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span>워드프레스 · 티스토리 원클릭 동시 발행 지원</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                  <span><strong>1:1 전담 마케팅 온보딩</strong> 및 템플릿 맞춤 세팅</span>
                </li>
              </ul>
            </div>

            <Link href="/dashboard/billing/checkout?plan=pro&amount=199000">
              <Button className="w-full h-12 rounded-xl bg-[#FF6B00] hover:bg-[#E56000] text-white font-black text-sm cursor-pointer shadow-lg shadow-orange-200">
                Pro-Pilot 지금 시작하기
              </Button>
            </Link>
          </motion.div>

          {/* 3. Firm Growth Plan */}
          <motion.div 
            variants={itemVariants} 
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-black text-slate-900">Firm Growth</h3>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  대형 법인 & 다지점
                </span>
              </div>
              <p className="text-slate-500 text-xs mb-6">
                복수 분사무소 및 송무팀을 보유한 중대형 법무법인
              </p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₩399,000</span>
                  <span className="text-slate-500 font-medium text-sm">/ 월</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">지점 3곳 통합 관리 포함</p>
              </div>

              <ul className="space-y-3.5 mb-8">
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>월 100회 대용량 생성</strong> (분야별 칼럼 대량 발행)</span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>플레이스 키워드 50개 추적 & 3개 지점 통합 관리</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>사무장/마케터 <strong>다중 계정 3개 제공</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span><strong>법인 전용 승소사례 · 판례 맞춤 RAG 구축</strong></span>
                </li>
                <li className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>전담 어카운트 매니저 배정 및 분기 리포트 제공</span>
                </li>
              </ul>
            </div>

            <Link href="/dashboard/billing/checkout?plan=enterprise&amount=399000">
              <Button className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs cursor-pointer border border-slate-300">
                Firm Growth 문의 및 신청
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Agency Comparison Box */}
        <div className="max-w-4xl mx-auto mt-16 bg-white rounded-3xl p-8 border border-sky-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full">
                <Building2 className="w-3.5 h-3.5" />
                마케팅 대행사 vs PostSync Pro 비교
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                대행사에 매달 300만 원씩 주면서 수정 요청하느라 지치셨나요?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                법률 광고 규정을 몰라 위반 딱지를 떼이던 대행사 글 대신, 승소 키워드와 전문직 컴플라이언스를 완벽 탑재한 시스템을 도입하세요.
              </p>
            </div>
            <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 text-center shrink-0 w-full md:w-auto">
              <p className="text-xs text-slate-500 mb-1">연간 절감 예상 비용</p>
              <p className="text-2xl font-black text-[#0284C7]">약 3,360만 원</p>
              <p className="text-[10px] text-slate-400 mt-1">(대행사 300만 vs Pro 19.9만 기준)</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-20">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                세금계산서 발행이 가능한가요?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                네, 100% 가능합니다. 무통장 입금 신청 시 사업자등록번호 또는 주민등록번호/휴대폰번호를 입력해 주시면 전자세금계산서 또는 지출증빙용 현금영수증이 즉시 국세청으로 발행됩니다.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                변호사법이나 의료법 광고 규정에 위반되지 않나요?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                PostSync는 전문직 광고 법규 안심 체크 엔진이 내장되어 있어, '100% 승소', '최고 환급률', '부작용 없는' 등의 금칙어와 과장 표현을 글 생성 단계에서 자동으로 필터링 및 대체 문구로 교정합니다.
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                이용 도중 플랜을 변경하거나 크레딧을 추가할 수 있나요?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                언제든지 마이페이지에서 플랜 업그레이드가 가능하며, 잔여 크레딧은 이월되어 사라지지 않습니다. 대량 포스팅이 필요하신 법인은 추가 크레딧 일괄 충전도 지원됩니다.
              </p>
            </div>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-10 bg-white text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p className="font-semibold text-slate-700">PostSync Pro · 와이엠랩스</p>
          <p>사업자등록번호: 247-06-02488 | 대표: 유영무 | 통신판매업신고 완료</p>
          <p className="text-[11px] text-slate-400">© 2026 PostSync. All rights reserved.</p>
        </div>
      </footer>

    </div>
  )
}
