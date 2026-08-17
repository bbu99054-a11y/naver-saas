'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ArrowRight, Sparkles, Zap, Search, LayoutTemplate, Copy, Scale, 
  FileText, Send, CheckCircle2, ShieldCheck, Cpu, Link2, Image as ImageIcon, 
  Clock, Monitor, Smartphone, Check, Building2, Stethoscope, 
  Briefcase, Calculator, ChevronDown, HelpCircle, ArrowUpRight,
  TrendingUp, Award, Flame, AlertTriangle, XCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// 직종별 인터랙티브 데모 프리셋 데이터
const DEMO_PRESETS = {
  tax: {
    id: 'tax',
    label: '세무사 · 회계사',
    icon: Calculator,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    keyword: '송파 아파트 상속세 감정평가 세금 절감',
    tone: '친근하고 전문적인 블로거 톤 (20~30대 타겟)',
    experience: '다주택자 양도세 및 상속세 상담 중 감정평가 사업 활용으로 1.2억 절세 성공 사례',
    title: '송파 아파트 상속세, 감정평가로 1.2억 절세한 실무 비결 및 주의사항',
    chars: '2,480자',
    readTime: '약 4분',
    infoboxTitle: '2026 개정 세법 & 국세청 감정평가 사업 핵심 포인트',
    infoboxDesc: '최근 국세청의 비주거용 부동산 및 고가 아파트 감정평가 사업이 확대되고 있습니다. 사전 감정평가를 전략적으로 활용하면 양도세 이월과세 및 상속세 과세표준을 합법적으로 대폭 낮출 수 있습니다.',
    introText: '안녕하세요. 15년 차 상속·증여 전문 세무사입니다. 최근 송파구 소재 아파트를 상속받으신 의뢰인께서 세금 고민으로 찾아오셨습니다. 기준시가와 시가 인정액의 차이로 인해 자칫 2억 원이 넘는 상속세를 납부할 뻔했던 사례였는데요...',
    cardTitle: '[실전 가이드] 2026 상속세 감정평가 3대 필수 체크리스트',
    tableRows: [
      { col1: '구분', col2: '일반 기준시가 적용', col3: '전략적 감정평가 적용' },
      { col1: '과세표준 산정', col2: '국세청 일방 추계 시가', col3: '공인 감정평가 2개 기관 평균' },
      { col1: '절세 효과', col2: '상속세 폭탄 위험', col3: '최대 1.2억 절세 및 양도세 방어' }
    ]
  },
  lawyer: {
    id: 'lawyer',
    label: '변호사 (형사/민사)',
    icon: Scale,
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    keyword: '음주운전 2회 적발 집행유예 구제 방안',
    tone: '매우 객관적이고 신뢰감 있는 법률 전문가 톤',
    experience: '혈중알코올농도 0.12% 재범 사건에서 긴급 피난 정황 및 부양가족 양형자료 제출로 실형 면제',
    title: '음주운전 2회 적발, 실형 위기에서 집행유예로 방어한 실전 판례 분석',
    chars: '2,620자',
    readTime: '약 4분 30초',
    infoboxTitle: '대법원 양형기준 & 도로교통법 제148조의2 적용 법리',
    infoboxDesc: '음주운전 재범은 징역 1년 이상 5년 이하 또는 벌금형에 처해집니다. 초기 경찰 조사 단계부터 일관된 진술과 객관적 양형 자료(차량 처분, 치료 의지, 생계형 가장)의 신속한 입증이 핵심입니다.',
    introText: '안녕하십니까. 형사 전문 대표 변호사입니다. 최근 음주운전 처벌 수위가 대폭 강화되면서 단순 2회 적발이라 하더라도 정식 재판에 회부되어 실형(구속)이 선고되는 비율이 급증하고 있습니다...',
    cardTitle: '[승소 로드맵] 음주운전 재판 단계별 골든타임 대응 4단계',
    tableRows: [
      { col1: '수사 단계', col2: '일반적 대응 (위험)', col3: '변호인 동행 전문 조력' },
      { col1: '경찰 조사', col2: '감정적 호소 및 번복', col3: '양형 입증 서류 1차 제출' },
      { col1: '검찰 송치', col2: '단순 반성문 제출', col3: '구속영장 기각 및 불구속 재판 유도' }
    ]
  },
  labor: {
    id: 'labor',
    label: '공인노무사',
    icon: Briefcase,
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-200',
    keyword: '부당해고 구제신청 인정 기준 및 입증자료',
    tone: '명쾌하고 이해하기 쉬운 노동법 전문가 톤',
    experience: '스타트업 수습기간 만료 통보를 서면 미교부 절차 하자로 노동위원회 전액 인정 승소',
    title: '수습기간 만료 부당해고, 노동위원회 구제신청 승소 핵심 전략',
    chars: '2,350자',
    readTime: '약 3분 50초',
    infoboxTitle: '근로기준법 제27조 (해고사유 등의 서면통지) 필수 요건',
    infoboxDesc: '수습기간이라 할지라도 근로계약이 체결된 이상 합리적 이유 없는 본채용 거부는 부당해고에 해당합니다. 특히 구두 통보나 카카오톡 통보는 서면통지 위반으로 절대적 무효 사유입니다.',
    introText: '안녕하세요. 노동 사건 전문 공인노무사입니다. "수습기간 3개월이 끝났으니 내일부터 출근하지 마세요."라는 청천벽력 같은 통보를 받고 억울함을 호소하시는 분들이 많습니다...',
    cardTitle: '[노무 실무] 부당해고 입증을 위한 결정적 증거 체크리스트',
    tableRows: [
      { col1: '증거 유형', col2: '불완전한 증거', col3: '결정적 법적 증거' },
      { col1: '해고 통보', col2: '구두 대화 기억', col3: '녹취록, 메신저 캡처, 서면' },
      { col1: '근무 평가', col2: '주관적 피드백', col3: '객관적 KPI 및 수습 평가표 유무' }
    ]
  },
  medical: {
    id: 'medical',
    label: '의사 · 한의사',
    icon: Stethoscope,
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-200',
    keyword: '허리디스크 비수술 도수치료 원리와 회복 과정',
    tone: '따뜻하고 신뢰감 있는 의료 전문가 톤',
    experience: '만성 요통 40대 직장인 MRI 분석 후 신경차단술과 맞춤 재활로 일상 복귀 사례',
    title: '지속되는 허리 통증, 수술 없이 근본 원인을 해결하는 비수술 치료 가이드',
    chars: '2,510자',
    readTime: '약 4분',
    infoboxTitle: '의료법 제56조 준수 및 치료 원리 안내',
    infoboxDesc: '본 칼럼은 의료법을 철저히 준수하여 특정 효과를 과장하지 않으며, 전문의로서 환자분들의 이해를 돕기 위한 객관적 의학 정보 전달을 목적으로 작성되었습니다.',
    introText: '안녕하세요. 척추관절 중점 진료 원장입니다. 아침에 일어날 때마다 허리가 뻐근하고 다리까지 저릿한 통증으로 일상이 무너진 분들을 매일 진료실에서 마주합니다...',
    cardTitle: '[의학 칼럼] 디스크 단계별 맞춤 치료법 및 생활 습관 5원칙',
    tableRows: [
      { col1: '통증 단계', col2: '초기 팽윤 / 돌출', col3: '파열 및 신경 압박' },
      { col1: '권장 치료', col2: '물리치료 & 체형 교정', col3: '신경차단술 & 정밀 도수치료' },
      { col1: '기대 효과', col2: '염증 완화 및 통증 경감', col3: '신경 부종 제거 및 근력 회복' }
    ]
  }
}

export default function LandingPage() {
  const [selectedPresetKey, setSelectedPresetKey] = useState<keyof typeof DEMO_PRESETS>('tax')
  const [viewMode, setViewMode] = useState<'pc' | 'mobile'>('pc')
  const [isTitleCopied, setIsTitleCopied] = useState(false)
  const [isCopiedToNaver, setIsCopiedToNaver] = useState(false)
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0)

  const currentPreset = DEMO_PRESETS[selectedPresetKey]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
  }

  return (
    <div className="min-h-screen bg-[#0A0D14] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* 2026 Modern Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-tr from-indigo-600/25 via-violet-600/20 to-purple-800/10 blur-[140px] rounded-full" />
        <div className="absolute top-[45%] left-[-150px] w-[500px] h-[500px] bg-blue-600/15 blur-[120px] rounded-full" />
        <div className="absolute top-[70%] right-[-150px] w-[600px] h-[600px] bg-emerald-600/15 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* 2026 Glassmorphism Navbar */}
      <header className="fixed top-0 w-full bg-[#0A0D14]/80 backdrop-blur-xl z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 border border-indigo-400/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              PostSync
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                2026 Engine
              </span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#demo" className="hover:text-white transition-colors">글쓰기 데모</a>
            <a href="#features" className="hover:text-white transition-colors">5대 특별함</a>
            <a href="#comparison" className="hover:text-white transition-colors">품질 비교</a>
            <a href="#pricing" className="hover:text-white transition-colors">요금제</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <Link href="/seo-check" className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1">
              무료 진단 <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors">
              로그인
            </Link>
            <Link href="/login">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-5 h-9 font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 border border-indigo-400/30">
                무료 10회 시작하기
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 pb-20 px-6 relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Top Pill Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/20 via-violet-500/20 to-purple-500/20 text-indigo-300 font-semibold text-xs mb-8 border border-indigo-500/30 shadow-inner">
            <Scale className="w-3.5 h-3.5 text-indigo-400" /> 변호사 · 세무사 · 노무사 · 의사 전문직 특화 AI
          </motion.div>
          
          {/* Main Title */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.15] text-white">
            나의 승소 · 상담 실무 사례가<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
              단 1분 만에 완벽한 전문가 칼럼
            </span>
            으로.
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-base md:text-xl text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
            일반 양산형 AI의 뻔한 지어내기(환각)는 이제 그만. 대표님의 실무 지식(RAG)과 최신 판례를 결합하여, 
            <strong className="text-slate-200 font-semibold"> 광고법 위반 제로 · 스마트에디터 ONE 서식 100% 호환</strong> 고품질 글을 완성합니다.
          </motion.p>
          
          {/* 3 Core Trust Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 광고법 위반 제로 (100% 합법)
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
              <Cpu className="w-4 h-4 text-indigo-400" /> 실무 판례 · 행정해석 강제 RAG
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-sm">
              <ImageIcon className="w-4 h-4 text-amber-400" /> 실사 인포그래픽 카드 자동 생성
            </div>
          </motion.div>
          
          {/* Main Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-13 px-8 text-base rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 transition-all hover:scale-105 font-bold border border-indigo-400/40">
                10회 무료 생성 시작하기 <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <a href="#demo">
              <Button size="lg" variant="outline" className="h-13 px-7 text-base rounded-full bg-white/5 hover:bg-white/10 text-slate-200 border-white/15 font-semibold transition-all">
                실제 글쓰기 화면 체험하기
              </Button>
            </a>
          </motion.div>

          {/* Social Proof Counter */}
          <motion.div variants={itemVariants} className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-left">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-2xl font-black text-white">15,000+</div>
              <div className="text-xs text-slate-400 mt-1">전문직 발행 원고 수</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-2xl font-black text-emerald-400">0.00%</div>
              <div className="text-xs text-slate-400 mt-1">광고법 위반 제재율</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-2xl font-black text-indigo-400">단 1분</div>
              <div className="text-xs text-slate-400 mt-1">원고 작성 소요 시간</div>
            </div>
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
              <div className="text-2xl font-black text-amber-400">96% 절감</div>
              <div className="text-xs text-slate-400 mt-1">마케팅 대행사 외주비</div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ========================================================================= */}
      {/* 🚀 [CORE HIGHLIGHT] 실제 글쓰기 화면 정밀 재현 인터랙티브 데모 윈도우 */}
      {/* ========================================================================= */}
      <section id="demo" className="py-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-3 border border-indigo-500/20">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> LIVE INTERACTIVE STUDIO
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              실제 글쓰기 화면을 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">직접 조작</span>해보세요
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
              직종별 탭을 클릭하거나 PC/모바일 뷰를 전환하여 실제 PostSync 에디터의 막강한 서식과 디테일을 확인하세요.
            </p>

            {/* Profession Presets Switcher Bar */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {(Object.keys(DEMO_PRESETS) as Array<keyof typeof DEMO_PRESETS>).map((key) => {
                const preset = DEMO_PRESETS[key]
                const Icon = preset.icon
                const isSelected = selectedPresetKey === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedPresetKey(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105 border border-indigo-400/40'
                        : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {preset.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* SaaS Studio Window Frame */}
          <div className="rounded-3xl bg-[#121624] border border-white/15 shadow-2xl shadow-black/80 overflow-hidden">
            
            {/* macOS Browser Header */}
            <div className="bg-[#181D30] px-4 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]" />
                <span className="text-[11px] font-mono text-slate-400 ml-2 hidden sm:inline">
                  postsync.ai / dashboard / write
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  C-Rank SEO Core v2.6 Active
                </span>
              </div>
            </div>

            {/* Inner Dashboard Body: Left Panel (320px) + Right Editor Preview Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px] bg-[#0E121E]">
              
              {/* [LEFT PANEL] Target Setting & RAG Control (4 cols) */}
              <div className="lg:col-span-4 p-5 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col justify-between bg-[#121624]/60">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">SEO 원고 작성 설정</h4>
                        <p className="text-[10px] text-slate-400">타겟 키워드와 RAG 지식을 결합합니다.</p>
                      </div>
                    </div>
                  </div>

                  {/* Target Keyword Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                      <span>타겟 키워드</span>
                      <span className="text-[10px] text-indigo-400 font-normal">C-Rank 알고리즘 매칭</span>
                    </label>
                    <div className="w-full bg-[#1A2035] border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white flex items-center justify-between">
                      <span className="truncate">{currentPreset.keyword}</span>
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                    </div>
                  </div>

                  {/* Tone and Manner Select */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300">톤앤매너 (문체)</label>
                    <div className="w-full bg-[#1A2035] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 flex items-center justify-between">
                      <span className="truncate">{currentPreset.tone}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  {/* RAG Knowledge Case Input */}
                  <div className="space-y-1.5 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20">
                    <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      오늘의 핵심 상담 · 판례 포인트 (RAG)
                    </label>
                    <p className="text-[10px] text-indigo-300/80 leading-snug">
                      나만의 승소/상담 특이 케이스를 1줄만 적어도 1인칭 후킹에 자동 반영됩니다.
                    </p>
                    <div className="w-full bg-[#101424] border border-indigo-500/30 rounded-lg p-2.5 text-[11px] text-slate-200 leading-relaxed min-h-[70px]">
                      {currentPreset.experience}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold h-10 text-xs shadow-lg shadow-indigo-600/30 rounded-xl border border-indigo-400/30">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> AI 블로그 생성하기 (단 1분 소요)
                  </Button>
                </div>

                {/* Left Bottom Tips */}
                <div className="bg-white/5 p-3 rounded-xl border border-white/5 mt-4 text-[11px] text-slate-400 space-y-1">
                  <div className="font-bold text-slate-300 flex items-center gap-1 text-[11px]">
                    💡 2026 최신 로직 적용 완료
                  </div>
                  <p>• 네이버 스마트에디터 ONE 전용 HTML 자동 서식화</p>
                  <p>• 광고법 금지어 실시간 필터링 가드레일 활성화</p>
                </div>
              </div>

              {/* [RIGHT PANEL] SmartEditor ONE Real Preview Viewer (8 cols) */}
              <div className="lg:col-span-8 flex flex-col bg-[#F8FAFC] text-slate-900">
                
                {/* Viewer Top Sub-Header */}
                <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
                    <span className="text-xs font-bold text-slate-800">스마트에디터 ONE 미리보기</span>
                    <span className="text-[10px] text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md font-semibold border border-indigo-100 hidden sm:inline">
                      ● 실시간 스트리밍 완료
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-slate-400" /> {currentPreset.chars}
                      </span>
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" /> {currentPreset.readTime}
                      </span>
                    </div>

                    {/* PC / Mobile View Switcher */}
                    <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] font-bold">
                      <button
                        onClick={() => setViewMode('pc')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                          viewMode === 'pc' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" /> PC 뷰
                      </button>
                      <button
                        onClick={() => setViewMode('mobile')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                          viewMode === 'mobile' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" /> 모바일 뷰
                      </button>
                    </div>
                  </div>
                </div>

                {/* Title Bar */}
                <div className="bg-slate-50/80 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded shrink-0">
                    SEO 제목
                  </span>
                  <div className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-md px-3 py-1.5 flex-1 truncate">
                    {currentPreset.title}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-7 text-xs border-indigo-200 text-indigo-700 hover:bg-indigo-50 font-bold shrink-0"
                    onClick={() => {
                      setIsTitleCopied(true)
                      setTimeout(() => setIsTitleCopied(false), 1500)
                    }}
                  >
                    {isTitleCopied ? <Check className="w-3 h-3 text-emerald-600 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {isTitleCopied ? '복사됨' : '제목 복사'}
                  </Button>
                </div>

                {/* Editor Content Area (PC Wide vs Mobile Phone Frame) */}
                <div className="flex-1 p-4 overflow-y-auto max-h-[440px] bg-slate-100/60">
                  
                  {viewMode === 'mobile' ? (
                    /* Mobile Smartphone Mockup Frame */
                    <div className="flex justify-center">
                      <div className="w-[340px] bg-white rounded-[28px] border-[5px] border-slate-800 shadow-xl overflow-hidden text-left flex flex-col">
                        {/* Mobile Status Bar */}
                        <div className="bg-slate-800 text-white text-[10px] px-4 py-1 flex justify-between items-center">
                          <span>9:41</span>
                          <div className="w-12 h-2.5 bg-slate-900 rounded-full" />
                          <span>5G 100%</span>
                        </div>
                        {/* NAVER Blog App Header */}
                        <div className="bg-[#03C75A] text-white px-3 py-1.5 text-xs font-bold flex items-center justify-between">
                          <span>NAVER Blog</span>
                          <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">스마트에디터 ONE</span>
                        </div>
                        {/* Mobile Article Content */}
                        <div className="p-3.5 text-xs space-y-3">
                          {/* Infobox */}
                          <div className="p-2.5 rounded-lg bg-slate-50 border-l-4 border-indigo-500 shadow-2xs">
                            <div className="font-bold text-[11px] text-indigo-950 flex items-center gap-1 mb-1">
                              💡 {currentPreset.infoboxTitle}
                            </div>
                            <p className="text-[10px] text-slate-600 leading-relaxed">{currentPreset.infoboxDesc}</p>
                          </div>
                          {/* Body Text */}
                          <p className="text-slate-800 leading-relaxed text-[11px]">{currentPreset.introText}</p>
                          {/* Infographic Card Thumbnail */}
                          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-3 text-center">
                            <div className="text-[9px] font-bold text-indigo-300 uppercase tracking-wider mb-0.5">PostSync Verified Info</div>
                            <div className="font-extrabold text-xs text-amber-300">{currentPreset.cardTitle}</div>
                            <div className="mt-2 grid grid-cols-3 gap-1 text-[9px] bg-white/10 p-1.5 rounded-lg">
                              <div>{currentPreset.tableRows[1].col1}</div>
                              <div className="text-slate-300">{currentPreset.tableRows[1].col2}</div>
                              <div className="font-bold text-emerald-300">{currentPreset.tableRows[1].col3}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* PC Desktop Wide View */
                    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl border border-slate-200 shadow-xs text-left space-y-4">
                      {/* 1. Official Law / Point Infobox */}
                      <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-indigo-600 shadow-2xs">
                        <div className="font-bold text-sm text-indigo-950 flex items-center gap-1.5 mb-1.5">
                          <span className="bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">핵심 법리</span>
                          {currentPreset.infoboxTitle}
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{currentPreset.infoboxDesc}</p>
                      </div>

                      {/* 2. Intro Text */}
                      <p className="text-sm text-slate-800 leading-relaxed">{currentPreset.introText}</p>

                      {/* 3. Auto Generated Card Infographic */}
                      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-5 text-center my-4">
                        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold mb-2 border border-indigo-500/30">
                          <Award className="w-3 h-3 text-amber-400" /> C-Rank High Quality Card
                        </div>
                        <h4 className="font-extrabold text-sm md:text-base text-yellow-300 mb-3">{currentPreset.cardTitle}</h4>
                        <div className="grid grid-cols-3 gap-2 text-xs bg-white/10 p-3 rounded-xl border border-white/10 text-left">
                          <div className="font-bold text-slate-200">{currentPreset.tableRows[0].col1}</div>
                          <div className="font-bold text-slate-200">{currentPreset.tableRows[0].col2}</div>
                          <div className="font-bold text-emerald-300">{currentPreset.tableRows[0].col3}</div>
                          <div className="text-slate-300 text-[11px]">{currentPreset.tableRows[1].col1}</div>
                          <div className="text-slate-400 text-[11px]">{currentPreset.tableRows[1].col2}</div>
                          <div className="text-emerald-400 font-bold text-[11px]">{currentPreset.tableRows[1].col3}</div>
                          <div className="text-slate-300 text-[11px]">{currentPreset.tableRows[2].col1}</div>
                          <div className="text-slate-400 text-[11px]">{currentPreset.tableRows[2].col2}</div>
                          <div className="text-emerald-400 font-bold text-[11px]">{currentPreset.tableRows[2].col3}</div>
                        </div>
                      </div>

                      {/* 4. Sub Heading */}
                      <h3 className="text-base font-bold text-slate-900 border-b-2 border-slate-100 pb-1 pt-2">
                        2. 실무에서 빈번히 발생하는 실수와 해결 방안
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        많은 분들이 가장 놓치기 쉬운 포인트는 입증 책임의 소재입니다. 적절한 시점에 객관적인 서면 자료를 확보하지 못하면 추후 이의신청이나 행정심판 단계에서 매우 불리해질 수 있습니다.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bottom Action Bar */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2 shadow-xs">
                  <div className="text-[11px] text-slate-500 hidden sm:block">
                    서식 깨짐 제로: <strong className="text-slate-800">클립보드 HTML 무손실 복사</strong>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                    <Button 
                      className={`h-9 px-4 text-xs font-bold transition-all ${
                        isCopiedToNaver
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#03C75A] hover:bg-[#02B350] text-white shadow-md shadow-emerald-600/20'
                      }`}
                      onClick={() => {
                        setIsCopiedToNaver(true)
                        setTimeout(() => setIsCopiedToNaver(false), 2000)
                      }}
                    >
                      {isCopiedToNaver ? (
                        <><Check className="w-3.5 h-3.5 mr-1" /> 네이버 스마트에디터 복사 완료!</>
                      ) : (
                        <><span className="font-black mr-1">N</span> 네이버 블로그 원클릭 복사</>
                      )}
                    </Button>
                    <div className="hidden md:flex items-center gap-1.5">
                      <Button variant="outline" size="sm" className="h-9 text-xs font-bold border-blue-200 text-blue-700 bg-blue-50/50">
                        <span className="font-black mr-1">W</span> 워드프레스
                      </Button>
                      <Button variant="outline" size="sm" className="h-9 text-xs font-bold border-orange-200 text-orange-700 bg-orange-50/50">
                        <span className="font-black mr-1">T</span> 티스토리
                      </Button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🌟 5 CORE UNFAIR ADVANTAGES (PostSync만의 독보적인 5대 특별함) */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 px-6 relative z-10 border-t border-white/10 bg-[#0E121E]">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-3 border border-indigo-500/20">
              <Award className="w-3.5 h-3.5" /> UNFAIR ADVANTAGES
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              전문직 대표님들이 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">PostSync만 고집하는 5가지 이유</span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              일반 블로그 AI와는 차원이 다른, 전문직만을 위해 설계된 기술적 차별점을 확인하세요.
            </p>
          </div>

          {/* 5 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. RAG & Precedents */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.07] transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-indigo-500/30">
                  <Cpu className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-indigo-400 mb-1">01 / RAG & SILO SEARCH</div>
                <h3 className="text-xl font-bold text-white mb-3">실무 판례 · 지식베이스 강제 결합</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  대표님의 사무소 소개, 전문 분야, 승소 사례를 사전 학습(RAG)하고, 글 작성 시 실시간 판례 및 행정해석(Tavily API)을 강제로 주입하여 100% 진짜 전문가가 쓴 깊이 있는 원고를 생성합니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-indigo-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 환각(Hallucination) 원천 차단
              </div>
            </div>

            {/* 2. Legal Compliance */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.07] transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-emerald-500/30">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-emerald-400 mb-1">02 / LEGAL COMPLIANCE</div>
                <h3 className="text-xl font-bold text-white mb-3">광고법 100% 컴플라이언스 가드레일</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  '100% 승소', '최고의 전문의', '무조건 환급' 등 변호사법·의료법·세무사법 위반으로 영업정지나 과태료를 유발할 수 있는 금지 표현을 실시간 검증하고 합법적인 전문 용어로 자동 치환합니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 영업정지 및 협회 징계 리스크 0%
              </div>
            </div>

            {/* 3. Topical Authority Internal Links */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-violet-500/40 hover:bg-white/[0.07] transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-violet-500/30">
                  <Link2 className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-violet-400 mb-1">03 / SEO TOPICAL AUTHORITY</div>
                <h3 className="text-xl font-bold text-white mb-3">자동 내부 링크 (체류시간 극대화)</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  과거에 작성했던 관련 승소 칼럼이나 전문 글을 AI가 맥락에 맞춰 새 글 본문 내에 자연스러운 하이퍼링크로 자동 연결합니다. 블로그 체류시간과 네이버 C-Rank 주제 권위 점수를 극대화합니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-violet-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 네이버 C-Rank 알고리즘 가산점
              </div>
            </div>

            {/* 4. Infographics & Card News */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.07] transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform border border-amber-500/30">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div className="text-xs font-bold text-amber-400 mb-1">04 / VISUAL CONTENT</div>
                <h3 className="text-xl font-bold text-white mb-3">초고화질 실사 인포그래픽 자동 생성</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  텍스트만 빽빽한 지루한 글은 독자가 바로 이탈합니다. 본문 맥락에 맞는 1:1 맞춤형 고화질 카드뉴스 이미지, 인포박스, 비교 요약표를 자동으로 생성하여 모바일 가독성을 3배 끌어올립니다.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-xs text-amber-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 저작권 걱정 없는 100% 안전 에셋
              </div>
            </div>

            {/* 5. SmartEditor Copy & Multi-Publish (Wide 2-col on large screens) */}
            <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-white/5 p-8 rounded-3xl border border-indigo-500/30 hover:border-indigo-400/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#03C75A] to-emerald-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-600/30">
                    N
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-400 mb-0.5">05 / 0.01s ZERO-LOSS CLIPBOARD</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">스마트에디터 ONE 서식 100% 무손실 복사 & 동시 발행</h3>
                  </div>
                </div>
                <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                  기존 AI 도구처럼 서식이 깨져서 일일이 폰트 크기와 표를 다시 수정할 필요가 없습니다. 
                  버튼 클릭 한 번으로 네이버 스마트에디터 전용 서식(제목, 22px 대제목, 인포박스, 이미지)을 
                  완벽하게 클립보드에 복사하며, 워드프레스와 티스토리에도 동시 자동 배포됩니다.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10">
                <div className="bg-white/10 p-3 rounded-xl text-center text-xs font-bold text-white border border-white/10">
                  🟢 네이버 스마트에디터 ONE
                </div>
                <div className="bg-white/10 p-3 rounded-xl text-center text-xs font-bold text-white border border-white/10">
                  🔵 워드프레스 REST API
                </div>
                <div className="bg-white/10 p-3 rounded-xl text-center text-xs font-bold text-white border border-white/10">
                  🟠 티스토리 OpenAPI
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* ⚖️ [BEFORE vs AFTER] 일반 양산형 AI vs PostSync 리얼 비교 */}
      {/* ========================================================================= */}
      <section id="comparison" className="py-24 px-6 relative z-10 border-t border-white/10 bg-[#0A0D14]">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-bold mb-3 border border-rose-500/20">
              <TrendingUp className="w-3.5 h-3.5" /> QUALITY COMPARISON
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              왜 흔한 챗GPT 글로는 <span className="text-rose-400">수임 · 상담 전환이 안 될까요?</span>
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              일반 양산형 AI와 PostSync 전문직 엔진의 압도적인 퀄리티 차이를 직접 확인하세요.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* ❌ General ChatGPT / Copy AI */}
            <div className="bg-rose-950/20 rounded-3xl p-8 border border-rose-500/30 relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center text-rose-400 border border-rose-500/30">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">일반 챗GPT / 양산형 AI 도구</h3>
                  <p className="text-xs text-rose-300">누구나 알아채는 로봇 같은 글 & 저품질 위험</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">뻔한 도입부 & 기계적 어투</strong>
                    "현대 사회에서 ~는 매우 중요합니다." 식의 진부한 문체로 3초 만에 이탈 발생
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">환각 오류 & 출처 불명 판례</strong>
                    존재하지 않는 가짜 법조문이나 폐지된 세법을 그럴듯하게 지어내는 치명적 결함
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">광고법 위반 위험 방치</strong>
                    '최고', '100% 승소' 등 영업정지 유발 표현을 무분별하게 출력
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-white/5 p-3.5 rounded-xl border border-white/5">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">서식 깨짐 & 이미지 전무</strong>
                    스마트에디터에 붙여넣으면 서식이 다 깨져서 1시간 이상 재편집 필요
                  </div>
                </li>
              </ul>
            </div>

            {/* ✅ PostSync Professional Engine */}
            <div className="bg-gradient-to-b from-indigo-950/40 to-slate-900/60 rounded-3xl p-8 border border-indigo-500/40 relative shadow-xl shadow-indigo-950/50">
              <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-indigo-500 to-emerald-500 text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md">
                POSTSYNC PREMIER
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/30">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">PostSync 전문직 특화 엔진</h3>
                  <p className="text-xs text-indigo-300">대표님 실무가 담긴 1인칭 칼럼 & 상위 노출 보장</p>
                </div>
              </div>

              <ul className="space-y-4 text-sm text-slate-300">
                <li className="flex items-start gap-3 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">1인칭 실무 상담 후킹 도입부</strong>
                    "지난주 송파구 의뢰인 상담 중..." 등 실제 전문가의 생생한 사례로 몰입 유도
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">실제 판례 및 법률 조문 강제 결합</strong>
                    Tavily 실시간 검색과 대표님 RAG 지식 결합으로 100% 팩트 기반 신뢰도 구축
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">광고법 100% 자동 검증 가드레일</strong>
                    협회 심의 및 의료법·변호사법 기준에 완벽 부합하는 안전한 전문 어휘로 정제
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">스마트에디터 ONE 서식 0.01초 복사</strong>
                    인포박스, 목차, 1:1 고화질 카드뉴스까지 복사 버튼 한 번으로 즉시 포스팅
                  </div>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 💰 [ROI SIMULATOR] 대행사 외주 vs PostSync 비용 비교 */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 relative z-10 border-t border-white/10 bg-[#0E121E]">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
              <Calculator className="w-3.5 h-3.5" /> COST EFFICIENCY
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              매달 나가던 <span className="text-emerald-400">대행사 외주비 300만 원</span>, 이제 아끼세요
            </h2>
            <p className="text-slate-400 text-base max-w-2xl mx-auto">
              전문 지식 없는 대행사 작가에게 맡기고 일일이 수정하느라 지치셨나요?
            </p>
          </div>

          <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-3xl p-8 md:p-10 border border-white/15 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10">
              
              {/* Marketing Agency */}
              <div className="space-y-6 md:pr-8">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">기존 마케팅 대행사 외주</div>
                <div className="text-3xl font-black text-rose-400">월 200 ~ 300만 원</div>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-center gap-2">❌ 원고 1편당 3~5일 대기 시간</li>
                  <li className="flex items-center gap-2">❌ 비전문가 작가의 얕은 복사-붙여넣기 글</li>
                  <li className="flex items-center gap-2">❌ 잘못된 법률/의학 지식으로 대표님이 직접 검수</li>
                  <li className="flex items-center gap-2">❌ 불만족 시 환불 불가 및 계약 위약금</li>
                </ul>
              </div>

              {/* PostSync */}
              <div className="space-y-6 md:pl-8 pt-6 md:pt-0">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  PostSync 도입 시
                </div>
                <div className="text-3xl font-black text-emerald-400">월 49,000원 ~</div>
                <ul className="space-y-3 text-sm text-slate-200">
                  <li className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Check className="w-4 h-4 text-emerald-400" /> 단 1분 만에 고품질 칼럼 즉시 완성
                  </li>
                  <li className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Check className="w-4 h-4 text-emerald-400" /> 대표님의 승소/상담 실무(RAG) 100% 반영
                  </li>
                  <li className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Check className="w-4 h-4 text-emerald-400" /> 광고법 실시간 자동 검증으로 안심
                  </li>
                  <li className="flex items-center gap-2 text-emerald-300 font-semibold">
                    <Check className="w-4 h-4 text-emerald-400" /> 연간 약 3,000만 원의 고정비 절감
                  </li>
                </ul>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🏷️ PRICING SECTION (요금제) */}
      {/* ========================================================================= */}
      <section id="pricing" className="py-24 px-6 relative z-10 border-t border-white/10 bg-[#0A0D14]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">합리적인 전문직 요금제</h2>
            <p className="text-slate-400 text-base">가장 뛰어난 AI 마케팅 파트너를 커피 몇 잔 가격으로 고용하세요.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col hover:border-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Basic</h3>
              <p className="text-slate-400 text-xs mb-6">1인 사무소 및 개업 초기 전문가</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-white">₩49,000</span><span className="text-slate-400 text-sm"> / 월</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 월 10건 전문 원고 생성</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 판례 실시간 검색 RAG</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 스마트에디터 ONE 서식 복사</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 광고법 기본 컴플라이언스</li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold h-11 rounded-xl" variant="outline">
                  시작하기
                </Button>
              </Link>
            </div>

            {/* Pro Plan (Best) */}
            <div className="bg-gradient-to-b from-indigo-900/60 to-violet-950/60 text-white p-8 rounded-3xl border-2 border-indigo-400 shadow-2xl flex flex-col relative transform md:-translate-y-4">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-indigo-500 to-emerald-400 text-slate-950 px-4 py-1 rounded-full text-xs font-black shadow-lg">
                가장 추천 ⭐
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-indigo-200 text-xs mb-6">주 2~3회 정기 포스팅으로 상위 노출을 노리는 분</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-white">₩149,000</span><span className="text-indigo-200 text-sm"> / 월</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-200">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 월 30건 전문 원고 생성</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1:1 맞춤형 실사 카드뉴스 자동 생성</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 과거 글 자동 내부 링크 연결</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 광고법 위반 필터링 가드레일</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 워드프레스 · 티스토리 동시 발행</li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-500/30 border border-indigo-300/30">
                  10크레딧 무료 체험하기
                </Button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 flex flex-col hover:border-white/20 transition-all">
              <h3 className="text-2xl font-bold text-white mb-2">Premium</h3>
              <p className="text-slate-400 text-xs mb-6">다채널 운영 및 대형 전문직 법인</p>
              <div className="mb-6"><span className="text-4xl font-extrabold text-white">₩290,000</span><span className="text-slate-400 text-sm"> / 월</span></div>
              <ul className="space-y-4 mb-8 flex-1 text-sm text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 월 100건 원고 생성 (다계정)</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 전용 커스텀 페르소나 3개 학습</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 고화질 스톡 이미지 무제한 매칭</li>
                <li className="flex items-center gap-3"><CheckCircle2 className="w-4 h-4 text-indigo-400" /> 1:1 전담 매니저 우선 기술 지원</li>
              </ul>
              <Link href="/login">
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold h-11 rounded-xl" variant="outline">
                  도입 문의하기
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* ❓ FAQ ACCORDION SECTION (전문직 자주 묻는 질문) */}
      {/* ========================================================================= */}
      <section id="faq" className="py-24 px-6 relative z-10 border-t border-white/10 bg-[#0E121E]">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold mb-3 border border-indigo-500/20">
              <HelpCircle className="w-3.5 h-3.5" /> FREQUENTLY ASKED QUESTIONS
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
              자주 묻는 질문
            </h2>
            <p className="text-slate-400 text-base">
              PostSync 도입 전 가장 궁금해하시는 질문들을 정리했습니다.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "네이버에서 AI가 쓴 글이라고 저품질(유사문서) 제재를 가하지 않나요?",
                a: "결코 그렇지 않습니다. 네이버 C-Rank 및 DIA+ 알고리즘의 핵심은 '누가 썼는가'가 아니라 '문서의 독창성과 실제 전문 지식, 체류시간'입니다. PostSync는 대표님의 프로필/경험(RAG)과 실제 판례를 1인칭 서사로 녹여내며, 마크다운/HTML 서식을 최적화하여 네이버 로직상 가장 우수한 C-Rank 고품질 문서로 판정받도록 설계되었습니다."
              },
              {
                q: "변호사법, 의료법, 세무사법 등 전문직 광고법에 걸리지 않나요?",
                a: "PostSync는 전문직 법률 가드레일이 기본 탑재되어 있습니다. '100% 승소', '최고의 전문의', '무조건 환급' 등 법적 제재 대상이 되는 금지어를 실시간으로 사전 검증하고, 합법적이고 신뢰감을 주는 전문 용어로 자동 순화하여 영업정지 및 협회 징계 리스크를 원천 차단합니다."
              },
              {
                q: "생성된 글을 네이버 블로그에 옮길 때 서식이 깨지지 않나요?",
                a: "PostSync의 [네이버 스마트에디터 복사] 기능은 단순 텍스트가 아닌 '네이버 스마트에디터 ONE 전용 클립보드 서식'을 0.01초 만에 복사합니다. 제목, 소제목(22px), 인포박스, 표, 정렬, 카드뉴스 이미지가 네이버 블로그 에디터에 원본 그대로 완벽하게 붙여넣어집니다."
              },
              {
                q: "다른 플랫폼(워드프레스, 티스토리)에도 동시에 올릴 수 있나요?",
                a: "네, 가능합니다. 대시보드 설정에서 워드프레스 Application Password 또는 티스토리 OpenAPI를 연동해 두시면, 원고 생성 후 버튼 클릭 한 번으로 네이버 블로그뿐만 아니라 워드프레스와 티스토리에도 즉시 자동 발행됩니다."
              },
              {
                q: "무료 체험 시 결제 카드를 등록해야 하나요?",
                a: "아닙니다! 회원가입 시 카드 등록 없이 10 크레딧이 즉시 무료 지급됩니다. 10편의 전문 칼럼을 직접 생성해보시고 품질에 만족하셨을 때 유료 플랜을 선택하시면 됩니다."
              }
            ].map((faq, idx) => {
              const isOpen = faqOpenIndex === idx
              return (
                <div 
                  key={idx} 
                  className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden transition-colors hover:border-white/20"
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-base"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 🚀 FINAL CTA SECTION */}
      {/* ========================================================================= */}
      <section className="py-24 px-6 relative z-10 bg-gradient-to-b from-[#0E121E] to-[#0A0D14] text-center border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-lg shadow-indigo-500/20">
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
            전문가의 시간은 비쌉니다.<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-emerald-400">
              마케팅은 PostSync에게 맡기세요.
            </span>
          </h2>
          <p className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            지금 가입하시면 <strong className="text-white">10 크레딧이 즉시 무료 지급</strong>됩니다.<br className="hidden sm:inline" />
            단 1분 만에 대표님의 첫 번째 C-Rank 전문 칼럼을 완성해보세요.
          </p>
          <Link href="/login">
            <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-2xl shadow-indigo-600/40 transition-transform hover:scale-105 font-extrabold border border-indigo-400/40">
              지금 무료 10회 체험 시작하기 <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070A0F] text-slate-500 py-12 text-center text-xs border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-sm font-bold text-white">PostSync</span>
          </div>
          <div className="flex gap-6 mb-6 text-slate-400">
            <Link href="/terms" className="hover:text-white transition-colors">이용약관</Link>
            <Link href="/privacy" className="hover:text-white transition-colors font-bold">개인정보 처리방침</Link>
            <Link href="/seo-check" className="hover:text-white transition-colors text-rose-400">무료 블로그 진단</Link>
          </div>
          <p>© 2026 PostSync SaaS. All rights reserved.</p>
          <p className="mt-1 text-slate-600">Empowering Professionals with 2026 Advanced AI Marketing & SEO Automation.</p>
        </div>
      </footer>

    </div>
  )
}
