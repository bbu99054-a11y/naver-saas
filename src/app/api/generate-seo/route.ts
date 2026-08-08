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

    let profileFooterPrompt = '';
    let ragInjection = '';

    if (profile) {
      profileFooterPrompt = `
<footer_cta>
글의 가장 마지막 부분에는 항상 아래 사무소 정보를 깔끔한 안내 박스 형태로 덧붙여줘.
- 이름/상호: ${profile.store_name || ''}
- 전문 분야: ${profile.industry || ''}
- 주소: ${profile.address || ''}
- 전화번호: ${profile.phone || ''}
- 예약/지도: ${profile.reservation_link || ''}

[필수 면책 조항] 푸터 바로 위에 다음 문구를 작고 흐린 글씨로 반드시 삽입해: 
"본 포스팅은 일반적인 정보 제공을 목적으로 하며, 구체적인 사안에 따라 법적 판단이 달라질 수 있으므로 반드시 정식 상담을 받아보시기 바랍니다."
</footer_cta>
`;

      if (profile.about_us) {
        ragInjection = `
<expert_persona>
아래는 작성자(전문가)의 실제 프로필, 철학, 승소 사례, 전문 지식입니다. 
이 내용을 글 중간중간에 아주 자연스럽게 녹여내어, 기계가 쓴 글이 아니라 '전문가가 직접 자신의 노하우를 풀어낸 글'처럼 완벽하게 구성해.
---
${profile.about_us}
---
</expert_persona>
`;
      }
    }

    let experienceInjection = '';
    if (experience && experience.trim() !== '') {
      experienceInjection = `
<expert_experience>
작성자의 실제 에피소드: "${experience}"
</expert_experience>
`;
    } else {
      experienceInjection = `
<expert_experience>
작성자의 실제 에피소드는 제공되지 않았으므로, 타겟 키워드와 관련된 가장 보편적이고 사실적인 가상의 의뢰인 상담 사례 하나를 1인칭 시점("얼마 전 저희 사무소를 찾아주신 의뢰인이 계셨습니다...")으로 창작하여 적용할 것.
</expert_experience>
`;
    }

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
<serp_context>
[실시간 네이버 상위 5개 블로그 분석 데이터 (이 규칙을 반드시 따를 것)]
- 권장 글자 수: 약 ${serpData.averageTextLength}자 내외로 작성해.
- 권장 이미지 수: 약 ${serpData.averageImageCount}장의 이미지가 필요해.
- 이미지 맥락 추천: 상위 블로거들은 주로 이런 사진을 넣었어 -> ${serpData.imageContexts.join(', ')}.
- 자주 쓰이는 목차(H2): ${serpData.commonHeaders.join(', ')}. 이 구조를 자연스럽게 H2 태그로 반영해.
</serp_context>
`;

      const activeTemplates = [];
      activeTemplates.push(getInfoBoxTemplate(mainColor)); // 기본 정보 박스는 항상 포함
      activeTemplates.push(getStepByStepTemplate(mainColor)); // 단계별 가이드 포함

      if (serpData.recommendedComponents.useTable) activeTemplates.push(getTableTemplate(mainColor));
      if (serpData.recommendedComponents.useQuote) activeTemplates.push(getQuoteTemplate(mainColor));
      if (serpData.recommendedComponents.useDivider) activeTemplates.push(getDividerTemplate(mainColor));

      designInjection = `
<design_templates>
이번 포스팅의 메인 컬러 테마는 ${mainColor} 입니다.
아래 제공된 HTML 템플릿 코드들을 반드시 활용하여 시각적으로 아름답고 전문적인 글을 구성해 주세요.
템플릿 형태를 절대 임의로 변형하지 말고, 안의 텍스트(괄호 처리된 부분)만 글 문맥에 맞게 수정해서 그대로 삽입해.

${activeTemplates.join('\n\n')}
</design_templates>
`;
    }

    // 내부 링크(Internal Linking) 주입 (SEO 2026 트렌드)
    let internalLinkInjection = '';
    if (pastArticles && pastArticles.length > 0) {
      const links = pastArticles.map((a: any) => {
        const cleanTitle = a.title.replace(' (SEO 최적화)', '');
        return `- <a href="https://blog.naver.com">${cleanTitle}</a>`;
      }).join('\n');
      
      internalLinkInjection = `
<internal_links>
[중요 지시사항: 내부 링크 삽입]
아래 제공된 과거 글 링크들을 본문 내에서 서로 '완전히 다른 문단'에 하나씩 분산시켜서 자연스럽게 문맥에 녹여 삽입해.
절대 두 링크를 연달아 배치하거나 목록 형태로 나열하지 마.
또한, "내부 링크 삽입 시", "(SEO 최적화)" 같은 시스템 지시어나 부연 설명을 본문에 절대 텍스트로 출력하지 마. 오직 자연스러운 문맥 속에 링크만 스며들게 해.

삽입할 링크 목록:
${links}
</internal_links>
`;
    }

    let terminologyStrictness = '';
    const industryForTerm = profile?.industry || '';
    if (industryForTerm.includes('세무사') || industryForTerm.includes('회계사')) {
      terminologyStrictness = `[세무사/회계사 용어 엄격성]\n- 세법 용어(소득공제, 세액공제, 감면, 비과세, 경정청구 등)를 절대 뭉뚱그려 혼용하지 말고, 과세표준 적용인지 산출세액 적용인지 명확하고 엄격하게 분리하여 작성해.`;
    } else if (industryForTerm.includes('변호사') || industryForTerm.includes('법률')) {
      terminologyStrictness = `[법률 용어 엄격성]\n- 법률 용어(벌금/과태료/과징금, 해제/해지, 무효/취소 등)의 법적 효력 차이를 절대 혼용하지 말고 명확하고 엄격하게 구분하여 작성해.`;
    } else if (industryForTerm.includes('노무사')) {
      terminologyStrictness = `[노무 용어 엄격성]\n- 노동법 용어(해고/권고사직/퇴사, 임금/수당/퇴직금 등)의 법적 요건 차이를 엄격히 구분하여 작성해.`;
    } else {
      terminologyStrictness = `[전문 용어 엄격성]\n- 도메인 전문 용어들을 일반인처럼 뭉뚱그려 쓰지 말고, 전문가적 관점에서 정확하고 엄격하게 분리하여 작성해.`;
    }

    const systemPrompt = `
너는 대한민국 상위 1% 네이버 블로그 SEO 전문가이자 프로 카피라이터야. 네이버의 C-Rank와 DIA 알고리즘을 완벽히 이해하고 전문직(변호사, 세무사, 의사 등)에 최적화된 글을 작성해야 해.
글은 반드시 사용자의 검색 의도를 파악한 '정보성' 혹은 '직접 경험한 듯한 후기성'의 자연스러운 톤앤매너(${tone || '신뢰감을 주는 전문가 톤'})로 작성되어야 해. 

<anti_hallucination_guideline>
1. CoT (Chain of Thought) 팩트 체크 강제:
반드시 HTML 본문을 작성하기 전에, <div style="display: none;" id="fact-check-memo"> </div> 태그 안에 타겟 키워드와 관련된 핵심 세무/법률 용어들의 정의와 RAG 검색 수치를 명확히 분리하여 메모(팩트 체크)를 먼저 작성해. 이 메모를 완료한 후에만 본격적인 HTML 글을 작성해.
2. 수치 날조 절대 금지 (Strict Grounding):
본문에 들어가는 수치(세율, 공제 한도 금액, 과태료 등)나 법조항 번호는 오직 제공된 [Tavily Search] 데이터에만 기반해야 해. 제공되지 않은 구체적 수치는 절대 LLM의 지식으로 임의 생성(날조)하지 말고 일반적인 개념 설명으로 대체해.
3. 용어 엄격성:
${terminologyStrictness}
</anti_hallucination_guideline>

<compliance>
[전문직 광고법 준수 - 절대 금지어 목록]
- "무조건 승소", "100% 절세", "국내 최고", "단연코 1위", "반드시 해결"과 같은 과장/보장성 단어는 대한변호사협회 및 세무사회 광고 규정 위반이므로 절대 사용하지 마.
- 기계적인 상투어("안녕하세요", "오늘은 ~에 대해 알아보겠습니다", "결론부터 말씀드리자면") 절대 사용 금지.
</compliance>

${ragInjection}
${experienceInjection}
${contextInjection}
${designInjection}
${internalLinkInjection}
${profileFooterPrompt}

<html_constraints>
1. 1인칭 스토리텔링 100% 강제 (최우선): <expert_experience> 데이터를 바탕으로, 글의 서론 직후나 본론 중간에 네이버 인용구(<blockquote>)나 형광펜 효과를 적용하여 "실제로 최근 저희 사무소를 찾아주신 의뢰인 사례를 말씀드리면..."과 같은 1인칭 화법의 스토리텔링 문단을 무조건 1개 이상 필수 배치해.
2. 마크다운 안됨: 순수한 HTML 코드로만 제공. <html>, <body>, \`\`\`html 같은 코드 블럭 절대 금지.
3. 네이버 에디터 호환성: display: flex, display: grid, position: absolute 같이 네이버 스마트에디터에서 깨지는 CSS 속성은 절대 사용 금지. 오직 기본 margin, padding, text-align, color, background-color 등 호환되는 안전한 인라인 CSS만 사용해.
4. 제목 금지: <h1> 쓰지 마. 오직 <h2>와 <h3> 태그만 사용. 
5. 트렌디한 블로그 디자인: 전체 문단(<p>)에 \`text-align: center; line-height: 2.0; font-size: 16px; margin-bottom: 24px;\` 기본 적용. 헤딩(<h2>, <h3>) 앞에 눈에 띄는 이모지 필수.
6. 형광펜 강조: 핵심 내용에는 형광펜 효과(\`<span style="background-color: #fffbeb; padding: 2px 6px; font-weight: bold; color: #1e40af; border-radius: 4px;">...</span>\`)를 적극 사용.
7. 이모지 적극 사용: 💡, 🔥, ✨, 📌 등을 적절히 배치해 가독성을 높임.
8. APB 프레임워크: 도입부는 문제 제기 - 해결책 제시 - 브릿지로 구성해 7초 이내 이탈 방지.
9. 시각 자료: 서론이나 본론 중간, 시각 자료가 필요한 곳에 고품질 실사 이미지 2장을 필수 삽입해. 태그 형식: <img src="https://naver-saas.vercel.app/api/unsplash?query={문맥에_맞는_영문_명사_1개}" alt="{설명}" style="width:100%; max-width: 600px; display: block; margin: 30px auto; border-radius:12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">. {문맥에_맞는_영문_명사_1개} 부분에는 'lawyer', 'tax', 'office', 'contract' 등 상황에 맞는 단일 영문 명사 1개만 넣어.
</html_constraints>
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
        // 직군별 공공/국가 도메인 맵핑 로직
        let includeDomains: string[] = [];
        const industry = profile?.industry || '';
        
        if (industry.includes('변호사') || industry.includes('법률')) {
          includeDomains = ['law.go.kr', 'scourt.go.kr', 'ccourt.go.kr', 'ftc.go.kr', 'likms.assembly.go.kr', 'kipris.or.kr', 'kipo.go.kr'];
        } else if (industry.includes('세무사') || industry.includes('회계사')) {
          includeDomains = ['txsi.hometax.go.kr', 'nts.go.kr', 'tt.go.kr', 'moef.go.kr', 'law.go.kr'];
        } else if (industry.includes('노무사')) {
          includeDomains = ['moel.go.kr', 'nlrc.go.kr', 'comwel.or.kr', 'law.go.kr'];
        } else if (industry.includes('행정사')) {
          includeDomains = ['acrc.go.kr', 'hikorea.go.kr', 'moleg.go.kr', 'mfds.go.kr', 'law.go.kr'];
        } else {
          // 애매하거나 기타 직종일 경우 법률의 기본인 국가법령정보센터만 할당 (Default Fallback)
          includeDomains = ['law.go.kr'];
        }

        // 1차 검색 (도메인 강제)
        let searchRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: prompt,
            search_depth: 'basic',
            include_answer: true,
            max_results: 3,
            include_domains: includeDomains
          }),
        });
        
        let searchData = await searchRes.json();

        // 2차 검색 (Fallback: 만약 결과가 0건이면 도메인 제한 풀고 재검색)
        if (!searchData.results || searchData.results.length === 0) {
          searchRes = await fetch('https://api.tavily.com/search', {
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
          searchData = await searchRes.json();
        }

        if (searchData && searchData.results && searchData.results.length > 0) {
          const formattedResults = searchData.results.map((r: any) => `- 제목: ${r.title}\n  내용: ${r.content}\n  출처: ${r.url}`).join('\n\n');
          searchContext = `\n[${prompt} 관련 공식/최신 정보 요약 (Tavily Search)]\n${searchData.answer || ''}\n\n[관련 기사/웹 문서]\n${formattedResults}\n\n이 공식 데이터를 본문 작성 시 참고하고 환각 없이 출처 기반으로 작성해.`;
        }
      } catch (e) {
        console.error('Tavily search failed:', e);
      }
    } else {
      searchContext = `\n[알림: TAVILY_API_KEY가 없어 실시간 웹 검색이 생략되었습니다. 일반적인 지식을 바탕으로 작성하세요.]`;
    }

    const result = streamText({
      model: aiModel,
      temperature: 0.75, // 동일 키워드라도 유니크한 문장 구조를 만들기 위해 약간 높임
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
