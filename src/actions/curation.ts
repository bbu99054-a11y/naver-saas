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
  retainerTier?: 'S' | 'A' | 'B' | 'NONE'
  retainerEstimate?: string
  urgencyLevel?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL'
  urgencyReason?: string
}

const recommendedKeywordSchema = z.object({
  title: z.string().describe('포스팅 제목/롱테일 키워드 (예: "서초 음주운전 2진 아웃 경찰 조사 전 선처 양형 요건")'),
  score: z.number().min(85).max(98).describe('AI 추천 점수 (85~98점 사이)'),
  competition: z.enum(['낮음', '보통']).describe('예상 경쟁 강도 (낮음 또는 보통)'),
  description: z.string().describe('마케팅 전환 목적 및 타깃 잠재고객 유입 설명 (1~2문장)'),
  category: z.enum(['SEASON', 'LOCAL', 'HIGH_VALUE']).describe('키워드 카테고리: SEASON(시즌/이슈), LOCAL(지역 롱테일), HIGH_VALUE(고단가 수임)'),
  retainerTier: z.enum(['S', 'A', 'B', 'NONE']).describe('수임 가치 등급: S(1,000만원 이상), A(500만~1,000만원), B(300만~500만원), NONE(해당없음)'),
  retainerEstimate: z.string().describe('사건당 추정 수임 가치 (예: "건당 500만~1,000만 원", "위자료 최대 5,000만 원", "수임 연계")'),
  urgencyLevel: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'NORMAL']).describe('의뢰인 절박도: CRITICAL(긴급 구속/압수수색/신고마감), HIGH(소송/분쟁 직면), MEDIUM(사전 대비), NORMAL(일반)'),
  urgencyReason: z.string().describe('절박한 사유 및 골든타임 설명 (예: "경찰 1차 출석 72시간 전 선처 서류 확보", "사전 대비")')
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
   - 단순 잡상식이나 경미한 사안(단순 과태료, 단순 서식 문의)을 전면 배제하고, 실제 변호사/세무사 착수금이 최소 300만 원~1,000만 원 이상 발생하는 고관여 중대 사건 키워드로 구성하세요.
   - [HIGH_VALUE 전용 필수 필드]:
     - retainerTier: 'S' (1,000만원+), 'A' (500만~1,000만원), 'B' (300만~500만원)
     - retainerEstimate: 구체적 예상 수임료 및 분쟁 규모 (예: "건당 500만~1,200만 원 상당", "위자료 최대 5,000만 원")
     - urgencyLevel: 'CRITICAL' 또는 'HIGH' 지정
     - urgencyReason: 의뢰인의 긴급한 골든타임 사유 (예: "경찰 1차 출석 72시간 전 선처 서류 세팅", "세무조사 사전통지 수령 10일 이내 소명")

[제약 사항]
- title: 단순 명사가 아니라 검색자가 네이버에 검색할 법한 '구체적인 질문이나 문제 해결형 롱테일 제목' (예: "${industry} 선택 시 실수하기 쉬운 항목")
- score: 85~98 사이의 점수 부여 (전환 가치가 높을수록 높은 점수)
- competition: '낮음' 또는 '보통' 중 하나 지정
- description: 이 키워드로 유입되는 잠재 고객의 심리와 마케팅 수임 효과 설명 (1~2문장)
- category: 해당 카테고리 코드('SEASON', 'LOCAL', 'HIGH_VALUE')를 정확히 지정할 것
    `

    // 4. 2단계 AI Fallback 체인 (1순위 Gemini 3.6 Flash 초고속 -> 2순위 GPT-4o-mini)
    const candidateModels = [
      { name: 'gemini-3.6-flash', getModel: () => ((process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_API_KEY) ? google('gemini-3.6-flash') : null) },
      { name: 'gpt-4o-mini', getModel: () => (process.env.OPENAI_API_KEY ? openai('gpt-4o-mini') : null) },
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
          abortSignal: AbortSignal.timeout(3500), // 3.5초 초고속 타임아웃
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
      console.warn('All curation models failed or timed out, applying instant curated fallback.')
      return { clusters: getInstantCuratedFallback(dong || region, industry), error: null }
    }

    // 5. 고단가 수임 메타데이터 무결성 보장 및 정규화
    const normalizedClusters: RecommendedKeyword[] = generatedResult.clusters.map((item: RecommendedKeyword) => {
      if (item.category === 'HIGH_VALUE') {
        const score = item.score || 90
        const defaultTier: 'S' | 'A' | 'B' = score >= 95 ? 'S' : (score >= 90 ? 'A' : 'B')
        const defaultEstimate = defaultTier === 'S' 
          ? '건당 1,000만 원 이상 고액 사건'
          : (defaultTier === 'A' ? '건당 500만~1,000만 원 상당' : '건당 300만~500만 원 상당')
        
        return {
          ...item,
          retainerTier: item.retainerTier || defaultTier,
          retainerEstimate: item.retainerEstimate || defaultEstimate,
          urgencyLevel: item.urgencyLevel || (score >= 93 ? 'CRITICAL' : 'HIGH'),
          urgencyReason: item.urgencyReason || '의뢰인의 직접적인 권리/재산상 불이익 방어를 위한 골든타임 쟁점'
        }
      }
      return item
    })

    return { clusters: normalizedClusters, error: null }
  } catch (error: any) {
    console.error('getCurationClusters error:', error)
    return { clusters: [], error: error.message || error.toString() }
  }
}

function getInstantCuratedFallback(region: string, industry: string): RecommendedKeyword[] {
  const loc = region || '지역'
  let ind = (industry || '변호사').trim()
  if (ind.includes(loc)) {
    ind = ind.replace(loc, '').trim() || '변호사'
  }
  return [
    {
      title: `2026년 개정 법령/판례 기준 ${loc} ${ind} 1:1 심층 상담 절차`,
      score: 95,
      competition: '낮음',
      description: `최근 개정된 실무 법령과 판례를 분석하여 ${loc} 관내 의뢰인의 긴급 문의를 유치합니다.`,
      category: 'SEASON',
      retainerTier: 'B',
      retainerEstimate: '사건 수임 연계',
      urgencyLevel: 'HIGH',
      urgencyReason: '법령 개정 시행에 따른 초기 대응 및 권리 불이익 방지'
    },
    {
      title: `하반기 분쟁 급증 시기 ${loc} ${ind} 사전 리스크 차단 방안`,
      score: 93,
      competition: '보통',
      description: `분쟁 발생 초기 단계에서 신속한 합의 및 선처를 이끌어내기 위한 실전 대응 가이드입니다.`,
      category: 'SEASON',
      retainerTier: 'B',
      retainerEstimate: '사건 수임 연계',
      urgencyLevel: 'MEDIUM',
      urgencyReason: '사전 내용증명 발송 및 증거 확보 골든타임'
    },
    {
      title: `${loc} 관내 긴급 사건 피의자 신문 전 ${ind} 변호인 동석 요건`,
      score: 94,
      competition: '보통',
      description: `수사기관 출석 통보를 받은 의뢰인에게 첫 진술의 결정적 중요성을 안내하여 선임을 유도합니다.`,
      category: 'SEASON',
      retainerTier: 'B',
      retainerEstimate: '건당 300만~500만 원 상당',
      urgencyLevel: 'CRITICAL',
      urgencyReason: '경찰 첫 피의자 신문 조서 작성 전 72시간 내 변호인 조력'
    },
    {
      title: `${loc} 중심 관할 법원 소송 및 지급명령 신속 진행 절차`,
      score: 92,
      competition: '낮음',
      description: `${loc} 관내 거주 의뢰인이 가장 빈번하게 겪는 민·형사 분쟁 해결을 위한 실전 안내입니다.`,
      category: 'LOCAL',
      retainerTier: 'NONE',
      retainerEstimate: '수임 연계',
      urgencyLevel: 'NORMAL',
      urgencyReason: '소송 소장 접수 전 입증자료 사전 정리'
    },
    {
      title: `${loc} 인근 상가·부동산 계약 해지 분쟁 내용증명 작성 대행`,
      score: 91,
      competition: '낮음',
      description: `임대차, 권리금, 명도 등 로컬 부동산 분쟁에서 법적 효력을 극대화하는 법률 조력입니다.`,
      category: 'LOCAL',
      retainerTier: 'NONE',
      retainerEstimate: '수임 연계',
      urgencyLevel: 'HIGH',
      urgencyReason: '계약 만료 전 적법한 해지 통보 기한 엄수'
    },
    {
      title: `${loc} 재개발·재건축 조합 분쟁 및 비대위 대응 법률 자문`,
      score: 93,
      competition: '보통',
      description: `지역 내 재개발 추진 단지 조합원들이 겪는 분쟁 해결책을 제시하여 집단/고액 수임을 유치합니다.`,
      category: 'LOCAL',
      retainerTier: 'NONE',
      retainerEstimate: '수임 연계',
      urgencyLevel: 'MEDIUM',
      urgencyReason: '조합 총회 결의 무효 확인 소송 제기 기한'
    },
    {
      title: `${loc} 직장인 횡령·배임 의심 신고 전 ${ind} 긴급 소명 전략`,
      score: 96,
      competition: '보통',
      description: `기업 내 징계 및 형사 고소 위기에 직면한 직장인/임원을 위한 초동 진술 방어입니다.`,
      category: 'LOCAL',
      retainerTier: 'B',
      retainerEstimate: '건당 300만~500만 원 상당',
      urgencyLevel: 'CRITICAL',
      urgencyReason: '사내 감사 착수 전 계좌 거래 내역 소명 자료 정리'
    },
    {
      title: `기업 영업비밀 유출 및 전직금지 가처분 ${loc} ${ind} 민형사 동시 대응`,
      score: 98,
      competition: '보통',
      description: `기업의 존폐가 걸린 핵심 기술/고객 데이터 유출 사안으로, 건당 1,000만 원 이상 고액 수임으로 직결됩니다.`,
      category: 'HIGH_VALUE',
      retainerTier: 'S',
      retainerEstimate: '건당 1,000만~3,000만 원 이상',
      urgencyLevel: 'CRITICAL',
      urgencyReason: '가처분 신청 전 72시간 내 침해 증거 디지털 포렌식 확보'
    },
    {
      title: `이혼 시 배우자 특유재산 기여도 45% 인정 판례 분석 및 ${loc} ${ind} 상담`,
      score: 97,
      competition: '보통',
      description: `고액 자산가 배우자와의 이혼 시 재산분할을 극대화하려는 의뢰인을 타깃으로 하는 최우선 고단가 키워드입니다.`,
      category: 'HIGH_VALUE',
      retainerTier: 'A',
      retainerEstimate: '건당 500만~1,500만 원 (재산분할액 비례)',
      urgencyLevel: 'HIGH',
      urgencyReason: '소장 송달 전 배우자 명의 재산 가압류·가처분 선행 필수'
    },
    {
      title: `특경법 사기·횡령 혐의 연루 ${loc} ${ind} 긴급 구속영장 실질심사 기각 방어`,
      score: 98,
      competition: '보통',
      description: `피해액 5억 이상 중대 경제범죄로 긴급 구속 위기에 처한 의뢰인의 인신 구속을 방어하는 최상위 고단가 사건입니다.`,
      category: 'HIGH_VALUE',
      retainerTier: 'A',
      retainerEstimate: '건당 700만~2,000만 원 이상',
      urgencyLevel: 'CRITICAL',
      urgencyReason: '구속영장 실질심사 청구 24시간 이내 영장 기각 사유서 제출'
    }
  ]
}
