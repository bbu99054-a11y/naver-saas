import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';
import { generateText } from 'ai';
import { withTimeout, withRetry } from '@/lib/ai-utils';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { Client } from '@upstash/qstash';

export const maxDuration = 60;

async function handler(req: Request) {
  const startTime = Date.now();
  console.log('[Generator Worker] Start:', new Date().toISOString());

  let body;
  try {
    body = await req.json();
    const { jobId, prompt, tone, experience, outline, citations, userId } = body;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    let aiModel;
    if (dbUser?.plan_type === 'premium') {
      aiModel = anthropic('claude-5-sonnet-latest');
    } else if (dbUser?.plan_type === 'pro') {
      aiModel = openai('gpt-5.6-luna');
    } else {
      aiModel = openai('gpt-5.6-luna');
    }

    const systemPrompt = `너는 네이버 블로그 SEO 마케팅 전문가야.
독자의 공감을 이끌어내는 글을 작성하며, 다음 원칙을 반드시 준수해.
1. 톤앤매너: ${tone}
2. 경험담: ${experience ? '오늘의 팩트체크 경험담: ' + experience : '자연스러운 관련 경험담을 하나 지어내서 포함'}
3. 가독성을 위해 적절한 이모지와 <b> 강조를 사용해.
4. [매우 중요] 마크다운(Markdown, 예: ## 제목, **강조**)은 절대 사용하지 말고, 반드시 <h2>, <p>, <strong> 등 순수 HTML 태그만 사용하여 완벽한 HTML 구조로 출력할 것.`;
    
    let searchContext = '';
    if (citations && citations.length > 0) {
       searchContext = citations.map((c: any, i: number) => `[출처 ${i + 1}] 제목: ${c.title}\n내용 요약: ${c.content}`).join('\n\n');
       searchContext = `\n[Tavily RAG 검색된 최신 팩트 데이터]\n${searchContext}\n`;
    }

    const outlineContext = outline ? `\n\n[Planner Agent가 설계한 글의 개요(Skeleton)]\n${outline}\n\n위 개요의 기승전결 구조를 반드시 준수하여 초안을 작성할 것.` : '';

    console.log(`[Generator Worker] Before generateText Time: ${(Date.now() - startTime) / 1000}s`);

    const draftResult = await withRetry(() => withTimeout(generateText({
      model: aiModel,
      // @ts-ignore
      maxTokens: 8192,
      system: systemPrompt + searchContext + outlineContext,
      prompt: `타겟 키워드: ${prompt}\n\n위 지침과 개요에 맞춰 완벽한 네이버 블로그용 HTML 본문을 작성해줘.`,
    }), 55000), 3, 1000);
    
    const draftText = draftResult.text;

    console.log(`[Generator Worker] After generateText Time: ${(Date.now() - startTime) / 1000}s`);

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
      const qstashClient = new Client({ token: process.env.QSTASH_TOKEN, ...(process.env.QSTASH_URL && { baseUrl: process.env.QSTASH_URL }) });
      const host = req.headers.get('host');
      const fallbackHost = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || 'localhost:3000';
      const finalHost = host || fallbackHost;
      const protocol = finalHost.includes('localhost') ? 'http' : 'https';
      const baseUrl = finalHost.startsWith('http') ? finalHost : `${protocol}://${finalHost}`;
      await qstashClient.publishJSON({
        url: `${baseUrl}/api/worker/evaluator`,
        body: { jobId, draftText, prompt, userId },
      });
    }

    console.log(`[Generator Worker] End Time: ${(Date.now() - startTime) / 1000}s`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Generator Worker] Error:', error);
    console.log(`[Generator Worker] Error Time: ${(Date.now() - startTime) / 1000}s`);
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
