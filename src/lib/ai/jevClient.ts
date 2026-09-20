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
