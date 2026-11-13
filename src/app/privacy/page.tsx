import { Metadata } from 'next'
import { ShieldCheck } from 'lucide-react'
import GlobalHeader from '@/components/common/GlobalHeader'

export const metadata: Metadata = {
  title: '개인정보 처리방침 | PostSync',
  description: 'PostSync 웹 서비스의 개인정보 처리방침 및 보호 조치 안내.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/privacy',
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 break-keep break-words">
      {/* Header */}
      <GlobalHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10 pb-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 w-fit">
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy Policy
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2">개인정보 처리방침</h1>
          <p className="text-sm text-slate-400">시행일자: 2026년 8월 18일 | 최종 수정일: 2026년 11월 13일</p>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed text-sm md:text-base">
          {/* 개요 */}
          <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <p>
              <strong>와이엠랩스(YM Labs)</strong>(이하 &quot;회사&quot;)는 『개인정보 보호법』 및 관련 법령을 준수하며,
              <strong>PostSync</strong>(<strong>https://www.postsyncapp.com</strong>) 서비스를 이용하는 정보주체의 개인정보를 안전하게 보호하고
              이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
          </section>

          {/* 1. 수집 항목 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">1. 수집하는 개인정보의 항목 및 수집 방법</h2>
            <div className="bg-slate-800/60 p-4 rounded-xl space-y-2 border border-white/5">
              <p><strong>가. 신규 기능 출시 사전 알림 신청 시 (선택 이용 기능):</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li><strong>필수 항목:</strong> 감시 대상 매장 상호명, 휴대폰 번호, 조회 키워드</li>
                <li><strong>수집 방법:</strong> 웹페이지 폼 입력을 통한 이용자의 명시적 직접 동의 및 수집 (연락처는 AES 암호화하여 보관합니다)</li>
              </ul>
              <p className="pt-2"><strong>나. 무료 웹 유틸리티 및 순위 조회 이용 시 (별도 회원가입 없음):</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>금칙어 검사기(/adcheck), 리뷰 QR 생성기(/utm), 서식 변환기(/convert), 상세페이지 분할기(/crop), 글자수 계산기(/byte), HWPX 뷰어(/hwpx)는 브라우저 로컬 연산으로 동작하며 입력한 원문이나 파일을 서버에 저장하지 않습니다.</li>
                <li>순위 조회기(/place)는 네이버 지도의 공개된 매장 데이터를 조회하며, AI 소개글·답글 생성기(/reply)는 초안 생성을 위해 입력한 매장 키워드 및 리뷰 문구만 일회성 API 요청으로 처리합니다.</li>
              </ul>
              <p className="pt-2"><strong>다. 서비스 이용 과정에서 자동 생성·수집되는 정보:</strong></p>
              <ul className="list-disc pl-5 space-y-1 text-slate-300">
                <li>접속 IP(어뷰징 및 과도한 자동 호출 방어 목적), 쿠키(Cookie), 방문 통계(Google Analytics), 제3자 광고 서비스(Google AdSense) 쿠키</li>
              </ul>
            </div>
          </section>

          {/* 2. 이용 목적 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">2. 개인정보의 처리 목적</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>출시 사전 알림 발송:</strong> 플레이스 일일 순위·경쟁사 알림 기능 정식 출시 시 신청 이용자에 대한 순차 오픈 안내</li>
              <li><strong>서비스 제공 및 안정적 운영:</strong> 무료 플레이스 순위 분석 및 웹 유틸리티 제공, 비정상 대량 트래픽(매크로) 차단</li>
              <li><strong>고객 문의 응대 및 품질 개선:</strong> 이메일 문의를 통한 오류 제보·고충 처리 및 서비스 접속 통계 분석</li>
            </ul>
          </section>

          {/* 3. 보유 및 파기 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">3. 개인정보의 보유 및 이용 기간</h2>
            <p>회사는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관련 법령의 규정에 의하여 보존할 필요가 있는 경우 다음과 같이 법령에서 정한 기간 동안 보관합니다.</p>
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
                    <td className="p-3">출시 사전 알림 신청 기록</td>
                    <td className="p-3">정보주체 동의 (개인정보 보호법)</td>
                    <td className="p-3 text-emerald-400 font-semibold">출시 안내 완료 시 또는 삭제 요청 시 즉시 파기 (최대 1년)</td>
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
            <p>회사는 안정적인 클라우드 인프라 및 AI 응답 생성, 운영 알림 처리를 위하여 다음과 같이 전문 업체에 업무를 위탁하고 있습니다.</p>
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
                    <td className="p-3 font-medium text-white">Vercel, Inc.</td>
                    <td className="p-3">웹 애플리케이션 호스팅 및 엣지 서버 운영</td>
                    <td className="p-3">미국</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white">Supabase, Inc.</td>
                    <td className="p-3">사전 알림 신청 기록 암호화 데이터베이스 인프라 운영</td>
                    <td className="p-3">미국 (AWS 리전)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white">Google LLC (Gemini API)</td>
                    <td className="p-3">AI 소개글·답글 초안 생성 API 처리 (개인식별정보 미포함)</td>
                    <td className="p-3">미국</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium text-white">Resend, Inc.</td>
                    <td className="p-3">운영 관리자 접수 알림 이메일 발송 시스템 처리</td>
                    <td className="p-3">미국</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5. 제3자 제공 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">5. 개인정보의 제3자 제공</h2>
            <p>
              회사는 이용자의 개인정보를 제1조에서 고지한 범위 내에서만 처리하며, 정보주체의 별도 동의나 법률의 특별한 규정 등 『개인정보 보호법』 제17조 및 제18조에 해당하는 경우를 제외하고는 이용자의 개인정보를 제3자에게 제공하지 않습니다.
            </p>
          </section>

          {/* 6. 개인정보보호 책임자 */}
          <section className="bg-indigo-950/30 p-6 rounded-2xl border border-indigo-500/20 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-indigo-300">6. 개인정보 보호책임자 및 고충 처리</h2>
            <p>회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 정보주체의 권익 구제, 열람·정정·삭제 요청 및 불만 처리를 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.</p>
            <div className="pt-2 text-sm text-slate-300 space-y-1">
              <p><strong>[개인정보 보호책임자]</strong></p>
              <p>• 성명: 유영무</p>
              <p>• 직책: 대표 / 개인정보보호책임자(CPO)</p>
              <p>• 이메일: <a href="mailto:support@postsyncapp.com" className="text-indigo-400 underline">support@postsyncapp.com</a></p>
              <p>• 상호: 와이엠랩스 (YM Labs)</p>
              <p>• 주소: 서울특별시 송파구 송파대로 345, 103동 204호(가락동, 헬리오시티)</p>
            </div>
          </section>

          {/* 권익침해 구제방법 */}
          <section className="space-y-3 text-xs md:text-sm text-slate-400">
            <h2 className="text-base md:text-lg font-bold text-white">7. 권익침해 구제방법</h2>
            <p>정보주체는 아래 기관에 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>개인정보분쟁조정위원회: (국번없이) 1833-6972 (www.kopico.go.kr)</li>
              <li>개인정보침해신고센터: (국번없이) 118 (privacy.kisa.or.kr)</li>
              <li>대검찰청 사이버수사과: (국번없이) 1301 (www.spo.go.kr)</li>
              <li>경찰청 사이버수사국: (국번없이) 182 (ecrm.police.go.kr)</li>
            </ul>
          </section>

          {/* 제3자 광고 쿠키(Google AdSense) 및 맞춤형 광고 거부 안내 */}
          <section className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-3 text-xs md:text-sm text-slate-300">
            <h2 className="text-base md:text-lg font-bold text-white">
              8. 제3자 광고 서비스(Google AdSense) 및 쿠키(Cookie) 사용 안내
            </h2>
            <p>
              회사는 무료 웹 도구와 정보 칼럼 서비스를 지속 제공하기 위해 Google LLC가 제공하는 광고 서비스(Google AdSense) 및 통계 분석 도구(Google Analytics)를 사용할 수 있습니다.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>제3자 광고 쿠키 사용:</strong> Google을 포함한 제3자 광고 사업자는 이용자의 본 웹사이트 또는 타 웹사이트 이전 방문 기록을 바탕으로 관심 기반 맞춤형 광고를 게재하기 위해 쿠키(DART 쿠키 등)를 사용할 수 있습니다.
              </li>
              <li>
                <strong>맞춤형 광고 수신 거부(Opt-out):</strong> 이용자는{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline hover:text-indigo-300"
                >
                  Google 광고 설정(adssettings.google.com)
                </a>
                을 방문해 맞춤형 광고 사용을 해제하거나,{' '}
                <a
                  href="https://www.aboutads.info/choices"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-400 underline hover:text-indigo-300"
                >
                  www.aboutads.info/choices
                </a>
                에서 제3자 광고 사업자의 쿠키 사용을 거부할 수 있으며, 사용 중인 웹 브라우저 설정을 통해 쿠키 저장 자체를 차단할 수도 있습니다.
              </li>
              <li>
                <strong>제휴 파트너 링크 고지:</strong> 향후 서비스 내 일부 권장 비품 안내 영역에 외부 제휴 링크가 포함되는 경우 본문과 명확히 구분하여 대가성 고지 문구 및 <code className="text-xs bg-slate-800 px-1.5 py-0.5 rounded">sponsored</code> 속성을 함께 표기합니다.
              </li>
            </ul>
          </section>

          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <span>© 2026 PostSync (와이엠랩스 · YM Labs)</span>
            <div className="flex flex-wrap items-center gap-4">
              <a href="/about" className="hover:text-white underline">서비스 소개</a>
              <a href="/terms" className="hover:text-white underline">이용약관</a>
              <a href="/contact" className="hover:text-white underline">고객지원</a>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
