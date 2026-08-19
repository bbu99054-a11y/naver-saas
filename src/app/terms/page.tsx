import Link from 'next/link'
import { Sparkles, ArrowLeft } from 'lucide-react'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-400">메인으로 돌아가기</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white">PostSync</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10 pb-6 border-b border-white/10">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Legal Terms
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2">서비스 이용약관</h1>
          <p className="text-sm text-slate-400">시행일자: 2026년 8월 18일 | 최종 수정일: 2026년 8월 19일</p>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed text-sm md:text-base">
          {/* 제 1 조 */}
          <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg md:text-xl font-bold text-white mb-3">제 1 조 (목적)</h2>
            <p>
              본 약관은 <strong>와이엠랩스(YM Labs)</strong>(이하 "회사")가 운영하는 웹사이트(<strong>https://postsyncapp.com</strong>) 및 
              PostSync 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무, 책임사항 및 기타 필요한 제반 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제 2 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 2 조 (용어의 정의)</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>"서비스"</strong>란 회사가 제공하는 AI 기반 전문직 블로그 SEO 원고 생성, 검색증강생성(RAG), 스마트 클립보드 서식 복사 및 관련 부가 소프트웨어 일체를 의미합니다.</li>
              <li><strong>"회원"</strong>이란 본 약관에 동의하고 회사에 개인정보를 제공하여 회원등록을 한 자로서, 회사의 서비스를 지속적으로 이용할 수 있는 자를 의미합니다.</li>
              <li><strong>"크레딧(Credit)"</strong>이란 서비스 내에서 AI 원고 생성 및 프리미엄 기능을 이용하기 위해 회원이 결제하거나 무상으로 지급받는 디지털 이용권을 의미합니다.</li>
              <li><strong>"유료 서비스"</strong>란 회원이 별도의 대가를 지급하고 구매하는 크레딧 충전 및 정기 구독 플랜을 의미합니다.</li>
            </ul>
          </section>

          {/* 제 3 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 3 조 (약관의 효력 및 변경)</h2>
            <p>1. 회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면 또는 연결 화면에 게시합니다.</p>
            <p>2. 회사는 전자상거래 등에서의 소비자보호에 관한 법률, 약관의 규제에 관한 법률 등 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
            <p>3. 약관이 변경될 경우 회사는 적용일자 및 개정사유를 명시하여 적용일자 7일 전(회원에게 불리한 변경의 경우 30일 전)부터 공지합니다.</p>
          </section>

          {/* 제 4 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 4 조 (이용계약의 체결 및 계정 관리)</h2>
            <p>1. 이용계약은 회원이 되고자 하는 자가 약관의 내용에 동의한 다음 회원가입 신청을 하고 회사가 이를 승낙함으로써 성립합니다.</p>
            <p>2. 회원은 본인의 계정 및 비밀번호를 철저히 관리해야 하며, 제3자에게 양도하거나 대여할 수 없습니다.</p>
            <p>3. 타인의 명의나 이메일을 도용하여 가입한 경우 일체의 법적 보호를 받을 수 없으며 관련 법령에 따라 처벌받을 수 있습니다.</p>
          </section>

          {/* 제 5 조 */}
          <section className="bg-indigo-950/30 p-6 rounded-2xl border border-indigo-500/20 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-indigo-300">제 5 조 (유료 결제 및 환불 규정)</h2>
            <p>1. 회원은 회사가 제공하는 결제 수단(토스페이먼츠 등 신용카드, 간편결제)을 통해 유료 크레딧 및 구독 서비스를 구매할 수 있습니다.</p>
            <p>2. <strong>청약철회(환불) 원칙:</strong></p>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              <li>결제 후 7일 이내에 충전된 크레딧을 <strong>전혀 사용하지 않은 경우</strong> 전액 환불이 가능합니다.</li>
              <li>크레딧을 일부 사용한 경우, 디지털 콘텐츠의 특성상 사용된 분량 및 결제 수수료를 공제한 잔여 금액에 대해 환불을 진행합니다.</li>
              <li>무료로 지급된 프로모션 크레딧은 현금으로 환불되지 않습니다.</li>
            </ul>
            <p>3. 환불 신청은 고객센터(<a href="mailto:bu99054@naver.com" className="text-indigo-400 underline">bu99054@naver.com</a>)를 통해 접수할 수 있습니다.</p>
          </section>

          {/* 제 6 조 */}
          <section className="bg-rose-950/20 p-6 rounded-2xl border border-rose-500/20 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-rose-300">제 6 조 (AI 생성 콘텐츠에 관한 면책 및 이용자 책임)</h2>
            <p>1. 회사의 서비스는 생성형 인공지능(Generative AI) 기술을 활용하여 원고 초안 및 마케팅 구조를 제안하는 보조 도구입니다.</p>
            <p>2. AI 생성물의 특성상 사실과 다른 내용(환각 현상) 또는 부정확한 정보가 포함될 수 있으므로, <strong>회원은 발행 전 반드시 결과물의 사실 여부, 법률/의료/세무 등 직종별 광고 규제 준수 여부를 직접 검토하고 수정해야 합니다.</strong></p>
            <p>3. 회원이 AI 생성 결과물을 검토 없이 외부 플랫폼(네이버 블로그, 티스토리, 워드프레스 등)에 게시하여 발생하는 법적 분쟁(의료법 위반, 변호사법 위반, 저작권 분쟁 등)에 대하여 회사는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</p>
          </section>

          {/* 제 7 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 7 조 (지식재산권의 귀속)</h2>
            <p>1. 회사가 작성한 서비스 소프트웨어, 알고리즘, UI/UX, 상표 및 디자인에 관한 저작권 및 기타 지식재산권은 회사에 귀속됩니다.</p>
            <p>2. 회원이 서비스를 통해 생성한 원고 텍스트 결과물의 저작권 및 사용 권한은 관련 법령이 허용하는 범위 내에서 회원 본인에게 귀속됩니다.</p>
          </section>

          {/* 제 8 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 8 조 (면책 및 분쟁 해결)</h2>
            <p>1. 회사는 천재지변, 정전, 디도스(DDoS) 공격, 기간통신사업자의 회선 장애 등 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한 책임이 면제됩니다.</p>
            <p>2. 서비스 이용과 관련하여 회사와 회원 간에 발생한 분쟁은 대한민국 법을 준거법으로 하며, 회사의 본점 소재지를 관할하는 법원을 전속관할 법원으로 합니다.</p>
          </section>

          {/* 사업자 고지 박스 */}
          <div className="mt-12 pt-8 border-t border-white/10 text-xs text-slate-400 space-y-1 bg-white/[0.02] p-6 rounded-xl">
            <h3 className="font-bold text-white mb-2 text-sm">사업자 정보</h3>
            <p><strong>상호명:</strong> 와이엠랩스 (YM Labs) | <strong>대표자:</strong> 유영무</p>
            <p><strong>사업자등록번호:</strong> 736-48-01186 | <strong>주소:</strong> 서울특별시 송파구 송파대로 345, 103동 204호(가락동, 헬리오시티)</p>
            <p><strong>문의 이메일:</strong> bu99054@naver.com | <strong>서비스 도메인:</strong> https://postsyncapp.com</p>
          </div>
        </div>
      </main>
    </div>
  )
}
