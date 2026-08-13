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
    const { jobId, prompt, tone, experience, outline, citations, userId, serpData } = body;

    const dbUser = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { profile: true } 
    });
    
    // 강제: 모든 유저가 gpt-5.6-luna (Phase 2 복구를 위한 모델 고정)
    const aiModel = openai('gpt-5.6-luna');

    const profile = dbUser?.profile;

    // 1. Profile Footer (Tuned for Professionals)
    let profileFooterPrompt = '';
    if (profile) {
      profileFooterPrompt = `
[전문가/사무소 CTA 푸터 정보]
글의 가장 마지막 부분에는 항상 아래 사무소 정보를 무겁고 신뢰감 있는 안내 박스 형태로 덧붙여줘.
- 법무법인/세무회계사무소 명: ${profile.store_name || ''}
- 전문 분야: ${profile.industry || ''}
- 사무소 주소: ${profile.address || ''}
- 전문가 직통 번호: ${profile.phone || ''}
- 1:1 전문 상담 링크 (예약/지도): ${profile.reservation_link || ''}
`;
    }

    let experienceInjection = `
[D.I.A.+ 독창성 확보를 위한 1줄 경험 데이터]
작성자의 실제 에피소드: "${experience || '자연스러운 관련 경험담을 하나 지어내서 포함'}"
이 에피소드를 글의 서론이나 본론 적절한 곳에 아주 자연스럽게 녹여내어, 기계가 쓴 글이 아니라 '전문가가 직접 쓴 생생한 경험담'처럼 보이게 만들어. 
`;

    // 2. Templates & Design Injection (using serpData from Planner)
    const { 
      getRandomColor, getInfoBoxTemplate, getQuoteTemplate, 
      getTableTemplate, getDividerTemplate, getStepByStepTemplate 
    } = await import('@/lib/templates');
    
    const mainColor = getRandomColor();
    let designInjection = '';

    if (serpData) {
      const activeTemplates = [];
      activeTemplates.push(getInfoBoxTemplate(mainColor));
      activeTemplates.push(getStepByStepTemplate(mainColor));

      if (serpData.recommendedComponents.useTable) activeTemplates.push(getTableTemplate(mainColor));
      if (serpData.recommendedComponents.useQuote) activeTemplates.push(getQuoteTemplate(mainColor));
      if (serpData.recommendedComponents.useDivider) activeTemplates.push(getDividerTemplate(mainColor));

      designInjection = `
[다이내믹 디자인 시스템 템플릿]
이번 포스팅의 메인 컬러 테마는 ${mainColor} 입니다.
아래 제공된 HTML 템플릿 코드들을 반드시 활용하여 시각적으로 아름답고 전문적인 글을 구성해 주세요.
템플릿 형태를 절대 임의로 변형하지 말고, 안의 텍스트(괄호 처리된 부분)만 글 문맥에 맞게 수정해서 그대로 삽입해.

${activeTemplates.join('\n\n')}
`;
    }

    // 3. System Prompt Assembly (Phase 2 복구 130 룰)
    const systemPrompt = `
너는 대한민국 상위 1% 네이버 블로그 SEO 전문가이자 프로 카피라이터야. 네이버의 C-Rank와 DIA 알고리즘을 완벽히 이해하고 이에 최적화된 글을 작성해야 해.
글은 반드시 사용자의 검색 의도를 파악한 '정보성' 혹은 '직접 경험한 듯한 후기성'의 자연스러운 톤앤매너(${tone || '신뢰감을 주는 전문직 블로거 톤'})로 작성되어야 해. 
어색한 키워드 반복(Keyword Stuffing)을 피하고, 문맥에 맞는 잠재 의미(LSI) 키워드들을 자연스럽게 녹여내.

${experienceInjection}

${designInjection}

${profileFooterPrompt}

[출력 형식 및 제약사항 (우선순위 1순위: 절대 복종)]
124. 출력 형식은 마크다운이 아닌 순수한 HTML 코드로만 제공해. 단, <html>, <body> 같은 래퍼 태그 없이 내부 본문 태그만 출력해. \`\`\`html 같은 코드 블럭도 절대 쓰지 마.
125. 제목(<h1>)은 쓰지 마. 헤딩은 오직 <h2>와 <h3> 태그로만 구조화를 해. 
126. 중요한 핵심 정보가 담긴 문장에는 <strong> 태그를 적절히 사용해 강조해.
127. 모바일 환경의 가독성을 위해 문단(<p>)을 짧게 구성하고 간격을 주며, 제공된 디자인 템플릿들을 글 문맥에 맞춰 적재적소에 배치해.
128. 도입부: APB 프레임워크(문제 제기 - 해결책 제시 - 브릿지)를 사용하여 독자가 7초 이내에 이탈하지 않도록 강력한 흥미를 유발해.
129. [중요] 글의 서론이나 본론 중간중간 시각 자료가 필요한 곳에 AI 이미지를 2장 삽입해. 이미지를 삽입할 때는 반드시 다음과 같은 HTML 태그를 사용해: <img src="https://image.pollinations.ai/prompt/{장면에_맞는_영문_프롬프트}?width=800&height=600&nologo=true" alt="{설명}" style="width:100%; border-radius:8px; margin: 15px 0;">. {장면에_맞는_영문_프롬프트} 부분에는 띄어쓰기 대신 %20을 사용하여 영문 프롬프트를 넣어.
130. [중요] 제공된 '최신 뉴스/트렌드' 데이터를 바탕으로 글을 작성하며, 실제 팩트 기반의 내용과 출처를 본문 어딘가에 자연스럽게 녹여내.
`;
    
    let searchContext = '';
    if (citations && citations.length > 0) {
       searchContext = citations.map((c: any, i: number) => `[출처 ${i + 1}] 제목: ${c.title}\n내용 요약: ${c.content}`).join('\n\n');
       searchContext = `\n[Tavily RAG 검색된 최신 팩트 데이터]\n${searchContext}\n`;
    }

    // 4. 기획안(Outline)과 시스템 룰 간의 충돌 방지 명시
    const outlineContext = outline ? `\n\n[Planner Agent가 설계한 글의 개요(Skeleton)]\n${outline}\n\n위 개요의 기승전결 구조를 바탕으로 글을 쓰되, 반드시 위의 [출력 형식 및 제약사항] 130 룰을 개요보다 최우선으로 완벽히 지켜서(HTML 태그 사용, 이미지 삽입 등) 최종 초안을 작성할 것.` : '';

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
