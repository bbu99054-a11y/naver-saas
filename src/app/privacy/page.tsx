export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
      <h1 className="text-3xl font-bold mb-8">개인정보 처리방침</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500 mb-8">마지막 업데이트: 2026년 8월</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">1. 수집하는 개인정보의 항목</h2>
        <p>회사는 회원가입, 원활한 고객상담, 각종 서비스의 제공을 위해 아래와 같은 개인정보를 수집하고 있습니다.</p>
        <p>- 필수 항목: 이메일 주소, 비밀번호, 이름, 소속(직종)</p>
        <p>- 선택 항목: 네이버 아이디, 티스토리/워드프레스 인증 토큰 등</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">2. 개인정보의 수집 및 이용 목적</h2>
        <p>회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.</p>
        <p>- 서비스 제공에 관한 계약 이행 및 맞춤형 RAG 검색 엔진 제공</p>
        <p>- 회원 관리: 회원제 서비스 이용에 따른 본인확인, 불량회원의 부정 이용 방지</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">3. 개인정보의 보유 및 이용기간</h2>
        <p>원칙적으로, 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 관련 법령에서 정한 일정한 기간 동안 회원정보를 보관합니다.</p>
        
        {/* Placeholder for real privacy policy */}
        <p className="mt-12 text-slate-400 italic">본 약관은 테스트용 임시 방침이며, 정식 서비스 오픈 전 표준 방침으로 대체될 예정입니다.</p>
      </div>
    </div>
  )
}
