'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface IntakeLeadItem {
  id: string
  name: string
  rawName: string
  phoneMasked: string
  rawPhone: string
  email: string
  category: string
  stage: string
  minutesAgo: number
  status: 'NEW' | 'CONTACTED' | 'VISITING' | 'WON' | 'CLOSED'
  isUrgent: boolean
  summary: string
  contractAmount: string
  jevScore: number
  retainerTier: 'high' | 'standard' | 'light'
  actionText: string
  recommendedQuestions: string[]
  createdAt: string
}

const DEFAULT_DEMO_LEADS: IntakeLeadItem[] = [
  {
    id: 'demo-1',
    name: '김** 의뢰인',
    rawName: '김민준 의뢰인',
    phoneMasked: '010-9***-8888',
    rawPhone: '010-9123-8888',
    email: 'minjun.kim@example.com',
    category: '형사 · 음주운전 2진아웃',
    stage: '경찰 출석 통보 전',
    minutesAgo: 4,
    status: 'NEW',
    isUrgent: true,
    summary: '음주운전 2진 아웃 적발(수치 0.082%) 및 경찰 첫 피의자 신문 출석 전 긴급 선처 방어 요청',
    contractAmount: '550만 원',
    jevScore: 94,
    retainerTier: 'high',
    actionText: '🚨 10분 내 긴급 유선 연결 필수 (골든타임)',
    recommendedQuestions: [
      '경찰 조사 출석 일자가 언제로 지정되었는지 확인',
      '과거 10년 내 동종 음주/무면허 전과 횟수 및 집행유예 여부',
      '음주 수치(0.08% 이상 면허취소 수치) 측정 시 채혈 측정 요구 여부'
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: 'demo-2',
    name: '박** 의뢰인',
    rawName: '박서연 의뢰인',
    phoneMasked: '010-3***-5566',
    rawPhone: '010-3456-5566',
    email: 'sy.park@example.com',
    category: '이혼 · 상간자 소송',
    stage: '소장 수령 30일 답변서',
    minutesAgo: 32,
    status: 'NEW',
    isUrgent: false,
    summary: '상간녀 위자료 청구 소장(청구액 3,000만 원) 송달받아 30일 답변서 기한 임박',
    contractAmount: '440만 원',
    jevScore: 68,
    retainerTier: 'standard',
    actionText: '📞 1시간 내 유선 상담 권장',
    recommendedQuestions: [
      '법원 소장 송달받은 정확한 날짜(답변서 제출 30일 잔여 기한)',
      '상대방 배우자가 유부남/유부녀인 사실을 사전에 인지하고 있었는지 여부',
      '상대방 원고가 제시한 증거(카톡, 블랙박스, 호텔 결제 내역) 파악'
    ],
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString()
  },
  {
    id: 'demo-3',
    name: '최** 의뢰인',
    rawName: '최동욱 의뢰인',
    phoneMasked: '010-7***-9900',
    rawPhone: '010-7890-9900',
    email: 'dw.choi@example.com',
    category: '부동산 · 전세보증금',
    stage: '방문 상담 완료',
    minutesAgo: 120,
    status: 'WON',
    isUrgent: false,
    summary: '빌라 전세보증금 2억 3천만 원 미반환 명도 및 임차권등기명령 강제집행 위임',
    contractAmount: '330만 원',
    jevScore: 42,
    retainerTier: 'standard',
    actionText: '📅 방문 대면 상담 일정 조율 완료',
    recommendedQuestions: [
      '임대차 계약 만료 2개월 전 갱신거절 내용증명 발송 여부',
      '현재 주택의 시세 대비 전세가율 및 HUG 전세보증보험 가입 여부',
      '이사를 가야 하는 긴급 상황인지(임차권등기명령 선행 필요성)'
    ],
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString()
  }
]

function generateSmartQuestions(category: string, stage: string, summary: string): string[] {
  const text = `${category} ${stage} ${summary}`.toLowerCase()
  if (text.includes('음주') || text.includes('형사') || text.includes('경찰') || text.includes('사기') || text.includes('횡령')) {
    return [
      '경찰 또는 검찰 첫 피의자 조사 일정이 언제로 통보되었는지 확인',
      '과거 동종 전과 유무 및 자백/혐의 부인 중 어떤 진술 방향인지 파악',
      '피해자와의 합의 의사 및 피해 변제 여력 확인'
    ]
  }
  if (text.includes('이혼') || text.includes('상간') || text.includes('위자료') || text.includes('재산분할')) {
    return [
      '법원 소장 송달 일자 및 30일 이내 답변서 제출 기한 잔여일 파악',
      '외도 또는 파탄 입증 증거(카톡, 통화, 결제 내역 등)의 확보 수준 확인',
      '재산분할 대상 재산(부동산, 예금, 퇴직금 등)의 명의 파악'
    ]
  }
  if (text.includes('전세') || text.includes('보증금') || text.includes('명도') || text.includes('부동산')) {
    return [
      '임대차 계약 만료 전 계약해지 의사표시(내용증명, 문자) 전달 여부',
      '전세보증금 반환보증보험 가입 여부 및 선순위 근저당 설정 여부',
      '이사 일정에 맞춘 임차권등기명령 즉각 신청 필요 여부'
    ]
  }
  return [
    '사건 발생 시점 및 현재까지 진행된 법적 절차(고소, 소송, 통보) 확인',
    '의뢰인이 가장 시급하게 원하는 목표 결과(처벌 방어, 보상, 합의) 파악',
    '관련 계약서, 녹취록, 문자 등 핵심 입증 자료의 존재 여부 확인'
  ]
}

export async function getIntakeLeads(): Promise<IntakeLeadItem[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { created_at: true }
    })

    const userCreatedAt = dbUser?.created_at || new Date()

    // 내 계정 가입 시점 이후의 상담 리드 조회
    const dbLeads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: userCreatedAt
        },
        leadType: 'consulting',
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // 🔒 내 고유 식별자(?ref=내ID)로 접수된 의뢰인만 정확하게 필터링 (타 로펌 및 공용 웹툴 리드 격리)
    const myLeads = dbLeads.filter(item => {
      const meta = (item.metadata as any) || {}
      return meta.targetUserId === user.id
    })

    if (!myLeads || myLeads.length === 0) {
      return []
    }

    const now = Date.now()
    const mapped: IntakeLeadItem[] = myLeads.map((item) => {
      const meta = (item.metadata as any) || {}
      const jev = meta.jevTriage || {}
      const createdTime = new Date(item.createdAt).getTime()
      const minutesAgo = Math.max(1, Math.round((now - createdTime) / (60 * 1000)))

      const rawPhone = item.phone || meta.clientPhone || ''
      const phoneMasked = rawPhone
        ? rawPhone.replace(/(\d{3})\d{3,4}(\d{4})/, '$1-****-$2')
        : '010-****-****'

      const rawName = meta.clientName || item.businessName || '의뢰인'
      const name = rawName.length > 1 ? `${rawName.charAt(0)}** 의뢰인` : `${rawName} 의뢰인`

      const category = meta.specialty || item.industry || '사건 진단 의뢰'
      const stage = meta.stage || '초기 접수'
      const summary = meta.summary || `${category} 관련 긴급 사건 안심 진단 접수`

      const jevScore = typeof jev.urgencyScore === 'number' ? jev.urgencyScore : 75
      const isUrgent = jev.isUrgent !== undefined ? jev.isUrgent : jevScore >= 80
      const contractAmount = jev.retainerAmountLabel || (isUrgent ? '550만 원' : '330만 원')
      const retainerTier = jev.retainerTier || (isUrgent ? 'high' : 'standard')
      const actionText = jev.actionText || (isUrgent ? '🚨 10분 내 긴급 유선 연결 필수 (골든타임)' : '📞 당일 내 유선 상담 권장')

      let status: 'NEW' | 'CONTACTED' | 'VISITING' | 'WON' | 'CLOSED' = 'NEW'
      if (item.status === 'CONTACTED') status = 'CONTACTED'
      else if (item.status === 'VISITING') status = 'VISITING'
      else if (item.status === 'CONVERTED' || item.status === 'WON') status = 'WON'
      else if (item.status === 'CLOSED') status = 'CLOSED'

      return {
        id: item.id,
        name,
        rawName,
        phoneMasked,
        rawPhone,
        email: item.email || '',
        category,
        stage,
        minutesAgo,
        status,
        isUrgent,
        summary,
        contractAmount,
        jevScore,
        retainerTier,
        actionText,
        recommendedQuestions: generateSmartQuestions(category, stage, summary),
        createdAt: item.createdAt.toISOString()
      }
    })

    return mapped
  } catch (error) {
    console.warn('[getIntakeLeads] Error reading DB leads, returning empty leads:', error)
    return []
  }
}

export async function updateLeadStatus(
  leadId: string, 
  status: 'NEW' | 'CONTACTED' | 'VISITING' | 'WON' | 'CLOSED'
): Promise<{ success: boolean; message?: string }> {
  try {
    if (leadId.startsWith('demo-')) {
      return { success: true, message: '데모 상태가 성공적으로 변경되었습니다.' }
    }

    const prismaStatus = status === 'WON' ? 'CONVERTED' : status

    await prisma.lead.update({
      where: { id: leadId },
      data: { status: prismaStatus }
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/intake')
    revalidatePath('/dashboard/pipeline')
    return { success: true }
  } catch (error: any) {
    console.error('[updateLeadStatus] Error updating lead status:', error)
    return { success: false, message: error.message || '상태 업데이트 실패' }
  }
}
