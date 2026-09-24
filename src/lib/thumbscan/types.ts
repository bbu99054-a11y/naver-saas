export interface ThumbScanResult {
  overallScore: number // 0 ~ 100
  signal: 'green' | 'yellow' | 'red'
  signalLabel: string // e.g. "그린라이트 🟢", "은근한 옐로우라이트 🟡", "주의! 레드라이트 🔴"
  relationshipStage: string // e.g. "설레는 썸 초입", "은근한 밀당 중", "호감도 폭발 직전", "친구와 썸 사이"
  summaryHeadline: string // 한 줄 총평
  initiativeRatio: {
    myRatio: number // 0 ~ 100
    partnerRatio: number // 0 ~ 100
    description: string
  }
  freeMetrics: {
    questionFrequency: string // 질문 빈도
    responseSpeedRating: string // 답장 뉘앙스/속도
    emotionalTemperature: string // 감정 온도
  }
  lockedInsights: {
    unconsciousPsychology: string[] // 무의식 속마음 3가지
    heartflutterMoment: {
      quote: string // 대화 중 가장 설렜던 문장
      reason: string // 이유 분석
    }
    recommendedReplies: Array<{
      style: string // e.g. "위트형", "돌직구 심쿵형", "약속 유도형"
      replyText: string
      tip: string
    }>
  }
}
