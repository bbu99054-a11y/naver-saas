'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  ArrowRight, 
  Lock, 
  Zap, 
  Users, 
  Briefcase, 
  FileText, 
  PenTool, 
  TrendingUp, 
  Sparkles, 
  Star, 
  Quote,
  PhoneCall,
  Calendar,
  Layers,
  Scale,
  Calculator,
  Check,
  MapPin
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FAQ_ITEMS = [
  {
    q: '변호사법 제23조 및 세무사법 제12조 광고 규정에 정말 안전한가요?',
    a: '네, 100% 안전합니다. PostSync Pro는 "100% 승소 보장", "환급율 1위", "최고/유일", "전관예우 암시" 등 대한변호사협회 및 한국세무사회 광고 규정상 금지된 표현을 실시간으로 감지하여 안전하고 객관적인 전문직 언어로 자동 순화합니다.'
  },
  {
    q: '생성된 글을 네이버 블로그에 복사해서 붙여넣어도 저품질에 걸리지 않나요?',
    a: '기계적인 단순 텍스트 나열이 아닌, 네이버 스마트블록과 C-Rank 로직에 맞춘 [상황 공감 ➔ 핵심 쟁점 ➔ 관련 법령·판례 ➔ 대응 절차] 4단 구조로 작성됩니다. 또한 네이버 스마트에디터 ONE 서식 그대로 원클릭 복사되어 저품질 위험 없이 검색 상위 노출에 최적화됩니다.'
  },
  {
    q: '사건 1분 안심 진단 폼은 제 블로그나 홈페이지에 어떻게 연결하나요?',
    a: '대시보드에서 원클릭으로 제공되는 [네이버 블로그 본문 삽입용 HTML 배너 코드]를 복사하여 글 하단에 붙여넣기만 하시면 됩니다. 모바일과 PC 화면에 맞춰 자동으로 반응형 배너가 생성되며, 잠재 의뢰인이 30초 만에 비밀 상담을 남기게 됩니다.'
  },
  {
    q: '접수된 의뢰인 정보는 어떻게 저에게 실시간으로 전달되나요?',
    a: '의뢰인이 진단 폼을 제출하는 즉시 대표님의 휴대폰(카카오 알림톡/문자/텔레그램)으로 실시간 알림이 전송됩니다. 동시에 PostSync Pro 수임 파이프라인 CRM 대시보드의 [신규 접수] 칸에 자동으로 카드가 등록되어 골든타임 10분 내 유선 연결이 가능합니다.'
  },
  {
    q: '이용 요금과 계약 조건은 어떻게 되나요?',
    a: '별도의 장기 의무 약정 없이 언제든 자유롭게 시작하고 해지하실 수 있습니다. 가입 즉시 무료 크레딧이 제공되며, 1분 진단 폼과 수임 파이프라인 CRM의 핵심 기능을 무료로 즉시 체험해 보실 수 있습니다.'
  }
]

const CLIENT_REVIEWS = [
  {
    name: '박현우 대표 변호사',
    office: '법무법인 율정 (형사 전문)',
    role: '서초동 형사 전문',
    result: '월 수임 5건 순증',
    text: '월 200만 원씩 주던 마케팅 대행사를 해지하고 PostSync Pro로 바꿨습니다. 음주운전 구제 칼럼 하단에 1분 진단 폼을 붙였더니 한 달 만에 구속영장 기각 사건 등 알짜배기 사건 5건을 직접 수임했습니다.'
  },
  {
    name: '정성훈 대표 세무사',
    office: '세무회계 정인 (상속·양도 전문)',
    role: '강남 상속세 전문',
    result: '고액 상속세 3건 체결',
    text: '세무사법 광고 규정 때문에 온라인 홍보를 망설였는데, 광고 법규 안심 체크 덕분에 마음 편히 포스팅하고 있습니다. 송파·강남 아파트 상속세 감정평가 글 하나로 자산가 상담이 매주 쏟아집니다.'
  },
  {
    name: '이지안 파트너 변호사',
    office: '법률사무소 다온 (가사/이혼)',
    role: '양재동 이혼·재산분할',
    result: '상담 전환율 +310%',
    text: '진단 폼을 거쳐서 들어오는 의뢰인들은 이미 본인의 상황과 원하는 점을 정리해서 남겨주기 때문에, 1차 유선 통화 5분 만에 방문 상담과 정식 수임 계약으로 곧바로 이어집니다.'
  },
  {
    name: '최원석 대표 노무사',
    office: '노무법인 신의 (노동·산재)',
    role: '구로디지털단지 기업 자문',
    result: '월 기장 자문사 8곳 유치',
    text: '수습기간 만료 통보, 부당해고 구제신청 등 실무 쟁점 글을 쓴 뒤 Lawmatics형 수임 파이프라인으로 일정을 관리하니 놓치는 의뢰인이 0건이 되었습니다. 마케팅과 CRM이 하나로 끝납니다.'
  }
]

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx)
  }

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-[#E0F2FE] selection:text-[#0284C7]">
      {/* ========================================================================= */}
      {/* 🌟 1. Lawmatics 스타일 클린 화이트 상단 헤더 */}
      {/* ========================================================================= */}
      <header className="h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
            <span className="w-8 h-8 rounded-xl bg-[#0284C7] text-white flex items-center justify-center font-black text-base shadow-xs">
              P
            </span>
            <span className="text-xl font-black text-slate-900 tracking-tight">PostSync</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/20">
              PRO
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-[#0284C7] transition-colors">플랫폼 기능</a>
            <a href="#place" className="hover:text-[#0284C7] transition-colors">플레이스 관리</a>
            <a href="#compliance" className="hover:text-[#0284C7] transition-colors">광고 법규 안심 체크</a>
            <a href="#pipeline" className="hover:text-[#0284C7] transition-colors">수임 파이프라인</a>
            <a href="#reviews" className="hover:text-[#0284C7] transition-colors">성공 사례</a>
            <a href="#faq" className="hover:text-[#0284C7] transition-colors">자주 묻는 질문</a>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-2">
            로그인
          </Link>
          <Link href="/dashboard">
            <Button className="h-10 px-5 rounded-full bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs shadow-md hover:shadow-lg transition-all cursor-pointer">
              무료로 수임 시작하기
            </Button>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🌟 2. 영웅 섹션 (Hero Section) - 사진 속 헤드라인 & 우측 인테이크 UI 목업 */}
      {/* ========================================================================= */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-24 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 좌측: 타이틀 및 고전환 CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-extrabold border border-[#0284C7]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>변호사 · 세무사 전용 AI 수임 성장 엔진</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.15]">
              더 많은 의뢰인을 끌어당기고,<br />
              <span className="text-[#0284C7]">더 많은 사건을 수임하세요</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              단순히 글자만 채우는 생성기는 끝났습니다. 네이버 상위 1% 전문 칼럼 발행부터 사건 1분 안심 진단, 그리고 실시간 수임 계약 파이프라인까지. 변호사·세무사 대표님의 실질적인 수임 매출을 자동으로 완성합니다.
            </p>

            {/* 분야별 태그 바 (Lawmatics 사진 속 태그 스타일) */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">⚖️ 형사 (음주운전/사기)</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">👨‍👩‍👧 이혼 · 재산분할</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">📊 상속세 · 증여세</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">🏢 세무조사 대응</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">🏠 부동산 · 명도</span>
            </div>

            {/* 메인 오렌지 대형 버튼 (Lawmatics Signature) */}
            <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-4">
              <Link href="/dashboard">
                <Button className="h-14 px-8 rounded-full bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-base shadow-lg hover:shadow-xl transition-all active:scale-[0.98] cursor-pointer flex items-center gap-2">
                  <span>1분 만에 수임 시스템 시작하기</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/consult" target="_blank">
                <Button variant="outline" className="h-14 px-6 rounded-full border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-sm cursor-pointer">
                  1분 진단 폼 실물 체험하기 ➔
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium pt-1">
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" /> 신용카드 불필요
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" /> 1분 무료 세팅
              </span>
              <span className="flex items-center gap-1">
                <Check className="w-4 h-4 text-emerald-500" /> 광고 법규 100% 안심
              </span>
            </div>
          </div>

          {/* 우측: 사진 속 Lawmatics 인터랙티브 수임 단계 카드 목업 */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#F4F8FC] border border-[#0284C7]/20 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-400"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-400"></span>
                  <span className="text-[11px] font-mono text-slate-400 ml-2">intake.postsync.pro</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-black">
                  LIVE INTAKE
                </span>
              </div>

              {/* 4단계 카드 흐름 (신규 ➔ 진단 ➔ 상담 ➔ 수임) */}
              <div className="space-y-3">
                <div className="bg-white p-3.5 rounded-2xl border border-[#0284C7] shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">신규 의뢰인 실시간 접수</p>
                      <p className="text-[11px] text-[#0284C7] font-semibold">음주운전 2진 면허취소 구제 문의 (방금 전)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-white bg-[#FF6B00] px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">사건 1분 안심 진단 완료</p>
                      <p className="text-[11px] text-slate-500">생계형 운전자, 혈중농도 0.082%, 양형서류 확인</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    진단 완료
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">유선 상담 및 방문 예약</p>
                      <p className="text-[11px] text-slate-500">골든타임 10분 내 콜백 ➔ 내일 오후 2시 대면</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                    예약 확정
                  </span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-emerald-300 shadow-xs flex items-center justify-between bg-gradient-to-r from-emerald-50/40 to-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-900">수임 계약 체결 완료</p>
                      <p className="text-[11px] text-emerald-600 font-bold">착수금 5,500,000원 입금 및 정식 위임</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    수임 완료 🎉
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>실시간 수임 파이프라인 연동</span>
                <span className="text-[#0284C7] font-bold">평균 수임 전환율 +340%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 3. 교차 기능 1: 전문 칼럼 스튜디오 & 상위 노출 (Feature Row 1) */}
      {/* ========================================================================= */}
      <section id="features" className="py-16 sm:py-20 bg-[#F4F8FC] border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* 좌측: 목업 컨테이너 (사진 속 세룰리안/옐로우 카드 디자인) */}
            <div className="lg:col-span-6">
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#0284C7] bg-[#E0F2FE] px-2.5 py-1 rounded-full">
                    네이버 스마트블록 4단 구조
                  </span>
                  <span className="text-xs text-slate-400 font-mono">SEO Score: 98/100</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black text-slate-900 text-base">
                    송파 아파트 상속세, 감정평가로 1.2억 절세한 실무 비결 및 주의사항
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    국세청 상속세 감정평가 사업 확대에 대응하여, 사전 공인 감정평가를 통해 과세표준을 합법적으로 낮추고 양도세 이월과세를 방어한 실전 사례 분석...
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 font-semibold flex items-center gap-2">
                  <span className="text-amber-600 font-bold">💡 실전 포인트:</span>
                  <span>최신 세법 개정안 및 국세청 예규 자동 반영 완료</span>
                </div>
              </div>
            </div>

            {/* 우측: 텍스트 설명 */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-black text-[#0284C7] tracking-wider uppercase">
                INBOUND TRAFFIC ENGINE
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                반복되는 마케팅은 AI에게 맡기고,<br />
                대표님은 변론과 수임에만 집중하세요
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                네이버 C-Rank와 최신 스마트블록 알고리즘에 완벽히 부합하는 4단 구조(상황 공감 ➔ 핵심 쟁점 ➔ 관련 법조문·판례 ➔ 대응 절차 및 골든타임)로 전문 칼럼을 전자동 완성합니다.
              </p>
              <div className="pt-2">
                <Link href="/dashboard/write" className="inline-flex items-center gap-1.5 text-xs font-black text-[#0284C7] hover:text-[#0369A1]">
                  <span>칼럼 스튜디오 둘러보기</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 4. 사진 속 시그니처 세룰리안 블루 인용구 배너 1 (Testimonial Banner 1) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0284C7] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <Quote className="absolute right-6 bottom-4 w-28 h-28 text-white/10 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl space-y-6">
            <p className="text-lg sm:text-2xl font-bold leading-relaxed tracking-tight text-white">
              "PostSync Pro 도입 후 블로그 글만 보고 전화 문의를 주시는 의뢰인이 4배 이상 늘었습니다. 특히 글 하단 1분 진단 폼 덕분에 사무실에 앉아서도 매주 고액 사건 상담이 자동으로 잡힙니다."
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-base text-white">
                박
              </div>
              <div>
                <p className="font-black text-sm text-white">박현우 대표 변호사</p>
                <p className="text-xs text-sky-100 font-medium">법무법인 율정 · 형사 사건 전담</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 4-1. 네이버 스마트플레이스 통합 관리 엔진 (Scorpion Local Engine) */}
      {/* ========================================================================= */}
      <section id="place" className="py-16 sm:py-20 bg-[#F4F8FC] border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* 좌측: 실시간 순위 및 리뷰 목업 */}
            <div className="lg:col-span-6 space-y-3">
              <div className="bg-white border-2 border-[#0284C7] rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-black text-slate-900">네이버 플레이스 실시간 순위 추적</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[10px] font-black">
                    서초동 변호사 1위 🏆
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-[#F0F7FF] rounded-xl border border-[#0284C7]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xs">1</span>
                      <div>
                        <p className="font-black text-slate-900">내 사무소 (법무법인 율정)</p>
                        <p className="text-[10px] text-slate-500">네이버 예약 연동 · 상위 1%</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">▲ 순위 상승</span>
                  </div>

                  <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-slate-500">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">2</span>
                      <div>
                        <p className="font-bold text-slate-700">경쟁 A 로펌</p>
                        <p className="text-[10px] text-slate-400">방문자 리뷰 120개</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">경쟁사 추적 중</span>
                  </div>
                </div>

                {/* AI 리뷰 감사 답글 미리보기 */}
                <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-bold text-emerald-800">
                    <span>💬 방문자 영수증 리뷰 AI 감사 답글</span>
                    <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded">합법 검증</span>
                  </div>
                  <p className="text-[11px] text-emerald-900 leading-relaxed line-clamp-2">
                    "의뢰인님께서 일관되게 신뢰해 주신 덕분에 좋은 결과를 이끌어낼 수 있었습니다. 앞으로 늘 평안하시기를 기원합니다."
                  </p>
                </div>
              </div>
            </div>

            {/* 우측: 텍스트 설명 */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-black text-[#0284C7] tracking-wider uppercase">
                NAVER SMARTPLACE LOCAL BOOSTER
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                내 지역 1위 선점,<br />
                스마트플레이스 순위 & 리뷰 완벽 관리
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                의뢰인의 60% 이상은 네이버 지도와 스마트플레이스에서 시작됩니다. 실시간 로컬 키워드 순위 추적부터 상위 경쟁사 분석, 전문직 광고 규정을 철저히 준수한 소개글 작성, 그리고 방문자 영수증 리뷰에 대한 고품격 AI 감사 답글까지 원스톱으로 관리하세요.
              </p>
              <div className="space-y-2 pt-1 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>실시간 플레이스 키워드 순위 추적 및 경쟁사 비교 분석</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>변호사법·세무사법 100% 준수 합법 플레이스 소개글 AI 생성</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7] shrink-0" />
                  <span>방문자 리뷰에 대한 정중하고 신뢰감 높은 AI 감사 답글 원클릭 복사</span>
                </div>
              </div>
              <div className="pt-2">
                <Link href="/dashboard/place" className="inline-flex items-center gap-1.5 text-xs font-black text-[#0284C7] hover:text-[#0369A1]">
                  <span>스마트플레이스 관리 센터 열기</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 5. 교차 기능 2: 광고 법규 안심 체크 (Feature Row 2 - Compliance) */}
      {/* ========================================================================= */}
      <section id="compliance" className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* 좌측: 텍스트 설명 */}
            <div className="lg:col-span-6 space-y-4 order-2 lg:order-1">
              <div className="text-xs font-black text-emerald-600 tracking-wider uppercase">
                LEGAL & TAX ADVERTISING COMPLIANCE
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                광고 법규 위반 걱정 0%,<br />
                변호사법과 세무사법을 100% 준수합니다
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                '100% 승소', '환급율 1위', '전관예우 표방' 등 대한변호사협회 및 한국세무사회의 까다로운 광고 규정상 금지된 위험 표현을 작성 즉시 실시간 탐지하고 안전한 전문직 문장으로 자동 순화합니다.
              </p>
              <div className="space-y-2 pt-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>변호사법 제23조 및 변호사 광고에 관한 규정 100% 반영</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>세무사법 제12조 및 세무사 광고 가이드라인 필터링 탑재</span>
                </div>
              </div>
            </div>

            {/* 우측: 목업 (안전 검사 통과 카드) */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-black text-slate-900 text-sm">전문직 광고 법규 안심 체크</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                    안전도 100% 적법
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-rose-200 flex items-center justify-between">
                    <span className="line-through text-rose-500 font-medium">"100% 무죄 판결을 약속드립니다"</span>
                    <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">금칙어 감지</span>
                  </div>
                  <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-300 flex items-center justify-between">
                    <span className="text-emerald-800 font-bold">➔ "객관적 양형 자료를 토대로 실형을 방어합니다"</span>
                    <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">합법 대체 완료</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-400 text-center pt-1">
                  징계 위험 없이 신뢰받는 전문직 브랜딩을 구축하세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 6. 교차 기능 3: 수임 파이프라인 CRM (Feature Row 3 - Kanban) */}
      {/* ========================================================================= */}
      <section id="pipeline" className="py-16 sm:py-20 bg-[#F4F8FC] border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* 좌측: 칸반 UI 목업 */}
            <div className="lg:col-span-6">
              <div className="grid grid-cols-2 gap-3 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-sm">
                <div className="p-3 rounded-2xl bg-[#E0F2FE]/40 border border-[#0284C7]/30 space-y-2">
                  <span className="text-[10px] font-black text-[#0284C7]">1. 신규 접수 (3)</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <p className="font-bold text-slate-900">김*현 의뢰인</p>
                    <p className="text-[10px] text-slate-500">음주운전 2진 면허취소</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <span className="text-[10px] font-black text-amber-700">2. 유선 상담 (2)</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <p className="font-bold text-slate-900">이*우 의뢰인</p>
                    <p className="text-[10px] text-slate-500">상속세 24억 감정평가</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                  <span className="text-[10px] font-black text-indigo-700">3. 방문 상담 (1)</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <p className="font-bold text-slate-900">최*민 대표</p>
                    <p className="text-[10px] text-slate-500">세무조사 대응 미팅</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-black text-emerald-700">4. 수임 완료 (4)</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <p className="font-bold text-slate-900">정*훈 의뢰인</p>
                    <p className="text-[10px] text-emerald-600 font-bold">440만 원 수임 체결</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 텍스트 설명 */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-black text-[#FF6B00] tracking-wider uppercase">
                LAWMATICS INTAKE CRM PIPELINE
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                접수된 상담 문의가 실제 계약으로<br />
                체결될 때까지 원스톱 관리
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                블로그와 1분 진단 폼에서 유입된 잠재 의뢰인을 엑셀이나 카카오톡 대신 Lawmatics 스타일의 시각적 칸반보드로 직관적으로 추적합니다. 미처리 상담 0건, 골든타임 10분 내 콜백을 실현하세요.
              </p>
              <div className="pt-2">
                <Link href="/dashboard/pipeline" className="inline-flex items-center gap-1.5 text-xs font-black text-[#FF6B00] hover:text-[#E05D00]">
                  <span>수임 파이프라인 기능 체험</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 7. 사진 속 시그니처 세룰리안 블루 인용구 배너 2 (Testimonial Banner 2) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0284C7] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <Quote className="absolute right-6 bottom-4 w-28 h-28 text-white/10 pointer-events-none" />
          
          <div className="relative z-10 max-w-4xl space-y-6">
            <p className="text-lg sm:text-2xl font-bold leading-relaxed tracking-tight text-white">
              "세무사 업무 특성상 신고 시즌마다 글 쓸 시간이 전혀 없었는데, PostSync Pro 덕분에 상속세와 양도세 전문 칼럼을 미리 비축하고 이번 시즌에만 자산가 상속세 사건 3건을 수임 완료했습니다."
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-base text-white">
                정
              </div>
              <div>
                <p className="font-black text-sm text-white">정성훈 대표 세무사</p>
                <p className="text-xs text-sky-100 font-medium">세무회계 정인 · 상속·양도세 전문</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 8. 사진 속 오렌지 화살표(>) 자주 묻는 질문 (FAQ Accordion) */}
      {/* ========================================================================= */}
      <section id="faq" className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              자주 묻는 질문 (Frequently Asked Questions)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              변호사·세무사 대표님들이 가장 많이 문의하시는 핵심 질문들입니다.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx
              return (
                <div 
                  key={idx}
                  className="bg-white border border-slate-200/90 hover:border-[#0284C7]/50 rounded-2xl transition-all shadow-2xs overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer"
                  >
                    <span className="text-sm font-bold text-slate-900 leading-snug">
                      {item.q}
                    </span>
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-[#FF6B00] text-white rotate-90' : 'bg-orange-50 text-[#FF6B00]'
                    }`}>
                      <ChevronRight className="w-4 h-4 font-black" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {item.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 9. 사진 속 4분할 전문직 고객 성공 리뷰 그리드 (Law firms love PostSync) */}
      {/* ========================================================================= */}
      <section id="reviews" className="py-16 sm:py-20 bg-[#F4F8FC] border-t border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-2">
            <div className="text-xs font-black text-[#0284C7] tracking-wider uppercase">
              CLIENT SUCCESS STORIES
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              전국의 로펌과 세무법인이 PostSync Pro를 신뢰합니다
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              수임을 직접 연결해 주는 AI 마케팅 OS를 도입한 대표님들의 실제 성과입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CLIENT_REVIEWS.map((rev, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                    {rev.result}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "{rev.text}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-bold text-xs">
                    {rev.name[0]}
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900">{rev.name}</p>
                    <p className="text-[10px] text-slate-400">{rev.office}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 10. 사진 속 하단 스플릿 대형 전환 배너 (Bottom Call-To-Action Banner) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-[#0284C7] rounded-3xl p-8 sm:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* 좌측: 비비드 세룰리안 블루 + 화이트 텍스트 + 오렌지 버튼 */}
          <div className="lg:col-span-7 space-y-5 text-white">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              사무소의 수임 성장을<br />
              시작할 준비가 되셨나요?
            </h2>
            <p className="text-sky-100 text-xs sm:text-base leading-relaxed max-w-lg">
              지금 바로 무료로 시작하세요. 복잡한 세팅 없이 1분 만에 내 사무소 전용 진단 폼과 수임 파이프라인이 생성됩니다.
            </p>
            <div className="pt-2">
              <Link href="/dashboard">
                <Button className="h-13 px-8 rounded-full bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer">
                  지금 무료로 시작하기 ➔
                </Button>
              </Link>
            </div>
          </div>

          {/* 우측: 화이트 카드 (4.9 평점 및 인증 마크) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-md text-slate-900 space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-black text-slate-900">4.9</div>
                <div className="space-y-0.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold">280+ 변호사·세무사 사무소 평가</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>수임 전환율 평균 +340% 증가</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                  <span>변호사법·세무사법 광고 규정 100% 검증</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                  <span>골든타임 10분 내 실시간 알림 연동</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 11. 클린 화이트 푸터 (Footer) */}
      {/* ========================================================================= */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-black text-xs">
                P
              </span>
              <span className="font-black text-slate-900 text-sm">PostSync Pro</span>
            </div>
            <p className="text-[11px] text-slate-400">
              대한민국 변호사·세무사 전문직 수임 성장 AI 플랫폼
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold text-slate-600">
            <Link href="/terms" className="hover:text-slate-900">이용약관</Link>
            <Link href="/privacy" className="hover:text-slate-900">개인정보처리방침</Link>
            <Link href="/consult" target="_blank" className="hover:text-[#0284C7]">1분 안심 진단 센터</Link>
            <Link href="/dashboard" className="hover:text-[#FF6B00]">대표님 로그인</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-100 text-[11px] text-slate-400 text-center sm:text-left">
          © 2026 PostSync Pro. All rights reserved. 본 서비스는 변호사법 및 세무사법 광고 규정을 준수합니다.
        </div>
      </footer>
    </div>
  )
}
