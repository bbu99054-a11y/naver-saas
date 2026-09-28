'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Sparkles, CheckCircle2, ShieldCheck, HelpCircle, ArrowRight, Building2, Flame, Scale, Check } from 'lucide-react'
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
      
      {/* 1. 상단 네비게이션 */}
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
            <Link href="/consult" target="_blank">
              <Button variant="outline" className="hidden sm:inline-flex border-slate-200 text-xs font-bold rounded-full">
                1분 진단 폼 체험
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button className="bg-[#FF6B00] hover:bg-[#E05D00] text-white rounded-full px-5 py-2 font-bold text-xs shadow-md shadow-orange-200 cursor-pointer">
                무료 체험 시작
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* 2. 요금제 헤더 (ROI 앵커링) */}
      <section className="pt-32 pb-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-[#0284C7]" />
            월 300만 원 마케팅 대행사 100% 대체 · 대한민국 1등 변호사 사건 수임 OS
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-[1.2]">
            소송 착수금(평균 550만 원) 딱 1건이면,<br />
            <span className="text-[#0284C7]">2.4년 치 구독료가 전액 회수됩니다</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            복잡한 요금제 비교로 고민하지 마세요. 대행사 직원 1명이 하던 판례 칼럼 작성, 플레이스 1위 관제, 1분 진단 배너, 실시간 수임 파이프라인을 <strong>월 19만 원 단 하나의 올인원 패스</strong>로 종결합니다.
          </p>
        </div>
      </section>

      {/* 3. 단일 수임 OS 올인원 패스 카드 (Hero Card) */}
      <section className="pb-20 px-6">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div 
            variants={itemVariants} 
            className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl shadow-sky-100 border-2 border-[#0284C7] relative flex flex-col justify-between overflow-hidden"
          >
            {/* 상단 시그니처 뱃지 */}
            <div className="absolute top-0 right-0 bg-[#0284C7] text-white text-[11px] font-black px-5 py-1.5 rounded-bl-2xl uppercase tracking-wider shadow-xs">
              ALL-IN-ONE PASS
            </div>

            <div className="space-y-6">
              {/* 헤더 & 타깃 안내 */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black mb-3">
                  <Flame className="w-3.5 h-3.5 text-[#FF6B00]" />
                  <span>대한민국 로펌 단일 표준 요금제</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  PostSync Pro 사건 수임 OS
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm mt-1">
                  대표님 로펌에 24시간 알짜 사건 수임을 물어다 주는 전자동 수임망
                </p>
              </div>

              {/* 가격 블록 & ROI 계산기 뱃지 */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 border border-sky-100/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">₩190,000</span>
                    <span className="text-slate-500 font-bold text-sm">/ 월 (VAT 별도)</span>
                  </div>
                  <span className="text-xs font-black text-[#0284C7] bg-[#E0F2FE] px-3 py-1 rounded-full border border-sky-200">
                    대행사(월 300만 원) 대비 93% 절감
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-200/80 text-xs text-slate-700 leading-snug flex items-center gap-2 shadow-2xs">
                  <span className="text-amber-500 font-black text-base">💡</span>
                  <div>
                    <strong className="text-slate-900 font-black">압도적인 투자수익률 (ROI):</strong>
                    <span className="text-slate-600 ml-1">착수금 550만 원 사건 딱 1건만 수임해도 29개월(2.4년) 치 구독료가 순이익으로 남습니다.</span>
                  </div>
                </div>
              </div>

              {/* 6대 핵심 수임 혜택 리스트 (2열 그리드) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  포함된 6대 수임 엔진 (추가 비용 0원)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-slate-800">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">로가드 23 징계 0건 안심 검역</strong>
                      <span className="text-slate-500 text-[11px]">변호사법 제23조 및 변협 규정 120대 룰 0.05초 심층 검역</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">C-Rank 4단 판례 칼럼 월 35회</strong>
                      <span className="text-slate-500 text-[11px]">매일 1편씩 네이버 스마트블록 1위 독점 발행 (스마트에디터 ONE 서식)</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">[1분 안심 진단 배너] 자동 결합</strong>
                      <span className="text-slate-500 text-[11px]">본문 끝 의뢰인 번호 수집 배너 자동 렌더링 & 원클릭 복사</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">스마트플레이스 로컬 1위 관제</strong>
                      <span className="text-slate-500 text-[11px]">지역 키워드 실시간 순위 추적 & 영수증 리뷰 AI 감사 답글</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">의뢰인 수임 파이프라인 CRM</strong>
                      <span className="text-slate-500 text-[11px]">골든타임 10분 연결 카운트다운 & 신규 접수 실시간 알림</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                    <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">1:1 전담 세팅 & 로펌 맞춤 RAG</strong>
                      <span className="text-slate-500 text-[11px]">대표님 로펌의 실제 승소 판결문 및 전문분야 맞춤 주입</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 메인 고전환 CTA 버튼 */}
              <div className="pt-4 space-y-3">
                <Link href="/dashboard/billing/checkout?plan=pro&amount=190000">
                  <Button className="w-full h-14 rounded-full bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-base shadow-xl shadow-orange-200 cursor-pointer flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                    <span>7일간 신용카드 없이 사건 칼럼 3편 무료 체험하기</span>
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" /> 신용카드 등록 불필요
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" /> 1분 즉시 세팅
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-500" /> 전자세금계산서 100% 발행
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* 4. 중대형 로펌 / 다지점 네트워크 문의 박스 */}
        <div className="max-w-3xl mx-auto mt-8 p-5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-bold text-slate-800">🏢 복수 지점 또는 대형 법무법인이신가요?</span>
            <p className="text-slate-500">사무장 다중 계정(3인 이상) 및 전사 승소 데이터 구축을 위한 맞춤 플랜을 상담해 드립니다.</p>
          </div>
          <Link href="/contact" className="shrink-0 text-[#0284C7] font-black hover:underline flex items-center gap-1">
            <span>엔터프라이즈 문의 ➔</span>
          </Link>
        </div>

        {/* 5. 대행사 vs PostSync Pro 비용 비교 박스 */}
        <div className="max-w-3xl mx-auto mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284C7] bg-sky-50 px-3 py-1 rounded-full">
                <Building2 className="w-3.5 h-3.5" />
                <span>마케팅 대행사 vs PostSync Pro 비교</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                대행사에 매달 300만 원씩 주면서 수정 요청하느라 지치셨나요?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                법률 광고 규정을 몰라 위반 딱지를 떼이던 알바생 글 대신, 로가드 23의 징계 0건 검역과 사건 수임 폼이 결합된 전자동 시스템을 도입하세요.
              </p>
            </div>
            <div className="bg-sky-50/70 p-4 rounded-2xl border border-sky-100 text-center shrink-0 w-full md:w-auto">
              <p className="text-xs text-slate-500 mb-0.5">연간 고정비 순절감액</p>
              <p className="text-2xl font-black text-[#0284C7]">약 3,372만 원</p>
              <p className="text-[10px] text-slate-400 mt-0.5">(대행사 300만 vs Pro 19만 원 기준)</p>
            </div>
          </div>
        </div>

        {/* 6. FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">
            자주 묻는 질문 (FAQ)
          </h2>
          <div className="space-y-3.5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                왜 복잡한 요금제 없이 월 19만 원 단일 요금제인가요?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                변호사님께 마케팅은 기능을 쪼개어 저가로 파는 소프트웨어가 아닌, <strong>"대행사를 없애고 실제 사건 수임을 만드는 단 하나의 완성된 시스템"</strong>이어야 하기 때문입니다. 판례 칼럼, 플레이스 관제, 진단 배너, CRM까지 수임에 필요한 모든 기능을 제한 없이 월 19만 원에 일괄 제공합니다.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                세금계산서 발행이 가능한가요?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                네, 100% 가능합니다. 결제 시 사업자등록번호를 입력해 주시면 매월 결제 즉시 국세청으로 전자세금계산서가 자동 발행되어 전액 경비 처리됩니다.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                변호사법 제23조 및 변협 광고 규정에 정말 안전한가요?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                PostSync Pro에는 '로가드 23 (LawGuard 23)' 실시간 검역 엔진이 기본 탑재되어 있어, 100% 승소 보장, 전관예우 표방, 최상급 우월성 주장, 부당 염가 유인 등 120대 변협 금칙어를 작성 즉시 0.05초 만에 차단하고 합법 대체 문구로 자동 순화합니다.
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0284C7]" />
                무료 체험 후 원치 않으면 자동 결제되나요?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                아닙니다. 가입 시 <strong>신용카드 번호를 요구하지 않으므로</strong> 원치 않는 자동 결제는 절대 발생하지 않습니다. 7일간 3편의 사건 칼럼과 진단 배너를 직접 써보시고, 실제 의뢰인 유입 효과를 확인하신 후 자율적으로 구독을 결정하시면 됩니다.
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
