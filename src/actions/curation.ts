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
  model: string = 'gpt-5.6-luna',
  profileContext?: { address?: string; industry?: string }
) {
  try {
    // 1. 프로필 기반 지역 및 업종 분리
    const rawAddress = profileContext?.address || ''
    const industry = profileContext?.industry || pillarKeyword.split(' ').pop() || '전문직'
    
    const addressParts = rawAddress.split(' ').filter(Boolean)
    const region = addressParts.find(p => p.endsWith('구') || p.endsWith('시') || p.endsWith('군')) || addressParts[1] || '지역'
    const dong = addressParts.find(p => p.endsWith('동') || p.endsWith('읍') || p.endsWith('면')) || addressParts[2] || ''

    // 2. 업종별 맞춤형 시드 쿼리 동적 추출
    let industrySpecificQueries: string[] = []
    if (industry.includes('세무') || industry.includes('회계')) {
      industrySpecificQueries = [`${industry} 기장`, `${industry} 양도세`, `${industry} 법인세`]
    } else if (industry.includes('변호사') || industry.includes('법률') || industry.includes('법무')) {
      industrySpecificQueries = [`${industry} 상담`, `${industry} 소송`, `${industry} 수임료`]
    } else if (industry.includes('노무')) {
      industrySpecificQueries = [`${industry} 산재`, `${industry} 부당해고`, `${industry} 임금체불`]
    } else if (industry.includes('의사') || industry.includes('병원') || industry.includes('피부') || industry.includes('치과') || industry.includes('한의')) {
      industrySpecificQueries = [`${industry} 진료`, `${industry} 치료`, `${industry} 추천`]
    } else if (industry.includes('마케팅') || industry.includes('컨설팅') || industry.includes('SaaS') || industry.includes('기획')) {
      industrySpecificQueries = [`${industry} 블로그`, `${industry} 상위노출`, `${industry} 광고대행`]
    } else {
      industrySpecificQueries = [`${industry} 추천`, `${industry} 비용`, `${industry} 상담`]
    }

    const seedQueries = [
      `${region} ${industry}`.trim(),
      dong ? `${dong} ${industry}`.trim() : `${region} ${industry} 추천`.trim(),
      ...industrySpecificQueries,
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

    // 3. 업종별 특화 프롬프트 세부 지침 생성
    let industryGuide = ''
    if (industry.includes('마케팅') || industry.includes('컨설팅') || industry.includes('SaaS')) {
      industryGuide = `
- [업종 특화 원칙: ${industry}]: 전문직(변호사, 세무사, 의사 등) 대상 네이버 블로그 SEO, 마케팅 대행사 수수료 대비 효과, 광고법 위반 방지, 스마트블록 상위노출, 체류시간 극대화, 인바운드 고객 전환 등 전문직 마케팅/컨설팅에 직결되는 주제로 구성하세요.
- [SEASON 예시]: "2026년 전문직 광고법 개정 단속 대비 블로그 체크리스트", "상반기 개업 전문직을 위한 스마트블록 상위노출 전략"
- [LOCAL 예시]: "${region} ${dong} 개업 세무사·변호사를 위한 로컬 블로그 마케팅 가이드", "${region} 병의원 블로그 검색 노출 극대화 비법"
- [HIGH_VALUE 예시]: "월 200만원 대행사보다 수임 전환율 3배 높은 자체 전문 칼럼 공식", "과태료 1천만원 방어하는 전문직 블로그 광고 심의 필터링"
`
    } else if (industry.includes('변호사') || industry.includes('법률') || industry.includes('법무')) {
      industryGuide = `
- [업종 특화 원칙: ${industry}]: 형사 고소 대응, 민사 손해배상, 이혼/재산분할, 상속 분쟁, 계약 분쟁 등 실제 유료 상담 및 사건 수임으로 직결되는 법률 주제로 구성하세요.
- [SEASON 예시]: "2026년 개정 가족법에 따른 상속유류분 청구 핵심 쟁점"
- [LOCAL 예시]: "${region} ${dong} 관할 법원 앞 민사/형사 전문 변호사 상담 전 필수 서류"
- [HIGH_VALUE 예시]: "기업 횡령·배임 고소 대응 골든타임 48시간 전략"
`
    } else if (industry.includes('세무') || industry.includes('회계')) {
      industryGuide = `
- [업종 특화 원칙: ${industry}]: 법인세, 종합소득세, 양도소득세, 증여/상속세, 세무조사 대응, 가업승계 등 세무 실무 주제로 구성하세요.
- [SEASON 예시]: "2026년 3월 법인세 신고, 세법 개정사항과 중소기업 공제 누락 방지"
- [LOCAL 예시]: "${region} ${dong} 상가/아파트 양도세 비과세 요건 및 감면 체크리스트"
- [HIGH_VALUE 예시]: "세무조사 통지서를 받은 법인 대표가 즉시 준비해야 할 대응 절차"
`
    } else if (industry.includes('의사') || industry.includes('병원') || industry.includes('피부') || industry.includes('치과') || industry.includes('한의')) {
      industryGuide = `
- [업종 특화 원칙: ${industry}]: 환자가 자주 겪는 증상, 시술의 원리, 수술 전후 주의사항, 치료 기간 등 의료법 제56조를 준수하는 신뢰형 의학 정보로 구성하세요.
- [SEASON 예시]: "환절기 급증하는 피부 트러블, 올바른 치료 시점과 주의사항"
- [LOCAL 예시]: "${region} ${dong} 주민들이 자주 묻는 임플란트 시술 후 관리 요령"
- [HIGH_VALUE 예시]: "만성 통증 비수술 치료 원리와 정밀 검진이 필요한 증상"
`
    } else if (industry.includes('노무')) {
      industryGuide = `
- [업종 특화 원칙: ${industry}]: 산재 보상, 부당해고 구제신청, 임금체불 진정, 직장 내 괴롭힘, 취업규칙 정비 등 노무 실무 주제로 구성하세요.
- [SEASON 예시]: "2026년 최저임금 개정 및 근로계약서 필수 반영 항목"
- [LOCAL 예시]: "${region} ${dong} 지식산업센터 중소기업을 위한 노무 자문 체크리스트"
- [HIGH_VALUE 예시]: "업무상 질병 산재 불승인 시 이의신청 및 행정소송 승소 전략"
`
    } else {
      industryGuide = `
- [업종 특화 원칙: ${industry}]: 해당 직종(${industry})의 잠재 고객이 네이버에 검색하는 실질적인 문제 해결 및 전문가 의뢰 직결 주제로 구성하세요.
`
    }

    const curationPrompt = `
당신은 네이버 블로그 SEO 및 전문직 로컬 마케팅 최고 권위자입니다.
현재 연도는 2026년입니다.

대표님의 상권 정보와 수집된 실시간 검색 시그널을 분석하여, **반드시 현재 업종("${industry}")에 100% 최적화된 총 10개의 최적화 롱테일 포스팅 키워드**를 생성해 주세요.

[타깃 프로필]
- 기준 지역: ${region} ${dong} (전체 주소: ${rawAddress || pillarKeyword})
- 핵심 업종: ${industry}
${industryGuide}
${autocompleteContext}
${trendingContext}

[필수 구성 매트릭스 (총 10개 엄수)]
1. **[SEASON] 시즌/이슈 키워드 (정확히 3개)**:
   - 이번 달 또는 최근 해당 업종(${industry})의 법령/제도 변경, 시기별 핵심 이슈를 반영한 키워드
2. **[LOCAL] 지역 롱테일 키워드 (정확히 4개)**:
   - ${region} 및 ${dong} 관내 실제 주요 상권, 랜드마크, 대단지, 지하철역, 관공서가 결합된 로컬 상위노출용 키워드
3. **[HIGH_VALUE] 고단가 수임 키워드 (정확히 3개)**:
   - 객단가가 높고 실제 유료 상담 및 고가치 계약으로 직결되는 핵심 쟁점 키워드

[제약 사항]
- title: 단순 명사가 아니라 검색자가 네이버에 검색할 법한 '구체적인 질문이나 문제 해결형 롱테일 제목' (예: "${industry} 선택 시 실수하기 쉬운 항목")
- score: 85~98 사이의 점수 부여 (전환 가치가 높을수록 높은 점수)
- competition: '낮음' 또는 '보통' 중 하나 지정
- description: 이 키워드로 유입되는 잠재 고객의 심리와 마케팅 수임 효과 설명 (1~2문장)
- category: 해당 카테고리 코드('SEASON', 'LOCAL', 'HIGH_VALUE')를 정확히 지정할 것
    `

    // 4. 3단계 AI Fallback 체인 (1순위 GPT-5.6 Luna 초고속 -> 2순위 Gemini 2.5 Flash -> 3순위 Gemini 3.6 Flash)
    const candidateModels = [
      { name: 'gpt-5.6-luna', getModel: () => (process.env.OPENAI_API_KEY ? openai('gpt-5.6-luna') : null) },
      { name: 'gemini-2.5-flash', getModel: () => ((process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY) ? google('gemini-2.5-flash') : null) },
      { name: 'gemini-3.6-flash', getModel: () => ((process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY) ? google('gemini-3.6-flash') : null) },
    ]

    let generatedResult: any = null
    let lastCurationError: any = null

    for (const candidate of candidateModels) {
      try {
        const modelInstance = candidate.getModel()
        if (!modelInstance) continue

        const { object } = await generateObject({
          model: modelInstance,
          schema: clusterSchema,
          prompt: curationPrompt,
          abortSignal: AbortSignal.timeout(20000),
        })

        if (object && object.clusters && object.clusters.length > 0) {
          generatedResult = object
          break
        }
      } catch (err: any) {
        console.warn(`Curation model ${candidate.name} failed, trying next fallback:`, err?.message || err)
        lastCurationError = err
      }
    }

    if (!generatedResult || !generatedResult.clusters || generatedResult.clusters.length === 0) {
      if (lastCurationError) {
        console.error('All curation models failed:', lastCurationError)
      }
      return { clusters: [], error: null }
    }

    return { clusters: generatedResult.clusters, error: null }
  } catch (error: any) {
    console.error('getCurationClusters error:', error)
    return { clusters: [], error: error.message || error.toString() }
  }
}
