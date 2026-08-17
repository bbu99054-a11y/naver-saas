import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { google } from '@ai-sdk/google'
import { openai } from '@ai-sdk/openai'
import { NextResponse } from 'next/server'
import { stripInternalMetadata } from '@/lib/utils/postSanitizer'

export const maxDuration = 60

// Tavily RAG 검색 헬퍼 (최대 2초 타임아웃 & 공공 도메인 가드)
async function fetchTavilyContext(keyword: string, industry: string = ''): Promise<string> {
  if (!process.env.TAVILY_API_KEY) {
    return '\n[알림: TAVILY_API_KEY가 없어 실시간 웹 검색이 생략되었습니다. 일반적인 지식을 바탕으로 작성하세요.]'
  }
  try {
    let includeDomains: string[] = ['law.go.kr']
    if (industry.includes('변호사') || industry.includes('법률')) {
      includeDomains = ['law.go.kr', 'scourt.go.kr', 'ccourt.go.kr', 'ftc.go.kr', 'likms.assembly.go.kr']
    } else if (industry.includes('세무사') || industry.includes('회계사')) {
      includeDomains = ['txsi.hometax.go.kr', 'nts.go.kr', 'tt.go.kr', 'moef.go.kr', 'law.go.kr']
    } else if (industry.includes('노무사')) {
      includeDomains = ['moel.go.kr', 'nlrc.go.kr', 'comwel.or.kr', 'law.go.kr']
    } else if (industry.includes('행정사')) {
      includeDomains = ['acrc.go.kr', 'hikorea.go.kr', 'moleg.go.kr', 'mfds.go.kr', 'law.go.kr']
    }

    const searchRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query: keyword,
        search_depth: 'basic',
        include_answer: true,
        max_results: 3,
        include_domains: includeDomains,
      }),
      signal: AbortSignal.timeout(2000),
    })

    const searchData = await searchRes.json()
    if (searchData && searchData.results && searchData.results.length > 0) {
      const formattedResults = searchData.results
        .map((r: any) => `- 제목: ${r.title}\n  내용: ${r.content}\n  출처: ${r.url}`)
        .join('\n\n')
      return `\n[${keyword} 관련 공식/최신 정보 요약 (Tavily Search)]\n${searchData.answer || ''}\n\n[관련 기사/웹 문서]\n${formattedResults}\n\n이 공식 데이터를 본문 작성 시 참고하고 환각 없이 출처 기반으로 작성해.`
    }
  } catch (e) {
    console.warn('Tavily search warning (graceful fallback):', e)
  }
  return '\n[알림: 실시간 공공 데이터 조회가 안전하게 완료되었습니다. 일반적인 전문 지식과 결합하여 작성하세요.]'
}

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

    let dbUser = await prisma.user.findUnique({ where: { id: user.id } })
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email || '',
          credits: 5000,
          plan_type: 'free',
        },
      })
    }

    const [profile, pastArticles] = await Promise.all([
      prisma.profile.findUnique({
        where: { user_id: user.id },
      }),
      prisma.article.findMany({
        where: { user_id: user.id, status: 'DRAFT' },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: { id: true, title: true, target_keyword: true },
      }),
    ])

    const deduction = await prisma.user.updateMany({
      where: { id: user.id, credits: { gt: 0 } },
      data: { credits: { decrement: 1 } },
    })

    if (deduction.count === 0) {
      return NextResponse.json({ error: '크레딧이 부족합니다. 요금제를 업그레이드해주세요.' }, { status: 403 })
    }

    isCreditDeducted = true

    const body = await req.json()
    const { prompt, tone, experience } = body

    if (!prompt) {
      return NextResponse.json({ error: '타겟 키워드가 필요합니다.' }, { status: 400 })
    }

    let profileFooterPrompt = ''
    let ragInjection = ''

    if (profile) {
      const mapLinkHtml = profile.reservation_link
        ? `<p style="text-align: center; margin: 15px 0 30px 0;"><a href="${profile.reservation_link}" target="_blank" rel="noopener noreferrer" style="display: inline-block; font-size: 15px; font-weight: bold; color: #03C75A; text-decoration: none; border: 1.5px solid #03C75A; padding: 10px 22px; border-radius: 25px; background-color: #F0FDF4;">📍 ${profile.store_name || '사무소'} 네이버 지도 / 길찾기 바로가기</a></p>`
        : ''

      profileFooterPrompt = `
<footer_cta>
[사무소 프로필 정보: [사진 9: 하단 상담 유도 배너 이미지]에 직통 상담 및 오시는 길 2개 정보를 집중 반영할 것]
- 이름/상호: ${profile.store_name || ''}
- 전문 분야: ${profile.industry || ''}
- 주소: ${profile.address || ''}
- 직통 전화번호: ${profile.phone || ''}
${profile.reservation_link ? `- 네이버 지도/예약 링크: ${profile.reservation_link}` : ''}

[필수 면책 조항] 배너 바로 위에 다음 문구를 작고 흐린 글씨(<p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 25px 0 10px 0;">)로 반드시 삽입해: 
"본 포스팅은 일반적인 정보 제공을 목적으로 하며, 구체적인 사안에 따라 법적 판단이 달라질 수 있으므로 반드시 정식 상담을 받아보시기 바랍니다."

${profile.reservation_link ? `[네이버 지도 바로가기 버튼]: [사진 9 배너 이미지] 바로 아래에 다음 HTML 링크 태그를 1회 정확히 삽입하여 고객이 터치 시 지도로 연결되도록 할 것:
'${mapLinkHtml}'` : ''}
</footer_cta>
`

      if (profile.about_us) {
        ragInjection = `
<expert_persona>
아래는 작성자(전문가)의 실제 프로필, 철학, 승소 사례, 전문 지식입니다. 
이 내용을 글 중간중간에 아주 자연스럽게 녹여내어, 기계가 쓴 글이 아니라 '전문가가 직접 자신의 노하우를 풀어낸 글'처럼 완벽하게 구성해.
---
${profile.about_us}
---
</expert_persona>
`
      }
    }

    let experienceInjection = ''
    if (experience && experience.trim() !== '') {
      experienceInjection = `
<expert_experience>
작성자의 실제 에피소드: "${experience}"
</expert_experience>
`
    } else {
      experienceInjection = `
<expert_experience>
작성자의 실제 에피소드는 제공되지 않았으므로, 타겟 키워드와 관련된 가장 보편적이고 사실적인 가상의 의뢰인 상담 사례 하나를 1인칭 시점("얼마 전 저희 사무소를 찾아주신 의뢰인이 계셨습니다...")으로 창작하여 적용할 것.
</expert_experience>
`
    }

    const { scrapeNaverSerpContext } = await import('@/lib/scraper')
    const { 
      getThemeByIndustry,
      getTopThumbnailTemplate, getChecklistCardTemplate, getComparisonCardTemplate,
      getHighlightStatCardTemplate, getProcessFlowCardTemplate, getQnACardTemplate,
      getWarningRiskCardTemplate, getKeyTakeawaysTemplate, getFooterBannerTemplate,
      getIntroSummaryBoxTemplate, getInfoBoxTemplate, getQuoteTemplate, 
      getTableTemplate, getDividerTemplate, getStepByStepTemplate 
    } = await import('@/lib/templates')

    const [serpData, searchContext] = await Promise.all([
      scrapeNaverSerpContext(prompt),
      fetchTavilyContext(prompt, profile?.industry || ''),
    ])

    const matchedTheme = getThemeByIndustry(profile?.industry || '')

    let contextInjection = ''
    if (serpData) {
      contextInjection = `
<serp_context>
[실시간 네이버 상위 5개 블로그 SERP 역설계 데이터 (이 규칙을 최우선 반영할 것)]
- 권장 글자 수: 상위 경쟁사 평균(${serpData.averageTextLength}자)보다 300자 더 길고 풍부한 약 ${serpData.recommendedTextLength}자 내외로 작성해.
- 경쟁사 주요 목차(H2): ${serpData.commonHeaders.join(', ') || '핵심 쟁점, 법적 판단 기준, 실무 대응 절차'}. 이 목차들의 장점을 흡수하고 빈틈을 메우는 차별화된 H2 구조로 전개해.
- 권장 서식: ${serpData.recommendedComponents.useTable ? '비교표(Table) 적극 활용' : ''} ${serpData.recommendedComponents.useQuote ? '인용구(Quote) 적극 활용' : ''}
</serp_context>
`
    }

    const activeTemplates = [
      getTopThumbnailTemplate(currentUserId || '', prompt),
      getChecklistCardTemplate(currentUserId || '', prompt),
      getComparisonCardTemplate(currentUserId || '', prompt),
      getHighlightStatCardTemplate(currentUserId || '', prompt),
      getProcessFlowCardTemplate(currentUserId || '', prompt),
      getQnACardTemplate(currentUserId || '', prompt),
      getWarningRiskCardTemplate(currentUserId || '', prompt),
      getKeyTakeawaysTemplate(currentUserId || '', prompt),
      getFooterBannerTemplate(currentUserId || '', prompt),
      getIntroSummaryBoxTemplate(matchedTheme.accentColor, prompt),
      getInfoBoxTemplate(matchedTheme.accentColor),
      getTableTemplate(matchedTheme.bg),
      getQuoteTemplate(matchedTheme.accentColor),
      getStepByStepTemplate(matchedTheme.accentColor)
    ]

    const designInjection = `
<visual_card_design_system>
[네이버 블로그 2026 프리미엄 9종 시각 카드 및 안전 서식 시스템 (1080px 고해상도 & 고유 브랜드 킷 적용)]
네이버 블로그의 화사한 본문 및 스마트에디터 ONE 붙여넣기에 100% 호환되는 프리미엄 시각 카드 디자인 시스템입니다.
- 모든 시각 카드는 아래 제공된 9종의 <img src="/api/card-image/render?type=...&userId=..." alt="..." style="..." /> 템플릿 태그를 그대로 사용하되, URL 내부의 title, sub, tags, points, sig 등의 텍스트를 현재 주제에 맞게 변경하여 삽입하세요.
- [네이버 이미지 검색 SEO 필수 규칙]: 모든 <img> 태그의 alt 속성은 반드시 템플릿에 명시된 대로 'alt="${prompt} - (카드유형한글명)"' 형태로 이번 글의 메인 타겟 키워드를 반드시 포함하여 작성하세요.
- 마크다운 형식(![]())이나 빈 src=""를 절대 사용하지 말고, 반드시 제공된 <img src="/api/card-image/render?..." ...> 태그를 사용하세요.
- [사진 1: 최상단 1:1 맞춤 썸네일]은 반드시 URL에 &tags=핵심키워드1|핵심키워드2|핵심키워드3 형태로 이번 글의 3개 핵심 뱃지 태그를 파이프(|)로 구분하여 주입하세요.
- [사진 3: 비교 카드]는 반드시 URL에 &extra1=(잘못된 대처 요약)&extra2=(올바른 전문가 대응 요약) 파라미터를 정확히 분리하여 사용하세요 (절대 '|extra2='로 쓰지 마세요).
- [사진 5: 3단계 로드맵 카드]는 &points=1단계 핵심제목:구체적 설명|2단계 핵심제목:구체적 설명|3단계 핵심제목:구체적 설명 형태로 파이프(|)로 3단계를 연결하세요.

[탈 양산화 시각 카드 배치 원칙 (글마다 2~5장 유기적 가변 배치)]:
1. [사진 1: 최상단 1:1 맞춤 썸네일]: 본문 가장 첫머리에 필수 1장 배치.
2. [본문 중간 맞춤형 시각 카드 (주제에 따라 1~3장 선별)]:
   - 획일적으로 똑같은 카드를 반복하지 말고, 이번 글의 핵심 내용에 가장 적합한 카드를 9종 중에서 1~3장만 유기적으로 선택해 배치하세요:
     • 잘못된 대처와 올바른 해결의 대비가 중요할 때 ➔ [사진 3: Before/After 비교 카드]
     • 필수 준비 서류나 요건 나열이 필요할 때 ➔ [사진 2: 체크리스트 카드]
     • 실무 처리 순서나 행동 로드맵이 필요할 때 ➔ [사진 5: 3단계 로드맵 카드]
     • 핵심 수치, 감면율, 벌금 금액 강조 시 ➔ [사진 4: 핵심 수치 하이라이트 카드]
     • 독자의 오해 해소나 빈출 질문 해설 시 ➔ [사진 6: Q&A 카드]
     • 기한 만료 리스크나 가산세 경고 시 ➔ [사진 7: 골든타임 리스크 카드]
3. [결론부 카드]: 내용에 따라 [사진 8: 핵심 3줄 요약 카드]를 선택 배치.
4. [사진 9: 하단 상담 유도 배너]: 글 최하단에 필수 1장 배치.
- 전체 글에 들어가는 카드 이미지의 총 개수는 주제에 맞춰 자연스럽게 총 2~5장 사이로 자율 구성하세요.

- 안내/리스크 박스 서식은 네이버 에디터가 100% 보존하는 표준 인라인 CSS(<div style="background-color: #FEF9C3; border-left: 4px solid #EAB308; padding: 18px 20px; margin: 24px 0; border-radius: 4px; line-height: 1.6;">...</div>)를 사용하세요.
- 복잡한 비교 표나 준비 서류 목록은 이미지 대신 아래 제공된 순수 인라인 HTML Table 서식(<table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 15px; text-align: left; background-color: #FFFFFF;">...</table>)으로 작성하여 한글이 100% 또렷하게 읽히도록 하세요.

${activeTemplates.join('\n\n')}
</visual_card_design_system>
`

    let internalLinkInjection = ''
    if (pastArticles && pastArticles.length > 0) {
      const links = pastArticles.map((a: any) => {
        const cleanTitle = a.title.replace(' (SEO 최적화)', '')
        return `- <a href="https://blog.naver.com">${cleanTitle}</a>`
      }).join('\n')
      
      internalLinkInjection = `
<internal_links>
[중요 지시사항: 조건부 내부 링크 삽입]
아래 제공된 과거 글 목록을 확인하고, **현재 작성 중인 타겟 키워드와 문맥상 자연스럽게 이어질 수 있는 글이 있다면 최대 1~2개만 선택**하여 본문에 삽입해.
만약 과거 글 내용이 현재 주제와 전혀 무관하다면 **절대로 억지로 삽입하지 말고 완전히 무시해**.

선택 가능한 과거 링크 후보 목록:
${links}
</internal_links>
`
    }

    let terminologyStrictness = ''
    const industryForTerm = profile?.industry || ''
    if (industryForTerm.includes('세무사') || industryForTerm.includes('회계사')) {
      terminologyStrictness = `[세무사/회계사 용어 엄격성]\n- 세법 용어(소득공제, 세액공제, 감면, 비과세, 경정청구 등)를 절대 뭉뚱그려 혼용하지 말고, 과세표준 적용인지 산출세액 적용인지 명확하고 엄격하게 분리하여 작성해.`
    } else if (industryForTerm.includes('변호사') || industryForTerm.includes('법률')) {
      terminologyStrictness = `[법률 용어 엄격성]\n- 법률 용어(벌금/과태료/과징금, 해제/해지, 무효/취소 등)의 법적 효력 차이를 절대 혼용하지 말고 명확하고 엄격하게 구분하여 작성해.`
    } else if (industryForTerm.includes('노무사')) {
      terminologyStrictness = `[노무 용어 엄격성]\n- 노동법 용어(해고/권고사직/퇴사, 임금/수당/퇴직금 등)의 법적 요건 차이를 엄격히 구분하여 작성해.`
    } else {
      terminologyStrictness = `[전문 용어 엄격성]\n- 도메인 전문 용어들을 일반인처럼 뭉뚱그려 쓰지 말고, 전문가적 관점에서 정확하고 엄격하게 분리하여 작성해.`
    }

    let complianceInjection = ''
    const userIndustry = profile?.industry || ''

    if (userIndustry.includes('변호사') || userIndustry.includes('법률')) {
      complianceInjection = `
<compliance>
[변호사 광고 규정 준수 가이드 - 대한변협 2025-2026 규정 반영]
1. 과장/보장성 표현 절대 금지: "최고", "유일", "1위", "국내 제일", "100% 승소", "무조건 해결", "압도적 승소율" 등의 단어 절대 사용 금지.
2. 수임 질서 저해 및 전관예우 암시 문구 금지: "전관 출신", "법원/검찰 네트워크", "무료상담", "15분 무료상담", "기각 시 전액 환불", "업계 최저 수임료" 등 금지.
3. 명칭 규정: 공식 등록되지 않은 전문분야는 '전문' 대신 '주요 취급 분야' 또는 '집중 수행'으로 서술.
4. 기계적 상투어 금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다", "결론부터 말씀드리자면" 등 진부한 상투어 절대 사용 금지.
</compliance>
`
    } else if (userIndustry.includes('세무사') || userIndustry.includes('회계사')) {
      complianceInjection = `
<compliance>
[세무사 광고 규정 준수 가이드 - 2026 세무사법 제12조 개정안 반영]
1. 결과 예측 및 환급 보장 광고 금지: "평균 환급금 OOO원 보장", "최대 절세율", "100% 절세", "환급률 1위" 등 수치화된 수익 약속 절대 금지.
2. 수임료 비교 및 염가 경쟁 문구 금지: "업계 최저가", "무료 세무 상담", "수임료 비교", "세무서/국세청 인맥" 등 일체 금지.
3. 객관적 서술 원칙: 금전적 환급을 확정 약속하지 말고, 절세가 이루어지는 '법적 원리'와 '세법 적용 요건'을 객관적으로 명쾌하게 설명할 것.
4. 기계적 상투어 금지: "안녕하세요", "오늘은 ~에 대해 알아보겠습니다" 등 진부한 상투어 절대 사용 금지.
</compliance>
`
    } else if (userIndustry.includes('의사') || userIndustry.includes('병원') || userIndustry.includes('의료')) {
      complianceInjection = `
<compliance>
[의료법 제56조 및 제27조 준수 가이드]
1. 치료 경험담 및 후기성 서술 금지: 로그인 절차 없는 공개 블로그에서 주관적 '치료 후기', '환자 만족도', '수술 전후(Before/After)' 비교 절대 금지.
2. 환자 유인 및 할인 이벤트 금지: "특별 할인", "페이백", "지인 동반 무료" 등 영리 목적 유인 문구 일체 금지.
3. 객관적 정보 전달 포맷: 시술의 의학적 원리, 소요 시간, 부작용 및 주의사항 위주로 객관적이고 차분하게 설명할 것.
4. 기계적 상투어 금지.
</compliance>
`
    } else {
      complianceInjection = `
<compliance>
[전문직 신뢰성 및 광고 규정 준수]
1. 과장/보장성 단어("최고", "유일", "1위", "100% 보장", "무조건 해결") 절대 사용 금지.
2. 근거 없는 가격 할인 및 기계적인 상투어("안녕하세요", "오늘은 ~에 대해 알아보겠습니다") 금지.
3. 차분하고 신뢰감을 주는 전문가적 객관성 유지.
</compliance>
`
    }

    const systemPrompt = `
너는 대한민국 상위 1% 네이버 블로그 SEO 전문가이자 프로 카피라이터야. 네이버의 C-Rank와 DIA 알고리즘을 완벽히 이해하고 전문직(변호사, 세무사, 의사 등)에 최적화된 글을 작성해야 해.
글은 반드시 사용자의 검색 의도를 파악한 '정보성' 혹은 '직접 경험한 듯한 후기성'의 자연스러운 톤앤매너(${tone || '신뢰감을 주는 전문가 톤'})로 작성되어야 해. 

<anti_hallucination_guideline>
1. CoT (Chain of Thought) 팩트 체크 및 동적 아웃라인 설계 강제:
반드시 HTML 본문을 작성하기 전에, <internal_fact_check> 태그 안에 아래 3가지 설계 메모를 먼저 완벽히 작성해:
- [팩트 체크]: 타겟 키워드 관련 핵심 전문 용어 정의 및 Tavily RAG 검색 팩트/출처 분리
- [목표 분량]: SERP 분석 기반 목표 글자 수 (약 ${serpData?.recommendedTextLength || 2800}자)
- [탈 양산화 설계도]: 이번 글의 맞춤형 H2 소제목 전개 계획 및 본문에 선별 배치할 2~5장의 시각 카드 종류 명시
</internal_fact_check>
이 기획 메모는 반드시 <internal_fact_check> 태그 안에만 작성하고, 닫는 태그(</internal_fact_check>) 이후의 실제 본문에는 [팩트 체크] 등의 텍스트를 절대 다시 노출하지 마. 본격적인 글은 바로 <post_title> 및 [사진 1 썸네일]부터 시작해.

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
0. [전문직 5대 탈 양산화 후킹 제목 (<post_title>) 생성 규칙 (최우선 엄수)]:
   - 응답의 가장 첫 줄에 반드시 <post_title>네이버 검색 유저의 클릭을 유도하는 전문직 고수익 후킹 제목 (25~32자)</post_title> 을 작성해.
   - [키워드 전방 배치 원칙]: 메인 타깃 키워드("${prompt}")가 반드시 제목의 앞쪽(15자 이내)에 자연스럽고 명확하게 위치해야 함.
   - [감성 일기형 상투어 절대 금지 (블랙리스트)]: '~본 기록', '~일기', '~이야기', '~생각해 보았습니다', '~알아보겠습니다', '~소소한 팁' 등 개인 수필/일기 같은 모호하고 권위 없는 표현 절대 사용 금지.
   - [탈 양산화 5대 프레임워크 자율 선별 적용 (주제 성격에 최적화)]:
     모든 글에 획일적인 문장 형태를 반복하지 말고, 현재 타깃 키워드의 본질적 성격에 가장 알맞은 1개 앵글을 선택하여 작성할 것:
     ① [위험/손해 방지형 (세금·벌금·패소 우려 시)]: (키워드) 놓치면 가산세/손해 폭탄 맞는 N가지 쟁점
        (예: "분양권 상속 주택수 포함, 놓치면 세금 폭탄 맞는 3가지 쟁점")
     ② [실무 쟁점 정밀 가이드형 (복합 법리·신고 기준 시)]: (키워드) 핵심 판단 기준과 필수 체크리스트
        (예: "분양권 상속재산분할과 주택수 산정, 실무 핵심 판단 기준 총정리")
     ③ [오해/착각 교정형 (대중의 흔한 오판 시)]: (키워드) 가장 많이 착각하는 치명적 오류 (실제 판례 기준)
        (예: "분양권 주택수 포함 여부, 상속재산분할 시 흔히 하는 오해와 진실")
     ④ [권리구제/해결책 제시형 (분쟁·소송·조사 대응 시)]: (키워드) 분쟁 전 반드시 확보해야 할 대응 전략
        (예: "상속 분양권 재산분할 분쟁, 깔끔하게 권리 보호하는 법")
     ⑤ [2026 최신 개정/판례 기준형 (최신 제도·개정법 시)]: [2026 최신] (키워드) 달라진 기준과 실무 대응법
        (예: "[2026 최신] 분양권 상속 시 주택수 포함 요건과 절세 가이드")
1. [본문 최상단 1:1 맞춤 썸네일 카드 필수 삽입 (최우선)]
   - <post_title> 태그 바로 다음 줄(본문 HTML의 가장 첫머리)에 반드시 [사진 1: 최상단 1:1 맞춤 썸네일 이미지]를 삽입해.
   - 썸네일은 화사한 웜 크림/골드 라이트 배경 위에 카테고리 뱃지, 메인 타이틀, 서브카피, 하단 브랜드 서명을 완성하여 모바일에서도 글씨가 100% 뚜렷하게 보이도록 할 것.
2. [본문 중간 시각 인포그래픽 카드 1~3장 가변 선별 삽입 (탈 양산화)]
   - Body 1 및 Body 2에서 각 소제목(H2)의 본문 설명 직후에, 이번 글의 주제에 가장 꼭 맞는 인포그래픽 카드([체크리스트], [Before/After 비교], [핵심 수치 강조], [3단계 로드맵], [Q&A 해설], [골든타임 리스크 경고])를 1~3장 자율 선별하여 배치할 것. (모든 글에 똑같은 카드를 반복하지 말 것)
   - 소제목(H2)은 별도의 챕터 바 없이 네이버 스마트블록 검색에 강력한 문장형 제목으로 작성할 것.
3. [결론부 요약 카드]: 본론 마무리 후 결론부 직전에 내용에 따라 [사진 8: 핵심 3줄 결론 요약 카드]를 선택 배치.
4. [글 최하단: 하단 상담 유도 (CTA) 배너 카드 필수 삽입]
   - 글의 맨 마지막(마무리 문단 후)에는 [사진 9: 하단 상담 유도 배너]를 삽입하여 직통 전화번호(${profile?.phone || ''})와 사무소 상세 주소(${profile?.address || ''})를 2단 집중 레이아웃으로 선명하게 안내할 것.
6. [문서 5단계 뼈대 구조화 (Skeleton-of-Thought)]
   - 1단계: <post_title> (타깃 키워드가 전방에 배치되고 전문직 5대 후킹 프레임워크가 적용된 25~32자 제목)
   - 2단계: Introduction (도입부 - 15%) ➔ [사진 1 썸네일] 바로 아래 APB 훅(Attention-Problem-Bridge) 프레임워크 적용 ➔ **도입부 문단 종료 직후, 첫 번째 <h2> 소제목이 시작되기 바로 전에 반드시 [서론 직후 스마트블록 스니펫용 3초 핵심 요약 박스]를 1회 의무 삽입할 것.**
   - 3단계: Body 1 (핵심 법리 및 규정 - 40%) ➔ 복잡한 정보는 순수 HTML Table 서식 적극 활용
   - 4단계: Body 2 (실무 대응 전략 - 35%) ➔ 실무 행동 지침 및 단계별 가이드라인
   - 5단계: Conclusion & CTA (결론 및 상담 안내 - 10%) ➔ 전문가 조력 안내
7. 1인칭 스토리텔링 100% 강제 (최우선): <expert_experience> 데이터를 바탕으로 1인칭 화법의 스토리텔링 문단을 무조건 1개 이상 필수 배치.
8. 법령 및 판례 출처(Citation) 인용 표준화: 본문 텍스트 내에 괄호를 사용하여 [출처: 관련 법령 조항 및 판례 번호] 병기.
9. 키워드 밀도 및 LSI 분산: 타깃 키워드의 단순 반복을 금지하고, 전체 본문 대비 키워드 밀도를 2~3% 수준 유지.
10. [마크다운 절대 금지 & 순수 HTML 강제]: 절대로 마크다운(#, ##, ###, **, -, >)을 쓰지 마세요. 모든 제목과 문단은 반드시 인라인 스타일이 적용된 순수 HTML 태그(<h2>, <h3>, <p>, <blockquote>, <table>)로만 작성하세요.
11. [네이버 스마트에디터 ONE 표준 인라인 스타일 규격 준수 (필수)]:
    - 대제목(H2): 반드시 '<h2 style="font-size: 22px; font-weight: bold; color: #0F172A; margin: 36px 0 16px 0; border-bottom: 2px solid #E2E8F0; padding-bottom: 8px;">(시각이모지) (소제목 내용)</h2>' 형태로 작성하여 22px 대형 크기와 밑줄 구분선을 보장할 것.
    - 중제목(H3): '<h3 style="font-size: 18px; font-weight: bold; color: #1E293B; margin: 24px 0 12px 0;">(시각이모지) (중제목 내용)</h3>'
    - 일반 본문 문단(P): 반드시 '<p style="font-size: 16px; line-height: 1.85; margin: 16px 0; color: #1F2937;">(문단 내용)</p>' 형태로 16px 표준 크기를 적용하여 네이버 에디터에서 11pt로 쪼그라들지 않도록 할 것.
12. [H2/H3 소제목 앞 이모지 필수]: <post_title> 외에 본문 안에는 <h1>을 쓰지 말고 오직 <h2>와 <h3> 태그만 사용하되, **모든 <h2> 및 <h3> 소제목 맨 앞에는 주제 맥락에 맞는 직관적인 시각 이모지(🏢, ⚖️, 📋, 👥, 🚀, 💡, 🔍, 📊 등)를 반드시 1개씩 포함**하세요 (예: '<h2 style="...">🏢 송파 세무사 기장료가 사무실마다 다른 이유</h2>').
13. [본문 내부 이모지 남발 엄격 금지]: 소제목 앞을 제외한 본문 일반 문장에서는 이모지 남발을 엄격히 금지하고, 안내 박스나 강조 팁 등에서만 최소한(💡, 📌)으로 절제하여 전문직의 신뢰도 높은 필력을 완성하세요.
14. 형광펜 강조: 핵심 내용에는 형광펜 효과 적극 사용.
16. [고화질 <img> 시각 카드 이미지 필수 사용]: 제공된 9종의 카드 이미지 템플릿(<img> 태그)의 URL 파라미터를 현재 글 주제에 맞게 수정하여 글마다 총 2~5장 사이로 적재적소에 가변 배치하세요.
</html_constraints>
`

    let aiModel
    if (dbUser.plan_type === 'pro' || dbUser.plan_type === 'premium') {
      if (process.env.ANTHROPIC_API_KEY) {
        aiModel = anthropic('claude-5-sonnet-latest')
      } else if (process.env.OPENAI_API_KEY) {
        aiModel = openai('gpt-5.6-luna')
      } else {
        aiModel = google('gemini-3.6-flash')
      }
    } else {
      if (process.env.OPENAI_API_KEY) {
        aiModel = openai('gpt-5.6-luna')
      } else {
        aiModel = google('gemini-3.6-flash')
      }
    }

    const result = streamText({
      model: aiModel,
      temperature: 0.75,
      system: systemPrompt + searchContext,
      prompt: `타겟 키워드: ${prompt}\n\n위 지침에 맞춰 완벽한 네이버 블로그용 HTML 본문을 작성해줘.`,
      async onFinish({ text }) {
        try {
          let project = await prisma.project.findFirst({
            where: { user_id: user.id },
            orderBy: { created_at: 'asc' },
          })

          if (!project) {
            project = await prisma.project.create({
              data: {
                user_id: user.id,
                project_name: '기본 프로젝트',
              },
            })
          }

          const titleMatch = text.match(/<post_title>([\s\S]*?)<\/post_title>/i)
          const generatedTitle = titleMatch && titleMatch[1] ? titleMatch[1].trim() : `${prompt} (SEO 최적화)`
          const cleanHtml = stripInternalMetadata(text.replace(/<post_title>[\s\S]*?<\/post_title>/i, '').trim())

          await prisma.article.create({
            data: {
              user_id: user.id,
              project_id: project.id,
              title: generatedTitle,
              target_keyword: prompt,
              content_html: cleanHtml,
              status: 'DRAFT',
            },
          })
        } catch (error) {
          console.error('Failed to update DB onFinish:', error)
        }
      },
    })

    return result.toTextStreamResponse()

  } catch (error: any) {
    console.error('Generation API error:', error)
    try {
      if (isCreditDeducted && currentUserId) {
        await prisma.user.update({
          where: { id: currentUserId },
          data: { credits: { increment: 1 } },
        })
      }
    } catch (refundError) {
      console.error('Failed to refund credit on error:', refundError)
    }
    const errorMessage = error.message || error.toString() || '알 수 없는 서버 에러가 발생했습니다.'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
