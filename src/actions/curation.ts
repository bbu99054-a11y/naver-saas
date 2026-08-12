'use server'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { z } from 'zod'

const clusterSchema = z.object({
  clusters: z.array(z.object({
    keyword: z.string().describe('세부 클러스터 키워드 (예: 신생아 특례 매수자 취득세 감면 유의사항)'),
    intent: z.enum(['정보 탐색 (Top)', '비교/고민 (Middle)', '즉시 행동 (Bottom)']).describe('사용자의 구매 여정(퍼널) 단계'),
    reason: z.string().describe('이 키워드가 필러 문서의 SEO 지수에 도움이 되는 이유'),
    competitionLevel: z.enum(['낮음', '보통', '높음']).describe('예상 경쟁 강도'),
    score: z.number().min(1).max(100).describe('AI 추천 점수 (1~100)')
  }))
})

export async function getCurationClusters(pillarKeyword: string, industry: string = '', model: string = 'gemini-3.6-flash') {
  try {
    let aiModel;
    if (model === 'gemini-3.6-flash') {
      aiModel = google('gemini-3.6-flash');
    } else {
      aiModel = openai('gpt-5.6-luna');
    }

    // Phase 1: 최신 트렌드/뉴스 검색 (Tavily 연동)
    let trendContext = '최신 뉴스 데이터를 불러오지 못했습니다. 일반적인 마케팅 지식에 기반하여 생성해 주세요.';
    if (process.env.TAVILY_API_KEY) {
      const today = new Date().toLocaleDateString('ko-KR');
      
      let trendQuery = `${pillarKeyword} 최신 뉴스 트렌드 ${today}`;
      if (industry.includes('세무사') || industry.includes('회계사')) {
        const pool = ["세법 개정안", "부동산 양도세 취득세", "증여세 상속세 절세", "법인세 세무조사", "개인사업자 부가세 종소세"];
        trendQuery = `${pool[Math.floor(Math.random() * pool.length)]} 최신 뉴스 ${today}`;
      } else if (industry.includes('변호사') || industry.includes('법률')) {
        const pool = ["대법원 최신 판례", "형사 소송 경찰 조사", "이혼 재산분할 위자료", "부동산 명도소송", "개인회생 파산"];
        trendQuery = `${pool[Math.floor(Math.random() * pool.length)]} 법률 뉴스 ${today}`;
      } else if (industry.includes('의사') || industry.includes('병원')) {
        const pool = ["건강보험 급여 개정", "최신 의료 기술 시술", "계절성 유행 질환", "현대인 만성 질환 통증", "안티에이징 피부 시술"];
        trendQuery = `${pool[Math.floor(Math.random() * pool.length)]} 건강 뉴스 ${today}`;
      } else if (industry.includes('노무사')) {
        const pool = ["노동법 개정안", "부당해고 구제신청", "임금체불 퇴직금", "직장내 괴롭힘 산재", "근로감독관 고용노동부 지침"];
        trendQuery = `${pool[Math.floor(Math.random() * pool.length)]} 최신 뉴스 ${today}`;
      }

      try {
        const searchRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: trendQuery,
            search_depth: 'basic',
            max_results: 3
          }),
        });
        const searchData = await searchRes.json();
        if (searchData && searchData.results && searchData.results.length > 0) {
          const resultsText = searchData.results.map((r: any, i: number) => `[${i + 1}] ${r.title}\n${r.content}`).join('\n\n');
          trendContext = `${resultsText}`;
        }
      } catch (e) {
        console.error('Tavily trend search failed:', e);
      }
    }

    // Phase 2: 검색자 의도 세분화(Funnel) 및 키워드 생성
    const { object } = await generateObject({
      model: aiModel,
      schema: clusterSchema,
      temperature: 0.85,
      prompt: `
당신은 네이버 블로그 SEO 및 전문직 마케팅 전문가입니다. 
다음 필러(Pillar) 키워드와 오늘 수집된 [최신 트렌드/뉴스 데이터]를 바탕으로, 실제 잠재 고객의 유입을 이끌어낼 수 있는 구체적인 롱테일 클러스터(Cluster) 키워드 정확히 10개를 제안해 주세요.

[오늘 수집된 최신 트렌드/뉴스 데이터]
${trendContext}

[중요 제약사항]
1. 단순한 명사 나열(예: '강남 행정사')을 피하고, 고객이 포털에 검색할 법한 **구체적인 문제 상황이나 트렌드가 반영된 진짜 롱테일 키워드**를 생성하세요.
2. (환각 방지 강제) 절대 존재하지 않는 허위 정책이나 뉴스를 지어내어 키워드로 만들지 마세요. 반드시 위 [최신 트렌드/뉴스 데이터]에 있는 사실에만 기반하여 트렌드 키워드를 생성해야 합니다.
3. 이전에 추천했던 뻔한 키워드는 절대 제외하고, 매번 완전히 새로운 시각의 Niche(니치)한 롱테일 키워드를 발굴하세요. 시의성(계절, 현재 경제상황, 트렌드)이 짙게 배어있을수록 좋습니다.
4. 고객의 구매 여정(퍼널) 단계에 따라 정확한 비율로 10개를 나누어 생성하세요:
   - '정보 탐색 (Top)' (3개): 당장 수임할 건 아니지만 정보를 찾는 사람을 위한 키워드. **이 단계의 키워드에는 '세무사', '변호사', '비용', '상담', '추천' 같은 상업적 단어를 절대 넣지 말고 순수 정보 검색형으로 작성하세요.** (예: 가족간 계좌이체 증여세 면제 한도)
   - '비교/고민 (Middle)' (3개): 전문가를 찾기 시작한 사람을 위한 키워드 (예: 송파구 상속세 전문 세무사 고르는 3가지 기준)
   - '즉시 행동 (Bottom)' (4개): 당장 내일 방문/수임을 원하는 사람을 위한 키워드 (예: 잠실 엘스아파트 다주택자 양도세 신고 대행 비용)
4. competitionLevel은 해당 키워드가 얼마나 니치(Niche)하고 구체적인지에 따라 상위노출 난이도를 추정하여 '낮음', '보통', '높음' 중 하나로 설정하세요. (롱테일일수록 주로 '낮음'에 가깝습니다.)
5. score는 이 키워드로 글을 썼을 때의 예상 트래픽 대비 실제 수임/구매로 이어질 전환율(가치)을 종합하여 1~100 사이의 점수로 매겨주세요.

필러 키워드(지역+업종): ${pillarKeyword}
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
