import React from 'react'

export type CardType =
  | 'MAIN_THUMBNAIL'
  | 'CHECKLIST'
  | 'COMPARISON'
  | 'STAT_HIGHLIGHT'
  | 'PROCESS_FLOW'
  | 'QNA'
  | 'WARNING_RISK'
  | 'KEY_TAKEAWAYS'
  | 'CTA_FOOTER'

export interface CardPayload {
  type: CardType
  category: string
  title: string
  subText?: string
  points?: string[]
  signature?: string
  extra1?: string // comparison col 1 or QNA question
  extra2?: string // comparison col 2 or QNA answer
  extra3?: string // stat value or highlight label
  seed: string // 글 고유 ID 기반 결정론적 난수 시드
  themeName?: string
}

// Simple Deterministic PRNG (Linear Congruential Generator)
function createPrng(seedStr: string) {
  let h = 1779033703 ^ seedStr.length
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
}

export function buildProceduralCardComponent(payload: CardPayload): React.ReactElement {
  const prng = createPrng(payload.seed + payload.type)

  // 1. Tier 3: 동적 지오메트리 & 여백 섭동 (40px ~ 56px, 코너 12~24px)
  const padding = Math.floor(40 + prng() * 16)
  const borderRadius = Math.floor(14 + prng() * 12)
  const borderWidth = prng() > 0.3 ? 2 : 1

  // 2. Tier 2: 전문직 특화 프리미엄 라이트 모드 컬러 팔레트 (고대비 가독성 보장)
  const palettes = [
    // Classic Cream & Gold
    {
      bg: '#FDFBF7',
      cardBg: '#FFFFFF',
      text: '#0F172A',
      accent: '#B45309',
      badgeBg: '#FEF3C7',
      badgeText: '#92400E',
      sub: '#475569',
      border: '#E2E8F0',
      highlightBg: '#FFFBEB',
    },
    // Modern Ice Blue
    {
      bg: '#F0F9FF',
      cardBg: '#FFFFFF',
      text: '#0B132B',
      accent: '#2563EB',
      badgeBg: '#DBEAFE',
      badgeText: '#1E40AF',
      sub: '#475569',
      border: '#BAE6FD',
      highlightBg: '#EFF6FF',
    },
    // Frosted Sage & Mint
    {
      bg: '#F0FDF4',
      cardBg: '#FFFFFF',
      text: '#14532D',
      accent: '#16A34A',
      badgeBg: '#DCFCE7',
      badgeText: '#15803D',
      sub: '#475569',
      border: '#BBF7D0',
      highlightBg: '#F0FDF4',
    },
    // Warm Oatmeal
    {
      bg: '#F7F5F0',
      cardBg: '#FFFFFF',
      text: '#2B2523',
      accent: '#8C5E45',
      badgeBg: '#EFECE6',
      badgeText: '#2B2523',
      sub: '#6E655F',
      border: '#D8CEBE',
      highlightBg: '#FAF8F5',
    },
    // Soft Lavender
    {
      bg: '#F5F3FF',
      cardBg: '#FFFFFF',
      text: '#1E1B4B',
      accent: '#7C3AED',
      badgeBg: '#EDE9FE',
      badgeText: '#6D28D9',
      sub: '#475569',
      border: '#DDD6FE',
      highlightBg: '#FAF5FF',
    },
    // Clean Modern Slate
    {
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      text: '#0F172A',
      accent: '#2563EB',
      badgeBg: '#E2E8F0',
      badgeText: '#0F172A',
      sub: '#475569',
      border: '#CBD5E1',
      highlightBg: '#F1F5F9',
    },
  ]

  const paletteIndex = Math.floor(prng() * palettes.length)
  const palette = palettes[paletteIndex]

  // 카드 타입별 전용 렌더링 분기
  switch (payload.type) {
    case 'MAIN_THUMBNAIL':
      return renderThumbnailCard(payload, palette, padding, borderRadius, borderWidth)
    case 'CHECKLIST':
      return renderChecklistCard(payload, palette, padding, borderRadius, borderWidth)
    case 'COMPARISON':
      return renderComparisonCard(payload, palette, padding, borderRadius, borderWidth)
    case 'STAT_HIGHLIGHT':
      return renderStatHighlightCard(payload, palette, padding, borderRadius, borderWidth)
    case 'PROCESS_FLOW':
      return renderProcessFlowCard(payload, palette, padding, borderRadius, borderWidth)
    case 'QNA':
      return renderQnaCard(payload, palette, padding, borderRadius, borderWidth)
    case 'WARNING_RISK':
      return renderWarningCard(payload, palette, padding, borderRadius, borderWidth)
    case 'KEY_TAKEAWAYS':
      return renderSummaryCard(payload, palette, padding, borderRadius, borderWidth)
    case 'CTA_FOOTER':
      return renderCtaCard(payload, palette, padding, borderRadius, borderWidth)
    default:
      return renderThumbnailCard(payload, palette, padding, borderRadius, borderWidth)
  }
}

/**
 * 1. 최상단 1:1 맞춤 썸네일 카드 (800x800)
 */
function renderThumbnailCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  const titleSize = payload.title.length > 24 ? 38 : 44

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '800px',
        height: '800px',
        backgroundColor: palette.bg,
        border: `${borderWidth}px solid ${palette.border}`,
        borderRadius: `${radius}px`,
        padding: `${padding + 10}px`,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      {/* 상단 뱃지 */}
      <div
        style={{
          display: 'flex',
          backgroundColor: palette.badgeBg,
          color: palette.badgeText,
          padding: '10px 24px',
          borderRadius: '24px',
          fontSize: '20px',
          fontWeight: 'bold',
          border: `1px solid ${palette.border}`,
        }}
      >
        {payload.category || '2026 핵심 실무 가이드'}
      </div>

      {/* 중앙 메인 타이틀 영역 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          maxWidth: '680px',
        }}
      >
        <div
          style={{
            fontSize: `${titleSize}px`,
            lineHeight: 1.35,
            fontWeight: 'bold',
            color: palette.text,
            wordBreak: 'keep-all',
          }}
        >
          {payload.title}
        </div>

        {payload.subText && (
          <div
            style={{
              fontSize: '24px',
              fontWeight: '600',
              color: palette.accent,
              lineHeight: 1.45,
              wordBreak: 'keep-all',
            }}
          >
            {payload.subText}
          </div>
        )}
      </div>

      {/* 하단 브랜드 및 서명 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
          borderTop: `2px solid ${palette.border}`,
          paddingTop: '20px',
          width: '80%',
        }}
      >
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: palette.text }}>
          {payload.signature || '(전문가 사무소명)'}
        </div>
        <div style={{ fontSize: '17px', color: palette.sub }}>
          PostSynk Verified C-Rank SEO Content
        </div>
      </div>
    </div>
  )
}

/**
 * 2. 3대 필수 요건 체크리스트 카드 (800x450)
 */
function renderChecklistCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  const points = payload.points && payload.points.length > 0
    ? payload.points
    : [
        '첫 번째 핵심 요건 및 사전 검토 기준',
        '두 번째 필수 적격증빙 및 세무/법률 서류',
        '세 번째 법정 공제 혜택 및 안전 조치 적용',
      ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '800px',
        height: '450px',
        backgroundColor: palette.bg,
        border: `${borderWidth}px solid ${palette.border}`,
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: palette.text }}>
          📋 {payload.title || '반드시 검토해야 할 필수 체크리스트'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {points.slice(0, 3).map((pt, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: palette.cardBg,
              border: `1.5px solid ${palette.border}`,
              borderRadius: '12px',
              padding: '14px 20px',
              gap: '14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                color: '#16A34A',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              ☑️
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '18px', fontWeight: 'bold', color: palette.text }}>
                {`0${idx + 1}. ${pt.split(':')[0] || pt}`}
              </div>
              {pt.includes(':') && (
                <div style={{ fontSize: '15px', color: palette.sub }}>
                  {pt.split(':')[1]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 3. Before vs After 비교 대비 카드 (800x450)
 */
function renderComparisonCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '800px',
        height: '450px',
        backgroundColor: palette.cardBg,
        border: `${borderWidth}px solid ${palette.border}`,
        borderRadius: `${radius}px`,
        padding: `${padding - 5}px`,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '22px',
          fontWeight: 'bold',
          color: palette.text,
          borderBottom: `1px solid ${palette.border}`,
          paddingBottom: '12px',
        }}
      >
        ⚖️ {payload.title || '일반적인 대처 vs 올바른 전문가 해결책 비교'}
      </div>

      <div style={{ display: 'flex', gap: '20px', height: '310px' }}>
        {/* Before (불리) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#FEF2F2',
            border: '2px solid #FECACA',
            borderRadius: '14px',
            padding: '16px',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}
          >
            ❌ 잘못된 대처 방식
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#991B1B' }}>
            {payload.extra1 || '단순 방치 및 부실 증빙 제출'}
          </div>
          <div style={{ fontSize: '15px', color: '#7F1D1D', lineHeight: 1.5 }}>
            • 과태료 및 가산세 리스크 발생<br />
            • 실질 소명 기회 상실 및 불이익<br />
            • 법적 구제 골든타임 경과
          </div>
        </div>

        {/* After (유리) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#F0FDF4',
            border: '2px solid #BBF7D0',
            borderRadius: '14px',
            padding: '16px',
            gap: '10px',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}
          >
            ✅ 전문가 정밀 대응
          </div>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#166534' }}>
            {payload.extra2 || '적격증빙 선제적 검증 및 1:1 방어'}
          </div>
          <div style={{ fontSize: '15px', color: '#14532D', lineHeight: 1.5 }}>
            • 법정 감면/공제 혜택 100% 확보<br />
            • 사실관계 입증 서류 완벽 구비<br />
            • 사건 종결까지 세무/법률 리스크 차단
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 4. 핵심 수치 & 감면율 대형 하이라이트 카드 (800x400)
 */
function renderStatHighlightCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '800px',
        height: '400px',
        backgroundColor: palette.highlightBg,
        border: `${borderWidth}px solid ${palette.border}`,
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        boxSizing: 'border-box',
        textAlign: 'center',
        gap: '16px',
      }}
    >
      <div
        style={{
          fontSize: '18px',
          fontWeight: 'bold',
          color: palette.accent,
          letterSpacing: '2px',
        }}
      >
        {payload.category || 'KEY METRIC & LEGAL STANDARD'}
      </div>

      <div
        style={{
          fontSize: '52px',
          fontWeight: '900',
          color: palette.text,
          letterSpacing: '-1px',
          lineHeight: 1.2,
        }}
      >
        {payload.title}
      </div>

      {payload.subText && (
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: palette.sub }}>
          {payload.subText}
        </div>
      )}

      {payload.extra3 && (
        <div style={{ fontSize: '16px', color: '#64748B' }}>
          {payload.extra3}
        </div>
      )}
    </div>
  )
}

/**
 * 5. 3단계 실무 행동 로드맵 카드 (800x450)
 */
function renderProcessFlowCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  const steps = payload.points && payload.points.length >= 3
    ? payload.points
    : ['초기 사실관계 정밀 진단', '적격 증빙 서류 제출', '최종 절세 및 권리 구제 확정']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '800px',
        height: '450px',
        backgroundColor: palette.bg,
        border: `${borderWidth}px solid ${palette.border}`,
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: '22px', fontWeight: 'bold', color: palette.text }}>
        🚀 {payload.title || '원스톱 사건 해결 3단계 실무 절차'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '14px' }}>
        {steps.slice(0, 3).map((step, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              flexDirection: 'column',
              flex: 1,
              backgroundColor: palette.cardBg,
              border: `2px solid ${idx === 2 ? '#86EFAC' : palette.border}`,
              borderRadius: '14px',
              padding: '16px 14px',
              height: '240px',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: idx === 2 ? '#16A34A' : palette.accent,
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 'bold',
                alignSelf: 'flex-start',
              }}
            >
              STEP {idx + 1}
            </div>

            <div style={{ fontSize: '18px', fontWeight: 'bold', color: palette.text, lineHeight: 1.35 }}>
              {step.split(':')[0] || step}
            </div>

            <div style={{ fontSize: '14px', color: palette.sub, lineHeight: 1.4 }}>
              {step.split(':')[1] || '전문가 사전 검토 및 1:1 맞춤 조치'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 6. 의뢰인 빈출 질문 & 팩트 해설 카드 (800x420)
 */
function renderQnaCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '800px',
        height: '420px',
        backgroundColor: palette.bg,
        border: `${borderWidth}px solid ${palette.border}`,
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.accent,
            color: '#FFFFFF',
            padding: '6px 14px',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Q. 자주 묻는 질문
        </div>
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: palette.text }}>
          {payload.title}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.cardBg,
          border: `2px solid ${palette.border}`,
          borderRadius: '16px',
          padding: '24px',
          gap: '12px',
        }}
      >
        <div style={{ fontSize: '20px', fontWeight: 'bold', color: palette.accent }}>
          💡 전문가 명쾌 해설:
        </div>
        <div style={{ fontSize: '18px', fontWeight: '600', color: palette.text, lineHeight: 1.5 }}>
          {payload.subText || payload.extra2 || '법정 기한 및 요건에 맞춰 선제적으로 대응하면 세액공제와 권리 구제가 모두 가능합니다.'}
        </div>
      </div>
    </div>
  )
}

/**
 * 7. 골든타임 & 리스크 주의 경고 카드 (800x380)
 */
function renderWarningCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '800px',
        height: '380px',
        backgroundColor: '#FEF2F2',
        border: '2px solid #FECACA',
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ fontSize: '32px' }}>🚨</div>
        <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#991B1B' }}>
          {payload.title || '골든타임 경과 시 치명적 불이익 주의'}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #FEE2E2',
          borderRadius: '14px',
          padding: '20px',
          gap: '10px',
        }}
      >
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#B91C1C' }}>
          • {payload.subText || '법정 기한 미준수 시 가산세 부과 및 소명 권리 상실'}
        </div>
        <div style={{ fontSize: '16px', color: '#475569', lineHeight: 1.45 }}>
          사안에 따라 대응 시한이 엄격히 정해져 있으므로, 신속하게 전문가와 사실관계를 검토해야 손실을 방어할 수 있습니다.
        </div>
      </div>
    </div>
  )
}

/**
 * 8. 핵심 3줄 결론 요약 카드 (800x480)
 */
function renderSummaryCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  const points = payload.points && payload.points.length >= 3
    ? payload.points
    : [
        '법정 필수 요건 및 기준을 사전 확인하여 리스크 최소화',
        '비급여/경비 적격증빙을 완벽하게 구비하여 소명 대비',
        '전문가 1:1 상담을 통해 세액공제 및 합법적 권리 구제 확보',
      ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '800px',
        height: '480px',
        backgroundColor: '#FEF3C7',
        border: '3px solid #FDE68A',
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#B45309' }}>
        💡 오늘 포스팅 핵심 3줄 요약
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '2px solid #FDE68A',
          borderRadius: '16px',
          padding: '24px 20px',
          gap: '16px',
        }}
      >
        {points.slice(0, 3).map((pt, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '22px', fontWeight: 'bold', color: '#2563EB' }}>
              {idx === 0 ? '1️⃣' : idx === 1 ? '2️⃣' : '3️⃣'}
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#0F172A', lineHeight: 1.45 }}>
              {pt}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * 9. 하단 상담 유도 (CTA) 배너 (800x480)
 */
function renderCtaCard(
  payload: CardPayload,
  palette: any,
  padding: number,
  radius: number,
  borderWidth: number
) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '800px',
        height: '480px',
        backgroundColor: '#FDFBF7',
        border: '3px solid #D4AF37',
        borderRadius: `${radius}px`,
        padding: `${padding}px`,
        boxSizing: 'border-box',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'center' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#B45309', letterSpacing: '2px' }}>
          {payload.category || 'EXPERT CONSULTATION & LOCATION'}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#0F172A' }}>
          {payload.title || '1:1 맞춤 정밀 진단 및 상담 안내'}
        </div>
        <div style={{ fontSize: '17px', color: '#64748B' }}>
          풍부한 실무 경험을 바탕으로 의뢰인의 권익을 최우선으로 보호합니다.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '2px solid #E2E8F0',
          borderRadius: '16px',
          padding: '18px 24px',
          gap: '10px',
          textAlign: 'left',
        }}
      >
        <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#0F172A' }}>
          📞 직통 상담: <span style={{ color: '#2563EB' }}>{payload.extra1 || '(대표 전화번호)'}</span>
        </div>
        <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#0F172A' }}>
          🏢 사무소 위치: <span style={{ color: '#475569', fontWeight: 'normal' }}>{payload.extra2 || '(상세 주소)'}</span>
        </div>
        <div style={{ fontSize: '19px', fontWeight: 'bold', color: '#0F172A' }}>
          📍 네이버 예약: <span style={{ color: '#2563EB', fontWeight: 'normal' }}>{payload.extra3 || '(예약 링크)'}</span>
        </div>
      </div>

      <div style={{ fontSize: '14px', color: '#94A3B8' }}>
        * 사전 예약을 통해 원활한 1:1 맞춤 상담이 가능합니다.
      </div>
    </div>
  )
}
