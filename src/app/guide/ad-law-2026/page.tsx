'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  BookOpen,
  Copy,
  Check,
  Download,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  FileText,
  Search,
  CheckCircle2,
  Scale,
  Stethoscope,
  Calculator,
  Layers,
  TrendingUp,
  ArrowRight,
  Zap,
  Globe,
  ImageIcon,
  Clock,
  Briefcase,
  Monitor,
  Smartphone,
  CheckSquare,
  Share2,
  ChevronDown
} from 'lucide-react'

interface ForbiddenWord {
  id: number
  word: string
  category: 'law' | 'medical' | 'tax' | 'all'
  type: string
  risk: 'HIGH' | 'MEDIUM' | 'LOW'
  safeWord: string
  reason: string
}

const FORBIDDEN_WORDS: ForbiddenWord[] = [
  {
    id: 1,
    word: '100% 승소',
    category: 'law',
    type: '보장성 표현',
    risk: 'HIGH',
    safeWord: '승소 사례 기반 체계적 조력',
    reason: '변호사법 제23조 위반 (재판 결과 보장 및 소비자 오도 금지)'
  },
  {
    id: 2,
    word: '승소 보장',
    category: 'law',
    type: '보장성 표현',
    risk: 'HIGH',
    safeWord: '철저한 법리 검토 및 맞춤 대응',
    reason: '변호사법 제23조 위반 (결과 확약 금지)'
  },
  {
    id: 3,
    word: '무죄 보장',
    category: 'law',
    type: '보장성 표현',
    risk: 'HIGH',
    safeWord: '무죄 주장 관련 판례 심층 분석',
    reason: '변호사법 제23조 위반 (형사재판 결과 단정 금지)'
  },
  {
    id: 4,
    word: '기각 시 100% 환불',
    category: 'law',
    type: '부당 유인',
    risk: 'HIGH',
    safeWord: '투명하고 합리적인 수임료 산정 기준 안내',
    reason: '변호사법 광고규정 및 공정위 표시광고법 위반'
  },
  {
    id: 5,
    word: '최대 절세',
    category: 'tax',
    type: '과대 광고',
    risk: 'HIGH',
    safeWord: '합법적 세액 감면 및 공제 요건 극대화',
    reason: '세무사법 제16조 및 2026 세무사 광고규정 위반'
  },
  {
    id: 6,
    word: '완벽한 절세',
    category: 'tax',
    type: '과대 광고',
    risk: 'HIGH',
    safeWord: '오차 없는 세무 리스크 정밀 진단',
    reason: '세무사법 위반 (단정적·과장 표방 금지)'
  },
  {
    id: 7,
    word: '평균 환급액 OOO만원',
    category: 'tax',
    type: '부당 유인',
    risk: 'HIGH',
    safeWord: '개별 소득 및 업종별 맞춤 환급 모의계산 안내',
    reason: '2026.6 시행 개정 세무사법 위반 (산정조건 누락 과장)'
  },
  {
    id: 8,
    word: '완치',
    category: 'medical',
    type: '의료법 위반',
    risk: 'HIGH',
    safeWord: '증상 호전 및 장기적 건강 관리 지향',
    reason: '의료법 제56조 제2항 위반 (치료 효과 오인 유발)'
  },
  {
    id: 9,
    word: '완벽한 치료',
    category: 'medical',
    type: '의료법 위반',
    risk: 'HIGH',
    safeWord: '정밀 진단 및 단계별 맞춤 치료 계획',
    reason: '의료법 제56조 위반 (결과 단정 금지)'
  },
  {
    id: 10,
    word: '부작용 없는',
    category: 'medical',
    type: '의료법 위반',
    risk: 'HIGH',
    safeWord: '발생 가능한 부작용 안내 및 안전성 우선 시술',
    reason: '의료법 제56조 위반 (부작용 누락 및 무결성 허위 표방)'
  },
  {
    id: 11,
    word: '통증 없이',
    category: 'medical',
    type: '의료법 위반',
    risk: 'MEDIUM',
    safeWord: '통증 최소화를 위한 맞춤 마취 시스템',
    reason: '의료법 제56조 위반'
  },
  {
    id: 12,
    word: '국내 최고 / 지역 1위',
    category: 'all',
    type: '최상급 표현',
    risk: 'HIGH',
    safeWord: 'OO분야 실무 경력 O년 / 누적 자문 OOO건',
    reason: '표시광고법 제3조 및 각 협회 규정 (객관적 근거 없는 1위 표방 금지)'
  },
  {
    id: 13,
    word: '전국 1위',
    category: 'all',
    type: '최상급 표현',
    risk: 'HIGH',
    safeWord: '풍부한 성공 사례와 전담 대응 시스템 보유',
    reason: '공인된 정부·통계기관 객관적 입증 불가 시 허위광고 처분'
  },
  {
    id: 14,
    word: '업계 최저가 / 덤핑',
    category: 'all',
    type: '부당 유인',
    risk: 'HIGH',
    safeWord: '사건·진료 난이도별 세부 예상 비용 투명 공개',
    reason: '변호사법, 세무사법, 의료법 공통 환자/의뢰인 부당 유인행위'
  },
  {
    id: 15,
    word: '무료 법률상담 / 공익 무료',
    category: 'law',
    type: '부당 유인',
    risk: 'MEDIUM',
    safeWord: '초기 10분 사실관계 기본 확인 (수임 시 수수료 별도)',
    reason: '2025/2026 변협 광고규정 (미끼성 무료상담 수임매개 징계 사례 지정)'
  },
  {
    id: 16,
    word: '이혼 전문 법무법인',
    category: 'law',
    type: '전문 표방 위반',
    risk: 'HIGH',
    safeWord: '이혼 전문 변호사 OOO (대한변협 공식 등록 변호사)',
    reason: '변협 규정상 전문분야는 개인 변호사만 등록 가능 (법인 단위 표방 금지)'
  },
  {
    id: 17,
    word: 'OO 전문 병원 (미지정)',
    category: 'medical',
    type: '명칭 오인',
    risk: 'HIGH',
    safeWord: 'OO과 전문의 OOO 원장 직접 진료',
    reason: '보건복지부 지정 전문병원이 아님에도 전문병원 명칭 사용 시 영업정지'
  },
  {
    id: 18,
    word: '1:1 책임진료제',
    category: 'medical',
    type: '소비자 현혹',
    risk: 'MEDIUM',
    safeWord: '담당 주치의가 전담하여 상담 및 진료 지원',
    reason: '의료법 제56조 위반'
  },
  {
    id: 19,
    word: '무조건 / 단언컨대',
    category: 'all',
    type: '단정적 판단',
    risk: 'LOW',
    safeWord: '실무 판례 및 법적 요건 충족 시 검토 가능',
    reason: '소비자 오인 유발 및 과장 광고 소지'
  },
  {
    id: 20,
    word: '환자/고객 치료후기 체험단',
    category: 'medical',
    type: '원천 금지',
    risk: 'HIGH',
    safeWord: '비식별화된 객관적 진료 경과 및 사실 위주 설명',
    reason: '의료법 제56조 제2항 제2호 (치료경험담 광고 전면 금지, 형사고발 대상)'
  }
]

// 실제 SaaS와 100% 동일한 인터랙티브 데모 프리셋 데이터
const SAAS_DEMO_PRESETS = {
  tax: {
    id: 'tax',
    label: '세무사 · 회계사',
    icon: Calculator,
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    keyword: '송파 아파트 상속세 감정평가 세금 절감',
    tone: '신뢰형 전문가 칼럼 (세법·예규 중심의 차분하고 명쾌한 분석)',
    experience: '다주택자 양도세 및 상속세 상담 중 공인 감정평가 사업 활용으로 1.2억 절세 성공 사례',
    title: '송파 아파트 상속세, 감정평가로 1.2억 절세한 실무 비결 및 주의사항',
    chars: '2,480자',
    readTime: '약 4분',
    infoboxTitle: '2026 개정 세법 & 국세청 감정평가 사업 핵심 포인트',
    infoboxDesc: '최근 국세청의 비주거용 부동산 및 고가 아파트 감정평가 사업이 확대되고 있습니다. 사전 감정평가를 전략적으로 활용하면 양도세 이월과세 및 상속세 과세표준을 합법적으로 대폭 낮출 수 있습니다.',
    introText: '안녕하십니까. 15년 차 상속·증여 전문 세무사입니다. 최근 송파구 소재 아파트를 상속받으신 의뢰인께서 세금 고민으로 찾아오셨습니다. 기준시가와 시가 인정액의 차이로 인해 자칫 2억 원이 넘는 상속세를 납부할 뻔했던 사례였는데요...',
    cardTitle: '📊 [PostSync 벤토 카드] 감정평가 vs 기준시가 절세 시뮬레이션',
    tableRows: [
      { col1: '구분', col2: '일반 기준시가 일방 적용', col3: '전략적 사전 감정평가 적용' },
      { col1: '과세표준 산정', col2: '국세청 일방 추계 시가', col3: '공인 감정평가 2개 기관 평균' },
      { col1: '절세 효과', col2: '상속세 폭탄 위험 (2.4억)', col3: '최대 1.2억 절세 및 양도세 방어' }
    ]
  },
  law: {
    id: 'law',
    label: '변호사 (형사/민사)',
    icon: Scale,
    badgeColor: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
    keyword: '음주운전 2회 적발 집행유예 구제 방안',
    tone: '신뢰형 전문가 칼럼 (법리·판례 중심의 차분하고 명쾌한 분석)',
    experience: '혈중알코올농도 0.12% 재범 사건에서 긴급 피난 정황 및 부양가족 양형자료 제출로 실형 면제',
    title: '음주운전 2회 적발, 실형 위기에서 집행유예로 방어한 실전 판례 분석',
    chars: '2,620자',
    readTime: '약 4분 30초',
    infoboxTitle: '대법원 양형기준 & 도로교통법 제148조의2 적용 법리',
    infoboxDesc: '음주운전 재범은 징역 1년 이상 5년 이하 또는 벌금형에 처해집니다. 초기 경찰 조사 단계부터 일관된 진술과 객관적 양형 자료(차량 처분, 치료 의지, 생계형 가장)의 신속한 입증이 핵심입니다.',
    introText: '안녕하십니까. 형사 전문 대표 변호사입니다. 최근 음주운전 처벌 수위가 대폭 강화되면서 단순 2회 적발이라 하더라도 정식 재판에 회부되어 실형(구속)이 선고되는 비율이 급증하고 있습니다...',
    cardTitle: '🚨 [PostSync 벤토 카드] 절대 혼자 진행하면 안 되는 3대 레드플래그',
    tableRows: [
      { col1: '수사 단계', col2: '일반적 대응 (기각/실형 위험)', col3: '변호인 동행 전문 조력' },
      { col1: '경찰 조사', col2: '감정적 호소 및 진술 번복', col3: '피의자신문 동행 및 양형 서류 1차 제출' },
      { col1: '검찰 송치', col2: '인터넷 반성문 양식 복사', col3: '구속영장 기각 유도 및 불구속 재판' }
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
    cardTitle: '📊 [PostSync 벤토 카드] 척추 통증 단계별 자가진단 체크리스트',
    tableRows: [
      { col1: '통증 단계', col2: '초기 팽윤 / 디스크 돌출', col3: '섬유륜 파열 및 신경 압박' },
      { col1: '권장 치료', col2: '물리치료 & 체형 교정', col3: '신경차단술 & 정밀 도수치료' },
      { col1: '기대 효과', col2: '염증 완화 및 통증 경감', col3: '신경 부종 제거 및 근력 회복' }
    ]
  }
}

export default function AdLaw2026Page() {
  const [copied, setCopied] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'law' | 'medical' | 'tax'>('all')

  // 실제 SaaS 데모 프리셋 상태
  const [selectedDemoPreset, setSelectedDemoPreset] = useState<'tax' | 'law' | 'medical'>('tax')
  const [viewMode, setViewMode] = useState<'pc' | 'mobile'>('pc')

  // 실시간 1초 진단기 상태
  const [diagInput, setDiagInput] = useState('')
  const [diagResults, setDiagResults] = useState<{
    foundWords: ForbiddenWord[]
    analyzed: boolean
  }>({ foundWords: [], analyzed: false })

  const currentPreset = SAAS_DEMO_PRESETS[selectedDemoPreset]

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const filteredWords = useMemo(() => {
    if (selectedCategory === 'all') return FORBIDDEN_WORDS
    return FORBIDDEN_WORDS.filter((item) => item.category === selectedCategory || item.category === 'all')
  }, [selectedCategory])

  const runDiagnosis = (textToTest?: string) => {
    const text = (textToTest !== undefined ? textToTest : diagInput).trim()
    if (!text) {
      setDiagResults({ foundWords: [], analyzed: false })
      return
    }

    const matches: ForbiddenWord[] = []
    FORBIDDEN_WORDS.forEach((item) => {
      const baseWord = item.word.replace(/\s+/g, '')
      const cleanInput = text.replace(/\s+/g, '')
      if (cleanInput.includes(baseWord)) {
        matches.push(item)
      } else {
        const rawWords = item.word.split(' ')
        if (rawWords.length > 1 && rawWords.every((rw) => text.includes(rw))) {
          matches.push(item)
        }
      }
    })

    setDiagResults({
      foundWords: matches,
      analyzed: true
    })
  }

  const loadExample = (type: 'law' | 'medical' | 'tax') => {
    let exampleText = ''
    if (type === 'law') {
      exampleText = '저희는 100% 승소를 보장하는 압도적 전국 1위 이혼 전문 법무법인입니다. 기각 시 100% 환불해 드립니다.'
    } else if (type === 'medical') {
      exampleText = '부작용 없는 완벽한 치료! 국내 최고 통증 없이 완치 보장하는 1:1 책임진료제 병원입니다.'
    } else {
      exampleText = '업계 최저가 보장! 최대 절세와 완벽한 절세로 평균 환급액 350만원을 돌려드립니다.'
    }
    setDiagInput(exampleText)
    runDiagnosis(exampleText)
  }

  return (
    <div
      style={{ backgroundColor: '#f8fafc', color: '#0f172a' }}
      className="min-h-screen font-sans antialiased selection:bg-indigo-600 selection:text-white print:bg-white print:text-black"
    >
      {/* 1. 상단 플로팅 컨트롤 바 (인쇄 시 숨김) */}
      <nav
        style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', borderColor: '#e2e8f0' }}
        className="sticky top-0 z-50 backdrop-blur-md border-b shadow-sm px-4 py-3 print:hidden"
      >
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#2563eb' }}
              className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold shadow-sm"
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', borderColor: '#bfdbfe' }}
                  className="text-[10px] uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded border"
                >
                  2026 OFFICIAL GUIDE
                </span>
                <span style={{ color: '#64748b' }} className="text-[11px] hidden sm:inline font-medium">
                  문서번호: PSK-2026-LAW-01
                </span>
              </div>
              <p style={{ color: '#0f172a' }} className="text-xs sm:text-sm font-extrabold tracking-tight line-clamp-1">
                2026 전문직 블로그 마케팅 &amp; 광고법 과태료 제로(Zero) 공식 지침서
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              style={{ backgroundColor: '#ffffff', color: '#334155', borderColor: '#cbd5e1' }}
              className="px-3 py-1.5 rounded-lg border text-xs font-bold shadow-sm flex items-center gap-1.5 transition hover:bg-slate-50 cursor-pointer"
              title="가이드북 링크 복사"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              <span>{copied ? '복사 완료!' : '공유 링크'}</span>
            </button>

            <button
              onClick={handlePrint}
              style={{ backgroundColor: '#0f172a', color: '#ffffff' }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition hover:bg-slate-800 cursor-pointer"
              title="A4 규격 전자책 인쇄 또는 PDF 저장"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>📄 소장용 PDF / 인쇄</span>
            </button>

            <Link
              href="/login?ref=ad-law-guide"
              style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-extrabold shadow-md flex items-center gap-1 transition hover:bg-indigo-600 cursor-pointer"
            >
              <span>3회 무료 시작하기</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* 목차 퀵점프 탭 (인쇄 시 숨김) */}
      <div
        style={{ backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' }}
        className="border-b py-2 px-4 sticky top-[57px] z-40 overflow-x-auto scrollbar-none print:hidden"
      >
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs font-bold whitespace-nowrap" style={{ color: '#475569' }}>
          <span style={{ color: '#64748b' }} className="text-[11px] mr-1">목차:</span>
          <a href="#ch1" className="px-2.5 py-1 rounded hover:bg-white hover:text-indigo-600 transition">
            1. 2026 AI검색 혁명
          </a>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <a href="#ch2" className="px-2.5 py-1 rounded hover:bg-white hover:text-indigo-600 transition">
            2. 직역별 법적 규제
          </a>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <a href="#ch3" className="px-2.5 py-1 rounded hover:bg-white hover:text-indigo-600 transition">
            3. 20대 핵심 금지어 사전
          </a>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <a
            href="#ch4"
            style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' }}
            className="px-2.5 py-1 rounded border hover:bg-amber-200 transition flex items-center gap-1 font-extrabold"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>4. 1초 위반 진단기</span>
          </a>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <a href="#ch5" className="px-2.5 py-1 rounded hover:bg-white hover:text-indigo-600 transition">
            5. CVR 5단계 칼럼 공식
          </a>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <a href="#ch5-demo" className="px-2.5 py-1 rounded hover:bg-white hover:text-indigo-600 transition text-indigo-600 font-extrabold">
            ★ 스마트에디터 실시간 프리뷰
          </a>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <a href="#ch6" className="px-2.5 py-1 rounded hover:bg-white hover:text-indigo-600 transition">
            6. 위기관리 매뉴얼
          </a>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <a href="#ch7" className="px-2.5 py-1 rounded hover:bg-white hover:text-indigo-600 transition text-emerald-700 font-extrabold">
            7. 자가진단 체크리스트
          </a>
        </div>
      </div>

      {/* 2. 본문 백서 컨테이너 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-12 print:max-w-none print:p-0 print:space-y-6">
        
        {/* 표지 및 메타데이터 헤더 */}
        <section
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          className="border rounded-2xl p-6 sm:p-10 shadow-lg space-y-6 print:border-b-2 print:border-black print:rounded-none print:p-4 print:shadow-none"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs" style={{ color: '#64748b' }}>
            <span
              style={{ backgroundColor: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
              className="px-3 py-1 rounded-full font-extrabold border"
            >
              2026 OFFICIAL LEGAL &amp; SEO GUIDELINE
            </span>
            <div className="flex items-center gap-3 font-medium">
              <span>발행처: PostSync 리걸·메디컬 AI 컴플라이언스 랩</span>
              <span>•</span>
              <span>문서번호: PSK-2026-LAW-01</span>
            </div>
          </div>

          <div className="space-y-3">
            <h1 style={{ color: '#0f172a' }} className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              2026 전문직 블로그 마케팅 &amp; 광고법 과태료 제로(Zero) 공식 지침서
            </h1>
            <p style={{ color: '#4f46e5' }} className="text-base sm:text-lg font-extrabold">
              변호사·의사·세무사·노무사 20대 불법 금지어 사전 &amp; 네이버 AI 검색(AI 브리핑) 상위 노출 바이블
            </p>
            <p style={{ color: '#334155' }} className="text-sm sm:text-base leading-relaxed max-w-3xl font-medium">
              대행사에 맡겼다가 과태료와 자격정지 위기에 직면한 전문직 대표님들을 위한 필독서입니다.
              2026년 대폭 개정된 변호사법·의료법·세무사법 규제와 네이버 생성형 AI 검색(AI 브리핑·AuthGR) 알고리즘을 심층 분석하여,
              과태료 처분 0건과 실제 수임 전환율(CVR) 4배를 동시에 달성하는 실무 표준 가이드를 제공합니다.
            </p>
          </div>

          <div style={{ borderColor: '#e2e8f0' }} className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t text-xs">
            <div style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} className="p-3.5 rounded-xl border">
              <span style={{ color: '#64748b' }} className="block text-[11px] font-bold">대상 전문직</span>
              <strong style={{ color: '#0f172a' }} className="font-extrabold text-sm block mt-0.5">
                변호사·의사·세무사·노무사
              </strong>
            </div>
            <div style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} className="p-3.5 rounded-xl border">
              <span style={{ color: '#64748b' }} className="block text-[11px] font-bold">검색 평가 기준</span>
              <strong style={{ color: '#0f172a' }} className="font-extrabold text-sm block mt-0.5">
                C-Rank + DIA+ &amp; AI 브리핑
              </strong>
            </div>
            <div style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} className="p-3.5 rounded-xl border">
              <span style={{ color: '#64748b' }} className="block text-[11px] font-bold">핵심 규제 준수</span>
              <strong style={{ color: '#0f172a' }} className="font-extrabold text-sm block mt-0.5">
                2026 개정 변협·세무사·의료법
              </strong>
            </div>
            <div style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} className="p-3.5 rounded-xl border">
              <span style={{ color: '#64748b' }} className="block text-[11px] font-bold">소장 규격</span>
              <strong style={{ color: '#0f172a' }} className="font-extrabold text-sm block mt-0.5">
                A4 전자책 인쇄 최적화 (12P)
              </strong>
            </div>
          </div>
        </section>

        {/* 챕터 1. 2026년 네이버 검색 알고리즘의 다층적 구조와 AI SEO 대응 */}
        <section
          id="ch1"
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          className="border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div style={{ borderColor: '#e2e8f0' }} className="border-b pb-3 flex items-center justify-between">
            <h2 style={{ color: '#0f172a' }} className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5">
              <span
                style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
              >
                1
              </span>
              2026년 네이버 검색 알고리즘의 다층적 구조와 AI SEO 대응 전략
            </h2>
            <span style={{ color: '#4f46e5' }} className="text-xs font-mono font-bold">Chapter 01</span>
          </div>

          <div style={{ color: '#334155' }} className="text-sm leading-relaxed space-y-4">
            <p>
              &ldquo;대행사에 월 200~300만 원씩 꼬박꼬박 줬는데, 왜 블로그 방문자가 갑자기 반토막 났을까요?&rdquo;
              2026년 현재 네이버 검색 생태계는 생성형 AI의 검색 엔진 내재화와 함께 극적인 질적 패러다임 전환을 맞이했습니다. 
              과거 대행사들이 쓰던 키워드 단순 반복이나 복사 글은 알고리즘에 의해 즉시 저품질 처리되고 있으며,
              <strong style={{ color: '#0f172a' }} className="font-extrabold"> 네이버의 AI 검색 요약 서비스인 &lsquo;AI 브리핑&rsquo;과 출처 신뢰도 평가 알고리즘(AuthGR)</strong>이 전면에 등장했습니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} className="p-4 rounded-xl border space-y-2">
                <h3 style={{ color: '#0f172a' }} className="text-sm font-extrabold flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  C-Rank &amp; D.I.A.+의 결합적 평가
                </h3>
                <p style={{ color: '#475569' }} className="text-xs leading-relaxed">
                  <strong style={{ color: '#0f172a' }}>C-Rank</strong>는 블로그 전체의 활동 기간과 단일 카테고리(&lsquo;전문직 법률/의료&rsquo;) 집중도를 계산합니다. 
                  반면 <strong style={{ color: '#0f172a' }}>D.I.A.+</strong>는 독자의 검색 의도 해결 여부, 직접적인 실무 경험, 체류 시간을 측정합니다. 
                  단순 짜깁기나 복사글은 즉시 유사문서 패널티를 받아 영구 누락됩니다.
                </p>
              </div>

              <div style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} className="p-4 rounded-xl border space-y-2">
                <h3 style={{ color: '#0f172a' }} className="text-sm font-extrabold flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-cyan-600" />
                  스마트블록(Smart Block) 구조화 요건
                </h3>
                <p style={{ color: '#475569' }} className="text-xs leading-relaxed">
                  사용자의 세부 의도별로 모듈화된 스마트블록에 채택되려면 제목, 본문, 이미지, 태그가 완벽히 구조화되어야 합니다.
                  <strong style={{ color: '#0f172a' }}> 포스팅당 고품질 인포그래픽 이미지를 최소 3장 이상 포함</strong>하고, 모든 이미지에 <strong style={{ color: '#0f172a' }}>대체 텍스트(alt)</strong>를 작성해야 카드 블록에 선정됩니다.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe' }} className="p-5 rounded-xl border space-y-2.5">
              <div className="flex items-center gap-2">
                <span style={{ backgroundColor: '#2563eb', color: '#ffffff' }} className="px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                  2026 핵심 변화
                </span>
                <h4 style={{ color: '#0f172a' }} className="text-sm font-extrabold">AI 브리핑(AI Briefing)과 UGC 인용 생태계</h4>
              </div>
              <p style={{ color: '#1e3a8a' }} className="text-xs leading-relaxed font-medium">
                2026년 기준 네이버 전체 검색 쿼리의 20% 이상을 AI 브리핑이 소화하고 있으며, 
                <strong style={{ color: '#0f172a' }} className="font-extrabold"> AI 브리핑이 인용하는 데이터의 70%는 블로그·카페 등 사용자 제작 콘텐츠(UGC)에서 추출</strong>됩니다. 
                네이버는 매달 3,000명의 우수 창작자를 선정하여 월 최대 1,000만 원을 지원하는 &lsquo;네이버 메이트&rsquo; 펠로우십을 운영하고 있습니다.
                단순 1등 노출보다 <strong style={{ color: '#1d4ed8' }} className="font-extrabold">&lsquo;AI가 내 글을 논리적 근거로 인용하는가&rsquo;</strong>가 진정한 경쟁력입니다.
              </p>
            </div>

            {/* AI 친화 콘텐츠 5대 원칙 표 */}
            <div className="mt-4 space-y-2">
              <h4 style={{ color: '#0f172a' }} className="text-xs font-extrabold uppercase tracking-wider">
                [표 1-1] 2026 네이버 AI 브리핑 우선 인용을 위한 5대 콘텐츠 원칙
              </h4>
              <div style={{ borderColor: '#cbd5e1' }} className="overflow-x-auto border rounded-xl shadow-sm">
                <table className="w-full text-left text-xs border-collapse">
                  <thead style={{ backgroundColor: '#f1f5f9', color: '#0f172a', borderColor: '#cbd5e1' }} className="border-b">
                    <tr>
                      <th className="py-2.5 px-3.5 font-extrabold">원칙</th>
                      <th className="py-2.5 px-3.5 font-extrabold">전략적 적용 방안</th>
                      <th style={{ color: '#1d4ed8' }} className="py-2.5 px-3.5 font-extrabold">알고리즘 우선순위 및 인용 확률</th>
                    </tr>
                  </thead>
                  <tbody style={{ borderColor: '#e2e8f0' }} className="divide-y bg-white">
                    <tr className="hover:bg-slate-50">
                      <td style={{ color: '#0f172a' }} className="py-2.5 px-3.5 font-bold">답변 우선 구조 (Answer-First)</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5">문단 서두 2~3줄 내에 독자 검색 의도에 대한 직접적 결론/해법 선제 배치</td>
                      <td style={{ color: '#047857' }} className="py-2.5 px-3.5 font-bold">인용 확률 약 40% 향상 (AI 논리 추출 최적화)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td style={{ color: '#0f172a' }} className="py-2.5 px-3.5 font-bold">정보 밀도 극대화</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5">모호한 형용사 배제, 법령 조항·정의·수치·구체적 데이터를 한 문단에 2~3개 이상 촘촘히 배치</td>
                      <td style={{ color: '#047857' }} className="py-2.5 px-3.5 font-bold">인용 확률 약 4배 향상 (모호한 문장은 탈락)</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td style={{ color: '#0f172a' }} className="py-2.5 px-3.5 font-bold">구조화 마크업 (Schema)</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5">FAQ, 해결 절차(HowTo), 핵심 정의(DefinedTerm) 포맷을 적용하여 기계 판독성 지원</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5 font-medium">AI가 논리 구조를 완벽히 이해하고 신뢰 출처로 채택</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td style={{ color: '#0f172a' }} className="py-2.5 px-3.5 font-bold">E-E-A-T 신뢰 신호 입증</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5">실제 소송 판례, 국세청 예규, 의학적 소견을 융합하여 전문성 입증</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5 font-medium">오랜 전문성이 담긴 공인 출처 가산점 획득</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td style={{ color: '#0f172a' }} className="py-2.5 px-3.5 font-bold">최신성 및 의미적 완결성</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5">최신 법령 개정 날짜 명시, 판결문 번호 기재, 예상 꼬리 질문까지 하나의 포스팅에서 완결</td>
                      <td style={{ color: '#334155' }} className="py-2.5 px-3.5 font-medium">출처가 누락된 주장은 AI 인용 대상에서 자동 배제</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 챕터 2. 전문직 직역별 광고 규제 개정과 형사처벌·자격정지 리스크 */}
        <section
          id="ch2"
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          className="border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div style={{ borderColor: '#e2e8f0' }} className="border-b pb-3 flex items-center justify-between">
            <h2 style={{ color: '#0f172a' }} className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5">
              <span
                style={{ backgroundColor: '#dc2626', color: '#ffffff' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
              >
                2
              </span>
              전문직 직역별 광고 규제 개정과 형사처벌·자격정지 리스크
            </h2>
            <span style={{ color: '#dc2626' }} className="text-xs font-mono font-bold">Chapter 02</span>
          </div>

          <p style={{ color: '#334155' }} className="text-sm leading-relaxed">
            마케팅 대행사는 의사나 변호사가 아닙니다. 그들은 수임과 노출에만 눈이 멀어 법률상 금지된 문구를 마구잡이로 작성합니다. 
            하지만 <strong style={{ color: '#dc2626' }}>법적 책임과 형사처벌은 대행사가 아닌 대표님 본인</strong>에게 고스란히 돌아옵니다.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 의료법 카드 */}
            <div
              style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}
              className="p-5 rounded-xl border space-y-3 shadow-sm"
            >
              <div style={{ color: '#b91c1c' }} className="flex items-center gap-2 font-extrabold text-sm">
                <Stethoscope className="w-4 h-4" />
                <span>의료법 제56조 &amp; 제27조</span>
              </div>
              <p style={{ color: '#7f1d1d' }} className="text-xs font-extrabold">
                치료경험담(후기)·체험단 광고 원천 금지
              </p>
              <ul style={{ color: '#1e293b' }} className="text-xs space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
                <li>비로그인 개방 공간에 치료 후기 게시 시 <strong style={{ color: '#991b1b', fontWeight: 800 }}>1년 이하 징역 또는 1천만 원 벌금</strong></li>
                <li>무료 시술/할인 대가 후기 작성 유도는 <strong style={{ color: '#991b1b', fontWeight: 800 }}>&lsquo;환자 유인·알선&rsquo;</strong>으로 자격정지 2개월</li>
                <li>전후 사진: 동일 환자, 동일 조건 촬영, 촬영 일자 및 <strong style={{ color: '#991b1b', fontWeight: 800 }}>부작용 명시</strong> 필수</li>
                <li>&lsquo;완치&rsquo;, &lsquo;부작용 없는&rsquo;, &lsquo;1:1 책임진료&rsquo;, &lsquo;무사고&rsquo; 등 단정적 문구 형사처벌</li>
              </ul>
            </div>

            {/* 변호사법 카드 */}
            <div
              style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}
              className="p-5 rounded-xl border space-y-3 shadow-sm"
            >
              <div style={{ color: '#b45309' }} className="flex items-center gap-2 font-extrabold text-sm">
                <Scale className="w-4 h-4" />
                <span>변호사법 제23조 (2025/2026 개정)</span>
              </div>
              <p style={{ color: '#78350f' }} className="text-xs font-extrabold">
                광고책임변호사 표기 &amp; 건바이건 배포 금지
              </p>
              <ul style={{ color: '#1e293b' }} className="text-xs space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
                <li>블로그 모든 글에 <strong style={{ color: '#92400e', fontWeight: 800 }}>&lsquo;광고책임변호사 성명&rsquo;</strong> 표기 법적 의무화</li>
                <li>대행사 소유 최적화 블로그를 통한 <strong style={{ color: '#92400e', fontWeight: 800 }}>&lsquo;건바이건 배포&rsquo; 전면 불법화</strong></li>
                <li>&lsquo;승소율 99%&rsquo;, &lsquo;기각 시 전액 환불&rsquo;, &lsquo;석방 보장&rsquo; 강력 징계</li>
                <li>법인 단위 &lsquo;이혼 전문 법무법인&rsquo; 표기 금지 (변호사 개인만 등록 가능)</li>
                <li>특정 키워드 CPC 입찰 및 &lsquo;무료 법률상담&rsquo; 표방 징계 사례 지정</li>
              </ul>
            </div>

            {/* 세무사법 & 표시광고법 */}
            <div
              style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
              className="p-5 rounded-xl border space-y-3 shadow-sm"
            >
              <div style={{ color: '#15803d' }} className="flex items-center gap-2 font-extrabold text-sm">
                <Calculator className="w-4 h-4" />
                <span>세무사법 &amp; 공정위 표시광고법</span>
              </div>
              <p style={{ color: '#14532d' }} className="text-xs font-extrabold">
                2026년 덤핑 방지 규제 &amp; 실증 의무
              </p>
              <ul style={{ color: '#1e293b' }} className="text-xs space-y-1.5 list-disc pl-4 leading-relaxed font-medium">
                <li>2026.6.24 시행: 객관적 근거 없는 <strong style={{ color: '#166534', fontWeight: 800 }}>&lsquo;무료&rsquo;, &lsquo;최저가&rsquo;</strong> 광고 원천 금지</li>
                <li>조건 명시 없는 &lsquo;평균 환급액 OOO만 원&rsquo; 과장 유도 처벌</li>
                <li><strong style={{ color: '#166534', fontWeight: 800 }}>표시광고법 실증 의무:</strong> 특정한 효능/승소율 주장 시 15일 이내 객관적 실증 자료 제출 필수</li>
                <li>위반 시 <strong style={{ color: '#166534', fontWeight: 800 }}>관련 매출액의 최대 2% 과징금</strong> 또는 2년 이하 징역</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 챕터 3. 2026 핵심 금지어 20선 및 100% 합법 추천 대체어 매트릭스 */}
        <section
          id="ch3"
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          className="border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div style={{ borderColor: '#e2e8f0' }} className="border-b pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 style={{ color: '#0f172a' }} className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5">
                <span
                  style={{ backgroundColor: '#f59e0b', color: '#0f172a' }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
                >
                  3
                </span>
                2026 핵심 금지어 20선 &amp; 100% 합법 추천 대체어 매트릭스
              </h2>
              <p style={{ color: '#64748b' }} className="text-xs mt-1">
                아래 20가지 표현만 정확히 피해도 보건소·변협·세무사회의 불시 모니터링 고발을 99% 사전 차단할 수 있습니다.
              </p>
            </div>
            <div style={{ backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }} className="flex items-center gap-1.5 p-1 rounded-lg border text-xs print:hidden">
              <button
                onClick={() => setSelectedCategory('all')}
                style={selectedCategory === 'all' ? { backgroundColor: '#4f46e5', color: '#ffffff' } : { color: '#475569' }}
                className="px-3 py-1 rounded-md font-bold transition cursor-pointer"
              >
                전체 (20)
              </button>
              <button
                onClick={() => setSelectedCategory('law')}
                style={selectedCategory === 'law' ? { backgroundColor: '#4f46e5', color: '#ffffff' } : { color: '#475569' }}
                className="px-3 py-1 rounded-md font-bold transition cursor-pointer"
              >
                변호사
              </button>
              <button
                onClick={() => setSelectedCategory('medical')}
                style={selectedCategory === 'medical' ? { backgroundColor: '#4f46e5', color: '#ffffff' } : { color: '#475569' }}
                className="px-3 py-1 rounded-md font-bold transition cursor-pointer"
              >
                병의원
              </button>
              <button
                onClick={() => setSelectedCategory('tax')}
                style={selectedCategory === 'tax' ? { backgroundColor: '#4f46e5', color: '#ffffff' } : { color: '#475569' }}
                className="px-3 py-1 rounded-md font-bold transition cursor-pointer"
              >
                세무사
              </button>
            </div>
          </div>

          <div style={{ borderColor: '#cbd5e1' }} className="overflow-x-auto border rounded-xl shadow-sm">
            <table className="w-full text-left text-xs border-collapse">
              <thead style={{ backgroundColor: '#f1f5f9', color: '#0f172a', borderColor: '#cbd5e1' }} className="border-b">
                <tr>
                  <th className="py-3 px-3 text-center w-12 font-extrabold">No</th>
                  <th style={{ color: '#dc2626' }} className="py-3 px-3 font-extrabold w-36">위반 금지어</th>
                  <th style={{ color: '#334155' }} className="py-3 px-3 font-extrabold w-28">유형 / 위험도</th>
                  <th style={{ color: '#059669' }} className="py-3 px-3 font-extrabold">100% 합법 추천 대체어</th>
                  <th style={{ color: '#475569' }} className="py-3 px-3 font-extrabold">법적 위반 사유</th>
                </tr>
              </thead>
              <tbody style={{ borderColor: '#e2e8f0' }} className="divide-y bg-white">
                {filteredWords.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td style={{ color: '#64748b' }} className="py-2.5 px-3 text-center font-mono font-bold">{item.id}</td>
                    <td style={{ color: '#dc2626', backgroundColor: '#fef2f2' }} className="py-2.5 px-3 font-extrabold">
                      &ldquo;{item.word}&rdquo;
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        style={{ backgroundColor: '#f1f5f9', color: '#334155', borderColor: '#cbd5e1' }}
                        className="px-1.5 py-0.5 rounded text-[10px] mr-1 font-bold border"
                      >
                        {item.type}
                      </span>
                      <span
                        style={
                          item.risk === 'HIGH'
                            ? { backgroundColor: '#fee2e2', color: '#b91c1c', borderColor: '#fca5a5' }
                            : item.risk === 'MEDIUM'
                            ? { backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fcd34d' }
                            : { backgroundColor: '#f1f5f9', color: '#475569', borderColor: '#cbd5e1' }
                        }
                        className="px-1.5 py-0.5 rounded text-[10px] font-extrabold border"
                      >
                        {item.risk}
                      </span>
                    </td>
                    <td style={{ color: '#047857', backgroundColor: '#f0fdf4' }} className="py-2.5 px-3 font-extrabold">
                      &ldquo;{item.safeWord}&rdquo;
                    </td>
                    <td style={{ color: '#475569' }} className="py-2.5 px-3 text-[11px] leading-relaxed font-medium">
                      {item.reason}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 바쁜 전문가의 현실적 딜레마 브릿지 (기승전결 메타 단어 제거) */}
        <section
          style={{ backgroundColor: '#fef2f2', borderColor: '#fca5a5' }}
          className="border-2 rounded-2xl p-6 sm:p-8 space-y-4 print:hidden shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div style={{ backgroundColor: '#ef4444', color: '#ffffff' }} className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 style={{ color: '#991b1b' }} className="text-base sm:text-lg font-black">
              바쁜 전문가의 현실적 딜레마: 직접 쓰기 vs 대행사 맡기기
            </h3>
          </div>

          <p style={{ color: '#7f1d1d' }} className="text-xs sm:text-sm leading-relaxed font-medium">
            이론은 완벽합니다. 금지어를 피하고, 판례와 예규를 찾아서, 5단계 구조로 정성스럽게 쓰면 됩니다.<br />
            <strong>하지만 대표님의 현실은 어떻습니까?</strong><br />
            매일 오전부터 쏟아지는 재판 출석, 환자 진료, 세무조사 입회, 의뢰인 대면 상담만으로도 하루가 모자랍니다.
            이 바쁜 일정 속에서 <span className="underline underline-offset-2 font-black">매일 판례를 검색하고, 20대 광고법을 일일이 대조하고, 포토샵으로 카드뉴스를 만들며 3시간씩 글을 직접 쓰실 수 있습니까?</span>
          </p>

          <div style={{ backgroundColor: '#ffffff', borderColor: '#fecaca' }} className="p-4 rounded-xl border text-xs text-slate-700 space-y-1.5">
            <p className="font-bold text-slate-900">🚨 대표님이 마주한 3가지 진퇴양난:</p>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
              <li><strong>직접 쓰자니:</strong> 진료/재판할 시간도 부족하고, 1편 쓰는데 3시간씩 걸려 본업 마비</li>
              <li><strong>대행사에 주자니:</strong> 월 200~300만 원 내고도 불법 금지어와 복사글로 과태료 폭탄 소명서 날아옴</li>
              <li><strong>일반 챗GPT를 쓰자니:</strong> 한국 법령/판례를 엉터리로 날조(환각)하고, 네이버 서식이 다 깨져서 노출 0건</li>
            </ul>
          </div>
          
          <p style={{ color: '#b91c1c' }} className="text-xs font-bold text-center pt-1">
            👇 먼저, 현재 대표님 사무실의 글이나 홍보 문구에 과태료 위험 단어가 있는지 1초 만에 검사해 보세요!
          </p>
        </section>

        {/* 챕터 4. [실시간 체험] 내 블로그 문장 1초 광고법 위반 진단기 */}
        <section id="ch4" className="space-y-6 print:hidden">
          <div
            style={{ backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#4f46e5' }}
            className="p-6 sm:p-8 rounded-2xl border-2 shadow-2xl space-y-5"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span
                  style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold shadow-lg"
                >
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 style={{ color: '#ffffff' }} className="text-lg sm:text-xl font-extrabold">
                    [실시간 체험] 내 블로그 문장 1초 광고법 위반 진단기
                  </h3>
                  <p style={{ color: '#94a3b8' }} className="text-xs">
                    현재 블로그 글 또는 홍보 문구를 입력해 보세요. 2026 최신 규제 위반 단어를 0.05초 만에 스캔합니다.
                  </p>
                </div>
              </div>
              <span
                style={{ backgroundColor: '#064e3b', color: '#6ee7b7', borderColor: '#059669' }}
                className="px-3 py-1 rounded-full text-xs font-extrabold border"
              >
                ⚡ 실시간 0.05초 정규식 스캐너 작동 중
              </span>
            </div>

            {/* 빠른 예시 버튼 */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span style={{ color: '#94a3b8' }} className="text-[11px] font-bold">빠른 테스트 예시:</span>
              <button
                onClick={() => loadExample('law')}
                style={{ backgroundColor: '#1e293b', color: '#e2e8f0', borderColor: '#334155' }}
                className="px-3 py-1.5 rounded-lg border font-bold transition hover:bg-slate-700 cursor-pointer"
              >
                ⚖️ 변호사 예시 (100% 승소, 기각시 환불)
              </button>
              <button
                onClick={() => loadExample('medical')}
                style={{ backgroundColor: '#1e293b', color: '#e2e8f0', borderColor: '#334155' }}
                className="px-3 py-1.5 rounded-lg border font-bold transition hover:bg-slate-700 cursor-pointer"
              >
                🏥 병의원 예시 (완치, 부작용 없는)
              </button>
              <button
                onClick={() => loadExample('tax')}
                style={{ backgroundColor: '#1e293b', color: '#e2e8f0', borderColor: '#334155' }}
                className="px-3 py-1.5 rounded-lg border font-bold transition hover:bg-slate-700 cursor-pointer"
              >
                📊 세무사 예시 (최저가, 평균 환급액)
              </button>
            </div>

            {/* 텍스트 입력창 */}
            <div className="space-y-2">
              <textarea
                value={diagInput}
                onChange={(e) => {
                  setDiagInput(e.target.value)
                  runDiagnosis(e.target.value)
                }}
                style={{ backgroundColor: '#020617', color: '#ffffff', borderColor: '#334155' }}
                placeholder="검사할 블로그 제목이나 본문 문장을 입력하세요. (예: 저희는 100% 승소를 보장하는 전국 1위 로펌입니다.)"
                className="w-full h-24 p-3.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
              />
              <div className="flex justify-between items-center text-xs" style={{ color: '#94a3b8' }}>
                <span className="font-medium">{diagInput.length}자 입력됨</span>
                <button
                  onClick={() => runDiagnosis()}
                  style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                  className="px-4 py-2 rounded-lg font-extrabold transition flex items-center gap-1.5 shadow-lg hover:bg-indigo-600 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>위반 여부 정밀 진단</span>
                </button>
              </div>
            </div>

            {/* 진단 결과 카드 */}
            {diagResults.analyzed && (
              <div style={{ borderColor: '#334155' }} className="pt-3 border-t space-y-3">
                {diagResults.foundWords.length > 0 ? (
                  <div
                    style={{ backgroundColor: 'rgba(127, 29, 29, 0.4)', borderColor: '#b91c1c' }}
                    className="p-4 rounded-xl border space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div style={{ color: '#f87171' }} className="flex items-center gap-2 font-extrabold text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>위반 위험 소지 표현 {diagResults.foundWords.length}건 발견!</span>
                      </div>
                      <span
                        style={{ backgroundColor: '#7f1d1d', color: '#fecaca' }}
                        className="text-xs font-bold px-2 py-0.5 rounded"
                      >
                        과태료 및 행정처분 위험
                      </span>
                    </div>

                    <div className="space-y-2">
                      {diagResults.foundWords.map((fw) => (
                        <div
                          key={fw.id}
                          style={{ backgroundColor: '#0f172a', borderColor: '#7f1d1d' }}
                          className="p-3.5 rounded-lg border text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span style={{ color: '#ef4444' }} className="font-extrabold text-sm">&ldquo;{fw.word}&rdquo;</span>
                            <span
                              style={{ backgroundColor: '#450a0a', color: '#fca5a5', borderColor: '#7f1d1d' }}
                              className="px-2 py-0.5 rounded text-[10px] font-bold border"
                            >
                              {fw.type} ({fw.risk})
                            </span>
                          </div>
                          <p style={{ color: '#cbd5e1' }} className="text-[11px] font-medium">• 사유: {fw.reason}</p>
                          <div style={{ color: '#34d399' }} className="pt-1 flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>추천 합법 대체 표현: &ldquo;{fw.safeWord}&rdquo;</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{ backgroundColor: 'rgba(6, 78, 59, 0.4)', borderColor: '#059669' }}
                    className="p-4 rounded-xl border text-center space-y-1"
                  >
                    <div style={{ color: '#34d399' }} className="flex items-center justify-center gap-2 font-extrabold text-sm">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>20대 핵심 금지어 위반 단어가 발견되지 않았습니다.</span>
                    </div>
                    <p style={{ color: '#cbd5e1' }} className="text-xs">
                      입력하신 문장은 기본 컴플라이언스 기준을 충족합니다.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* 챕터 5. 전환율(CVR) 극대화를 위한 5단계 칼럼 작성 공식 */}
        <section
          id="ch5"
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          className="border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div style={{ borderColor: '#e2e8f0' }} className="border-b pb-3 flex items-center justify-between">
            <h2 style={{ color: '#0f172a' }} className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5">
              <span
                style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
              >
                5
              </span>
              전환율(CVR) 400% 극대화를 위한 5단계 칼럼 작성 공식
            </h2>
            <span style={{ color: '#4f46e5' }} className="text-xs font-mono font-bold">Chapter 05</span>
          </div>

          <div style={{ color: '#334155' }} className="space-y-4 text-sm leading-relaxed">
            <p>
              전문직 블로그의 가장 흔한 실패 원인은 단순 승소 자랑이나 백과사전식 법률/의학 용어 나열입니다.
              규제 테두리 안에서 방문자를 실제 유료 의뢰인·환자로 전환시키는 <strong style={{ color: '#0f172a' }} className="font-extrabold">5단계 성공 칼럼 프레임워크</strong>를 적용해야 합니다.
            </p>

            <div className="space-y-3">
              <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border flex items-start gap-3.5 shadow-sm">
                <span style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  1
                </span>
                <div>
                  <strong style={{ color: '#0f172a' }} className="text-sm font-extrabold block">
                    페인 포인트(Pain Point)의 날카로운 자극과 공감
                  </strong>
                  <p style={{ color: '#475569' }} className="text-xs mt-1 leading-relaxed">
                    장황한 인사말 대신 독자가 처한 위기 상황의 본질을 정확히 짚습니다. 
                    (예: &ldquo;갑작스러운 세무조사 통보와 횡령·배임 혐의로 밤잠을 설치고 계실 법인 대표님들께&rdquo;)
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border flex items-start gap-3.5 shadow-sm">
                <span style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  2
                </span>
                <div>
                  <strong style={{ color: '#0f172a' }} className="text-sm font-extrabold block">
                    검색 의도에 대한 직접적 해답 (Answer-First 선제 배치)
                  </strong>
                  <p style={{ color: '#475569' }} className="text-xs mt-1 leading-relaxed">
                    서두 2~3줄 내에 대응 가이드라인 핵심 결론을 제시하여 체류 시간을 확보하고, 네이버 AI 브리핑 인용 확률을 극대화합니다.
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border flex items-start gap-3.5 shadow-sm">
                <span style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  3
                </span>
                <div>
                  <strong style={{ color: '#0f172a' }} className="text-sm font-extrabold block">
                    객관적 정보 흐름과 자가 진단 체크포인트 제공
                  </strong>
                  <p style={{ color: '#475569' }} className="text-xs mt-1 leading-relaxed">
                    &lsquo;증상 객관화 → 자가 진단 체크리스트 → 필요 서류 및 검사 항목 → 해결 기준&rsquo;으로 독자가 스스로 전문가 조력의 필요성을 느끼게 만듭니다.
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border flex items-start gap-3.5 shadow-sm">
                <span style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  4
                </span>
                <div>
                  <strong style={{ color: '#0f172a' }} className="text-sm font-extrabold block">
                    치열한 실무 뉘앙스와 돌발 변수 극복 과정 서술
                  </strong>
                  <p style={{ color: '#475569' }} className="text-xs mt-1 leading-relaxed">
                    뻔한 이론 대신 어떤 치밀한 전략으로 돌발 상황을 해결했는지 과정을 묘사합니다.
                    (예: &ldquo;상대방의 재산 은닉 징후를 포착하여 본안 소송 전 통장과 부동산 가압류를 선제 집행했습니다.&rdquo;)
                  </p>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border flex items-start gap-3.5 shadow-sm">
                <span style={{ backgroundColor: '#4f46e5', color: '#ffffff' }} className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm">
                  5
                </span>
                <div>
                  <strong style={{ color: '#0f172a' }} className="text-sm font-extrabold block">
                    법률·의학·세무 팩트 융합을 통한 대체 불가능한 E-E-A-T 확보
                  </strong>
                  <p style={{ color: '#475569' }} className="text-xs mt-1 leading-relaxed">
                    대법원 판례 번호, 국세청 예규 조항, 의학적 인과관계를 융합 주입하여 D.I.A.+ 최고 독창성 점수를 획득합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🌟 [실제 SaaS 화면 100% 동일] 스마트에디터 ONE 실시간 프리뷰 듀얼 뷰어 */}
        <section
          id="ch5-demo"
          style={{ backgroundColor: '#0A0D14', borderColor: '#4f46e5' }}
          className="border-2 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 text-white print:hidden"
        >
          {/* 상단 탭 및 타이틀 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
                <span className="text-xs font-bold text-slate-300">스마트에디터 ONE 실시간 프리뷰 뷰어</span>
                <span className="text-[10px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md font-semibold border border-indigo-400/30">
                  ● 스트리밍 10초 완성
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                실제 PostSync에 키워드를 넣었을 때 생성되는 화면
              </h3>
            </div>

            {/* 직종 프리셋 선택 탭 */}
            <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
              {(['tax', 'law', 'medical'] as const).map((key) => {
                const item = SAAS_DEMO_PRESETS[key]
                const isSel = selectedDemoPreset === key
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDemoPreset(key)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSel ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 좌우 2분할 뷰어 (실제 PostSync 랜딩페이지 데모와 100% 동일) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 rounded-2xl overflow-hidden border border-white/10 bg-[#0E121E]">
            
            {/* 좌측: AI 제어 패널 (4 cols) */}
            <div className="lg:col-span-4 p-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI 컨트롤 타워</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                    2026 로직 가동 중
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex justify-between">
                    <span>타겟 키워드</span>
                    <span className="text-[10px] text-indigo-400">C-Rank 매칭</span>
                  </label>
                  <div className="w-full bg-[#1A2035] border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white flex items-center justify-between">
                    <span className="truncate">{currentPreset.keyword}</span>
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 ml-1" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">톤앤매너</label>
                  <div className="w-full bg-[#1A2035] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 flex items-center justify-between">
                    <span className="truncate text-[11px]">{currentPreset.tone}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </div>
                </div>

                <div className="space-y-1.5 bg-indigo-950/40 p-3 rounded-xl border border-indigo-500/20">
                  <label className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    오늘의 핵심 판례 · 상담 포인트 (RAG)
                  </label>
                  <div className="w-full bg-[#101424] border border-indigo-500/30 rounded-lg p-2.5 text-[11px] text-slate-300 leading-relaxed">
                    {currentPreset.experience}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold h-10 text-xs shadow-lg rounded-xl flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI 생성 완료 (10초 소요)
                </div>
                <p className="text-[10px] text-slate-400 text-center">
                  • 10종 반응형 벤토 카드뉴스 3장 자동 삽입 완료<br />
                  • 스마트에디터 ONE 서식 100% 보존
                </p>
              </div>
            </div>

            {/* 우측: 네이버 스마트에디터 ONE 실시간 프리뷰 (8 cols) */}
            <div className="lg:col-span-8 flex flex-col bg-[#F8FAFC] text-slate-900">
              
              {/* 우측 서브 헤더 */}
              <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#03C75A]" />
                  <span className="text-xs font-bold text-slate-800">네이버 스마트에디터 ONE 뷰어</span>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {currentPreset.chars}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {currentPreset.readTime}
                  </span>

                  {/* PC / 모바일 스위처 */}
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] font-bold">
                    <button
                      onClick={() => setViewMode('pc')}
                      className={`px-2 py-0.5 rounded transition cursor-pointer ${
                        viewMode === 'pc' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      PC 뷰
                    </button>
                    <button
                      onClick={() => setViewMode('mobile')}
                      className={`px-2 py-0.5 rounded transition cursor-pointer ${
                        viewMode === 'mobile' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500'
                      }`}
                    >
                      모바일 뷰
                    </button>
                  </div>
                </div>
              </div>

              {/* 제목 바 */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded shrink-0">
                  SEO 제목
                </span>
                <div className="text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-md px-3 py-1 flex-1 truncate">
                  {currentPreset.title}
                </div>
              </div>

              {/* 본문 렌더링 컨테이너 */}
              <div className="p-5 sm:p-6 space-y-4 max-h-[420px] overflow-y-auto text-xs leading-relaxed">
                
                {/* 1. Answer-First 인포박스 */}
                <div style={{ backgroundColor: '#FEF9C3', borderColor: '#EAB308' }} className="border-l-4 p-3.5 rounded-r-lg text-slate-800 space-y-1">
                  <strong className="block font-bold text-amber-900">{currentPreset.infoboxTitle}</strong>
                  <p className="text-[11px] text-slate-700 leading-normal">{currentPreset.infoboxDesc}</p>
                </div>

                {/* 2. 서론 도입부 */}
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {currentPreset.introText}
                </p>

                {/* 3. 벤토 카드뉴스 타일 */}
                <div style={{ backgroundColor: '#0f172a', borderColor: '#334155' }} className="p-4 rounded-xl border text-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {currentPreset.cardTitle}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      스마트블록 DIA+ 체류시간 2배 견인
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] pt-1">
                    <div className="bg-slate-800/90 p-2 rounded border border-slate-700">
                      <span className="text-slate-400 block">단계 01</span>
                      <strong className="text-slate-200">초기 쟁점 정밀 진단</strong>
                    </div>
                    <div className="bg-slate-800/90 p-2 rounded border border-slate-700">
                      <span className="text-slate-400 block">단계 02</span>
                      <strong className="text-emerald-400">맞춤 전략 법리 수립</strong>
                    </div>
                    <div className="bg-slate-800/90 p-2 rounded border border-slate-700">
                      <span className="text-slate-400 block">단계 03</span>
                      <strong className="text-indigo-400">최종 권리 구제 완성</strong>
                    </div>
                  </div>
                </div>

                {/* 4. 비교표 */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                  <table className="w-full text-left text-[11px] border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-2">{currentPreset.tableRows[0].col1}</th>
                        <th className="p-2 text-rose-600">{currentPreset.tableRows[0].col2}</th>
                        <th className="p-2 text-indigo-700">{currentPreset.tableRows[0].col3}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {currentPreset.tableRows.slice(1).map((row, rIdx) => (
                        <tr key={rIdx}>
                          <td className="p-2 font-medium text-slate-900">{row.col1}</td>
                          <td className="p-2">{row.col2}</td>
                          <td className="p-2 font-bold text-indigo-900 bg-indigo-50/50">{row.col3}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 5. 하단 네이버 지도 배너 */}
                <div style={{ backgroundColor: '#F0FDF4', borderColor: '#86efac' }} className="p-3 rounded-xl border text-center text-xs">
                  <p className="font-bold text-emerald-800">📍 [오시는 길] 사무소 네이버 지도 / 길찾기 바로가기 (온라인 실시간 예약)</p>
                </div>
              </div>
            </div>

          </div>

          {/* 하단 안내 및 소프트 CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <p className="text-xs text-slate-300">
              💡 <strong>스마트에디터 원클릭 복사</strong> 버튼을 누르면 인포박스, 표, 벤토 카드까지 서식 깨짐 없이 100% 복사됩니다.
            </p>
            <Link
              href="/login?ref=saas-demo"
              style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
              className="px-5 py-2.5 rounded-xl font-black text-xs shadow-lg transition flex items-center gap-1.5 hover:bg-indigo-600 cursor-pointer whitespace-nowrap"
            >
              <span>내 사무소 키워드로 3회 무료 생성해보기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* 챕터 6. 행정처분 및 시정명령 통보 시 4단계 긴급 법적 대응 매뉴얼 */}
        <section
          id="ch6"
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          className="border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div style={{ borderColor: '#e2e8f0' }} className="border-b pb-3 flex items-center justify-between">
            <h2 style={{ color: '#0f172a' }} className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5">
              <span
                style={{ backgroundColor: '#475569', color: '#ffffff' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
              >
                6
              </span>
              행정처분 및 시정명령 통보 시 4단계 긴급 법적 대응 매뉴얼
            </h2>
            <span style={{ color: '#64748b' }} className="text-xs font-mono font-bold">Chapter 06</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border space-y-2 shadow-sm">
              <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }} className="px-2 py-0.5 rounded font-extrabold">
                STEP 1
              </span>
              <h4 style={{ color: '#0f172a' }} className="text-sm font-extrabold">초동 조치: 증거 보전 및 즉각 비공개</h4>
              <p style={{ color: '#475569' }} className="leading-relaxed font-medium">
                문제가 된 게시물을 무작정 삭제하기 전에 우선 전체 화면을 캡처하여 원본 증거를 보전합니다. 그 후 즉시 비공개 처리하여 추가적인 노출 확산을 막고 신속한 시정 의지를 확보합니다.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border space-y-2 shadow-sm">
              <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8' }} className="px-2 py-0.5 rounded font-extrabold">
                STEP 2
              </span>
              <h4 style={{ color: '#0f172a' }} className="text-sm font-extrabold">사실관계 규명 및 계약 관계 입증</h4>
              <p style={{ color: '#475569' }} className="leading-relaxed font-medium">
                해당 게시물이 대행사나 인플루언서에 의해 임의 작성된 것인지, 대가성 지급 내역이 존재하는지, 사전 심의 대상인지(심의필 번호 유무) 관련 계약서와 내부 자료를 종합 검토합니다.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border space-y-2 shadow-sm">
              <span style={{ backgroundColor: '#fef3c7', color: '#92400e' }} className="px-2 py-0.5 rounded font-extrabold">
                STEP 3
              </span>
              <h4 style={{ color: '#0f172a' }} className="text-sm font-extrabold">처분 사전통지 단계 논리적 소명서 제출</h4>
              <p style={{ color: '#475569' }} className="leading-relaxed font-medium">
                행정처분 확정 전 주어지는 &lsquo;처분 사전통지&rsquo; 기간에 고의성이 없었음(대행사의 무단 배포 등), 통보 즉시 비공개 완료한 점, 내부 검수 시스템을 강화한 점을 논리적으로 소명하면 처분 수위가 경고 등으로 대폭 경감됩니다.
              </p>
            </div>

            <div style={{ backgroundColor: '#f8fafc', borderColor: '#cbd5e1' }} className="p-4 rounded-xl border space-y-2 shadow-sm">
              <span style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }} className="px-2 py-0.5 rounded font-extrabold">
                STEP 4
              </span>
              <h4 style={{ color: '#0f172a' }} className="text-sm font-extrabold">과도한 처분 시 행정심판 및 행정소송</h4>
              <p style={{ color: '#475569' }} className="leading-relaxed font-medium">
                소명에도 불구하고 표시광고법 및 의료법/변호사법 이중 제재 등 비례의 원칙에 반하는 과도한 업무정지 처분이 내려질 경우, 처분일로부터 90일 이내에 집행정지 신청 및 행정심판·행정소송으로 구제받아야 합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 챕터 7. [요금표 완전 삭제 ➔ 품격 있는 자가진단 5대 체크리스트 & 무료 지원 툴킷] */}
        <section
          id="ch7"
          style={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0' }}
          className="border-2 rounded-2xl p-6 sm:p-10 shadow-lg space-y-6 print:border-black"
        >
          <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
            <h2 style={{ color: '#0f172a' }} className="text-xl sm:text-2xl font-extrabold flex items-center gap-2.5">
              <span
                style={{ backgroundColor: '#059669', color: '#ffffff' }}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shadow-sm"
              >
                7
              </span>
              2026 전문직 블로그 컴플라이언스 5대 자가진단 체크리스트
            </h2>
            <span style={{ color: '#059669' }} className="text-xs font-mono font-bold">Chapter 07</span>
          </div>

          <p style={{ color: '#475569' }} className="text-sm leading-relaxed font-medium">
            대표님 사무소의 블로그 글을 발행하기 전, 아래 5가지 필수 요건을 모두 충족하였는지 최종 점검하십시오.
            단 하나의 항목이라도 누락될 경우 네이버 저품질 또는 협회 징계 리스크에 노출될 수 있습니다.
          </p>

          <div className="space-y-3">
            {[
              {
                title: '1. 20대 핵심 금지어 사전 필터링 완료 여부',
                desc: '100% 승소, 완치, 부작용 없는, 최대 절세, 최저가 등 단정적·보장성 표현이 배제되었는가?'
              },
              {
                title: '2. 포스팅당 1080px 고화질 벤토 카드뉴스 3장 이상 포함 여부',
                desc: '스마트블록 노출과 체류시간 극대화를 위한 구조화된 인포그래픽 카드가 삽입되었는가?'
              },
              {
                title: '3. 네이버 AI 브리핑 우선 인용 Answer-First 서두 배치 여부',
                desc: '서두 2~3줄 내에 독자 검색 의도에 대한 명쾌한 결론과 해결 기준이 선제 제시되었는가?'
              },
              {
                title: '4. 법적 필수 명시 사항 표기 여부',
                desc: '변호사법상 광고책임변호사 성명, 의료법상 부작용 고지 및 면책 문구가 하단에 정확히 기재되었는가?'
              },
              {
                title: '5. 대법원 판례·국세청 예규 등 신뢰 신호(E-E-A-T) 인용 여부',
                desc: '단순한 일반 상식이 아닌, 구체적 판결 번호나 세법 조항을 융합하여 독창적 전문성을 확보하였는가?'
              }
            ].map((chk, idx) => (
              <div key={idx} style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }} className="p-4 rounded-xl border flex items-start gap-3">
                <CheckSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong style={{ color: '#0f172a' }} className="text-sm font-bold block">{chk.title}</strong>
                  <p style={{ color: '#64748b' }} className="text-xs mt-0.5 leading-relaxed">{chk.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 거부감 없는 소프트 CTA 배너 (요금표 없음!) */}
          <div
            style={{ backgroundColor: '#0f172a', color: '#ffffff', borderColor: '#4f46e5' }}
            className="p-6 rounded-2xl border-2 space-y-4 shadow-xl print:hidden mt-6"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <span style={{ backgroundColor: '#064e3b', color: '#6ee7b7' }} className="text-[10px] font-extrabold px-2 py-0.5 rounded">
                    신용카드 등록 ZERO
                  </span>
                  <strong style={{ color: '#ffffff' }} className="text-sm sm:text-base font-extrabold">
                    대표님 사무소의 키워드로 안전성을 직접 검증해 보세요
                  </strong>
                </div>
                <p style={{ color: '#94a3b8' }} className="text-xs">
                  회원가입 즉시 3회 무료 체험 크레딧이 제공됩니다. 대표님의 실제 키워드로 10초 만에 생성되는 C-Rank 칼럼을 확인하세요.
                </p>
              </div>

              <Link
                href="/login?ref=ad-law-checklist"
                style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                className="px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm shadow-xl transition flex items-center gap-2 hover:bg-indigo-600 cursor-pointer whitespace-nowrap"
              >
                <span>3회 무료 체험 시작하기</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 저작권 및 법적 고지 (사업자 개인정보 완전 제거) */}
        <footer style={{ borderColor: '#e2e8f0' }} className="pt-8 border-t text-center text-xs space-y-2 print:pt-4">
          <p style={{ color: '#0f172a' }} className="font-extrabold">PostSync 리걸·메디컬 AI 컴플라이언스 랩</p>
          <p style={{ color: '#94a3b8' }} className="text-[10px] max-w-2xl mx-auto leading-relaxed pt-2">
            본 지침서의 내용은 2026년 기준 공표된 대한변호사협회, 보건복지부, 한국세무사회, 공정거래위원회의 공식 규정과 네이버 검색 알고리즘을 분석한 정보 제공 목적의 백서이며, PostSync는 법률·의료 자문이 아닌 콘텐츠 최적화 소프트웨어를 제공합니다. 최종 광고 집행 시 전담 자문 변호사 및 소속 협회의 광고 심의를 확인하시기 바랍니다.
          </p>
          <p style={{ color: '#cbd5e1' }} className="text-[10px] pt-1">© 2026 PostSync. All rights reserved.</p>
        </footer>

      </main>
    </div>
  )
}
