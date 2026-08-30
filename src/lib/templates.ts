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

// ─────────────────────────────────────────────────────────────────────────────
// 1. 최상단 1:1 맞춤 썸네일 & 최하단 상담 배너
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 최상단 1:1 맞춤 썸네일 고해상도 이미지 (1080x1080 - 10종 컬러 & 4종 레이아웃 자동 배정)
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
 * 하단 상담 유도 (CTA) & 찾아오시는 길 1:1 벤토 명함 배너 (1080x1080 - 상단 히어로 + 직통상담/오시는길 2단 벤토)
 */
export function getFooterBannerTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[사진: 하단 상담 유도 및 찾아오시는 길 1:1 벤토 명함 배너 - 글 최하단 필수 삽입]
<img src="/api/card-image/render?type=CTA_FOOTER${userParam}&category=EXPERT+CONSULTATION&title=(전문가+사무소명)&sub=1:1+전문+상담+·+철저한+비밀+보장&extra1=(사무소+직통전화번호)&extra2=(사무소+상세주소)" alt="${kw} - 1:1 직통 상담 및 오시는 길 안내" style="display: block; width: 100%; max-width: 480px; margin: 35px auto 10px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. [최종 엄선 Top 10] 전문직 본문 3x3 정통 벤토 그리드 카드 템플릿
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. 🚨 3대 레드플래그 경고 (RED_FLAGS)
 */
export function getRedFlagsCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 3대 레드플래그 경고 벤토 그리드 - 글 초반 독자 스크롤 정지 및 공포/경각심 자극 시 삽입]
<img src="/api/card-image/render?type=RED_FLAGS${userParam}&title=절대+혼자+진행하면+안+되는+3대+레드플래그&points=01.+사실관계+불일치+진술+및+부실+소명서+제출|02.+법정+불복+기한(골든타임)+도과+및+소명+실기|03.+유리한+핵심+증빙+누락으로+인한+가산세+및+패소+위험" alt="${kw} - 치명적 실수 및 3대 레드플래그 경고" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 2. 📊 위기 징후 자가진단표 (SELF_DIAGNOSIS)
 */
export function getSelfDiagnosisCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 위기 징후 자가진단표 벤토 그리드 - 독자 몰입 훅(Hook) 및 심각성 자가 진단 시 삽입]
<img src="/api/card-image/render?type=SELF_DIAGNOSIS${userParam}&title=내+사건+위험도+자가진단+체크리스트&points=최근+관련+기관으로부터+사전+통지/출석을+요구받았다|필수+적격증빙이나+객관적+입증+자료가+일부+누락되었다|법정+신청+기한이+1개월+이내로+임박하여+조치가+시급하다|유사+사안으로+과거+불이익+처분+또는+과태료+이력이+있다" alt="${kw} - 위기 징후 자가진단표" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 3. 🆚 나홀로 vs 전문가 시뮬레이션 (VS_SIMULATION)
 */
export function getVsSimulationCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 나홀로 vs 전문가 시뮬레이션 벤토 그리드 - 수임료 저항감 해소 및 전문가 개입 실익 증명 시 삽입]
<img src="/api/card-image/render?type=VS_SIMULATION${userParam}&title=혼자+대처+vs+공인+자격사+선임+결과+비교&extra1=나홀로+진행:+구제율+20%+및+가산세+위험&extra2=전문가+선임:+구제율+95%+및+최대+절세+확보" alt="${kw} - 나홀로 대처 vs 전문가 선임 비교" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 4. 📉 손실 스노우볼 (COST_OF_INACTION)
 */
export function getCostOfInactionCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 손실 스노우볼 벤토 그리드 - 방치 시 눈덩이처럼 불어나는 손실 경각심 및 시간적 압박 시 삽입]
<img src="/api/card-image/render?type=COST_OF_INACTION${userParam}&title=방치할수록+눈덩이처럼+불어나는+손실+스노우볼" alt="${kw} - 방치 시 손실 스노우볼 분석" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 5. ⏳ D-Day 타임라인 / 로드맵 (ACTION_TIMELINE)
 */
export function getActionTimelineCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: D-Day 타임라인 로드맵 벤토 그리드 - 앞으로 벌어질 절차 한눈에 정리 및 불안 해소 시 삽입]
<img src="/api/card-image/render?type=ACTION_TIMELINE${userParam}&title=사건+발생부터+최종+종결까지+D-Day+타임라인&points=초기+대응(골든타임):사실관계+확정+및+증빙+선제+확보|심사+및+소명(D-30):법리+검토+및+1:1+맞춤+소명서+제출|최종+권리+구제(D-Day):처분+취소+및+세액+감면+확정" alt="${kw} - D-Day 진행 절차 로드맵" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 6. 📑 필수 준비 서류함 (REQUIRED_DOSSIER)
 */
export function getRequiredDossierCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 필수 준비 서류함 벤토 그리드 - 실무 구비 서류 및 이미지 캡처/저장 유도 시 삽입]
<img src="/api/card-image/render?type=REQUIRED_DOSSIER${userParam}&title=상담+전+준비해야+할+필수+구비+서류함&points=신분증+및+가족관계증명서(상세)+[정부24]|최근+3개년+소득금액증명원+및+원천징수영수증+[홈택스]|사건+관련+처분+통지서+및+계약서+원본+[보유서류]" alt="${kw} - 필수 구비 서류함 도감" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 7. ⚖️ 처벌/과세 기준표 (CRITERIA_TABLE)
 */
export function getCriteriaTableCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 처벌/과세 기준표 벤토 그리드 - 공문서 느낌의 수치적 기준 및 법조항 팩트체크 시 삽입]
<img src="/api/card-image/render?type=CRITERIA_TABLE${userParam}&title=법정+처벌+수위+및+과세+기준표&points=1구간(기본):1년+이하+징역+또는+500만원+이하+벌금|2구간(가중):2년~5년+이하+징역+(누진세율+40%적용)|3구간(중과):면허+취소+및+징역형+가중+(가산세+최고+40%)" alt="${kw} - 법정 처벌 및 과세 기준표" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 8. 🏆 실제 성공 사례 요약 (SUCCESS_RECEIPT)
 */
export function getSuccessReceiptCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 실제 성공 사례 요약(영수증) 벤토 그리드 - 강력한 수임 동기 및 비포/애프터 입증 시 삽입]
<img src="/api/card-image/render?type=SUCCESS_RECEIPT${userParam}&title=실제+권리+구제+및+절세+성공+사례+요약&extra1=세금+5억+원+과세+예고+통지&extra2=0원+전액+취소+및+승소+종결" alt="${kw} - 실제 권리 구제 성공 영수증" style="display: block; width: 100%; max-width: 480px; margin: 25px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 9. 💬 전문가 소견서 및 팩트체크 (EXPERT_OPINION)
 */
export function getExpertOpinionCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 전문가 소견서 및 팩트체크 벤토 그리드 - 줄노트 질감 + 직인 도장으로 글 마무리 권위 부여 시 삽입]
<img src="/api/card-image/render?type=EXPERT_OPINION${userParam}&title=공인+자격사+종합+소견서+및+팩트체크&points=인터넷의+단순+정보만+믿고+대응하다가는+불리한+진술이+될+수+있습니다|적격증빙과+법정+요건을+선제+검증하면+합법적+권리+구제가+가능합니다|사안별로+적용+법리가+다르므로+반드시+전문가+1:1+진단을+권장합니다" alt="${kw} - 전문가 종합 소견서 및 팩트체크" style="display: block; width: 100%; max-width: 480px; margin: 30px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 10. ✋ 최종 결단 촉구 (FINAL_VERDICT)
 */
export function getFinalVerdictCardTemplate(userId: string = '', targetKeyword: string = ''): string {
  const userParam = userId ? `&userId=${userId}` : ''
  const kw = sanitizeKeyword(targetKeyword)
  return `
[시각 카드: 최종 결단 촉구 벤토 그리드 - 글 끝에서 이탈 방지 및 즉각 전화/상담 유도 시 삽입]
<img src="/api/card-image/render?type=FINAL_VERDICT${userParam}&title=더+늦기+전에+결단하세요&extra1=(사무소+직통전화번호)" alt="${kw} - 최종 결단 촉구 및 즉시 상담 안내" style="display: block; width: 100%; max-width: 480px; margin: 30px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. 레거시 별칭 호환 템플릿 함수
// ─────────────────────────────────────────────────────────────────────────────
export const getChecklistCardTemplate = getSelfDiagnosisCardTemplate;
export const getComparisonCardTemplate = getVsSimulationCardTemplate;
export const getHighlightStatCardTemplate = getCriteriaTableCardTemplate;
export const getProcessFlowCardTemplate = getActionTimelineCardTemplate;
export const getQnACardTemplate = getExpertOpinionCardTemplate;
export const getWarningRiskCardTemplate = getRedFlagsCardTemplate;
export const getKeyTakeawaysTemplate = getExpertOpinionCardTemplate;

// ─────────────────────────────────────────────────────────────────────────────
// 4. 기본 서식 템플릿 (네이버 스마트에디터 ONE 100% 보존 표준 인라인 CSS 준수)
// ─────────────────────────────────────────────────────────────────────────────

export function getInfoBoxTemplate(color: string = '#EAB308', bgColor: string = '#FEF9C3', textColor: string = '#854D0E'): string {
  return `
[안내 및 리스크 정보 박스 서식 - 네이버 100% 호환 인라인 CSS]
<div style="background: ${bgColor}; border-left: 4px solid ${color}; padding: 16px 18px; margin: 20px 0; border-radius: 4px; line-height: 1.6;">
  <strong style="color: ${textColor}; font-size: 16px; display: block; margin-bottom: 6px;">💡 (핵심 강조 제목 또는 주요 리스크)</strong>
  <p style="margin: 0; color: #1F2937; font-size: 15px; line-height: 1.6;">(여기에 구체적인 설명 및 사실관계 내용 작성)</p>
</div>
  `.trim();
}

export function getQuoteTemplate(color: string = '#2563EB'): string {
  return `
[인용구 서식 - 네이버 100% 호환 인라인 CSS]
<blockquote style="background: #F8FAFC; border-left: 4px solid ${color}; padding: 14px 18px; margin: 20px 0; color: #1F2937; font-size: 15px; line-height: 1.6; border-radius: 4px;">
  <strong style="color: #0F172A; font-size: 15.5px;">" (전문가 의뢰인 상담 사례나 강조 멘트 작성) "</strong>
</blockquote>
  `.trim();
}

export function getTableTemplate(color: string = '#0F172A'): string {
  return `
[비교 분석 및 준비 서류 표 서식 - 네이버 100% 호환 HTML Table]
<table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 14.5px; background: #FFF;">
  <thead>
    <tr style="background: ${color}; color: #FFF;">
      <th style="padding: 10px 14px; border: 1px solid #334155; width: 25%; font-weight: bold;">(구분 / 항목)</th>
      <th style="padding: 10px 14px; border: 1px solid #334155; width: 40%; font-weight: bold;">(주요 내용 및 준비 자료)</th>
      <th style="padding: 10px 14px; border: 1px solid #334155; width: 35%; font-weight: bold;">(확인할 내용 및 실무 팁)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px 14px; border: 1px solid #E2E8F0; font-weight: bold; background: #F8FAFC; color: #0F172A;">(구분 1)</td>
      <td style="padding: 10px 14px; border: 1px solid #E2E8F0; color: #334155;">(상세 내용 1)</td>
      <td style="padding: 10px 14px; border: 1px solid #E2E8F0; color: #334155;">(실무 주의사항 1)</td>
    </tr>
    <tr>
      <td style="padding: 10px 14px; border: 1px solid #E2E8F0; font-weight: bold; background: #F8FAFC; color: #0F172A;">(구분 2)</td>
      <td style="padding: 10px 14px; border: 1px solid #E2E8F0; color: #334155;">(상세 내용 2)</td>
      <td style="padding: 10px 14px; border: 1px solid #E2E8F0; color: #334155;">(실무 주의사항 2)</td>
    </tr>
  </tbody>
</table>
  `.trim();
}

export function getDividerTemplate(color: string = '#CBD5E1'): string {
  return `
[구분선 서식]
<hr style="border: none; border-top: 1px dashed ${color}; margin: 25px 0;" />
  `.trim();
}

export function getStepByStepTemplate(color: string = '#2563EB'): string {
  return `
[단계별 가이드 서식 - 네이버 100% 호환 인라인 CSS]
<div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; margin: 20px 0;">
  <div style="background: #FFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 12px 14px; margin-bottom: 10px;">
    <span style="background: ${color}; color: #FFF; padding: 2px 7px; border-radius: 3px; font-weight: bold; margin-right: 6px; font-size: 11.5px; display: inline-block;">STEP 1</span>
    <strong style="color: #0F172A; font-size: 15px;">(1단계 핵심 행동 지침)</strong>
    <p style="margin: 6px 0 0 0; color: #334155; font-size: 14px; line-height: 1.6;">(1단계 상세 설명)</p>
  </div>
  <div style="background: #FFF; border: 1px solid #E2E8F0; border-radius: 4px; padding: 12px 14px;">
    <span style="background: ${color}; color: #FFF; padding: 2px 7px; border-radius: 3px; font-weight: bold; margin-right: 6px; font-size: 11.5px; display: inline-block;">STEP 2</span>
    <strong style="color: #0F172A; font-size: 15px;">(2단계 핵심 행동 지침)</strong>
    <p style="margin: 6px 0 0 0; color: #334155; font-size: 14px; line-height: 1.6;">(2단계 상세 설명)</p>
  </div>
</div>
  `.trim();
}

/**
 * 서론 직후 스마트블록 스니펫용 [3초 핵심 요약 박스] 서식 (네이버 100% 호환 인라인 CSS)
 */
export function getIntroSummaryBoxTemplate(accentColor: string = '#2563EB', targetKeyword: string = ''): string {
  const kw = sanitizeKeyword(targetKeyword)
  return `
[서론 직후 스마트블록 스니펫용 3초 핵심 요약 박스 - 첫 번째 H2 바로 전에 필수 1회 삽입]
<blockquote style="background: #F8FAFC; border-left: 4px solid ${accentColor}; padding: 16px 18px; margin: 20px 0; border-radius: 6px; line-height: 1.7;">
  <strong style="color: #0F172A; font-size: 16px; display: block; margin-bottom: 8px;">💡 ${kw} 3초 핵심 요약</strong>
  <p style="margin: 3px 0; color: #334155; font-size: 14.5px;">1. <strong>(핵심 포인트 1)</strong>: (1문장 구체적 설명)</p>
  <p style="margin: 3px 0; color: #334155; font-size: 14.5px;">2. <strong>(핵심 포인트 2)</strong>: (1문장 구체적 설명)</p>
  <p style="margin: 3px 0; color: #334155; font-size: 14.5px;">3. <strong>(핵심 포인트 3)</strong>: (1문장 구체적 설명)</p>
</blockquote>
  `.trim();
}
