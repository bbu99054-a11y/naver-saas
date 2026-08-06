'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { fetchNaverKeywords } from '@/lib/naverApi'

const clusterSchema = z.object({
  clusters: z.array(z.object({
    keyword: z.string().describe('세부 클러스터 키워드 (예: 블로그스팟 애드센스 승인)'),
    intent: z.string().describe('사용자의 검색 의도 (예: 정보 탐색, 문제 해결)'),
    reason: z.string().describe('이 키워드가 필러 문서의 SEO 지수에 도움이 되는 이유')
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

    // 1. AI에게 클러스터 키워드 5~8개 추출 요청
    const { object } = await generateObject({
      model: aiModel,
      schema: clusterSchema,
      prompt: `
당신은 네이버 블로그 SEO 전문가입니다. 
다음 필러(Pillar) 키워드를 바탕으로, 블로그의 전문성 지수(Topical Authority)를 극대화할 수 있는 세부 클러스터(Cluster) 키워드 6개를 제안해 주세요.
검색량이 있을 법한 현실적이고 구체적인 롱테일 키워드여야 합니다.

필러 키워드: ${pillarKeyword}
      `,
    });

    if (!object || !object.clusters || object.clusters.length === 0) {
      return { clusters: [], error: null };
    }

    // 2. 추출된 키워드 배열을 네이버 API로 검색량 조회
    const aiKeywords = object.clusters.map(c => c.keyword);
    
    let naverData: any[] = [];
    try {
      const chunk1 = aiKeywords.slice(0, 5);
      const res1 = await fetchNaverKeywords(chunk1);
      naverData = [...res1];
      
      if (aiKeywords.length > 5) {
        const chunk2 = aiKeywords.slice(5, 10);
        const res2 = await fetchNaverKeywords(chunk2);
        naverData = [...naverData, ...res2];
      }
    } catch (e) {
      console.error('Naver API failed during clustering:', e);
    }

    // 3. AI 결과와 네이버 검색량 데이터 병합
    const finalClusters = object.clusters.map(cluster => {
      const cleanTarget = cluster.keyword.replace(/\s+/g, '').toLowerCase();
      const matchedStat = naverData.find((n: any) => n.relKeyword.toLowerCase() === cleanTarget);

      return {
        ...cluster,
        monthlyPcQcCnt: matchedStat ? (matchedStat.monthlyPcQcCnt === '< 10' ? 0 : Number(matchedStat.monthlyPcQcCnt)) : 0,
        monthlyMobileQcCnt: matchedStat ? (matchedStat.monthlyMobileQcCnt === '< 10' ? 0 : Number(matchedStat.monthlyMobileQcCnt)) : 0,
        monthlyAvePcClkCnt: matchedStat ? Number(matchedStat.monthlyAvePcClkCnt || 0) : 0,
        monthlyAveMobileClkCnt: matchedStat ? Number(matchedStat.monthlyAveMobileClkCnt || 0) : 0,
      }
    });

    return { clusters: finalClusters, error: null };
  } catch (error: any) {
    console.error('getCurationClusters error:', error);
    return { clusters: [], error: error.message || error.toString() };
  }
}
