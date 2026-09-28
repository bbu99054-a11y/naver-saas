/**
 * 네이버 블로그 스마트에디터 ONE 100% 규격 호환
 * 1분 안심 사건 진단 배너(Consult Banner) HTML 생성기
 * 
 * [설계 원칙]
 * 1. 외부 CSS 클래스 전면 배제 (네이버 복사 시 날아감 방지)
 * 2. 100% 인라인 스타일(style="...") 적용
 * 3. PC 및 모바일 반응형 max-width 및 box-sizing 가드
 * 4. 변호사법 제23조 및 변협 광고규정 제8조(부당 염가 유인 금지) 준수 면책 표기
 */

export interface ConsultBannerParams {
  storeName?: string
  industry?: string
  phone?: string
  consultUrl?: string
  refId?: string
}

export function generateConsultBannerHtml(params: ConsultBannerParams = {}): string {
  const storeName = params.storeName || '대표 변호사실'
  const targetUrl = params.consultUrl || 'https://postsyncapp.com/consult'
  const fullUrl = params.refId 
    ? `${targetUrl}${targetUrl.includes('?') ? '&' : '?'}ref=${encodeURIComponent(params.refId)}`
    : targetUrl

  return `
<!-- === [PostSync Pro] 사건 1분 안심 진단 폼 수임 배너 START === -->
<div style="margin: 40px 0 24px 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; box-sizing: border-box;">
  <div style="background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); border: 2px solid #0284C7; border-radius: 18px; padding: 28px 20px; text-align: center; box-shadow: 0 10px 25px rgba(2, 132, 199, 0.15); box-sizing: border-box; max-width: 100%;">
    
    <!-- 1. 안심 뱃지 -->
    <div style="margin-bottom: 12px;">
      <span style="display: inline-block; background-color: rgba(2, 132, 199, 0.2); border: 1px solid #38BDF8; color: #7DD3FC; font-size: 12px; font-weight: bold; padding: 4px 14px; border-radius: 20px; letter-spacing: -0.2px;">
        ⚖️ 비공개 1:1 안심 진단 · 변호사 비밀유지의무 엄수
      </span>
    </div>

    <!-- 2. 메인 헤드라인 -->
    <h3 style="font-size: 21px; font-weight: 800; color: #FFFFFF; line-height: 1.45; margin: 0 0 10px 0; letter-spacing: -0.5px;">
      내 사건 구제 가능성 & 예상 양형 기준<br>
      <span style="color: #38BDF8;">1분 무료 안심 사전 진단</span>
    </h3>

    <!-- 3. 서브 설명 -->
    <p style="font-size: 13px; color: #94A3B8; line-height: 1.65; margin: 0 0 20px 0; word-break: keep-all;">
      막막한 형사·이혼·부동산 분쟁, 혼자 고민하지 마세요.<br>
      사건 개요를 남겨주시면 <strong>${storeName}</strong>에서 실무 판례를 토대로 골든타임 내에 1차 쟁점을 직접 검토해 드립니다.
    </p>

    <!-- 4. 고전환 대형 버튼 (모바일 풀 너비 터치 가드) -->
    <div style="margin-bottom: 14px;">
      <a href="${fullUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; width: 100%; max-width: 380px; background-color: #FF6B00; color: #FFFFFF; font-size: 15px; font-weight: 900; text-decoration: none; padding: 15px 24px; border-radius: 30px; box-shadow: 0 6px 18px rgba(255, 107, 0, 0.35); box-sizing: border-box; letter-spacing: -0.3px;">
        👉 1분 안심 진단 시작하기 (모바일 직통) ➔
      </a>
    </div>

    <!-- 5. 신뢰 및 면책 하단 조항 -->
    <p style="font-size: 11px; color: #64748B; margin: 0; line-height: 1.45;">
      * 접수된 모든 정보는 암호화되어 안전하게 보호되며, 본 진단은 변호사법 제23조 및 변협 광고규정을 100% 준수합니다.
    </p>

  </div>
</div>
<!-- === [PostSync Pro] 사건 1분 안심 진단 폼 수임 배너 END === -->
`.trim()
}
