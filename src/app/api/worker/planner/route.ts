import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';
import { generateObject } from 'ai';
import { z } from 'zod';
import { withTimeout, withRetry } from '@/lib/ai-utils';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { Client } from '@upstash/qstash';

export const maxDuration = 60;

async function handler(req: Request) {
  const startTime = Date.now();
  console.log('[Planner Worker] Start:', new Date().toISOString());
  
  let body;
  try {
    body = await req.json();
    const { jobId, prompt, tone, experience, citations, userId } = body;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    
    // 강제: 모든 유저가 gpt-5.6-luna (Phase 2 복구를 위한 모델 고정)
    const aiModel = openai('gpt-5.6-luna');

    // 1. Tavily (경쟁사 블로그) 검색
    let serpCompetitorContext = '';
    if (process.env.TAVILY_API_KEY) {
      try {
        const serpRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query: prompt, search_depth: 'basic', include_domains: ['blog.naver.com'], max_results: 3 }),
        });
        const tavilyData = await serpRes.json();
        if (tavilyData?.results?.length > 0) {
          const serpResults = tavilyData.results.map((r: any, i: number) => `[경쟁사 ${i + 1}] 제목: ${r.title}\n내용 요약: ${r.content}`).join('\n\n');
          serpCompetitorContext = `\n[현재 네이버 상위 노출 3개 경쟁사 블로그 구조 및 내용]\n${serpResults}\n`;
        }
      } catch (e: any) { console.error('[Planner Worker] SERP Error:', e) }
    }

    // 2. Naver SERP 스크래핑 (Phase 2 복구: 기획 단계로 승격)
    const { scrapeNaverSerpContext } = await import('@/lib/scraper');
    let serpData = null;
    let naverSerpContext = '';
    try {
      serpData = await scrapeNaverSerpContext(prompt);
      if (serpData) {
        naverSerpContext = `
[네이버 검색엔진 최적화(SEO) 기준치]
- 권장 글자 수: 약 ${serpData.averageTextLength}자
- 권장 이미지 수: 약 ${serpData.averageImageCount}장
- 상위 노출 공통 목차(H2): ${serpData.commonHeaders.join(', ')}
`;
      }
    } catch(e) {
      console.error('[Planner Worker] Naver Scraper error:', e);
    }
    
    console.log(`[Planner Worker] After SERP Time: ${(Date.now() - startTime) / 1000}s`);

    // 3. 기획안(Outline) 생성 (Phase 2 프레임워크 강제)
    let outline = '';
    try {
      const plannerResult = await withRetry(() => withTimeout(generateObject({
        model: aiModel,
        schema: z.object({
          outline: z.string()
        }),
        prompt: `너는 네이버 상위 1% 마케팅 기획자야. 타겟 키워드: "${prompt}"

${serpCompetitorContext}
${naverSerpContext}

위 경쟁사 분석 및 SEO 기준치를 바탕으로, Generator가 작성할 블로그 본문의 완벽한 뼈대(Outline)를 새로 창조해.
단, 아래의 [프레임워크 및 구조 제약사항]을 무조건 따라야 해. 단순한 서론-본론-결론이 아닌 매우 디테일한 기획안이어야 해.

[기획안 프레임워크 및 구조 제약사항]
1. 도입부 (서론): 반드시 APB 프레임워크(Acknowledge 문제 제기 - Promise 해결책 제시 - Bridge 브릿지) 구조로 기획할 것. 독자가 7초 이내에 이탈하지 않도록 강력한 후킹 구조로 짤 것.
2. 본론: 네이버 상위 노출 공통 목차(H2)를 참고하여 흐름을 짤 것. 중간중간 독자의 지루함을 깨기 위한 [시각 자료 및 템플릿 삽입 지점]을 기획안에 명시할 것.
3. 결론: 본문을 자연스럽게 요약하고, 마지막에는 반드시 [전문가 푸터(안내 박스) 삽입 위치]를 명시하며 끝맺을 것.
`
      }), 55000), 3, 1000);
      outline = plannerResult.object.outline;
    } catch (e: any) { 
      console.error('[Planner Worker] generateObject Error:', e);
      throw e;
    }
    
    console.log(`[Planner Worker] After generateObject Time: ${(Date.now() - startTime) / 1000}s`);

    await prisma.article.updateMany({
      where: { job_id: jobId },
      data: { status: 'GENERATING' }
    });

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(`job:${jobId}`, { status: 'GENERATING' });
    }

    if (process.env.QSTASH_TOKEN) {
      const qstashClient = new Client({ token: process.env.QSTASH_TOKEN, ...(process.env.QSTASH_URL && { baseUrl: process.env.QSTASH_URL }) });
      const host = req.headers.get('host');
      const fallbackHost = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'localhost:3000';
      const finalHost = host || fallbackHost;
      const protocol = finalHost.includes('localhost') ? 'http' : 'https';
      const baseUrl = finalHost.startsWith('http') ? finalHost : `${protocol}://${finalHost}`;
      await qstashClient.publishJSON({
        url: `${baseUrl}/api/worker/generator`,
        body: { jobId, prompt, tone, experience, outline, citations, userId, serpData },
      });
    }

    console.log(`[Planner Worker] End Time: ${(Date.now() - startTime) / 1000}s`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Planner Worker] Error:', error);
    console.log(`[Planner Worker] Error Time: ${(Date.now() - startTime) / 1000}s`);
    if (body?.jobId) {
      await prisma.article.updateMany({
        where: { job_id: body.jobId },
        data: { status: 'ERROR', error_message: error.message }
      });
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(`job:${body.jobId}`, { status: 'ERROR', error_message: error.message });
      }
    }
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}

export const POST = process.env.NODE_ENV === 'development' ? handler : verifySignatureAppRouter(handler);
