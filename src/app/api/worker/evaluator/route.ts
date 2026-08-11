import { verifySignatureAppRouter } from '@upstash/qstash/nextjs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { kv } from '@vercel/kv';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';

export const maxDuration = 60;

async function handler(req: Request) {
  let body;
  try {
    body = await req.json();
    const { jobId, draftText, prompt, userId } = body;

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    let aiModel = dbUser?.plan_type === 'pro' || dbUser?.plan_type === 'premium' 
      ? anthropic('claude-5-sonnet-latest') 
      : google('gemini-1.5-flash');

    const evaluatorSystemPrompt = `너는 15년 경력의 전문직 컴플라이언스(광고법) 최고 책임자 겸 최종 검수 에이전트(Evaluator)야. 
주어진 원고 초안을 스캔하고 위반 사항이 발견되면 스스로 재작성(Self-Correction)해. 
위반 사항이 없다면 HTML 태그나 디자인을 전혀 훼손하지 말고 초안 그대로 출력해.`;

    const result = await generateText({
      model: aiModel,
      temperature: 0.2,
      system: evaluatorSystemPrompt,
      prompt: `[원고 초안]\n${draftText}\n\n위 초안을 검수하고 최종 HTML 원고를 출력해줘.`,
    });

    const finalHtml = result.text.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').trim();
    const titleMatch = result.text.match(/<post_title>([\s\S]*?)<\/post_title>/i);
    const generatedTitle = titleMatch && titleMatch[1] ? titleMatch[1].trim() : `${prompt} (SEO 최적화)`;

    // 1. 크레딧 차감
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { decrement: 1 } }
    });

    // 2. 최종 상태 업데이트
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

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Evaluator Worker Error:', error);
    if (body?.jobId) {
      await prisma.article.updateMany({
        where: { job_id: body.jobId },
        data: { status: 'ERROR', error_message: error.message }
      });
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        await kv.set(`job:${body.jobId}`, { status: 'ERROR', error_message: error.message });
      }
    }
    // Return 200 to prevent QStash infinite retries
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}

export const POST = process.env.NODE_ENV === 'development' ? handler : verifySignatureAppRouter(handler);
