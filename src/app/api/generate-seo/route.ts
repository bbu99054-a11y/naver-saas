import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { streamText, generateText, generateObject } from 'ai'
import { z } from 'zod'
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

    let dbUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || '',
          credits: 5000,
          plan_type: 'free'
        }
      });
    }

    const [profile, pastArticles] = await Promise.all([
      prisma.profile.findUnique({
        where: { user_id: user.id }
      }),
      // 내부 링크 자동 생성을 위해 과거 작성된 원고 5개 최근순 조회 (문맥 필터링용)
      prisma.article.findMany({
        where: { user_id: user.id, status: 'DRAFT' },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, title: true, target_keyword: true }
      })
    ])

    if (dbUser.credits <= 0) {
      return NextResponse.json({ error: '크레딧이 부족합니다. 요금제를 업그레이드해주세요.' }, { status: 403 })
    }

    const body = await req.json()
    // prompt는 useCompletion에서 자동으로 전달되는 텍스트 (여기서는 타겟 키워드와 톤 등)
    const { prompt, tone, experience } = body

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
      activeTemplates.push(getStepByStepTemplate(mainColor)); // 스마트블록 구조화를 위해 리스트 항상 포함 강제
      activeTemplates.push(getTableTemplate(mainColor)); // 스마트블록 노출을 위해 표(Table) 항상 포함 강제

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
[중요 지시사항: 조건부 내부 링크 삽입]
아래 제공된 과거 글 목록을 확인하고, **현재 작성 중인 타겟 키워드와 문맥상 자연스럽게 이어질 수 있는 글이 있다면 최대 1~2개만 선택**하여 본문에 삽입해.
만약 과거 글 내용이 현재 주제와 전혀 무관하다면(예: 비자 관련 글에 음주운전 링크 삽입 등) **절대로 억지로 삽입하지 말고 완전히 무시해**.
링크를 삽입할 때는 서로 완전히 다른 문단에 분산시키고, "내부 링크 삽입 시" 등의 부연 설명 없이 자연스러운 문맥 속에 스며들게 해.

선택 가능한 과거 링크 후보 목록:
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
너는 최소 15년 경력의 전문 디지털 마케터이자 SEO 최적화 전문가야.
글은 반드시 사용자의 검색 의도를 파악하여 작성하되, 감정적인 호소나 과장된 스토리텔링을 배제하고 객관적이고 차분한 전문가적 톤앤매너로 작성되어야 해. 
절대 한자(Hanja)를 혼용하지 말고 100% 자연스러운 한글로만 작성해 (예: '방치'를 '放置'로 쓰는 식의 기계적인 환각 절대 금지).

<anti_hallucination_guideline>
1. CoT (Chain of Thought) 팩트 체크 강제:
반드시 HTML 본문을 작성하기 전에, <div style="display: none;" id="fact-check-memo"> </div> 태그 안에 타겟 키워드와 관련된 핵심 세무/법률 용어들의 정의와 RAG 검색 수치를 명확히 분리하여 메모(팩트 체크)를 먼저 작성해. 이 메모를 완료한 후에만 본격적인 HTML 글을 작성해.
2. 절대적 사실 기반 생성 (환각 방지):
본문에 들어가는 수치(세율, 공제 한도 금액, 과태료 등)나 법조항, 판례 번호 등은 오직 제공된 [Tavily Search] 데이터에만 기반해야 해. 정보가 부족할 경우 절대 임의로 창작하지 말고, "해당 사안은 구체적인 사실관계에 따라 법리 적용이 달라질 수 있습니다"라는 면책 조항으로 대체해.
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
0. 응답의 가장 첫 줄에 반드시 <post_title>네이버 검색 유저의 클릭을 유도하는 매혹적인 1인칭 후킹 제목</post_title> 을 작성해.
1. 가상 페르소나 시나리오 활용 (허위 사례 금지): 독자의 몰입을 유도하기 위해 "예를 들어, 40대 제조업을 운영하는 A대표님이 2억원의 가지급금이 있다면..."과 같은 구체적인 가상 페르소나를 설정하여 스토리텔링해. 단, 이를 "실제 상담 사례"라고 거짓으로 포장하면 허위 광고가 되므로 반드시 가상의 예시임을 알 수 있게 작성해.
2. 마크다운 안됨: 순수한 HTML 코드로만 제공. <html>, <body>, \`\`\`html 같은 코드 블럭 절대 금지.
3. 네이버 에디터 호환성: display: flex, display: grid, position: absolute 같이 네이버 스마트에디터에서 깨지는 CSS 속성은 절대 사용 금지. 오직 기본 margin, padding, text-align, color, background-color 등 호환되는 안전한 인라인 CSS만 사용해.
4. 제목 금지: <post_title> 태그 외에 본문 안에는 <h1> 쓰지 마. 오직 <h2>와 <h3> 태그만 사용. 
5. 트렌디한 블로그 디자인: 전체 문단(<p>)에 \`text-align: left; word-break: keep-all; line-height: 2.0; font-size: 16px; margin-bottom: 24px;\` 기본 적용. 헤딩(<h2>, <h3>) 앞에 눈에 띄는 이모지 필수.
6. 형광펜 강조: 핵심 내용에는 형광펜 효과(\`<span style="background-color: #fffbeb; padding: 2px 6px; font-weight: bold; color: #1e40af; border-radius: 4px;">...</span>\`)를 적극 사용.
7. 이모지 적극 사용: 💡, 🔥, ✨, 📌 등을 적절히 배치해 가독성을 높임.
8. APB 프레임워크: 도입부는 문제 제기 - 해결책 제시 - 브릿지로 구성해 7초 이내 이탈 방지.
9. 시각 자료: 서론이나 본론 중간, 시각 자료가 필요한 곳에 고품질 실사 이미지 2장을 필수 삽입해. 태그 형식: <img src="https://naver-saas.vercel.app/api/unsplash?query={문맥에_맞는_영문_명사_1개}" alt="{설명}" style="width:100%; max-width: 600px; display: block; margin: 30px auto; border-radius:12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">. {문맥에_맞는_영문_명사_1개} 부분에는 'lawyer', 'tax', 'office', 'contract' 등 상황에 맞는 단일 영문 명사 1개만 넣어.
10. 스마트블록 SEO 최적화 강제: 본론(Body) 작성 시, 단순 텍스트 나열을 피하고 반드시 <design_templates>에 제공된 표(Table) 템플릿과 단계별 가이드(Step-by-step) 리스트 템플릿을 무조건 사용하여 전문 지식을 구조화해.
</html_constraints>
    `;

    let aiModel;
    if (dbUser.plan_type === 'pro' || dbUser.plan_type === 'premium') {
      aiModel = anthropic('claude-5-sonnet-latest'); // 유료 요금제 (최고 품질)
    } else {
      aiModel = google('gemini-3.6-flash'); // 무료 요금제 (가성비 초고속)
    }

    // Phase 0: 경쟁사 상위 5개 블로그 탐색 (SERP Search)
    let serpCompetitorContext = '';
    if (process.env.TAVILY_API_KEY) {
      try {
        const serpRes = await fetch('https://api.tavily.com/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.TAVILY_API_KEY,
            query: prompt,
            search_depth: 'basic',
            include_domains: ['blog.naver.com'],
            max_results: 5
          }),
        });
        const serpData = await serpRes.json();
        if (serpData && serpData.results && serpData.results.length > 0) {
          const serpResults = serpData.results.map((r: any, i: number) => `[경쟁사 ${i + 1}] 제목: ${r.title}\n내용 요약: ${r.content}`).join('\n\n');
          serpCompetitorContext = `\n[현재 네이버 상위 노출 5개 경쟁사 블로그 구조 및 내용]\n${serpResults}\n`;
        }
      } catch (e) {
        console.error('SERP Search failed:', e);
      }
    }

    // Phase 1: Planner Agent (구조 기획 및 파생 검색어 도출)
    let searchQueries = [prompt];
    let outline = '';
    
    try {
      const plannerResult = await generateObject({
        model: aiModel,
        schema: z.object({
          searchQueries: z.array(z.string()).describe('Tavily RAG 검색 품질을 높일 구체적이고 전문적인 파생 검색어 2개 (예: 타겟 키워드와 연관된 특정 법령명이나 판례 키워드)'),
          outline: z.string().describe('상위 노출 블로그들을 분석하여 역설계한 압도적이고 독창적인 서론-본론-결론 뼈대(Skeleton-of-Thought)')
        }),
        prompt: `너는 네이버 상위 1% 마케팅 기획자야. 타겟 키워드: "${prompt}"
${serpCompetitorContext}
위 상위 노출된 경쟁사 글 5개의 흐름을 분석해서, 장점은 취하고 단점은 보완하는 압도적인 [서론-본론-결론] 뼈대(Outline)를 새로 창조해. 절대 뻔한 템플릿을 쓰지 말고, 키워드 검색자의 의도에 완벽히 들어맞는 독창적이고 논리적인 목차를 짜야 해. 
그리고 이 목차를 채우기 위해 외부 RAG 시스템에서 팩트를 긁어올 최적의 파생 검색어 2개도 함께 뽑아줘.`
      });
      searchQueries = plannerResult.object.searchQueries;
      outline = plannerResult.object.outline;
    } catch (e) {
      console.error('Planner Agent failed:', e);
    }

    // 1.5. Tavily API로 다중 파생 검색어 RAG (검색)
    let searchContext = '';
    let tavilyCitations: any = null;
    if (process.env.TAVILY_API_KEY) {
      try {
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
          includeDomains = ['law.go.kr'];
        }

        // Planner가 추출한 다중 검색어 병렬 검색
        const searchPromises = searchQueries.map(query => 
          fetch('https://api.tavily.com/search', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: process.env.TAVILY_API_KEY,
              query: query,
              search_depth: 'basic',
              include_answer: true,
              max_results: 2, // 쿼리당 2개씩 가져옴
              include_domains: includeDomains
            }),
          }).then(res => res.json())
        );
        
        const searchResults = await Promise.all(searchPromises);
        let combinedResults: any[] = [];
        let combinedAnswers = '';
        
        searchResults.forEach(data => {
          if (data && data.results) {
            combinedResults = combinedResults.concat(data.results);
            if (data.answer) combinedAnswers += data.answer + '\\n';
          }
        });

        // URL 기준으로 중복 결과 제거
        const uniqueResults = Array.from(new Map(combinedResults.map(item => [item.url, item])).values());

        if (uniqueResults.length > 0) {
          tavilyCitations = uniqueResults;
          const formattedResults = uniqueResults.map((r: any, i: number) => `[${i + 1}] 제목: ${r.title}\n    내용: ${r.content}\n    출처: ${r.url}`).join('\\n\\n');
          searchContext = `\n[${prompt} 관련 공식/최신 정보 요약 (Tavily Search)]\n${combinedAnswers}\n\n[관련 기사/웹 문서]\n${formattedResults}
          
[출처 인용 강제화 (Citation Enforcer)]
위 공식 데이터를 본문 작성 시 반드시 참고해. 
또한 사실 관계, 판례, 세법, 수치 등을 언급하는 문장 끝에는 반드시 [1], [2] 와 같이 출처 번호를 기재해.
글의 맨 마지막에는 다음 형식으로 참조한 문서들의 링크를 모아 <참고자료> 리스트를 무조건 삽입해.
---
<참고자료>
[1] <a href="URL">제목</a>
[2] <a href="URL">제목</a>`;
        }
      } catch (e) {
        console.error('Tavily search failed:', e);
      }
    } else {
      searchContext = `\n[알림: TAVILY_API_KEY가 없어 실시간 웹 검색이 생략되었습니다. 일반적인 지식을 바탕으로 작성하세요.]`;
    }

    // [컴플라이언스 룰셋 정의]
    let complianceRule = `
[공통 컴플라이언스 룰]
- "최고", "유일", "1위", "국내 제일", "100% 승소", "무조건 해결" 등 최상급/배타적 표현 및 결과 보장형 표현 절대 금지.
- 허위/과장 광고 금지. 주관적인 "치료 후기"나 "Before/After" 등 의뢰인 유인 문구 금지. 철저히 사실과 원리 중심으로 서술할 것.
- [허위 상담 사례 방어] 원고 내에 존재하지 않는 가상의 고객 상담 사례를 "실제 사례"나 "얼마 전 저희 사무소를 찾아주신" 등으로 거짓 포장한 부분이 있다면, 이를 "자주 묻는 예상 시나리오" 또는 "가상 페르소나 예시" 형태로 제목과 내용을 안전하게 수정해.
- [저품질 스팸 필터링] 타겟 키워드 밀도 검사: 전체 원고에서 타겟 키워드('${prompt}')가 5번을 초과하여 등장하는지 반드시 직접 카운트해. 5번을 넘는다면, 초과된 키워드들을 문맥상 자연스러운 유의어(LSI 키워드)로 강제 치환해 (예: 이혼 변호사 -> 가사법 전문가 등).
- 초안을 꼼꼼히 검토하여 위반 사항이 있다면 객관적인 정보 전달형 문장으로 스스로 재작성(Self-Correction)해.
- 위반 사항이 없다면 초안의 형태와 HTML 태그를 그대로 유지하여 출력해.
`;

    if (industryForTerm.includes('변호사') || industryForTerm.includes('법률')) {
      complianceRule += `
[변호사/법률 특화 컴플라이언스]
- "무료 법률상담", "기각 시 전액 환불", "업계 최저 수임료" 등 수임 질서 저해 문구 스캔 및 삭제.
- "전관 출신", "법원/검찰 네트워크" 등 전관예우 암시 문구 스캔 및 삭제.
`;
    } else if (industryForTerm.includes('세무사') || industryForTerm.includes('회계사')) {
      complianceRule += `
[세무사/회계사 특화 컴플라이언스]
- "평균 환급금 OO만 원", "환급률 1위", "최대 절세율 보장" 등 구체적인 수치를 통한 결과 예측/보장 문구 삭제. 절세가 이루어지는 '법적 원리'와 '세법 요건' 설명으로 대체.
- "업계 최저 수임료", "무료 세무 상담", 타 세무사와의 수임료 비교 문구 스캔 및 삭제.
- 세무공무원과의 연고 선전("전직 국세청 간부 출신 네트워크" 등) 스캔 및 삭제.
`;
    } else if (industryForTerm.includes('의료') || industryForTerm.includes('의사') || industryForTerm.includes('병원')) {
      complianceRule += `
[의료/병의원 특화 컴플라이언스]
- 주관적인 "치료 후기"나 "Before/After" 비교 사진/문구 절대 금지. 의학적 원리, 부작용, 주의사항 중심의 정보 전달 포맷으로 재작성.
- "여름방학 50% 할인", "페이백", "지인 동반 무료" 등 환자 유인 및 영리 목적의 이벤트 마케팅 문구 스캔 및 삭제.
`;
    } else if (industryForTerm.includes('행정사') || industryForTerm.includes('노무사')) {
      complianceRule += `
[행정사/노무사 특화 컴플라이언스]
- 타인의 소송이나 권리관계 분쟁에 개입하는 행위를 암시하는 문구(예: "법적 분쟁을 대리하여 해결해 드립니다") 스캔 및 삭제. 업무 범위를 행정청 제출 서류 작성 및 인허가 대리로 명확히 한정할 것.
`;
    }

    const outlineContext = outline ? `\n\n[Planner Agent가 설계한 글의 개요(Skeleton)]\n${outline}\n\n위 개요의 기승전결 구조를 반드시 준수하여 초안을 작성할 것.` : '';

    // Phase 2: Generator Agent (초안 작성 - 비동기 대기)
    const draftResult = await generateText({
      model: aiModel,
      temperature: 0.75,
      system: systemPrompt + searchContext + outlineContext,
      prompt: `타겟 키워드: ${prompt}\n\n위 지침과 개요에 맞춰 완벽한 네이버 블로그용 HTML 본문을 작성해줘.`,
    });
    
    const draftText = draftResult.text;

    // Phase 2: Evaluator Agent (규정 검수 및 자가 수정 - 스트리밍)
    const evaluatorSystemPrompt = `
너는 15년 경력의 전문직 컴플라이언스(광고법) 최고 책임자 겸 최종 검수 에이전트(Evaluator)야.
아래 주어진 [컴플라이언스 룰]을 바탕으로 제공된 원고 초안을 스캔하고, 위반 사항이 발견되면 스스로 재작성(Self-Correction)하여 안전하고 객관적인 원고로 변환해.
위반 사항이 없다면 HTML 태그나 디자인을 전혀 훼손하지 말고 초안 그대로 출력해. 
추가적인 인사말이나 설명 없이 오직 최종 완성된 HTML 결과물만 출력해야 해.

${complianceRule}
`;

    const result = streamText({
      model: aiModel,
      temperature: 0.2, // 검수자는 창의성보다 정확성과 규정 준수가 중요하므로 온도 하향
      system: evaluatorSystemPrompt,
      prompt: `[원고 초안]\n${draftText}\n\n위 초안을 검수하고 최종 HTML 원고를 출력해줘.`,
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

          const titleMatch = text.match(/<post_title>([\s\S]*?)<\/post_title>/i);
          const generatedTitle = titleMatch && titleMatch[1] ? titleMatch[1].trim() : `${prompt} (SEO 최적화)`;
          const cleanHtml = text.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').trim();

          await prisma.article.create({
            data: {
              user_id: user.id,
              project_id: project.id,
              title: generatedTitle,
              target_keyword: prompt,
              content_html: cleanHtml,
              citations: tavilyCitations,
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
