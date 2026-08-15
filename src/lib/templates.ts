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
    name: 'Classic Navy & Gold (클래식 골드/네이비)',
    bg: '#0F172A',
    cardBg: '#1E293B',
    textColor: '#F8FAFC',
    accentColor: '#D4AF37',
    subTextColor: '#94A3B8',
    badgeBg: '#D4AF37',
    badgeText: '#0F172A',
    borderColor: '#D4AF37'
  },
  {
    name: 'Modern Tech Blue (모던 테크 블루)',
    bg: '#0B132B',
    cardBg: '#1C2541',
    textColor: '#FFFFFF',
    accentColor: '#38BDF8',
    subTextColor: '#94A3B8',
    badgeBg: '#38BDF8',
    badgeText: '#0B132B',
    borderColor: '#38BDF8'
  },
  {
    name: 'Editorial Forest Green (에디토리얼 포레스트 그린)',
    bg: '#1C2826',
    cardBg: '#233330',
    textColor: '#FDFBF7',
    accentColor: '#E2C08D',
    subTextColor: '#A2B2AE',
    badgeBg: '#E2C08D',
    badgeText: '#1C2826',
    borderColor: '#3D544F'
  },
  {
    name: 'VIP Dark Luxury (다크 럭셔리 골드)',
    bg: '#121212',
    cardBg: '#1E1E1E',
    textColor: '#F5F5F7',
    accentColor: '#C5A880',
    subTextColor: '#A1A1AA',
    badgeBg: '#C5A880',
    badgeText: '#121212',
    borderColor: '#3F3F46'
  },
  {
    name: 'Warm Oatmeal & Espresso (웜 오트밀 에스프레소)',
    bg: '#EFECE6',
    cardBg: '#FFFFFF',
    textColor: '#2B2523',
    accentColor: '#8C5E45',
    subTextColor: '#6E655F',
    badgeBg: '#D8CEBE',
    badgeText: '#2B2523',
    borderColor: '#D8CEBE'
  },
  {
    name: 'Deep Burgundy Wine (딥 버건디 와인)',
    bg: '#4A1521',
    cardBg: '#5C1C2A',
    textColor: '#FDF2F4',
    accentColor: '#F5EBE6',
    subTextColor: '#FBCFE8',
    badgeBg: '#F5EBE6',
    badgeText: '#4A1521',
    borderColor: '#83283E'
  },
  {
    name: 'Frosted Sage & Slate (프로스티드 세이지/슬레이트)',
    bg: '#F1F5F9',
    cardBg: 'rgba(255, 255, 255, 0.95)',
    textColor: '#1E293B',
    accentColor: '#0D9488',
    subTextColor: '#64748B',
    badgeBg: '#CCFBF1',
    badgeText: '#0F766E',
    borderColor: '#CBD5E1'
  },
  {
    name: 'Lavender Indigo & Mint (라벤더 인디고/민트)',
    bg: '#1E1B4B',
    cardBg: '#2E286D',
    textColor: '#EEF2FF',
    accentColor: '#A7F3D0',
    subTextColor: '#C7D2FE',
    badgeBg: '#A7F3D0',
    badgeText: '#064E3B',
    borderColor: '#4338CA'
  },
  {
    name: 'Sunset Amber & Charcoal (선셋 앰버/차콜)',
    bg: '#18181B',
    cardBg: '#27272A',
    textColor: '#FAFAFA',
    accentColor: '#F59E0B',
    subTextColor: '#A1A1AA',
    badgeBg: '#F59E0B',
    badgeText: '#18181B',
    borderColor: '#F59E0B'
  },
  {
    name: 'Monochrome Silver Minimal (모노크롬 실버 미니멀)',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    textColor: '#0F172A',
    accentColor: '#2563EB',
    subTextColor: '#475569',
    badgeBg: '#0F172A',
    badgeText: '#FFFFFF',
    borderColor: '#E2E8F0'
  }
];

export function getRandomTheme(): DesignTheme {
  return designThemes[Math.floor(Math.random() * designThemes.length)];
}

export function getThemeByIndustry(industry: string = ''): DesignTheme {
  if (industry.includes('세무') || industry.includes('회계') || industry.includes('자산')) {
    return designThemes[0]; // Classic Navy & Gold
  }
  if (industry.includes('변호사') || industry.includes('법률') || industry.includes('법무')) {
    return designThemes[2]; // Editorial Forest Green
  }
  if (industry.includes('병원') || industry.includes('의원') || industry.includes('한의원') || industry.includes('의사')) {
    return designThemes[6]; // Frosted Sage
  }
  if (industry.includes('변리사') || industry.includes('특허') || industry.includes('관세')) {
    return designThemes[1]; // Modern Tech Blue
  }
  if (industry.includes('노무') || industry.includes('행정')) {
    return designThemes[9]; // Monochrome Silver
  }
  return getRandomTheme();
}

/**
 * 1. 최상단 1:1 맞춤 썸네일 카드
 */
export function getTopThumbnailTemplate(): string {
  return `
[카드 1: 최상단 1:1 맞춤 썸네일 카드 - HTML 본문의 맨 처음에 필수 삽입]
<div style="width: 100%; max-width: 480px; aspect-ratio: 1/1; min-height: 440px; margin: 10px auto 35px auto; background-color: #0F172A; border-radius: 16px; border: 2px solid #D4AF37; box-shadow: 0 12px 30px rgba(0,0,0,0.18); box-sizing: border-box; padding: 36px 24px; text-align: center; display: table;">
  <div style="display: table-cell; vertical-align: middle; width: 100%;">
    
    <div style="margin-bottom: 20px;">
      <span style="background-color: #D4AF37; color: #0F172A; font-size: 13px; font-weight: 800; padding: 6px 14px; border-radius: 20px; letter-spacing: 0.5px; display: inline-block;">
        (글 카테고리 뱃지: 예: 2026 핵심 세무 가이드 / 긴급 승소 사례 분석 / 전문직 법률 해설)
      </span>
    </div>

    <h1 style="color: #FFFFFF; font-size: 25px; font-weight: 800; line-height: 1.45; margin: 0 0 20px 0; word-break: keep-all; letter-spacing: -0.5px;">
      (독자의 시선을 사로잡는 핵심 질문 또는 해결책 메인 타이틀 25자 내외)
    </h1>

    <p style="color: #D4AF37; font-size: 14px; font-weight: 600; margin: 0 0 24px 0; letter-spacing: -0.2px;">
      (핵심 강조 문구: 예: "놓치면 수천만 원 손해 보는 실무 핵심 기준 3가지")
    </p>

    <div style="width: 40px; height: 2px; background-color: #D4AF37; margin: 0 auto 20px auto; opacity: 0.7;"></div>

    <div style="color: #94A3B8; font-size: 12px; font-weight: 500; letter-spacing: 0.3px;">
      <span style="color: #FFFFFF; font-weight: 700;">(사무소명/전문가 성명)</span> | (사무소 위치 또는 전문 분야)
    </div>

  </div>
</div>
`.trim();
}

/**
 * 2. 체크리스트 & 3대 핵심 요건 카드
 */
export function getChecklistCardTemplate(): string {
  return `
[카드 2: 체크리스트 & 3대 핵심 요건 카드 - 본문 설명 직후 시각적 체크포인트로 삽입]
<div style="width: 100%; max-width: 540px; margin: 28px auto; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 22px 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.04); box-sizing: border-box;">
  <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 14px; text-align: left;">
    📋 (체크리스트 제목: 예: 반드시 검토해야 할 3대 필수 요건)
  </div>
  <div style="space-y: 8px;">
    <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; text-align: left;">
      <span style="color: #16A34A; font-weight: 800; margin-right: 8px;">☑️ 01.</span>
      <strong style="color: #1E293B; font-size: 14px;">(첫 번째 필수 요건)</strong>
      <p style="margin: 4px 0 0 28px; color: #64748B; font-size: 13px;">(상세 기준 및 유의사항)</p>
    </div>
    <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; text-align: left;">
      <span style="color: #16A34A; font-weight: 800; margin-right: 8px;">☑️ 02.</span>
      <strong style="color: #1E293B; font-size: 14px;">(두 번째 필수 요건)</strong>
      <p style="margin: 4px 0 0 28px; color: #64748B; font-size: 13px;">(상세 기준 및 유의사항)</p>
    </div>
    <div style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 14px; text-align: left;">
      <span style="color: #16A34A; font-weight: 800; margin-right: 8px;">☑️ 03.</span>
      <strong style="color: #1E293B; font-size: 14px;">(세 번째 필수 요건)</strong>
      <p style="margin: 4px 0 0 28px; color: #64748B; font-size: 13px;">(상세 기준 및 유의사항)</p>
    </div>
  </div>
</div>
`.trim();
}

/**
 * 3. Before vs After / 유리 vs 불리 2열 대비 카드
 */
export function getComparisonCardTemplate(): string {
  return `
[카드 3: Before vs After 비교 대비 카드 - 잘못된 대처 vs 올바른 해결 비교 시 삽입]
<div style="width: 100%; max-width: 540px; margin: 28px auto; background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); box-sizing: border-box;">
  <div style="background-color: #0F172A; color: #FFFFFF; padding: 12px 16px; font-weight: 800; font-size: 14px; text-align: center;">
    ⚖️ (비교 타이틀: 예: 사전 대비 유무에 따른 실무 결과 차이)
  </div>
  <table style="width: 100%; border-collapse: collapse; text-align: left;">
    <tr>
      <td style="width: 50%; padding: 16px; background-color: #FEF2F2; border-right: 1px solid #FECACA; vertical-align: top;">
        <span style="background-color: #EF4444; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">❌ 잘못 대처한 경우</span>
        <strong style="display: block; color: #991B1B; font-size: 14px; margin: 8px 0 4px 0;">(불리한 결과 요약)</strong>
        <p style="margin: 0; color: #7F1D1D; font-size: 12.5px; line-height: 1.45;">(세금 폭탄, 패소 리스크, 기각 사유)</p>
      </td>
      <td style="width: 50%; padding: 16px; background-color: #F0FDF4; vertical-align: top;">
        <span style="background-color: #16A34A; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 8px; border-radius: 4px;">✅ 올바른 전문가 대응</span>
        <strong style="display: block; color: #166534; font-size: 14px; margin: 8px 0 4px 0;">(유리한 결과 요약)</strong>
        <p style="margin: 0; color: #14532D; font-size: 12.5px; line-height: 1.45;">(최대 절세, 승소/감면, 과태료 구제)</p>
      </td>
    </tr>
  </table>
</div>
`.trim();
}

/**
 * 4. 핵심 수치 / 금액 / 감면율 대형 하이라이트 카드
 */
export function getHighlightStatCardTemplate(): string {
  return `
[카드 4: 핵심 수치 & 공제액 대형 하이라이트 카드 - 금액이나 세액/기간 강조 시 삽입]
<div style="width: 100%; max-width: 540px; margin: 28px auto; background: linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%); border-radius: 14px; padding: 24px 20px; color: #FFFFFF; text-align: center; box-shadow: 0 8px 20px rgba(0,0,0,0.12); box-sizing: border-box;">
  <span style="color: #A7F3D0; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase;">
    KEY STATISTIC & BENEFIT
  </span>
  <div style="color: #FDE047; font-size: 32px; font-weight: 900; margin: 8px 0 6px 0; letter-spacing: -0.5px;">
    (핵심 수치: 예: 최대 5억 원 / 100% 비과세 / 0원)
  </div>
  <strong style="color: #FFFFFF; font-size: 16px; display: block; margin-bottom: 6px;">
    (수치에 대한 명쾌한 핵심 설명 한 줄)
  </strong>
  <p style="margin: 0; color: #94A3B8; font-size: 13px; line-height: 1.45;">
    (법적 근거 조항 또는 적용 요건 부연 설명)
  </p>
</div>
`.trim();
}

/**
 * 5. 단계별 실무 행동 로드맵 카드 (3단계)
 */
export function getProcessFlowCardTemplate(): string {
  return `
[카드 5: 3단계 실무 행동 로드맵 카드 - 절차나 단계별 가이드라인 설명 시 삽입]
<div style="width: 100%; max-width: 540px; margin: 28px auto; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 20px; box-sizing: border-box; text-align: center;">
  <div style="font-size: 15px; font-weight: 800; color: #0F172A; margin-bottom: 16px; text-align: left;">
    🚀 (로드맵 타이틀: 예: 원스톱 사건 해결 3단계 실무 절차)
  </div>
  <table style="width: 100%; border-collapse: collapse; text-align: center;">
    <tr>
      <td style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 8px; width: 30%; vertical-align: top;">
        <span style="background-color: #2563EB; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">1단계</span>
        <strong style="display: block; color: #1E293B; font-size: 13px; margin-top: 6px;">(초기 사실관계 진단)</strong>
      </td>
      <td style="width: 5%; color: #94A3B8; font-size: 16px; font-weight: bold;">➔</td>
      <td style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 8px; width: 30%; vertical-align: top;">
        <span style="background-color: #2563EB; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">2단계</span>
        <strong style="display: block; color: #1E293B; font-size: 13px; margin-top: 6px;">(입증 서류 및 서면 제출)</strong>
      </td>
      <td style="width: 5%; color: #94A3B8; font-size: 16px; font-weight: bold;">➔</td>
      <td style="background-color: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 8px; padding: 12px 8px; width: 30%; vertical-align: top;">
        <span style="background-color: #16A34A; color: #FFFFFF; font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px;">3단계</span>
        <strong style="display: block; color: #1E293B; font-size: 13px; margin-top: 6px;">(최종 인용/절세 확정)</strong>
      </td>
    </tr>
  </table>
</div>
`.trim();
}

/**
 * 6. 의뢰인 핵심 질문 & 전문가 팩트 해설 카드 (Q&A)
 */
export function getQnACardTemplate(): string {
  return `
[카드 6: 의뢰인 빈출 질문 & 팩트 해설 카드 - 오해하기 쉬운 질문 해소 시 삽입]
<div style="width: 100%; max-width: 540px; margin: 28px auto; background-color: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 12px; padding: 20px; box-sizing: border-box; text-align: left;">
  <div style="margin-bottom: 10px;">
    <span style="background-color: #16A34A; color: #FFFFFF; font-size: 12px; font-weight: 800; padding: 3px 8px; border-radius: 4px; margin-right: 6px;">Q. 자주 묻는 질문</span>
    <strong style="color: #14532D; font-size: 14.5px;">(의뢰인이 가장 많이 하는 질문 문구?)</strong>
  </div>
  <div style="background-color: #FFFFFF; border-radius: 8px; padding: 14px; border: 1px solid #DCFCE7;">
    <strong style="color: #166534; font-size: 13.5px; display: block; margin-bottom: 4px;">
      💡 전문가 명쾌 해설:
    </strong>
    <p style="margin: 0; color: #374151; font-size: 13px; line-height: 1.5;">
      (단순 Yes/No를 넘어 실무적으로 적용되는 핵심 요건과 팩트를 명료하게 설명)
    </p>
  </div>
</div>
`.trim();
}

/**
 * 7. 골든타임 & 리스크 경고 카드 (Warning Risk)
 */
export function getWarningRiskCardTemplate(): string {
  return `
[카드 7: 골든타임 & 리스크 주의 경고 카드 - 기한 만료나 패널티 경고 시 삽입]
<div style="width: 100%; max-width: 540px; margin: 28px auto; background-color: #FEF2F2; border: 1px solid #FECACA; border-left: 5px solid #DC2626; border-radius: 10px; padding: 18px 20px; box-sizing: border-box; text-align: left;">
  <div style="display: table; width: 100%;">
    <div style="display: table-cell; vertical-align: middle; width: 36px; font-size: 24px;">
      🚨
    </div>
    <div style="display: table-cell; vertical-align: middle; padding-left: 10px;">
      <strong style="color: #991B1B; font-size: 15px; display: block; margin-bottom: 3px;">
        (긴급 주의 사항: 예: 법정 기한 90일 초과 시 구제 불가)
      </strong>
      <span style="color: #7F1D1D; font-size: 13px; line-height: 1.45;">
        (기한을 놓쳤을 때 발생하는 구체적인 불이익 및 즉시 조치해야 할 행동 안내)
      </span>
    </div>
  </div>
</div>
`.trim();
}

/**
 * 8. 핵심 3줄 결론 요약 카드 (Key Takeaways)
 */
export function getKeyTakeawaysTemplate(): string {
  return `
[카드 8: 핵심 3줄 결론 요약 카드 - 결론부 직전에 필수 삽입]
<div style="width: 100%; max-width: 540px; margin: 30px auto; background-color: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 22px 20px; box-sizing: border-box;">
  <div style="display: table; width: 100%; margin-bottom: 12px;">
    <span style="display: table-cell; vertical-align: middle; font-size: 18px; width: 26px;">💡</span>
    <span style="display: table-cell; vertical-align: middle; color: #92400E; font-size: 15px; font-weight: 800; letter-spacing: -0.3px;">
      오늘 포스팅 핵심 3줄 요약
    </span>
  </div>
  <div style="background-color: #FFFFFF; border-radius: 8px; padding: 14px 16px; border: 1px solid #FDE68A;">
    <p style="margin: 0 0 8px 0; color: #1E293B; font-size: 13.5px; line-height: 1.5; font-weight: 600; text-align: left;">
      1️⃣ (첫 번째 핵심 요약: 요건 및 기준 한 줄 정리)
    </p>
    <p style="margin: 0 0 8px 0; color: #1E293B; font-size: 13.5px; line-height: 1.5; font-weight: 600; text-align: left;">
      2️⃣ (두 번째 핵심 요약: 주의해야 할 핵심 리스크/패널티)
    </p>
    <p style="margin: 0; color: #1E293B; font-size: 13.5px; line-height: 1.5; font-weight: 600; text-align: left;">
      3️⃣ (세 번째 핵심 요약: 의뢰인이 당장 취해야 할 행동 지침)
    </p>
  </div>
</div>
`.trim();
}

/**
 * 9. 하단 상담 유도 (CTA) & 찾아오시는 길 배너 카드
 */
export function getFooterBannerTemplate(): string {
  return `
[카드 9: 하단 상담 유도 및 찾아오시는 길 배너 - 글 최하단 필수 삽입]
<div style="width: 100%; max-width: 540px; margin: 35px auto 10px auto; background-color: #0F172A; border-radius: 14px; border: 1px solid #334155; padding: 26px 22px; color: #FFFFFF; box-sizing: border-box; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.12);">
  
  <div style="font-size: 13px; font-weight: 700; color: #D4AF37; margin-bottom: 8px; letter-spacing: 0.5px;">
    COMPREHENSIVE PROFESSIONAL SOLUTION
  </div>
  
  <h3 style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0 0 14px 0; line-height: 1.4;">
    (의뢰인 맞춤 상담 타이틀: 예: 혼자 고민하지 마시고, 1:1 맞춤 대응 전략을 세우세요)
  </h3>
  
  <p style="font-size: 13px; color: #94A3B8; margin: 0 0 20px 0; line-height: 1.6;">
    사안별 골든타임을 놓치면 회복하기 어려운 불이익이 발생할 수 있습니다.<br>
    풍부한 실무 경험을 갖춘 전문가가 직접 사안을 진단해 드립니다.
  </p>

  <div style="background-color: #1E293B; border-radius: 10px; padding: 14px; border: 1px solid #334155; margin-bottom: 16px; text-align: left;">
    <div style="color: #F8FAFC; font-size: 13px; margin-bottom: 6px;">
      📞 <strong>직통 상담 예약:</strong> <span style="color: #D4AF37; font-weight: 700;">(사무소 대표번호)</span>
    </div>
    <div style="color: #F8FAFC; font-size: 13px; margin-bottom: 6px;">
      🏢 <strong>사무소 위치:</strong> (사무실 상세 주소)
    </div>
    <div style="color: #F8FAFC; font-size: 13px;">
      📍 <strong>네이버 지도/예약:</strong> (네이버 플레이스 또는 예약 링크)
    </div>
  </div>

  <div style="font-size: 11px; color: #64748B; line-height: 1.4;">
    * 본 포스팅은 정보 제공을 목적으로 하며, 개별 사안에 따라 구체적 판단이 달라질 수 있습니다.
  </div>
</div>
`.trim();
}

/**
 * 기본 서식 템플릿
 */
export function getInfoBoxTemplate(color: string = '#2563EB'): string {
  return `
[정보 박스 서식]
<div style="background-color: #F8FAFC; border: 1px solid #E2E8F0; border-left: 4px solid ${color}; border-radius: 8px; padding: 18px 20px; margin: 20px 0; text-align: left;">
  <strong style="color: ${color}; display: block; margin-bottom: 6px; font-size: 14.5px;">💡 핵심 체크포인트</strong>
  <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.6;">(여기에 핵심 요약 내용 작성)</p>
</div>
  `.trim();
}

export function getQuoteTemplate(color: string = '#2563EB'): string {
  return `
[인용구 서식]
<blockquote style="border-left: 4px solid ${color}; background-color: #F8FAFC; padding: 14px 18px; margin: 20px 0; color: #334155; font-style: normal; text-align: left; border-radius: 0 8px 8px 0;">
  <strong style="font-size: 14.5px; color: #1E293B;">" (전문가 의뢰인 상담 사례나 강조 멘트 작성) "</strong>
</blockquote>
  `.trim();
}

export function getTableTemplate(color: string = '#1E293B'): string {
  return `
[비교 분석 표 서식]
<table style="width: 100%; border-collapse: collapse; text-align: center; margin: 24px 0; font-size: 13.5px;">
  <thead>
    <tr>
      <th style="background-color: ${color}; color: #FFFFFF; padding: 10px 12px; border: 1px solid #E2E8F0; font-weight: bold;">(구분 / 비교 기준)</th>
      <th style="background-color: ${color}; color: #FFFFFF; padding: 10px 12px; border: 1px solid #E2E8F0; font-weight: bold;">(주요 내용 및 요건)</th>
      <th style="background-color: ${color}; color: #FFFFFF; padding: 10px 12px; border: 1px solid #E2E8F0; font-weight: bold;">(실무 시사점 및 주의사항)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #FFFFFF; font-weight: 600;">(항목 1)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #FFFFFF;">(내용 1)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #FFFFFF;">(시사점 1)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #F8FAFC; font-weight: 600;">(항목 2)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #F8FAFC;">(내용 2)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #F8FAFC;">(시사점 2)</td>
    </tr>
  </tbody>
</table>
  `.trim();
}

export function getDividerTemplate(color: string = '#E2E8F0'): string {
  return `
[구분선 서식]
<hr style="border: none; border-top: 1px dashed ${color}; margin: 30px 0;" />
  `.trim();
}

export function getStepByStepTemplate(color: string = '#2563EB'): string {
  return `
[단계별 가이드 서식]
<div style="background-color: #F8FAFC; border-radius: 10px; padding: 20px; margin: 24px 0; border: 1px solid #E2E8F0;">
  <div style="background-color: #FFFFFF; border-radius: 8px; padding: 14px; margin-bottom: 10px; border: 1px solid #E2E8F0; text-align: left;">
    <span style="background-color: ${color}; color: #FFFFFF; padding: 3px 8px; border-radius: 4px; font-weight: bold; margin-right: 8px; font-size: 12px;">STEP 1</span>
    <strong style="color: #1E293B; font-size: 14px;">(1단계 핵심 행동 지침)</strong>
    <p style="margin: 6px 0 0 0; color: #475569; font-size: 13px; line-height: 1.5;">(1단계 상세 설명)</p>
  </div>
  <div style="background-color: #FFFFFF; border-radius: 8px; padding: 14px; border: 1px solid #E2E8F0; text-align: left;">
    <span style="background-color: ${color}; color: #FFFFFF; padding: 3px 8px; border-radius: 4px; font-weight: bold; margin-right: 8px; font-size: 12px;">STEP 2</span>
    <strong style="color: #1E293B; font-size: 14px;">(2단계 핵심 행동 지침)</strong>
    <p style="margin: 6px 0 0 0; color: #475569; font-size: 13px; line-height: 1.5;">(2단계 상세 설명)</p>
  </div>
</div>
  `.trim();
}
