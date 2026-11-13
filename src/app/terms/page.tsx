import { Metadata } from 'next'
import GlobalHeader from '@/components/common/GlobalHeader'

export const metadata: Metadata = {
  title: '서비스 이용약관 | PostSync',
  description: 'PostSync 스마트플레이스 분석 및 무료 마케팅 웹 유틸리티 서비스 이용약관 안내.',
  alternates: {
    canonical: 'https://www.postsyncapp.com/terms',
  },
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 break-keep break-words">
      {/* Header */}
      <GlobalHeader />

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-10 pb-6 border-b border-white/10">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            Legal Terms
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2">서비스 이용약관</h1>
          <p className="text-sm text-slate-400">시행일자: 2026년 8월 18일 | 최종 수정일: 2026년 11월 13일</p>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed text-sm md:text-base">
          {/* 제 1 조 */}
          <section className="bg-white/5 p-6 rounded-2xl border border-white/5">
            <h2 className="text-lg md:text-xl font-bold text-white mb-3">제 1 조 (목적)</h2>
            <p>
              본 약관은 <strong>와이엠랩스(YM Labs)</strong>(이하 &quot;회사&quot;)가 운영하는 웹사이트(<strong>https://www.postsyncapp.com</strong>) 및
              PostSync 웹 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여 회사와 이용자 간의 권리, 의무, 책임사항 및 기타 필요한 제반 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          {/* 제 2 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 2 조 (서비스의 내용 및 이용)</h2>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li><strong>무료 플레이스 분석 및 웹 유틸리티:</strong> 회사는 별도 회원가입 없이 이용할 수 있는 네이버 스마트플레이스 순위 조회·비교 도구, 매장 리뷰 QR 생성기, AI 소개글·답글 초안 생성기, 광고 규정 금칙어 검사기 및 관련 웹 유틸리티를 제공합니다.</li>
              <li><strong>출시 사전 알림 신청:</strong> 회사는 신규 기능 정식 출시 전 안내를 희망하는 이용자의 동의를 받아 사전 알림 신청을 접수할 수 있습니다.</li>
              <li><strong>서비스 변경 및 중단:</strong> 회사는 시스템 점검, 외부 플랫폼 구조 변경 또는 운영상 필요에 따라 무료 서비스의 전부 또는 일부를 수정·변경·중단할 수 있으며, 이 경우 사이트 내 공지를 통해 안내합니다.</li>
            </ul>
          </section>

          {/* 제 3 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 3 조 (약관의 효력 및 변경)</h2>
            <p>1. 회사는 본 약관의 내용을 이용자가 쉽게 알 수 있도록 웹사이트 연결 화면에 게시합니다.</p>
            <p>2. 회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있습니다.</p>
            <p>3. 약관이 변경될 경우 회사는 적용일자 및 개정사유를 명시하여 적용일자 7일 전(이용자에게 불리한 변경의 경우 30일 전)부터 웹사이트에 공지합니다.</p>
          </section>

          {/* 제 4 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 4 조 (이용자의 의무 및 금지 행위)</h2>
            <p>1. 이용자는 정상적인 브라우저 사용 범위 내에서 서비스를 이용해야 하며, 자동화된 스크립트·봇·크롤러를 이용한 과도한 대량 호출로 서버 자원을 고갈시키는 행위를 해서는 안 됩니다.</p>
            <p>2. 타인의 연락처나 매장 정보를 무단 도용하여 사전 알림이나 문의를 접수하는 경우 관련 법령에 따른 책임을 질 수 있습니다.</p>
          </section>

          {/* 제 5 조 */}
          <section className="bg-indigo-950/30 p-6 rounded-2xl border border-indigo-500/20 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-indigo-300">제 5 조 (조회 데이터 및 지표 안내에 관한 유의사항)</h2>
            <p>1. 스마트플레이스 순위 조회 결과는 검색 시점의 공개 웹 데이터를 바탕으로 산출한 참고 지표이며, 사용자의 개인화 검색 기록·GPS 위치·네이버 내부 업데이트에 따라 실제 모바일 화면과 차이가 발생할 수 있습니다.</p>
            <p>2. 일부 항목이 검색 결과에서 확인되지 않는 경우 임의 추정치 대신 미측정 상태로 표시되며, 정확한 최종 매장 지표는 네이버 스마트플레이스 공식 관리자 페이지에서 직접 확인하시기 바랍니다.</p>
          </section>

          {/* 제 6 조 */}
          <section className="bg-rose-950/20 p-6 rounded-2xl border border-rose-500/20 space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-rose-300">제 6 조 (AI 생성 결과물 및 금칙어 검수 결과에 관한 면책)</h2>
            <p>1. 회사의 AI 소개글·답글 생성기 및 광고 금칙어 검사기는 작성과 1차 점검을 돕는 보조 도구입니다.</p>
            <p>2. AI 생성물에는 부정확한 표현이 포함될 수 있고 법정 광고 규제 기준은 수시로 개정되므로, <strong>이용자는 외부 플랫폼에 게시하기 전 반드시 사실 여부와 의료법·변호사법·세무사법·표시광고법 등 직종별 광고 규제 준수 여부를 직접 검토·수정해야 합니다.</strong></p>
            <p>3. 이용자가 검토 없이 결과물을 외부 플랫폼에 게시하여 발생하는 분쟁에 대하여 회사는 고의 또는 중과실이 없는 한 책임을 지지 않습니다.</p>
          </section>

          {/* 제 7 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 7 조 (지식재산권의 귀속)</h2>
            <p>1. 회사가 작성한 서비스 소프트웨어, UI/UX, 상표 및 칼럼 콘텐츠에 관한 저작권과 지식재산권은 회사에 귀속됩니다.</p>
            <p>2. 이용자가 도구를 통해 직접 작성·변환한 텍스트 및 이미지 결과물에 관한 권한은 관련 법령이 허용하는 범위 내에서 이용자 본인에게 귀속됩니다.</p>
          </section>

          {/* 제 8 조 */}
          <section className="space-y-3">
            <h2 className="text-lg md:text-xl font-bold text-white">제 8 조 (면책 및 분쟁 해결)</h2>
            <p>1. 회사는 천재지변, 정전, 디도스(DDoS) 공격, 외부 검색 플랫폼의 구조 변경 및 장애 등 불가항력으로 인해 서비스를 제공할 수 없는 경우 책임을 면제받습니다.</p>
            <p>2. 서비스 이용과 관련하여 회사와 이용자 간에 발생한 분쟁은 대한민국 법을 준거법으로 하며, 회사 본점 소재지 관할 법원을 전속관할 법원으로 합니다.</p>
          </section>

          {/* 사업자 고지 박스 */}
          <div className="mt-12 pt-8 border-t border-white/10 text-xs text-slate-400 space-y-1 bg-white/[0.02] p-6 rounded-xl">
            <h3 className="font-bold text-white mb-2 text-sm">사업자 정보</h3>
            <p><strong>상호명:</strong> 와이엠랩스 (YM Labs) | <strong>대표자:</strong> 유영무</p>
            <p><strong>사업자등록번호:</strong> 736-48-01186 | <strong>주소:</strong> 서울특별시 송파구 송파대로 345, 103동 204호(가락동, 헬리오시티)</p>
            <p><strong>문의 이메일:</strong> support@postsyncapp.com | <strong>서비스 도메인:</strong> https://www.postsyncapp.com</p>
          </div>
        </div>
      </main>
    </div>
  )
}
