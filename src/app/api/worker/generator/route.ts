import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { Client } from '@upstash/qstash';

export const maxDuration = 60;

async function handler(req: Request) {
  let body;
  try {
    body = await req.json();
    const { jobId, prompt, tone, experience, citations, userId } = body;
    let outline = '';


    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    let aiModel;
    if (dbUser?.plan_type === 'pro' || dbUser?.plan_type === 'premium') {
      aiModel = anthropic('claude-5-sonnet-latest'); 
    } else {
      aiModel = google('gemini-1.5-flash'); 
    }

    const [profile, pastArticles] = await Promise.all([
      prisma.profile.findUnique({ where: { user_id: userId } }),
      prisma.article.findMany({
        where: { user_id: userId, status: 'COMPLETED' },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, title: true, target_keyword: true }
      })
    ]);

    const systemPrompt = `너는 마케팅 전문가야.`; 
    // We don't want to break if there are literal dollars, but actually since this is written to file directly, we can just insert it normally. Wait, template strings in JS have variables. Let's just insert it. Wait, the template string syntax is fine in normal file writing.
    
    
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
      } catch (e: any) { console.error('SERP Error:', e) }
    }

    try {
      const plannerResult = await generateObject({
        model: aiModel,
        schema: z.object({
          outline: z.string()
        }),
        prompt: `너는 네이버 상위 1% 마케팅 기획자야. 타겟 키워드: "${prompt}"\n${serpCompetitorContext}\n위 상위 노출된 경쟁사 글의 흐름을 분석해서 독창적인 [서론-본론-결론] 뼈대(Outline)를 새로 창조해.`
      });
      outline = plannerResult.object.outline;
    } catch (e: any) { console.error('Planner Error:', e) }

    let searchContext = '';
    if (citations && citations.length > 0) {
       searchContext = citations.map((c: any, i: number) => `[출처 ${i + 1}] 제목: ${c.title}\n내용 요약: ${c.content}`).join('\n\n');
       searchContext = `\n[Tavily RAG 검색된 최신 팩트 데이터]\n${searchContext}\n`;
    }

    const outlineContext = outline ? `\n\n[Planner Agent가 설계한 글의 개요(Skeleton)]\n${outline}\n\n위 개요의 기승전결 구조를 반드시 준수하여 초안을 작성할 것.` : '';

    const draftResult = await generateText({
      model: aiModel,
      temperature: 0.75,
      system: systemPrompt + searchContext + outlineContext,
      prompt: `타겟 키워드: ${prompt}\n\n위 지침과 개요에 맞춰 완벽한 네이버 블로그용 HTML 본문을 작성해줘.`,
    });
    
    const draftText = draftResult.text;

    await prisma.article.updateMany({
      where: { job_id: jobId },
      data: {
        generator_draft: draftText,
        status: 'EVALUATING'
      }
    });

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(`job:${jobId}`, { status: 'EVALUATING' });
    }

    if (process.env.QSTASH_TOKEN) {
      const qstashClient = new Client({ token: process.env.QSTASH_TOKEN });
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
      await qstashClient.publishJSON({
        url: `${baseUrl}/api/worker/evaluator`,
        body: { jobId, draftText, prompt, userId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Generator Worker Error:', error);
    if (body?.jobId) {
      await prisma.article.updateMany({
        where: { job_id: body.jobId },
        data: { status: 'ERROR', error_message: error.message }
      });
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(`job:${body.jobId}`, { status: 'ERROR', error_message: error.message });
      }
    }
    return NextResponse.json({ error: error.message }, { status: 200 }); // Prevent infinite retry
  }
}

export const POST = process.env.NODE_ENV === 'development' ? handler : verifySignatureAppRouter(handler);
