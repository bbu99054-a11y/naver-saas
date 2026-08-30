import React from 'react'
import { cleanSummaryText } from '@/lib/utils/textCleaner'

// ─────────────────────────────────────────────────────────────────────────────
// 1. 타입 정의 (TypeScript Interfaces)
// ─────────────────────────────────────────────────────────────────────────────

export type CardType =
  | 'MAIN_THUMBNAIL'
  | 'CTA_FOOTER'
  // [2026 최종 엄선] 전문직 블로그 본문 10종 벤토 그리드 카드
  | 'RED_FLAGS'
  | 'SELF_DIAGNOSIS'
  | 'VS_SIMULATION'
  | 'COST_OF_INACTION'
  | 'ACTION_TIMELINE'
  | 'REQUIRED_DOSSIER'
  | 'CRITERIA_TABLE'
  | 'SUCCESS_RECEIPT'
  | 'EXPERT_OPINION'
  | 'FINAL_VERDICT'
  // 레거시 타입 별칭 호환
  | 'CHECKLIST'
  | 'COMPARISON'
  | 'STAT_HIGHLIGHT'
  | 'PROCESS_FLOW'
  | 'QNA'
  | 'WARNING_RISK'
  | 'KEY_TAKEAWAYS'

export type ThumbLayout = 'THUMB_A' | 'THUMB_B' | 'THUMB_C' | 'THUMB_D'
export type BannerLayout = 'BANNER_A' | 'BANNER_B' | 'BANNER_C'

export interface InfographicSlot {
  title: string
  description?: string
  badge?: string
  extra?: string
}

export interface InfographicData {
  type: CardType
  title: string
  category?: string
  subtitle?: string
  subText?: string // subtitle 별칭 호환
  signature?: string
  slots?: InfographicSlot[]
  points?: string[]
  extra1?: string // Comparison Left / QNA Question / CTA Phone / Before Text
  extra2?: string // Comparison Right / QNA Answer / CTA Address / After Text
  extra3?: string // Stat Value / Highlight Label / CTA Reservation / D-Day
  seed?: string
  userId?: string
  themeName?: string
  tags?: string[]
  thumbLayout?: ThumbLayout
  bannerLayout?: BannerLayout
}

export type CardPayload = InfographicData

export interface Palette {
  name: string
  label: string
  bg: string
  cardBg: string
  text: string
  accent: string
  badgeBg: string
  badgeText: string
  sub: string
  border: string
  highlightBg: string
  isDark: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. 10종 전문직 프리미엄 테마 팔레트 (유저 고유성 보장)
// ─────────────────────────────────────────────────────────────────────────────

export const palettes: Palette[] = [
  // 0. NAVY_GOLD (세무/법률/상속 클래식)
  {
    name: 'NAVY_GOLD',
    label: '클래식 네이비 & 골드',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    text: '#1E293B',
    accent: '#B45309',
    badgeBg: '#FEF3C7',
    badgeText: '#92400E',
    sub: '#64748B',
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
    text: '#134E4A',
    accent: '#0D9488',
    badgeBg: '#DCFCE7',
    badgeText: '#115E59',
    sub: '#64748B',
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
    text: '#2D3748',
    accent: '#BE123C',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    sub: '#64748B',
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
    text: '#3D2E2B',
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
    text: '#2E2B5F',
    accent: '#6366F1',
    badgeBg: '#EDE9FE',
    badgeText: '#4338CA',
    sub: '#64748B',
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
    text: '#1E293B',
    accent: '#2563EB',
    badgeBg: '#E2E8F0',
    badgeText: '#1E293B',
    sub: '#64748B',
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
    sub: '#64748B',
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
    text: '#4A1521',
    accent: '#9F1239',
    badgeBg: '#FFE4E6',
    badgeText: '#9F1239',
    sub: '#64748B',
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
 * 고객 ID(userId) 기반 120가지 조합 결정론적 1:1 고유 배정 (Collision-Free Hashing)
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

// ─────────────────────────────────────────────────────────────────────────────
// 3. 🎨 디자인 중앙 통제실 (CARD_CONFIG) - 1080×1080 1:1 벤토 그리드 표준
// ─────────────────────────────────────────────────────────────────────────────

export const CARD_CONFIG = {
  base: {
    canvas: {
      width: 1080,
      height: 1080,
    },
    safeZone: {
      paddingDefault: '48px 52px',
      paddingCompact: '42px 48px',
      paddingBanner: '44px 50px',
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif",
      letterSpacing: '-0.03em',
      lineHeightTitle: '1.28',
      lineHeightBody: '1.45',
      lineHeightRelaxed: '1.5',
    },
    borderRadius: {
      canvas: '32px',
      tileHero: '24px',
      tileCard: '20px',
      tileInner: '16px',
      badge: '14px',
      pill: '28px',
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. 헬퍼 유틸리티 (Helpers & Decorative Assets)
// ─────────────────────────────────────────────────────────────────────────────

export function sanitizeText(text: string): string {
  if (!text) return ''
  return text
    .replace(/100%\s*(승소|보장|책임|환불|완벽|해결)/g, '정밀 검토 및 체계적 대응')
    .replace(/100%\s*(확보|충족|인정)/g, '체계적·정밀 소명')
    .replace(/승소\s*100%|승소율\s*100%/g, '철저한 법리 검토를 통한 권리 구제')
    .replace(/완벽\s*차단|원천\s*차단/g, '선제적 방어')
    .replace(/무조건/g, '체계적인 요건 검토를 통해')
}

function cleanItemText(raw: string): string {
  return sanitizeText(cleanSummaryText(raw))
}

/**
 * 붉은색 전문가 공식 직인(도장) 인라인 그래픽 (Satori 0.001초 자체 렌더링)
 */
function OfficialStamp({ text = '공인검토필', sub = '2026 POSTSYNK', size = 150 }: { text?: string; sub?: string; size?: number }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        border: '3.5px solid #BE123C',
        color: '#BE123C',
        transform: 'rotate(-10deg)',
        backgroundColor: 'rgba(254, 226, 226, 0.35)',
        boxSizing: 'border-box',
        padding: '8px',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', fontSize: '11px', fontWeight: 'bold', letterSpacing: '0.05em' }}>
        ★ VERIFIED ★
      </div>
      <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold', letterSpacing: '0.08em', margin: '3px 0' }}>
        {text}
      </div>
      <div style={{ display: 'flex', fontSize: '11px', fontWeight: 'bold', borderTop: '1px solid #BE123C', paddingTop: '3px' }}>
        {sub}
      </div>
    </div>
  )
}
// ─────────────────────────────────────────────────────────────────────────────
// 5. 🧱 벤토 그리드 코어 컴포넌트 (Bento Grid Modular Layouts)
// ─────────────────────────────────────────────────────────────────────────────

interface BentoContainerProps {
  palette: Palette
  children: React.ReactNode
  bgOverride?: string
}

function BentoContainer({ palette, children, bgOverride }: BentoContainerProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '1080px',
        backgroundColor: bgOverride || palette.bg,
        border: `1.5px solid ${palette.border}`,
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingDefault,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      {children}
    </div>
  )
}

interface BentoHeaderProps {
  palette: Palette
  icon: string
  title: string
  badgeText: string
  category?: string
}

function BentoHeader({ palette, icon, title, badgeText, category }: BentoHeaderProps) {
  const titleSize = title.length > 25 ? 40 : 46
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2px solid ${palette.border}`,
        paddingBottom: '20px',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '720px' }}>
        <div style={{ display: 'flex', fontSize: '48px' }}>{icon}</div>
        <div style={{ display: 'flex', fontSize: `${titleSize}px`, fontWeight: 'bold', color: palette.text, lineHeight: '1.25' }}>
          {title}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          backgroundColor: palette.badgeBg,
          color: palette.badgeText,
          padding: '10px 24px',
          borderRadius: CARD_CONFIG.base.borderRadius.badge,
          fontSize: '24px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}
      >
        {category || badgeText}
      </div>
    </div>
  )
}

export interface TemplateProps {
  data: InfographicData
  palette: Palette
}

// ─────────────────────────────────────────────────────────────────────────────
// [최종 엄선 Top 10] 전문직 본문 3×3 정통 벤토 그리드(Bento Grid) 템플릿 컴포넌트 (1.5x 대형 폰트 & 톤업 럭셔리)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. 🚨 3대 레드플래그 경고 (Red Flags & Fatal Mistakes)
 * 레이아웃: [상단 3×1.2 매트 로즈 배너] ➔ [하단 3개 1×1.8 화이트 실수 컬럼 (01, 02, 03)]
 */
export function RedFlagsTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '절대 혼자 진행하면 안 되는 3대 레드플래그')
  const points = data.points && data.points.length > 0
    ? data.points
    : [
        '01. 사실관계 불일치 진술 및 부실 소명서 제출',
        '02. 법정 불복 기한(골든타임) 도과 및 소명 실기',
        '03. 유리한 핵심 증빙 누락으로 인한 가산세 폭탄',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="🚨" title={title} badgeText="CRITICAL WARNING" category={data.category} />

      {/* 상단 3x1.2 톤업 로즈 크림슨 배너 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#7A2838',
          border: '2.5px solid #9F1239',
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '24px 32px',
          color: '#FFFFFF',
          boxSizing: 'border-box',
          height: '190px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', fontSize: '24px', color: '#FDA4AF', fontWeight: 'bold' }}>
            ⚠️ 비전문가 단독 대응 시 치명적 위험
          </div>
          <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', lineHeight: '1.25' }}>
            초기 진술 번복 불가 · 패널티 최고조
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: 'rgba(0,0,0,0.2)', padding: '14px 24px', borderRadius: '18px' }}>
          <div style={{ display: 'flex', fontSize: '56px' }}>🚨</div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', fontSize: '54px', fontWeight: 'bold', color: '#F43F5E', lineHeight: '1' }}>98%</div>
            <div style={{ display: 'flex', fontSize: '18px', color: '#FDA4AF', marginTop: '4px' }}>패소 및 추징율</div>
          </div>
        </div>
      </div>

      {/* 하단 3개 수직 화이트 컬럼 (01, 02, 03) */}
      <div style={{ display: 'flex', gap: '18px', height: '480px' }}>
        {points.slice(0, 3).map((pt, idx) => {
          const clean = cleanItemText(pt)
          const numMatch = clean.match(/^(\d{1,2})[\.\s]+(.*)/)
          const stepNum = numMatch ? numMatch[1] : `0${idx + 1}`
          const stepText = numMatch ? numMatch[2] : clean

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                backgroundColor: '#FFFFFF',
                border: '2px solid #FECDD3',
                borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
                padding: '28px 24px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: '#BE123C',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  실수 {stepNum}
                </div>
                <div style={{ display: 'flex', fontSize: '26px' }}>❌</div>
              </div>

              <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#1E293B', lineHeight: '1.3' }}>
                {stepText}
              </div>

              <div style={{ display: 'flex', fontSize: '22px', color: '#BE123C', fontWeight: 'bold', borderTop: '1.5px solid #FFE4E6', paddingTop: '12px' }}>
                * 적격증빙 선제 검증 필수
              </div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 24px',
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '28px' }}>💡</span>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: palette.text }}>
          전문가 실무 팁: 의심스러운 정황이나 통보를 받으셨다면, 임의로 답변하지 마시고 즉시 사실관계를 점검하세요.
        </span>
      </div>
    </BentoContainer>
  )
}

/**
 * 2. 📊 위기 징후 자가진단표 (Self-Diagnosis Radar)
 * 레이아웃: 4분면 2×2 매트릭스 그리드
 */
export function SelfDiagnosisTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '내 사건 위험도 자가진단 체크리스트')
  const points = data.points && data.points.length > 0
    ? data.points
    : [
        '최근 3개월 이내 관련 기관으로부터 사전 통지 또는 출석 요구를 받았다',
        '필수 적격증빙이나 객관적 계약서/입증 자료가 일부 누락되어 있다',
        '법정 기한이 1개월 이내로 임박하여 빠른 조치가 시급하다',
        '유사한 사안으로 과거 불이익 처분을 받았거나 과태료 이력이 있다',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="📊" title={title} badgeText="자가진단 레이더" category={data.category} />

      {/* 4분면 2x2 매트릭스 레이아웃 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', height: '690px' }}>
        {/* 상단 2분면 */}
        <div style={{ display: 'flex', gap: '18px', flex: 1 }}>
          {/* 좌상단: 레이더 위험 판정 (톤업 미드나잇 슬레이트) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              backgroundColor: '#2C3E50',
              border: `2.5px solid ${palette.accent}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '28px',
              color: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '24px', color: '#FCD34D', fontWeight: 'bold' }}>📡 레이더 진단 기준</span>
              <span style={{ fontSize: '20px', background: 'rgba(255,255,255,0.18)', padding: '4px 10px', borderRadius: '8px' }}>위험도 판정</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#F59E0B', lineHeight: '1' }}>2개+</div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#FFFFFF', lineHeight: '1.3' }}>
                해당 시 즉시<br />‘경고’ 단계 돌입
              </div>
            </div>
            <div style={{ fontSize: '22px', color: '#CBD5E1' }}>* 단독 소명 시 패소/추징 위험 급증</div>
          </div>

          {/* 우상단: 체크 문항 1 & 2 (화이트) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: 1,
              backgroundColor: '#FFFFFF',
              border: `2px solid ${palette.border}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ backgroundColor: palette.accent, color: '#FFF', borderRadius: '8px', padding: '4px 10px', fontSize: '22px', fontWeight: 'bold' }}>Q1</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: '1.32' }}>{cleanItemText(points[0] || '')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ backgroundColor: palette.accent, color: '#FFF', borderRadius: '8px', padding: '4px 10px', fontSize: '22px', fontWeight: 'bold' }}>Q2</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: '1.32' }}>{cleanItemText(points[1] || '')}</div>
            </div>
          </div>
        </div>

        {/* 하단 2분면 */}
        <div style={{ display: 'flex', gap: '18px', flex: 1 }}>
          {/* 좌하단: 체크 문항 3 & 4 (화이트) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              flex: 1,
              backgroundColor: '#FFFFFF',
              border: `2px solid ${palette.border}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ backgroundColor: palette.accent, color: '#FFF', borderRadius: '8px', padding: '4px 10px', fontSize: '22px', fontWeight: 'bold' }}>Q3</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: '1.32' }}>{cleanItemText(points[2] || '')}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div style={{ backgroundColor: palette.accent, color: '#FFF', borderRadius: '8px', padding: '4px 10px', fontSize: '22px', fontWeight: 'bold' }}>Q4</div>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: '1.32' }}>{cleanItemText(points[3] || '')}</div>
            </div>
          </div>

          {/* 우하단: 판정 가이드 & 전문가 조력 (미색 하이라이트) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              backgroundColor: palette.highlightBg,
              border: `2.5px solid ${palette.accent}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '28px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.accent }}>
              🛡️ 전문가 1:1 진단 솔루션
            </div>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, lineHeight: '1.35' }}>
              자가진단 결과 2개 이상 해당 시, 즉시 기록 분석 권고
            </div>
            <div
              style={{
                display: 'flex',
                backgroundColor: palette.accent,
                color: '#FFFFFF',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '24px',
                fontWeight: 'bold',
                justifyContent: 'center',
              }}
            >
              🔍 1:1 비밀 보장 분석 신청
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 24px',
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '28px' }}>📊</span>
        <span style={{ fontSize: '24px', fontWeight: 'bold', color: palette.text }}>
          자가진단 결과 2개 이상 해당된다면, 이미 골든타임이 진행 중이므로 즉시 전문가 분석을 권장합니다.
        </span>
      </div>
    </BentoContainer>
  )
}

/**
 * 3. 🆚 나홀로 vs 전문가 시뮬레이션 (ROI & Outcome Comparison)
 * 레이아웃: 50:50 좌우 대칭 듀얼 뷰 (Split Duel View)
 */
export function VsSimulationTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '혼자 진행했을 때 vs 공인 자격사 선임 결과 비교')
  const extra1Text = sanitizeText(data.extra1 || '혼자 대처 시: 구제율 20%')
  const extra2Text = sanitizeText(data.extra2 || '전문가 선임 시: 구제율 95%')

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="🆚" title={title} badgeText="실익 & ROI 비교" category={data.category} />

      {/* 50:50 좌우 대칭 듀얼 비교 뷰 */}
      <div style={{ display: 'flex', gap: '22px', height: '760px' }}>
        {/* 좌측 1.5x3 나홀로 타일 (라이트 로즈 50%) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#FFF1F2',
            border: '2.5px solid #FECDD3',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '36px 30px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#BE123C',
                color: '#FFFFFF',
                padding: '6px 16px',
                borderRadius: '10px',
                fontSize: '24px',
                fontWeight: 'bold',
                alignSelf: 'flex-start',
              }}
            >
              ❌ 나홀로 대처
            </div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: '#881337', lineHeight: '1.25' }}>
              {extra1Text}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '26px', color: '#4C0519', fontWeight: 'bold' }}>
            <div>• 불리한 진술 및 입증 실패</div>
            <div>• 과다 세액 및 가산세 부과</div>
            <div>• 사후 구제 기회 영구 상실</div>
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(190, 18, 60, 0.12)',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#881337',
              justifyContent: 'center',
            }}
          >
            ⚠️ 실질 손실 및 패소 위험
          </div>
        </div>

        {/* 우측 1.5x3 전문가 타일 (노블 틸 그린 50%) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#1A535C',
            border: '2.5px solid #0D9488',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '36px 30px',
            color: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  padding: '6px 16px',
                  borderRadius: '10px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                ✅ 공인 자격사 선임
              </div>
              <span style={{ fontSize: '22px', color: '#A7F3D0', fontWeight: 'bold' }}>압도적 실익</span>
            </div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: '#FFFFFF', lineHeight: '1.25' }}>
              {extra2Text}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '26px', color: '#D1FAE5' }}>
            <div>🛡️ 1:1 맞춤 법리 & 증빙 선제 검증</div>
            <div>💰 합법적 공제 최대화 & 세액 방어</div>
            <div>⏱️ 전담 대리인 입회로 심리적 안정</div>
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: '#0D9488',
              color: '#FFFFFF',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '24px',
              fontWeight: 'bold',
              justifyContent: 'center',
            }}
          >
            🏆 권리 구제 & 절세 극대화
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        💡 ROI 분석: 전문가 수임료 대비 절감되는 세액과 가산세 방어 효과가 압도적으로 큽니다.
      </div>
    </BentoContainer>
  )
}

/**
 * 4. 📉 손실 스노우볼 (Cost of Inaction / Inaction Gauge)
 * 레이아웃: [상단 3×1 손실 타이머 배너] ➔ [하단 3열 수직 게이지 (1일차 회색 ➔ 30일차 앰버 ➔ 1년 방치 로즈 크림슨)]
 */
export function CostOfInactionTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '방치할수록 눈덩이처럼 불어나는 손실 스노우볼')

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="📉" title={title} badgeText="손실 스노우볼" category={data.category} />

      <div style={{ display: 'flex', gap: '18px', height: '760px' }}>
        {/* 1단계: 초기 24시간 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#F8FAFC',
            border: '2px solid #CBD5E1',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 24px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#64748B' }}>1단계 (골든타임)</div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: '#1E293B' }}>초기 대응</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '56px' }}>🟢</div>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#1E293B' }}>원금 상태</div>
            <div style={{ display: 'flex', fontSize: '22px', color: '#64748B', textAlign: 'center' }}>소명 기회 100% 잔여</div>
          </div>

          <div style={{ display: 'flex', fontSize: '24px', color: '#334155', lineHeight: '1.35' }}>
            선제적 조치 시 가산세 0원 및 원만한 종결 가능
          </div>
        </div>

        {/* 2단계: 1개월 경과 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#FFF7ED',
            border: '2px solid #FDBA74',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 24px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#C2410C' }}>2단계 (위험 진입)</div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: '#9A3412' }}>1개월 경과</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '56px' }}>🟠</div>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#C2410C' }}>+10~20% 가산</div>
            <div style={{ display: 'flex', fontSize: '22px', color: '#9A3412', textAlign: 'center' }}>납부지연이자 매일 가산</div>
          </div>

          <div style={{ display: 'flex', fontSize: '24px', color: '#7C2D12', lineHeight: '1.35' }}>
            입증 서류 확보 난항 및 과태료/처분 고지 단계
          </div>
        </div>

        {/* 3단계: 1년 방치 (톤업 로즈 크림슨) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#7A2838',
            border: '2.5px solid #9F1239',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 24px',
            color: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#FDA4AF' }}>3단계 (눈덩이 폭탄)</div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: '#FFFFFF' }}>1년 이상 방치</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '56px' }}>🔴</div>
            <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: '#FFFFFF' }}>최대 40% 폭탄</div>
            <div style={{ display: 'flex', fontSize: '22px', color: '#FECDD3', textAlign: 'center' }}>행정처분/강제집행</div>
          </div>

          <div style={{ display: 'flex', fontSize: '24px', color: '#FFE4E6', lineHeight: '1.35' }}>
            소명 기회 완전 소멸 및 법적 구제 불가
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        ⏳ 시간 압박: 미루는 하루마다 불이익이 눈덩이처럼 커집니다. 지금 즉시 대처하세요.
      </div>
    </BentoContainer>
  )
}

/**
 * 5. ⏳ D-Day 타임라인 / 로드맵 (Action Timeline)
 * 레이아웃: [상단 3×1.2 골든타임 D-30 배너] ➔ [하단 3단 가로형 계단식 로드맵]
 */
export function ActionTimelineTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '사건 발생부터 최종 종결까지 D-Day 타임라인')
  const steps = data.points && data.points.length >= 3
    ? data.points
    : [
        '초기 대응 (골든타임): 사실관계 확정 및 증빙 선제 확보',
        '심사 및 소명 (D-30): 법리 검토 및 1:1 맞춤 소명서 제출',
        '최종 권리 구제 (D-Day): 처분 취소 및 세액 감면 확정',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="⏳" title={title} badgeText="D-DAY 로드맵" category={data.category} />

      {/* 상단 3x1.2 톤업 미드나잇 슬레이트 배너 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2C3E50',
          border: `2.5px solid ${palette.accent}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '24px 32px',
          color: '#FFFFFF',
          boxSizing: 'border-box',
          height: '180px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', fontSize: '24px', color: '#FCD34D', fontWeight: 'bold' }}>
            ⏱️ 사건 종결까지 골든타임 로드맵
          </div>
          <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold' }}>
            단계별 기한 엄수 · 신속한 권리 구제
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '14px 28px', borderRadius: '18px' }}>
          <span style={{ fontSize: '52px', fontWeight: 'bold', color: '#FCD34D' }}>D-30</span>
          <span style={{ fontSize: '20px', color: '#CBD5E1' }}>통지서 수령 즉시</span>
        </div>
      </div>

      {/* 하단 3단 가로형 계단식 로드맵 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '490px' }}>
        {steps.slice(0, 3).map((st, idx) => {
          const parts = cleanItemText(st).split(':')
          const stepTitle = parts[0]
          const stepDesc = parts[1] || '전문가 사전 검토 및 1:1 맞춤 조치'

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flex: 1,
                backgroundColor: idx === 2 ? palette.highlightBg : '#FFFFFF',
                border: `2px solid ${idx === 2 ? palette.accent : palette.border}`,
                borderRadius: '18px',
                padding: '20px 28px',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: idx === 2 ? palette.accent : palette.badgeBg,
                    color: idx === 2 ? '#FFFFFF' : palette.badgeText,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  STEP 0{idx + 1}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: palette.text }}>
                    {stepTitle}
                  </div>
                  <div style={{ display: 'flex', fontSize: '24px', color: palette.sub }}>
                    {stepDesc}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: '32px' }}>{idx === 2 ? '🏆' : '➡️'}</div>
            </div>
          )
        })}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        🛡️ 전 과정 공인 자격사 1:1 직접 입회 및 신속한 권리 구제 확정
      </div>
    </BentoContainer>
  )
}

/**
 * 6. 📑 필수 준비 서류함 (Required Dossier)
 * 레이아웃: [상단 3×2 마닐라 서류철 폴더 (탭 + 3개 서류)] ➔ [하단 좌우 2단 분할 바 (캡처 보관 & 발급처)]
 */
export function RequiredDossierTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '상담 전 준비해야 할 필수 구비 서류함')
  const points = data.points && data.points.length > 0
    ? data.points
    : [
        '신분증 및 가족관계증명서 (상세) [정부24 발급]',
        '최근 3개년 소득금액증명원 및 원천징수영수증 [홈택스]',
        '사건 관련 처분 통지서 및 계약서 원본 [보유 서류]',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="📑" title={title} badgeText="필수 서류 도감" category={data.category} />

      {/* 상단 3x2 마닐라 서류철 폴더 (실제 탭 스타일) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FAF5EE',
          border: '2.5px solid #D8C3A5',
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '32px 30px',
          boxSizing: 'border-box',
          height: '520px',
        }}
      >
        {/* 마닐라 폴더 상단 탭 헤더 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#E8D5B5',
              color: '#5C4033',
              padding: '8px 20px',
              borderRadius: '10px',
              fontSize: '26px',
              fontWeight: 'bold',
            }}
          >
            📁 DOSSIER FILE · NO. 2026-A
          </div>
          <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: '#8C6D46' }}>
            발급일 3개월 이내 원본 지참
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {points.slice(0, 3).map((pt, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                backgroundColor: '#FFFFFF',
                border: '2px solid #E4D4C0',
                borderRadius: '14px',
                padding: '16px 22px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#C19A6B',
                  color: '#FFFFFF',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                DOC 0{idx + 1}
              </div>
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 'bold', color: '#3E2723', flex: 1 }}>
                {cleanItemText(pt)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', fontSize: '24px', color: '#6D4C41', fontWeight: 'bold' }}>
          * 서류 분실 시 전문가와 상의하여 대체 증빙을 준비할 수 있습니다.
        </div>
      </div>

      {/* 하단 좌우 2단 분할 타일 (캡처 보관 + 발급처 팁) */}
      <div style={{ display: 'flex', gap: '18px', height: '160px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flex: 1,
            backgroundColor: '#2C3E50',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '20px 24px',
            color: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '48px' }}>📸</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#FCD34D' }}>사진 캡처 보관</div>
            <div style={{ fontSize: '20px', color: '#CBD5E1' }}>상담 전 서류를 미리 지참하세요</div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flex: 1,
            backgroundColor: palette.highlightBg,
            border: `2.5px solid ${palette.accent}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '20px 24px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '48px' }}>⚡</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '26px', fontWeight: 'bold', color: palette.accent }}>빠른 온라인 발급</div>
            <div style={{ fontSize: '20px', color: palette.sub }}>정부24 · 홈택스 10분 즉시 발급</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        💡 실무 팁: 서류 발급이 어렵거나 분실된 경우, 전문가와 상의하여 대체 증빙을 발급받을 수 있습니다.
      </div>
    </BentoContainer>
  )
}

/**
 * 7. ⚖️ 처벌/과세 기준표 (Criteria Table)
 * 레이아웃: L자형 비대칭 테트리스
 */
export function CriteriaTableTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '법정 처벌 수위 및 과세 기준표')
  const points = data.points && data.points.length > 0
    ? data.points
    : [
        '1구간 (기본 기준): 1년 이하 징역 또는 500만원 이하 벌금 (기본세율 적용)',
        '2구간 (가중 기준): 2년 이상 5년 이하 징역 (누진세율 40% 적용)',
        '3구간 (중과 기준): 면허 취소 및 징역형 가중 처벌 (가산세 최고 40% 부과)',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="⚖️" title={title} badgeText="법정 기준표" category={data.category} />

      <div style={{ display: 'flex', gap: '22px', height: '760px' }}>
        {/* 좌측 2x3 공문서 명조체 기준표 (70% 화이트) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 2,
            backgroundColor: palette.cardBg,
            border: `2.5px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '36px 30px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: palette.text }}>
              📜 관련 법령상 적용 구간 및 처벌 수위
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, fontWeight: 'bold' }}>
              공문서 표준 서식
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {points.slice(0, 3).map((pt, idx) => {
              const parts = cleanItemText(pt).split(':')
              const segTitle = parts[0]
              const segDetail = parts[1] || ''

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: idx === 2 ? '#FFF5F5' : palette.highlightBg,
                    border: `2px solid ${idx === 2 ? '#FECACA' : palette.border}`,
                    borderRadius: '16px',
                    padding: '18px 22px',
                    gap: '4px',
                  }}
                >
                  <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: idx === 2 ? '#DC2626' : palette.accent }}>
                    {segTitle}
                  </div>
                  {segDetail && (
                    <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, lineHeight: '1.35' }}>
                      {segDetail}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', fontSize: '22px', color: palette.sub }}>
            * 개별 사건의 정황 및 전과 여부에 따라 감경 요건을 적극 소명해야 합니다.
          </div>
        </div>

        {/* 우측 2단 스택: [우상 최고 가산세] + [우하 감경 소명] */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1 }}>
          {/* 우상단: 최고 수치 하이라이트 (톤업 미드나잇 슬레이트) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1.2,
              backgroundColor: '#2C3E50',
              border: `2px solid ${palette.border}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px 20px',
              color: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', color: '#FCD34D', fontWeight: 'bold' }}>법정 최고 수위</div>
            <div style={{ display: 'flex', fontSize: '76px', fontWeight: 'bold', color: '#F87171', lineHeight: '1' }}>40%</div>
            <div style={{ display: 'flex', fontSize: '22px', color: '#CBD5E1' }}>부당 무신고 가산세</div>
          </div>

          {/* 우하단: 감경 소명 가이드 (미색) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              backgroundColor: palette.highlightBg,
              border: `2px solid ${palette.accent}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px 20px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>⚖️ 감경 요건 입증</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: palette.text, lineHeight: '1.3' }}>
              정당한 사유 및 고의성 부존재 소명 시 감면 가능
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        📜 법적 근거: 관련 법률 제00조 및 대법원 최신 양형/판례 기준 적용
      </div>
    </BentoContainer>
  )
}

/**
 * 8. 🏆 실제 성공 사례 요약 (Case Study / Success Receipt)
 * 레이아웃: [좌 1.6×3 영수증 티켓 (5억 ➔ 0원 전액 취소)] vs [우상 1.4×1.5 승소율 98%] + [우하 1.4×1.5 인용 주문]
 */
export function SuccessReceiptTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '실제 권리 구제 및 절세 성공 사례 요약')
  const beforeText = sanitizeText(data.extra1 || '세금 5억 원 과세 예고')
  const afterText = sanitizeText(data.extra2 || '0원 전액 취소 및 승소')

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="🏆" title={title} badgeText="성공 영수증" category={data.category} />

      <div style={{ display: 'flex', gap: '22px', height: '760px' }}>
        {/* 좌측 1.6x3 영수증 테마 비포/애프터 타일 (영수증 점선 질감) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1.6,
            backgroundColor: '#FFFFFF',
            border: '2.5px dashed #94A3B8',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '34px 28px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #E2E8F0', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#1E293B' }}>
              🧾 SUCCESS RECEIPT
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#64748B', fontWeight: 'bold' }}>
              공인 자격사 직접 수행
            </div>
          </div>

          {/* Before & After 대비 박스 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFF1F2',
                border: '1.5px solid #FECDD3',
                borderRadius: '16px',
                padding: '16px 20px',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: '#BE123C' }}>BEFORE (과세 예고 통지)</div>
              <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: '#881337', textDecoration: 'line-through' }}>
                {beforeText}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', fontSize: '32px' }}>⬇️</div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F0FDF4',
                border: '2.5px solid #86EFAC',
                borderRadius: '16px',
                padding: '18px 20px',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: '#15803D' }}>AFTER (최종 결정 주문)</div>
              <div style={{ display: 'flex', fontSize: '44px', fontWeight: 'bold', color: '#14532D' }}>
                {afterText}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #E2E8F0', paddingTop: '14px' }}>
            <div style={{ display: 'flex', fontSize: '22px', color: '#64748B' }}>* 철저한 사실관계 입증 완료</div>
            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: palette.accent }}>VERIFIED CASE</div>
          </div>
        </div>

        {/* 우측 2단 스택: [우상 승소율 98%] + [우하 맞춤 전략] */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', flex: 1.4 }}>
          {/* 우상단: 승소율 98% 대형 수치 (노블 틸 그린) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1.3,
              backgroundColor: '#1A535C',
              border: '2.5px solid #0D9488',
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '28px 24px',
              color: '#FFFFFF',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', color: '#A7F3D0', fontWeight: 'bold' }}>사건 인용 확정</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <div style={{ fontSize: '86px', fontWeight: 'bold', color: '#FFFFFF', lineHeight: '1' }}>98%</div>
              <div style={{ fontSize: '24px', color: '#6EE7B7' }}>구제 만족도</div>
            </div>
            <div style={{ display: 'flex', fontSize: '22px', color: '#D1FAE5' }}>* 의뢰인 권익 완벽 보호</div>
          </div>

          {/* 우하단: 맞춤 전략 안내 (미색) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              backgroundColor: palette.highlightBg,
              border: `2px solid ${palette.border}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px 22px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>🏆 1:1 맞춤 승소 전략</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: palette.text, lineHeight: '1.3' }}>
              유사 성공 사례의 법리 노하우를 현재 사건에 정밀 적용
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        🧾 Receipt No. 2026-PS-0089 · 공인 자격사 1:1 직접 수행 및 성공 종결
      </div>
    </BentoContainer>
  )
}

/**
 * 9. 💬 전문가 소견서 및 팩트체크 (Key Takeaways & Mythbusters)
 * 레이아웃: [상단 3×2.3 미색 줄노트 공문서 소견서] ➔ [하단 좌측 2×0.7 핵심 결론 바] + [하단 우측 1×0.7 직인 도장]
 */
export function ExpertOpinionTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '공인 자격사 종합 소견서 및 팩트체크')
  const points = data.points && data.points.length >= 3
    ? data.points
    : [
        '인터넷의 단순 정보만 믿고 대응하다가는 오히려 불리한 진술이 될 수 있습니다.',
        '적격증빙과 법정 요건을 선제적으로 검증하면 합법적 권리 구제가 100% 가능합니다.',
        '사안별로 적용 법리가 완전히 다르므로 반드시 전문가 1:1 진단을 권장합니다.',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="💬" title={title} badgeText="전문가 소견서" category={data.category} />

      {/* 상단 3x2.3 미색 줄노트 공문서 소견서 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FCFAF6',
          border: '2.5px solid #E7E0D3',
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '36px 36px',
          boxSizing: 'border-box',
          height: '520px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #D6CCC2', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#2B2523' }}>
            ✍️ 핵심 팩트체크 및 3줄 종합 코멘트
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: '#8C7B70', fontWeight: 'bold' }}>
            공식 실무 소견
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {points.slice(0, 3).map((pt, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                borderBottom: '1.5px dashed #D6CCC2',
                paddingBottom: '14px',
              }}
            >
              <div style={{ display: 'flex', fontSize: '30px', fontWeight: 'bold', color: palette.accent }}>
                {`0${idx + 1}.`}
              </div>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: '#2B2523', lineHeight: '1.35', flex: 1 }}>
                {cleanItemText(pt)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', fontSize: '22px', color: '#6E655F', fontStyle: 'italic' }}>
          "의뢰인의 권익을 최우선으로 하여 명쾌한 해법을 제시합니다."
        </div>
      </div>

      {/* 하단 좌측 핵심 결론 바 + 하단 우측 붉은색 직인 도장 */}
      <div style={{ display: 'flex', gap: '18px', height: '160px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            flex: 2,
            backgroundColor: palette.highlightBg,
            border: `2px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '20px 28px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>🔒 검증 완료 및 철저한 비밀 보장</div>
          <div style={{ fontSize: '26px', fontWeight: 'bold', color: palette.text, marginTop: '4px' }}>
            공인 자격사가 직접 1:1로 검토한 공식 자문 결과입니다.
          </div>
        </div>

        {/* 우하단 붉은색 직인 도장 그래픽 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#FFFFFF',
            border: `2px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '12px',
            boxSizing: 'border-box',
          }}
        >
          <OfficialStamp text="공인검토필" sub="2026 POSTSYNK" size={140} />
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        ✍️ 공인 자격사 1:1 정밀 검토 및 사실관계 자문 완료
      </div>
    </BentoContainer>
  )
}

/**
 * 10. ✋ 최종 결단 촉구 (Final Verdict / CTA)
 * 레이아웃: [상단 3×2 대형 긴급 결단 히어로 박스] ➔ [하단 좌우 2단 상담 & 전화 버튼 UI]
 */
export function FinalVerdictTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '더 늦기 전에 결단하세요 (Final Verdict)')
  const phone = data.extra1 || '(대표 직통 상담 전화)'

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="✋" title={title} badgeText="최종 결단 촉구" category={data.category} />

      {/* 상단 3x2 대형 긴급 결단 히어로 박스 (톤업 로즈 크림슨) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#7A2838',
          border: '2.5px solid #9F1239',
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '40px 36px',
          color: '#FFFFFF',
          boxSizing: 'border-box',
          height: '500px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: '#BE123C',
              color: '#FFFFFF',
              padding: '8px 18px',
              borderRadius: '10px',
              fontSize: '26px',
              fontWeight: 'bold',
            }}
          >
            ⚠️ 골든타임 임박
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: '#FDA4AF', fontWeight: 'bold' }}>
            기회 상실 경고
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', fontSize: '48px', fontWeight: 'bold', lineHeight: '1.25' }}>
            골든타임이 지나면<br />소명 기회가 영구 박탈됩니다.
          </div>
          <div style={{ display: 'flex', fontSize: '28px', color: '#FECDD3', lineHeight: '1.35' }}>
            망설이는 지금 이 순간에도 법정 불복 기한 시계는 흘러가고 있습니다.
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '22px', color: '#FDA4AF' }}>
          * 이미 처분 통지서나 출석 요구를 받으셨다면 24시간 이내 선제 조치가 필수입니다.
        </div>
      </div>

      {/* 하단 좌우 2단 상담 & 전화 버튼 UI */}
      <div style={{ display: 'flex', gap: '18px', height: '180px' }}>
        {/* 좌측 1.5x1 비밀 보장 상담 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flex: 1,
            backgroundColor: palette.highlightBg,
            border: `2.5px solid ${palette.accent}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '24px 28px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '52px' }}>🔒</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '28px', fontWeight: 'bold', color: palette.accent }}>1:1 비밀 보장 상담</div>
            <div style={{ fontSize: '22px', color: palette.sub }}>철저한 보안 유지 및 맞춤 검토</div>
          </div>
        </div>

        {/* 우측 1.5x1 직통 전화 연결 (톤업 미드나잇 슬레이트 버튼) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            flex: 1,
            backgroundColor: '#2C3E50',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '24px 28px',
            color: '#FFFFFF',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ fontSize: '52px' }}>📞</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ fontSize: '30px', fontWeight: 'bold', color: '#FCD34D' }}>{phone}</div>
            <div style={{ fontSize: '22px', color: '#CBD5E1' }}>공인 자격사 직통 연결 안내</div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F8FAFC',
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '16px 20px',
          fontSize: '24px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        🛡️ 의뢰인의 골든타임을 지키기 위해 신속하고 명쾌한 해법을 제시합니다.
      </div>
    </BentoContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. 🖼️ 대표 썸네일 템플릿 (4종 레이아웃: THUMB_A ~ D, 1080 × 1080 px)
// ─────────────────────────────────────────────────────────────────────────────

export function formatThumbnailTitle(
  title: string,
  maxLineChars = 16,
  fallbackWordLen = 15
): string[] {
  if (!title || !title.trim()) return ['2026 핵심 실무 가이드']
  const cleanTitle = title.trim()

  if (cleanTitle.includes('\n')) {
    return cleanTitle
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  }

  const rawWords = cleanTitle.split(/\s+/).filter(Boolean)
  const tokens: string[] = []

  for (const w of rawWords) {
    if (w.length >= fallbackWordLen) {
      const chunkSize = 13
      for (let i = 0; i < w.length; i += chunkSize) {
        tokens.push(w.slice(i, i + chunkSize))
      }
    } else {
      tokens.push(w)
    }
  }

  if (tokens.length === 0) return [cleanTitle]
  if (tokens.length === 1) return [tokens[0]]

  const fullStr = tokens.join(' ')

  if (fullStr.length <= 15) {
    return [fullStr]
  }

  if (fullStr.length <= 28) {
    let bestSplit = 1
    let minDiff = Infinity
    for (let i = 1; i < tokens.length; i++) {
      const line1 = tokens.slice(0, i).join(' ')
      const line2 = tokens.slice(i).join(' ')
      const diff = Math.abs(line1.length - line2.length)
      if (diff < minDiff) {
        minDiff = diff
        bestSplit = i
      }
    }
    return [
      tokens.slice(0, bestSplit).join(' '),
      tokens.slice(bestSplit).join(' '),
    ]
  }

  if (fullStr.length <= 38) {
    let bestSplit = 1
    let minDiff = Infinity
    for (let i = 1; i < tokens.length; i++) {
      const line1 = tokens.slice(0, i).join(' ')
      const line2 = tokens.slice(i).join(' ')
      if (line1.length <= 19 && line2.length <= 19) {
        const diff = Math.abs(line1.length - line2.length)
        if (diff < minDiff) {
          minDiff = diff
          bestSplit = i
        }
      }
    }
    if (minDiff !== Infinity) {
      return [
        tokens.slice(0, bestSplit).join(' '),
        tokens.slice(bestSplit).join(' '),
      ]
    }
  }

  const lines: string[] = []
  let cur = ''
  const targetLineLen = Math.max(13, Math.ceil(fullStr.length / 3))
  for (const t of tokens) {
    if (!cur) {
      cur = t
    } else if ((cur + ' ' + t).length <= targetLineLen + 2) {
      cur += ' ' + t
    } else {
      lines.push(cur)
      cur = t
    }
  }
  if (cur) lines.push(cur)
  return lines.slice(0, 3)
}

export function ThumbnailTemplate({
  data,
  palette,
  layout = 'THUMB_A',
  tags = ['핵심 쟁점 분석', '법적 기준 검토', '실무 대응 절차'],
}: {
  data: InfographicData
  palette: Palette
  layout?: ThumbLayout
  tags?: string[]
}) {
  const category = sanitizeText(data.category || '2026 핵심 실무 분석')
  const rawTitle = sanitizeText(data.title || '2026 핵심 실무 가이드')
  const signature = sanitizeText(data.signature || 'PostSynk Verified Guide')
  const subContent = sanitizeText(data.subText || data.subtitle || '')

  const titleLines = formatThumbnailTitle(rawTitle)
  const totalChars = rawTitle.length

  let titleSize = 88
  let titleLineHeight = '1.24'
  if (totalChars <= 15) {
    titleSize = 98
  } else if (totalChars <= 28) {
    titleSize = 88
  } else if (totalChars <= 38) {
    titleSize = 76
  } else {
    titleSize = 64
    titleLineHeight = '1.20'
  }

  // THUMB_A: 중앙 플로팅 카드형
  if (layout === 'THUMB_A') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '1080px',
          height: '1080px',
          backgroundColor: palette.bg,
          padding: '60px',
          boxSizing: 'border-box',
          letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
          wordBreak: 'break-word',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '960px',
            height: '960px',
            backgroundColor: palette.cardBg,
            border: `1.5px solid ${palette.border}`,
            borderRadius: '28px',
            padding: '70px 65px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: palette.badgeBg,
                color: palette.badgeText,
                padding: '10px 24px',
                borderRadius: '28px',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {category}
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: palette.accent, fontWeight: 'bold' }}>
              {signature}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', margin: 'auto 0' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {titleLines.map((line, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    fontSize: `${titleSize}px`,
                    lineHeight: titleLineHeight,
                    fontWeight: 'bold',
                    color: palette.text,
                    textAlign: 'left',
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            {subContent && (
              <div
                style={{
                  display: 'flex',
                  fontSize: '26px',
                  color: palette.sub,
                  fontWeight: 'bold',
                  lineHeight: '1.4',
                  marginTop: '10px',
                }}
              >
                {subContent}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1.5px solid ${palette.border}`,
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              {tags.slice(0, 3).map((tag, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    backgroundColor: palette.highlightBg,
                    color: palette.accent,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
              1:1 심층 상담 접수
            </div>
          </div>
        </div>
      </div>
    )
  }

  // THUMB_B: 프렌치 와이드 밴드형
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
          letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
          wordBreak: 'break-word',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.accent,
            padding: '50px 80px',
            height: '240px',
            width: '1080px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: 'rgba(255, 255, 255, 0.22)',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: '14px',
              fontSize: '22px',
              fontWeight: 'bold',
            }}
          >
            {category}
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: '#FFFFFF', fontWeight: 'bold' }}>
            {signature}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '70px 80px 80px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {titleLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  fontSize: `${titleSize}px`,
                  lineHeight: titleLineHeight,
                  fontWeight: 'bold',
                  color: palette.text,
                  textAlign: 'left',
                }}
              >
                {line}
              </div>
            ))}

            {subContent && (
              <div style={{ display: 'flex', fontSize: '26px', color: palette.sub, fontWeight: 'bold', lineHeight: '1.4' }}>
                {subContent}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1.5px solid ${palette.border}`,
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>
              전문 자격사 1:1 맞춤 검토
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
              철저한 비밀 보장 상담
            </div>
          </div>
        </div>
      </div>
    )
  }

  // THUMB_C: 좌측 악센트 바 에디토리얼형
  if (layout === 'THUMB_C') {
    return (
      <div
        style={{
          display: 'flex',
          width: '1080px',
          height: '1080px',
          backgroundColor: palette.cardBg,
          boxSizing: 'border-box',
          letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
          wordBreak: 'break-word',
        }}
      >
        <div style={{ display: 'flex', width: '24px', height: '1080px', backgroundColor: palette.accent }} />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            padding: '75px 80px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: palette.badgeBg,
                color: palette.badgeText,
                padding: '10px 24px',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              {category}
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: palette.accent, fontWeight: 'bold' }}>
              {signature}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {titleLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  fontSize: `${titleSize}px`,
                  lineHeight: titleLineHeight,
                  fontWeight: 'bold',
                  color: palette.text,
                  textAlign: 'left',
                }}
              >
                {line}
              </div>
            ))}

            {subContent && (
              <div style={{ display: 'flex', fontSize: '26px', color: palette.sub, fontWeight: 'bold', lineHeight: '1.4' }}>
                {subContent}
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: `1.5px solid ${palette.border}`,
              paddingTop: '24px',
            }}
          >
            <div style={{ display: 'flex', gap: '12px' }}>
              {tags.slice(0, 3).map((tag, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    backgroundColor: palette.highlightBg,
                    color: palette.accent,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                  }}
                >
                  #{tag}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
              PostSynk 1:1 심층 상담
            </div>
          </div>
        </div>
      </div>
    )
  }

  // THUMB_D: 클린 럭셔리 보더형
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1080px',
        height: '1080px',
        backgroundColor: palette.highlightBg,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '980px',
          height: '980px',
          backgroundColor: palette.cardBg,
          border: `2.5px solid ${palette.accent}`,
          borderRadius: '30px',
          padding: '75px 70px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.accent,
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: '12px',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            {category}
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: palette.accent, fontWeight: 'bold' }}>
            {signature}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {titleLines.map((line, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                fontSize: `${titleSize}px`,
                lineHeight: titleLineHeight,
                fontWeight: 'bold',
                color: palette.text,
                textAlign: 'left',
              }}
            >
              {line}
            </div>
          ))}

          {subContent && (
            <div style={{ display: 'flex', fontSize: '26px', color: palette.sub, fontWeight: 'bold', lineHeight: '1.4' }}>
              {subContent}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: `1.5px solid ${palette.border}`,
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', fontSize: '22px', color: palette.accent, fontWeight: 'bold' }}>
            🏛️ 공인 자격사 1:1 전담 검토
          </div>
          <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
            철저한 비밀 보장
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. 📞 하단 상담 유도 배너 (1080 × 1080 px 1:1 정방형 벤토 명함 배너)
// ─────────────────────────────────────────────────────────────────────────────

export function CtaBannerTemplate({
  data,
  palette,
}: {
  data: InfographicData
  palette: Palette
  layout?: BannerLayout
}) {
  const officeName = sanitizeText(data.title || '1:1 맞춤 정밀 진단 및 상담 안내')
  const phone = data.extra1 || '(대표 직통 전화번호)'
  const address = sanitizeText(data.extra2 || '(사무소 상세 주소)')
  const sub = sanitizeText(data.subText || data.subtitle || '풍부한 실무 경험을 바탕으로 의뢰인의 권익을 최우선으로 보호합니다.')

  const officeNameSize = officeName.length > 15 ? 46 : 52

  return (
    <BentoContainer palette={palette}>
      {/* 상단 3x2 히어로 상담 배너 타일 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: palette.cardBg,
          border: `1.5px solid ${palette.accent}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '44px 40px',
          height: '480px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.accent,
              color: '#FFFFFF',
              padding: '10px 22px',
              borderRadius: '12px',
              fontSize: '22px',
              fontWeight: 'bold',
            }}
          >
            🏛️ 공식 1:1 심층 상담 창구
          </div>
          <div style={{ display: 'flex', fontSize: '22px', color: palette.accent, fontWeight: 'bold' }}>
            1:1 사전 예약제
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', fontSize: `${officeNameSize}px`, fontWeight: 'bold', color: palette.text, lineHeight: '1.2' }}>
            {officeName}
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: palette.sub, lineHeight: '1.4' }}>
            {sub}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '20px', color: '#94A3B8', fontWeight: 'bold' }}>
          * 풍부한 실무 경험을 바탕으로 의뢰인의 권익을 최우선으로 보호합니다.
        </div>
      </div>

      {/* 중앙 2단 분할 대형 벤토 타일 (전화 & 오시는 길) */}
      <div style={{ display: 'flex', gap: '20px', height: '340px' }}>
        {/* 전화 상담 타일 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: palette.highlightBg,
            border: `1.5px solid ${palette.accent}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileCard,
            padding: '36px 30px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>
            <span>📞</span>
            <span>직통 전화 상담</span>
          </div>
          <div style={{ display: 'flex', fontSize: '46px', fontWeight: 'bold', color: palette.text }}>
            {phone}
          </div>
          <div style={{ display: 'flex', fontSize: '19px', color: palette.sub, fontWeight: 'bold' }}>
            평일 및 주말 사전 예약 시 심층 상담 가능
          </div>
        </div>

        {/* 사무소 위치 타일 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: palette.cardBg,
            border: `1.5px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileCard,
            padding: '36px 30px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '24px', fontWeight: 'bold', color: palette.sub }}>
            <span>🏢</span>
            <span>사무소 오시는 길</span>
          </div>
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, lineHeight: '1.35' }}>
            {address}
          </div>
          <div style={{ display: 'flex', fontSize: '19px', color: '#94A3B8', fontWeight: 'bold' }}>
            방문 상담 시 사전 접수 필수
          </div>
        </div>
      </div>

      {/* 하단 3x1 보증 바 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '14px 20px',
          fontSize: '20px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        🔒 의뢰인의 비밀은 100% 철저히 보호되며, 예약 후 방문 시 대기 없이 심층 상담이 진행됩니다.
      </div>
    </BentoContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. 🚦 메인 렌더링 스위치 (Single Switch Entrypoint)
// ─────────────────────────────────────────────────────────────────────────────

export function generateProceduralImage(data: InfographicData): React.ReactElement {
  const brandKit = hashUserIdToBrandKit(data.userId || data.seed)

  const palette = data.themeName
    ? palettes.find((p) => p.name === data.themeName) || brandKit.theme
    : brandKit.theme

  const thumbLayout = data.thumbLayout || brandKit.thumbLayout
  const bannerLayout = data.bannerLayout || brandKit.bannerLayout

  const tags = data.tags && data.tags.length > 0
    ? data.tags.slice(0, 3)
    : ['핵심 쟁점 분석', '법적 기준 검토', '실무 대응 절차']

  switch (data.type) {
    case 'MAIN_THUMBNAIL':
      return <ThumbnailTemplate data={data} palette={palette} layout={thumbLayout} tags={tags} />
    case 'CTA_FOOTER':
      return <CtaBannerTemplate data={data} palette={palette} layout={bannerLayout} />

    // [10종 본문 벤토 카드]
    case 'RED_FLAGS':
      return <RedFlagsTemplate data={data} palette={palette} />
    case 'SELF_DIAGNOSIS':
      return <SelfDiagnosisTemplate data={data} palette={palette} />
    case 'VS_SIMULATION':
      return <VsSimulationTemplate data={data} palette={palette} />
    case 'COST_OF_INACTION':
      return <CostOfInactionTemplate data={data} palette={palette} />
    case 'ACTION_TIMELINE':
      return <ActionTimelineTemplate data={data} palette={palette} />
    case 'REQUIRED_DOSSIER':
      return <RequiredDossierTemplate data={data} palette={palette} />
    case 'CRITERIA_TABLE':
      return <CriteriaTableTemplate data={data} palette={palette} />
    case 'SUCCESS_RECEIPT':
      return <SuccessReceiptTemplate data={data} palette={palette} />
    case 'EXPERT_OPINION':
      return <ExpertOpinionTemplate data={data} palette={palette} />
    case 'FINAL_VERDICT':
      return <FinalVerdictTemplate data={data} palette={palette} />

    // 레거시 타입 호환
    case 'CHECKLIST':
      return <SelfDiagnosisTemplate data={data} palette={palette} />
    case 'COMPARISON':
      return <VsSimulationTemplate data={data} palette={palette} />
    case 'STAT_HIGHLIGHT':
      return <CriteriaTableTemplate data={data} palette={palette} />
    case 'PROCESS_FLOW':
      return <ActionTimelineTemplate data={data} palette={palette} />
    case 'QNA':
      return <ExpertOpinionTemplate data={data} palette={palette} />
    case 'WARNING_RISK':
      return <RedFlagsTemplate data={data} palette={palette} />
    case 'KEY_TAKEAWAYS':
      return <ExpertOpinionTemplate data={data} palette={palette} />

    default:
      return <ThumbnailTemplate data={data} palette={palette} layout={thumbLayout} tags={tags} />
  }
}

export function buildProceduralCardComponent(payload: CardPayload): React.ReactElement {
  return generateProceduralImage(payload)
}
