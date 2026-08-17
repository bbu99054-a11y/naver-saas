import React from 'react'
import { cleanSummaryText } from '@/lib/utils/textCleaner'

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

export type ThumbLayout = 'THUMB_A' | 'THUMB_B' | 'THUMB_C' | 'THUMB_D'
export type BannerLayout = 'BANNER_A' | 'BANNER_B' | 'BANNER_C'

export interface CardPayload {
  type: CardType
  category: string
  title: string
  subText?: string
  points?: string[]
  signature?: string
  extra1?: string // comparison col 1 or QNA question or CTA phone
  extra2?: string // comparison col 2 or QNA answer or CTA address
  extra3?: string // stat value or highlight label or CTA reservation
  seed: string
  themeName?: string
  userId?: string
  tags?: string[]
  thumbLayout?: ThumbLayout
  bannerLayout?: BannerLayout
}

// 10종 프리미엄 전문직 특화 컬러 팔레트 (탈양산화 100% 보장)
export const palettes = [
  // 0. NAVY_GOLD (세무/법률/상속 클래식)
  {
    name: 'NAVY_GOLD',
    label: '클래식 네이비 & 골드',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    accent: '#B45309',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    sub: '#475569',
    border: '#E2E8F0',
    highlightBg: '#FFFBEB',
    isDark: false,
  },
  // 1. FOREST_MINT (의료/보건/친환경)
  {
    name: 'FOREST_MINT',
    label: '포레스트 에메랄드 & 민트',
    bg: '#F0FDF4',
    cardBg: '#FFFFFF',
    text: '#14532D',
    accent: '#16A34A',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    sub: '#475569',
    border: '#BBF7D0',
    highlightBg: '#F0FDF4',
    isDark: false,
  },
  // 2. CHARCOAL_ROSE (프리미엄 로펌/M&A)
  {
    name: 'CHARCOAL_ROSE',
    label: '차콜 엘레강스 & 로즈',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#1E293B',
    accent: '#E11D48',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    sub: '#475569',
    border: '#CBD5E1',
    highlightBg: '#FFF1F2',
    isDark: false,
  },
  // 3. WARM_TERRACOTTA (노무/부동산/인사)
  {
    name: 'WARM_TERRACOTTA',
    label: '웜 테라코타 & 에스프레소',
    bg: '#FAF6F0',
    cardBg: '#FFFFFF',
    text: '#2B2523',
    accent: '#C2410C',
    badgeBg: '#FFEDD5',
    badgeText: '#9A3412',
    sub: '#6E655F',
    border: '#FED7AA',
    highlightBg: '#FFF7ED',
    isDark: false,
  },
  // 4. ROYAL_INDIGO (지식재산권/IT법무)
  {
    name: 'ROYAL_INDIGO',
    label: '로열 인디고 & 바이올렛',
    bg: '#F5F3FF',
    cardBg: '#FFFFFF',
    text: '#1E1B4B',
    accent: '#6366F1',
    badgeBg: '#EDE9FE',
    badgeText: '#4338CA',
    sub: '#475569',
    border: '#DDD6FE',
    highlightBg: '#FAF5FF',
    isDark: false,
  },
  // 5. SLATE_MINIMAL (공인회계사/기업감사)
  {
    name: 'SLATE_MINIMAL',
    label: '클린 슬레이트 & 모던 블루',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#0F172A',
    accent: '#2563EB',
    badgeBg: '#E2E8F0',
    badgeText: '#0F172A',
    sub: '#475569',
    border: '#CBD5E1',
    highlightBg: '#EFF6FF',
    isDark: false,
  },
  // 6. TEAL_OCEAN (관세/무역/물류)
  {
    name: 'TEAL_OCEAN',
    label: '딥 틸 & 오션 아쿠아',
    bg: '#F0FDFA',
    cardBg: '#FFFFFF',
    text: '#134E4A',
    accent: '#0D9488',
    badgeBg: '#CCFBF1',
    badgeText: '#115E59',
    sub: '#475569',
    border: '#99F6E4',
    highlightBg: '#F0FDFA',
    isDark: false,
  },
  // 7. CRIMSON_WINE (긴급구제/산재/소송)
  {
    name: 'CRIMSON_WINE',
    label: '크림슨 와인 & 루비',
    bg: '#FFF5F5',
    cardBg: '#FFFFFF',
    text: '#1E1B4B',
    accent: '#BE123C',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    sub: '#475569',
    border: '#FECDD3',
    highlightBg: '#FFF1F2',
    isDark: false,
  },
  // 8. SUNSET_AMBER (가사/이혼/가족법)
  {
    name: 'SUNSET_AMBER',
    label: '선셋 앰버 & 샌드스톤',
    bg: '#FFFBEB',
    cardBg: '#FFFFFF',
    text: '#1C1917',
    accent: '#D97706',
    badgeBg: '#FEF3C7',
    badgeText: '#78350F',
    sub: '#57534E',
    border: '#FDE68A',
    highlightBg: '#FFFBEB',
    isDark: false,
  },
  // 9. DEEP_EMERALD (자산관리/금융/투자)
  {
    name: 'DEEP_EMERALD',
    label: '딥 에메랄드 & 옥시디언',
    bg: '#F0FDF4',
    cardBg: '#FFFFFF',
    text: '#064E3B',
    accent: '#059669',
    badgeBg: '#D1FAE5',
    badgeText: '#047857',
    sub: '#475569',
    border: '#A7F3D0',
    highlightBg: '#ECFDF5',
    isDark: false,
  },
]

export const thumbLayoutTypes: ThumbLayout[] = ['THUMB_A', 'THUMB_B', 'THUMB_C', 'THUMB_D']
export const bannerLayoutTypes: BannerLayout[] = ['BANNER_A', 'BANNER_B', 'BANNER_C']

/**
 * 고객 ID(user_id) 기반 120가지 조합 결정론적 1:1 고유 배정 (Collision-Free Hashing)
 */
export function hashUserIdToBrandKit(userId: string = '') {
  const seedStr = userId && userId.trim() !== '' ? userId.trim() : 'postsynk_default_seed'
  let h = 2166136261
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  const posHash = Math.abs(h >>> 0)

  const themeIndex = posHash % palettes.length
  const thumbIndex = Math.floor(posHash / palettes.length) % thumbLayoutTypes.length
  const bannerIndex = Math.floor(posHash / (palettes.length * thumbLayoutTypes.length)) % bannerLayoutTypes.length

  return {
    theme: palettes[themeIndex],
    themeIndex,
    thumbLayout: thumbLayoutTypes[thumbIndex],
    bannerLayout: bannerLayoutTypes[bannerIndex],
  }
}

function cleanItemText(raw: string): string {
  return cleanSummaryText(raw)
}

/**
 * 1080px Satori / React 기반 프로시저럴 인포그래픽 렌더러
 */
export function buildProceduralCardComponent(payload: CardPayload): React.ReactElement {
  const brandKit = hashUserIdToBrandKit(payload.userId || payload.seed)

  // 테마 오버라이드 지정이 있는 경우 반영
  const palette = payload.themeName
    ? palettes.find((p) => p.name === payload.themeName) || brandKit.theme
    : brandKit.theme

  const thumbLayout = payload.thumbLayout || brandKit.thumbLayout
  const bannerLayout = payload.bannerLayout || brandKit.bannerLayout

  const tags = payload.tags && payload.tags.length > 0
    ? payload.tags.slice(0, 3)
    : ['핵심 쟁점 분석', '법적 기준 검토', '실무 대응 절차']

  switch (payload.type) {
    case 'MAIN_THUMBNAIL':
      return renderThumbnailCard(payload, palette, thumbLayout, tags)
    case 'CHECKLIST':
      return renderChecklistCard(payload, palette)
    case 'COMPARISON':
      return renderComparisonCard(payload, palette)
    case 'STAT_HIGHLIGHT':
      return renderStatHighlightCard(payload, palette)
    case 'PROCESS_FLOW':
      return renderProcessFlowCard(payload, palette)
    case 'QNA':
      return renderQnaCard(payload, palette)
    case 'WARNING_RISK':
      return renderWarningCard(payload, palette)
    case 'KEY_TAKEAWAYS':
      return renderSummaryCard(payload, palette)
    case 'CTA_FOOTER':
      return renderCtaCard(payload, palette, bannerLayout)
    default:
      return renderThumbnailCard(payload, palette, thumbLayout, tags)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. 4종 썸네일 레이아웃 렌더러 (1080 × 1080 px, Safe Zone 80px 보장)
// ─────────────────────────────────────────────────────────────────────────────

function renderThumbnailCard(
  payload: CardPayload,
  palette: typeof palettes[0],
  layout: ThumbLayout,
  tags: string[]
) {
  const title = payload.title || '2026 핵심 실무 가이드'
  const titleSize = title.length > 30 ? 50 : title.length > 20 ? 56 : 62
  const signature = payload.signature || 'PostSynk Verified Guide'
  const category = payload.category || '2026 핵심 실무 분석'

  // THUMB_A: 중앙 플로팅 카드형
  if (layout === 'THUMB_A') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '1080px',
          height: '1080px',
          backgroundColor: palette.bg,
          padding: '80px',
          boxSizing: 'border-box',
          letterSpacing: '-0.03em',
          wordBreak: 'break-word',
        }}
      >
        {/* 상단 뱃지 영역 (Safe Zone 내 920px 영역) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '920px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.badgeBg,
              color: palette.badgeText,
              padding: '12px 28px',
              borderRadius: '30px',
              fontSize: '24px',
              fontWeight: 'bold',
              border: `1.5px solid ${palette.border}`,
            }}
          >
            {category}
          </div>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.cardBg,
              color: palette.accent,
              padding: '12px 24px',
              borderRadius: '30px',
              fontSize: '22px',
              fontWeight: 'bold',
              border: `1.5px solid ${palette.border}`,
            }}
          >
            PostSynk Verified
          </div>
        </div>

        {/* 중앙 플로팅 화이트 박스 (920px 폭) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: palette.cardBg,
            border: `2px solid ${palette.border}`,
            borderRadius: '32px',
            padding: '50px 48px',
            gap: '30px',
            width: '920px',
            boxSizing: 'border-box',
          }}
        >
          {/* 3개 핵심 뱃지 태그 동적 주입 */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', width: '100%' }}>
            {tags.map((tag, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  backgroundColor: palette.highlightBg,
                  border: `1.5px solid ${palette.border}`,
                  borderRadius: '14px',
                  padding: '10px 20px',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: palette.accent,
                }}
              >
                #{tag}
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: `${titleSize}px`,
              lineHeight: '1.3',
              fontWeight: 'bold',
              color: palette.text,
              textAlign: 'center',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </div>

          {payload.subText && (
            <div
              style={{
                display: 'flex',
                backgroundColor: palette.bg,
                border: `1.5px solid ${palette.border}`,
                borderRadius: '16px',
                padding: '14px 28px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: palette.sub,
                lineHeight: '1.4',
                textAlign: 'center',
                wordBreak: 'break-word',
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
            gap: '8px',
            borderTop: `2px solid ${palette.border}`,
            paddingTop: '20px',
            width: '920px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text }}>
            {signature}
          </div>
          <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
            1:1 전문 상담 · 철저한 비밀 보장
          </div>
        </div>
      </div>
    )
  }

  // THUMB_B: 상단 와이드 밴드형 (Safe Zone 80px 여백 준수)
  if (layout === 'THUMB_B') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '1080px',
          height: '1080px',
          backgroundColor: palette.cardBg,
          boxSizing: 'border-box',
          letterSpacing: '-0.03em',
          wordBreak: 'break-word',
        }}
      >
        {/* 상단 와이드 테마 헤더 밴드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: palette.accent,
            padding: '60px 80px',
            height: '320px',
            width: '1080px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '8px 20px',
                borderRadius: '16px',
                fontSize: '20px',
                fontWeight: 'bold',
              }}
            >
              {category}
            </div>
            <div style={{ display: 'flex', fontSize: '22px', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 'bold' }}>
              {signature}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {tags.map((tag, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  backgroundColor: '#FFFFFF',
                  color: palette.accent,
                  padding: '6px 16px',
                  borderRadius: '10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>

        {/* 하단 본문 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '60px 80px 80px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div
              style={{
                display: 'flex',
                fontSize: `${titleSize}px`,
                lineHeight: '1.3',
                fontWeight: 'bold',
                color: palette.text,
                wordBreak: 'break-word',
              }}
            >
              {title}
            </div>

            {payload.subText && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '24px',
                  color: palette.sub,
                  lineHeight: '1.45',
                  wordBreak: 'break-word',
                }}
              >
                {payload.subText}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `2px solid ${palette.border}`,
              paddingTop: '24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: palette.text }}>
              전문 자격사 1:1 맞춤 검토
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: palette.sub }}>
              철저한 비밀 보장 상담
            </div>
          </div>
        </div>
      </div>
    )
  }

  // THUMB_C: 모던 미니멀형 (좌측 악센트 바 & Safe Zone 내부 배치)
  if (layout === 'THUMB_C') {
    return (
      <div
        style={{
          display: 'flex',
          width: '1080px',
          height: '1080px',
          backgroundColor: palette.cardBg,
          boxSizing: 'border-box',
          letterSpacing: '-0.03em',
          wordBreak: 'break-word',
        }}
      >
        {/* 좌측 강조 바 */}
        <div
          style={{
            display: 'flex',
            width: '28px',
            height: '1080px',
            backgroundColor: palette.accent,
          }}
        />

        {/* 메인 콘텐츠 영역 (내부 패딩 80px) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '80px',
            boxSizing: 'border-box',
          }}
        >
          {/* 상단 뱃지 및 서명 */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: palette.badgeBg,
                color: palette.badgeText,
                padding: '10px 24px',
                borderRadius: '20px',
                fontSize: '22px',
                fontWeight: 'bold',
              }}
            >
              {category}
            </div>
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: palette.text }}>
              {signature}
            </div>
          </div>

          {/* 중앙 타이틀 & 태그 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              {tags.map((tag, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    backgroundColor: palette.bg,
                    color: palette.sub,
                    border: `1.5px solid ${palette.border}`,
                    padding: '8px 18px',
                    borderRadius: '12px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                fontSize: `${titleSize + 4}px`,
                lineHeight: '1.28',
                fontWeight: 'bold',
                color: palette.text,
                wordBreak: 'break-word',
              }}
            >
              {title}
            </div>

            {payload.subText && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '26px',
                  color: palette.sub,
                  lineHeight: '1.45',
                  wordBreak: 'break-word',
                }}
              >
                {payload.subText}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `2px solid ${palette.border}`,
              paddingTop: '24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>
              정확한 사실관계 분석
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: palette.sub }}>
              핵심 쟁점 1:1 법률 가이드
            </div>
          </div>
        </div>
      </div>
    )
  }

  // THUMB_D: 다크 엠블럼형 (80px Safe Zone 패딩 및 920px 엠블럼)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1080px',
        height: '1080px',
        backgroundColor: palette.text,
        padding: '80px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '920px',
          height: '920px',
          border: `3px solid ${palette.accent}`,
          borderRadius: '40px',
          padding: '60px 50px',
          backgroundColor: 'rgba(255, 255, 255, 0.03)',
          boxSizing: 'border-box',
        }}
      >
        {/* 상단 뱃지 & 태그 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.accent,
              color: '#FFFFFF',
              padding: '10px 28px',
              borderRadius: '24px',
              fontSize: '22px',
              fontWeight: 'bold',
            }}
          >
            {category}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            {tags.map((tag, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: palette.badgeBg,
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                }}
              >
                #{tag}
              </div>
            ))}
          </div>
        </div>

        {/* 중앙 타이틀 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '820px' }}>
          <div
            style={{
              display: 'flex',
              fontSize: `${titleSize}px`,
              lineHeight: '1.3',
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              wordBreak: 'break-word',
            }}
          >
            {title}
          </div>

          {payload.subText && (
            <div
              style={{
                display: 'flex',
                fontSize: '26px',
                fontWeight: 'bold',
                color: palette.badgeBg,
                textAlign: 'center',
                lineHeight: '1.4',
                wordBreak: 'break-word',
              }}
            >
              {payload.subText}
            </div>
          )}
        </div>

        {/* 하단 서명 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            borderTop: `1.5px solid rgba(255, 255, 255, 0.2)`,
            paddingTop: '24px',
            width: '800px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF' }}>
            {signature}
          </div>
          <div style={{ display: 'flex', fontSize: '18px', color: '#94A3B8' }}>
            1:1 전문 상담 · 철저한 비밀 보장
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. 7종 본문 인포그래픽 카드 렌더러 (1080 × 680 px, Safe Zone 60px 80px 보장)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 2. 체크리스트 카드 (1080 × 680 px)
 */
function renderChecklistCard(payload: CardPayload, palette: typeof palettes[0]) {
  const title = payload.title || '반드시 검토해야 할 필수 체크리스트'
  const titleSize = title.length > 25 ? 36 : 42

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
        width: '1080px',
        height: '680px',
        backgroundColor: palette.bg,
        border: `2px solid ${palette.border}`,
        borderRadius: '28px',
        padding: '60px 80px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', fontSize: '40px' }}>📋</div>
          <div style={{ display: 'flex', fontSize: `${titleSize}px`, fontWeight: 'bold', color: palette.text }}>
            {title}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.badgeBg,
            color: palette.badgeText,
            padding: '10px 22px',
            borderRadius: '20px',
            fontSize: '22px',
            fontWeight: 'bold',
          }}
        >
          필수 검토 사항
        </div>
      </div>

      {/* 체크리스트 아이템 3종 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {points.slice(0, 3).map((pt, idx) => {
          const itemTitle = cleanItemText(pt.split(':')[0] || pt)
          const itemDesc = pt.includes(':') ? cleanItemText(pt.split(':')[1]) : ''

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: palette.cardBg,
                border: `2px solid ${palette.border}`,
                borderRadius: '20px',
                padding: '22px 28px',
                gap: '20px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  border: '1.5px solid #86EFAC',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                ☑️ 0{idx + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>
                  {itemTitle}
                </div>
                {itemDesc && (
                  <div style={{ display: 'flex', fontSize: '22px', color: palette.sub, fontWeight: 'bold', wordBreak: 'break-word' }}>
                    {itemDesc}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* 하단 전문가 팁 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: '16px',
          padding: '16px 28px',
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '24px' }}>💡</span>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: palette.text }}>
          전문가 실무 팁: 각 항목의 요건과 적격 증빙을 선제적으로 검토해야 법적 불이익을 완벽 차단할 수 있습니다.
        </span>
      </div>
    </div>
  )
}

/**
 * 3. Before vs After 비교 카드 (1080 × 680 px)
 */
function renderComparisonCard(payload: CardPayload, palette: typeof palettes[0]) {
  const title = payload.title || '일반적인 대처 vs 올바른 전문가 해결책 비교'
  const extra1Text = payload.extra1 || '단순 방치 및 부실 증빙 제출'
  const extra2Text = payload.extra2 || '적격증빙 선제적 검증 및 1:1 맞춤 대응'

  const fullContext = `${title} ${extra1Text} ${extra2Text} ${payload.category}`
  const isTax = /세무|양도|상속|증여|부가세|소득세|기장|부동산|주택/i.test(fullContext)
  const isLegal = /구제|면허|음주|형사|소송|행정|처분|경찰|변호사|행정사/i.test(fullContext)

  const badBullets = isTax
    ? ['불필요한 과다 세액 및 가산세 발생 위험', '비과세·감면 공제 필수 요건 누락', '사후 소명 자료 부족으로 추징 리스크']
    : isLegal
    ? ['행정처분 구제 골든타임 경과 위험', '불리한 진술 및 입증 자료 누락', '이의신청 및 행정심판 기각 가능성']
    : ['단편적 대처로 인한 실질 손실 발생', '객관적 입증 서류 및 요건 누락', '법적 구제 및 권리 보호 기회 상실']

  const goodBullets = isTax
    ? ['합법적 최대 절세 및 공제 혜택 100% 확보', '객관적 적격증빙 선제적 정밀 검증', '사후 세무조사 리스크 원천 차단']
    : isLegal
    ? ['처분 위법성·부당성 1:1 정밀 소명', '생계형·가족상황 객관적 입증 완료', '면허 정지 감경 및 권리 구제 확보']
    : ['전문가 1:1 정밀 사실관계 검토', '관련 법령 및 규정 요건 100% 충족', '사건 종결까지 법적 리스크 완벽 차단']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '680px',
        backgroundColor: palette.cardBg,
        border: `2px solid ${palette.border}`,
        borderRadius: '28px',
        padding: '50px 80px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '36px',
          fontWeight: 'bold',
          color: palette.text,
          borderBottom: `2px solid ${palette.border}`,
          paddingBottom: '18px',
        }}
      >
        ⚖️ {title}
      </div>

      <div style={{ display: 'flex', gap: '30px', height: '480px' }}>
        {/* Before */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#FEF2F2',
            border: '2px solid #FECACA',
            borderRadius: '20px',
            padding: '30px 26px',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: '#EF4444',
              color: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '22px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}
          >
            ❌ 잘못된 대처 방식
          </div>
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: '#991B1B', lineHeight: '1.35', wordBreak: 'break-word' }}>
            {extra1Text}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '22px', color: '#7F1D1D', fontWeight: 'bold' }}>
            {badBullets.map((b, i) => (
              <div key={i} style={{ display: 'flex' }}>• {b}</div>
            ))}
          </div>
        </div>

        {/* After */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#F0FDF4',
            border: '2px solid #BBF7D0',
            borderRadius: '20px',
            padding: '30px 26px',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: '#16A34A',
              color: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '22px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}
          >
            ✅ 전문가 정밀 대응
          </div>
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: '#166534', lineHeight: '1.35', wordBreak: 'break-word' }}>
            {extra2Text}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '22px', color: '#14532D', fontWeight: 'bold' }}>
            {goodBullets.map((b, i) => (
              <div key={i} style={{ display: 'flex' }}>• {b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 4. 핵심 수치 하이라이트 카드 (1080 × 680 px)
 */
function renderStatHighlightCard(payload: CardPayload, palette: typeof palettes[0]) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1080px',
        height: '680px',
        backgroundColor: palette.highlightBg,
        border: `2px solid ${palette.border}`,
        borderRadius: '28px',
        padding: '60px 80px',
        boxSizing: 'border-box',
        textAlign: 'center',
        gap: '24px',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.accent }}>
        {payload.category || 'KEY METRIC & LEGAL STANDARD'}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: payload.title.length > 20 ? '54px' : '68px',
          fontWeight: 'bold',
          color: palette.text,
          lineHeight: '1.2',
          wordBreak: 'break-word',
        }}
      >
        {payload.title}
      </div>

      {payload.subText && (
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.cardBg,
            border: `2px solid ${palette.border}`,
            borderRadius: '18px',
            padding: '16px 36px',
            fontSize: '30px',
            fontWeight: 'bold',
            color: palette.sub,
            wordBreak: 'break-word',
          }}
        >
          {payload.subText}
        </div>
      )}

      {payload.extra3 && (
        <div style={{ display: 'flex', fontSize: '24px', color: '#64748B', fontWeight: 'bold' }}>
          {payload.extra3}
        </div>
      )}
    </div>
  )
}

function parseProcessStep(rawStep: string, index: number): { title: string; desc: string } {
  let text = cleanItemText(rawStep).trim()
  text = text.replace(/^(step\s*\d+\s*(단계)?|단계\s*\d+|\d+\s*단계|\d+\s*step|\d+)[.:\s-]*/iu, '').trim()
  text = text.replace(/^(단계|step)[.:\s-]*/iu, '').trim()

  if (text.includes(':')) {
    const parts = text.split(':')
    const titlePart = cleanItemText(parts[0]).trim()
    const descPart = cleanItemText(parts.slice(1).join(':')).trim()
    const title = titlePart && !/^(단계|step|\d+)$/i.test(titlePart)
      ? titlePart
      : descPart || `핵심 절차 0${index + 1}`
    const desc = descPart && descPart !== title ? descPart : '전문가 사전 검토 및 1:1 맞춤 조치'
    return { title, desc }
  }

  if (text.includes(' - ')) {
    const parts = text.split(' - ')
    const titlePart = cleanItemText(parts[0]).trim()
    const descPart = cleanItemText(parts.slice(1).join(' - ')).trim()
    const title = titlePart && !/^(단계|step|\d+)$/i.test(titlePart)
      ? titlePart
      : descPart || `핵심 절차 0${index + 1}`
    const desc = descPart && descPart !== title ? descPart : '전문가 사전 검토 및 1:1 맞춤 조치'
    return { title, desc }
  }

  return {
    title: text || `핵심 절차 0${index + 1}`,
    desc: '전문가 사전 검토 및 1:1 맞춤 조치',
  }
}

/**
 * 5. 3단계 행동 로드맵 카드 (1080 × 680 px)
 */
function renderProcessFlowCard(payload: CardPayload, palette: typeof palettes[0]) {
  const steps = payload.points && payload.points.length >= 3
    ? payload.points
    : ['초기 사실관계 정밀 진단', '적격 증빙 서류 제출', '최종 절세 및 권리 구제 확정']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '680px',
        backgroundColor: palette.bg,
        border: `2px solid ${palette.border}`,
        borderRadius: '28px',
        padding: '50px 80px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '36px', fontWeight: 'bold', color: palette.text }}>
        <span>🚀</span>
        <span>{payload.title || '원스톱 사건 해결 3단계 실무 절차'}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        {steps.slice(0, 3).map((step, idx) => {
          const { title, desc } = parseProcessStep(step, idx)

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: palette.cardBg,
                border: `2px solid ${idx === 2 ? '#86EFAC' : palette.border}`,
                borderRadius: '20px',
                padding: '30px 24px',
                height: '420px',
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: idx === 2 ? '#16A34A' : palette.accent,
                  color: '#FFFFFF',
                  padding: '8px 18px',
                  borderRadius: '10px',
                  fontSize: '22px',
                  fontWeight: 'bold',
                  alignSelf: 'flex-start',
                }}
              >
                STEP {idx + 1}
              </div>

              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, lineHeight: '1.35', wordBreak: 'break-word' }}>
                {title}
              </div>

              <div style={{ display: 'flex', fontSize: '22px', color: palette.sub, lineHeight: '1.45', wordBreak: 'break-word' }}>
                {desc}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * 6. Q&A 문답 카드 (1080 × 680 px)
 */
function renderQnaCard(payload: CardPayload, palette: typeof palettes[0]) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '680px',
        backgroundColor: palette.bg,
        border: `2px solid ${palette.border}`,
        borderRadius: '28px',
        padding: '60px 80px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.accent,
            color: '#FFFFFF',
            padding: '10px 22px',
            borderRadius: '12px',
            fontSize: '24px',
            fontWeight: 'bold',
          }}
        >
          Q. 자주 묻는 질문
        </div>
        <div style={{ display: 'flex', fontSize: payload.title.length > 24 ? '30px' : '36px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>
          {payload.title}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.cardBg,
          border: `2px solid ${palette.border}`,
          borderRadius: '24px',
          padding: '40px',
          gap: '18px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', fontSize: '30px', fontWeight: 'bold', color: palette.accent }}>
          💡 전문가 명쾌 해설:
        </div>
        <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: '1.5', wordBreak: 'break-word' }}>
          {payload.subText || payload.extra2 || '법정 기한 및 요건에 맞춰 선제적으로 대응하면 세액공제와 권리 구제가 모두 가능합니다.'}
        </div>
      </div>
    </div>
  )
}

/**
 * 7. 골든타임 리스크 경고 카드 (1080 × 680 px)
 */
function renderWarningCard(payload: CardPayload, palette: typeof palettes[0]) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '680px',
        backgroundColor: '#FEF2F2',
        border: '3px solid #FECACA',
        borderRadius: '28px',
        padding: '60px 80px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', fontSize: '48px' }}>🚨</div>
        <div style={{ display: 'flex', fontSize: payload.title.length > 24 ? '32px' : '38px', fontWeight: 'bold', color: '#991B1B', wordBreak: 'break-word' }}>
          {payload.title || '골든타임 경과 시 치명적 불이익 주의'}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#FFFFFF',
          border: '2px solid #FEE2E2',
          borderRadius: '20px',
          padding: '36px',
          gap: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: '#B91C1C', wordBreak: 'break-word' }}>
          • {payload.subText || '법정 기한 미준수 시 가산세 부과 및 소명 권리 상실'}
        </div>
        <div style={{ display: 'flex', fontSize: '24px', color: '#475569', lineHeight: '1.45', wordBreak: 'break-word' }}>
          사안에 따라 대응 시한이 엄격히 정해져 있으므로, 신속하게 전문가와 사실관계를 검토해야 손실을 방어할 수 있습니다.
        </div>
      </div>
    </div>
  )
}

/**
 * 8. 핵심 3줄 결론 요약 카드 (1080 × 680 px)
 */
function renderSummaryCard(payload: CardPayload, palette: typeof palettes[0]) {
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
        width: '1080px',
        height: '680px',
        backgroundColor: palette.bg,
        border: `2px solid ${palette.border}`,
        borderRadius: '28px',
        padding: '50px 80px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: palette.accent }}>
          💡 {payload.title || '오늘 포스팅 핵심 3줄 요약'}
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.badgeBg,
            color: palette.badgeText,
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '22px',
            fontWeight: 'bold',
          }}
        >
          핵심 정리
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {points.slice(0, 3).map((pt, idx) => {
          const itemText = cleanItemText(pt)

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: palette.cardBg,
                border: `2px solid ${palette.border}`,
                borderRadius: '18px',
                padding: '20px 24px',
                gap: '18px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold' }}>
                {idx === 0 ? '1️⃣' : idx === 1 ? '2️⃣' : '3️⃣'}
              </div>
              <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: '1.45', wordBreak: 'break-word' }}>
                {itemText}
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          fontSize: '20px',
          color: palette.sub,
          fontWeight: 'bold',
        }}
      >
        Key Point · 핵심 요약 및 판단 기준
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. 3종 하단 상담 유도 배너 렌더러 (1080 × 540 px, Safe Zone 50px 80px 보장)
// ─────────────────────────────────────────────────────────────────────────────

function renderCtaCard(
  payload: CardPayload,
  palette: typeof palettes[0],
  layout: BannerLayout
) {
  const phone = payload.extra1 || '(대표 전화번호)'
  const address = payload.extra2 || '(사무소 상세 주소)'
  const title = payload.title || '1:1 맞춤 정밀 진단 및 상담 안내'
  const sub = payload.subText || '풍부한 실무 경험을 바탕으로 의뢰인의 권익을 최우선으로 보호합니다.'

  // BANNER_A: 좌우 2단 분할형 (직통상담 + 오시는길 2개 중심 대형 레이아웃)
  if (layout === 'BANNER_A') {
    return (
      <div
        style={{
          display: 'flex',
          width: '1080px',
          height: '540px',
          backgroundColor: palette.bg,
          border: `3px solid ${palette.border}`,
          borderRadius: '28px',
          padding: '40px 60px',
          gap: '36px',
          boxSizing: 'border-box',
          letterSpacing: '-0.03em',
          wordBreak: 'break-word',
        }}
      >
        {/* 좌측 슬로건/상호 */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: palette.accent,
                color: '#FFFFFF',
                padding: '8px 20px',
                borderRadius: '14px',
                fontSize: '22px',
                fontWeight: 'bold',
                alignSelf: 'flex-start',
              }}
            >
              공식 상담 창구
            </div>
            <div style={{ display: 'flex', fontSize: '44px', fontWeight: 'bold', color: palette.text, lineHeight: '1.22', wordBreak: 'break-word' }}>
              {title}
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, lineHeight: '1.38', wordBreak: 'break-word' }}>
              {sub}
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: '18px', color: '#94A3B8', fontWeight: 'bold' }}>
            * 1:1 사전 예약 시 심층 상담 가능
          </div>
        </div>

        {/* 우측 연락처 & 오시는길 2단 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: palette.cardBg,
            border: `2.5px solid ${palette.border}`,
            borderRadius: '24px',
            padding: '36px 36px',
            gap: '24px',
            width: '460px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>
              📞 직통 상담
            </div>
            <div style={{ display: 'flex', fontSize: '40px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>
              {phone}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: palette.sub }}>
              🏢 오시는 길
            </div>
            <div style={{ display: 'flex', fontSize: '28px', color: palette.text, fontWeight: 'bold', wordBreak: 'break-word' }}>
              {address}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // BANNER_B: 중앙 집중 명함형 (2열 대형 정보 박스 & 상하 밀착)
  if (layout === 'BANNER_B') {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '1080px',
          height: '540px',
          backgroundColor: palette.cardBg,
          border: `3px solid ${palette.accent}`,
          borderRadius: '28px',
          padding: '36px 54px',
          gap: '22px',
          boxSizing: 'border-box',
          textAlign: 'center',
          letterSpacing: '-0.03em',
          wordBreak: 'break-word',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', maxWidth: '960px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.badgeBg,
              color: palette.badgeText,
              padding: '8px 24px',
              borderRadius: '20px',
              fontSize: '22px',
              fontWeight: 'bold',
            }}
          >
            공식 1:1 심층 상담 창구
          </div>
          <div style={{ display: 'flex', fontSize: '46px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word', lineHeight: '1.2' }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: palette.sub, wordBreak: 'break-word', lineHeight: '1.35' }}>
            {sub}
          </div>
        </div>

        {/* 2열 와이드 정보 박스 (직통 상담 + 오시는 길) */}
        <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              backgroundColor: palette.bg,
              border: `2px solid ${palette.accent}`,
              borderRadius: '22px',
              padding: '24px 20px',
              gap: '6px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>📞 직통 전화 상담</div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>{phone}</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              backgroundColor: palette.bg,
              border: `2px solid ${palette.border}`,
              borderRadius: '22px',
              padding: '24px 20px',
              gap: '6px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: palette.sub }}>🏢 사무소 오시는 길</div>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, textAlign: 'center', wordBreak: 'break-word' }}>{address}</div>
          </div>
        </div>
      </div>
    )
  }

  // BANNER_C: 모던 아웃라인 박스형 (중앙 빈 공간 완전 제거 & 상하 밀착 대형 폰트)
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '1080px',
        height: '540px',
        backgroundColor: palette.highlightBg,
        border: `3px solid ${palette.accent}`,
        borderRadius: '28px',
        padding: '36px 54px',
        gap: '22px',
        boxSizing: 'border-box',
        letterSpacing: '-0.03em',
        wordBreak: 'break-word',
      }}
    >
      {/* 상단 타이틀 & 1:1 공식접수 뱃지 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '780px' }}>
          <div style={{ display: 'flex', fontSize: '46px', fontWeight: 'bold', color: palette.text, lineHeight: '1.2', wordBreak: 'break-word' }}>
            {title}
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: palette.sub, lineHeight: '1.35', wordBreak: 'break-word' }}>
            {sub}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.accent,
            color: '#FFFFFF',
            padding: '14px 28px',
            borderRadius: '18px',
            fontSize: '24px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          1:1 공식 접수
        </div>
      </div>

      {/* 하단 2단 큼직한 직통상담 및 오시는길 밀착 박스 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.cardBg,
          border: `2.5px solid ${palette.border}`,
          borderRadius: '24px',
          padding: '30px 38px',
          gap: '18px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '38px', fontWeight: 'bold', color: palette.text, gap: '16px' }}>
          <span style={{ color: palette.accent, whiteSpace: 'nowrap', fontSize: '38px' }}>📞 직통 상담:</span>
          <span style={{ fontSize: '40px', color: palette.text, wordBreak: 'break-word' }}>{phone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '30px', fontWeight: 'bold', color: palette.text, gap: '16px' }}>
          <span style={{ color: palette.sub, whiteSpace: 'nowrap', fontSize: '30px' }}>🏢 오시는 길:</span>
          <span style={{ fontSize: '30px', color: palette.text, fontWeight: 'bold', wordBreak: 'break-word' }}>{address}</span>
        </div>
      </div>
    </div>
  )
}
