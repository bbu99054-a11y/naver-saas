import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(req: Request) {
  let currentUserId: string | null = null
  let isCreditDeducted = false

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 })
    }

    currentUserId = user.id

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

    // 원자적 선차감 (동시성 다중 요청 시 크레딧 누수 원천 차단)
    const deduction = await prisma.user.updateMany({
      where: { id: user.id, credits: { gt: 0 } },
      data: { credits: { decrement: 1 } }
    });

    if (deduction.count === 0) {
      return NextResponse.json({ error: '크레딧이 부족합니다. 요금제를 업그레이드해주세요.' }, { status: 403 })
    }

    isCreditDeducted = true

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
      getThemeByIndustry,
      getTopThumbnailTemplate, getChecklistCardTemplate, getComparisonCardTemplate,
      getHighlightStatCardTemplate, getProcessFlowCardTemplate, getQnACardTemplate,
      getWarningRiskCardTemplate, getKeyTakeawaysTemplate, getFooterBannerTemplate,
      getInfoBoxTemplate, getQuoteTemplate, 
      getTableTemplate, getDividerTemplate, getStepByStepTemplate 
    } = await import('@/lib/templates');
    
    const serpData = await scrapeNaverSerpContext(prompt);
    const matchedTheme = getThemeByIndustry(profile?.industry || '');

    let contextInjection = '';
    let designInjection = '';

    if (serpData) {
      contextInjection = `
<serp_context>
[실시간 네이버 상위 5개 블로그 분석 데이터 (이 규칙을 반드시 따를 것)]
- 권장 글자 수: 약 ${serpData.averageTextLength}자 내외로 작성해.
- 자주 쓰이는 목차(H2): ${serpData.commonHeaders.join(', ')}. 이 구조를 자연스럽게 H2 태그로 반영해.
</serp_context>
`;
    }

    const activeTemplates = [
      getTopThumbnailTemplate(),
      getChecklistCardTemplate(),
      getComparisonCardTemplate(),
      getHighlightStatCardTemplate(),
      getProcessFlowCardTemplate(),
      getQnACardTemplate(),
      getWarningRiskCardTemplate(),
      getKeyTakeawaysTemplate(),
      getFooterBannerTemplate(),
      getInfoBoxTemplate(matchedTheme.accentColor),
      getTableTemplate(matchedTheme.bg),
      getQuoteTemplate(matchedTheme.accentColor),
      getStepByStepTemplate(matchedTheme.accentColor)
    ];

    designInjection = `
<visual_card_design_system>
[네이버 블로그 탈-양산형 8종 시각 카드 디자인 시스템]
글의 분위기, 주제의 긴급도, 전문가 직군(${profile?.industry || '전문직'})에 맞춰 아래 제공된 인포그래픽 카드 중 글의 흐름과 가장 잘 어울리는 2~4종의 카드를 자율 선별하여 본문의 설명 직후에 자연스럽게 배치하세요.
- [카드 1: 최상단 1:1 맞춤 썸네일]: 본문 가장 첫머리에 필수 1장 배치.
- [본문 중간 시각 카드]: 본론 1(Body 1) 및 본론 2(Body 2)의 내용 설명 직후에 [체크리스트, Before/After 비교, 핵심 수치 강조, 3단계 로드맵, Q&A, 리스크 경고] 중 가장 어울리는 카드를 2~3장 선별 삽입.
- [카드 8: 핵심 3줄 요약 카드]: 결론부 직전에 필수 1장 배치.
- [카드 9: 하단 상담 유도 배너]: 글 최하단에 필수 1장 배치.
- 소제목(H2)은 별도의 장식 없이 스마트블록 검색에 강력한 문장형 제목으로 깨끗하게 작성하고, 카드는 설명 직후 시각적 요약/근거로 배치하여 제목 중복이 없도록 하세요.

${activeTemplates.join('\n\n')}
</visual_card_design_system>
`;

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

    let complianceInjection = '';
    const userIndustry = profile?.industry || '';

    if (userIndustry.includes('변호사') || userIndustry.includes('법률')) {
      complianceInjection = `
<compliance>
[변호사 광고 규정 준수 가이드 - 대한변협 2025-2026 규정 반영]
1. 과장/보장성 표현 절대 금지: "최고", "유일", "1위", "국내 제일", "100% 승소", "무조건 해결", "압도적 승소율" 등의 단어 절대 사용 금지.
2. 수임 질서 저해 및 전관예우 암시 문구 금지: "전관 출신", "법원/검찰 네트워크", "무료상담", "15분 무료상담", "기각 시 전액 환불", "업계 최저 수임료" 등 금지.
3. 명칭 규정: 공식 등록되지 않은 전문분야는 '전문' 대신 '주요 취급 분야' 또는 '집중 수행'으로 서술.
4. 기계적 상투어 금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다", "결론부터 말씀드리자면" 등 진부한 상투어 절대 사용 금지.
</compliance>
`;
    } else if (userIndustry.includes('세무사') || userIndustry.includes('회계사')) {
      complianceInjection = `
<compliance>
[세무사 광고 규정 준수 가이드 - 2026 세무사법 제12조 개정안 반영]
1. 결과 예측 및 환급 보장 광고 금지: "평균 환급금 OOO원 보장", "최대 절세율", "100% 절세", "환급률 1위" 등 수치화된 수익 약속 절대 금지.
2. 수임료 비교 및 염가 경쟁 문구 금지: "업계 최저가", "무료 세무 상담", "수임료 비교", "세무서/국세청 인맥" 등 일체 금지.
3. 객관적 서술 원칙: 금전적 환급을 확정 약속하지 말고, 절세가 이루어지는 '법적 원리'와 '세법 적용 요건'을 객관적으로 명쾌하게 설명할 것.
4. 기계적 상투어 금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다" 등 진부한 상투어 절대 사용 금지.
</compliance>
`;
    } else if (userIndustry.includes('의사') || userIndustry.includes('병원') || userIndustry.includes('의료')) {
      complianceInjection = `
<compliance>
[의료법 제56조 및 제27조 준수 가이드]
1. 치료 경험담 및 후기성 서술 금지: 로그인 절차 없는 공개 블로그에서 주관적 '치료 후기', '환자 만족도', '수술 전후(Before/After)' 비교 절대 금지.
2. 환자 유인 및 할인 이벤트 금지: "특별 할인", "페이백", "지인 동반 무료" 등 영리 목적 유인 문구 일체 금지.
3. 객관적 정보 전달 포맷: 시술의 의학적 원리, 소요 시간, 부작용 및 주의사항 위주로 객관적이고 차분하게 설명할 것.
4. 기계적 상투어 금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다" 등 진부한 상투어 절대 사용 금지.
</compliance>
`;
    } else if (userIndustry.includes('노무사')) {
      complianceInjection = `
<compliance>
[공인노무사 광고 가이드]
1. 직무 범위 준수: 무자격자(사무장 등) 수행 오인 표현 및 소송 대리/사법 분쟁 개입 암시 표현 절대 금지.
2. 과장/보장성 단어("100% 보상", "무조건 승인") 금지 및 노동관계법령 기준 객관적 권리 구제 절차 중심 서술.
3. 기계적 상투어 금지.
</compliance>
`;
    } else if (userIndustry.includes('행정사')) {
      complianceInjection = `
<compliance>
[행정사법 제22조 준수 가이드]
1. 직무 범위 엄수: 소송 대리 및 사법 분쟁 대리 암시 문구 절대 금지 (행정청 서류 작성 및 인허가 대리 직무 범위로 명확히 한정).
2. 과장/보장성 단어("100% 인허가 보장") 금지 및 법정 요건 중심 서술.
3. 기계적 상투어 금지.
</compliance>
`;
    } else {
      complianceInjection = `
<compliance>
[전문직 신뢰성 및 광고 규정 준수]
1. 과장/보장성 단어("최고", "유일", "1위", "100% 보장", "무조건 해결") 절대 사용 금지.
2. 근거 없는 가격 할인 및 기계적인 상투어("안녕하세요", "오늘은 ~에 대해 알아보겠습니다") 금지.
3. 차분하고 신뢰감을 주는 전문가적 객관성 유지.
</compliance>
`;
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

${complianceInjection}

${ragInjection}
${experienceInjection}
${contextInjection}
${designInjection}
${internalLinkInjection}
${profileFooterPrompt}

<html_constraints>
0. 응답의 가장 첫 줄에 반드시 <post_title>네이버 검색 유저의 클릭을 유도하는 매혹적인 1인칭 후킹 제목 (25자 내외)</post_title> 을 작성해.
1. [본문 최상단 1:1 맞춤 썸네일 카드 필수 삽입 (최우선)]
   - <post_title> 태그 바로 다음 줄(본문 HTML의 가장 첫머리)에 반드시 [카드 1: 최상단 1:1 맞춤 썸네일 카드]를 삽입해.
   - 썸네일 안의 카테고리 뱃지, 메인 타이틀, 서브카피, 하단 브랜드 서명을 글의 주제와 사용자 정보(${profile?.store_name || '전문가 사무소'})에 맞게 완성할 것.
2. [본문 중간 시각 인포그래픽 카드 2~3장 가변 삽입]
   - Body 1 및 Body 2에서 각 소제목(H2)의 본문 설명 직후에, 글의 맥락에 가장 어울리는 인포그래픽 카드([체크리스트], [Before/After 비교], [핵심 수치 강조], [3단계 로드맵], [Q&A 해설], [골든타임 리스크 경고])를 2~3장 자율 선별하여 배치할 것.
   - 소제목(H2)은 별도의 챕터 바 없이 네이버 스마트블록 검색에 강력한 문장형 제목(예: 📌 1주택자 상속세 과세표준과 핵심 공제 기준)으로 작성하여 제목 중복이 없도록 할 것.
3. [결론부 직전: 핵심 3줄 결론 요약 카드 필수 삽입]
   - 본론 마무리 후 결론부 직전에 [카드 8: 핵심 3줄 결론 요약 카드]를 반드시 삽입하여 바쁜 모바일 독자가 핵심을 3초 만에 스캐닝할 수 있게 할 것.
4. [글 최하단: 하단 상담 유도 (CTA) & 찾아오시는 길 배너 카드 필수 삽입]
   - 글의 맨 마지막(마무리 문단 후)에는 [카드 9: 하단 상담 유도 배너]를 삽입하여 전화번호(${profile?.phone || ''}), 주소(${profile?.address || ''}), 지도 링크(${profile?.reservation_link || ''})를 완벽히 안내할 것.
6. [문서 5단계 뼈대 구조화 (Skeleton-of-Thought)]
   - 1단계: <post_title> (타깃 키워드를 자연스럽게 포함하고 의뢰인의 구체적 고민 해결을 명시한 25자 내외 제목)
   - 2단계: Introduction (도입부 - 15%) ➔ **APB 훅(Attention-Problem-Bridge)** 프레임워크를 적용하여 7초 이내 독자를 몰입시킬 것:
     * Attention (주의 환기): 독자가 처한 긴박한 상황이나 가장 궁금해하는 핵심 질문으로 첫 문장 시작.
     * Problem (고통/위기 공감): 방치하거나 잘못 대처했을 때 겪게 될 실질적 리스크(세금 폭탄, 패소, 과태료 등)를 날카롭게 짚음.
     * Bridge (해결의 다리): "오늘 글에서는 15년 차 전문가의 실무 경험을 바탕으로, OOO 상황에서 반드시 챙겨야 할 핵심 3가지를 명쾌하게 정리해 드립니다"로 본론과 매끄럽게 연결.
   - 3단계: Body 1 (핵심 법리 및 규정 - 40%) ➔ 문제를 해결하기 위한 법리적, 세무적 기준과 법적 원리를 설명. 복잡한 정보(양형 기준, 세율 구간, 절차 등)가 있을 경우 제공된 템플릿(비교표 Table 등)을 문맥에 맞게 자연스럽게 활용.
   - 4단계: Body 2 (실무 대응 전략 - 35%) ➔ 실제 사건 발생 시 의뢰인이 취해야 할 실무 행동 지침 및 단계별 가이드라인(StepByStep 템플릿 또는 번호 매기기)을 일목요연하게 정리.
   - 5단계: Conclusion & CTA (결론 및 상담 안내 - 10%) ➔ 사안의 심각성을 차분히 상기시키고 전문가 조력의 필요성을 품격 있게 안내.
7. 1인칭 스토리텔링 100% 강제 (최우선): <expert_experience> 데이터를 바탕으로, 글의 서론 직후나 본론 중간에 네이버 인용구(<blockquote>)나 형광펜 효과를 적용하여 "실제로 최근 저희 사무소를 찾아주신 의뢰인 사례를 말씀드리면..."과 같은 1인칭 화법의 스토리텔링 문단을 무조건 1개 이상 필수 배치해.
8. 법령 및 판례 출처(Citation) 인용 표준화: 법적 요건, 처벌 수위, 세율 등을 설명할 때는 본문 텍스트 내에 괄호를 사용하여 [출처: 관련 법령 조항 및 판례 번호](예: 형법 제297조, 대법원 2021도XXXX 판결)를 자연스럽게 병기해.
9. 키워드 밀도 및 LSI 분산: 타깃 키워드의 단순 반복을 금지하고, 전체 본문 대비 키워드 밀도를 2~3% 수준으로 유지하며, 의미가 유사한 동의어(LSI)를 고르게 분산 배치해.
10. 마크다운 안됨: 순수한 HTML 코드로만 제공. <html>, <body>, \`\`\`html 같은 코드 블럭 절대 금지.
11. 네이버 에디터 호환성: display: flex, display: grid, position: absolute 같이 네이버 스마트에디터에서 깨지는 CSS 속성은 절대 사용 금지. 오직 기본 margin, padding, text-align, color, background-color, border, border-radius, box-shadow 등 호환되는 안전한 인라인 CSS만 사용해.
12. 제목 금지: <post_title> 태그 외에 본문 안에는 <h1> 쓰지 마. 오직 <h2>와 <h3> 태그만 사용. 
13. 트렌디한 블로그 디자인: 전체 문단(<p>)에 \`text-align: left; line-height: 1.95; font-size: 15.5px; margin-bottom: 20px; color: #334155;\` 기본 적용. 헤딩(<h2>, <h3>) 앞에 눈에 띄는 이모지 필수.
14. 형광펜 강조: 핵심 내용에는 형광펜 효과(\`<span style="background-color: #fffbeb; padding: 2px 6px; font-weight: bold; color: #1e40af; border-radius: 4px;">...</span>\`)를 적극 사용.
15. 이모지 적극 사용: 💡, 🔥, ✨, 📌 등을 적절히 배치해 가독성을 높임.
16. 이미지 삽입 엄격 금지 (FROZEN): 본문 내에 <img> 태그나 외부 이미지 URL을 일체 삽입하지 마세요. 상단 1:1 맞춤 썸네일 카드와 본문 시각 카드 4종으로 최고의 시각적 품질을 완성하세요.
</html_constraints>
    `;

    let aiModel;
    if (dbUser.plan_type === 'pro' || dbUser.plan_type === 'premium') {
      aiModel = anthropic('claude-5-sonnet-latest'); // 유료 요금제 (최고 품질)
    } else {
      aiModel = google('gemini-3.6-flash'); // 무료 요금제 (가성비 초고속)
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
          // 프로젝트 및 아티클 저장
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
    // 사전 에러 발생 시 선차감된 크레딧 롤백
    try {
      if (isCreditDeducted && currentUserId) {
        await prisma.user.update({
          where: { id: currentUserId },
          data: { credits: { increment: 1 } }
        });
      }
    } catch (refundError) {
      console.error('Failed to refund credit on error:', refundError);
    }
    const errorMessage = error.message || error.toString() || '알 수 없는 서버 에러가 발생했습니다.';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
