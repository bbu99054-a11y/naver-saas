import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Mail, MessageSquare, Clock, Building2, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: '고객센터 & 제휴 문의 | PostSync',
  description: 'PostSync AI 도입 문의, 기술 지원, 광고 컴플라이언스 상담 및 사업 제휴 안내입니다.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: '고객센터 & 제휴 문의 | PostSync',
    description: 'PostSync AI 도입 문의, 기술 지원, 광고 컴플라이언스 상담 및 사업 제휴 안내입니다.',
    url: 'https://postsyncapp.com/contact',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-400">홈으로 돌아가기</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">PostSync</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-semibold">Contact</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-12 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-4">
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            Customer Support & Partnership
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            고객센터 & 제휴 문의
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            PostSync 도입, B2B 대량 플랜, 기술 지원 및 업무 제휴에 관해 언제든지 문의해 주세요.
            영업일 기준 4시간 이내에 신속하게 답변해 드립니다.
          </p>
        </div>

        {/* 3대 핵심 문의 채널 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 카드 1: 이메일 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 border border-indigo-500/30">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">이메일 문의</h2>
              <p className="text-xs text-slate-400 mb-4">24시간 상시 접수 가능</p>
              <a 
                href="mailto:bu99054@naver.com?subject=[PostSync%20문의]%20"
                className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 underline break-all block mb-2"
              >
                bu99054@naver.com
              </a>
              <p className="text-xs text-slate-400">보조: contact@postsyncapp.com</p>
            </div>
            <a 
              href="mailto:bu99054@naver.com?subject=[PostSync%20문의]%20"
              className="mt-6 w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold text-center block transition-all shadow-md shadow-indigo-600/20"
            >
              이메일 보내기 →
            </a>
          </div>

          {/* 카드 2: 실시간 채팅 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">실시간 채팅 상담</h2>
              <p className="text-xs text-slate-400 mb-4">채널톡 1:1 실시간 응대</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                웹사이트 우측 하단의 <strong className="text-white">채널톡 아이콘</strong>을 클릭하시면 로그인 없이도 담당자와 즉시 대화가 가능합니다.
              </p>
            </div>
            <div className="mt-6 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <span className="text-[11px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                상담원 실시간 대기 중
              </span>
            </div>
          </div>

          {/* 카드 3: 운영 시간 */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-indigo-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white mb-1">고객센터 운영시간</h2>
              <p className="text-xs text-slate-400 mb-4">평일 주간 지원</p>
              <ul className="text-xs text-slate-300 space-y-2">
                <li>• <strong className="text-white">평일:</strong> 10:00 ~ 18:00</li>
                <li>• <strong className="text-white">점심시간:</strong> 12:30 ~ 13:30</li>
                <li>• <strong className="text-slate-400">주말/공휴일:</strong> 휴무 (이메일 순차 회신)</li>
              </ul>
            </div>
            <div className="mt-6 text-[11px] text-slate-400 text-center border-t border-white/5 pt-3">
              긴급 장애 문의는 365일 모니터링
            </div>
          </div>
        </div>

        {/* 회사 및 사업자 공식 고지 정보 */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">사업자 및 운영 정보</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <div><strong className="text-slate-400">상호명:</strong> 와이엠랩스 (YM Labs)</div>
            <div><strong className="text-slate-400">대표자:</strong> 유영무</div>
            <div>
              <strong className="text-slate-400">사업자등록번호:</strong> 736-48-01186 
              <a 
                href="https://www.ftc.go.kr/bizCommPop.do?wrkr_no=7364801186" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-400 hover:underline ml-1"
              >
                [사업자정보확인]
              </a>
            </div>
            <div><strong className="text-slate-400">개인정보보호책임자:</strong> 유영무 (bu99054@naver.com)</div>
            <div className="sm:col-span-2">
              <strong className="text-slate-400">사업장 소재지:</strong> 서울특별시 송파구 송파대로 345, 103동 204호(가락동, 헬리오시티)
            </div>
            <div className="sm:col-span-2">
              <strong className="text-slate-400">호스팅 서비스 제공:</strong> Vercel Inc.
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>대한민국 전자상거래법 및 개인정보보호법 준수 사업자</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/terms" className="hover:text-white transition-colors underline">이용약관</Link>
              <Link href="/privacy" className="hover:text-white transition-colors underline">개인정보 처리방침</Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
