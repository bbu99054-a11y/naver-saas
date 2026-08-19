import Link from 'next/link'
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function PrivacyPage() {
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
          <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2">개인정보 처리방침</h1>
          <p className="text-sm text-slate-400">시행일자: 2026년 8월 18일 | 최종 수정일: 2026년 8월 19일</p>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed text-sm md:text-base">
          {/* 개요 */}
          <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p>
              <strong>와이엠랩스(YM Labs)</strong>(이하 "회사")는 『개인정보 보호법』 및 관련 법령을 준수하며, 
              <strong>PostSync</strong>(<strong>https://postsyncapp.com</strong>) 서비스를 이용하는 정보주체의 개인정보를 안전하게 보호하고 
              이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
          </section>

          {/* 1. 수집 항목 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">1. 수집하는 개인정보의 항목 및 수집 방법</h2>
            <div className="bg-slate-800/60 p-4 rounded-xl space-y-2 border border-white/5">
              <p><strong>가. 회원가입 및 서비스 이용 시 수집 항목:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>필수 항목:</strong> 이메일 주소, 비밀번호(암호화 단방향 해시), 이름(닉네임), 직종/분야</li>
                <li><strong>유료 결제 시:</strong> 주문번호, 결제키, 결제금액, 승인일시 (신용카드 번호 등 민감 금융 정보는 PG사 토스페이먼츠에서 직접 암호화 처리하며 회사는 저장하지 않습니다)</li>
                <li><strong>선택 항목 (연동 시):</strong> 워드프레스/티스토리 API 연동 토큰(AES-256 암호화 저장)</li>
              </ul>
              <p className="pt-2"><strong>나. 서비스 이용 과정에서 자동 생성·수집되는 정보:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>접속 IP 정보, 쿠키(Cookie), 서비스 이용 기록, 접속 로그, 불량 이용 기록</li>
              </ul>
            </div>
          </section>

          {/* 2. 이용 목적 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">2. 개인정보의 처리 목적</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>서비스 제공 및 계약의 이행:</strong> 맞춤형 AI 블로그 SEO 원고 생성 엔진 제공, 크레딧 결제 및 정산, 콘텐츠 저장/보관</li>
              <li><strong>회원 관리:</strong> 회원제 서비스 이용에 따른 본인 식별·인증, 불량 회원의 부정이용 방지, 가입의사 확인, 고객 문의 대응</li>
              <li><strong>신규 서비스 개발 및 통계 분석:</strong> AI 프롬프트 품질 개선, 서비스 접속 빈도 및 통계적 이용 분석</li>
            </ul>
          </section>

          {/* 3. 보유 및 파기 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">3. 개인정보의 보유 및 이용 기간</h2>
            <p>회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 다음과 같이 관계 법령에서 정한 기간 동안 보관합니다.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left border border-white/10 rounded-lg overflow-hidden mt-3">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-3 border-b border-white/10">보존 항목</th>
                    <th className="p-3 border-b border-white/10">근거 법령</th>
                    <th className="p-3 border-b border-white/10">보존 기간</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-900/50">
                  <tr>
                    <td className="p-3">계약 또는 청약철회 등에 관한 기록</td>
                    <td className="p-3">전자상거래 등에서의 소비자보호에 관한 법률</td>
                    <td className="p-3 text-indigo-300 font-semibold">5년</td>
                  </tr>
                  <tr>
                    <td className="p-3">대금결제 및 재화 등의 공급에 관한 기록</td>
                    <td className="p-3">전자상거래 등에서의 소비자보호에 관한 법률</td>
                    <td className="p-3 text-indigo-300 font-semibold">5년</td>
                  </tr>
                  <tr>
                    <td className="p-3">소비자의 불만 또는 분쟁처리에 관한 기록</td>
                    <td className="p-3">전자상거래 등에서의 소비자보호에 관한 법률</td>
                    <td className="p-3 text-indigo-300 font-semibold">3년</td>
                  </tr>
                  <tr>
                    <td className="p-3">웹사이트 접속 기록 및 로그</td>
                    <td className="p-3">통신비밀보호법</td>
                    <td className="p-3 text-indigo-300 font-semibold">3개월</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. 처리위탁 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">4. 개인정보 처리업무의 위탁 및 국외 이전</h2>
            <p>회사는 원활한 글로벌 클라우드 및 AI 서비스 제공을 위하여 다음과 같이 전문 업체에 개인정보 처리를 위탁하고 있습니다.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left border border-white/10 rounded-lg overflow-hidden mt-3">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-3 border-b border-white/10">수탁 업체</th>
                    <th className="p-3 border-b border-white/10">위탁 업무 내용</th>
                    <th className="p-3 border-b border-white/10">위치</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-slate-900/50">
                  <tr>
                    <td className="p-3 font-medium text-white">Supabase, Inc.</td>
                    <td className="p-3">회원 인증 및 데이터베이스 인프라 운영</td>
                    <td className="p-3">미국 (AWS 리전)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white">Vercel, Inc.</td>
                    <td className="p-3">웹 애플리케이션 호스팅 및 엣지 서버 운영</td>
                    <td className="p-3">미국</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white">토스페이먼츠(주)</td>
                    <td className="p-3">전자결제(PG) 대행 및 결제 승인/영수증 발급</td>
                    <td className="p-3">대한민국</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white">OpenAI / Anthropic</td>
                    <td className="p-3">AI 텍스트 생성 API 처리 (개인정보 식별 불가능한 프롬프트 전달)</td>
                    <td className="p-3">미국</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. 개인정보보호 책임자 */}
          <section className="bg-indigo-950/30 p-6 rounded-2xl border border-indigo-500/20 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-indigo-300">5. 개인정보 보호책임자 및 고충 처리</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의 권익 구제 및 불만 처리를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div className="pt-2 text-sm text-slate-300 space-y-1">
              <p><strong>[개인정보 보호책임자]</strong></p>
              <p>• 성명: 유영무</p>
              <p>• 직책: 대표 / 개인정보보호최고책임자(CPO)</p>
              <p>• 이메일: <a href="mailto:bu99054@naver.com" className="text-indigo-400 underline">bu99054@naver.com</a></p>
              <p>• 상호: 와이엠랩스 (YM Labs)</p>
              <p>• 주소: 서울특별시 송파구 송파대로 345, 103동 204호(가락동, 헬리오시티)</p>
            </div>
          </section>

          {/* 권익침해 구제방법 */}
          <section className="space-y-3 text-xs md:text-sm text-slate-400">
            <h2 className="text-base md:text-lg font-bold text-white">6. 권익침해 구제방법</h2>
            <p>정보주체는 아래 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
              <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
              <li>대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)</li>
              <li>경찰청 사이버수사국: (국번없이) 182 (ecrm.police.go.kr)</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  )
}
