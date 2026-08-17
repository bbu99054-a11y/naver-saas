export interface DesignTheme {
  name: string;
  bg: string;
  cardBg: string;
  textColor: string;
  accentColor: string;
  subTextColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}

export const designThemes: DesignTheme[] = [
  {
    name: 'Classic Cream & Gold (클래식 크림/골드)',
    bg: '#FDFBF7',
    cardBg: '#FFFFFF',
    textColor: '#0F172A',
    accentColor: '#D4AF37',
    subTextColor: '#475569',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    borderColor: '#E2E8F0'
  },
  {
    name: 'Modern Ice Blue (모던 아이스 블루)',
    bg: '#F0F9FF',
    cardBg: '#FFFFFF',
    textColor: '#0B132B',
    accentColor: '#2563EB',
    subTextColor: '#475569',
    badgeBg: '#DBEAFE',
    badgeText: '#1E40AF',
    borderColor: '#BAE6FD'
  },
  {
    name: 'Frosted Sage & Mint (프로스티드 세이지/민트)',
    bg: '#F0FDF4',
    cardBg: '#FFFFFF',
    textColor: '#14532D',
    accentColor: '#16A34A',
    subTextColor: '#475569',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    borderColor: '#BBF7D0'
  },
  {
    name: 'Warm Oatmeal & Espresso (웜 오트밀 에스프레소)',
    bg: '#F7F5F0',
    cardBg: '#FFFFFF',
    textColor: '#2B2523',
    accentColor: '#8C5E45',
    subTextColor: '#6E655F',
    badgeBg: '#EFECE6',
    badgeText: '#2B2523',
    borderColor: '#D8CEBE'
  },
  {
    name: 'Soft Lavender (소프트 라벤더)',
    bg: '#F5F3FF',
    cardBg: '#FFFFFF',
    textColor: '#1E1B4B',
    accentColor: '#7C3AED',
    subTextColor: '#475569',
    badgeBg: '#EDE9FE',
    badgeText: '#6D28D9',
    borderColor: '#DDD6FE'
  },
  {
    name: 'Clean Modern Slate (클린 모던 슬레이트)',
    bg: '#FFFFFF',
    cardBg: '#F8FAFC',
    textColor: '#0F172A',
    accentColor: '#2563EB',
    subTextColor: '#475569',
    badgeBg: '#F1F5F9',
    badgeText: '#0F172A',
    borderColor: '#CBD5E1'
  }
];

export function getRandomTheme(): DesignTheme {
  return designThemes[Math.floor(Math.random() * designThemes.length)];
}

export function getThemeByIndustry(industry: string = ''): DesignTheme {
  if (industry.includes('세무') || industry.includes('회계') || industry.includes('자산')) {
    return designThemes[0]; // Classic Cream & Gold
  }
  if (industry.includes('변호사') || industry.includes('법률') || industry.includes('법무')) {
    return designThemes[0]; // Classic Cream & Gold
  }
  if (industry.includes('병원') || industry.includes('의원') || industry.includes('한의원') || industry.includes('의사')) {
    return designThemes[2]; // Frosted Sage & Mint
  }
  if (industry.includes('변리사') || industry.includes('특허') || industry.includes('관세')) {
    return designThemes[1]; // Modern Ice Blue
  }
  if (industry.includes('노무') || industry.includes('행정')) {
    return designThemes[3]; // Warm Oatmeal
  }
  return designThemes[5];
}

function sanitizeKeyword(raw: string): string {
  return (raw || '').replace(/["'<>]/g, '').trim() || '핵심 실무 분석'
}

/**
 * 1. 최상단 1:1 맞춤 썸네일 고해상도 이미지 (1080x1080 - 10종 컬러 & 4종 레이아웃 자동 배정)
 */
export function getTopThumbnailTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 1: 최상단 1:1 맞춤 썸네일 이미지 - HTML 본문 최상단 필수 삽입]
<img src="/api/card-image/render?type=MAIN_THUMBNAIL${userParam}&category=2026+핵심+실무+가이드&title=송파구+병의원+세무기장+성실신고확인대상+핵심+검토&sub=놓치면+막대한+가산세가+부과되는+실무+기준+3가지&tags=절세전략|성실신고|세무조사&sig=(전문가+사무소명)" alt="${kw} - 대표 썸네일" style="display: block; width: 100%; max-width: 480px; margin: 20px auto 35px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 2. 3대 필수 요건 체크리스트 고해상도 이미지 (1080x680 - Headless Serverless PNG)
 */
export function getChecklistCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 2: 3대 필수 요건 체크리스트 인포그래픽 이미지 - 본문 설명 직후 삽입]
<img src="/api/card-image/render?type=CHECKLIST${userParam}&title=반드시+검토해야+할+3대+필수+체크리스트&points=01.+첫번째+핵심+요건:매출+5억원+이상+제출의무+발생|02.+두번째+핵심+요건:비급여+수입+선제적+검증+필수|03.+세번째+핵심+요건:성실신고+세액공제+적극+활용" alt="${kw} - 필수 준비 서류 체크리스트" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 3. Before vs After 비교 대비 고해상도 이미지 (1080x680 - Headless Serverless PNG)
 */
export function getComparisonCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 3: Before vs After 비교 대비 인포그래픽 이미지 - 잘못된 대처 vs 올바른 해결 비교 시 삽입]
<img src="/api/card-image/render?type=COMPARISON${userParam}&title=일반+기장+대리+vs+전문+성실신고+비교&extra1=단순+장부+작성+중심+세무조사+리스크&extra2=적격증빙+선제적+검증+및+세액공제+확보" alt="${kw} - 잘못된 대처 vs 올바른 해결 비교" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 4. 핵심 수치 & 감면율 대형 하이라이트 고해상도 이미지 (1080x680 - Headless Serverless PNG)
 */
export function getHighlightStatCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 4: 핵심 수치 & 공제액 대형 하이라이트 인포그래픽 이미지 - 금액이나 세액/기간 강조 시 삽입]
<img src="/api/card-image/render?type=STAT_HIGHLIGHT${userParam}&category=MEDICAL+TAX+STATISTIC&title=연+수입금액+5억+원+이상&sub=의료업+성실신고확인서+의무+제출+대상+적용&extra3=[법적+근거:+소득세법+제70조의2]" alt="${kw} - 핵심 수치 및 공제 기준 하이라이트" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 8px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 5. 3단계 실무 행동 로드맵 고해상도 이미지 (1080x680 - Headless Serverless PNG)
 */
export function getProcessFlowCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 5: 3단계 실무 행동 로드맵 인포그래픽 이미지 - 절차나 단계별 가이드라인 설명 시 삽입]
<img src="/api/card-image/render?type=PROCESS_FLOW${userParam}&title=원스톱+사건+해결+3단계+실무+절차&points=1단계:+초기+사실관계+진단|2단계:+입증+서류+제출|3단계:+최종+절세+확정" alt="${kw} - 3단계 진행 절차 로드맵" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 6. 의뢰인 빈출 질문 & 팩트 해설 고해상도 이미지 (1080x680 - Headless Serverless PNG)
 */
export function getQnACardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 6: 의뢰인 빈출 질문 & 팩트 해설 인포그래픽 이미지 - 오해하기 쉬운 질문 해소 시 삽입]
<img src="/api/card-image/render?type=QNA${userParam}&title=성실신고확인서+제출+기한은+언제까지인가요?&sub=성실신고확인대상자는+1개월+연장되어+6월+30일까지+신고·납부+가능합니다." alt="${kw} - 자주 묻는 질문과 전문가 팩트 해설" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 7. 골든타임 & 리스크 주의 경고 고해상도 이미지 (1080x680 - Headless Serverless PNG)
 */
export function getWarningRiskCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 7: 골든타임 & 리스크 주의 경고 인포그래픽 이미지 - 기한 만료나 패널티 경고 시 삽입]
<img src="/api/card-image/render?type=WARNING_RISK${userParam}&title=성실신고확인서+미제출+시+치명적+불이익+주의&sub=산출세액의+5%+가산세+즉시+부과+및+세무조사+우선+선정" alt="${kw} - 골든타임 및 패널티 리스크 주의 경고" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 8. 핵심 3줄 결론 요약 고해상도 이미지 (1080x680 - Headless Serverless PNG)
 */
export function getKeyTakeawaysTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 8: 오늘의 핵심 3줄 결론 요약 인포그래픽 이미지 - 결론부 직전 필수 삽입]
<img src="/api/card-image/render?type=KEY_TAKEAWAYS${userParam}&title=오늘+포스팅+핵심+3줄+요약&points=1️⃣+의료업+연+매출+5억+원+이상+시+성실신고확인서+제출+의무+발생|2️⃣+급여/비급여+정산+및+의료기기+상각+전문+세무사+필수|3️⃣+성실신고+확인비용+세액공제(60%,+120만+원+한도)+적극+활용" alt="${kw} - 오늘 포스팅 핵심 3줄 요약" style="display: block; width: 100%; max-width: 540px; margin: 30px auto; border-radius: 14px; box-shadow: 0 8px 22px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 9. 하단 상담 유도 (CTA) & 찾아오시는 길 배너 고해상도 이미지 (1080x540 - 3종 배너 레이아웃 자동 배정)
 */
export function getFooterBannerTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진 9: 하단 상담 유도 및 찾아오시는 길 배너 인포그래픽 이미지 - 글 최하단 필수 삽입]
<img src="/api/card-image/render?type=CTA_FOOTER${userParam}&category=EXPERT+CONSULTATION&title=송파구+병의원+세무기장+1:1+맞춤+진단&extra1=(사무소+대표번호)&extra2=(상세+주소)&extra3=(네이버+예약링크)" alt="${kw} - 1:1 전문 상담 및 예약 안내" style="display: block; width: 100%; max-width: 540px; margin: 35px auto 10px auto; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 기본 서식 템플릿 (네이버 스마트에디터 ONE 100% 보존 표준 인라인 CSS 준수)
 */
export function getInfoBoxTemplate(color: string = '#EAB308', bgColor: string = '#FEF9C3', textColor: string = '#854D0E'): string {
  return `
[안내 및 리스크 정보 박스 서식 - 네이버 100% 호환 표준 인라인 CSS]
<div style="background-color: #FEF9C3; border-left: 4px solid #EAB308; padding: 18px 20px; margin: 24px 0; border-radius: 4px; line-height: 1.6; text-align: left;">
  <strong style="color: #854D0E; font-size: 16px; display: block; margin-bottom: 6px;">💡 (핵심 강조 제목 또는 주요 리스크)</strong>
  <p style="margin: 0; color: #1F2937; font-size: 15px; line-height: 1.6;">(여기에 구체적인 설명 및 사실관계 내용 작성)</p>
</div>
  `.trim();
}

export function getQuoteTemplate(color: string = '#2563EB'): string {
  return `
[인용구 서식 - 네이버 100% 호환 표준 인라인 CSS]
<blockquote style="background-color: #F8FAFC; border-left: 4px solid ${color}; padding: 16px 20px; margin: 24px 0; color: #1F2937; font-size: 15px; line-height: 1.6; border-radius: 4px; text-align: left;">
  <strong style="color: #0F172A; font-size: 15.5px;">" (전문가 의뢰인 상담 사례나 강조 멘트 작성) "</strong>
</blockquote>
  `.trim();
}

export function getTableTemplate(color: string = '#0F172A'): string {
  return `
[비교 분석 및 준비 서류 표 서식 - 네이버 100% 호환 표준 인라인 HTML Table]
<table style="width: 100%; border-collapse: collapse; margin: 24px 0; font-size: 15px; text-align: left; background-color: #FFFFFF;">
  <thead>
    <tr style="background-color: ${color}; color: #FFFFFF;">
      <th style="padding: 12px 16px; border: 1px solid #334155; width: 25%; font-weight: bold;">(구분 / 항목)</th>
      <th style="padding: 12px 16px; border: 1px solid #334155; width: 40%; font-weight: bold;">(주요 내용 및 준비 자료)</th>
      <th style="padding: 12px 16px; border: 1px solid #334155; width: 35%; font-weight: bold;">(확인할 내용 및 실무 팁)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: bold; background-color: #F8FAFC; color: #0F172A;">(구분 1)</td>
      <td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #334155;">(상세 내용 1)</td>
      <td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #334155;">(실무 주의사항 1)</td>
    </tr>
    <tr>
      <td style="padding: 12px 16px; border: 1px solid #E2E8F0; font-weight: bold; background-color: #F8FAFC; color: #0F172A;">(구분 2)</td>
      <td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #334155;">(상세 내용 2)</td>
      <td style="padding: 12px 16px; border: 1px solid #E2E8F0; color: #334155;">(실무 주의사항 2)</td>
    </tr>
  </tbody>
</table>
  `.trim();
}

export function getDividerTemplate(color: string = '#CBD5E1'): string {
  return `
[구분선 서식]
<hr style="border: none; border-top: 1px dashed ${color}; margin: 30px 0;" />
  `.trim();
}

export function getStepByStepTemplate(color: string = '#2563EB'): string {
  return `
[단계별 가이드 서식 - 네이버 100% 호환 표준 인라인 CSS]
<div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 20px; margin: 24px 0; text-align: left;">
  <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px 16px; margin-bottom: 12px;">
    <span style="background-color: ${color}; color: #FFFFFF; padding: 3px 8px; border-radius: 3px; font-weight: bold; margin-right: 8px; font-size: 12px; display: inline-block;">STEP 1</span>
    <strong style="color: #0F172A; font-size: 15px;">(1단계 핵심 행동 지침)</strong>
    <p style="margin: 8px 0 0 0; color: #334155; font-size: 14px; line-height: 1.6;">(1단계 상세 설명)</p>
  </div>
  <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 14px 16px;">
    <span style="background-color: ${color}; color: #FFFFFF; padding: 3px 8px; border-radius: 3px; font-weight: bold; margin-right: 8px; font-size: 12px; display: inline-block;">STEP 2</span>
    <strong style="color: #0F172A; font-size: 15px;">(2단계 핵심 행동 지침)</strong>
    <p style="margin: 8px 0 0 0; color: #334155; font-size: 14px; line-height: 1.6;">(2단계 상세 설명)</p>
  </div>
</div>
  `.trim();
}

/**
 * 10. 서론 직후 스마트블록 스니펫용 [3초 핵심 요약 박스] 서식 (네이버 100% 호환 인라인 CSS)
 */
export function getIntroSummaryBoxTemplate(accentColor: string = '#2563EB', targetKeyword: string = ''): string {
  const kw = sanitizeKeyword(targetKeyword)
  return `
[서론 직후 스마트블록 스니펫용 3초 핵심 요약 박스 - 첫 번째 H2 바로 전에 필수 1회 삽입]
<blockquote style="background-color: #F8FAFC; border-left: 4px solid ${accentColor}; padding: 18px 20px; margin: 24px 0; border-radius: 6px; line-height: 1.7; text-align: left;">
  <strong style="color: #0F172A; font-size: 16px; display: block; margin-bottom: 10px;">💡 ${kw} 3초 핵심 요약</strong>
  <p style="margin: 4px 0; color: #334155; font-size: 15px;">1. <strong>(핵심 포인트 1)</strong>: (1문장 구체적 설명)</p>
  <p style="margin: 4px 0; color: #334155; font-size: 15px;">2. <strong>(핵심 포인트 2)</strong>: (1문장 구체적 설명)</p>
  <p style="margin: 4px 0; color: #334155; font-size: 15px;">3. <strong>(핵심 포인트 3)</strong>: (1문장 구체적 설명)</p>
</blockquote>
  `.trim();
}

