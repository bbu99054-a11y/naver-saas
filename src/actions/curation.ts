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
당신은 네이버 블로그 SEO 및 콘텐츠 마케팅 전문가입니다. 
다음 필러(Pillar) 키워드를 바탕으로, 블로그의 전문성 지수(Topical Authority)를 극대화하고 실제 잠재 고객의 유입을 이끌어낼 수 있는 세부 클러스터(Cluster) 키워드 10개를 제안해 주세요.

[중요 제약사항]
1. 단순한 명사 나열(예: '강남 행정사', '법인설립 대행')을 피하고, 고객이 포털에 검색할 법한 **구체적인 문제 상황이나 질문형태의 진짜 롱테일 키워드**를 생성하세요. (예: '식당 미성년자 주류 판매 영업정지 구제 방법', '외국인 E-7 비자 이직 동의서 필수 여부')
2. 고객의 구매 여정(인지 -> 고려 -> 결정)에 맞춰 정보 탐색형, 문제 해결형, 전환형 키워드를 골고루 섞어 10개를 구성하세요.
3. competitionLevel은 해당 키워드가 얼마나 니치(Niche)하고 구체적인지에 따라 상위노출 난이도를 추정하여 '낮음', '보통', '높음' 중 하나로 설정하세요. (롱테일일수록 주로 '낮음'에 가깝습니다.)
4. score는 이 키워드로 글을 썼을 때의 예상 트래픽 대비 실제 수임/구매로 이어질 전환율(가치)을 종합하여 1~100 사이의 점수로 매겨주세요.

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
