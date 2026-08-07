import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'
import { google } from '@ai-sdk/google'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    }

    // 크레딧, 유저 검증, 프로필 및 내부링크용 과거 기사 조회를 병렬(Promise.all)로 처리하여 지연 시간 단축
    const [dbUser, profile, pastArticles] = await Promise.all([
      prisma.user.upsert({
        where: { id: user.id },
        update: {},
        create: {
          id: user.id,
          email: user.email || '',
          credits: 5000,
          plan_type: 'free'
        }
      }),
      prisma.profile.findUnique({
        where: { user_id: user.id }
      }),
      // 내부 링크 자동 생성을 위해 과거 작성된 원고 2개 랜덤/최신 조회
      prisma.article.findMany({
        where: { user_id: user.id, status: 'DRAFT' },
        orderBy: { created_at: 'desc' },
        take: 2,
        select: { id: true, title: true, target_keyword: true }
      })
    ])

    if (dbUser.credits <= 0) {
      return NextResponse.json({ error: '크레딧이 부족합니다. 요금제를 업그레이드해주세요.' }, { status: 403 })
    }

    const body = await req.json()
    // prompt는 useCompletion에서 자동으로 전달되는 텍스트 (여기서는 타겟 키워드와 톤 등)
    const { prompt, tone, model, experience } = body

    if (!prompt) {
      return NextResponse.json({ error: '타겟 키워드가 필요합니다.' }, { status: 400 })
    }

    if (!experience) {
      return NextResponse.json({ error: '1줄 경험담을 입력해주세요.' }, { status: 400 })
    }

    let profileFooterPrompt = '';
    let ragInjection = '';

    if (profile) {
      profileFooterPrompt = `
[매장/사무소 CTA 푸터 정보]
글의 가장 마지막 부분에는 항상 아래 사무소 정보를 깔끔한 안내 박스 형태로 덧붙여줘.
- 이름/상호: ${profile.store_name || ''}
- 전문 분야: ${profile.industry || ''}
- 주소: ${profile.address || ''}
- 전화번호: ${profile.phone || ''}
- 예약/지도: ${profile.reservation_link || ''}
`;

      if (profile.about_us) {
        ragInjection = `
[🌟 최우선 반영 RAG 지식베이스 (전문가 톤앤매너 유지)]
아래는 작성자(전문가)의 실제 프로필, 철학, 승소 사례, 전문 지식입니다. 
이 내용을 글 중간중간에 아주 자연스럽게 녹여내어, 기계가 쓴 글이 아니라 '전문가가 직접 자신의 노하우를 풀어낸 글'처럼 완벽하게 구성해.
---
${profile.about_us}
---
`;
      }
    }

    let experienceInjection = `
[D.I.A.+ 독창성 확보를 위한 실제 사례/판례 데이터]
작성자의 실제 에피소드: "${experience}"
이 내용을 글의 서론이나 본론 적절한 곳에 아주 자연스럽게 녹여내어, 기계가 쓴 글이 아니라 '전문가가 직접 다룬 실제 사례와 인사이트'처럼 보이게 만들어. 
`;

    const { scrapeNaverSerpContext } = await import('@/lib/scraper');
    const { 
      getRandomColor, getInfoBoxTemplate, getQuoteTemplate, 
      getTableTemplate, getDividerTemplate, getStepByStepTemplate 
    } = await import('@/lib/templates');
    
    const serpData = await scrapeNaverSerpContext(prompt);
    const mainColor = getRandomColor();

    let contextInjection = '';
    let designInjection = '';

    if (serpData) {
      contextInjection = `
[실시간 네이버 상위 5개 블로그 분석 데이터 (이 규칙을 반드시 따를 것)]
- 권장 글자 수: 약 ${serpData.averageTextLength}자 내외로 작성해.
- 권장 이미지 수: 약 ${serpData.averageImageCount}장의 이미지가 필요해. 글 중간중간에 <div style="background:#f1f5f9; padding:20px; text-align:center; color:#64748b; margin:10px 0; border-radius:8px;">[이미지 삽입 권장: OOO 사진]</div> 와 같은 형태의 HTML 플레이스홀더를 정확히 ${serpData.averageImageCount}번 삽입해줘.
- 이미지 맥락 추천: 상위 블로거들은 주로 이런 사진을 넣었어 -> ${serpData.imageContexts.join(', ')}. 플레이스홀더 텍스트(OOO 사진) 작성 시 이 맥락을 적극 반영해.
- 자주 쓰이는 목차(H2): ${serpData.commonHeaders.join(', ')}. 이 구조를 자연스럽게 H2 태그로 반영해.
`;

      const activeTemplates = [];
      activeTemplates.push(getInfoBoxTemplate(mainColor)); // 기본 정보 박스는 항상 포함
      activeTemplates.push(getStepByStepTemplate(mainColor)); // 단계별 가이드 포함

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

    // 내부 링크(Internal Linking) 주입 (SEO 2026 트렌드)
    let internalLinkInjection = '';
    if (pastArticles && pastArticles.length > 0) {
      const links = pastArticles.map((a: any) => `- [${a.title}](https://blog.naver.com)`).join('\n'); // 임시 네이버 링크 구조
      internalLinkInjection = `
[SEO 주제 권위(Topical Authority)를 위한 자동 내부 링크]
본문 내용과 문맥이 이어지는 적절한 곳(중간 혹은 끝 부분)에 아래 과거에 작성된 칼럼을 "함께 읽으면 좋은 글" 또는 자연스러운 하이퍼링크 형태로 1~2개 소개시켜줘. (단, 실제 HTML <a> 태그를 써서 링크를 걸어줘)
${links}
`;
    }

    const systemPrompt = `
너는 대한민국 상위 1% 네이버 블로그 SEO 전문가이자 프로 카피라이터야. 네이버의 C-Rank와 DIA 알고리즘을 완벽히 이해하고 전문직(변호사, 세무사, 의사 등)에 최적화된 글을 작성해야 해.
글은 반드시 사용자의 검색 의도를 파악한 '정보성' 혹은 '직접 경험한 듯한 후기성'의 자연스러운 톤앤매너(${tone || '신뢰감을 주는 전문가 톤'})로 작성되어야 해. 

${ragInjection}

${experienceInjection}

${contextInjection}

${designInjection}

${internalLinkInjection}

${profileFooterPrompt}

[출력 형식 및 제약사항]
124. 출력 형식은 마크다운이 아닌 순수한 HTML 코드로만 제공해. 단, <html>, <body> 같은 래퍼 태그 없이 내부 본문 태그만 출력해. \`\`\`html 같은 코드 블럭도 절대 쓰지 마.
125. 제목(<h1>)은 쓰지 마. 헤딩은 오직 <h2>와 <h3> 태그로만 구조화를 해. 
126. 중요한 핵심 정보가 담긴 문장에는 <strong> 태그를 적절히 사용해 강조해.
127. 모바일 환경의 가독성을 위해 문단(<p>)을 짧게 구성하고 간격을 주며, 제공된 디자인 템플릿들을 글 문맥에 맞춰 적재적소에 배치해.
128. 도입부: APB 프레임워크(문제 제기 - 해결책 제시 - 브릿지)를 사용하여 독자가 7초 이내에 이탈하지 않도록 강력한 흥미를 유발해.
129. [중요] 글의 서론이나 본론 중간중간 시각 자료가 필요한 곳에 AI 이미지를 2장 삽입해. 이미지를 삽입할 때는 반드시 다음과 같은 HTML 태그를 사용해: <img src="https://image.pollinations.ai/prompt/{장면에_맞는_영문_프롬프트}?width=800&height=600&nologo=true" alt="{설명}" style="width:100%; border-radius:8px; margin: 15px 0;">. {장면에_맞는_영문_프롬프트} 부분에는 띄어쓰기 대신 %20을 사용하여 영문 프롬프트를 넣어.
130. [중요] 제공된 '최신 뉴스/트렌드' 데이터를 바탕으로 글을 작성하며, 실제 팩트 기반의 내용과 출처를 본문 어딘가에 자연스럽게 녹여내.
    `;

    let aiModel;
    if (model === 'gpt-5.6-luna') {
      aiModel = openai('gpt-5.6-luna'); // 가성비 GPT 모델
    } else if (model === 'gemini-3.6-flash') {
      aiModel = google('gemini-3.6-flash'); // 가장 빠른 모델
    } else {
      aiModel = anthropic('claude-5-sonnet-latest'); // 기본 최고 품질 모델 (가상의 Claude 5)
    }

    // 1. Tavily API로 최신 뉴스/트렌드 사전 검색 (RAG)
    let searchContext = '';
    if (process.env.TAVILY_API_KEY) {
      try {
        const searchRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: prompt,
            search_depth: 'basic',
            include_answer: true,
            max_results: 3
          }),
        });
        const searchData = await searchRes.json();
        if (searchData && searchData.results) {
          const formattedResults = searchData.results.map((r: any) => `- 제목: ${r.title}\n  내용: ${r.content}\n  출처: ${r.url}`).join('\n\n');
          searchContext = `\n[${prompt} 관련 최신 뉴스/트렌드 요약 (Tavily Search)]\n${searchData.answer || ''}\n\n[관련 기사/웹 문서]\n${formattedResults}\n\n이 최신 정보를 본문 작성 시 참고하고 반드시 출처를 표기해.`;
        }
      } catch (e) {
        console.error('Tavily search failed:', e);
      }
    } else {
      searchContext = `\n[알림: TAVILY_API_KEY가 없어 실시간 웹 검색이 생략되었습니다. 일반적인 지식을 바탕으로 작성하세요.]`;
    }

    const result = streamText({
      model: aiModel,
      system: systemPrompt + searchContext,
      prompt: `타겟 키워드: ${prompt}\n\n위 지침에 맞춰 완벽한 네이버 블로그용 HTML 본문을 작성해줘.`,
      async onFinish({ text }) {
        try {
          // 1. 크레딧 차감
          await prisma.user.update({
            where: { id: user.id },
            data: { credits: { decrement: 1 } }
          });

          // 2. 프로젝트 및 아티클 저장
          let project = await prisma.project.findFirst({
            where: { user_id: user.id },
            orderBy: { created_at: 'asc' }
          });

          if (!project) {
            project = await prisma.project.create({
              data: {
                user_id: user.id,
                project_name: '기본 프로젝트',
              }
            });
          }

          await prisma.article.create({
            data: {
              user_id: user.id,
              project_id: project.id,
              title: `${prompt} (SEO 최적화)`,
              target_keyword: prompt,
              content_html: text,
              status: 'DRAFT',
            }
          });
        } catch (error) {
          console.error('Failed to update DB onFinish:', error);
        }
      }
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('Generation API error:', error);
    const errorMessage = error.message || error.toString() || '알 수 없는 서버 에러가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
