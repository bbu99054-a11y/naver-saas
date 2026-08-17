/**
 * [ZONE-6 & ZONE-4] 원고 내부 기획 메모 및 프롬프트 CoT 데이터 정제 유틸리티
 * 
 * AI가 글 생성 전 내부적으로 작성하는 [팩트 체크], [목표 분량], [탈 양산화 설계도] 등의
 * 핵심 기획 메모를 화면 렌더링 및 클립보드 복사 직전에 100% 안전하게 제거합니다.
 * 실시간 스트리밍 도중 불완전한 기획 메모가 화면에 깜빡이며 노출되는 현상을 원천 방지합니다.
 */

export function stripInternalMetadata(rawHtml: string): string {
  if (!rawHtml) return ''

  let clean = rawHtml.trim()

  // 1. 스트리밍 미완성 기획 메모 차단 게이트
  // 아직 기획 메모 작성 중이고 본문 시작 신호가 없는 경우 화면에 아무것도 노출하지 않음
  if (
    (clean.includes('<internal_fact_check') && !clean.includes('</internal_fact_check>')) ||
    (clean.includes('<thought') && !clean.includes('</thought>')) ||
    (clean.includes('<plan') && !clean.includes('</plan>'))
  ) {
    // 닫는 태그 이전이지만 이미 본문 시작 태그가 같이 들어온 경우 태그 앞부분만 날림
    if (clean.includes('</internal_fact_check>')) {
      clean = clean.replace(/<internal_fact_check[\s\S]*?<\/internal_fact_check>/gi, '')
    } else {
      return ''
    }
  }

  // 2. 텍스트 형태의 [팩트 체크] 스트리밍 중 본문 시작 전인 경우 차단
  const hasRealContentMarker = /<img|<p|<h[1-6]|<blockquote|“|"|'|<!--|<div style|<table/i.test(clean)
  if (/^\s*\[(팩트\s*체크|목표\s*분량|탈\s*양산화\s*설계도)/i.test(clean) && !hasRealContentMarker) {
    return ''
  }

  // 3. 태그로 감싸진 내부 기획 메모 블록 완전 제거
  clean = clean.replace(/<div[^>]*id=["']fact-check-memo["'][^>]*>[\s\S]*?<\/div>/gi, '')
  clean = clean.replace(/<internal_fact_check[\s\S]*?<\/internal_fact_check>/gi, '')
  clean = clean.replace(/<thought[\s\S]*?<\/thought>/gi, '')
  clean = clean.replace(/<plan[\s\S]*?<\/plan>/gi, '')

  // 4. 텍스트 형태로 노출된 [팩트 체크] ~ [탈 양산화 설계도] 블록 정밀 제거
  clean = clean.replace(/^\s*\[팩트\s*체크\][\s\S]*?(?=<img|<p|<h[1-6]|<blockquote|“|"|'|<!--|<div style|<table)/i, '')
  clean = clean.replace(/\[팩트\s*체크\][\s\S]*?\[탈\s*양산화\s*설계도\][\s\S]*?(?=<img|<p|<h[1-6]|<blockquote|“|"|'|<!--|<div style|<table)/i, '')
  clean = clean.replace(/^\s*\[목표\s*분량\][\s\S]*?(?=<img|<p|<h[1-6]|<blockquote|“|"|'|<!--|<div style|<table)/i, '')
  clean = clean.replace(/^\s*\[탈\s*양산화\s*설계도\][\s\S]*?(?=<img|<p|<h[1-6]|<blockquote|“|"|'|<!--|<div style|<table)/i, '')

  // 5. 만약 찌꺼기 텍스트만 남아있고 실제 본문 요소가 없다면 빈 문자열 반환
  if (/^\s*\[(팩트\s*체크|목표\s*분량|탈\s*양산화\s*설계도)/i.test(clean)) {
    clean = clean.replace(/^[\s\S]*?(?=<img|<p|<h[1-6]|<blockquote|“|"|'|<!--|<div style|<table|$)/i, '')
  }

  return clean.trim()
}
