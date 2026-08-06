import { NextResponse } from 'next/server'
import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { fetchNaverKeywords } from '@/lib/naverApi'

export const maxDuration = 60

const clusterSchema = z.object({
  clusters: z.array(z.object({
    keyword: z.string().describe('세부 클러스터 키워드 (예: 블로그스팟 애드센스 승인)'),
    intent: z.string().describe('사용자의 검색 의도 (예: 정보 탐색, 문제 해결)'),
    reason: z.string().describe('이 키워드가 필러 문서의 SEO 지수에 도움이 되는 이유')
  }))
})

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    }

    const body = await req.json()
    const { pillarKeyword, model = 'gpt-5.6-luna' } = body

    if (!pillarKeyword) {
      return NextResponse.json({ error: '필러 키워드가 필요합니다.' }, { status: 400 })
    }

    let aiModel;
    if (model === 'gemini-3.6-flash') {
      aiModel = google('gemini-3.6-flash');
    } else {
      // Default to OpenAI for structured output reliability
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
      return NextResponse.json({ error: '키워드 클러스터를 생성하지 못했습니다.' }, { status: 500 })
    }

    // 2. 추출된 키워드 배열을 네이버 API로 검색량 조회
    const aiKeywords = object.clusters.map(c => c.keyword);
    
    // 네이버 API는 한 번에 5개까지만 지원할 수 있지만, 
    // 실제로는 hintKeywords에 콤마로 구분해서 여러 개를 넣을 수 있습니다. 
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
      // 네이버 API가 실패해도 AI 결과물은 반환하도록 함
    }

    // 3. AI 결과와 네이버 검색량 데이터 병합
    const finalClusters = object.clusters.map(cluster => {
      // 띄어쓰기를 없앤 상태로 비교해야 매칭 확률이 높음
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

    return NextResponse.json({ success: true, clusters: finalClusters });

  } catch (error: any) {
    console.error('Clustering Generation API error:', error);
    return NextResponse.json({ error: error.message || '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
