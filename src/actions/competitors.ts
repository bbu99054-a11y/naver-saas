'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export interface CompetitorAnalysisItem {
  id: string
  name: string
  location: string
  placeRank: number
  rankChange: 'UP' | 'DOWN' | 'SAME'
  recentArticleTitle: string
  publishedDaysAgo: number
  threatLevel: 'HIGH' | 'MEDIUM' | 'LOW'
  threatScore: number
  flaw: string
  counterKeyword: string
  counterStrategy: string
}

// 4대 기준(반경 1.5km, 플레이스 상위 1~5위, 최근 7일 내 포스팅, 동일 수임 분야) 기본 분석 세트
const DEFAULT_COMPETITORS: CompetitorAnalysisItem[] = [
  {
    id: 'comp-1',
    name: '법무법인 태양 (서초분사무소)',
    location: '교대역 9번 출구 (반경 350m · 서초법조타운)',
    placeRank: 2,
    rankChange: 'UP',
    recentArticleTitle: '이혼 재산분할 기여도 입증 판례 분석 (어제 발행)',
    publishedDaysAgo: 1,
    threatLevel: 'HIGH',
    threatScore: 92,
    flaw: '법조문 위주 나열, \'퇴직금·국민연금 은닉 재산 조회 및 강제집행 절차\'가 완전히 누락됨',
    counterKeyword: '퇴직금 은닉 재산 분할 강제집행 절차',
    counterStrategy: '경쟁사가 간과한 은닉 재산 추적 실무 체크리스트를 선점하여 스마트블록 1위 탈환'
  },
  {
    id: 'comp-2',
    name: '서초 법률사무소 청람',
    location: '서초역 1번 출구 (반경 500m · 서울중앙지법 인근)',
    placeRank: 4,
    rankChange: 'SAME',
    recentArticleTitle: '음주운전 2진아웃 긴급 구제 방안 (3일 전)',
    publishedDaysAgo: 3,
    threatLevel: 'MEDIUM',
    threatScore: 78,
    flaw: '단순 반성문 양식만 나열, \'경찰 첫 피의자 신문 시 채혈 측정 불응 및 양형 참작 사유\' 부재',
    counterKeyword: '음주운전 2진아웃 경찰 첫 피의자 조사 진술 요령',
    counterStrategy: '경찰 첫 조사 72시간 내 진술 대처법을 심층 서술하여 긴급 수임 의뢰인 직결 독점'
  },
  {
    id: 'comp-3',
    name: '법무법인 정진',
    location: '양재역 4번 출구 (반경 1.2km · 가정법원 인근)',
    placeRank: 5,
    rankChange: 'DOWN',
    recentArticleTitle: '상간남 소송 위자료 방어 사례 (5일 전)',
    publishedDaysAgo: 5,
    threatLevel: 'LOW',
    threatScore: 64,
    flaw: '단순 기각 사례만 언급, \'소장 수령 후 30일 답변서 제출 시 감액 방어 비율 및 합의 요령\' 누락',
    counterKeyword: '상간자 소송 소장 수령 후 30일 답변서 위자료 감액',
    counterStrategy: '소장 수령 직후 30일 골든타임 감액 실무 방어 전략으로 피고 의뢰인 문의 독점'
  }
]

export async function getCompetitorRadar(): Promise<CompetitorAnalysisItem[]> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const profile = await prisma.profile.findUnique({
        where: { user_id: user.id }
      })
      // 사용자 주소/업종 기반 맞춤 키워드 매칭 가능
      if (profile?.industry && profile.industry.includes('세무')) {
        return [
          {
            id: 'comp-tax-1',
            name: '서초 삼일 세무회계',
            location: '서초역 3번 출구 (반경 200m · 역삼세무서 관할)',
            placeRank: 2,
            rankChange: 'UP',
            recentArticleTitle: '법인세 절세 체크리스트 10선 (2일 전)',
            publishedDaysAgo: 2,
            threatLevel: 'HIGH',
            threatScore: 89,
            flaw: '원론적 경비 처리만 언급, \'가지급금 인정이자 정리 및 CEO 퇴직금 플랜 세무조사 방어\' 누락',
            counterKeyword: '법인 가지급금 인정이자 해결 및 세무조사 방어',
            counterStrategy: '경쟁사가 빠뜨린 고위험 가지급금 처리 실무를 집중 공략하여 고단가 기장 유치'
          },
          {
            id: 'comp-tax-2',
            name: '세무법인 율촌 서초지점',
            location: '교대역 11번 출구 (반경 600m)',
            placeRank: 3,
            rankChange: 'SAME',
            recentArticleTitle: '상속세 세무조사 대비 가이드 (4일 전)',
            publishedDaysAgo: 4,
            threatLevel: 'MEDIUM',
            threatScore: 76,
            flaw: '공제 한도만 설명, \'사전증여 10년 합산 배제 및 꼬마빌딩 감정평가 대응 전략\' 부재',
            counterKeyword: '상속세 세무조사 사전증여 10년 합산 감정평가 대응',
            counterStrategy: '사전증여와 감정평가 이슈를 짚어 고액 자산가 상속세 신고 수임 선점'
          }
        ]
      }
    }

    return DEFAULT_COMPETITORS
  } catch (error) {
    console.warn('[getCompetitorRadar] Returning default competitors:', error)
    return DEFAULT_COMPETITORS
  }
}
