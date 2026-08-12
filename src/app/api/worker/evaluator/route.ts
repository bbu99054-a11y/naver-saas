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

export const maxDuration = 60;

async function handler(req: Request) {
  const startTime = Date.now();
  console.log('[Evaluator Worker] Start:', new Date().toISOString());

  let body;
  try {
    body = await req.json();
    const { jobId, draftText, prompt, userId } = body;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    let aiModel;
    if (dbUser?.plan_type === 'premium') {
      aiModel = anthropic('claude-5-sonnet-latest');
    } else if (dbUser?.plan_type === 'pro') {
      aiModel = openai('gpt-5.6-sol');
    } else {
      aiModel = openai('gpt-5.6-luna');
    }

    const evaluatorSystemPrompt = `너는 15년 경력의 전문직 컴플라이언스(광고법) 최고 책임자 겸 최종 검수 에이전트(Evaluator)야. 
주어진 원고 초안을 스캔하고 광고법 위반 사항이나 부적절한 표현이 있는지 꼼꼼하게 검토해.`;

    console.log(`[Evaluator Worker] Before generateObject Time: ${(Date.now() - startTime) / 1000}s`);

    const result = await withRetry(() => withTimeout(generateObject({
      model: aiModel,
      temperature: 0.2,
      schema: z.object({
        isViolating: z.boolean().describe('광고법 위반 사항이나 심각한 문맥 오류가 발견되면 true, 문제가 없으면 false'),
        correctedText: z.string().optional().describe('isViolating이 true일 경우에만 위반 사항을 수정한 최종 HTML 원고 전체를 제공 (마크다운 없이 순수 HTML 태그만 사용)'),
        finalTitle: z.string().describe('원고 내용에 어울리는 SEO 최적화된 매력적인 블로그 제목 (단순 키워드 나열 지양)')
      }),
      system: evaluatorSystemPrompt,
      prompt: `[타겟 키워드: ${prompt}]\n[원고 초안]\n${draftText}\n\n위 초안을 검수하고 결과를 반환해.`,
    }), 55000), 3, 1000);
    
    console.log(`[Evaluator Worker] After generateObject Time: ${(Date.now() - startTime) / 1000}s`);

    const { isViolating, correctedText, finalTitle } = result.object;
    
    // 위반 사항이 없거나 수정본이 누락된 경우 즉시 원본 초안 채택 (속도 비약적 향상)
    let rawText = (isViolating && correctedText && correctedText.trim().length > 0) ? correctedText : draftText;

    // 만약 AI가 굳이 마크다운 백틱을 포함해서 응답했다면 그 안의 내용만 안전하게 추출
    const htmlMatch = rawText.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (htmlMatch) {
      rawText = htmlMatch[1];
    }

    const finalHtml = rawText.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').trim();
    const generatedTitle = finalTitle || `${prompt} (SEO 최적화)`;

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } }
    });

    await prisma.article.updateMany({
      where: { job_id: jobId },
      data: {
        content_html: finalHtml,
        title: generatedTitle,
        status: 'COMPLETED'
      }
    });

    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await kv.set(`job:${jobId}`, { status: 'COMPLETED' });
    }

    console.log(`[Evaluator Worker] End Time: ${(Date.now() - startTime) / 1000}s`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Evaluator Worker] Error:', error);
    console.log(`[Evaluator Worker] Error Time: ${(Date.now() - startTime) / 1000}s`);
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
