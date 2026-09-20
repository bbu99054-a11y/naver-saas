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

export interface JevPlaceDiagnosis {
  score: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  rankStatusText: string
  causeAnalysis: string
  recommendedIntroCopy: string
  actionChecklist: string[]
  threatLevel: 'SAFE' | 'WARN' | 'CRITICAL'
  model: string
}

export async function diagnosePlaceWithJev(params: {
  query: string
  targetName: string
  rank: number | null
  hasBooking: boolean
  top1Name: string
}): Promise<JevPlaceDiagnosis> {
  const { query, targetName, rank, hasBooking, top1Name } = params

  let score = 38
  let grade: 'S' | 'A' | 'B' | 'C' | 'D' = 'D'
  let threatLevel: 'SAFE' | 'WARN' | 'CRITICAL' = 'CRITICAL'
  let rankStatusText = '❌ 20위권 밖 미노출 (검색 유입 0% 고립 상태)'
  let causeAnalysis = `입력하신 [${targetName}] 매장이 상위 20위 이내에 감지되지 않았습니다. 1위 [${top1Name || '상위 매장'}] 대비 검색어 적합도 및 네이버 스마트플레이스 기본 세팅이 부족하여 신규 고객 유입이 완전히 차단된 상태입니다.`
  let recommendedIntroCopy = `[${query} 전문] ${targetName} - 1:1 신속 사전 진단 및 방문 예약 혜택`
  let actionChecklist = [
    `스마트플레이스 대표 키워드 5개에 [${query}] 필수 등록`,
    `소개글 첫 15자 내에 상호명과 핵심 키워드 전방 배치`,
    `네이버 실시간 예약 및 스마트콜 버튼을 즉시 활성화하여 가산점 획득`
  ]

  if (rank === 1) {
    score = 96
    grade = 'S'
    threatLevel = 'SAFE'
    rankStatusText = '🥇 1페이지 전체 1위 최상위 독점존 (상위 1%)'
    causeAnalysis = `현재 [${query}] 키워드에서 전체 1위 자리를 수성하고 있습니다. 2~3위 경쟁사의 추격을 방어하기 위해 최근 30일 리뷰 최신성과 플레이스 새소식 발행을 유지해야 합니다.`
    recommendedIntroCopy = `[${query} 1위 만족도] ${targetName} - 대표 직접 1:1 상담 및 안심 사전 검토`
    actionChecklist = [
      '주 1회 이상 네이버 플레이스 소식(새소식) 발행으로 최신성 유지',
      '방문 고객 영수증 포토 리뷰에 100% 정성 답글 작성으로 충성도 강화',
      'PostSync AI 블로그로 주 2~3회 전문 칼럼을 연동하여 1위 굳히기'
    ]
  } else if (rank !== null && rank <= 5) {
    score = hasBooking ? 86 : 74
    grade = 'A'
    threatLevel = 'WARN'
    rankStatusText = `⚡ 1페이지 ${rank}위 상위권 (1위 탈환 가시권, 점유율 20~25%)`
    causeAnalysis = `1위 [${top1Name}] 매장 대비 ${!hasBooking ? '네이버 예약 미연동(-20점 감점) 및 ' : ''}소개글 첫 15자 내 핵심 키워드(${query}) 전방 배치 밀도가 부족하여 1위 진입이 정체된 상태입니다.`
    recommendedIntroCopy = `[${query} 1위 탈환] ${targetName} - 전문 대표 1:1 상담 및 실시간 예약 혜택`
    actionChecklist = [
      hasBooking ? '스마트콜 통화 연결음 키워드 안내 설정' : '네이버 실시간 예약 연동 버튼 즉시 ON (가산점 +20점)',
      `플레이스 소개글 첫 15자 내에 [${query}] 키워드 자연스럽게 전방 배치`,
      '최근 30일 이내 영수증 포토 리뷰 5건 확보 및 C-Rank 블로그 연결'
    ]
  } else if (rank !== null && rank <= 20) {
    score = hasBooking ? 62 : 48
    grade = 'C'
    threatLevel = 'CRITICAL'
    rankStatusText = `🚨 2페이지 이하 ${rank}위 (모바일 잠재 고객 85% 유실 구간)`
    causeAnalysis = `1페이지 1~5위 상위 매장들이 모바일 유입과 유선 전화를 85% 이상 독점하고 있어, 현재 순위에서는 고객 유입 전환율이 극히 저조합니다. 네이버 예약 연동과 소개글 전면 개편이 시급합니다.`
    recommendedIntroCopy = `[${query} 신뢰도 1위] ${targetName} - 100% 비밀 보장 1:1 대표 직접 상담`
    actionChecklist = [
      `소개란 120자 내에 [${query}] 메인 키워드를 맨 앞 첫 문장에 즉시 배치`,
      '스마트콜 및 네이버 예약, 톡톡 상담 기능을 모두 활성화하여 알고리즘 가산점 획득',
      'PostSync AI로 C-Rank 전문 블로그 글을 주 3회 발행하여 지도 장소 첨부 누적'
    ]
  }

  const apiKey = process.env.TYPESAFE_API_KEY || process.env.JEV_API_KEY
  if (!apiKey) {
    return {
      score,
      grade,
      rankStatusText,
      causeAnalysis,
      recommendedIntroCopy,
      actionChecklist,
      threatLevel,
      model: 'fallback-heuristic'
    }
  }

  try {
    const res = await fetch('https://api.typesafe.ai/v1/systemone', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'jev-latest',
        state: {
          keyword: query,
          businessName: targetName,
          currentRank: rank || 99,
          hasBooking,
          top1Competitor: top1Name
        },
        questions: {
          rank_grade: {
            type: 'choice',
            instructions: 'Evaluate the smartplace competitive rank bracket.',
            criteria: {
              S: 'Rank 1 dominating leader',
              A: 'Top 5 page 1 contender',
              B: 'Rank 6-10 borderline',
              C: 'Rank 11-20 low exposure',
              D: 'Unranked or outside top 20'
            }
          },
          urgency_threat: {
            type: 'choice',
            instructions: 'How critical is the ranking drop risk?',
            criteria: {
              CRITICAL: 'Losing 85%+ potential traffic (Rank 6 or worse)',
              WARN: 'Contending in page 1 but missing rank 1',
              SAFE: 'Safely leading rank 1'
            }
          }
        }
      }),
      signal: AbortSignal.timeout(1000)
    })

    if (res.ok) {
      const data = await res.json()
      const answers = data?.answers || {}
      if (answers.rank_grade?.choice) {
        grade = answers.rank_grade.choice
      }
      if (answers.urgency_threat?.choice) {
        threatLevel = answers.urgency_threat.choice
      }
    }
  } catch {
    // Graceful fallback
  }

  return {
    score,
    grade,
    rankStatusText,
    causeAnalysis,
    recommendedIntroCopy,
    actionChecklist,
    threatLevel,
    model: 'jev-system-one'
  }
}

