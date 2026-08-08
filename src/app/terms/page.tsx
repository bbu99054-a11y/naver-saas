export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-slate-800">
      <h1 className="text-3xl font-bold mb-8">서비스 이용약관</h1>
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500 mb-8">마지막 업데이트: 2026년 8월</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">제 1 조 (목적)</h2>
        <p>본 약관은 PostSync(이하 "회사")가 제공하는 AI 블로그 자동화 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">제 2 조 (용어의 정의)</h2>
        <p>1. "서비스"란 회사가 제공하는 AI 기반 글쓰기, 검색증강생성(RAG), 그리고 관련 부가 기능을 의미합니다.</p>
        <p>2. "회원"이란 본 약관에 동의하고 회사와 서비스 이용계약을 체결한 자를 의미합니다.</p>
        
        <h2 className="text-xl font-bold mt-6 mb-3">제 3 조 (서비스의 제공 및 변경)</h2>
        <p>1. 회사는 회원에게 AI 기반의 텍스트 생성 서비스를 제공합니다.</p>
        <p>2. AI가 생성한 결과물에 대한 최종 검토 및 발행 책임은 전적으로 회원 본인에게 있으며, 회사는 생성된 결과물로 인해 발생하는 법적 문제(광고법 위반 등)에 대해 일체의 책임을 지지 않습니다.</p>
        
        {/* Placeholder for real terms */}
        <p className="mt-12 text-slate-400 italic">본 약관은 테스트용 임시 약관이며, 정식 서비스 오픈 전 표준 약관으로 대체될 예정입니다.</p>
      </div>
    </div>
  )
}
