import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles, ArrowLeft, Mail, Building2, ShieldCheck, HelpCircle, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: '고객지원 및 서비스 안내 | PostSync',
  description: 'PostSync 스마트플레이스 순위 분석 및 무료 마케팅 웹 유틸리티 이용 안내, 자주 묻는 질문(FAQ) 및 공식 지원 창구입니다.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/contact',
  },
  openGraph: {
    title: '고객지원 및 서비스 안내 | PostSync',
    description: 'PostSync 스마트플레이스 순위 분석 및 무료 마케팅 웹 유틸리티 이용 안내, 자주 묻는 질문(FAQ) 및 공식 지원 창구입니다.',
    url: 'https://www.postsyncapp.com/contact',
    type: 'website',
    images: [
      {
        url: 'https://www.postsyncapp.com/placesync_profile_A.jpg',
        width: 1200,
        height: 630,
        alt: '고객지원 및 서비스 안내 | PostSync',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '고객지원 및 서비스 안내 | PostSync',
    description: 'PostSync 스마트플레이스 순위 분석 및 무료 마케팅 웹 유틸리티 이용 안내, 자주 묻는 질문(FAQ) 및 공식 지원 창구입니다.',
    images: ['https://www.postsyncapp.com/placesync_profile_A.jpg'],
  },
}

const FAQS = [
  {
    q: '스마트플레이스 순위 조회는 정말 100% 무료인가요?',
    a: '네, 완전 무료입니다. 별도의 회원가입이나 유료 결제 없이 네이버 스마트플레이스 1위부터 20위까지의 실시간 노출 순위와 1위 매장 대비 4대 정량 격차(방문자리뷰·블로그리뷰·예약·쿠폰)를 즉시 실측할 수 있습니다.',
  },
  {
    q: '입력한 매장 정보나 원고 데이터가 외부 서버에 저장되나요?',
    a: '저장되지 않습니다. PostSync의 금칙어 스캐너(/adcheck), 매장 QR 빌더(/utm), 블로그 서식 변환기(/convert)는 100% 브라우저 메모리 로컬 연산으로 동작하여 외부 서버로 데이터를 전송하지 않습니다. 순위 조회기(/place) 역시 네이버 지도의 공개된 데이터만을 조회합니다.',
  },
  {
    q: '순위가 실제 스마트폰 검색 결과와 다르게 보이는 이유는 무엇인가요?',
    a: '개인 스마트폰은 평소 검색 기록, 위치 GPS, 로그인 계정에 따라 개인화된 검색 결과가 노출됩니다. PostSync는 개인화 왜곡을 배제하고 네이버 검색 로봇 기준의 객관적인 전국 표준 노출 순위를 측정합니다.',
  },
  {
    q: '제휴 제안이나 오류 제보는 어디로 보내면 되나요?',
    a: '기술 지원, 오류 제보, 비즈니스 제휴 문의는 아래 공식 지원 이메일(support@postsyncapp.com)로 보내주시면 운영팀에서 확인 후 순차적으로 검토합니다.',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-indigo-500/30 break-keep break-words">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-400">포털 홈으로 이동</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">PostSync</span>
            <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-semibold">Help Center</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center sm:text-left space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
            <span>PostSync Help &amp; Information Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            고객지원 및 서비스 안내
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-2xl">
            PostSync의 모든 도구는 무인 자동화 엔진으로 작동합니다. 이용 중 궁금하신 점은 아래 자주 묻는 질문(FAQ)을 통해 즉시 확인하실 수 있습니다.
          </p>
        </div>

        {/* 상시 자주 묻는 질문 아코디언 카드 */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-white/10">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">자주 묻는 질문 (FAQ)</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-slate-950/40 border border-white/5 rounded-xl p-5 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-white flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-1 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 공식 이메일 안내 카드 (단일 무인 창구) */}
        <section className="bg-gradient-to-br from-slate-950 to-indigo-950/60 border border-indigo-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-300">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>공식 고객지원 이메일</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              추가 문의 및 기술 지원
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg leading-relaxed">
              FAQ 외에 시스템 장애나 비즈니스 제휴 관련 문의는 아래 이메일로 보내주시면 담당 부서에서 순차적으로 확인합니다.
            </p>
          </div>
          <a
            href="mailto:support@postsyncapp.com?subject=[PostSync%20문의]%20"
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition text-center shadow-md shadow-indigo-600/20 shrink-0"
          >
            support@postsyncapp.com 메일 보내기 →
          </a>
        </section>

        {/* 사업자 공식 고지 정보 */}
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
            <div><strong className="text-slate-400">개인정보보호책임자:</strong> 유영무 (support@postsyncapp.com)</div>
            <div className="sm:col-span-2">
              <strong className="text-slate-400">사업장 소재지:</strong> 서울특별시 송파구 송파대로 345, 103동 204호 (가락동, 헬리오시티)
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
