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

export interface DeepAuditBundle {
  gapMatrix: DeepAuditGapMatrix
  completeness: DeepAuditCompleteness
  reviewHealth: DeepAuditAIReviewHealth
  playbook: DeepAuditPlaybookDay[]
}

export interface PlaceReportSnapshot {
  [key: string]: any
  storeName: string
  targetKeyword: string
  myRank?: number | string
  top1Name?: string
  totalScore?: number
  myReviews?: number
  top1Reviews?: number
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
    summaryText = `블로그 인지도는 양호하나, 영수증 리뷰 볼륨이 상위권 평균보다 ${Math.abs(diffReviews).toLocaleString()}개 부족한 상태입니다. 테이블 QR 결제 리뷰 프로모션(주간 ${weeklyReviewsNeeded}건 채우기)이 최우선입니다.`
  } else {
    summaryText = `영수증 및 블로그 누적 수치는 상위 1~3위 평균 수준을 충족하고 있습니다. 이제 순위 역전은 '최근 30일간의 실시간 유입 가속도'와 '체류시간(예약/플레이스 쿠폰 전환)'에 달려 있습니다.`
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
      id: 'coupon',
      title: '스마트플레이스 혜택 쿠폰',
      status: snapshot.myCoupon ? ('PASS' as const) : ('WARN' as const),
      statusText: snapshot.myCoupon ? '정상 발행 중' : '미발행 (권장)',
      desc: snapshot.myCoupon ? '첫 방문 유도용 쿠폰이 발급되어 지도 탐색자의 클릭률(CTR)과 저장하기를 자극하고 있습니다.' : '쿠폰이 없어 검색 목록에서 경쟁 매장에 클릭을 빼앗길 확률이 2.4배 높습니다.',
      impact: '클릭률(CTR) 상승 기여도: ★★★★☆'
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
      title: '대표 사진 및 메뉴/시설 비주얼',
      status: Number(snapshot.myReviews || 0) > 30 ? ('PASS' as const) : ('WARN' as const),
      statusText: Number(snapshot.myReviews || 0) > 30 ? '양호' : '추가 보강 필요',
      desc: '플레이스 체류시간을 30초 이상 연장하기 위한 고화질 내외부 및 대표 시그니처 컷 등록이 필요합니다.',
      impact: '체류시간 연장 기여도: ★★★★☆'
    }
  ]

  let score = 50
  if (snapshot.myBooking) score += 25
  if (snapshot.myCoupon) score += 15
  if (stuffingRisk === 'SAFE') score += 10
  else if (stuffingRisk === 'DANGER') score -= 15

  const reviewCount = Number(snapshot.myReviews || 0)
  if (reviewCount >= 100) score += 10
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
  const isCouponMissing = !snapshot.myCoupon
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
      badge: '전환율 촉진',
      title: isCouponMissing ? '방문자 유입용 플레이스 혜택 쿠폰 발행' : '기존 쿠폰 혜택 매력도 및 유효기간 리프레시',
      action: isCouponMissing
        ? '플레이스 관리자 → [쿠폰]에서 "첫 방문 10% 할인" 또는 "음료/사이드 무료" 쿠폰 발행하여 지도 목록 내 주황색 쿠폰 배지 활성화.'
        : '현재 쿠폰 다운로드 수 및 사용률 점검 후, 고객 체류시간을 높일 수 있는 매력적인 문구로 갱신.',
      kpi: '플레이스 검색 목록 내 쿠폰 배지 노출 시작',
      difficulty: '쉬움'
    },
    {
      day: 3,
      badge: '비주얼 체류시간',
      title: '고화질 매장 내외부 & 시그니처 컷 10장 신규 업데이트',
      action: '스마트폰으로 촬영한 칙칙한 사진을 교체하고, 고객이 "가보고 싶다"고 느끼는 대표 앵글 사진 10장을 고화질로 업로드 (체류시간 40초 돌파 목적).',
      kpi: '플레이스 대표 갤러리 사진 10장 교체 및 순서 정렬',
      difficulty: '보통'
    },
    {
      day: 4,
      badge: '영수증 리뷰 가속',
      title: `매장 내 테이블/카운터 영수증 리뷰 전용 QR 거치대 세팅 (주간 목표 ${reviewsNeeded}건)`,
      action: `고객 결제 시 즉시 찍을 수 있는 네이버 영수증 리뷰 QR 코드를 출력하여 카운터 및 테이블에 부착. 참여 고객에게 소정의 혜택 제공.`,
      kpi: `1일 최소 ${Math.ceil(reviewsNeeded / 7)}건 이상 고품질 영수증 포토리뷰 유입 시스템 가동`,
      difficulty: '보통'
    },
    {
      day: 5,
      badge: 'AI 검색(GEO) 최적화',
      title: '2026 AI 브리핑 인용 유도용 정성 키워드 리뷰 답변 작성',
      action: '최근 등록된 고객 리뷰 5~10건에 대해 원장/대표자의 진정성 있는 답글 작성. 검색 키워드가 자연스럽게 녹아든 공식 코멘트 게시.',
      kpi: '최근 미답변 리뷰 100% 답변 완료 및 친절도 지표 상승',
      difficulty: '쉬움'
    },
    {
      day: 6,
      badge: '외부 신뢰도(블로그)',
      title: `지역 상권 로컬 체험단 또는 정보성 블로그 언급 2건 확보`,
      action: `네이버 검색 뷰(VIEW)/스마트블록에 매장명이 긍정적으로 언급되도록 인근 주민 또는 서포터즈를 통한 정성 리뷰 포스팅 발행.`,
      kpi: `타깃 키워드 연관 블로그 리뷰 1~2건 신규 발행 확인`,
      difficulty: '집중'
    },
    {
      day: 7,
      badge: '성과 측정 & 순위 추적',
      title: 'PostSync 플레이스 툴 재측정 및 순위 상승 추이 확인',
      action: `일주일간 실행한 5대 지표 개선 결과를 PostSync 플레이스 진단 툴에서 재조회하고 1~3위 평균 격차 축소치 정량 검증.`,
      kpi: `종합 완결도 점수 15점 이상 상승 & 실시간 순위 변동 체크`,
      difficulty: '쉬움'
    }
  ]

  return playbook
}

export function buildDeepAuditBundle(snapshot: PlaceReportSnapshot): DeepAuditBundle {
  const gapMatrix = calculateTop3GapMatrix(snapshot)
  const completeness = evaluatePlaceCompleteness(snapshot)
  const reviewHealth = evaluateAIReviewHealth(snapshot)
  const playbook = generate7DayPlaybook(snapshot, completeness, gapMatrix)

  return {
    gapMatrix,
    completeness,
    reviewHealth,
    playbook
  }
}


export function calculatePlaceAuditScore(snapshot: PlaceReportSnapshot): number {
  let score = 50 // 기본 점수

  // 1. 순위 점수 (1위: +30, 2~3위: +20, 4~10위: +10, 11위 이하: +5)
  const rank = typeof snapshot.myRank === 'number' ? snapshot.myRank : parseInt(String(snapshot.myRank || '99'), 10)
  if (rank === 1) score += 30
  else if (rank <= 3) score += 20
  else if (rank <= 10) score += 10
  else score += 5

  // 2. 예약 연동 (가장 중요: 2026 알고리즘 가중치)
  if (snapshot.myBooking) score += 10
  else score -= 10

  // 3. 쿠폰 발행 여부
  if (snapshot.myCoupon) score += 5

  // 4. 영수증 리뷰 비율 (1위 대비)
  const myRev = snapshot.myReviews || 0
  const topRev = snapshot.top1Reviews || 1
  const revRatio = myRev / Math.max(topRev, 1)
  if (revRatio >= 0.8) score += 10
  else if (revRatio >= 0.5) score += 5
  else if (revRatio < 0.2) score -= 5

  // 0~100점 범위 정규화
  return Math.min(100, Math.max(25, score))
}

export function generatePlaceReportEmailHtml(snapshot: PlaceReportSnapshot, webReportUrl: string): { subject: string; html: string } {
  const store = snapshot.storeName || '신청 매장'
  const kw = snapshot.targetKeyword || '플레이스'
  const top1 = snapshot.top1Name || '상위 1위 매장'
  const score = snapshot.totalScore || calculatePlaceAuditScore(snapshot)
  const dateStr = snapshot.reportDate || new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })

  // 4대 심층 번들 계산 (없을 시 자동 번들링)
  const deepAudit = snapshot.deepAudit || buildDeepAuditBundle(snapshot)
  const gap = deepAudit.gapMatrix
  const comp = deepAudit.completeness

  const myRev = (snapshot.myReviews ?? 0).toLocaleString()
  const topRev = (snapshot.top1Reviews ?? 0).toLocaleString()
  const myBlog = (snapshot.myBlogReviews ?? 0).toLocaleString()
  const topBlog = (snapshot.top1BlogReviews ?? 0).toLocaleString()

  const myBookingText = snapshot.myBooking ? '<span style="color:#10b981;font-weight:bold;">연동 완료</span>' : '<span style="color:#ef4444;font-weight:bold;">미연동 (치명적)</span>'
  const topBookingText = snapshot.top1Booking ? '연동 (활성)' : '미연동'

  const myCouponText = snapshot.myCoupon ? '<span style="color:#10b981;font-weight:bold;">발행 중</span>' : '<span style="color:#f59e0b;font-weight:bold;">미발행</span>'
  const topCouponText = snapshot.top1Coupon ? '발행 중' : '미발행'

  const mySaves = String(snapshot.mySaves ?? '0')
  const topSaves = String(snapshot.top1Saves ?? '0')

  let statusBadge = '현재 중위권 (개선 여지 큼)'
  let statusBadgeColor = '#f59e0b'
  if (score >= 80) {
    statusBadge = '1위 탈환 유력권'
    statusBadgeColor = '#10b981'
  } else if (score < 50) {
    statusBadge = '긴급 처방 필요'
    statusBadgeColor = '#ef4444'
  }

  const subject = `[진단 리포트] ${store}의 '${kw}' 네이버 플레이스 1위 격차 실측 진단서가 도착했습니다`

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
        
        <!-- Main Email Container (Max 600px for Gmail clipping prevention) -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,0.08);border:1px solid #e2e8f0;">
          
          <!-- Header Bar -->
          <tr>
            <td style="background:linear-gradient(135deg, #1e40af 0%, #2563eb 100%);padding:28px 24px;text-align:left;color:#ffffff;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <span style="display:inline-block;background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.4);color:#ffffff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;margin-bottom:10px;">
                      2026 네이버 스마트플레이스 정량 실측 진단서
                    </span>
                    <h1 style="margin:0 0 8px 0;font-size:22px;line-height:1.35;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                      <span style="color:#fef08a;">[${store}]</span> 1위 탈환<br>실전 처방 &amp; 정량 격차 리포트
                    </h1>
                    <p style="margin:0;font-size:13px;color:#94a3b8;line-height:1.5;">
                      타깃 키워드: <strong style="color:#ffffff;">${kw}</strong> | 분석일: ${dateStr}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Score Card Section -->
          <tr>
            <td style="padding:24px 20px;border-bottom:1px solid #f1f5f9;background-color:#f8fafc;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;">
                <tr>
                  <td width="130" align="center" style="border-right:1px solid #f1f5f9;padding-right:16px;">
                    <div style="font-size:11px;color:#64748b;font-weight:700;">종합 경쟁력 점수</div>
                    <div style="font-size:38px;font-weight:900;color:#2563eb;line-height:1;margin:8px 0;">
                      ${score}<span style="font-size:16px;color:#94a3b8;font-weight:600;">/100</span>
                    </div>
                    <span style="display:inline-block;font-size:11px;font-weight:800;padding:2px 8px;border-radius:4px;background:${statusBadgeColor}20;color:${statusBadgeColor};">
                      ${statusBadge}
                    </span>
                  </td>
                  <td style="padding-left:18px;">
                    <div style="font-size:14px;font-weight:800;color:#0f172a;margin-bottom:6px;">
                      상위 1~3위 평균 대비 격차 요약
                    </div>
                    <p style="margin:0 0 8px 0;font-size:12.5px;color:#475569;line-height:1.6;">
                      ${gap.summaryText}
                    </p>
                    <div style="font-size:11.5px;color:#1e40af;background:#eff6ff;padding:6px 10px;border-radius:6px;font-weight:600;">
                      🎯 30일 목표 주간 최소 유입: <strong>영수증 리뷰 ${gap.weeklyReviewsNeeded}건</strong>, <strong>블로그 ${gap.weeklyBlogsNeeded}건</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- 4대 정량 격차 비교표 (상위 1~3위 평균 대조) -->
          <tr>
            <td style="padding:24px 20px;">
              <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:800;color:#0f172a;">
                📊 상위 1~3위 평균 vs 내 매장 정량 격차
              </h2>
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:1px solid #e2e8f0;font-size:12.5px;text-align:center;">
                <thead>
                  <tr style="background-color:#f8fafc;">
                    <th style="padding:10px;border:1px solid #e2e8f0;color:#475569;font-weight:700;text-align:left;">평가 지표</th>
                    <th style="padding:10px;border:1px solid #e2e8f0;color:#0f172a;font-weight:800;">상위 1~3위 평균</th>
                    <th style="padding:10px;border:1px solid #e2e8f0;color:#2563eb;font-weight:800;">내 매장 (${store})</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;text-align:left;font-weight:600;">✍️ 방문자 영수증 리뷰</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;font-weight:700;">${gap.top3AvgReviews.toLocaleString()}개</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;font-weight:700;color:#2563eb;">${myRev}개 (${gap.diffReviews >= 0 ? '+' : ''}${gap.diffReviews.toLocaleString()})</td>
                  </tr>
                  <tr style="background-color:#fafafa;">
                    <td style="padding:10px;border:1px solid #e2e8f0;text-align:left;font-weight:600;">📝 블로그 리뷰 언급량</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;font-weight:700;">${gap.top3AvgBlogReviews.toLocaleString()}개</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;font-weight:700;color:#2563eb;">${myBlog}개 (${gap.diffBlogReviews >= 0 ? '+' : ''}${gap.diffBlogReviews.toLocaleString()})</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;text-align:left;font-weight:600;">📅 네이버 예약 연동</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${topBookingText}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${myBookingText}</td>
                  </tr>
                  <tr style="background-color:#fafafa;">
                    <td style="padding:10px;border:1px solid #e2e8f0;text-align:left;font-weight:600;">🎟️ 플레이스 쿠폰</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${topCouponText}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;">${myCouponText}</td>
                  </tr>
                  <tr>
                    <td style="padding:10px;border:1px solid #e2e8f0;text-align:left;font-weight:600;">📌 지도 저장하기 (저장수)</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;font-weight:700;">${topSaves}</td>
                    <td style="padding:10px;border:1px solid #e2e8f0;font-weight:700;color:#2563eb;">${mySaves}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- 플레이스 완결도 점검 요약 -->
          <tr>
            <td style="padding:0 20px 20px 20px;">
              <div style="background-color:#f1f5f9;border-radius:12px;padding:16px;border:1px solid #e2e8f0;">
                <div style="font-size:13.5px;font-weight:800;color:#0f172a;margin-bottom:6px;">
                  📋 스마트플레이스 세팅 완결도: <span style="color:#2563eb;">${comp.score}점</span> (${comp.gradeText})
                </div>
                <div style="font-size:12px;color:#475569;line-height:1.5;">
                  • <strong>어뷰징 위험도:</strong> ${comp.keywordStuffingRisk === 'SAFE' ? '<span style="color:#10b981;font-weight:bold;">정상 (안전)</span>' : '<span style="color:#ef4444;font-weight:bold;">주의 요망 (키워드 과다 삽입 점검)</span>'}<br>
                  • ${comp.stuffingReason}
                </div>
              </div>
            </td>
          </tr>

          <!-- 3대 핵심 처방전 요약 -->
          <tr>
            <td style="padding:0 20px 24px 20px;">
              <h2 style="margin:0 0 12px 0;font-size:16px;font-weight:800;color:#0f172a;">
                💡 2026 알고리즘 기준 즉시 처방전
              </h2>
              <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
                <div style="font-size:13px;font-weight:800;color:#1e40af;margin-bottom:4px;">
                  1. [골든타임 24시간] 네이버 예약 즉시 연동
                </div>
                <div style="font-size:12px;color:#1e3a8a;line-height:1.5;">
                  2026년 네이버 플레이스는 결제/예약 전환 매장에 가장 높은 체류 가산점을 부여합니다.
                </div>
              </div>
              <div style="background-color:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:14px 16px;margin-bottom:10px;">
                <div style="font-size:13px;font-weight:800;color:#166534;margin-bottom:4px;">
                  2. [30일 가속기] 매장 내 테이블 QR을 통한 영수증 포토리뷰 세팅
                </div>
                <div style="font-size:12px;color:#14532d;line-height:1.5;">
                  상위 1~3위 평균 추월을 위해 <strong>주당 ${gap.weeklyReviewsNeeded}건</strong> 이상의 영수증 리뷰 유입이 필요합니다.
                </div>
              </div>
            </td>
          </tr>

          <!-- 9,900 Won Monthly Subscription Promo Card -->
          <tr>
            <td style="padding:0 20px 20px 20px;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background:linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);border:1.5px solid #93c5fd;border-radius:12px;padding:16px;">
                <tr>
                  <td>
                    <div style="font-size:11px;font-weight:800;color:#1e40af;margin-bottom:4px;letter-spacing:-0.2px;">
                      🔥 [정기 구독 론칭 특가] 주 1회 실시간 감시 리포트
                    </div>
                    <div style="font-size:14px;font-weight:900;color:#0f172a;margin-bottom:6px;">
                      매주 월요일 아침, 1위 매장의 증감을 감시해 드립니다
                    </div>
                    <div style="font-size:12px;color:#334155;line-height:1.5;margin-bottom:10px;">
                      • 1위 매장 7일간 리뷰·블로그 증감 실시간 추적<br>
                      • 내 매장 순위 변동 &amp; 역전 위기 방어 알림<br>
                      • 이번 주 매장 리뷰에 바로 붙여넣는 AI 답글 5종 제공
                    </div>
                    <div style="font-size:12px;font-weight:800;color:#2563eb;">
                      ☕ 커피 2잔 값: <strong>월 9,900원 (월 4회 자동 발행)</strong>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Big Action Button (CTA) -->
          <tr>
            <td align="center" style="padding:10px 20px 30px 20px;">
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:0 auto;">
                <tr>
                  <td align="center" style="background-color:#2563eb;border-radius:30px;box-shadow:0 4px 14px rgba(37,99,235,0.35);">
                    <a href="${webReportUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:15px;font-weight:800;text-decoration:none;letter-spacing:-0.3px;">
                      👉 전체 심층 진단서 웹으로 크게 보기 &amp; PDF 인쇄
                    </a>
                  </td>
                </tr>
              </table>
              <div style="margin-top:12px;font-size:11.5px;color:#64748b;">
                * 위 버튼을 누르시면 브라우저에서 인쇄 및 PDF 저장이 가능한 고화질 정밀 리포트로 이동합니다.
              </div>
            </td>
          </tr>

          <!-- Contact / Kakao Consultation Box -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px;border-top:1px solid #e2e8f0;text-align:center;">
              <div style="font-size:13.5px;font-weight:800;color:#0f172a;margin-bottom:4px;">
                혼자서 세팅하기 막막하신가요?
              </div>
              <div style="font-size:12px;color:#64748b;margin-bottom:12px;">
                PostSync 로컬 마케팅 전문 연구팀이 1:1로 맞춤 처방을 안내해 드립니다.
              </div>
              <a href="https://pf.kakao.com/_xonxiaX" target="_blank" rel="noopener noreferrer" style="display:inline-block;background-color:#fee500;color:#191600;font-size:12.5px;font-weight:800;padding:8px 18px;border-radius:20px;text-decoration:none;">
                💬 카카오톡으로 1:1 상담 문의하기
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px;text-align:center;font-size:11px;color:#94a3b8;line-height:1.6;background-color:#0f172a;">
              <p style="margin:0 0 4px 0;color:#cbd5e1;font-weight:700;">PostSync AI 전략연구소 | 스마트플레이스 1위 동기화 센터</p>
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
