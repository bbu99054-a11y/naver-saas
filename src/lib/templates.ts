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

/**
 * 1. 최상단 1:1 맞춤 썸네일 고해상도 이미지 (800x800 - 프리미엄 라이트 테마)
 */
export function getTopThumbnailTemplate(): string {
  return `
[사진 1: 최상단 1:1 맞춤 썸네일 이미지 - HTML 본문 최상단 필수 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 800' width='800' height='800'><rect width='800' height='800' rx='32' fill='%23FDFBF7' stroke='%23D4AF37' stroke-width='6'/><rect x='24' y='24' width='752' height='752' rx='20' fill='none' stroke='%23E2E8F0' stroke-width='2'/><g transform='translate(400, 160)' text-anchor='middle'><rect x='-140' y='-24' width='280' height='48' rx='24' fill='%23FEF3C7' stroke='%23FDE68A' stroke-width='2'/><text y='8' fill='%2392400E' font-size='20' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>2026 핵심 실무 가이드</text></g><text x='400' y='320' text-anchor='middle' fill='%230F172A' font-size='38' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif' letter-spacing='-1'>송파구 병의원 세무기장</text><text x='400' y='380' text-anchor='middle' fill='%230F172A' font-size='38' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif' letter-spacing='-1'>성실신고확인대상 핵심 검토</text><text x='400' y='470' text-anchor='middle' fill='%23B45309' font-size='24' font-weight='600' font-family='Pretendard, -apple-system, sans-serif'>놓치면 막대한 가산세가 부과되는 실무 기준 3가지</text><line x1='340' y1='530' x2='460' y2='530' stroke='%23D4AF37' stroke-width='3' stroke-linecap='round'/><text x='400' y='610' text-anchor='middle' fill='%230F172A' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>(전문가 사무소명)</text><text x='400' y='650' text-anchor='middle' fill='%2364748B' font-size='18' font-family='Pretendard, -apple-system, sans-serif'>(사무소 위치 및 전문 분야)</text></svg>" alt="2026 핵심 실무 가이드 대표 썸네일" style="display: block; width: 100%; max-width: 480px; margin: 20px auto 35px auto; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 2. 3대 필수 요건 체크리스트 고해상도 이미지 (800x450 - 라이트 테마)
 */
export function getChecklistCardTemplate(): string {
  return `
[사진 2: 3대 필수 요건 체크리스트 인포그래픽 이미지 - 본문 설명 직후 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' width='800' height='450'><rect width='800' height='450' rx='24' fill='%23F8FAFC' stroke='%23E2E8F0' stroke-width='2'/><text x='50' y='60' fill='%230F172A' font-size='24' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>📋 반드시 검토해야 할 3대 필수 체크리스트</text><g transform='translate(50, 90)'><rect width='700' height='85' rx='14' fill='%23FFFFFF' stroke='%23CBD5E1' stroke-width='1.5'/><text x='25' y='42' fill='%2316A34A' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>☑️ 01. 첫 번째 핵심 요건 및 기준</text><text x='65' y='68' fill='%23475569' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>매출 5억 원 이상 시 성실신고확인서 제출 의무 즉시 발생</text></g><g transform='translate(50, 195)'><rect width='700' height='85' rx='14' fill='%23FFFFFF' stroke='%23CBD5E1' stroke-width='1.5'/><text x='25' y='42' fill='%2316A34A' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>☑️ 02. 두 번째 핵심 요건 및 기준</text><text x='65' y='68' fill='%23475569' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>비급여 수입 및 의료기기 리스 감가상각 선제적 검증 필수</text></g><g transform='translate(50, 300)'><rect width='700' height='85' rx='14' fill='%23FFFFFF' stroke='%23CBD5E1' stroke-width='1.5'/><text x='25' y='42' fill='%2316A34A' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>☑️ 03. 세 번째 핵심 요건 및 기준</text><text x='65' y='68' fill='%23475569' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>성실신고 세액공제(최대 120만 원) 및 의료비 공제 적극 활용</text></g></svg>" alt="3대 필수 요건 체크리스트 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 3. Before vs After 비교 대비 고해상도 이미지 (800x450 - 라이트 테마)
 */
export function getComparisonCardTemplate(): string {
  return `
[사진 3: Before vs After 비교 대비 인포그래픽 이미지 - 잘못된 대처 vs 올바른 해결 비교 시 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' width='800' height='450'><rect width='800' height='450' rx='24' fill='%23FFFFFF' stroke='%23E2E8F0' stroke-width='2'/><path d='M0 24 Q0 0 24 0 L776 0 Q800 0 800 24 L800 70 L0 70 Z' fill='%23F1F5F9'/><text x='400' y='44' text-anchor='middle' fill='%230F172A' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>⚖️ 일반 기장 대리 vs 병의원 전문 성실신고 기장 비교</text><g transform='translate(35, 95)'><rect width='350' height='315' rx='16' fill='%23FEF2F2' stroke='%23FECACA' stroke-width='2'/><rect x='20' y='20' width='140' height='36' rx='8' fill='%23EF4444'/><text x='90' y='44' text-anchor='middle' fill='%23FFFFFF' font-size='15' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>❌ 일반 기장 방식</text><text x='20' y='95' fill='%23991B1B' font-size='20' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>단순 장부 작성 중심</text><text x='20' y='140' fill='%237F1D1D' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>• 건보공단 매출 일치 위주</text><text x='20' y='180' fill='%237F1D1D' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>• 비급여/네트제 인건비 소명 누락</text><text x='20' y='220' fill='%237F1D1D' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>• 소득율 조절 시 세무조사 리스크</text></g><g transform='translate(415, 95)'><rect width='350' height='315' rx='16' fill='%23F0FDF4' stroke='%23BBF7D0' stroke-width='2'/><rect x='20' y='20' width='160' height='36' rx='8' fill='%2316A34A'/><text x='100' y='44' text-anchor='middle' fill='%23FFFFFF' font-size='15' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>✅ 전문 성실신고 방식</text><text x='20' y='95' fill='%23166534' font-size='20' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>적격증빙 선제적 검증</text><text x='20' y='140' fill='%2314532D' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>• 매월 비급여 수입/재고 검증</text><text x='20' y='180' fill='%2314532D' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>• 법정 세액공제 100% 안전 적용</text><text x='20' y='220' fill='%2314532D' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>• 성실신고확인서 세무사 연대 보증</text></g></svg>" alt="일반 기장 대리 vs 전문 성실신고 비교 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 4. 핵심 수치 & 감면율 대형 하이라이트 고해상도 이미지 (800x400 - 화사한 골드/블루 라이트 테마)
 */
export function getHighlightStatCardTemplate(): string {
  return `
[사진 4: 핵심 수치 & 공제액 대형 하이라이트 인포그래픽 이미지 - 금액이나 세액/기간 강조 시 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 400' width='800' height='400'><rect width='800' height='400' rx='24' fill='%23EFF6FF' stroke='%23BFDBFE' stroke-width='2'/><text x='400' y='80' text-anchor='middle' fill='%232563EB' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif' letter-spacing='2'>MEDICAL TAX STATISTIC &amp; RULE</text><text x='400' y='180' text-anchor='middle' fill='%231E40AF' font-size='56' font-weight='900' font-family='Pretendard, -apple-system, sans-serif' letter-spacing='-1'>연 수입금액 5억 원 이상</text><text x='400' y='250' text-anchor='middle' fill='%230F172A' font-size='24' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>의료업 성실신고확인서 의무 제출 대상 적용</text><text x='400' y='310' text-anchor='middle' fill='%2364748B' font-size='18' font-family='Pretendard, -apple-system, sans-serif'>[법적 근거: 소득세법 제70조의2 / 미제출 시 산출세액 5% 가산세 부과]</text></svg>" alt="핵심 수치 하이라이트 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 8px 25px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 5. 3단계 실무 행동 로드맵 고해상도 이미지 (800x450 - 라이트 테마)
 */
export function getProcessFlowCardTemplate(): string {
  return `
[사진 5: 3단계 실무 행동 로드맵 인포그래픽 이미지 - 절차나 단계별 가이드라인 설명 시 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 450' width='800' height='450'><rect width='800' height='450' rx='24' fill='%23F8FAFC' stroke='%23E2E8F0' stroke-width='2'/><text x='50' y='65' fill='%230F172A' font-size='24' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>🚀 원스톱 사건 해결 3단계 실무 절차</text><g transform='translate(50, 110)'><rect width='200' height='260' rx='16' fill='%23FFFFFF' stroke='%23CBD5E1' stroke-width='2'/><rect x='20' y='20' width='70' height='32' rx='6' fill='%232563EB'/><text x='55' y='42' text-anchor='middle' fill='%23FFFFFF' font-size='14' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>1단계</text><text x='20' y='95' fill='%230F172A' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>초기 사실관계 진단</text><text x='20' y='140' fill='%23475569' font-size='14' font-family='Pretendard, -apple-system, sans-serif'>• 매출/지출 증빙 분석</text><text x='20' y='170' fill='%23475569' font-size='14' font-family='Pretendard, -apple-system, sans-serif'>• 세무 리스크 포인트 도출</text></g><text x='275' y='245' text-anchor='middle' fill='%2394A3B8' font-size='28' font-weight='bold'>➔</text><g transform='translate(300, 110)'><rect width='200' height='260' rx='16' fill='%23FFFFFF' stroke='%23CBD5E1' stroke-width='2'/><rect x='20' y='20' width='70' height='32' rx='6' fill='%232563EB'/><text x='55' y='42' text-anchor='middle' fill='%23FFFFFF' font-size='14' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>2단계</text><text x='20' y='95' fill='%230F172A' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>입증 서류 제출</text><text x='20' y='140' fill='%23475569' font-size='14' font-family='Pretendard, -apple-system, sans-serif'>• 적격 증빙 완벽 구비</text><text x='20' y='170' fill='%23475569' font-size='14' font-family='Pretendard, -apple-system, sans-serif'>• 성실신고확인서 서명</text></g><text x='525' y='245' text-anchor='middle' fill='%2394A3B8' font-size='28' font-weight='bold'>➔</text><g transform='translate(550, 110)'><rect width='200' height='260' rx='16' fill='%23FFFFFF' stroke='%23CBD5E1' stroke-width='2'/><rect x='20' y='20' width='70' height='32' rx='6' fill='%2316A34A'/><text x='55' y='42' text-anchor='middle' fill='%23FFFFFF' font-size='14' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>3단계</text><text x='20' y='95' fill='%230F172A' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>최종 절세 확정</text><text x='20' y='140' fill='%23475569' font-size='14' font-family='Pretendard, -apple-system, sans-serif'>• 세액공제 혜택 수령</text><text x='20' y='170' fill='%23475569' font-size='14' font-family='Pretendard, -apple-system, sans-serif'>• 세무조사 완전 방어</text></g></svg>" alt="3단계 실무 절차 로드맵 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 6. 의뢰인 빈출 질문 & 팩트 해설 고해상도 이미지 (800x420 - 라이트 테마)
 */
export function getQnACardTemplate(): string {
  return `
[사진 6: 의뢰인 빈출 질문 & 팩트 해설 인포그래픽 이미지 - 오해하기 쉬운 질문 해소 시 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 420' width='800' height='420'><rect width='800' height='420' rx='24' fill='%23F0FDF4' stroke='%23BBF7D0' stroke-width='2'/><g transform='translate(50, 45)'><rect width='160' height='36' rx='8' fill='%2316A34A'/><text x='80' y='24' text-anchor='middle' fill='%23FFFFFF' font-size='16' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>Q. 자주 묻는 질문</text><text x='180' y='26' fill='%2314532D' font-size='20' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>성실신고확인서 제출 기한은 언제까지인가요?</text></g><g transform='translate(50, 110)'><rect width='700' height='260' rx='16' fill='%23FFFFFF' stroke='%23DCFCE7' stroke-width='2'/><text x='30' y='45' fill='%23166534' font-size='20' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>💡 전문가 명쾌 해설:</text><text x='30' y='95' fill='%230F172A' font-size='17' font-family='Pretendard, -apple-system, sans-serif'>일반 종합소득세 신고 기한은 5월 31일까지이지만,</text><text x='30' y='135' fill='%2315803D' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>성실신고확인대상자는 1개월 연장되어 6월 30일까지 신고·납부 가능합니다.</text><text x='30' y='180' fill='%23475569' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>충분한 검토 시간을 확보하여 세액공제와 절세 전략을 수립할 수 있습니다.</text></g></svg>" alt="자주 묻는 질문과 전문가 팩트 해설 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 7. 골든타임 & 리스크 주의 경고 고해상도 이미지 (800x380 - 라이트 테마)
 */
export function getWarningRiskCardTemplate(): string {
  return `
[사진 7: 골든타임 & 리스크 주의 경고 인포그래픽 이미지 - 기한 만료나 패널티 경고 시 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 380' width='800' height='380'><rect width='800' height='380' rx='24' fill='%23FEF2F2' stroke='%23FECACA' stroke-width='2'/><rect width='16' height='380' rx='8' fill='%23DC2626'/><text x='60' y='75' fill='%23DC2626' font-size='32'>🚨</text><text x='110' y='72' fill='%23991B1B' font-size='24' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>성실신고확인서 미제출 시 치명적 불이익 주의</text><g transform='translate(60, 115)'><rect width='680' height='215' rx='14' fill='%23FFFFFF' stroke='%23FEE2E2' stroke-width='1.5'/><text x='30' y='50' fill='%23B91C1C' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>• 산출세액의 5% 가산세 즉시 부과</text><text x='30' y='95' fill='%23B91C1C' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>• 국세청 세무조사 수시평가 대상 우선 선정</text><text x='30' y='145' fill='%23475569' font-size='16' font-family='Pretendard, -apple-system, sans-serif'>기한 내 전문 세무사와 서류 검토를 완료하지 않으면 막대한 손실이 발생합니다.</text></g></svg>" alt="골든타임 및 패널티 리스크 주의 경고 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 25px auto; border-radius: 14px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
`.trim();
}

/**
 * 8. 핵심 3줄 결론 요약 고해상도 이미지 (800x480 - 화사한 웜 크림/옐로우 테마)
 */
export function getKeyTakeawaysTemplate(): string {
  return `
[사진 8: 오늘의 핵심 3줄 결론 요약 인포그래픽 이미지 - 결론부 직전 필수 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 480' width='800' height='480'><rect width='800' height='480' rx='24' fill='%23FEF3C7' stroke='%23FDE68A' stroke-width='3'/><text x='50' y='65' fill='%23B45309' font-size='26' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>💡 오늘 포스팅 핵심 3줄 요약</text><g transform='translate(50, 95)'><rect width='700' height='335' rx='16' fill='%23FFFFFF' stroke='%23FDE68A' stroke-width='2'/><text x='30' y='55' fill='%232563EB' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>1️⃣</text><text x='75' y='53' fill='%230F172A' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>의료업 연 매출 5억 원 이상 시 성실신고확인서 제출 의무 발생.</text><text x='30' y='145' fill='%232563EB' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>2️⃣</text><text x='75' y='143' fill='%230F172A' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>급여/비급여 정산, 네트제 인건비, 의료기기 상각 전문 세무사 필수.</text><text x='30' y='235' fill='%232563EB' font-size='22' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>3️⃣</text><text x='75' y='233' fill='%230F172A' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>성실신고 확인비용 세액공제(60%, 120만 원 한도) 적극 활용 필요.</text></g></svg>" alt="오늘 포스팅 핵심 3줄 요약 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 30px auto; border-radius: 14px; box-shadow: 0 8px 22px rgba(0,0,0,0.08);" />
`.trim();
}

/**
 * 9. 하단 상담 유도 (CTA) & 찾아오시는 길 배너 고해상도 이미지 (800x480 - 프리미엄 라이트 테마)
 */
export function getFooterBannerTemplate(): string {
  return `
[사진 9: 하단 상담 유도 및 찾아오시는 길 배너 인포그래픽 이미지 - 글 최하단 필수 삽입]
<img src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 480' width='800' height='480'><rect width='800' height='480' rx='24' fill='%23FDFBF7' stroke='%23D4AF37' stroke-width='3'/><text x='400' y='65' text-anchor='middle' fill='%23B45309' font-size='18' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif' letter-spacing='2'>SONGPA CLINICAL TAX SOLUTION</text><text x='400' y='125' text-anchor='middle' fill='%230F172A' font-size='28' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>송파구 병의원 세무기장 &amp; 성실신고 1:1 맞춤 진단</text><text x='400' y='170' text-anchor='middle' fill='%2364748B' font-size='18' font-family='Pretendard, -apple-system, sans-serif'>풍부한 실무 경험을 갖춘 세무사가 직접 정밀 진단해 드립니다.</text><g transform='translate(60, 205)'><rect width='680' height='185' rx='16' fill='%23FFFFFF' stroke='%23E2E8F0' stroke-width='2'/><text x='40' y='52' fill='%230F172A' font-size='19' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>📞 직통 상담 문의: <tspan fill='%232563EB'>(사무소 대표번호)</tspan></text><text x='40' y='102' fill='%230F172A' font-size='19' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>🏢 사무소 위치: <tspan fill='%23475569' font-weight='normal'>(상세 주소)</tspan></text><text x='40' y='152' fill='%230F172A' font-size='19' font-weight='bold' font-family='Pretendard, -apple-system, sans-serif'>📍 네이버 예약: <tspan fill='%232563EB' font-weight='normal'>(네이버 지도/예약 링크)</tspan></text></g><text x='400' y='440' text-anchor='middle' fill='%2394A3B8' font-size='14' font-family='Pretendard, -apple-system, sans-serif'>* 사전 예약을 통해 원장님 일정에 맞춘 개별 세무 진단 상담이 가능합니다.</text></svg>" alt="전문 상담 유도 및 사무소 안내 배너 인포그래픽" style="display: block; width: 100%; max-width: 540px; margin: 35px auto 10px auto; border-radius: 14px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" />
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

export function getTableTemplate(color: string = '#0F172A'): string {
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
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #FFFFFF; font-weight: 600; color: #0F172A;">(항목 1)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #FFFFFF; color: #334155;">(내용 1)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #FFFFFF; color: #334155;">(시사점 1)</td>
    </tr>
    <tr>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #F8FAFC; font-weight: 600; color: #0F172A;">(항목 2)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #F8FAFC; color: #334155;">(내용 2)</td>
      <td style="padding: 10px; border: 1px solid #E2E8F0; background-color: #F8FAFC; color: #334155;">(시사점 2)</td>
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
