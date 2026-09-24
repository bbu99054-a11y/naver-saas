/**
 * Jev (TypeSafe AI) System One 초고속 판단 클라이언트
 * 
 * 대형 생성 LLM과 달리, 환각(Hallucination) 없이 0.05초 만에
 * 정형화된 판단(Choice), 긴급도(Noul), 수임 점수(Score)를 실시간 판별합니다.
 */

export interface LeadTriageResult {
  isUrgent: boolean
  urgencyScore: number // 0 ~ 100
  retainerTier: 'high' | 'standard' | 'light'
  retainerAmountLabel: string
  recommendedAction: 'immediate_call' | 'standard_call' | 'routine_schedule'
  actionText: string
  confidence: number
  model: string
}

export async function triageConsultLead(lead: {
  specialty?: string
  stage?: string
  summary?: string
  name?: string
  phone?: string
}): Promise<LeadTriageResult> {
  const apiKey = process.env.TYPESAFE_API_KEY || process.env.JEV_API_KEY

  const summary = lead.summary || ''
  const specialty = lead.specialty || ''
  const stage = lead.stage || ''

  // 1. API 키가 없거나 비활성화된 경우의 안전한 룰 기반 대체 (Graceful Fallback)
  if (!apiKey) {
    const isEmergencyKeywords = /긴급|체포|구속|영장|음주|2진|출석|소장|30일|압수수색/i.test(summary + specialty + stage)
    return {
      isUrgent: isEmergencyKeywords,
      urgencyScore: isEmergencyKeywords ? 85 : 40,
      retainerTier: isEmergencyKeywords ? 'high' : 'standard',
      retainerAmountLabel: isEmergencyKeywords ? '550만 원' : '330만 원',
      recommendedAction: isEmergencyKeywords ? 'immediate_call' : 'standard_call',
      actionText: isEmergencyKeywords ? '🚨 10분 내 긴급 유선 연결 권장 (골든타임)' : '📞 당일 내 유선 상담 권장',
      confidence: 0.8,
      model: 'fallback-heuristic'
    }
  }

  try {
    const response = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'jev-latest',
        state: {
          specialty: specialty || '법률 일반',
          stage: stage || '초기 접수',
          summary: summary || '의뢰인 상세 사연 미기재'
        },
        questions: {
          is_urgent: {
            type: 'noul',
            instructions: 'Is this an urgent situation requiring immediate intervention within 10 minutes (e.g. arrest, police interrogation, tight deadline, DUI, detention risk)?'
          },
          retainer_tier: {
            type: 'choice',
            instructions: 'Estimate the legal fee/retainer bracket based on the case severity and complexity.',
            criteria: {
              high: 'Major criminal, detention risk, warrant, corporate litigation, high-asset family dispute (500만원 이상)',
              standard: 'Standard civil lawsuit, standard divorce, DUI initial, lease deposit recovery (300만원~500만원)',
              light: 'Minor dispute, simple advice, contract review, small claims (300만원 미만)'
            }
          },
          action_type: {
            type: 'choice',
            instructions: 'What is the immediate recommended action for the legal representative?',
            criteria: {
              immediate_call: 'Emergency case: Call within 10 minutes immediately',
              standard_call: 'Important case: Review and call within 1-2 hours',
              routine_schedule: 'Routine case: Schedule regular in-office consultation'
            }
          }
        }
      }),
      signal: AbortSignal.timeout(3000) // 최대 3초 타임아웃 가드
    })

    if (!response.ok) {
      throw new Error(`Jev API returned HTTP ${response.status}`)
    }

    const data = await response.json()
    const answers = data?.answers || {}

    // Noul(확률 0~1) ➔ 100점 만점 환산
    const noulVal = typeof answers.is_urgent?.noul === 'number' ? answers.is_urgent.noul : 0.5
    const urgencyScore = Math.round(noulVal * 100)
    const isUrgent = urgencyScore >= 50

    const tierChoice = answers.retainer_tier?.choice || 'standard'
    let retainerTier: 'high' | 'standard' | 'light' = 'standard'
    let retainerAmountLabel = '440만 원'

    if (tierChoice === 'high') {
      retainerTier = 'high'
      retainerAmountLabel = '550만 원'
    } else if (tierChoice === 'light') {
      retainerTier = 'light'
      retainerAmountLabel = '220만 원'
    }

    const actionChoice = answers.action_type?.choice || (isUrgent ? 'immediate_call' : 'standard_call')
    let recommendedAction: 'immediate_call' | 'standard_call' | 'routine_schedule' = 'standard_call'
    let actionText = '📞 1시간 내 유선 상담 권장'

    if (actionChoice === 'immediate_call' || isUrgent) {
      recommendedAction = 'immediate_call'
      actionText = '🚨 10분 내 긴급 유선 연결 필수 (골든타임)'
    } else if (actionChoice === 'routine_schedule') {
      recommendedAction = 'routine_schedule'
      actionText = '📅 방문 대면 상담 일정 조율 권장'
    }

    return {
      isUrgent,
      urgencyScore,
      retainerTier,
      retainerAmountLabel,
      recommendedAction,
      actionText,
      confidence: answers.action_type?.confidence || 0.75,
      model: data.model || 'jev-latest'
    }
  } catch (error) {
    console.warn('[JevClient] Triage warning (using graceful fallback):', error)
    const isEmergencyKeywords = /긴급|체포|구속|영장|음주|2진|출석|소장|30일|압수수색/i.test(summary + specialty + stage)
    return {
      isUrgent: isEmergencyKeywords,
      urgencyScore: isEmergencyKeywords ? 85 : 45,
      retainerTier: isEmergencyKeywords ? 'high' : 'standard',
      retainerAmountLabel: isEmergencyKeywords ? '550만 원' : '380만 원',
      recommendedAction: isEmergencyKeywords ? 'immediate_call' : 'standard_call',
      actionText: isEmergencyKeywords ? '🚨 10분 내 긴급 유선 연결 권장 (골든타임)' : '📞 1시간 내 유선 상담 권장',
      confidence: 0.7,
      model: 'fallback-heuristic'
    }
  }
}

export interface PlaceDiagnosisResult {
  score: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  rankStatusText: string
  causeAnalysis: string
  recommendedIntroCopy: string
  actionChecklist: string[]
  threatLevel: 'SAFE' | 'WARN' | 'CRITICAL'
  industryName: string
  model: string
}

// 하위 호환을 위한 별칭
export type JevPlaceDiagnosis = PlaceDiagnosisResult

type IndustryCategory =
  | 'neuro_ortho' // 신경외과, 정형외과, 마취통증, 척추관절, 재활의학과
  | 'dermatology_plastic' // 피부과, 성형외과, 에스테틱
  | 'dental' // 치과
  | 'oriental' // 한의원, 한방병원
  | 'hospital_general' // 일반 병의원, 내과, 이비인후과 등
  | 'legal' // 변호사, 법률사무소, 법무법인, 노무사 (변호사법 제23조 엄수)
  | 'tax' // 세무사, 회계사, 세무법인 (세무사법 제12조 엄수)
  | 'cafe_bakery' // 카페, 디저트, 베이커리
  | 'restaurant' // 음식점, 맛집, 식당, 고기집 등
  | 'beauty_hair' // 미용실, 헤어샵, 바버샵, 네일
  | 'edu_academy' // 학원, 교습소, 스터디카페, 필라테스, 헬스
  | 'general' // 일반 매장

function detectIndustry(query: string, targetName: string, category: string = ''): { cat: IndustryCategory; label: string } {
  const text = `${query} ${targetName} ${category}`.toLowerCase()

  if (/신경외과|정형외과|마취통증|통증의학|재활의학|척추|관절|도수치료|마디/i.test(text)) {
    return { cat: 'neuro_ortho', label: '척추·관절 신경/정형외과' }
  }
  if (/피부과|성형외과|피부클리닉|리프팅|보톡스|필러|에스테틱/i.test(text)) {
    return { cat: 'dermatology_plastic', label: '피부과 / 성형외과' }
  }
  if (/치과|임플란트|치과의원|교정치과/i.test(text)) {
    return { cat: 'dental', label: '치과 의원' }
  }
  if (/한의원|한방병원|추나|사상체질|한약/i.test(text)) {
    return { cat: 'oriental', label: '한의원 / 한방병원' }
  }
  if (/병원|의원|내과|이비인후과|소아과|안과|산부인과|비뇨기과|가정의학과/i.test(text)) {
    return { cat: 'hospital_general', label: '병원 / 전문의원' }
  }
  if (/변호사|법률사무소|법무법인|이혼전문|형사전문|변호인|노무사|행정사/i.test(text)) {
    return { cat: 'legal', label: '변호사 / 법률사무소' }
  }
  if (/세무사|회계사|세무법인|회계법인|세무회계|기장/i.test(text)) {
    return { cat: 'tax', label: '세무사 / 회계사' }
  }
  if (/카페|커피|디저트|베이커리|빵집|로스터리|케이크/i.test(text)) {
    return { cat: 'cafe_bakery', label: '카페 / 베이커리' }
  }
  if (/식당|음식점|맛집|고기집|삼겹살|갈비|횟집|스시|이자카야|파스타|한식|중식|일식|국밥|치킨|피자|포차/i.test(text)) {
    return { cat: 'restaurant', label: '음식점 / 맛집' }
  }
  if (/미용실|헤어|바버샵|네일|네일샵|속눈썹|왁싱|뷰티/i.test(text)) {
    return { cat: 'beauty_hair', label: '헤어 / 뷰티 살롱' }
  }
  if (/학원|교습소|스터디카페|독서실|어학원|필라테스|헬스|피트니스|pt/i.test(text)) {
    return { cat: 'edu_academy', label: '학원 / 교육 / 피트니스' }
  }
  return { cat: 'general', label: '지역 전문 매장' }
}

function generateIndustryIntroCopy(industry: IndustryCategory, query: string, targetName: string, rank: number | null): string {
  const isTop1 = rank === 1
  const isTop5 = rank !== null && rank <= 5

  switch (industry) {
    case 'neuro_ortho':
      if (isTop1) return `[${query} 1위 중점 진료] 비수술 척추·관절 치료부터 정밀 진단까지, ${targetName} 대표원장이 1:1 직접 진료합니다.`
      if (isTop5) return `[${query} 척추·관절 중점 진료] 과잉진료 없는 정확한 원인 진단과 비수술 맞춤 치료, ${targetName}입니다.`
      return `[${query} 비수술 척추관절 진료] 풍부한 임상경험의 전문의가 1:1 맞춤 진료하는 ${targetName}입니다.`

    case 'dermatology_plastic':
      if (isTop1) return `[${query} 1위 안심 케어] 정품·정량 원칙의 프라이빗 1:1 맞춤 피부 리프팅, ${targetName}입니다.`
      if (isTop5) return `[${query} 1:1 맞춤 피부 디자인] 개개인의 피부 두께와 결을 고려한 정밀 시술, ${targetName}에서 달라짐을 경험하세요.`
      return `[${query} 프라이빗 피부 솔루션] 정품·정량 시술과 1:1 꼼꼼한 상담으로 신뢰를 드리는 ${targetName}입니다.`

    case 'dental':
      if (isTop1) return `[${query} 평생 안심 주치의] 자연치아 보존을 최우선으로, 과잉진료 없이 양심 진료하는 ${targetName} 치과입니다.`
      if (isTop5) return `[${query} 자연치아 살리기] 대학병원급 정밀 진단 장비와 1:1 전담 책임 진료, ${targetName} 치과입니다.`
      return `[${query} 안심 진료 치과] 아프지 않은 꼼꼼한 마취와 환자 중심의 맞춤 치료, ${targetName} 치과입니다.`

    case 'oriental':
      if (isTop1) return `[${query} 1:1 맞춤 체질 진맥] 통증 치료부터 교통사고 후유증 케어까지, 온 가족 안심 ${targetName} 한의원.`
      if (isTop5) return `[${query} 근본 통증 다스림] 1:1 맞춤 추나요법과 체질 침구 치료, 편안한 치유 공간 ${targetName} 한의원입니다.`
      return `[${query} 통증·교통사고 클리닉] 환자 한 분 한 분의 체질을 분석하여 정성으로 처방하는 ${targetName} 한의원입니다.`

    case 'hospital_general':
      if (isTop1) return `[${query} 1위 신뢰 진료] 정확한 정밀 검사와 환자 중심의 따뜻한 1:1 전담 진료, ${targetName}입니다.`
      if (isTop5) return `[${query} 우리 동네 안심 주치의] 꼼꼼한 상담과 신속한 원스톱 진료 시스템, ${targetName}입니다.`
      return `[${query} 맞춤 건강 진료] 풍부한 진료 경험을 바탕으로 성심성의껏 진료하는 ${targetName}입니다.`

    case 'legal':
      // 변호사법 제23조 및 광고 규정 준수 (최고, 100% 승소, 최저가 금지)
      if (isTop1) return `[${query} 전담 법률 조력] 대한변협 등록 전문 변호사의 1:1 비밀 보장 직접 상담, ${targetName}이 끝까지 함께합니다.`
      if (isTop5) return `[${query} 밀착 법률 대응] 사건 초기 골든타임부터 판결까지, 전문 변호사가 직접 소통하는 ${targetName}입니다.`
      return `[${query} 신속 1:1 법률 상담] 의뢰인의 입장을 면밀히 분석하고 실질적 해법을 제시하는 ${targetName}입니다.`

    case 'tax':
      // 세무사법 제12조 준수 (1위 환급율, 수임료 비교, 무료/최저가 금지)
      if (isTop1) return `[${query} 안심 절세 파트너] 최신 개정 세법 반영 맞춤 절세 설계와 세무조사 대응, ${targetName} 대표 세무사 1:1 전담.`
      if (isTop5) return `[${query} 합법적 절세 컨설팅] 업종별 세무 기장부터 양도·상속·증여까지, 꼼꼼하게 검토하는 ${targetName} 세무회계.`
      return `[${query} 1:1 맞춤 세무 상담] 사업자의 세금 부담을 줄여주는 체계적인 기장 및 세무 자문, ${targetName}입니다.`

    case 'cafe_bakery':
      if (isTop1) return `[${query} 스페셜티 로스터리] 매일 아침 갓 구운 수제 베이커리와 신선한 시그니처 커피, ${targetName}입니다.`
      if (isTop5) return `[${query} 감성 힐링 카페] 정성껏 내린 프리미엄 원두와 달콤한 수제 디저트가 있는 ${targetName}입니다.`
      return `[${query} 아늑한 디저트 카페] 좋은 원두와 정직한 재료로 정성을 다해 만드는 공간, ${targetName}입니다.`

    case 'restaurant':
      if (isTop1) return `[${query} 맛의 정석] 매일 엄선한 신선한 식재료와 깊은 손맛으로 정성을 다해 모시는 ${targetName}입니다.`
      if (isTop5) return `[${query} 입맛을 사로잡는 한상] 단골이 인정하는 정직한 맛과 푸짐한 인심, ${targetName}입니다.`
      return `[${query} 정갈한 한 끼] 내 가족이 먹는다는 마음으로 매일 아침 정성껏 준비하는 ${targetName}입니다.`

    case 'beauty_hair':
      if (isTop1) return `[${query} 1위 퍼스널 디자인] 얼굴형과 두상에 딱 맞춘 1:1 인생 머리 맞춤 디자인, 프리미엄 살롱 ${targetName}.`
      if (isTop5) return `[${query} 트렌디 감성 헤어] 손상 없는 프리미엄 약제와 1:1 정밀 디테일 컷, ${targetName}입니다.`
      return `[${query} 맞춤 스타일링] 고객님의 매력을 가장 돋보이게 완성해 드리는 1:1 예약제 살롱 ${targetName}입니다.`

    case 'edu_academy':
      if (isTop1) return `[${query} 성적 향상 1등 케어] 소수정예 맞춤 밀착 지도와 철저한 1:1 피드백, 실력을 완성하는 ${targetName}.`
      if (isTop5) return `[${query} 맞춤형 학습 솔루션] 학생 개개인의 취약점을 집중 보완하는 체계적인 커리큘럼, ${targetName}입니다.`
      return `[${query} 1:1 밀착 지도] 기초부터 심화까지 스스로 공부하는 힘을 길러주는 ${targetName}입니다.`

    default:
      if (isTop1) return `[${query} 공식 추천 매장] 고객 만족을 최우선으로 정직하고 신속하게 모시는 ${targetName}입니다.`
      if (isTop5) return `[${query} 믿을 수 있는 전문점] 친절한 1:1 상담과 철저한 사후 관리, 신뢰할 수 있는 ${targetName}입니다.`
      return `[${query} 정직한 서비스] 고객 한 분 한 분을 소중히 생각하며 최상의 만족을 드리는 ${targetName}입니다.`
  }
}

export interface PlaceGapMetricItem {
  top1: string | boolean
  my: string | boolean
  diff?: number
  status: 'OPTIMAL' | 'DEFICIT' | 'MISSING' | 'ACTIVE' | 'NONE'
}

export interface PlaceGapAnalysisData {
  top1Name: string
  isRank1: boolean
  metrics: {
    saves: PlaceGapMetricItem
    visitorReviews: PlaceGapMetricItem
    blogReviews: PlaceGapMetricItem
    booking: PlaceGapMetricItem
    coupon: PlaceGapMetricItem
  }
}

export interface DiagnosePlaceParams {
  query: string
  targetName: string
  rank: number | null
  hasBooking: boolean
  top1Name: string
  category?: string
  gapAnalysis?: PlaceGapAnalysisData | null
}

export async function diagnosePlaceWithJev(params: DiagnosePlaceParams): Promise<PlaceDiagnosisResult> {
  const { query, targetName, rank, hasBooking, top1Name, category, gapAnalysis } = params

  const indInfo = detectIndustry(query, targetName, category)
  const isRank1 = rank === 1
  const isTop5 = rank !== null && rank <= 5
  const isTop20 = rank !== null && rank <= 20

  let score = 38
  let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'D'
  let threatLevel: 'SAFE' | 'WARN' | 'CRITICAL' = 'CRITICAL'
  let rankStatusText = '❌ 20위권 밖 미노출 (검색 유입 0% 고립 구간)'
  let causeAnalysis = `[${targetName}] 매장이 상위 20위 이내에 감지되지 않았습니다. 1위 [${top1Name || '상위 매장'}] 대비 스마트플레이스 소개글 첫 줄 핵심 키워드(${query}) 전방 배치와 네이버 예약/쿠폰 세팅이 부족하여 검색 알고리즘 랭킹에서 완전히 고립된 상태입니다.`

  if (isRank1) {
    score = 96
    grade = 'S'
    threatLevel = 'SAFE'
    rankStatusText = '🥇 1페이지 전체 1위 최상위 독점존 (상위 1%)'
    causeAnalysis = `현재 [${query}] 검색 시 전체 1위를 수성하고 있습니다. 2~3위 경쟁사의 추격을 방어하기 위해 최근 30일 이내 영수증 포토리뷰 최신성과 주 1회 플레이스 '새소식' 발행 리듬을 계속 유지해야 합니다.`
  } else if (isTop5) {
    score = hasBooking ? 86 : 74
    grade = 'A'
    threatLevel = 'WARN'
    rankStatusText = `⚡ 1페이지 ${rank}위 상위권 (1위 탈환 가시권, 점유율 20~25%)`
    causeAnalysis = `1위 [${top1Name}] 매장 대비 ${!hasBooking ? '네이버 예약 미연동(-20점 감점) 및 ' : ''}플레이스 소개글 첫 25자 내 [${query}] 전방 배치 밀도가 부족하여 1위 진입이 정체된 상태입니다.`
  } else if (isTop20) {
    score = hasBooking ? 62 : 48
    grade = 'C'
    threatLevel = 'CRITICAL'
    rankStatusText = `🚨 2페이지 이하 ${rank}위 (모바일 유입 85% 유실 구간)`
    causeAnalysis = `1페이지 1~5위 상위 매장들이 모바일 검색 유입과 유선 전화를 85% 이상 독점하고 있어 현재 순위에서는 신규 고객 전환율이 극히 저조합니다. 소개글 첫 줄 전면 개편과 예약/쿠폰 연동이 시급합니다.`
  }

  // 업종별 2026 규정 준수 맞춤 카피 생성
  const recommendedIntroCopy = generateIndustryIntroCopy(indInfo.cat, query, targetName, rank)

  // 1위 매장 대비 실측 결측치(gapAnalysis) 기반 3대 긴급 액션 플랜 생성
  const actionChecklist: string[] = []

  // 액션 1: 네이버 실시간 예약
  if (gapAnalysis && gapAnalysis.metrics.booking.status === 'MISSING') {
    actionChecklist.push(`🚨 [네이버 예약 즉시 연동] 1위 매장은 네이버 예약을 연동 중입니다. 스마트플레이스 관리자에서 '예약 버튼'을 즉시 활성화하여 알고리즘 가산점(+20점)과 자동 리뷰 유입을 확보하세요.`)
  } else if (hasBooking) {
    actionChecklist.push(`✅ [예약 혜택 강화] 네이버 예약 고객 전용 혜택(우선 배정/사전 검토/음료 서비스)을 등록하여 예약 전환율과 매장 체류시간을 극대화하세요.`)
  } else {
    actionChecklist.push(`📅 [네이버 예약 기능 ON] 실시간 예약 버튼을 연동하면 네이버 지도 랭킹 가산점 부여와 함께 예약 고객이 영수증 리뷰 작성 대상자로 자동 편입됩니다.`)
  }

  // 액션 2: 플레이스 쿠폰
  if (gapAnalysis && gapAnalysis.metrics.coupon.status === 'MISSING') {
    actionChecklist.push(`🎟️ [플레이스 쿠폰 신설] 알림받기 고객 전용 쿠폰을 등록하세요. 플레이스 목록에 [쿠폰] 뱃지가 부착되어 모바일 클릭률(CTR)과 저장수가 즉시 35% 이상 상승합니다.`)
  } else if (gapAnalysis && gapAnalysis.metrics.coupon.my) {
    actionChecklist.push(`🎁 [쿠폰 시즌 갱신] 이번 달 한정 시즌 이벤트 쿠폰으로 문구를 리프레시하여 네이버 홈 피드 재노출 가중치를 획득하세요.`)
  } else {
    actionChecklist.push(`🎟️ [쿠폰 신설 권장] '첫 방문 할인' 또는 '알림받기 전용 혜택 쿠폰'을 발행하여 플레이스 클릭률과 저장수를 동시에 끌어올리세요.`)
  }

  // 액션 3: 리뷰 & C-Rank 지수 격차 방어
  const visitorDiff = gapAnalysis?.metrics?.visitorReviews?.diff || 0
  const blogDiff = gapAnalysis?.metrics?.blogReviews?.diff || 0

  if (gapAnalysis && gapAnalysis.metrics.visitorReviews.status === 'DEFICIT' && visitorDiff > 0) {
    actionChecklist.push(`⭐ [영수증 리뷰 격차: ${visitorDiff.toLocaleString()}개 부족] 1위 대비 실시간 리뷰 수가 부족합니다. 현장 QR코드를 비치하여 당일 고객 영수증 포토리뷰를 집중 유도하고 정성 답글 100%를 유지하세요.`)
  } else if (gapAnalysis && gapAnalysis.metrics.blogReviews.status === 'DEFICIT' && blogDiff > 0) {
    actionChecklist.push(`📝 [블로그 침투 격차: ${blogDiff.toLocaleString()}건 부족] 1위 매장은 블로그 리뷰 ${gapAnalysis.metrics.blogReviews.top1}건을 장악 중입니다. 지도 장소 첨부형 C-Rank 양질의 블로그 원고를 월 2~4회 축적하여 외부 검색 점수를 보강하세요.`)
  } else if (isRank1) {
    actionChecklist.push(`👑 [1위 수성 락인 전략] 2~3위 경쟁사의 추격을 방어하기 위해 주 1회 플레이스 '새소식' 발행과 최신 리뷰 답글 100%를 48시간 이내에 전담 관리하세요.`)
  } else {
    actionChecklist.push(`소개글 첫 25자 내에 상호명과 [${query}] 핵심 키워드를 전방 배치하여 네이버 검색 로봇의 키워드 매칭 가중치를 극대화하세요.`)
  }

  return {
    score,
    grade,
    rankStatusText,
    causeAnalysis,
    recommendedIntroCopy,
    actionChecklist,
    threatLevel,
    industryName: indInfo.label,
    model: 'placesync-ai-engine'
  }
}


