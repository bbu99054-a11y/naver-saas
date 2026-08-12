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
    let aiModel;
    if (dbUser?.plan_type === 'premium') {
      aiModel = anthropic('claude-5-sonnet-latest');
    } else if (dbUser?.plan_type === 'pro') {
      aiModel = openai('gpt-5.6-terra');
    } else {
      aiModel = openai('gpt-5.6-luna');
    }

    let serpCompetitorContext = '';
    if (process.env.TAVILY_API_KEY) {
      try {
        const serpRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query: prompt, search_depth: 'basic', include_domains: ['blog.naver.com'], max_results: 3 }),
        });
        const serpData = await serpRes.json();
        if (serpData?.results?.length > 0) {
          const serpResults = serpData.results.map((r: any, i: number) => `[경쟁사 ${i + 1}] 제목: ${r.title}\n내용 요약: ${r.content}`).join('\n\n');
          serpCompetitorContext = `\n[현재 네이버 상위 노출 3개 경쟁사 블로그 구조 및 내용]\n${serpResults}\n`;
        }
      } catch (e: any) { console.error('[Planner Worker] SERP Error:', e) }
    }
    
    console.log(`[Planner Worker] After SERP Time: ${(Date.now() - startTime) / 1000}s`);

    let outline = '';
    try {
      const plannerResult = await withRetry(() => withTimeout(generateObject({
        model: aiModel,
        schema: z.object({
          outline: z.string()
        }),
        prompt: `너는 네이버 상위 1% 마케팅 기획자야. 타겟 키워드: "${prompt}"\n${serpCompetitorContext}\n위 상위 노출된 경쟁사 글의 흐름을 분석해서 독창적인 [서론-본론-결론] 뼈대(Outline)를 새로 창조해.`
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
        body: { jobId, prompt, tone, experience, outline, citations, userId },
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
