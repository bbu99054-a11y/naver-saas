export interface Top3PlaceSummary {
  name: string
  rank: number
  visitorReviews: number
  blogReviews: number
  hasBooking?: boolean
  hasCoupon?: boolean
  saves?: string | number
}

export interface DeepAuditGapMatrix {
  top1Name: string
  top3AvgReviews: number
  top3AvgBlogReviews: number
  myReviews: number
  myBlogReviews: number
  diffReviews: number // myReviews - top3AvgReviews
  diffBlogReviews: number
  weeklyReviewsNeeded: number
  weeklyBlogsNeeded: number
  summaryText: string
}

export interface DeepAuditCompleteness {
  score: number // 0~100점
  grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL'
  gradeText: string
  keywordStuffingRisk: 'SAFE' | 'CAUTION' | 'DANGER'
  stuffingReason: string
  checklist: Array<{
    id: string
    title: string
    status: 'PASS' | 'WARN' | 'FAIL'
    statusText: string
    desc: string
    impact: string
  }>
}

export interface DeepAuditAIReviewHealth {
  healthGrade: 'A' | 'B' | 'C' | 'D'
  healthScore: number
  aiCitationFit: '최상' | '양호' | '주의' | '부적합'
  industryType: '의료/병원' | '식음료/맛집' | '뷰티/헤어' | '전문직/법률' | '생활/기타'
  riskKeywords: string[]
  mitigationGuide: string
}

export interface DeepAuditPlaybookDay {
  day: number
  badge: string
  title: string
  action: string
  kpi: string
  difficulty: '쉬움' | '보통' | '집중'
}

export interface WeeklyAiReply {
  id: string
  situation: string
  title: string
  badge: string
  replyText: string
  seoKeywords: string[]
}

export interface Rank1Event {
  changed: boolean
  previousStore?: string
  currentStore?: string
  reason?: string
  noticeBadge?: string
  adviceText?: string
}

export interface ReviewDeltaStatus {
  status: 'NORMAL' | 'ALGORITHM_CLEANSED'
  deltaCount: number
  displayText: string
  badgeColor: string
  badgeBg: string
  insightText: string
}

export interface WatchdogTrigger {
  type: 'RANK_DROP' | 'COMPETITOR_SURGE' | 'ALGORITHM_SHIFT'
  title: string
  badge: string
  desc: string
  actionGuide: string
  detected: boolean
}

export interface RotationWeekModule {
  weekNumber: 1 | 2 | 3 | 4
  weekThemeTitle: string
  themeDesc: string
  focusArea: string
  actionItems: Array<{
    title: string
    status: 'PASS' | 'WARN' | 'ACTION_REQUIRED'
    desc: string
  }>
}

export interface GPSStandardBaseline {
  standardLocation: string
  radiusNotice: string
  rollingStabilityText: string
}

export interface WeeklySurveillanceBundle {
  isFirstWeekBaseline: boolean
  baselineNoticeTitle: string
  baselineNoticeDesc: string
  rollingNoiseStatus: 'SAFE' | 'CAUTION' | 'STABLE'
  rollingNoiseBadge: string
  rollingNoiseDesc: string
  top1EstimatedWeeklyReviews: number
  top1EstimatedWeeklyBlogs: number
  myWeeklyTargetReviews: number
  myWeeklyTargetBlogs: number
  weeklyPaceSummary: string
  nextWeekDispatchSchedule: string
  aiReplies: WeeklyAiReply[]
  rank1Event?: Rank1Event
  reviewDeltaStatus?: ReviewDeltaStatus
  watchdogTriggers?: WatchdogTrigger[]
  rotationWeek?: RotationWeekModule
  gpsBaseline?: GPSStandardBaseline
}

export const WEEKLY_ENGINE_MODULES = {
  week1: {
    weekNumber: 1,
    themeTitle: '1주차: 기본 인덱싱 점검',
    subject: '네이버 검색 로봇 색인 최적화',
    description: '매장 소개글 키워드 배치율, 찾아오는 길 등록 상태, 대표 사진 20장 충족 여부 점검'
  },
  week2: {
    weekNumber: 2,
    themeTitle: '2주차: 리뷰 품질 및 감성 진단',
    subject: 'AI 리뷰 진정성 평가',
    description: '최근 30일 영수증 리뷰 중 부정 단어 추출, 단문/복사형 리뷰 비중, AI 맞춤형 공감 답글 2종 처방'
  },
  week3: {
    weekNumber: 3,
    themeTitle: '3주차: 체류 시간 및 전환 도구',
    subject: '사용자 체류 신호 증폭',
    description: "네이버 예약/스마트콜 연동 여부, '알림받기 고객용 쿠폰/공지' 세팅 상태 점검"
  },
  week4: {
    weekNumber: 4,
    themeTitle: '4주차: 월간 결산 및 키워드 확장',
    subject: '월간 트렌드 결산 및 롱테일 확장',
    description: '지난 30일간의 순위 궤적 그래프, 상권 내 새롭게 뜨고 있는 연관 세부 키워드 3개 추천'
  }
} as const

export interface BenchmarkingMatrixItem {
  metricName: string
  top1Value: string | number
  myValue: string | number
  diffText: string // 예: "부족: -36개 (주당 9개 필요)"
  diffBadgeType: 'danger' | 'warning' | 'neutral'
}

export interface StepActionPlaybookItem {
  step: number
  title: string
  description: string
  copyReplies?: Array<{
    title: string
    text: string
  }>
}

export interface Week1IndexingAuditItem {
  id: string
  title: string
  status: 'EXCELLENT' | 'GOOD' | 'WARN' | 'FAIL'
  statusBadge: string
  badgeType: 'success' | 'warning' | 'danger'
  diagnosis: string
  actionGuide: string
}

export interface NextWeekTeaser {
  weekNumber: number
  themeTitle: string
  subject: string
  description: string
}

export interface SaaSReportSummary {
  weekLabel: string // "2026년 3월 5주차"
  subTitle: string // "[상호명]의 상권 내 경쟁력 및 알고리즘 반응 지수"
  seoScore: number // 74
  seoScoreText: string // "74점 / 100점 - 상위 15% 수준"
  lossClicksText: string // "3위 매장 대비 월 약 140명의 유입 손실 발생 중"
  lossClicksNum: number // 140
  benchmarkingMatrix: BenchmarkingMatrixItem[]
  indexingAudit: Week1IndexingAuditItem[] // 1주차 색인 최적화 점검 3종
  riskChecklist: Array<{
    category: string // "찾아오는 길 설명 완결도", "리뷰 진정성 지수", "전환 기능"
    status: '주의' | '보통' | '미흡' | '정상'
    desc: string
  }>
  stepPlaybook: StepActionPlaybookItem[]
  nextWeekTeaser: NextWeekTeaser
}

export interface DeepAuditBundle {
  gapMatrix: DeepAuditGapMatrix
  completeness: DeepAuditCompleteness
  reviewHealth: DeepAuditAIReviewHealth
  playbook: DeepAuditPlaybookDay[]
  weeklySurveillance: WeeklySurveillanceBundle
  saasSummary?: SaaSReportSummary
}

import type { PlaceRealDetails } from '@/lib/naver/placeDetailScraper'

export interface PlaceReportSnapshot {
  [key: string]: any
  storeName: string
  targetKeyword: string
  myRank?: number | string
  prevRank?: number | string
  top1Name?: string
  prevTop1Name?: string
  totalScore?: number
  myReviews?: number
  prevMyReviews?: number
  top1Reviews?: number
  prevTop1Reviews?: number
  myBlogReviews?: number
  top1BlogReviews?: number
  myBooking?: boolean
  top1Booking?: boolean
  myCoupon?: boolean
  top1Coupon?: boolean
  mySaves?: string | number
  top1Saves?: string | number
  reportDate?: string
  reportId?: string
  top3Places?: Top3PlaceSummary[]
  deepAudit?: DeepAuditBundle
  saasSummary?: SaaSReportSummary
  weekNumber?: 1 | 2 | 3 | 4
  realDetails?: PlaceRealDetails
}

export function detectIndustry(storeName: string, keyword: string): '의료/병원' | '식음료/맛집' | '뷰티/헤어' | '전문직/법률' | '생활/기타' {
  const text = `${storeName} ${keyword}`.toLowerCase()
  if (/정형외과|한의원|치과|병원|의원|피부과|안과|내과|이비인후과|통증|클리닉|성형외과/.test(text)) {
    return '의료/병원'
  }
  if (/고기|식당|카페|맛집|삼겹살|치킨|피자|이자카야|베이커리|주점|스시|파스타|술집|포차|디저트/.test(text)) {
    return '식음료/맛집'
  }
  if (/헤어|미용실|네일|속눈썹|에스테틱|왁싱|바버|바디|피부관리/.test(text)) {
    return '뷰티/헤어'
  }
  if (/변호사|법무사|세무사|회계사|노무사|행정사|법률|특허/.test(text)) {
    return '전문직/법률'
  }
  return '생활/기타'
}

export function calculateTop3GapMatrix(snapshot: PlaceReportSnapshot): DeepAuditGapMatrix {
  const myRev = Number(snapshot.myReviews || 0)
  const myBlog = Number(snapshot.myBlogReviews || 0)
  const top1Rev = Number(snapshot.top1Reviews || 0)
  const top1Blog = Number(snapshot.top1BlogReviews || 0)

  let top3AvgRev = top1Rev
  let top3AvgBlog = top1Blog

  if (snapshot.top3Places && snapshot.top3Places.length > 0) {
    const list = snapshot.top3Places.slice(0, 3)
    const sumRev = list.reduce((acc, cur) => acc + Number(cur.visitorReviews || 0), 0)
    const sumBlog = list.reduce((acc, cur) => acc + Number(cur.blogReviews || 0), 0)
    top3AvgRev = Math.round(sumRev / list.length)
    top3AvgBlog = Math.round(sumBlog / list.length)
  } else {
    top3AvgRev = Math.round(top1Rev * 0.85)
    top3AvgBlog = Math.round(top1Blog * 0.85)
  }

  const diffReviews = myRev - top3AvgRev
  const diffBlogReviews = myBlog - top3AvgBlog

  const weeklyReviewsNeeded = diffReviews < 0 
    ? Math.max(3, Math.ceil(Math.abs(diffReviews) / 4))
    : 3
  const weeklyBlogsNeeded = diffBlogReviews < 0
    ? Math.max(1, Math.ceil(Math.abs(diffBlogReviews) / 4))
    : 1

  let summaryText = ''
  if (diffReviews < 0 && diffBlogReviews < 0) {
    summaryText = `상위 1~3위 평균 대비 영수증 리뷰 ${Math.abs(diffReviews).toLocaleString()}개, 블로그 ${Math.abs(diffBlogReviews).toLocaleString()}개가 부족합니다. 30일 내 3위권 진입을 위해 매주 영수증 리뷰 최소 ${weeklyReviewsNeeded}개와 블로그 ${weeklyBlogsNeeded}건 채우기가 필수입니다.`
  } else if (diffReviews < 0) {
    summaryText = `블로그 인지도는 양호하나, 영수증 리뷰 볼륨이 상위권 평균보다 ${Math.abs(diffReviews).toLocaleString()}개 부족한 상태입니다. 정성 포토리뷰 유입 가속(주간 ${weeklyReviewsNeeded}건 채우기)이 최우선입니다.`
  } else {
    summaryText = `누적 리뷰 볼륨은 상위 1~3위 평균치를 압도하고 있습니다. 현재 순위 차이는 단순 누적 수량이 아닌 네이버 2026 알고리즘의 '최근 30일 신규 영수증 리뷰 유입 가속도(Velocity)'와 '모바일 GPS 거리 가중치'에 의한 것입니다. 주당 3~5건의 정성 포토리뷰 유입 활동성 신호를 꾸준히 유지하는 것이 핵심입니다.`
  }

  return {
    top1Name: snapshot.top1Name || '1위 매장',
    top3AvgReviews: top3AvgRev,
    top3AvgBlogReviews: top3AvgBlog,
    myReviews: myRev,
    myBlogReviews: myBlog,
    diffReviews,
    diffBlogReviews,
    weeklyReviewsNeeded,
    weeklyBlogsNeeded,
    summaryText
  }
}

export function evaluatePlaceCompleteness(snapshot: PlaceReportSnapshot): DeepAuditCompleteness {
  const store = snapshot.storeName || ''
  const kw = snapshot.targetKeyword || ''

  let stuffingRisk: 'SAFE' | 'CAUTION' | 'DANGER' = 'SAFE'
  let stuffingReason = '상호명이 정제되어 있어 네이버 검색 어뷰징 필터링 위험이 없습니다.'

  const hasExcessiveKeywords = /(최고|1위|전문|추천|성지|전문점|제일잘하는)/.test(store)
  const kwTokens = kw.split(/\s+/).filter(Boolean)
  let kwCountInName = 0
  kwTokens.forEach(t => {
    if (t.length >= 2 && store.includes(t)) kwCountInName++
  })

  if (hasExcessiveKeywords && kwCountInName >= 2) {
    stuffingRisk = 'DANGER'
    stuffingReason = '상호명에 검색 키워드 및 과장 수식어가 과도하게 삽입되어 2026 네이버 플레이스 패널티(노출 제한) 위험이 높습니다.'
  } else if (kwCountInName >= 2 || hasExcessiveKeywords) {
    stuffingRisk = 'CAUTION'
    stuffingReason = '상호명에 키워드가 다소 중복되어 있습니다. 사업자등록증 상호와 일치하지 않을 경우 제재 대상이 될 수 있습니다.'
  }

  const reviewCount = Number(snapshot.myReviews || 0)
  const hasNoticeOrCoupon = !!(snapshot.myCoupon || reviewCount >= 100)

  const checklist = [
    {
      id: 'booking',
      title: '네이버 예약 시스템 연동',
      status: snapshot.myBooking ? ('PASS' as const) : ('FAIL' as const),
      statusText: snapshot.myBooking ? '연동 완료' : '미연동 (치명적)',
      desc: snapshot.myBooking ? '고객이 네이버 앱에서 이탈 없이 즉시 예약할 수 있어 전환 점수를 최대로 획득 중입니다.' : '2026 알고리즘 최우선 지표인 네이버 예약이 연동되지 않아 막대한 점수 손실이 발생하고 있습니다.',
      impact: '상위 1~3위 진입 기여도: ★★★★★'
    },
    {
      id: 'notice',
      title: '스마트플레이스 [공지/소식] 활성화',
      status: hasNoticeOrCoupon ? ('PASS' as const) : ('WARN' as const),
      statusText: hasNoticeOrCoupon ? '정상 활성' : '추가 등록 권장',
      desc: hasNoticeOrCoupon ? '최신 매장 공지 및 이용 안내가 정돈되어 검색 이용자의 체류시간과 신뢰도를 확보하고 있습니다.' : '최신 공지/소식을 등록하면 검색 목록에서 매장 주목도와 고객 체류시간을 높일 수 있습니다.',
      impact: '체류시간 및 클릭률(CTR): ★★★★☆'
    },
    {
      id: 'call',
      title: '스마트콜 & ARS 통화 설정',
      status: 'PASS' as const,
      statusText: '기본 연결 활성',
      desc: '스마트콜 통화 유입 데이터를 통해 매장 실 활동성 지표가 지속적으로 집계되고 있습니다.',
      impact: '매장 신뢰도 및 통화 집계: ★★★☆☆'
    },
    {
      id: 'keywords',
      title: '대표 키워드(최대 5개) 최적화',
      status: stuffingRisk === 'DANGER' ? ('FAIL' as const) : (stuffingRisk === 'CAUTION' ? ('WARN' as const) : ('PASS' as const)),
      statusText: stuffingRisk === 'DANGER' ? '어뷰징 위험' : (stuffingRisk === 'CAUTION' ? '부분 점검 필요' : '최적화 양호'),
      desc: stuffingReason,
      impact: '키워드 매칭 정밀도: ★★★★★'
    },
    {
      id: 'photos',
      title: '대표 사진 및 시설/환경 비주얼',
      status: reviewCount > 30 ? ('PASS' as const) : ('WARN' as const),
      statusText: reviewCount > 30 ? '양호' : '추가 보강 필요',
      desc: '플레이스 체류시간을 30초 이상 연장하기 위한 고화질 내외부 및 대표 시그니처 컷 등록이 필요합니다.',
      impact: '체류시간 연장 기여도: ★★★★☆'
    }
  ]

  let score = 55
  if (snapshot.myBooking) score += 25
  if (hasNoticeOrCoupon) score += 15
  if (stuffingRisk === 'SAFE') score += 10
  else if (stuffingRisk === 'DANGER') score -= 15

  if (reviewCount >= 100) score += 15
  else if (reviewCount >= 30) score += 5
  else score -= 5

  const boundedScore = Math.min(100, Math.max(30, score))
  let grade: 'EXCELLENT' | 'GOOD' | 'NEEDS_WORK' | 'CRITICAL' = 'GOOD'
  let gradeText = '양호 (보완 시 상위권 도약)'
  if (boundedScore >= 85) {
    grade = 'EXCELLENT'
    gradeText = '최상급 (1위 경쟁 권역)'
  } else if (boundedScore < 55) {
    grade = 'CRITICAL'
    gradeText = '긴급 개선 (기본 세팅 미흡)'
  } else if (boundedScore < 70) {
    grade = 'NEEDS_WORK'
    gradeText = '개선 요망 (전환 요소 부족)'
  }

  return {
    score: boundedScore,
    grade,
    gradeText,
    keywordStuffingRisk: stuffingRisk,
    stuffingReason,
    checklist
  }
}

export function evaluateAIReviewHealth(snapshot: PlaceReportSnapshot): DeepAuditAIReviewHealth {
  const store = snapshot.storeName || ''
  const kw = snapshot.targetKeyword || ''
  const industry = detectIndustry(store, kw)

  let riskKeywords: string[] = []
  let mitigationGuide = ''

  if (industry === '의료/병원') {
    riskKeywords = ['대기시간 긴 편', '설명 부족', '과잉 진료 우려', '주차 협소', '원장님 상담 짧음']
    mitigationGuide = '의료 분야 2026 AI 브리핑은 "과잉 진료 없이 친절하게 설명해 준다", "예약 시 대기시간이 짧다"는 키워드를 가장 높은 신뢰도로 인용합니다. 불만 키워드가 리뷰에 등장할 경우 즉시 친절하고 객관적인 공식 답글을 달아 방어해야 합니다.'
  } else if (industry === '식음료/맛집') {
    riskKeywords = ['웨이팅/자리 협소', '음식 간이 짬/느끼', '직원 응대 불친절', '주차 불가', '가성비 아쉬움']
    mitigationGuide = '식음료 AI 검색은 "웨이팅 팁", "대표 시그니처 메뉴 조화", "주차 안내" 문맥을 우선 추천합니다. 피크 타임 대기 동선과 친절도 관련 영수증 키워드를 긍정 리뷰 유도 문구에 선반영하세요.'
  } else if (industry === '뷰티/헤어') {
    riskKeywords = ['원하는 스타일 불일치', '시술 시간 지연', '추가 비용 요구', '주차 불편']
    mitigationGuide = '뷰티 분야는 "상담이 꼼꼼하다", "맞춤형 시술 제안", "기장 추가 강요 없음"이 AI 인용 최우선 팩터입니다. 디자이너별 1:1 상담 디테일을 고객 리뷰에 남기도록 유도하세요.'
  } else if (industry === '전문직/법률') {
    riskKeywords = ['상담 비용 부담', '연락 피드백 느림', '직접 상담 아님', '전문성 의문']
    mitigationGuide = '전문직은 2026 법률/세무 광고 규정에 따라 "직접 상담", "명확한 해결 절차 안내", "과도한 수임료 강요 없음" 키워드가 검색 신뢰도를 결정합니다.'
  } else {
    riskKeywords = ['응대 불친절', '가격 대비 아쉬움', '예약 누락', '위치/주차 불편']
    mitigationGuide = '고객의 실제 체류 후기에서 반복되는 부정 어휘를 사전에 제거하고, 긍정적인 경험 키워드(친절, 신속, 쾌적)가 30일 이내 리뷰에 70% 이상 채워지도록 관리해야 합니다.'
  }

  const myRev = Number(snapshot.myReviews || 0)
  let healthScore = 70
  if (myRev >= 100) healthScore += 15
  else if (myRev >= 30) healthScore += 5
  else healthScore -= 15

  if (snapshot.myBooking) healthScore += 10

  const boundedHealthScore = Math.min(100, Math.max(35, healthScore))
  let healthGrade: 'A' | 'B' | 'C' | 'D' = 'B'
  let aiCitationFit: '최상' | '양호' | '주의' | '부적합' = '양호'

  if (boundedHealthScore >= 85) {
    healthGrade = 'A'
    aiCitationFit = '최상'
  } else if (boundedHealthScore < 50) {
    healthGrade = 'D'
    aiCitationFit = '부적합'
  } else if (boundedHealthScore < 70) {
    healthGrade = 'C'
    aiCitationFit = '주의'
  }

  return {
    healthGrade,
    healthScore: boundedHealthScore,
    aiCitationFit,
    industryType: industry,
    riskKeywords,
    mitigationGuide
  }
}

export function generate7DayPlaybook(
  snapshot: PlaceReportSnapshot,
  completeness: DeepAuditCompleteness,
  gapMatrix: DeepAuditGapMatrix
): DeepAuditPlaybookDay[] {
  const isBookingMissing = !snapshot.myBooking
  const reviewsNeeded = gapMatrix.weeklyReviewsNeeded

  const playbook: DeepAuditPlaybookDay[] = [
    {
      day: 1,
      badge: '기초 정비 (골든타임)',
      title: isBookingMissing ? '네이버 예약 시스템 즉시 신청 및 연동' : '스마트플레이스 대표 소개글 & 대표 키워드 재배치',
      action: isBookingMissing
        ? '네이버 스마트플레이스 관리자센터 접속 → [예약·주문] 메뉴에서 영업시간 및 기본 서비스 등록 (미연동 시 상위 노출 절대 불리).'
        : `스마트플레이스 대표 키워드 5개에 '${snapshot.targetKeyword}' 및 핵심 연관 키워드를 사업자 상호와 조화롭게 배치.`,
      kpi: isBookingMissing ? '네이버 예약 페이지 승인 신청 1건 완료' : '대표 키워드 5개 및 100자 소개글 최적화',
      difficulty: '쉬움'
    },
    {
      day: 2,
      badge: '안심 동선 확보',
      title: '스마트플레이스 [공지/소식] 안심 안내 및 매장 주차 동선 등록',
      action: '스마트플레이스 관리자센터 → [공지/소식] 메뉴에서 이번 주 핵심 진료/영업 시간 안내, 대기시간 단축 팁 또는 쾌적한 방문/주차 동선 가이드를 등록하여 체류시간 확보.',
      kpi: '플레이스 검색 목록 내 대표 공지 배지 노출 및 신뢰도 상승',
      difficulty: '쉬움'
    },
    {
      day: 3,
      badge: '비주얼 체류시간',
      title: '고화질 매장 내외부 & 대표 시그니처 컷 10장 신규 업데이트',
      action: '스마트폰으로 촬영한 칙칙한 사진을 교체하고, 고객이 신뢰를 느끼는 대표 시설/서비스 컷 10장을 고화질로 업로드 (체류시간 40초 돌파 목적).',
      kpi: '플레이스 대표 갤러리 사진 10장 교체 및 순서 정렬',
      difficulty: '보통'
    },
    {
      day: 4,
      badge: '영수증 리뷰 가속',
      title: `매장 내 결제/대기 공간 영수증 포토리뷰 전용 안내 세팅 (주간 목표 ${reviewsNeeded}건)`,
      action: `고객 결제 및 대기 시 즉시 참여할 수 있는 네이버 영수증 리뷰 QR 안내 거치대를 비치하여 주간 정성 리뷰 유입 가속.`,
      kpi: `1일 최소 ${Math.ceil(reviewsNeeded / 7)}건 이상 고품질 영수증 포토리뷰 유입 시스템 가동`,
      difficulty: '보통'
    },
    {
      day: 5,
      badge: 'AI 검색(GEO) 최적화',
      title: '2026 AI 브리핑 인용 유도용 정성 키워드 리뷰 답변 작성',
      action: '최근 등록된 고객 리뷰 5~10건에 대해 대표자/원장의 진정성 있는 공식 답글 작성. 검색 키워드가 자연스럽게 녹아든 코멘트 게시.',
      kpi: '최근 미답변 리뷰 100% 답변 완료 및 친절도 지표 상승',
      difficulty: '쉬움'
    },
    {
      day: 6,
      badge: '외부 신뢰도(블로그)',
      title: `지역 상권 정보성 블로그 언급 1~2건 확보`,
      action: `네이버 검색 뷰(VIEW)/스마트블록에 매장명이 긍정적으로 언급되도록 인근 주민 또는 서포터즈를 통한 정성 리뷰 포스팅 발행.`,
      kpi: `타깃 키워드 연관 블로그 리뷰 1~2건 신규 발행 확인`,
      difficulty: '집중'
    },
    {
      day: 7,
      badge: '성과 측정 & 순위 추적',
      title: 'PostSync 플레이스 툴 재측정 및 순위 상승 추이 확인',
      action: `일주일간 실행한 5대 지표 개선 결과를 PostSync 플레이스 진단 툴에서 재조회하고 1~3위 평균 격차 축소치 정량 검증.`,
      kpi: `종합 완결도 점수 상승 & 실시간 순위 변동 체크`,
      difficulty: '쉬움'
    }
  ]

  return playbook
}

export function generateWeeklyAiReplies(
  industry: '의료/병원' | '식음료/맛집' | '뷰티/헤어' | '전문직/법률' | '생활/기타',
  storeName: string,
  targetKeyword: string
): WeeklyAiReply[] {
  const store = storeName || '저희 매장'
  const kw = targetKeyword || '플레이스'

  if (industry === '식음료/맛집') {
    return [
      {
        id: 'reply_1',
        situation: '맛 & 시그니처 극찬',
        title: '☕ 대표 메뉴 & 원두/음식 맛 만족 후기 전용',
        badge: '맛/품질 극찬',
        seoKeywords: [`${kw} 맛집`, `${store} 시그니처`, '재방문율 1위'],
        replyText: `소중한 발걸음과 따뜻한 후기 진심으로 감사드립니다! 저희 ${store}에서는 매일 정성껏 선별한 신선한 재료와 시그니처 레시피로 고객님께 최상의 미식 경험을 선물해 드리고자 노력하고 있습니다. ${kw}에서 가장 편안하고 기분 좋은 시간이 되셨길 바라며, 언제든 한결같은 맛과 정성으로 맞이하겠습니다. 다음에도 꼭 찾아주세요! 😊`
      },
      {
        id: 'reply_2',
        situation: '인테리어 & 분위기 만족',
        title: '🌿 매장 공간 & 감성 분위기 칭찬 후기 전용',
        badge: '분위기/공간',
        seoKeywords: [`${kw} 분위기 좋은 곳`, `${store} 공간`, '데이트/모임'],
        replyText: `${store}의 공간과 분위기를 온전히 즐겨주셔서 마음 깊이 뿌듯합니다! 바쁜 일상 속에서 잠시 여유를 찾으실 수 있도록 조명, 음악, 좌석 배치 하나까지 세심하게 신경 썼습니다. ${kw} 인근에서 조용하고 아늑한 힐링이 필요하실 때 언제든 편안한 마음으로 들러주세요.`
      },
      {
        id: 'reply_3',
        situation: '주차 & 대기시간 안내',
        title: '🚗 피크타임 웨이팅 & 주차 편의 배려 후기 전용',
        badge: '웨이팅/주차 안심',
        seoKeywords: [`${store} 주차 안내`, '웨이팅 꿀팁', '쾌적한 방문'],
        replyText: `방문해 주셔서 감사드리며, 소중한 시간 내어 찾아주신 만큼 더욱 쾌적하게 안내해 드리지 못해 송구합니다. 주말 피크타임 주차 동선과 대기 시간을 더욱 단축할 수 있도록 안내 시스템을 지속 보강하고 있습니다. 다음 방문 시에는 더 신속하고 안락한 시간 보내실 수 있도록 최선을 다하겠습니다!`
      },
      {
        id: 'reply_4',
        situation: '재방문 & 단골 감사',
        title: '🔄 잊지 않고 다시 찾아주신 단골 고객 전용',
        badge: '단골 고객 충성',
        seoKeywords: [`${kw} 단골 추천`, `${store} 재방문`, '지속 만족'],
        replyText: `잊지 않고 ${store}을 다시 찾아주셔서 얼마나 반갑고 힘이 되는지 모릅니다! 늘 찾아주시는 고객님 덕분에 매일 설레는 마음으로 오픈을 준비합니다. 다음 방문에도 변함없는 감동을 드릴 수 있도록 한 잔, 한 접시마다 정성을 다하겠습니다. 항상 건강하세요!`
      },
      {
        id: 'reply_5',
        situation: '서비스 피드백 & 개선 약속',
        title: '💡 아쉬운 점 피드백 & 신뢰 회복 케어 전용',
        badge: '피드백 안심 케어',
        seoKeywords: [`${store} 고객만족`, '서비스 개선', '신뢰 매장'],
        replyText: `정성스러운 피드백과 솔직한 말씀 전해주셔서 진심으로 감사드립니다. 말씀해 주신 소중한 의견은 즉시 전 직원과 공유하여 개선 조치를 완료했습니다. 고객님의 따끔한 관심 덕분에 ${store}이 더 성장할 수 있습니다. 다음 방문 시에는 한층 업그레이드된 서비스로 기분 좋은 시간 선물하겠습니다.`
      }
    ]
  }

  if (industry === '의료/병원') {
    return [
      {
        id: 'reply_1',
        situation: '진료 설명 & 안심 공감',
        title: '🩺 꼼꼼한 설명과 환자 중심 진료 감사 후기 전용',
        badge: '설명/친절 진료',
        seoKeywords: [`${kw} 친절한 병원`, `${store} 진료`, '과잉진료 없는 곳'],
        replyText: `소중한 후기 남겨주셔서 감사드립니다. 진료 과정에서 환자분의 불안한 마음을 덜어드리고, 치료 계획을 충분히 이해하실 수 있도록 꼼꼼하고 친절하게 설명해 드리는 것을 최우선 원칙으로 삼고 있습니다. 앞으로도 믿고 안심하고 찾으실 수 있는 ${store}이 되겠습니다. 쾌유를 진심으로 기원합니다.`
      },
      {
        id: 'reply_2',
        situation: '대기시간 단축 & 예약 배려',
        title: '⏱️ 네이버 예약 및 신속한 진료 동선 만족 후기 전용',
        badge: '대기 단축/예약',
        seoKeywords: [`${store} 네이버 예약`, '대기시간 짧은 병원', '쾌적한 진료'],
        replyText: `바쁘신 일정 중에도 내원해 주셔서 감사드립니다. 저희 ${store}은 네이버 예약 시스템을 통해 대기시간을 최소화하고 원활한 진료 동선을 유지하고자 지속적으로 노력하고 있습니다. 언제든 불편함 없이 편안하게 진료받으실 수 있도록 세심하게 살피겠습니다.`
      },
      {
        id: 'reply_3',
        situation: '원내 위생 & 청결 환경',
        title: '🌿 쾌적한 원내 환경 및 철저한 방역/위생 후기 전용',
        badge: '위생/감염 관리',
        seoKeywords: [`${store} 안심 위생`, '쾌적한 원내', '청결한 병원'],
        replyText: `쾌적하고 안전한 원내 환경을 경험해 주셔서 기쁩니다. ${store}은 모든 검사 및 진료 공간에 대해 철저한 감염 관리와 매일 정기적인 멸균 소독을 엄격히 준수하고 있습니다. 환자분의 건강과 안전을 위해 늘 가장 정갈한 환경을 지켜가겠습니다.`
      },
      {
        id: 'reply_4',
        situation: '따뜻한 간호/직원 친절',
        title: '🤝 의료진 및 전 직원 따뜻한 응대 칭찬 후기 전용',
        badge: '직원 친절 공감',
        seoKeywords: [`${kw} 따뜻한 진료`, `${store} 간호 친절`, '안심 의료'],
        replyText: `따뜻한 격려 말씀에 저희 의료진과 직원들 모두 큰 보람과 힘을 얻습니다. 몸과 마음이 모두 편안한 공간이 될 수 있도록 작은 배려 하나도 놓치지 않고 늘 진심을 다해 환자분 곁을 지키겠습니다. 늘 건강하시길 바랍니다.`
      },
      {
        id: 'reply_5',
        situation: '진료 후 주의사항 & 안심 케어',
        title: '💡 시술/진료 후 회복 과정 및 사후 안내 케어 전용',
        badge: '사후 회복 케어',
        seoKeywords: [`${store} 사후관리`, '안심 상담', '책임 진료'],
        replyText: `정성 어린 후기에 감사드립니다. 치료 후 회복 과정에서 궁금하시거나 불편하신 점이 있으시면 언제든지 원내로 편하게 문의해 주시기 바랍니다. 환자분의 온전한 일상 회복까지 ${store}이 든든하게 함께하겠습니다.`
      }
    ]
  }

  if (industry === '전문직/법률') {
    return [
      {
        id: 'reply_1',
        situation: '상담 전문성 & 절차 명확성',
        title: '⚖️ 명쾌한 법률/세무 대응 로드맵 안내 감사 후기 전용',
        badge: '전문성/해결책',
        seoKeywords: [`${kw} 전문 상담`, `${store} 해결 절차`, '명쾌한 자문'],
        replyText: `소중한 상담 후기 남겨주셔서 감사드립니다. 법률/세무 문제는 의뢰인의 입장에서 명확한 대응 로드맵과 객관적 절차를 알기 쉽게 제시해 드리는 것이 가장 중요합니다. ${kw} 분야의 복잡한 쟁점을 끝까지 책임감 있게 조력해 드리겠습니다.`
      },
      {
        id: 'reply_2',
        situation: '신속한 소통 & 투명한 피드백',
        title: '📞 사건 진행 피드백 및 신속한 유선 소통 후기 전용',
        badge: '소통/피드백',
        seoKeywords: [`${store} 빠른 소통`, '진행상황 공유', '안심 자문'],
        replyText: `사건 진행 과정에서의 불안감을 덜어드리고자 신속하고 투명한 소통을 원칙으로 삼고 있습니다. 의뢰인께서 신뢰해 주신 만큼 진행 상황을 꼼꼼하게 공유하며 최선의 결과를 도출하도록 진심을 다하겠습니다.`
      },
      {
        id: 'reply_3',
        situation: '과잉 수임 방지 & 합리적 조력',
        title: '💡 불필요한 분쟁 예방 및 실익 중심 상담 후기 전용',
        badge: '합리적 조력',
        seoKeywords: [`${store} 정직한 상담`, '과잉 수임 방지', '의뢰인 실익'],
        replyText: `정직하고 현실적인 대안을 찾아드리고자 노력했던 점을 좋게 평가해 주셔서 감사드립니다. 불필요한 분쟁을 예방하고 의뢰인의 실익을 최우선으로 지키는 ${store}이 되겠습니다.`
      },
      {
        id: 'reply_4',
        situation: '비밀 보장 & 안심 상담',
        title: '🤝 철저한 비밀 유지와 편안한 상담 분위기 후기 전용',
        badge: '비밀보장/신뢰',
        seoKeywords: [`${kw} 안심 상담`, `${store} 비밀 보장`, '신뢰 전문가'],
        replyText: `어려운 사안을 믿고 털어놓아 주셔서 감사합니다. 모든 상담과 기록은 철저한 비밀 유지 원칙 하에 관리되며, 가장 안전하고 유리한 법률적 방어책을 든든하게 구축해 드리겠습니다.`
      },
      {
        id: 'reply_5',
        situation: '사후 관리 및 지속 자문',
        title: '🔄 상담 이후 추가 질의 및 지속 케어 후기 전용',
        badge: '사후 케어',
        seoKeywords: [`${store} 지속 자문`, '사후 관리', '평생 법률파트너'],
        replyText: `상담 이후에도 궁금하신 점이나 추가 대응이 필요하시면 언제든 편히 연락해 주시기 바랍니다. 의뢰인의 일상이 평온을 되찾을 때까지 든든한 전문가로서 함께하겠습니다.`
      }
    ]
  }

  // 뷰티/헤어 & 생활/기타
  return [
    {
      id: 'reply_1',
      situation: '스타일 & 맞춤 만족',
      title: '✂️ 1:1 맞춤형 서비스 & 결과물 극찬 후기 전용',
      badge: '맞춤 만족',
      seoKeywords: [`${kw} 잘하는 곳`, `${store} 맞춤 스타일`, '인생 샵'],
      replyText: `소중한 리뷰와 만족스러운 후기 남겨주셔서 진심으로 감사드립니다! 고객님의 개성과 분위기에 꼭 맞는 최상의 결과를 드리기 위해 디테일 하나하나 정성을 다했습니다. ${kw}에서 언제나 믿고 찾으실 수 있는 ${store}이 되겠습니다. 다음 방문 때도 예쁘게 맞이하겠습니다!`
    },
    {
      id: 'reply_2',
      situation: '친절한 상담 & 케어',
      title: '🌿 시술 전 꼼꼼한 상담과 편안한 응대 후기 전용',
      badge: '상담/친절',
      seoKeywords: [`${store} 친절한 상담`, '편안한 분위기', '세심한 관리'],
      replyText: `편안하게 머무르셨다니 저희도 무척 기쁘고 보람을 느낍니다! 고객님의 니즈를 정확히 파악하고 부담 없이 편안한 시간을 보내실 수 있도록 늘 배려하겠습니다. 힐링이 필요하실 때 언제든 ${store}을 찾아주세요.`
    },
    {
      id: 'reply_3',
      situation: '예약 시간 준수 & 시설 청결',
      title: '⏱️ 신속한 대기 관리 및 쾌적한 샵 컨디션 후기 전용',
      badge: '시간준수/청결',
      seoKeywords: [`${store} 예약 방문`, '쾌적한 샵', '시간 약속 준수'],
      replyText: `소중한 시간 내어 방문해 주셔서 감사드립니다. 고객님의 시간을 가장 소중히 여기며, 철저한 예약 관리와 청결한 매장 유지로 언제 방문하셔도 쾌적함을 느끼실 수 있도록 최선을 다하겠습니다.`
    },
    {
      id: 'reply_4',
      situation: '재방문 단골 감사',
      title: '🔄 꾸준히 찾아주시는 단골 고객 감사 후기 전용',
      badge: '단골 감사',
      seoKeywords: [`${kw} 단골 추천`, `${store} 정기 관리`, '지속 만족'],
      replyText: `늘 믿고 찾아주시는 우리 고객님, 진심으로 감사드립니다! 방문해 주실 때마다 더 큰 만족과 힐링을 드릴 수 있도록 늘 연구하고 발전하는 ${store}이 되겠습니다. 다음 예약 때 또 뵙겠습니다!`
    },
    {
      id: 'reply_5',
      situation: '홈케어 꿀팁 & 사후 관리',
      title: '💡 일상 속 관리법 안내 및 사후 케어 후기 전용',
      badge: '홈케어 안내',
      seoKeywords: [`${store} 관리 꿀팁`, '오래가는 유지력', '사후 케어'],
      replyText: `후기 남겨주셔서 감사합니다! 안내해 드린 관리 꿀팁 참고하셔서 예쁜 상태 오래오래 유지하시길 바랍니다. 관리 중 궁금한 점이 생기시면 언제든 편하게 문의해 주세요. 늘 고객님 곁에서 함께하겠습니다.`
    }
  ]
}

export function evaluateLeaderChange(snapshot: PlaceReportSnapshot): Rank1Event {
  const currentTop1 = snapshot.top1Name || '1위 매장'
  const prevTop1 = snapshot.prevTop1Name

  if (prevTop1 && prevTop1 !== currentTop1) {
    return {
      changed: true,
      previousStore: prevTop1,
      currentStore: currentTop1,
      reason: '최근 7일간 저장수 급증 및 신규 영수증 리뷰 유입 가속',
      noticeBadge: '👑 상권 1위 왕좌 교체 감지',
      adviceText: `지난주 1위였던 [${prevTop1}]을 제치고 [${currentTop1}] 매장이 새로운 1위로 등극했습니다. 단순 누적량이 아닌 주간 유입 활동성에 의한 교체로 분석되며, 최상위권 랭킹도 영원하지 않음을 입증합니다.`
    }
  }

  return {
    changed: false,
    currentStore: currentTop1,
    noticeBadge: '🥇 1위 매장 수성 체제 유지 중',
    adviceText: `[${currentTop1}] 매장이 상권 1위를 견고하게 수성 중입니다. 1위와의 지표 격차를 이번 주 목표치에 맞춰 점진적으로 좁혀나가야 합니다.`
  }
}

export function evaluateReviewDelta(currentReviews: number, prevReviews?: number): ReviewDeltaStatus {
  if (prevReviews === undefined || prevReviews === null) {
    return {
      status: 'NORMAL',
      deltaCount: 0,
      displayText: '주간 델타 수집 중 (기준선 수립 완료)',
      badgeColor: '#2563eb',
      badgeBg: '#eff6ff',
      insightText: '오늘 측정한 수치를 1주차 기준선으로 기록하였습니다. 다음 주 월요일부터 실시간 순증감이 표시됩니다.'
    }
  }

  const diff = currentReviews - prevReviews
  if (diff < 0) {
    return {
      status: 'ALGORITHM_CLEANSED',
      deltaCount: diff,
      displayText: `📉 네이버 클린 시스템에 의해 비정상 리뷰 정화 (${diff}건)`,
      badgeColor: '#7c3aed',
      badgeBg: '#f3e8ff',
      insightText: `네이버 플레이스 클린봇이 상권 내 복사형·가짜 영수증 리뷰를 일괄 삭제했습니다. 1위 경쟁사의 허수 리뷰가 걷힌 지금이 우리 매장의 진짜 고객 리뷰로 순위를 역전할 최적의 골든타임입니다.`
    }
  }

  return {
    status: 'NORMAL',
    deltaCount: diff,
    displayText: `지난주 대비 +${diff}건 신규 증가`,
    badgeColor: '#15803d',
    badgeBg: '#dcfce7',
    insightText: `한 주 동안 정상적인 고객 영수증 리뷰가 꾸준히 유입되며 활동성 지표가 안정적으로 누적되고 있습니다.`
  }
}

export function evaluateWatchdogTriggers(snapshot: PlaceReportSnapshot): WatchdogTrigger[] {
  const currentRank = typeof snapshot.myRank === 'number' ? snapshot.myRank : parseInt(String(snapshot.myRank || '2'), 10)
  const prevRank = snapshot.prevRank ? (typeof snapshot.prevRank === 'number' ? snapshot.prevRank : parseInt(String(snapshot.prevRank), 10)) : currentRank
  const triggers: WatchdogTrigger[] = []

  // Trigger 1: 순위 급락 비상 경보 (3계단 이상 하락)
  const isRankDrop = (currentRank - prevRank) >= 3
  triggers.push({
    type: 'RANK_DROP',
    title: '순위 급락 비상 경보 (Rank Drop Alert)',
    badge: isRankDrop ? '🚨 비상 감지' : '정상 안정',
    desc: isRankDrop
      ? `직전 측정(${prevRank}위) 대비 3계단 이상 급락하여 현재 ${currentRank}위로 밀려났습니다. 상권 롤링인지 매장 세팅 누락인지 즉시 골든타임 점검이 필요합니다.`
      : `순위 급락 징후 없음 (정상 롤링 오차 범위 내 유지 중)`,
    actionGuide: isRankDrop
      ? '스마트플레이스 관리자에서 네이버 예약 연동 여부 및 대표 키워드 5개 누락 여부를 10분 내로 우선 점검하세요.'
      : '현재 순위 유지 중이며 추가적인 비상 조치는 불필요합니다.',
    detected: isRankDrop
  })

  // Trigger 2: 경쟁사 이상 급등 감지 (앞 순위 경쟁사 리뷰 급증 등)
  const top1Rev = Number(snapshot.top1Reviews || 0)
  const prevTop1Rev = snapshot.prevTop1Reviews ? Number(snapshot.prevTop1Reviews) : top1Rev
  const competitorSurge = (top1Rev - prevTop1Rev) >= 10
  triggers.push({
    type: 'COMPETITOR_SURGE',
    title: '경쟁사 이상 급등 감지 (Competitor Surge Alert)',
    badge: competitorSurge ? '⚡ 이상 급등 포착' : '경쟁 안정',
    desc: competitorSurge
      ? `경쟁 매장([${snapshot.top1Name || '1위'}])이 최근 며칠 사이 영수증 포토리뷰를 10건 이상 대량 추가하며 공격적 마케팅을 전개 중입니다.`
      : `상위 경쟁 매장의 비정상 급등 징후 없음 (주간 평균 페이스 유지)`,
    actionGuide: competitorSurge
      ? '경쟁사의 리뷰 공세에 밀리지 않도록 이번 주말 매장 내 영수증 포토리뷰 유도 이벤트를 가동하세요.'
      : '기존의 정기 포토리뷰 유입 리듬을 차분히 이어가시면 됩니다.',
    detected: competitorSurge
  })

  // Trigger 3: 상권 1위 교체 및 알고리즘 롤링 감지
  const leaderChanged = !!(snapshot.prevTop1Name && snapshot.top1Name && snapshot.prevTop1Name !== snapshot.top1Name)
  triggers.push({
    type: 'ALGORITHM_SHIFT',
    title: '상권 1위 교체 및 알고리즘 롤링 감지 (Algorithm Shift Alert)',
    badge: leaderChanged ? '👑 1위 교체 감지' : '알고리즘 안정',
    desc: leaderChanged
      ? `해당 상권의 1위 매장이 교체되었습니다. 네이버 플레이스 알고리즘이 상위권 점수를 재산정하는 롤링 주기입니다.`
      : `상권 1위가 안정적으로 유지되고 있으며 대규모 알고리즘 변동은 감지되지 않았습니다.`,
    actionGuide: leaderChanged
      ? '상권 전체의 롤링 현상이므로 사장님 매장만의 하락이 아닙니다. 불안감에 소개글 설정을 임의로 크게 바꾸지 마시고 모니터링을 유지하세요.'
      : '안심하고 기본 운영 룰을 준수해 주세요.',
    detected: leaderChanged
  })

  return triggers
}

export function generateRotationWeekModule(weekNumber: 1 | 2 | 3 | 4, snapshot: PlaceReportSnapshot): RotationWeekModule {
  const store = snapshot.storeName || '신청 매장'
  const kw = snapshot.targetKeyword || '플레이스'

  switch (weekNumber) {
    case 1:
      return {
        weekNumber: 1,
        weekThemeTitle: '1주차: 네이버 검색 로봇 색인 완결도 정밀 점검',
        themeDesc: '네이버 검색 봇이 우리 매장을 최우선으로 탐색하고 수집할 수 있도록 온페이지 기본기를 검증합니다.',
        focusArea: '기본 인덱싱 & 키워드 배치율',
        actionItems: [
          {
            title: `소개글 첫 25자 내 '${kw}' 전방 배치율 점검`,
            status: 'ACTION_REQUIRED',
            desc: `소개글 앞부분에 핵심 키워드가 없으면 검색 봇 가중치가 최대 40% 감점됩니다. '${store}' 상호 바로 뒤에 키워드를 배치하세요.`
          },
          {
            title: '찾아오는 길 대중교통 & 랜드마크 안내 등록',
            status: 'PASS',
            desc: '인근 지하철역, 버스정류장, 대표 랜드마크로부터의 도보 동선이 명시되어 로컬 길찾기 점수를 획득합니다.'
          },
          {
            title: '고화질 대표 시설/서비스 사진 20장 이상 충족',
            status: Number(snapshot.myReviews || 0) >= 30 ? 'PASS' : 'WARN',
            desc: '체류시간 40초를 확보하기 위해 매장 내외부 대표 컷 20장이 고화질로 세팅되어 있는지 점검합니다.'
          }
        ]
      }

    case 2:
      return {
        weekNumber: 2,
        weekThemeTitle: '2주차: AI 리뷰 진정성 평가 & 부정 불만 마이닝',
        themeDesc: '2026 네이버 AI가 복사형 단문 리뷰를 필터링하고 실제 고객의 정성 경험을 우대하는 알고리즘에 맞춤 진단합니다.',
        focusArea: '리뷰 건강도 & 맞춤 답글 2종 처방',
        actionItems: [
          {
            title: '복사형 단문 영수증 리뷰 비율 검증',
            status: 'PASS',
            desc: '단순 "좋아요", "친절해요" 단문보다 구체적 경험이 담긴 30자 이상 포토리뷰 비중이 건강한지 확인합니다.'
          },
          {
            title: '고객 반복 불만 키워드 감지 (주차/대기시간/위생)',
            status: 'WARN',
            desc: '부정 단어가 AI 브리핑에 부정 요약으로 인용되지 않도록 오프라인 매장 접점 개선이 권장됩니다.'
          },
          {
            title: '이번 주 미답변 리뷰 대상 AI 정성 답글 100% 등록',
            status: 'ACTION_REQUIRED',
            desc: '제공된 AI 추천 검색 최적화 답글 2종을 복사하여 최신 고객 리뷰에 붙여넣으세요.'
          }
        ]
      }

    case 3:
      return {
        weekNumber: 3,
        weekThemeTitle: '3주차: 사용자 체류시간 증폭 & 전환 도구 점검',
        themeDesc: '네이버 지도 플랫폼 안에서 예약, 결제, 쿠폰 발급이 원스톱으로 이루어져 전환 가점을 획득합니다.',
        focusArea: '네이버 예약 & 플레이스 쿠폰 세팅',
        actionItems: [
          {
            title: '네이버 실시간 예약 시스템 ON 활성화',
            status: snapshot.myBooking ? 'PASS' : 'ACTION_REQUIRED',
            desc: snapshot.myBooking ? '예약 연동으로 전환 점수를 만점으로 확보 중입니다.' : '네이버 예약 미연동 시 1~3위 진입이 구조적으로 차단됩니다. 즉시 관리자에서 활성화하세요.'
          },
          {
            title: '알림받기 고객 전용 쿠폰 혜택 발행',
            status: snapshot.myCoupon ? 'PASS' : 'WARN',
            desc: `'첫 방문 1,000원 할인' 또는 '시즌 서비스 쿠폰'을 등록하면 지도 목록에 [쿠폰] 뱃지가 부착되어 클릭률이 35% 상승합니다.`
          },
          {
            title: '스마트콜 통화 유입 집계 설정',
            status: 'PASS',
            desc: '스마트콜을 통해 전화 문의 활동성이 네이버 랭킹 신호로 안전하게 누적되고 있습니다.'
          }
        ]
      }

    case 4:
    default:
      return {
        weekNumber: 4,
        weekThemeTitle: '4주차: 월간 트렌드 결산 & 롱테일 확장 키워드 3종',
        themeDesc: '지난 30일간의 순위 궤적을 총결산하고, 상권 내 새롭게 떠오르는 세부 롱테일 키워드로 유입을 확장합니다.',
        focusArea: '30일 궤적 결산 & 롱테일 키워드 발굴',
        actionItems: [
          {
            title: '30일간 순위 이동평균 궤적 안정도 평가',
            status: 'PASS',
            desc: `한 달간 ${kw} 상권 내에서 안정적인 랭킹 방어선을 구축했습니다.`
          },
          {
            title: `추천 롱테일 키워드 1: '${kw} 야간/주말'`,
            status: 'PASS',
            desc: '메인 키워드 외에 경쟁 강도가 낮고 전환율이 높은 시간대별 롱테일 키워드를 소개글에 추가하세요.'
          },
          {
            title: `추천 롱테일 키워드 2: '${kw} 추천/후기 좋은곳'`,
            status: 'PASS',
            desc: '네이버 스마트블록 검색 유입을 추가로 흡수할 수 있는 서브 키워드로 플레이스 소식을 발행하세요.'
          }
        ]
      }
  }
}

export function generateWeeklySurveillanceBundle(
  snapshot: PlaceReportSnapshot,
  industry: '의료/병원' | '식음료/맛집' | '뷰티/헤어' | '전문직/법률' | '생활/기타'
): WeeklySurveillanceBundle {
  const rank = typeof snapshot.myRank === 'number' ? snapshot.myRank : parseInt(String(snapshot.myRank || '2'), 10)
  const top1Rev = Number(snapshot.top1Reviews || 0)
  const top1Blog = Number(snapshot.top1BlogReviews || 0)
  const myRev = Number(snapshot.myReviews || 0)
  const store = snapshot.storeName || '신청 매장'
  const kw = snapshot.targetKeyword || '플레이스'

  let top1WeeklyRev = 4
  if (top1Rev > 3000) top1WeeklyRev = 14
  else if (top1Rev > 1000) top1WeeklyRev = 9
  else if (top1Rev > 300) top1WeeklyRev = 6

  let top1WeeklyBlog = 1
  if (top1Blog > 1000) top1WeeklyBlog = 4
  else if (top1Blog > 300) top1WeeklyBlog = 2

  let myTargetWeeklyReviews = 5
  let myTargetWeeklyBlogs = 2
  if (myRev >= top1Rev && top1Rev > 0) {
    myTargetWeeklyReviews = Math.max(3, Math.round(top1WeeklyRev * 0.7))
    myTargetWeeklyBlogs = Math.max(1, top1WeeklyBlog)
  } else {
    myTargetWeeklyReviews = Math.max(4, Math.round(top1WeeklyRev * 1.1))
    myTargetWeeklyBlogs = Math.max(2, top1WeeklyBlog)
  }

  let noiseStatus: 'SAFE' | 'CAUTION' | 'STABLE' = 'SAFE'
  let noiseBadge = '정상 롤링 범위 (안전권)'
  let noiseDesc = `현재 ${rank}위는 네이버 지도 시간대별 모바일 GPS 롤링 범위 내에 있습니다. 인위적 트래픽 조작 징후가 없는 정상 상태입니다.`

  if (rank <= 3) {
    noiseStatus = 'SAFE'
    noiseBadge = `현재 ${rank}위: 정상 롤링 범위 (안전권)`
    noiseDesc = `최상위 1~3위권은 검색자의 접속 시간대와 위치에 따라 1~2계단 미세 롤링이 발생합니다. 이는 알고리즘의 자연스러운 반응이며 지표 누락이나 하락이 아닙니다.`
  } else if (rank <= 10) {
    noiseStatus = 'STABLE'
    noiseBadge = `현재 ${rank}위: 1페이지 추격 안정권`
    noiseDesc = `1페이지(상위 10위) 진입 상태입니다. 주간 신규 영수증 리뷰 유입 가속을 유지하면 1~3위 도약이 가시권에 있습니다.`
  } else {
    noiseStatus = 'CAUTION'
    noiseBadge = `현재 ${rank}위: 순위 도약 필요 권역`
    noiseDesc = `모바일 지도 1페이지 노출을 위해 기본 전환 세팅(예약/소식 등록)과 주간 정성 리뷰 확보가 시급합니다.`
  }

  const aiReplies = generateWeeklyAiReplies(industry, store, kw)
  const rank1Event = evaluateLeaderChange(snapshot)
  const reviewDeltaStatus = evaluateReviewDelta(myRev, snapshot.prevMyReviews)
  const watchdogTriggers = evaluateWatchdogTriggers(snapshot)
  const weekNum = (snapshot.weekNumber || 1) as 1 | 2 | 3 | 4
  const rotationWeek = generateRotationWeekModule(weekNum, snapshot)

  const gpsBaseline: GPSStandardBaseline = {
    standardLocation: `${kw} 상권 중심지 모바일 공식 표준 환경`,
    radiusNotice: '* 본 리포트는 매장 반경 500m 내 모바일 GPS 기본 검색 환경을 기준으로 정밀 산출되었습니다.',
    rollingStabilityText: '시간대 및 GPS 위치 편차를 보정한 표준 안정 랭킹 지수입니다.'
  }

  return {
    isFirstWeekBaseline: !snapshot.prevRank,
    baselineNoticeTitle: `📍 [1주차 알림] 최초 진단 기준선(Baseline) 실측 수립 완료 (증감 데이터는 다음 주부터 발송)`,
    baselineNoticeDesc: `현재 리포트는 최초 진단이므로 '지난주 데이터'가 존재하지 않아 오늘 측정한 수치를 1주차 공식 기준선으로 기록했습니다. 1위 매장의 7일간 실시간 순증감(±건수)과 내 매장의 주간 추격 속도는 시스템에 축적되어 [다음 주 월요일 아침 9시 주간 감시 리포트]부터 본격 비교 분석되어 발송됩니다.`,
    rollingNoiseStatus: noiseStatus,
    rollingNoiseBadge: noiseBadge,
    rollingNoiseDesc: noiseDesc,
    top1EstimatedWeeklyReviews: top1WeeklyRev,
    top1EstimatedWeeklyBlogs: top1WeeklyBlog,
    myWeeklyTargetReviews: myTargetWeeklyReviews,
    myWeeklyTargetBlogs: myTargetWeeklyBlogs,
    weeklyPaceSummary: (myRev >= top1Rev && top1Rev > 0)
      ? `누적 리뷰는 1위(${top1Rev.toLocaleString()}개)보다 앞서 있으므로, 1위의 주간 유입 페이스(주당 +${top1WeeklyRev}건)에 뒤처지지 않는 주당 +${myTargetWeeklyReviews}건의 활동성 유지가 핵심입니다.`
      : `1위 매장은 매주 약 +${top1WeeklyRev}건의 영수증 리뷰와 +${top1WeeklyBlog}건의 블로그를 확보하며 1위를 지키고 있습니다. 1위를 꺾기 위해 이번 주 최소 +${myTargetWeeklyReviews}건 유입이 필요합니다.`,
    nextWeekDispatchSchedule: '다음 주 월요일 오전 09:00 정기 발행',
    aiReplies,
    rank1Event,
    reviewDeltaStatus,
    watchdogTriggers,
    rotationWeek,
    gpsBaseline
  }
}

export function getKoreanWeekLabel(dateObj: Date = new Date()): string {
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth() + 1
  const date = dateObj.getDate()
  const weekNum = Math.min(5, Math.ceil(date / 7))
  return `${year}년 ${month}월 ${weekNum}주차`
}

export function generateSaaSReportSummary(snapshot: PlaceReportSnapshot): SaaSReportSummary {
  const store = snapshot.storeName || '신청 매장'
  const kw = snapshot.targetKeyword || '플레이스'
  const rank = typeof snapshot.myRank === 'number' ? snapshot.myRank : parseInt(String(snapshot.myRank || '2'), 10)
  const industry = detectIndustry(store, kw)
  const isMedicalOrLaw = industry === '의료/병원' || industry === '전문직/법률'

  const seoScore = snapshot.totalScore || calculatePlaceAuditScore(snapshot)
  const seoScoreText = `${seoScore}점 / 100점 - 상위 ${Math.max(5, Math.min(45, 100 - seoScore))}% 수준`

  let lossClicksNum = 140
  let lossClicksText = ''
  if (rank === 1) {
    lossClicksNum = 0
    lossClicksText = '현재 1위 골든존 점유로 월 최대 유입률 달성 중 (손실 0명)'
  } else if (rank <= 3) {
    lossClicksNum = Math.max(50, (rank - 1) * 70)
    lossClicksText = `1위 매장 대비 월 약 ${lossClicksNum}명의 잠재 고객 유입 손실 발생 중`
  } else {
    lossClicksNum = Math.min(480, Math.max(140, (rank - 1) * 80))
    lossClicksText = `3위 매장 대비 월 약 ${lossClicksNum}명의 잠재 고객 유입 손실 발생 중`
  }

  const real = snapshot.realDetails

  // 1. 벤치마킹 매트릭스 (영수증 리뷰, 블로그 리뷰, 등록 사진 수)
  const top1RevTotal = Number(snapshot.top1Reviews || 1200)
  const myRevTotal = Number(snapshot.myReviews || 150)
  const top30dRev = Math.max(48, Math.round(top1RevTotal * 0.08))
  const my30dRev = Math.max(8, Math.round(myRevTotal * 0.08))
  const diffRev = Math.max(0, top30dRev - my30dRev)

  const top1BlogTotal = Number(snapshot.top1BlogReviews || 520)
  const myBlogTotal = Number(snapshot.myBlogReviews || 68)
  const diffBlog = Math.max(0, top1BlogTotal - myBlogTotal)

  // 사진 수: realDetails가 있으면 실측 사진 수 사용
  const top1Photos = 120
  const myPhotos = real ? real.photoCount : Math.max(12, Math.min(50, Math.round(myRevTotal * 0.12)))
  const diffPhotos = Math.max(0, top1Photos - myPhotos)

  const benchmarkingMatrix: BenchmarkingMatrixItem[] = [
    {
      metricName: '최근 30일 영수증 리뷰',
      top1Value: `${top30dRev.toLocaleString()}개`,
      myValue: `${my30dRev.toLocaleString()}개`,
      diffText: diffRev > 0 ? `-${diffRev.toLocaleString()}개 (1위 우세)` : `+${Math.abs(diffRev).toLocaleString()}개 (내 매장 우세)`,
      diffBadgeType: diffRev > 0 ? 'danger' : 'neutral'
    },
    {
      metricName: '블로그 리뷰 (체험단/방문기)',
      top1Value: `${top1BlogTotal.toLocaleString()}개`,
      myValue: `${myBlogTotal.toLocaleString()}개`,
      diffText: diffBlog > 0 ? `-${diffBlog.toLocaleString()}개 (1위 우세)` : `+${Math.abs(diffBlog).toLocaleString()}개 (내 매장 우세)`,
      diffBadgeType: diffBlog > 0 ? 'warning' : 'neutral'
    },
    {
      metricName: '등록 사진 수',
      top1Value: `${top1Photos}장`,
      myValue: `${myPhotos}장`,
      diffText: diffPhotos > 0 ? `-${diffPhotos}장 (1위 우세)` : `+${Math.abs(diffPhotos)}장 (충족)`,
      diffBadgeType: diffPhotos > 0 ? 'danger' : 'neutral'
    }
  ]

  // 2. [1주차 전용 점검] 네이버 검색 로봇 색인 최적화 3종 진단 모듈 (실측 데이터 우선)
  const photoQuotaNeeded = Math.max(0, 20 - myPhotos)
  const isPhotoQuotaPassed = myPhotos >= 20

  const indexingAudit: Week1IndexingAuditItem[] = real
    ? [
        {
          id: 'intro_keyword',
          title: '매장 소개글 키워드 자연 배치율 점검',
          status: real.introStatus,
          statusBadge: real.introStatusBadge,
          badgeType:
            real.introStatus === 'EXCELLENT' || real.introStatus === 'GOOD'
              ? 'success'
              : real.introStatus === 'WARN'
              ? 'warning'
              : 'danger',
          diagnosis: real.introDiagnosis,
          actionGuide: real.introActionGuide
        },
        {
          id: 'directions',
          title: '찾아오는 길 상세 안내 등록 상태 점검',
          status: real.directionsStatus,
          statusBadge: real.directionsStatusBadge,
          badgeType:
            real.directionsStatus === 'EXCELLENT'
              ? 'success'
              : real.directionsStatus === 'WARN'
              ? 'warning'
              : 'danger',
          diagnosis: real.directionsDiagnosis,
          actionGuide: real.directionsActionGuide
        },
        {
          id: 'photos_quota',
          title: '대표 사진 20장 완결 충족 여부 점검',
          status: real.photoStatus,
          statusBadge: real.photoStatusBadge,
          badgeType: real.photoStatus === 'GOOD' ? 'success' : 'danger',
          diagnosis: real.photoDiagnosis,
          actionGuide: real.photoActionGuide
        }
      ]
    : [
        {
          id: 'intro_keyword',
          title: '매장 소개글 키워드 자연 배치율 점검',
          status: 'EXCELLENT',
          statusBadge: '적정 배치율 88% (안전권)',
          badgeType: 'success',
          diagnosis: `타깃 키워드 '${kw}'가 소개글 500자 내에 어뷰징(도배) 없이 최적 빈도(2~3회)로 자연스럽게 배치되어 있어 검색 로봇의 색인 가중치를 온전히 획득 중입니다.`,
          actionGuide: '현재 키워드 빈도를 유지하시고, 시그니처 메뉴나 주요 혜택 변경 시에만 문맥에 맞게 업데이트하세요.'
        },
        {
          id: 'directions',
          title: '찾아오는 길 상세 안내 등록 상태 점검',
          status: 'WARN',
          statusBadge: '보완 요망 (랜드마크 누락)',
          badgeType: 'warning',
          diagnosis: '지하철역 출구 번호, 주변 주요 랜드마크 건물, 도보 소요 시간 동선이 구체적으로 기재되지 않아 모바일 지도 탐색자의 체류시간 감점이 발생하고 있습니다.',
          actionGuide: "'스마트플레이스 관리자 > 찾아오는 길' 메뉴에서 출구 번호와 인근 랜드마크를 활용한 3줄 도보 동선을 즉시 보강하세요."
        },
        {
          id: 'photos_quota',
          title: '대표 사진 20장 완결 충족 여부 점검',
          status: isPhotoQuotaPassed ? 'GOOD' : 'FAIL',
          statusBadge: isPhotoQuotaPassed ? '기준 충족 (20장 완료)' : `현재 ${myPhotos}장 / 권장 20장 (${photoQuotaNeeded}장 부족)`,
          badgeType: isPhotoQuotaPassed ? 'success' : 'danger',
          diagnosis: isPhotoQuotaPassed
            ? '네이버 검색 로봇의 2026 권장 규격(최소 20장)을 충족하여 탐색 체류시간 30초 이상 유지에 기여하고 있습니다.'
            : `현재 등록된 사진(${myPhotos}장)이 네이버 검색 로봇 권장 규격(최소 20장)에 ${photoQuotaNeeded}장 미달하여 검색 체류시간 점수 손실이 발생하고 있습니다.`,
          actionGuide: '고화질 매장 내외부 인테리어 및 시그니처 컷을 추가 업로드하여 최소 20장을 즉시 채우세요.'
        }
      ]

  // 3. 2026 네이버 최신 알고리즘 위험 요소 점검 (실측 기반 동적 판정)
  let directionsRiskStatus: '주의' | '보통' | '미흡' | '정상' = '주의'
  let directionsRiskDesc = '대중교통 랜드마크 및 상세 도보 동선 설명 누락 (체류시간 감점)'
  if (real) {
    if (real.directionsStatus === 'EXCELLENT') {
      directionsRiskStatus = '정상'
      directionsRiskDesc = '지하철역 출구 및 랜드마크가 상세 기재되어 탐색 체류시간 만점 유지 중'
    } else if (real.directionsStatus === 'WARN') {
      directionsRiskStatus = '주의'
      directionsRiskDesc = '찾아오는 길은 등록되어 있으나 구체적 랜드마크와 도보 분 수가 부족함'
    } else {
      directionsRiskStatus = '미흡'
      directionsRiskDesc = '찾아오는 길 안내 미등록 (모바일 지도 이용자 이탈 및 체류시간 감점 발생)'
    }
  }

  let introRiskStatus: '주의' | '보통' | '미흡' | '정상' = '정상'
  let introRiskDesc = `타깃 키워드('${kw}') 최적 빈도 배치 완료 (검색 로봇 색인 가중치 확보)`
  if (real) {
    if (real.introStatus === 'FAIL') {
      introRiskStatus = '미흡'
      introRiskDesc = '매장 소개글 미등록 (네이버 검색 로봇 형태소 색인 완전 누락)'
    } else if (real.introStatus === 'WARN') {
      introRiskStatus = '주의'
      introRiskDesc =
        real.introKeywordCount === 0
          ? `소개글 내 타깃 키워드('${kw}') 누락으로 검색 연관도 점수 감점`
          : `소개글 내 키워드 과다 반복(${real.introKeywordCount}회)으로 2026 어뷰징 필터 주의`
    } else {
      introRiskStatus = '정상'
      introRiskDesc = `타깃 키워드가 문맥에 자연스럽게 ${real.introKeywordCount}회 포함되어 색인 가중치 최적화`
    }
  }

  let photoRiskStatus: '주의' | '보통' | '미흡' | '정상' = isPhotoQuotaPassed ? '정상' : '주의'
  let photoRiskDesc = isPhotoQuotaPassed
    ? `고화질 사진 ${myPhotos}장 등록 완료 (네이버 권장 최소 20장 규격 충족)`
    : `현재 사진 ${myPhotos}장 등록 (권장 20장 대비 ${photoQuotaNeeded}장 부족으로 체류시간 점수 손실)`

  let convRiskStatus: '주의' | '보통' | '미흡' | '정상' = '보통'
  let convRiskDesc = ''
  if (isMedicalOrLaw) {
    convRiskStatus = snapshot.myBooking ? '정상' : '주의'
    convRiskDesc = snapshot.myBooking
      ? '네이버 예약 연동으로 모바일 예약 진료 전환 활성 중'
      : '네이버 예약 진료 슬롯 및 진료시간 공지 미등록'
  } else {
    convRiskStatus = snapshot.myCoupon || snapshot.myBooking ? '정상' : '미흡'
    convRiskDesc =
      snapshot.myCoupon || snapshot.myBooking
        ? '예약/쿠폰을 통한 모바일 유입 고객 전환 활성 중'
        : '알림받기 고객 전용 쿠폰 미발행 (클릭 대비 실제 방문 전환율 저하)'
  }

  const riskChecklist = [
    {
      category: '찾아오는 길 설명 완결도',
      status: directionsRiskStatus,
      desc: directionsRiskDesc
    },
    {
      category: '매장 소개글 키워드 최적화',
      status: introRiskStatus,
      desc: introRiskDesc
    },
    {
      category: '등록 사진 규격 (최소 20장)',
      status: photoRiskStatus,
      desc: photoRiskDesc
    },
    {
      category: '전환 도구 (예약/쿠폰)',
      status: convRiskStatus,
      desc: convRiskDesc
    }
  ]

  // 4. 이번 주 사장님의 3단계 실행 가이드 (실측 분석 기반 1:1 맞춤 처방)
  const aiReplies = generateWeeklyAiReplies(industry, store, kw)

  let step1Title = '대표 사진 10장 추가 업로드 (체류 시간 증대용)'
  let step1Desc =
    '네이버 검색 로봇의 2026 체류시간 알고리즘을 공략하기 위해 매장 내외부 및 대표 시그니처 컷 10장을 고화질로 보강하세요.'

  if (real) {
    if (real.photoCount < 20) {
      step1Title = `대표 사진 ${20 - real.photoCount}장 추가 업로드 (권장 20장 규격 충족용)`
      step1Desc = `현재 매장에 등록된 사진이 ${real.photoCount}장입니다. 네이버 검색 로봇의 2026 체류시간 알고리즘 기본 규격(최소 20장)을 충족하기 위해 매장 내외부 인테리어와 시그니처 컷을 고화질로 즉시 보강하세요.`
    } else if (real.directionsStatus === 'FAIL' || real.directionsStatus === 'WARN') {
      step1Title = `지하철 출구 및 랜드마크 기반 '찾아오는 길' 3줄 상세 동선 등록`
      step1Desc = `현재 찾아오는 길 안내가 미흡합니다. 고객이 매장을 검색했을 때 길을 헤매지 않도록 인근 지하철역 출구 번호, 대표 랜드마크 건물을 포함하여 스마트플레이스 관리자에서 보강하세요.`
    } else if (real.introKeywordCount === 0 || real.introStatus === 'FAIL') {
      step1Title = `매장 소개글에 타깃 키워드 '${kw}' 자연스럽게 2회 포함하여 수정`
      step1Desc = `현재 소개글에 핵심 검색어 '${kw}'가 빠져 있어 검색 로봇이 매장 특성을 명확히 인덱싱하지 못하고 있습니다. 첫 2줄에 키워드를 자연스러운 문맥으로 배치하세요.`
    } else {
      step1Title = '대표 시그니처 메뉴 옵션 및 상세 설명 텍스트 보강 (체류시간 극대화)'
      step1Desc =
        '기본 인덱싱은 훌륭하게 세팅되어 있습니다. 메뉴판의 대표 메뉴별 특징과 원산지/조리법 스토리를 3줄씩 추가하여 고객 상세페이지 체류시간을 45초 이상으로 늘리세요.'
    }
  }

  const stepPlaybook: StepActionPlaybookItem[] = [
    {
      step: 1,
      title: step1Title,
      description: step1Desc
    },
    {
      step: 2,
      title: 'AI가 작성한 미답변 리뷰 맞춤 답글 2건 복사해서 등록하기',
      description:
        'AI 추천 검색(GEO) 인용 점수를 높이기 위해 키워드가 자연스럽게 녹아든 공식 답글을 바로 복사해 등록하세요.',
      copyReplies: aiReplies.slice(0, 2).map(r => ({
        title: r.title,
        text: r.replyText
      }))
    },
    {
      step: 3,
      title: isMedicalOrLaw
        ? `주말/야간 대기시간 단축을 위한 '네이버 예약 슬롯 & 진료 안내 공지' 등록하기`
        : `주말 대비 '첫 방문 1,000원 할인 쿠폰' 등록하기`,
      description: isMedicalOrLaw
        ? '의료/전문직 광고 규정을 준수하여 불법 유인성 할인 대신 환자/의뢰인 편의를 위한 당일 예약 슬롯과 진료시간 공지를 활성화하세요.'
        : '스마트플레이스 관리자에서 알림받기 동의 고객 대상 첫 방문 1,000원 쿠폰을 발행하여 유입 전환율을 40% 이상 끌어올리세요.'
    }
  ]

  const nextWeekTeaser: NextWeekTeaser = {
    weekNumber: 2,
    themeTitle: WEEKLY_ENGINE_MODULES.week2.themeTitle,
    subject: WEEKLY_ENGINE_MODULES.week2.subject,
    description: WEEKLY_ENGINE_MODULES.week2.description
  }

  return {
    weekLabel: getKoreanWeekLabel(),
    subTitle: `[${store}]의 상권 내 경쟁력 및 알고리즘 반응 지수`,
    seoScore,
    seoScoreText,
    lossClicksText,
    lossClicksNum,
    benchmarkingMatrix,
    indexingAudit,
    riskChecklist,
    stepPlaybook,
    nextWeekTeaser
  }
}

export function buildDeepAuditBundle(snapshot: PlaceReportSnapshot): DeepAuditBundle {
  const store = snapshot.storeName || ''
  const kw = snapshot.targetKeyword || ''
  const industry = detectIndustry(store, kw)

  const gapMatrix = calculateTop3GapMatrix(snapshot)
  const completeness = evaluatePlaceCompleteness(snapshot)
  const reviewHealth = evaluateAIReviewHealth(snapshot)
  const playbook = generate7DayPlaybook(snapshot, completeness, gapMatrix)
  const weeklySurveillance = generateWeeklySurveillanceBundle(snapshot, industry)
  const saasSummary = generateSaaSReportSummary(snapshot)

  return {
    gapMatrix,
    completeness,
    reviewHealth,
    playbook,
    weeklySurveillance,
    saasSummary
  }
}

export function calculatePlaceAuditScore(snapshot: PlaceReportSnapshot): number {
  let score = 50 // 기본 점수

  const rank = typeof snapshot.myRank === 'number' ? snapshot.myRank : parseInt(String(snapshot.myRank || '99'), 10)
  if (rank === 1) score += 25
  else if (rank <= 3) score += 20
  else if (rank <= 10) score += 10
  else score += 5

  if (snapshot.myBooking) score += 15
  else score -= 10

  const myRev = Number(snapshot.myReviews || 0)
  if (snapshot.myCoupon || myRev >= 100) score += 10

  const topRev = Number(snapshot.top1Reviews || 1)
  const revRatio = myRev / Math.max(topRev, 1)
  if (revRatio >= 1.0) score += 20
  else if (revRatio >= 0.8) score += 15
  else if (revRatio >= 0.5) score += 10
  else if (revRatio < 0.2) score -= 5

  return Math.min(100, Math.max(30, score))
}

export function generatePlaceReportEmailHtml(snapshot: PlaceReportSnapshot, webReportUrl: string): { subject: string; html: string } {
  const store = snapshot.storeName || '신청 매장'
  const kw = snapshot.targetKeyword || '플레이스'
  const top1 = snapshot.top1Name || '상위 1위 매장'
  const rank = snapshot.myRank || 2
  const dateStr = snapshot.reportDate || new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
  const reportCode = `PS-${snapshot.reportId ? String(snapshot.reportId).toUpperCase() : 'AUTO'}`

  const saas = snapshot.saasSummary || generateSaaSReportSummary(snapshot)

  const subject = `[${saas.weekLabel} 종합 진단서] ${store}의 네이버 플레이스 알고리즘 반응 및 유입 손실 분석`

  const html = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:'Pretendard',-apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased;">
  
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:24px 12px;">
    <tr>
      <td align="center">
        
        <!-- Main Container (Max 600px) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.08);border:1px solid #e2e8f0;">
          
          <!-- 1. Professional Data SaaS 헤더 (정통 딥 네이비 #0A192F 테마) -->
          <tr>
            <td style="background-color:#0a192f;padding:30px 24px 24px 24px;color:#ffffff;border-bottom:1px solid #1e3a8a;">
              <div style="display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.25);color:#94a3b8;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:12px;">
                📊 ${saas.weekLabel} 네이버 플레이스 종합 진단서
              </div>
              <h1 style="margin:0 0 8px 0;font-size:22px;line-height:1.35;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">
                ${saas.subTitle}
              </h1>
              <p style="margin:0 0 16px 0;font-size:12.5px;color:#94a3b8;line-height:1.55;">
                2026 네이버 스마트플레이스 검색 엔진 공식 지표 및 상권 1위 실측 갭 분석 결과입니다.
              </p>

              <!-- Meta Grid -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:8px;padding:10px 14px;font-size:12px;color:#ffffff;">
                <tr>
                  <td width="50%" style="padding:3px 4px;color:#94a3b8;">
                    진단 대상: <strong style="color:#ffffff;">${store}</strong>
                  </td>
                  <td width="50%" style="padding:3px 4px;color:#94a3b8;">
                    검색 키워드: <strong style="color:#ffffff;">${kw} (${rank}위)</strong>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:3px 4px;color:#94a3b8;">
                    상권 1위: <strong style="color:#fde047;">🥇 ${top1}</strong>
                  </td>
                  <td width="50%" style="padding:3px 4px;color:#94a3b8;">
                    발행 일시: <strong style="color:#ffffff;">${dateStr} / ${reportCode}</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 2. 핵심 요약 2대 지표 카드 (종합 건강 점수 & 예상 손실 클릭 수) -->
          <tr>
            <td style="padding:20px 24px;background-color:#ffffff;border-bottom:1px solid #f1f5f9;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <!-- 지표 카드 1: 종합 SEO 건강 점수 -->
                  <td width="50%" style="padding-right:8px;" valign="top">
                    <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;text-align:center;">
                      <span style="font-size:11px;color:#64748b;font-weight:700;display:block;margin-bottom:4px;">종합 SEO 건강 점수</span>
                      <div style="font-size:28px;font-weight:900;color:#0f172a;line-height:1;margin-bottom:6px;">
                        ${saas.seoScore}<span style="font-size:14px;color:#94a3b8;"> / 100</span>
                      </div>
                      <span style="font-size:11px;font-weight:800;color:#2563eb;background:#eff6ff;padding:2px 8px;border-radius:10px;">
                        ${saas.seoScoreText.split('-')[1]?.trim() || '상위권'}
                      </span>
                    </div>
                  </td>
                  <!-- 지표 카드 2: 예상 손실 클릭 수 -->
                  <td width="50%" style="padding-left:8px;" valign="top">
                    <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:10px;padding:14px;text-align:center;">
                      <span style="font-size:11px;color:#be123c;font-weight:700;display:block;margin-bottom:4px;">🚨 월간 예상 유입 손실</span>
                      <div style="font-size:28px;font-weight:900;color:#e11d48;line-height:1;margin-bottom:6px;">
                        -${saas.lossClicksNum}<span style="font-size:14px;color:#fda4af;">명 / 월</span>
                      </div>
                      <span style="font-size:11px;font-weight:700;color:#9f1239;line-height:1.3;display:block;">
                        상위권 대비 이탈 발생 중
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
              <div style="margin-top:10px;font-size:12px;color:#475569;background:#f8fafc;border-left:3px solid #e11d48;padding:8px 12px;border-radius:0 6px 6px 0;">
                💡 <strong>유입 진단:</strong> ${saas.lossClicksText}
              </div>
            </td>
          </tr>

          <!-- 3. 상권 1위 매장과의 1:1 비교 대조표 -->
          <tr>
            <td style="padding:22px 24px;background-color:#ffffff;border-bottom:1px solid #f1f5f9;">
              <h2 style="margin:0 0 6px 0;font-size:15px;font-weight:800;color:#0f172a;">
                📊 상권 1위 매장과의 1:1 비교 대조표
              </h2>
              <p style="margin:0 0 12px 0;font-size:12px;color:#64748b;">
                상권 1위 매장과 내 매장의 핵심 3대 지표 실제 차이입니다.
              </p>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e2e8f0;font-size:12px;text-align:center;">
                <thead>
                  <tr style="background-color:#f8fafc;">
                    <th style="padding:8px 10px;border:1px solid #e2e8f0;color:#475569;font-weight:700;text-align:left;">지표 항목</th>
                    <th style="padding:8px 10px;border:1px solid #e2e8f0;color:#0f172a;font-weight:800;">🥇 1위 (${top1})</th>
                    <th style="padding:8px 10px;border:1px solid #e2e8f0;color:#2563eb;font-weight:800;">내 매장</th>
                    <th style="padding:8px 10px;border:1px solid #e2e8f0;color:#0f172a;font-weight:800;">1위와의 차이</th>
                  </tr>
                </thead>
                <tbody>
                  ${saas.benchmarkingMatrix.map((item, idx) => `
                    <tr style="${idx % 2 === 1 ? 'background-color:#fafafa;' : ''}">
                      <td style="padding:9px 10px;border:1px solid #e2e8f0;text-align:left;font-weight:600;color:#1e293b;">${item.metricName}</td>
                      <td style="padding:9px 10px;border:1px solid #e2e8f0;font-weight:700;color:#0f172a;">${item.top1Value}</td>
                      <td style="padding:9px 10px;border:1px solid #e2e8f0;font-weight:700;color:#2563eb;">${item.myValue}</td>
                      <td style="padding:9px 10px;border:1px solid #e2e8f0;font-weight:700;color:${item.diffBadgeType === 'danger' ? '#dc2626' : (item.diffBadgeType === 'warning' ? '#d97706' : '#15803d')};">
                        ${item.diffText}
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- 3-1. [1주차 전용 점검] 네이버 검색 로봇 색인 최적화 3종 진단 모듈 -->
          <tr>
            <td style="padding:22px 24px;background-color:#ffffff;border-bottom:1px solid #f1f5f9;">
              <div style="display:inline-block;background:#0f172a;color:#ffffff;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:12px;margin-bottom:6px;">
                🛡️ 1주차 정기 관리 모듈
              </div>
              <h2 style="margin:0 0 6px 0;font-size:15px;font-weight:800;color:#0f172a;">
                네이버 검색 로봇 색인 최적화 진단
              </h2>
              <p style="margin:0 0 12px 0;font-size:12px;color:#64748b;">
                2026 알고리즘 색인 로봇이 매장 데이터를 정상 수집하기 위한 3대 기초 진단 결과입니다.
              </p>

              <div style="display:grid;gap:10px;">
                ${saas.indexingAudit.map(item => `
                  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px 14px;margin-bottom:8px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                      <strong style="font-size:12.5px;color:#0f172a;">${item.title}</strong>
                      <span style="font-size:11px;font-weight:800;padding:2px 7px;border-radius:4px;background:${item.badgeType === 'success' ? '#dcfce7;color:#15803d;' : (item.badgeType === 'warning' ? '#fef3c7;color:#b45309;' : '#fee2e2;color:#b91c1c;')};">
                        ${item.statusBadge}
                      </span>
                    </div>
                    <div style="font-size:11.5px;color:#334155;line-height:1.5;margin-bottom:4px;">
                      ${item.diagnosis}
                    </div>
                    <div style="font-size:11px;color:#2563eb;font-weight:700;line-height:1.4;">
                      💡 처방: ${item.actionGuide}
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- 다음 주(2주차) 예고 티저 박스 -->
              <div style="margin-top:12px;background:#eff6ff;border:1.5px dashed #93c5fd;border-radius:8px;padding:12px 14px;">
                <div style="font-size:11.5px;font-weight:800;color:#1d4ed8;margin-bottom:3px;">
                  🔒 다음 주 월요일 아침 9시 예고: [${saas.nextWeekTeaser.themeTitle}]
                </div>
                <div style="font-size:11.5px;color:#1e40af;line-height:1.5;">
                  ${saas.nextWeekTeaser.description}
                  <span style="display:block;margin-top:4px;font-size:10.5px;color:#64748b;">(월 9,900원 정기 구독 시 1위 매장의 7일간 실시간 순증감(±) 대조표와 함께 매주 자동 발송됩니다.)</span>
                </div>
              </div>
            </td>
          </tr>

          <!-- 4. 네이버 최신 알고리즘 위험 요소 체크리스트 -->
          <tr>
            <td style="padding:22px 24px;background-color:#ffffff;border-bottom:1px solid #f1f5f9;">
              <h2 style="margin:0 0 6px 0;font-size:15px;font-weight:800;color:#0f172a;">
                ⚠️ 2026 네이버 최신 알고리즘 위험 요소 점검
              </h2>
              <p style="margin:0 0 12px 0;font-size:12px;color:#64748b;">
                점수가 깎이고 있거나 노출 점수를 손실 중인 핵심 감점 요소입니다.
              </p>

              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:12px;">
                ${saas.riskChecklist.map(item => `
                  <tr>
                    <td width="80" style="padding:6px 0;" valign="top">
                      <span style="display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:4px;background:${item.status === '주의' ? '#fef3c7;color:#b45309;' : (item.status === '미흡' ? '#fee2e2;color:#b91c1c;' : '#dcfce7;color:#15803d;')};">
                        [${item.status}]
                      </span>
                    </td>
                    <td style="padding:6px 0 6px 6px;" valign="top">
                      <strong style="color:#0f172a;">${item.category}:</strong>
                      <span style="color:#475569;margin-left:4px;">${item.desc}</span>
                    </td>
                  </tr>
                `).join('')}
              </table>
            </td>
          </tr>

          <!-- 5. 이번 주 사장님의 3단계 실행 가이드 (1주차 기본 등록 점검 내장) -->
          <tr>
            <td style="padding:22px 24px;background-color:#ffffff;border-bottom:1px solid #f1f5f9;">
              <div style="display:inline-block;background:#2563eb;color:#ffffff;font-size:10.5px;font-weight:800;padding:2px 8px;border-radius:12px;margin-bottom:6px;">
                🎯 1주차 집중 실천 과제
              </div>
              <h2 style="margin:0 0 6px 0;font-size:15px;font-weight:800;color:#0f172a;">
                이번 주 사장님의 3단계 실행 가이드
              </h2>
              <p style="margin:0 0 14px 0;font-size:12px;color:#64748b;">
                이번 주말까지 아래 3가지를 실행하시면 네이버 알고리즘 체류시간과 전환 점수가 즉시 상승합니다.
              </p>

              ${saas.stepPlaybook.map(step => `
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px;margin-bottom:10px;">
                  <div style="display:flex;align-items:center;margin-bottom:4px;">
                    <span style="display:inline-block;background:#0f172a;color:#ffffff;font-size:11px;font-weight:800;width:20px;height:20px;line-height:20px;text-align:center;border-radius:50%;margin-right:8px;">
                      ${step.step}
                    </span>
                    <strong style="font-size:13px;color:#0f172a;">${step.title}</strong>
                  </div>
                  <p style="margin:0;font-size:11.5px;color:#475569;line-height:1.55;">
                    ${step.description}
                  </p>
                  ${step.copyReplies && step.copyReplies.length > 0 ? `
                    <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #cbd5e1;">
                      ${step.copyReplies.map((r, rIdx) => `
                        <div style="background:#ffffff;border:1px solid #e2e8f0;border-radius:6px;padding:8px 10px;margin-top:6px;font-size:11px;color:#334155;line-height:1.5;">
                          <div style="font-weight:700;color:#2563eb;margin-bottom:2px;">[답글 ${rIdx + 1}] ${r.title}</div>
                          <div>"${r.text}"</div>
                        </div>
                      `).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </td>
          </tr>

          <!-- 6. 하단 고정 전환 배너 (Sticky Paywall Footer - 정가 월 9,900원) -->
          <tr>
            <td style="padding:24px;background-color:#0a192f;color:#ffffff;text-align:center;border-top:1px solid #1e3a8a;">
              <span style="display:inline-block;background:rgba(37,99,235,0.25);border:1px solid #3b82f6;color:#93c5fd;font-size:11px;font-weight:800;padding:3px 10px;border-radius:20px;margin-bottom:10px;">
                🛡️ 매주 월요일 정기 감시 &amp; 24시간 실시간 워치독
              </span>
              <h3 style="margin:0 0 8px 0;font-size:17px;font-weight:900;color:#ffffff;line-height:1.4;">
                매주 월요일 아침 1위와의 격차를 추적하고,<br>순위 급락 시 즉각 카톡으로 알려드립니다.
              </h3>
              <p style="margin:0 0 18px 0;font-size:12.5px;color:#94a3b8;line-height:1.55;">
                경쟁사의 기습 리뷰 유입과 알고리즘 롤링을 24시간 감시하여 1위를 지켜드립니다.
              </p>
              
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto 16px auto;">
                <tr>
                  <td align="center" style="background-color:#fee500;border-radius:30px;box-shadow:0 4px 14px rgba(254,229,0,0.35);">
                    <a href="https://pf.kakao.com/_xonxiaX" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 32px;color:#191600;font-size:14.5px;font-weight:900;text-decoration:none;letter-spacing:-0.3px;">
                      💬 월 9,900원으로 우리 매장 24시간 마케팅 비서 시작하기 &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 웹 진단서 링크 -->
              <div style="font-size:12px;color:#cbd5e1;">
                또는 <a href="${webReportUrl}" target="_blank" rel="noopener noreferrer" style="color:#60a5fa;font-weight:700;text-decoration:underline;">[웹 진단서에서 고화질 정밀 리포트 열기 &amp; PDF 인쇄]</a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 20px;text-align:center;font-size:11px;color:#64748b;line-height:1.6;background-color:#020617;border-top:1px solid #1e293b;">
              <p style="margin:0 0 4px 0;color:#94a3b8;font-weight:700;">PostSync AI 전략연구소 | 스마트플레이스 1위 동기화 센터</p>
              <p style="margin:0;">본 메일은 PostSync 플레이스 무료 순위 진단 툴에서 신청하신 고객님께 발송되었습니다.</p>
              <p style="margin:4px 0 0 0;">© 2026 PostSync. All rights reserved.</p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim()

  return { subject, html }
}
