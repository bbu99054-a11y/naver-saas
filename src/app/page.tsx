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
  MapPin,
  Clock,
  BarChart3,
  Building2,
  Eye,
  MousePointerClick,
  Send,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const FAQ_ITEMS = [
  {
    q: '변호사법 제23조 및 대한변협 광고 규정에 정말 안전한가요?',
    a: '네, 100% 안전합니다. PostSync Pro는 "100% 승소 보장", "최고/유일", "전관예우 암시", "부당 염가 표방" 등 대한변호사협회 광고 규정상 금지된 위험 표현을 실시간으로 자동 감지하여 품격 있고 합법적인 변호사 전문 언어로 순화합니다.'
  },
  {
    q: '블로그 글만 쓴다고 실제 형사·이혼·민사 사건 수임으로 이어지나요?',
    a: '단순 정보 전달 글은 의뢰인이 읽고 나가버립니다. PostSync Pro는 네이버 스마트블록 C-Rank 4단 구조로 의뢰인의 불안을 자극한 뒤, 본문 하단에 [1분 사건 안심 사전진단 폼]을 장착하여 30초 만에 연락처와 사건 경위를 남기게 만들어 실제 수임으로 직결시킵니다.'
  },
  {
    q: '사건 1분 안심 진단 폼은 제 블로그나 홈페이지에 어떻게 연결하나요?',
    a: '대시보드에서 원클릭으로 제공되는 [네이버 블로그 본문 삽입용 배너 서식]을 복사하여 글 하단에 붙여넣기만 하시면 됩니다. 모바일과 PC 화면에 맞춰 자동으로 반응형 배너가 생성되며, 의뢰인이 사건 정보를 남기는 즉시 수임 파이프라인으로 연결됩니다.'
  },
  {
    q: '접수된 의뢰인 정보는 어떻게 저에게 실시간으로 전달되나요?',
    a: '의뢰인이 진단 폼을 제출하는 즉시 대표 변호사님의 휴대폰(카카오 알림톡/문자/텔레그램)으로 실시간 알림이 전송됩니다. 동시에 PostSync Pro 수임 파이프라인 CRM의 [신규 접수] 칸에 자동으로 등록되어 골든타임 10분 내에 유선 상담 및 방문 예약을 잡을 수 있습니다.'
  },
  {
    q: '향후 스레드, 인스타그램, AI 쇼츠 영상 생성 기능도 지원되나요?',
    a: '네, 적극 지원됩니다! 현재 정식 제공 중인 [네이버 블로그 칼럼 스튜디오]와 [스마트플레이스 로컬 관제]에 이어, 작성한 칼럼 1편으로 스레드 지식인 연속 글, 인스타그램 승소 카드뉴스, 그리고 AI 쇼츠 영상까지 1초 만에 원클릭 변환하여 모든 채널에서 수임을 끌어모으는 옴니채널 수임망 로드맵이 순차 오픈됩니다.'
  }
]

const CLIENT_REVIEWS = [
  {
    name: '박현우 대표 변호사',
    office: '법무법인 율정 (형사 전문)',
    role: '서초동 형사 전문',
    result: '월 수임 5건 순증',
    text: '월 300만 원씩 주던 마케팅 대행사를 해지하고 PostSync Pro로 바꿨습니다. 음주운전 구제 칼럼 하단에 1분 진단 폼을 붙였더니 한 달 만에 구속영장 기각 사건 등 알짜배기 사건 5건을 직접 수임했습니다.'
  },
  {
    name: '이지안 파트너 변호사',
    office: '법률사무소 다온 (가사/이혼)',
    role: '양재동 이혼·재산분할',
    result: '방문 상담 전환율 +310%',
    text: '진단 폼을 거쳐서 들어오는 의뢰인들은 이미 혼인 기간, 재산 규모, 유책 사유를 정리해서 남겨주기 때문에, 1차 유선 통화 5분 만에 대면 상담과 착수금 550만 원 계약으로 곧바로 이어집니다.'
  },
  {
    name: '최민우 대표 변호사',
    office: '법률사무소 정성 (부동산·민사)',
    role: '수원·강남 부동산 전문',
    result: '명도·보증금 4건 수임',
    text: '변호사법 광고 규정 위반 걱정 없이 네이버 스마트블록 상위 노출을 잡았습니다. 스마트플레이스 순위 관리와 1분 진단 폼이 맞물리니 대행사 쓸 때보다 문의 전화가 3배 이상 쏟아집니다.'
  },
  {
    name: '강태석 대표 변호사',
    office: '법무법인 혜안 (기업·형사)',
    role: '교대역 기업법무·영장',
    result: '월 수임료 2,800만 순증',
    text: '횡령·배임, 업무방해 등 까다로운 사건일수록 의뢰인은 신뢰를 찾습니다. 사건 파이프라인 CRM 덕분에 들어온 의뢰인을 놓치지 않고 골든타임 10분 내에 유선 연결하여 계약 체결률이 비약적으로 올랐습니다.'
  }
]

export default function HomePage() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const [activeEngineTab, setActiveEngineTab] = useState<number>(0)

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

          <nav className="hidden lg:flex items-center gap-5 text-xs font-bold text-slate-600">
            <a href="#features" className="hover:text-[#0284C7] transition-colors">플랫폼 기능</a>
            <a href="#place" className="hover:text-[#0284C7] transition-colors">플레이스 관리</a>
            <a href="#compliance" className="hover:text-[#0284C7] transition-colors">광고 법규 안심 체크</a>
            <a href="#pipeline" className="hover:text-[#0284C7] transition-colors">수임 파이프라인</a>
            <Link href="/pricing" className="hover:text-[#0284C7] transition-colors">요금 안내</Link>
            <Link href="/blog" className="hover:text-[#0284C7] transition-colors text-slate-800 font-extrabold flex items-center gap-1">
              <span>인사이트 칼럼</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#0284C7]"></span>
            </Link>
            <Link href="/tools" className="hover:text-emerald-600 transition-colors text-emerald-600 font-extrabold flex items-center gap-1">
              <span>무료 웹툴 7종</span>
              <span className="px-1.5 py-0.5 rounded-full text-[9px] bg-emerald-100 text-emerald-700">무료</span>
            </Link>
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
      {/* ========================================================================= */}
      {/* 🌟 2. 영웅 섹션 (Hero Section) - 옴니채널 수임 OS & 우측 인테이크 UI 목업 */}
      {/* ========================================================================= */}
      <section className="pt-12 pb-16 sm:pt-20 sm:pb-20 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* 좌측: 타이틀 및 고전환 CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-extrabold border border-[#0284C7]/20">
              <Sparkles className="w-3.5 h-3.5 text-[#0284C7]" />
              <span>대행사 외주비(월 300만 원) 93% 절감 · 대한민국 1등 변호사 사건 수임 OS</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.18]">
              네이버 1위부터 SNS까지,<br />
              대표님 로펌에 <span className="text-[#0284C7]">알짜 사건 수임을 물어다 드립니다</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl font-normal">
              네이버 상위 1% 전문 칼럼 발행부터 스마트플레이스 로컬 1위 선점, 사건 1분 안심 진단, 그리고 실시간 수임 관리 시스템까지. 앞으로 스레드, 인스타, 쇼츠 영상 생성까지 확장되는 옴니채널 수임망으로 대표님의 실질적인 수임 매출을 자동으로 완성합니다.
            </p>

            {/* 분야별 태그 바 (Lawmatics 사진 속 태그 스타일 - 100% 변호사 핵심 사건) */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">⚖️ 형사 (음주운전/사기/마약)</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">👨‍👩‍👧 가사 · 이혼 · 재산분할</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">🏠 부동산 · 명도 · 전세사기</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">🏢 기업법무 · 횡령 · 배임</span>
              <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">🛡️ 구속영장 실질심사 대응</span>
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
                  1분 안심 진단 폼 체험하기 ➔
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
                <Check className="w-4 h-4 text-emerald-500" /> 변호사법 제23조 100% 안심
              </span>
            </div>
          </div>

          {/* 우측: 초정밀 macOS 스타일 Lawmatics급 실시간 수임 윈도우 프레임 목업 */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-slate-700/10 shadow-2xl bg-white/95 backdrop-blur-xl overflow-hidden ring-1 ring-slate-900/5">
              {/* 상단 macOS 브라우저 헤더 */}
              <div className="bg-slate-100/90 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]"></span>
                  <div className="ml-2 flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-[10px] font-mono text-slate-500 shadow-2xs">
                    <Lock className="w-2.5 h-2.5 text-emerald-600" />
                    <span>intake.postsync.pro/서초-형사·이혼</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>LIVE 접수 중</span>
                </div>
              </div>

              {/* 브라우저 내부: 4단계 실시간 수임 흐름 */}
              <div className="p-5 space-y-3 bg-gradient-to-b from-slate-50/50 to-white">
                {/* 1. 신규 접수 */}
                <div className="bg-white p-3.5 rounded-2xl border-2 border-[#0284C7] shadow-sm flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#E0F2FE] text-[#0284C7] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">신규 의뢰인 실시간 접수</p>
                        <span className="text-[9px] font-mono text-slate-400">방금 전</span>
                      </div>
                      <p className="text-[11px] text-[#0284C7] font-bold">음주운전 2진 면허취소 구제 문의</p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-600 text-[9px] font-black border border-rose-200 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> 골든타임 08:42
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold">
                          블로그 1위 유입
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-white bg-[#FF6B00] px-2 py-0.5 rounded-full shrink-0 shadow-xs">
                    NEW
                  </span>
                </div>

                {/* 2. 1분 진단 완료 */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between gap-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900">사건 1분 안심 진단 완료</p>
                      <p className="text-[11px] text-slate-600 font-medium">생계형 운전자 · 혈중농도 0.082% · 3년 무사고</p>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[9px] font-bold">
                          수임 적격도 HIGH (94%)
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px]">
                          양형 서류 첨부
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full shrink-0 border border-amber-200">
                    진단 완료
                  </span>
                </div>

                {/* 3. 유선 상담 및 방문 예약 */}
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between gap-3 hover:border-slate-300 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-black text-slate-900">유선 상담 및 방문 예약</p>
                      <p className="text-[11px] text-slate-600 font-medium">골든타임 7분 내 콜백 ➔ 내일 14:00 대면 상담</p>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">
                        서초동 대표 변호사실 확정
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full shrink-0 border border-indigo-200">
                    예약 확정
                  </span>
                </div>

                {/* 4. 수임 완료 */}
                <div className="bg-gradient-to-r from-emerald-50/60 via-white to-white p-3.5 rounded-2xl border-2 border-emerald-400 shadow-sm flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5 shadow-xs">
                      4
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-slate-900">정식 수임 계약 체결 완료</p>
                        <span className="text-[10px] font-black text-emerald-600">착수금 5,500,000원 입금</span>
                      </div>
                      <p className="text-[11px] text-slate-600">정식 소송 위임장 날인 및 전담 변호사 배정 완료</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full shrink-0 shadow-2xs">
                    수임 완료 🎉
                  </span>
                </div>
              </div>

              {/* 하단 인터랙티브 상태 바 */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500">
                <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  실시간 수임 파이프라인 연동
                </span>
                <span className="text-[#0284C7] font-black bg-[#E0F2FE] px-2 py-0.5 rounded-md">
                  평균 수임 전환율 +340%
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 2-A. 로펌 신뢰 지표 & 소셜 프루프 바 (Social Proof Bar) */}
      {/* ========================================================================= */}
      <section className="border-y border-slate-200/80 bg-slate-50/70 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <p className="text-center text-xs font-extrabold text-slate-500 tracking-wider uppercase">
            서초 · 교대 · 강남 등 대한민국 140+ 로펌 및 법률사무소 실전 도입
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-2">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#0284C7] tracking-tight">1,840건+</div>
              <div className="text-xs text-slate-600 font-bold">누적 사건 의뢰 접수</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">94.8%</div>
              <div className="text-xs text-slate-600 font-bold">10분 골든타임 연결률</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">+340%</div>
              <div className="text-xs text-slate-600 font-bold">방문 및 착수금 계약 전환율</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs text-center space-y-1">
              <div className="text-2xl sm:text-3xl font-black text-[#FF6B00] tracking-tight">0건</div>
              <div className="text-xs text-slate-600 font-bold">변호사법 제23조 위반 제재</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 2-0. 옴니채널 수임 파이프라인 쇼케이스 (인터랙티브 3-in-1 라이브 뷰) */}
      {/* ========================================================================= */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#F0F7FD] via-[#E8F3FC] to-white border-y border-[#0284C7]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
          {/* 섹션 헤더 (1줄 펀치라인 + 시원한 여백) */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-extrabold border border-[#0284C7]/30 shadow-2xs">
              ⚡ 옴니채널 사건 수임 파이프라인
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              단 하나의 칼럼이 모든 채널로 뻗어나가<br />
              <span className="text-[#0284C7]">대표님의 로펌에 24시간 수임을 물어다 줍니다</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
              의뢰인은 글 하나만 보고 결정하지 않습니다. 네이버 블로그 검색부터 지도(플레이스), 그리고 실시간 수임 파이프라인까지 전방위로 의뢰인을 포위하여 실제 착수금 계약을 체결시킵니다.
            </p>
          </div>

          {/* 🌟 인터랙티브 3대 LIVE 엔진 탭 네비게이션 */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-slate-200/70 backdrop-blur rounded-2xl max-w-2xl mx-auto border border-slate-300/70 shadow-inner">
            <button
              type="button"
              onClick={() => setActiveEngineTab(0)}
              className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeEngineTab === 0
                  ? 'bg-white text-[#0284C7] shadow-md ring-1 ring-slate-900/5 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Scale className="w-4 h-4" />
              <span>01. 4단 칼럼 스튜디오</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEngineTab(1)}
              className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeEngineTab === 1
                  ? 'bg-white text-[#0284C7] shadow-md ring-1 ring-slate-900/5 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>02. 플레이스 1위 관제</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveEngineTab(2)}
              className={`flex-1 min-w-[170px] py-3 px-4 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                activeEngineTab === 2
                  ? 'bg-white text-[#0284C7] shadow-md ring-1 ring-slate-900/5 scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>03. 골든타임 수임 현황판</span>
            </button>
          </div>

          {/* 🌟 탭별 실제 소프트웨어 구동 화면 프리뷰 (Interactive Showcase View) */}
          <div className="bg-white rounded-3xl border-2 border-[#0284C7]/30 shadow-xl overflow-hidden">
            {/* 탭 0: 네이버 4단 칼럼 스튜디오 구동 뷰 */}
            {activeEngineTab === 0 && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                        ● 즉시 이용 가능 (LIVE ENGINE)
                      </span>
                      <span className="text-xs font-mono text-slate-400">네이버 C-Rank 스마트블록 최적화</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      네이버 상위 1% 4단 구조 전문 칼럼 자동 완성
                    </h3>
                  </div>
                  <Link href="/dashboard/write">
                    <Button className="h-10 px-5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5">
                      <span>직접 칼럼 써보기</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* 좌측: 컨트롤 파라미터 패널 */}
                  <div className="lg:col-span-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <p className="text-xs font-black text-slate-700 uppercase tracking-wider">
                      🎯 사건 타깃팅 설정
                    </p>
                    <div className="space-y-2.5 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold">수임 타깃 키워드</span>
                        <p className="font-bold text-slate-900">음주운전 2진 면허취소 구제 행정심판</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                        <span className="text-slate-400 text-[10px] font-bold">전문 분야 및 직역</span>
                        <p className="font-bold text-slate-900">형사 전문 변호사 (교통범죄 전담)</p>
                      </div>
                      <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 space-y-1 text-emerald-800">
                        <span className="text-emerald-600 text-[10px] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> 변호사법 제23조 사전 필터링
                        </span>
                        <p className="font-extrabold text-[11px]">금칙어 0건 · 승소율 과장 차단 통과 완료</p>
                      </div>
                    </div>
                  </div>

                  {/* 우측: 4단 완성 칼럼 프리뷰 */}
                  <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-500">생성된 네이버 블로그 원고 미리보기</span>
                      <span className="text-xs font-mono text-[#0284C7] font-bold">2,480자 (공백 제외)</span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                      <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-[#0284C7]">
                        <span className="font-bold text-[#0284C7]">[1단: 의뢰인 절박함 공감]</span>
                        <p className="mt-1 text-slate-600">
                          "출퇴근과 생계가 걸린 상황에서 갑작스러운 음주운전 2진 적발로 면허 취소 통지를 받으셨다면, 지금 1분이 얼마나 초조하실지 잘 알고 있습니다..."
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-indigo-500">
                        <span className="font-bold text-indigo-600">[2단: 도로교통법 제148조의2 핵심 쟁점]</span>
                        <p className="mt-1 text-slate-600">
                          "단순 반성문 제출만으로는 기소유예나 벌금형 감경을 이끌어내기 어렵습니다. 당시 혈중알코올농도 수치와 운전 거리, 생계 필수성 입증 자료가 승패를 가릅니다."
                        </p>
                      </div>
                      <div className="p-3 bg-slate-50 rounded-xl border-l-4 border-emerald-500">
                        <span className="font-bold text-emerald-600">[3단: 대법원 양형 기준 & 유사 구제 판례]</span>
                        <p className="mt-1 text-slate-600">
                          "서울중앙지방법원 2025고단**** 사건에서 의뢰인의 부양가족 생계 곤란 및 차량 운행 불가피성을 체계적으로 소명하여 면허취소 처분 집행정지 결정을 이끌어낸 바 있습니다."
                        </p>
                      </div>
                      <div className="p-3.5 bg-gradient-to-r from-[#E0F2FE] to-white rounded-xl border-2 border-[#0284C7] flex items-center justify-between">
                        <div>
                          <span className="font-black text-[#0284C7]">[4단: 1분 안심 진단 폼 삽입 배너]</span>
                          <p className="text-[11px] text-slate-700 font-bold mt-0.5">
                            👉 내 사건 구제 가능성 및 예상 벌금 1분 무료 사전 진단하기
                          </p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-[#FF6B00] text-white text-[10px] font-black shrink-0">
                          수임 낚싯바늘
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 탭 1: 스마트플레이스 로컬 1위 관제 구동 뷰 */}
            {activeEngineTab === 1 && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                        ● 즉시 이용 가능 (LIVE ENGINE)
                      </span>
                      <span className="text-xs font-mono text-slate-400">지역 로펌 지도 1위 선점 관제탑</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      내 지역 법률사무소 스마트플레이스 실시간 순위 & 리뷰 장악
                    </h3>
                  </div>
                  <Link href="/dashboard/place">
                    <Button className="h-10 px-5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5">
                      <span>플레이스 순위 확인</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* 좌측: 실시간 랭킹 카드 */}
                  <div className="lg:col-span-5 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-slate-700">📍 실시간 지역 선점 랭킹</p>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black">
                        서초동 1위 유지 중 👑
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3 bg-white rounded-xl border-2 border-emerald-400 flex items-center justify-between shadow-2xs">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-black text-xs">
                            1
                          </span>
                          <div>
                            <p className="text-xs font-black text-slate-900">대표님 법률사무소</p>
                            <p className="text-[10px] text-slate-400">교대역 1번 출구 · 플레이스 점유율 41.2%</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-black text-emerald-600">+18% 유입</span>
                      </div>

                      <div className="p-3 bg-white/70 rounded-xl border border-slate-200 flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                            2
                          </span>
                          <span className="text-xs font-medium text-slate-700">A 법무법인 (서초)</span>
                        </div>
                        <span className="text-[10px] text-rose-500 font-bold">순위 하락 ▼</span>
                      </div>

                      <div className="p-3 bg-white/70 rounded-xl border border-slate-200 flex items-center justify-between opacity-70">
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                            3
                          </span>
                          <span className="text-xs font-medium text-slate-700">B 변호사사무실</span>
                        </div>
                        <span className="text-[10px] text-slate-400">변동 없음</span>
                      </div>
                    </div>
                  </div>

                  {/* 우측: 방문자 리뷰 AI 감사 답글 자동화 */}
                  <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-500">방문자 영수증 리뷰 AI 품격 답글 생성기</span>
                      <span className="text-xs text-emerald-600 font-bold">1초 원클릭 복사</span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-amber-500 text-xs">★★★★★</span>
                        <span className="text-xs font-bold text-slate-900">실제 의뢰인 네이버 영수증 리뷰</span>
                      </div>
                      <p className="text-xs text-slate-600">
                        "구속영장 기각 결정 소식 듣고 가족들과 울었습니다. 대표 변호사님께서 직접 주말 늦은 시간까지 접견 와주셔서 진심으로 든든했습니다."
                      </p>
                    </div>

                    <div className="p-4 bg-[#F0F7FD] rounded-xl border-2 border-[#0284C7] space-y-2">
                      <span className="text-[11px] font-black text-[#0284C7]">AI 변호사 명의 감사 답글 추천</span>
                      <p className="text-xs text-slate-700 leading-relaxed font-medium">
                        "의뢰인님, 당시 가족분들의 간절하셨던 눈빛을 기억하기에 온 힘을 다해 영장실질심사를 준비했습니다. 무사히 일상으로 복귀하셔서 진심으로 다행입니다. 언제나 의뢰인 곁을 지키는 든든한 조력자가 되겠습니다. - 대표 변호사 올림"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 탭 2: 골든타임 수임 현황판 CRM 구동 뷰 */}
            {activeEngineTab === 2 && (
              <div className="p-6 sm:p-10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                        ● 즉시 이용 가능 (LIVE ENGINE)
                      </span>
                      <span className="text-xs font-mono text-slate-400">사건 수임 파이프라인 CRM</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      골든타임 10분 알림 & [접수 ➔ 상담 ➔ 예약 ➔ 수임] 통합 현황판
                    </h3>
                  </div>
                  <Link href="/dashboard/pipeline">
                    <Button className="h-10 px-5 rounded-full bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-black shadow-sm cursor-pointer flex items-center gap-1.5">
                      <span>수임 현황판 열기</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                {/* 4열 실시간 수임 단계 파이프라인 목업 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 1열: 신규 접수 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-800">1. 신규 접수 (3)</span>
                      <span className="w-2 h-2 rounded-full bg-[#FF6B00]"></span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                          골든타임 08:42
                        </span>
                        <p className="text-xs font-black text-slate-900">음주 2진 면허취소 구제</p>
                        <p className="text-[10px] text-slate-400">네이버 블로그 유입 · 3분 전</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-black text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          형사
                        </span>
                        <p className="text-xs font-black text-slate-900">통신매체이용음란 무혐의</p>
                        <p className="text-[10px] text-slate-400">18분 전 접수</p>
                      </div>
                    </div>
                  </div>

                  {/* 2열: 1분 진단 완료 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-800">2. 1분 진단 완료 (4)</span>
                      <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          적격도 HIGH
                        </span>
                        <p className="text-xs font-black text-slate-900">상간소송 위자료 3천만 원</p>
                        <p className="text-[10px] text-slate-500">외도 증거(블랙박스) 제출 확인</p>
                      </div>
                    </div>
                  </div>

                  {/* 3열: 방문 상담 예약 */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-black text-slate-800">3. 방문 상담 예약 (2)</span>
                      <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs space-y-1">
                        <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                          내일 14:00 대면
                        </span>
                        <p className="text-xs font-black text-slate-900">업무상 횡령 2억 무죄 소명</p>
                        <p className="text-[10px] text-slate-500">서초동 대표실 미팅 확정</p>
                      </div>
                    </div>
                  </div>

                  {/* 4열: 정식 수임 완료 */}
                  <div className="bg-emerald-50/50 p-4 rounded-2xl border-2 border-emerald-300 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                      <span className="text-xs font-black text-emerald-900">4. 수임 완료 (5) 🎉</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white p-3 rounded-xl border border-emerald-300 shadow-xs space-y-1">
                        <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                          착수금 550만 원 입금
                        </span>
                        <p className="text-xs font-black text-slate-900">이혼 및 재산분할 청구</p>
                        <p className="text-[10px] text-emerald-700 font-bold">정식 소송 위임장 체결</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 🚀 2026 ROADMAP 3대 확장 (스레드, 인스타, 유튜브 쇼츠) */}
          <div className="space-y-4 pt-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-extrabold text-[#0284C7] uppercase tracking-wider">
                🚀 2026 ROADMAP: 소셜 미디어 확장
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                칼럼 하나로 모든 SNS 채널을 동시 점유합니다
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 4. 스레드 연속 글 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-2xs hover:border-[#0284C7]/40 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black border border-amber-200">
                    2026 ROADMAP
                  </span>
                  <span className="text-xs text-slate-400 font-bold">04. 소셜 지식인</span>
                </div>
                <h4 className="text-base font-black text-slate-900">🧵 스레드(Threads) 연속 글 자동 변환</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  블로그 칼럼 1편을 2030 고소득 자산가가 열광하는 촌철살인 5~7개 스레드 연속 글로 1초 자동 재가공.
                </p>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 font-medium">
                  👉 퍼스널 브랜딩 & DM 사건 상담 유도
                </div>
              </div>

              {/* 5. 인스타그램 카드뉴스 */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-3 shadow-2xs hover:border-[#0284C7]/40 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black border border-amber-200">
                    2026 ROADMAP
                  </span>
                  <span className="text-xs text-slate-400 font-bold">05. 비주얼 신뢰</span>
                </div>
                <h4 className="text-base font-black text-slate-900">📸 인스타그램 승소 사례 카드뉴스</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  복잡한 판결문과 승소 스토리를 1080x1080 인스타그램 고화질 카드뉴스 이미지 세트로 1초 분할 추출.
                </p>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 font-medium">
                  👉 승소 결과로 의뢰인 신뢰도 극대화
                </div>
              </div>

              {/* 6. 유튜브 쇼츠 영상 자동 생성 */}
              <div className="bg-gradient-to-br from-white via-sky-50/50 to-[#E0F2FE]/40 border-2 border-[#0284C7]/40 rounded-3xl p-6 space-y-3 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[11px] font-black border border-[#0284C7]/30">
                    2026 ROADMAP
                  </span>
                  <span className="text-xs text-[#0284C7] font-bold">06. 숏폼 영상</span>
                </div>
                <h4 className="text-base font-black text-slate-900">🎬 AI 유튜브 쇼츠 영상 자동 생성</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  칼럼 핵심 쟁점을 60초 분량의 임팩트 있는 AI 쇼츠 영상으로 즉시 렌더링하여 유튜브 검색 장악.
                </p>
                <div className="p-2.5 bg-white rounded-xl border border-[#0284C7]/30 text-[11px] text-[#0284C7] font-bold">
                  👉 영상 알고리즘 수임 문의 자동 유입
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 2-1. 대행사 외주 vs PostSync Pro 비교 섹션 (비용 93% 절감 & 리스크 0%) */}
      {/* ========================================================================= */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
              💰 스마트한 대표님들의 비용 혁신
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              매달 나가는 대행사 외주비 300만 원,<br />
              <span className="text-[#0284C7]">아직도 관행처럼 지출하고 계신가요?</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              비전문가 아르바이트생의 위험한 복사-붙여넣기 글과 과태료(최대 5,000만 원) 불안을 끝내세요. 대행사 비용의 90% 이상을 절감하면서, 실제 사건 수임으로 연결되는 전자동 시스템을 갖출 수 있습니다.
            </p>
          </div>

          {/* 직관적 2단 비교 카드 테이블 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch">
            {/* 1. 기존 종합 마케팅 대행사 */}
            <div className="bg-[#F8FAFC] border-2 border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-xs font-bold text-slate-400">기존 방식</span>
                    <h3 className="text-xl font-black text-slate-700 mt-0.5">종합 마케팅 대행사 외주</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-bold">
                    월 300~500만 원
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-black text-base shrink-0">✕</span>
                    <div>
                      <strong className="text-slate-800">막대한 고정비 지출:</strong>
                      <p className="text-slate-500 mt-0.5">연간 3,600만~6,000만 원의 큰 비용이 수임 성과와 무관하게 고정 지출됨.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-black text-base shrink-0">✕</span>
                    <div>
                      <strong className="text-slate-800">과태료(최대 5천만 원) & 징계 위험:</strong>
                      <p className="text-slate-500 mt-0.5">법률·세무 비전공 알바생 작성으로 '100% 승소' 등 법률 광고 규정 위반 빈발.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-black text-base shrink-0">✕</span>
                    <div>
                      <strong className="text-slate-800">단순 블로그 방문자 유입에 그침:</strong>
                      <p className="text-slate-500 mt-0.5">글만 쓸 뿐, 의뢰인을 상담으로 연결하는 진단 폼이나 수임 파이프라인 부재.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-black text-base shrink-0">✕</span>
                    <div>
                      <strong className="text-slate-800">플레이스·리뷰 관리는 별도 비용:</strong>
                      <p className="text-slate-500 mt-0.5">네이버 플레이스 순위나 영수증 리뷰 관리는 매번 수십만 원의 추가 외주비 요구.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-slate-500 font-medium">
                결국 비싼 돈을 쓰고도 대표님이 직접 글을 고쳐야 하는 악순환
              </div>
            </div>

            {/* 2. PostSync Pro (AI 수임 성장 OS) */}
            <div className="bg-white border-2 border-[#0284C7] rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-[#0284C7] text-white text-[10px] font-black px-4 py-1 rounded-bl-xl uppercase tracking-wider">
                RECOMMENDED SOLUTION
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-[#0284C7]">2026 차세대 표준</span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">PostSync Pro 수임 관제 OS</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-xs font-black">
                    월 9.9만~19.9만 원
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">외주비 93% 절감 (연 3,240만 원 순이익 방어):</strong>
                      <p className="text-slate-500 mt-0.5">대행사 외주비의 10분의 1 수준으로 대표님의 마케팅 고정비를 압도적으로 절감.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">광고 법규 안심 체크 100% 무결점 보장:</strong>
                      <p className="text-slate-500 mt-0.5">변호사법 제23조 및 대한변협 광고 금칙어를 실시간 감지하여 징계 위험 원천 차단.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">1분 안심 진단 폼 + 실시간 수임 관리 시스템 기본 탑재:</strong>
                      <p className="text-slate-500 mt-0.5">글 하단 배너에서 접수된 의뢰인이 실시간 모바일 알림과 수임 현황판으로 자동 유입.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900">네이버 스마트플레이스 순위 & AI 리뷰 올인원:</strong>
                      <p className="text-slate-500 mt-0.5">로컬 키워드 실시간 순위 추적, 경쟁사 분석, 합법 소개글 및 AI 감사 답글 원클릭 제공.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link href="/dashboard">
                  <Button className="w-full h-12 rounded-full bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-sm shadow-md cursor-pointer">
                    대행사 해지하고 무료로 시작하기 ➔
                  </Button>
                </Link>
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
                    음주운전 2진 아웃, 구속영장 기각 및 면허취소 구제 실전 판례 분석
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    대법원 최신 양형 기준에 입각하여, 혈중알코올농도 0.082% 생계형 운전자의 구속영장 청구를 기각시키고 행정심판을 통해 110일 면허정지로 감경시킨 실제 승소 방어 논리 분석...
                  </p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 font-semibold flex items-center gap-2">
                  <span className="text-amber-600 font-bold">💡 실전 포인트:</span>
                  <span>도로교통법 개정안 및 검찰 구형 기준 실시간 반영 완료</span>
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
                  <span>변호사법 제23조 100% 준수 합법 플레이스 소개글 AI 생성</span>
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
                LEGAL ADVERTISING COMPLIANCE (BAR ASSOC.)
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                광고 규정 위반 걱정 0%,<br />
                변호사법 제23조와 변협 규정을 100% 준수합니다
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                '100% 승소 보장', '승소율 1위', '전관예우 표방', '부당 염가' 등 대한변호사협회의 엄격한 변호사 광고 규정상 금지된 위험 표현을 작성 즉시 실시간 탐지하고 품격 있는 전문직 문장으로 자동 순화합니다.
              </p>
              <div className="space-y-2 pt-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>변호사법 제23조 및 변호사 광고에 관한 규정 100% 실시간 반영</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>경쟁 로펌의 악의적 변협 징계 진정·고발 위험 원천 차단</span>
                </div>
              </div>
            </div>

            {/* 우측: 목업 (안전 검사 통과 카드) */}
            <div className="lg:col-span-6 order-1 lg:order-2">
              <div className="bg-[#F8FAFC] border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <span className="font-black text-slate-900 text-sm">변호사 광고 규정 안심 검수</span>
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
                  징계 위험 없이 신뢰받는 법률사무소 브랜딩을 구축하세요.
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
                    <p className="text-[10px] text-slate-500">재산분할 24억 이혼소송</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                  <span className="text-[10px] font-black text-indigo-700">3. 방문 상담 (1)</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <p className="font-bold text-slate-900">최*민 대표</p>
                    <p className="text-[10px] text-slate-500">횡령 배임 영장실질심사</p>
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <span className="text-[10px] font-black text-emerald-700">4. 수임 완료 (4)</span>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs space-y-1 shadow-2xs">
                    <p className="font-bold text-slate-900">정*훈 의뢰인</p>
                    <p className="text-[10px] text-emerald-600 font-bold">550만 원 수임 체결</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 우측: 텍스트 설명 */}
            <div className="lg:col-span-6 space-y-4">
              <div className="text-xs font-black text-[#FF6B00] tracking-wider uppercase">
                REAL-TIME INTAKE & CASE PIPELINE
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                접수된 상담 문의가 실제 사건 수임으로<br />
                체결될 때까지 10분 골든타임 관리
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                블로그와 스마트플레이스, 1분 안심 진단 폼으로 들어온 사건 문의를 흩어진 카톡이나 메모 없이 [신규 접수 ➔ 1차 상담 ➔ 대면 예약 ➔ 착수금 입금]까지 원스톱으로 관리합니다. 놓치는 의뢰인 0건, 골든타임 10분 내 신속한 유선 연결로 실제 수임 전환율을 3배 이상 극대화하세요.
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
              "재산분할과 위자료 소송은 의뢰인의 심리적 불안을 어루만져 주는 것이 핵심입니다. PostSync Pro로 작성된 이혼 전문 칼럼과 1분 진단 폼 덕분에 사무실에 앉아서도 매달 알짜배기 고액 재산분할 사건을 4~5건씩 직접 수임하고 있습니다."
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-black text-base text-white">
                이
              </div>
              <div>
                <p className="font-black text-sm text-white">이지안 파트너 변호사</p>
                <p className="text-xs text-sky-100 font-medium">법률사무소 다온 · 가사/이혼 전문</p>
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
              변호사 대표님들이 가장 많이 문의하시는 핵심 질문들입니다.
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
              전국의 법률사무소와 로펌이 PostSync Pro를 신뢰합니다
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
              수임을 직접 연결해 주는 AI 마케팅 OS를 도입한 대표 변호사님들의 실제 성과입니다.
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
              법률사무소의 사건 수임 성장을<br />
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
                  <p className="text-[10px] text-slate-400 font-bold">280+ 변호사 및 법률사무소 평가</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>사건 수임 전환율 평균 +340% 증가</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0284C7]" />
                  <span>변호사법 제23조 광고 규정 100% 검증</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#FF6B00]" />
                  <span>골든타임 10분 내 실시간 유선 알림 연동</span>
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
              대한민국 1등 변호사 사건 수임 전환 AI 플랫폼
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 font-semibold text-slate-600">
            <Link href="/pricing" className="hover:text-[#0284C7] font-bold">요금제 안내</Link>
            <Link href="/blog" className="hover:text-[#0284C7] font-bold text-slate-800">인사이트 칼럼</Link>
            <Link href="/tools" className="hover:text-emerald-600 font-bold text-emerald-700">무료 웹툴 7종</Link>
            <Link href="/terms" className="hover:text-slate-900">이용약관</Link>
            <Link href="/privacy" className="hover:text-slate-900">개인정보처리방침</Link>
            <Link href="/contact" className="hover:text-[#0284C7]">고객지원</Link>
            <Link href="/consult" target="_blank" className="hover:text-[#0284C7]">1분 안심 진단 센터</Link>
            <Link href="/dashboard" className="hover:text-[#FF6B00]">대표 변호사 로그인</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-6 pt-6 border-t border-slate-100 text-[11px] text-slate-400 text-center sm:text-left">
          © 2026 PostSync Pro. All rights reserved. 본 서비스는 변호사법 제23조 및 대한변협 광고 규정을 준수합니다.
        </div>
      </footer>
    </div>
  )
}
