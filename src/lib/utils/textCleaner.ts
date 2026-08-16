/**
 * [ZONE-3] 유니코드 결합 제어 문자 및 번호 뱃지 정제 유틸리티
 */

/**
 * 3줄 요약, 체크리스트, 로드맵 등에서 중복 번호 및 깨진 유니코드 결합 문자(바코드 글리프 ≣≣) 완전 제거
 */
export function cleanSummaryText(rawText: string): string {
  if (!rawText) return ''

  return rawText
    // 1. 숫자 + 유니코드 키캡 이모지 (1️⃣, 2️⃣ 등: \d\uFE0F?\u20E3) 완전 제거
    // 2. 원문자(①~⑩), 특수 불릿(▪️, ▫️, 📌, 💡, ▶, ▷, •, -, * 등) 제거
    // 3. 일반 숫자 번호(1., 1), 1: 등) 제거
    .replace(/^(\d\uFE0F?\u20E3|\d+[.\s)\-:]*|[①-⑩]|[▪️▫️📌💡▶▷•\-*])\s*/u, '')
    // 4. 연속된 보이지 않는 제어/결합 문자(\uFE00-\uFE0F, \u200B-\u200D, \u20E0-\u20E3 등) 잔여물 완전 청소
    .replace(/[\uFE00-\uFE0F\u200B-\u200D\u20E0-\u20E3]+/g, '')
    .trim()
}

