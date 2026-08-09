'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const clusterSchema = z.object({
  clusters: z.array(z.object({
    keyword: z.string().describe('세부 클러스터 키워드 (예: 블로그스팟 애드센스 승인)'),
    intent: z.string().describe('사용자의 검색 의도 (예: 정보 탐색, 문제 해결)'),
    reason: z.string().describe('이 키워드가 필러 문서의 SEO 지수에 도움이 되는 이유'),
    competitionLevel: z.enum(['낮음', '보통', '높음']).describe('예상 경쟁 강도'),
    score: z.number().min(1).max(100).describe('AI 추천 점수 (1~100)')
  }))
})

export async function getCurationClusters(pillarKeyword: string, model: string = 'gemini-3.6-flash') {
  try {
    let aiModel;
    if (model === 'gemini-3.6-flash') {
      aiModel = google('gemini-3.6-flash');
    } else {
      aiModel = openai('gpt-5.6-luna');
    }

    const { object } = await generateObject({
      model: aiModel,
      schema: clusterSchema,
      prompt: `
당신은 네이버 블로그 SEO 전문가입니다. 
다음 필러(Pillar) 키워드를 바탕으로, 블로그의 전문성 지수(Topical Authority)를 극대화할 수 있는 세부 클러스터(Cluster) 키워드 10개를 제안해 주세요.

[중요 제약사항]
1. 너무 긴 문장형 키워드는 절대 피하세요. (예: '강남 법인 설립 인허가 대행 행정사 추천' -> 금지)
2. 실제 일반인들이 네이버 검색창에 타이핑할 법한 2~3어절의 짧고 명확한 명사 조합으로 작성하세요. (예: '강남 행정사', '법인설립 대행', '삼성역 비자연장')
3. 글자수는 띄어쓰기 포함 최대 15자를 넘지 않도록 하세요.
4. 검색량이 0인 유령 키워드가 나오지 않도록 대중적인 단어를 포함하세요.
5. competitionLevel은 해당 키워드로 상위노출하기 얼마나 어려운지를 추정하여 '낮음', '보통', '높음' 중 하나로 설정하세요.
6. score는 이 키워드로 글을 썼을 때의 예상 트래픽과 전환율을 종합하여 1~100 사이의 점수로 매겨주세요.

필러 키워드: ${pillarKeyword}
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
