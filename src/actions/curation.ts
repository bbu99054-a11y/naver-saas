'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { fetchNaverAutocomplete, fetchTrendingTopics } from '@/lib/keyword-engine'

export interface RecommendedKeyword {
  title: string
  score: number
  competition: '낮음' | '보통'
  description: string
  category: 'SEASON' | 'LOCAL' | 'HIGH_VALUE'
}

const recommendedKeywordSchema = z.object({
  title: z.string().describe('포스팅 제목/롱테일 키워드 (예: "송파 헬리오시티 1주택자 양도세 비과세 요건...")'),
  score: z.number().min(85).max(98).describe('AI 추천 점수 (85~98점 사이)'),
  competition: z.enum(['낮음', '보통']).describe('예상 경쟁 강도 (낮음 또는 보통)'),
  description: z.string().describe('마케팅 전환 목적 및 타깃 잠재고객 유입 설명 (1~2문장)'),
  category: z.enum(['SEASON', 'LOCAL', 'HIGH_VALUE']).describe('키워드 카테고리: SEASON(시즌/이슈), LOCAL(지역 롱테일), HIGH_VALUE(고단가 수임)')
})

const clusterSchema = z.object({
  clusters: z.array(recommendedKeywordSchema).describe('총 10개의 추천 키워드 (SEASON 3개, LOCAL 4개, HIGH_VALUE 3개)')
})

export async function getCurationClusters(
  pillarKeyword: string,
  model: string = 'gemini-3.6-flash',
  profileContext?: { address?: string; industry?: string }
) {
  try {
    let aiModel;
    if (model === 'gemini-3.6-flash') {
      aiModel = google('gemini-3.6-flash');
    } else {
      aiModel = openai('gpt-5.6-luna');
    }

    // 1. 프로필 기반 지역 및 업종 분리
    const rawAddress = profileContext?.address || ''
    const industry = profileContext?.industry || pillarKeyword.split(' ').pop() || '전문직'
    
    const addressParts = rawAddress.split(' ').filter(Boolean)
    const region = addressParts.find(p => p.endsWith('구') || p.endsWith('시') || p.endsWith('군')) || addressParts[1] || '지역'
    const dong = addressParts.find(p => p.endsWith('동') || p.endsWith('읍') || p.endsWith('면')) || addressParts[2] || ''

    // 2. 실시간 네이버 자동완성 시드 쿼리 병렬 수집
    const seedQueries = [
      `${region} ${industry}`.trim(),
      dong ? `${dong} ${industry}`.trim() : `${region} ${industry} 추천`.trim(),
      `${industry} 양도세`.trim(),
      `${industry} 기장`.trim(),
      `${industry} 상담`.trim()
    ].filter(Boolean)

    const autocompletePromises = seedQueries.map(q => fetchNaverAutocomplete(q))
    const trendingPromise = fetchTrendingTopics(region, industry)

    const [acResults, trendingTopics] = await Promise.all([
      Promise.all(autocompletePromises),
      trendingPromise
    ])

    const flatAutocomplete = Array.from(new Set(acResults.flat())).slice(0, 20)
    const autocompleteContext = flatAutocomplete.length > 0
      ? `\n[실시간 네이버 실제 검색어 시그널]:\n${flatAutocomplete.map(k => `- ${k}`).join('\n')}`
      : '\n[실시간 네이버 검색어]: 기본 검색 의도 기반 추출'

    const trendingContext = trendingTopics
      ? `\n\n[최신 지역 및 관련 법령/이슈 뉴스 트렌드]:\n${trendingTopics}`
      : ''

    // 3. Gemini AI를 통한 3대 카테고리 10선 매트릭스 생성
    const { object } = await generateObject({
      model: aiModel,
      schema: clusterSchema,
      prompt: `
당신은 네이버 블로그 SEO 및 전문직 로컬 마케팅 최고 권위자입니다.
현재 연도는 2026년입니다.

대표님의 상권 정보와 수집된 실시간 검색 시그널을 분석하여, **정확히 총 10개의 최적화된 롱테일 포스팅 키워드**를 생성해 주세요.

[타깃 프로필]
- 기준 지역: ${region} ${dong} (전체 주소: ${rawAddress || pillarKeyword})
- 핵심 업종: ${industry}
${autocompleteContext}
${trendingContext}

[필수 구성 매트릭스 (총 10개 엄수)]
1. **[SEASON] 시즌/이슈 키워드 (정확히 3개)**:
   - 이번 달 또는 최근 세무/법률/부동산 일정 및 최신 개정 법령, 공제 제도 변경 사항을 반영한 키워드
2. **[LOCAL] 지역 롱테일 키워드 (정확히 4개)**:
   - ${region} 및 ${dong} 관내 실제 주요 대단지 아파트명, 지하철역, 지식산업센터, 세무서/법원/구청 등 구체적인 로컬 랜드마크가 결합된 상위노출용 키워드
3. **[HIGH_VALUE] 고단가 수임 키워드 (정확히 3개)**:
   - 세무조사, 법인전환, 증여/상속 플랜, 가업승계, 불복청구, 대형 분쟁 등 객단가가 높고 실제 유료 상담/수임 계약으로 직결되는 고가치 키워드

[제약 사항]
- title: 단순 명사가 아니라 검색자가 네이버에 검색할 법한 '구체적인 질문이나 문제 해결형 롱테일 제목' (예: "송파 헬리오시티 1주택자 양도세 비과세 요건 실수하기 쉬운 항목")
- score: 85~98 사이의 점수 부여 (전환 가치가 높을수록 높은 점수)
- competition: '낮음' 또는 '보통' 중 하나 지정
- description: 이 키워드로 유입되는 잠재 고객의 심리와 마케팅 수임 효과 설명 (1~2문장)
- category: 해당 카테고리 코드('SEASON', 'LOCAL', 'HIGH_VALUE')를 정확히 지정할 것
      `,
    });

    if (!object || !object.clusters || object.clusters.length === 0) {
      return { clusters: [], error: null };
    }

    return { clusters: object.clusters, error: null };
  } catch (error: any) {
    console.error('getCurationClusters error:', error);
    return { clusters: [], error: error.message || error.toString() };
  }
}
