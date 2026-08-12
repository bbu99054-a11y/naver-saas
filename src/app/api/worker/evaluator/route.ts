import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';
import { generateText } from 'ai';
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
주어진 원고 초안을 스캔하고 위반 사항이 발견되면 스스로 재작성(Self-Correction)해. 
위반 사항이 없다면 HTML 태그나 디자인을 전혀 훼손하지 말고 초안 그대로 출력해.

[매우 중요]
검수 보고서나 부가적인 설명(예: 어떤 부분을 수정했는지 등)은 절대 작성하지 마세요. 
오직 검수 및 수정이 완료된 최종 HTML 코드만 마크다운 코드블록이나 부연 설명 없이 순수 텍스트로 출력하세요.`;

    console.log(`[Evaluator Worker] Before generateText Time: ${(Date.now() - startTime) / 1000}s`);

    const result = await withRetry(() => withTimeout(generateText({
      model: aiModel,
      temperature: 0.2,
      // @ts-ignore
      maxTokens: 8192,
      system: evaluatorSystemPrompt,
      prompt: `[원고 초안]\n${draftText}\n\n위 초안을 검수하고 최종 HTML 원고를 출력해줘.`,
    }), 55000), 3, 1000);
    
    console.log(`[Evaluator Worker] After generateText Time: ${(Date.now() - startTime) / 1000}s`);

    let rawText = result.text;
    // 만약 AI가 굳이 마크다운 백틱을 포함해서 응답했다면 그 안의 내용만 안전하게 추출
    const htmlMatch = rawText.match(/```(?:html)?\s*([\s\S]*?)```/i);
    if (htmlMatch) {
      rawText = htmlMatch[1];
    }

    const finalHtml = rawText.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').trim();
    const titleMatch = rawText.match(/<post_title>([\s\S]*?)<\/post_title>/i);
    const generatedTitle = titleMatch && titleMatch[1] ? titleMatch[1].trim() : `${prompt} (SEO 최적화)`;

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
