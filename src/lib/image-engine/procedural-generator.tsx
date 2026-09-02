import React from 'react'
import { cleanSummaryText } from '@/lib/utils/textCleaner'

// ─────────────────────────────────────────────────────────────────────────────
// 1. 타입 정의 (TypeScript Interfaces)
// ─────────────────────────────────────────────────────────────────────────────

export type CardType =
  | 'MAIN_THUMBNAIL'
  | 'CTA_FOOTER'
  // [2026 방향 A] 전문직 특화 정예 8종 벤토 카드
  | 'CRITICAL_CHECKLIST'
  | 'ROI_COMPARISON'
  | 'LOSS_GAUGE'
  | 'PROCESS_ROADMAP'
  | 'DOSSIER_INDEX'
  | 'STATUTORY_CRITERIA'
  | 'FACT_QNA'
  | 'EXECUTIVE_SUMMARY'
  // 10종 기존 명칭 완벽 호환
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
  // 레거시 타입 호환
  | 'CHECKLIST'
  | 'COMPARISON'
  | 'STAT_HIGHLIGHT'
  | 'PROCESS_FLOW'
  | 'QNA'
  | 'WARNING_RISK'
  | 'KEY_TAKEAWAYS'

export type ThumbLayout = 'THUMB_A' | 'THUMB_B' | 'THUMB_C' | 'THUMB_D'
export type BannerLayout = 'BANNER_A' | 'BANNER_B' | 'BANNER_C'
export type BentoFrameLayout = 'FRAME_A_DUAL' | 'FRAME_B_BANNER_3COL' | 'FRAME_C_TETRIS_L' | 'FRAME_D_MATRIX_4' | 'FRAME_E_DOSSIER_STACK'

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
  frameLayout?: BentoFrameLayout
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
// 2. 10종 전문직 프리미엄 테마 팔레트 (소프트 톤온톤 럭셔리)
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
export const bentoFrameLayouts: BentoFrameLayout[] = [
  'FRAME_A_DUAL',
  'FRAME_B_BANNER_3COL',
  'FRAME_C_TETRIS_L',
  'FRAME_D_MATRIX_4',
  'FRAME_E_DOSSIER_STACK',
]

// ─────────────────────────────────────────────────────────────────────────────
// 3. 결정론적 시드 해시 & 셔플러 (Deterministic Seed Shuffler)
// ─────────────────────────────────────────────────────────────────────────────

export function getSeedHashNumber(seedStr: string = ''): number {
  const target = seedStr && seedStr.trim() !== '' ? seedStr.trim() : 'postsynk_default_seed'
  let h = 2166136261
  for (let i = 0; i < target.length; i++) {
    h ^= target.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h >>> 0)
}

export function getSeedDeterministicIndex(seed: string, max: number, salt: string = ''): number {
  if (max <= 0) return 0
  return getSeedHashNumber(`${seed}_${salt}`) % max
}

export function shuffleArrayDeterministic<T>(array: T[], seed: string): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSeedDeterministicIndex(seed, i + 1, `shuffle_${i}`)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

export function hashUserIdToBrandKit(userId: string = '', seed: string = '') {
  const baseSeed = seed || userId || 'postsynk_default_seed'
  const posHash = getSeedHashNumber(baseSeed)

  const themeIndex = posHash % palettes.length
  const thumbIndex = Math.floor(posHash / palettes.length) % thumbLayoutTypes.length
  const bannerIndex = Math.floor(posHash / (palettes.length * thumbLayoutTypes.length)) % bannerLayoutTypes.length
  const frameIndex = Math.floor(posHash / (palettes.length * thumbLayoutTypes.length * bannerLayoutTypes.length)) % bentoFrameLayouts.length

  return {
    theme: palettes[themeIndex],
    themeIndex,
    thumbLayout: thumbLayoutTypes[thumbIndex],
    bannerLayout: bannerLayoutTypes[bannerIndex],
    frameLayout: bentoFrameLayouts[frameIndex],
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. 디자인 중앙 통제실 (CARD_CONFIG)
// ─────────────────────────────────────────────────────────────────────────────

export const CARD_CONFIG = {
  base: {
    canvas: { width: 1080, height: 1080 },
    safeZone: {
      paddingDefault: '44px 48px',
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif",
      letterSpacing: '-0.03em',
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
// 5. 텍스트 정제 및 1.5배 동적 폰트 스케일러 (Satori Safe-Guards)
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

export function cleanItemText(raw: string): string {
  return sanitizeText(cleanSummaryText(raw))
}

export function getDynamicFontSize(text: string, defaultSize: number, minSize: number = 24, maxLen: number = 18): number {
  if (!text) return defaultSize
  if (text.length <= maxLen) return defaultSize
  const diff = text.length - maxLen
  const calculated = defaultSize - Math.floor(diff * 0.75)
  return Math.max(minSize, calculated)
}

/**
 * 띄어쓰기(어절) 및 쉼표 단위로 단어 쪼개짐 없이 균형 있는 1~2줄로 스마트 분할
 */
export function splitBalancedLines(text: string, maxPerLine: number = 18): string[] {
  if (!text) return ['']
  const clean = text.trim()
  if (clean.length <= maxPerLine) return [clean]

  // 1. 쉼표(,)나 마침표(.) 등 주요 문맥 구분자 지점 우선 분할
  if (clean.includes(',')) {
    const commaIdx = clean.indexOf(',')
    if (commaIdx >= 5 && commaIdx <= clean.length - 5) {
      const line1 = clean.substring(0, commaIdx + 1).trim()
      const line2 = clean.substring(commaIdx + 1).trim()
      if (line1 && line2) return [line1, line2]
    }
  }

  // 2. 어절(띄어쓰기) 단위 균형 분할 (가장 가운데 지점의 공백 찾기)
  const words = clean.split(/\s+/)
  if (words.length <= 1) return [clean]

  const midPoint = Math.floor(clean.length / 2)
  let bestIdx = 1
  let minDiff = Infinity
  let currentLen = 0

  for (let i = 0; i < words.length - 1; i++) {
    currentLen += words[i].length + (i > 0 ? 1 : 0)
    const diff = Math.abs(currentLen - midPoint)
    if (diff < minDiff) {
      minDiff = diff
      bestIdx = i + 1
    }
  }

  const line1 = words.slice(0, bestIdx).join(' ')
  const line2 = words.slice(bestIdx).join(' ')
  return [line1, line2]
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. 공통 래퍼 & 헤더 & 푸터 컴포넌트 (1.5x 대형 타이포)
// ─────────────────────────────────────────────────────────────────────────────

interface BentoContainerProps {
  palette: Palette
  children: React.ReactNode
  bgOverride?: string
  seed?: string
}

function BentoContainer({ palette, children, bgOverride, seed }: BentoContainerProps) {
  const seedNum = getSeedHashNumber(seed || 'postsynk_bento_seed')
  const dynamicRadius = `${24 + (seedNum % 10)}px`
  const gradX = seedNum % 100
  const gradY = (seedNum >> 2) % 100

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '1080px',
        backgroundColor: bgOverride || palette.bg,
        backgroundImage: `radial-gradient(circle at ${gradX}% ${gradY}%, rgba(255, 255, 255, 0.08), transparent)`,
        border: `1.5px solid ${palette.border}`,
        borderRadius: dynamicRadius,
        padding: CARD_CONFIG.base.safeZone.paddingDefault,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'keep-all',
        whiteSpace: 'pre-wrap',
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
  const titleSize = getDynamicFontSize(title, 50, 36, 18)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `2.5px solid ${palette.border}`,
        paddingBottom: '16px',
        boxSizing: 'border-box',
        height: '84px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '740px' }}>
        <div style={{ display: 'flex', fontSize: '48px' }}>{icon}</div>
        <div style={{ display: 'flex', fontSize: `${titleSize}px`, fontWeight: 'bold', color: palette.text, lineHeight: '1.2' }}>
          {title}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          backgroundColor: palette.badgeBg,
          color: palette.badgeText,
          padding: '10px 22px',
          borderRadius: CARD_CONFIG.base.borderRadius.badge,
          fontSize: '28px',
          fontWeight: 'bold',
          whiteSpace: 'nowrap',
        }}
      >
        {category || badgeText}
      </div>
    </div>
  )
}

function BentoFooterTip({ palette, tipText }: { palette: Palette; tipText: string }) {
  const tipSize = getDynamicFontSize(tipText, 32, 26, 42)
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: palette.highlightBg,
        border: `1.5px solid ${palette.border}`,
        borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
        padding: '14px 22px',
        gap: '14px',
        boxSizing: 'border-box',
        height: '64px',
      }}
    >
      <div style={{ display: 'flex', fontSize: '32px' }}>💡</div>
      <div style={{ display: 'flex', fontSize: `${tipSize}px`, fontWeight: 'bold', color: palette.text, wordBreak: 'keep-all' }}>
        {tipText}
      </div>
    </div>
  )
}

export interface TemplateProps {
  data: InfographicData
  palette: Palette
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. 정예 8종 기반 100% 반응형 벤토 카드 템플릿 컴포넌트
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 2. 📊 위기 징후 자가진단표 (SELF_DIAGNOSIS)
 * 색상: 소프트 아이스 슬레이트 + 1.5x 대형 타이포
 */
export function SelfDiagnosisTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '내 사건 위험도 자가진단 체크리스트')
  const defaultQuestions = [
    '최근 3개월 이내 관련 기관으로부터 사전 통지나 출석 요구를 받았다',
    '필수 적격증빙이나 객관적 계약서/입증 자료가 일부 누락되어 있다',
    '법정 신청 기한이 1개월 이내로 임박하여 빠른 조치가 시급하다',
    '유사한 사안으로 과거 불이익 처분을 받았거나 과태료 이력이 있다',
  ]

  const rawPoints = data.points && data.points.length > 0 ? data.points : defaultQuestions
  const filledPoints = [...rawPoints]
  while (filledPoints.length < 4) {
    filledPoints.push(defaultQuestions[filledPoints.length % defaultQuestions.length])
  }
  const questions = filledPoints.slice(0, 4)

  const seed = data.seed || title || data.userId || 'self_diag_seed'
  // extra1이 ASYMMETRIC이면 B형 강제, WIDE면 A형 강제, 그 외에는 결정론적 시드 해시로 자동 50:50 교차 배정
  const isAsymmetric = data.extra1 === 'ASYMMETRIC' || (data.extra1 !== 'WIDE' && getSeedDeterministicIndex(seed, 2, 'diag_variant') === 1)

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="📊" title={title} badgeText="자가진단 레이더" category={data.category} />

      {isAsymmetric ? (
        /* ──────── [타입 B: 좌우 3:7 비대칭 기둥형 벤토] ──────── */
        <div style={{ display: 'flex', gap: '18px', height: '716px', width: '100%' }}>
          {/* 좌측 1/3 기둥 타일 (위험도 판정 센터) */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '320px',
              height: '100%',
              backgroundColor: '#F8FAFC',
              border: `2.5px solid ${palette.accent}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '30px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', fontSize: '26px', color: palette.accent, fontWeight: 'bold' }}>📡 레이더 진단 기준</div>
              <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, fontWeight: 'bold' }}>위험도 단계 판정</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', fontSize: '70px', fontWeight: '900', color: palette.accent, lineHeight: '1' }}>2개+</div>
              <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: palette.text, lineHeight: '1.3' }}>
                해당 시 즉시<br />‘경고’ 단계
              </div>
              <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, fontWeight: 'bold', borderTop: `1.5px solid ${palette.border}`, paddingTop: '10px' }}>
                * 단독 소명 시 위험 급증
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: palette.badgeBg,
                border: `1.5px solid ${palette.border}`,
                borderRadius: '14px',
                padding: '14px 10px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: palette.badgeText,
              }}
            >
              🛡️ 1:1 비밀 보장 진단
            </div>
          </div>

          {/* 우측 2/3 영역: 4개 체크리스트 카드 수직 정렬 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1, height: '100%' }}>
            {questions.map((q, idx) => {
              const clean = cleanItemText(q)
              const lines = splitBalancedLines(clean, 16)
              const fontSize = lines.length > 1 ? 28 : 34

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFFFFF',
                    border: `2px solid ${palette.border}`,
                    borderRadius: '18px',
                    padding: '16px 20px',
                    boxSizing: 'border-box',
                    height: '166px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '520px', flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        backgroundColor: palette.accent,
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '26px',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        lineHeight: '1',
                      }}
                    >
                      Q{idx + 1}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                      {lines.map((l, lIdx) => (
                        <div key={lIdx} style={{ display: 'flex', fontSize: `${fontSize}px`, fontWeight: 'bold', color: palette.text, lineHeight: '1.25', wordBreak: 'keep-all' }}>
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', fontSize: '32px', flexShrink: 0 }}>☑️</div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        /* ──────── [타입 A: 상하 와이드 도감형 벤토] ──────── */
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '716px', width: '100%' }}>
          {/* 상단 100% 와이드 판정 배너 */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: palette.highlightBg,
              border: `2.5px solid ${palette.border}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '20px 28px',
              boxSizing: 'border-box',
              height: '138px',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'flex', fontSize: '26px', color: palette.accent, fontWeight: 'bold' }}>
                📡 자가진단 위험도 판정 기준
              </div>
              <div style={{ display: 'flex', fontSize: '36px', fontWeight: 'bold', color: palette.text, lineHeight: '1.2' }}>
                4개 문항 중 2개 이상 해당 시 ‘정밀 검토’ 단계
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                backgroundColor: palette.badgeBg,
                border: `1.5px solid ${palette.border}`,
                padding: '12px 22px',
                borderRadius: '18px',
              }}
            >
              <div style={{ display: 'flex', fontSize: '42px' }}>⚠️</div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', fontSize: '36px', fontWeight: '900', color: palette.accent, lineHeight: '1' }}>2개+</div>
                <div style={{ display: 'flex', fontSize: '22px', color: palette.badgeText, fontWeight: 'bold', marginTop: '2px' }}>경고 판정</div>
              </div>
            </div>
          </div>

          {/* 하단 전폭 4단 체크리스트 스택 */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '562px', width: '100%' }}>
            {questions.map((q, idx) => {
              const clean = cleanItemText(q)
              const lines = splitBalancedLines(clean, 24)
              const fontSize = lines.length > 1 ? 30 : 36

              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#FFFFFF',
                    border: `2px solid ${palette.border}`,
                    borderRadius: '18px',
                    padding: '14px 24px',
                    boxSizing: 'border-box',
                    height: '128px',
                    width: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', maxWidth: '820px', flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        backgroundColor: palette.accent,
                        color: '#FFFFFF',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        fontSize: '26px',
                        fontWeight: 'bold',
                        flexShrink: 0,
                        lineHeight: '1',
                      }}
                    >
                      Q{idx + 1}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                      {lines.map((l, lIdx) => (
                        <div key={lIdx} style={{ display: 'flex', fontSize: `${fontSize}px`, fontWeight: 'bold', color: palette.text, lineHeight: '1.25', wordBreak: 'keep-all' }}>
                          {l}
                        </div>
                      ))}
                    </div>
                  </div>


                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: palette.highlightBg,
                      border: `1.5px solid ${palette.border}`,
                      padding: '8px 16px',
                      borderRadius: '12px',
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: palette.sub,
                      flexShrink: 0,
                    }}
                  >
                    <span>☑️</span>
                    <span>점검</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <BentoFooterTip palette={palette} tipText="전문가 실무 팁: 자가진단 2개 이상 해당 시, 초기 진술서 작성 전 1:1 법리 점검을 권장합니다." />
    </BentoContainer>
  )
}

/**
 * 3. 🆚 나홀로 vs 전문가 시뮬레이션 (VS_SIMULATION)
 * 색상: 소프트 민트/로즈 대비 + 1.5x 대형 타이포
 */
export function VsSimulationTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '혼자 진행했을 때 vs 공인 자격사 선임 결과 비교')
  const extra1Text = sanitizeText(data.extra1 || '혼자 대처 시: 구제율 20%')
  const extra2Text = sanitizeText(data.extra2 || '전문가 선임 시: 구제율 95%')

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="🆚" title={title} badgeText="실익 & ROI 비교" category={data.category} />

      <div style={{ display: 'flex', gap: '20px', height: '716px', width: '100%' }}>
        {/* 좌측 나홀로 타일 */}
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
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#BE123C',
                color: '#FFFFFF',
                padding: '8px 16px',
                borderRadius: '10px',
                fontSize: '26px',
                fontWeight: 'bold',
                alignSelf: 'flex-start',
              }}
            >
              ❌ 나홀로 대처
            </div>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', color: '#881337', lineHeight: '1.2' }}>
              {extra1Text}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '30px', color: '#4C0519', fontWeight: 'bold' }}>
            <div style={{ display: 'flex' }}>• 불리한 진술 및 입증 실패</div>
            <div style={{ display: 'flex' }}>• 과다 세액 및 가산세 부과</div>
            <div style={{ display: 'flex' }}>• 사후 구제 기회 영구 상실</div>
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: '#FFE4E6',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#881337',
              justifyContent: 'center',
            }}
          >
            ⚠️ 실질 손실 및 패소 위험
          </div>
        </div>

        {/* 우측 전문가 타일 (소프트 틸 그린) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#F0FDFA',
            border: '2.5px solid #99F6E4',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '36px 30px',
            boxSizing: 'border-box',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#0D9488',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '26px',
                  fontWeight: 'bold',
                }}
              >
                ✅ 공인 자격사 선임
              </div>
              <div style={{ display: 'flex', fontSize: '24px', color: '#0F766E', fontWeight: 'bold' }}>압도적 실익</div>
            </div>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', color: '#134E4A', lineHeight: '1.2' }}>
              {extra2Text}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', fontSize: '30px', color: '#115E59', fontWeight: 'bold' }}>
            <div style={{ display: 'flex' }}>🛡️ 1:1 맞춤 법리 & 증빙 선제 검증</div>
            <div style={{ display: 'flex' }}>💰 합법적 공제 최대화 & 세액 방어</div>
            <div style={{ display: 'flex' }}>⏱️ 전담 대리인 입회로 심리적 안정</div>
          </div>

          <div
            style={{
              display: 'flex',
              backgroundColor: '#CCFBF1',
              color: '#0F766E',
              borderRadius: '14px',
              padding: '16px',
              fontSize: '26px',
              fontWeight: 'bold',
              justifyContent: 'center',
            }}
          >
            🏆 권리 구제 & 절세 극대화
          </div>
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="ROI 분석: 전문가 수임료 대비 절감되는 세액과 가산세 방어 효과가 압도적으로 큽니다." />
    </BentoContainer>
  )
}

/**
 * 4. 📉 손실 스노우볼 (COST_OF_INACTION)
 * 색상: 소프트 크림슨 톤다운 + 1.5x 대형 타이포
 */
export function CostOfInactionTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '방치할수록 눈덩이처럼 불어나는 손실 스노우볼')

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="📉" title={title} badgeText="손실 스노우볼" category={data.category} />

      <div style={{ display: 'flex', gap: '16px', height: '716px', width: '100%' }}>
        {/* 1단계 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#F8FAFC',
            border: '2.5px solid #CBD5E1',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 24px',
            boxSizing: 'border-box',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: '#64748B' }}>1단계 (골든타임)</div>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', color: '#1E293B' }}>초기 대응</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '56px' }}>🟢</div>
            <div style={{ display: 'flex', fontSize: '36px', fontWeight: 'bold', color: '#1E293B' }}>원금 상태</div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#64748B', textAlign: 'center', fontWeight: 'bold' }}>소명 기회 100% 잔여</div>
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: '#334155', lineHeight: '1.3', fontWeight: 'bold' }}>
            선제적 조치 시 가산세 0원 및 원만한 종결 가능
          </div>
        </div>

        {/* 2단계 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#FFF7ED',
            border: '2.5px solid #FDBA74',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 24px',
            boxSizing: 'border-box',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: '#C2410C' }}>2단계 (위험 진입)</div>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', color: '#9A3412' }}>1개월 경과</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '56px' }}>🟠</div>
            <div style={{ display: 'flex', fontSize: '36px', fontWeight: 'bold', color: '#C2410C' }}>+10~20% 가산</div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#9A3412', textAlign: 'center', fontWeight: 'bold' }}>납부지연이자 매일 가산</div>
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: '#7C2D12', lineHeight: '1.3', fontWeight: 'bold' }}>
            입증 서류 확보 난항 및 과태료/처분 고지 단계
          </div>
        </div>

        {/* 3단계 (소프트 로즈 톤다운) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: '#FFF1F2',
            border: '2.5px solid #FDA4AF',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 24px',
            boxSizing: 'border-box',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: '#E11D48' }}>3단계 (폭탄 단계)</div>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', color: '#881337' }}>1년 이상 방치</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', fontSize: '56px' }}>🔴</div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: '#BE123C' }}>최대 40% 폭탄</div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#9F1239', textAlign: 'center', fontWeight: 'bold' }}>행정처분/강제집행</div>
          </div>
          <div style={{ display: 'flex', fontSize: '26px', color: '#881337', lineHeight: '1.3', fontWeight: 'bold' }}>
            소명 기회 완전 소멸 및 법적 구제 불가
          </div>
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="시간 압박: 미루는 하루마다 불이익이 눈덩이처럼 커집니다. 지금 즉시 대처하세요." />
    </BentoContainer>
  )
}

/**
 * 5. ⏳ D-Day 타임라인 / 로드맵 (ACTION_TIMELINE)
 * 색상: 소프트 슬레이트 + 1.5x 대형 타이포
 */
export function ActionTimelineTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '사건 발생부터 최종 종결까지 D-Day 타임라인')
  const rawSteps = data.points && data.points.length >= 3
    ? data.points
    : [
        '초기 대응 (골든타임): 사실관계 확정 및 증빙 선제 확보',
        '심사 및 소명 (D-30): 법리 검토 및 1:1 맞춤 소명서 제출',
        '최종 권리 구제 (D-Day): 처분 취소 및 세액 감면 확정',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="⏳" title={title} badgeText="D-DAY 로드맵" category={data.category} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '716px', justifyContent: 'space-between' }}>
        {/* 상단 소프트 배너 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            border: `2.5px solid ${palette.accent}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '24px 32px',
            boxSizing: 'border-box',
            height: '175px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '26px', color: palette.accent, fontWeight: 'bold' }}>⏱️ 골든타임 로드맵</div>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', color: palette.text }}>단계별 기한 엄수 · 신속한 권리 구제</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', backgroundColor: palette.highlightBg, border: `1.5px solid ${palette.border}`, padding: '14px 26px', borderRadius: '18px' }}>
            <div style={{ display: 'flex', fontSize: '56px', fontWeight: 'bold', color: palette.accent }}>D-30</div>
            <div style={{ display: 'flex', fontSize: '22px', color: palette.sub, fontWeight: 'bold' }}>통지서 수령 즉시</div>
          </div>
        </div>

        {/* 하단 3단 가로 로드맵 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '525px', justifyContent: 'space-between' }}>
          {rawSteps.slice(0, 3).map((st, idx) => {
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
                  border: `2.5px solid ${idx === 2 ? palette.accent : palette.border}`,
                  borderRadius: '18px',
                  padding: '20px 28px',
                  boxSizing: 'border-box',
                  width: '100%',
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
                      fontSize: '26px',
                      fontWeight: 'bold',
                    }}
                  >
                    STEP 0{idx + 1}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: palette.text }}>{stepTitle}</div>
                    <div style={{ display: 'flex', fontSize: '26px', color: palette.sub, fontWeight: 'bold' }}>{stepDesc}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', fontSize: '34px' }}>{idx === 2 ? '🏆' : '➡️'}</div>
              </div>
            )
          })}
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="전 과정 공인 자격사 1:1 직접 입회 및 신속한 권리 구제 확정" />
    </BentoContainer>
  )
}

/**
 * 6. 📑 필수 준비 서류함 (REQUIRED_DOSSIER)
 * 색상: 마닐라 서류철 + 1.5x 대형 타이포
 */
export function RequiredDossierTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '상담 전 준비해야 할 필수 구비 서류함')
  const rawPoints = data.points && data.points.length > 0
    ? data.points
    : [
        '신분증 및 가족관계증명서 (상세) [정부24 발급]',
        '최근 3개년 소득금액증명원 및 원천징수영수증 [홈택스]',
        '사건 관련 처분 통지서 및 계약서 원본 [보유 서류]',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="📑" title={title} badgeText="필수 서류 도감" category={data.category} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '716px', justifyContent: 'space-between' }}>
        {/* 마닐라 서류철 폴더 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FAF5EE',
            border: '2.5px solid #D8C3A5',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '30px 28px',
            boxSizing: 'border-box',
            height: '520px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div
              style={{
                display: 'flex',
                backgroundColor: '#E8D5B5',
                color: '#5C4033',
                padding: '8px 18px',
                borderRadius: '10px',
                fontSize: '26px',
                fontWeight: 'bold',
              }}
            >
              📁 DOSSIER FILE · NO. 2026-A
            </div>
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: '#8C6D46' }}>
              발급일 3개월 이내 원본 지참
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {rawPoints.slice(0, 3).map((pt, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backgroundColor: '#FFFFFF',
                  border: '2px solid #E4D4C0',
                  borderRadius: '14px',
                  padding: '16px 20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: '#C19A6B',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                  }}
                >
                  DOC 0{idx + 1}
                </div>
                <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#3E2723', flex: 1 }}>
                  {cleanItemText(pt)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', fontSize: '24px', color: '#6D4C41', fontWeight: 'bold' }}>
            * 서류 분실 시 전문가와 상의하여 대체 증빙을 준비할 수 있습니다.
          </div>
        </div>

        {/* 하단 2단 분할 */}
        <div style={{ display: 'flex', gap: '16px', height: '180px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flex: 1,
              backgroundColor: '#F8FAFC',
              border: `2px solid ${palette.border}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '20px 24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '48px' }}>📸</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text }}>사진 캡처 보관</div>
              <div style={{ display: 'flex', fontSize: '22px', color: palette.sub }}>상담 전 서류를 미리 지참하세요</div>
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
            <div style={{ display: 'flex', fontSize: '48px' }}>⚡</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.accent }}>빠른 온라인 발급</div>
              <div style={{ display: 'flex', fontSize: '22px', color: palette.sub }}>정부24 · 홈택스 10분 즉시 발급</div>
            </div>
          </div>
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="실무 팁: 서류 발급이 어렵거나 분실된 경우, 전문가와 상의하여 대체 증빙을 발급받을 수 있습니다." />
    </BentoContainer>
  )
}

/**
 * 7. ⚖️ 처벌/과세 기준표 (CRITERIA_TABLE)
 * 색상: 소프트 레드 톤다운 + 1.5x 대형 타이포
 */
export function CriteriaTableTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '법정 처벌 수위 및 과세 기준표')
  const rawPoints = data.points && data.points.length > 0
    ? data.points
    : [
        '1구간 (기본 기준): 1년 이하 징역 또는 500만원 이하 벌금 (기본세율 적용)',
        '2구간 (가중 기준): 2년 이상 5년 이하 징역 (누진세율 40% 적용)',
        '3구간 (중과 기준): 면허 취소 및 징역형 가중 처벌 (가산세 최고 40% 부과)',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="⚖️" title={title} badgeText="법정 기준표" category={data.category} />

      <div style={{ display: 'flex', gap: '20px', height: '716px', width: '100%' }}>
        {/* 좌측 공문서 기준표 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 2,
            backgroundColor: palette.cardBg,
            border: `2.5px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 26px',
            boxSizing: 'border-box',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: palette.text }}>
              📜 관련 법령상 적용 구간 및 처벌 수위
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, fontWeight: 'bold' }}>
              공문서 표준 서식
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {rawPoints.slice(0, 3).map((pt, idx) => {
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
                    padding: '18px 20px',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: idx === 2 ? '#DC2626' : palette.accent }}>
                    {segTitle}
                  </div>
                  {segDetail && (
                    <div style={{ display: 'flex', fontSize: '30px', fontWeight: 'bold', color: palette.text, lineHeight: '1.3' }}>
                      {segDetail}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', fontSize: '24px', color: palette.sub }}>
            * 개별 사건의 정황 및 전과 여부에 따라 감경 요건을 적극 소명해야 합니다.
          </div>
        </div>

        {/* 우측 2단 스택 (소프트 레드 톤다운) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, height: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1.2,
              backgroundColor: '#FEF2F2',
              border: '2.5px solid #FECACA',
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px 20px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', fontSize: '26px', color: '#991B1B', fontWeight: 'bold' }}>법정 최고 수위</div>
            <div style={{ display: 'flex', fontSize: '84px', fontWeight: 'bold', color: '#DC2626', lineHeight: '1' }}>40%</div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#B91C1C', fontWeight: 'bold' }}>부당 무신고 가산세</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              backgroundColor: palette.highlightBg,
              border: `2.5px solid ${palette.accent}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px 20px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.accent }}>⚖️ 감경 요건 입증</div>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, lineHeight: '1.3' }}>
              정당한 사유 및 고의성 부존재 소명 시 감면 가능
            </div>
          </div>
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="법적 근거: 관련 법률 제00조 및 대법원 최신 양형/판례 기준 적용" />
    </BentoContainer>
  )
}

/**
 * 8. 🏆 실제 성공 사례 요약 (SUCCESS_RECEIPT)
 * 색상: 소프트 에메랄드 톤다운 + 1.5x 대형 타이포
 */
export function SuccessReceiptTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '실제 권리 구제 및 절세 성공 사례 요약')
  const beforeText = sanitizeText(data.extra1 || '세금 5억 원 과세 예고 통지')
  const afterText = sanitizeText(data.extra2 || '0원 전액 취소 및 승소 종결')

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="🏆" title={title} badgeText="성공 영수증" category={data.category} />

      <div style={{ display: 'flex', gap: '20px', height: '716px', width: '100%' }}>
        {/* 좌측 영수증 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1.6,
            backgroundColor: '#FFFFFF',
            border: '2.5px dashed #94A3B8',
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '32px 26px',
            boxSizing: 'border-box',
            height: '100%',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2.5px solid #E2E8F0', paddingBottom: '14px' }}>
            <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: '#1E293B' }}>🧾 SUCCESS RECEIPT</div>
            <div style={{ display: 'flex', fontSize: '24px', color: '#64748B', fontWeight: 'bold' }}>공인 자격사 직접 수행</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#FFF1F2',
                border: '1.5px solid #FECDD3',
                borderRadius: '14px',
                padding: '18px 20px',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', fontSize: '22px', color: '#BE123C', fontWeight: 'bold' }}>BEFORE (당초 처분)</div>
              <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: '#881337' }}>{beforeText}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', fontSize: '32px' }}>⬇️</div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#F0FDF4',
                border: '2.5px solid #86EFAC',
                borderRadius: '14px',
                padding: '18px 20px',
                gap: '4px',
              }}
            >
              <div style={{ display: 'flex', fontSize: '22px', color: '#15803D', fontWeight: 'bold' }}>AFTER (최종 결정)</div>
              <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: '#166534' }}>{afterText}</div>
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: '22px', color: '#94A3B8', borderTop: '2px dashed #CBD5E1', paddingTop: '14px' }}>
            * 구체적 사안에 따라 결과가 다를 수 있으며 맞춤 법리 검토가 필수입니다.
          </div>
        </div>

        {/* 우측 승소율 배지 (소프트 에메랄드 톤다운) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1.2, height: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1.2,
              backgroundColor: '#F0FDF4',
              border: '2.5px solid #86EFAC',
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '26px 20px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', fontSize: '26px', color: '#15803D', fontWeight: 'bold' }}>직접 수행 승소율</div>
            <div style={{ display: 'flex', fontSize: '84px', fontWeight: 'bold', color: '#16A34A', lineHeight: '1' }}>98%</div>
            <div style={{ display: 'flex', fontSize: '22px', color: '#166534', fontWeight: 'bold' }}>철저한 사실관계 소명</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              backgroundColor: palette.highlightBg,
              border: `2.5px solid ${palette.accent}`,
              borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
              padding: '24px 20px',
              boxSizing: 'border-box',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.accent }}>⚖️ 권리 구제 포인트</div>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, lineHeight: '1.3' }}>
              사전 증빙 확보를 통해 불리한 처분을 완전히 취소시켰습니다.
            </div>
          </div>
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="성공 비결: 초기 골든타임 내에 전담 자격사가 객관적 증빙을 체계적으로 제출했습니다." />
    </BentoContainer>
  )
}

/**
 * 9. 💬 전문가 소견서 및 팩트체크 (EXPERT_OPINION)
 * 색상: 미색 줄노트 + 1.5x 대형 타이포 & 직인 도장
 */
export function ExpertOpinionTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '공인 자격사 종합 소견서 및 팩트체크')
  const rawPoints = data.points && data.points.length > 0
    ? data.points
    : [
        '인터넷의 단순 정보만 믿고 대응하다가는 불리한 진술이 될 수 있습니다.',
        '적격증빙과 법정 요건을 선제 검증하면 합법적 권리 구제가 가능합니다.',
        '사안별로 적용 법리가 다르므로 반드시 전문가 1:1 진단을 권장합니다.',
      ]

  return (
    <BentoContainer palette={palette}>
      <BentoHeader palette={palette} icon="💬" title={title} badgeText="전문가 소견" category={data.category} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#FCFBF9',
          border: `2.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '36px 32px',
          boxSizing: 'border-box',
          height: '716px',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `2.5px solid ${palette.border}`, paddingBottom: '16px' }}>
          <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: palette.text }}>
            📜 전문 자격사 공식 실무 의견
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: palette.accent, fontWeight: 'bold' }}>
            2026 POSTSYNK VERIFIED
          </div>
        </div>

        {/* 3줄 코멘트 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {rawPoints.slice(0, 3).map((pt, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '16px',
                borderBottom: '1.5px dashed #E2E8F0',
                paddingBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', fontSize: '30px', color: palette.accent, fontWeight: 'bold' }}>0{idx + 1}.</div>
              <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#334155', lineHeight: '1.35', flex: 1 }}>
                {cleanItemText(pt)}
              </div>
            </div>
          ))}
        </div>

        {/* 하단 직인 도장 & 서명 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `2px solid ${palette.border}`, paddingTop: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '30px', fontWeight: 'bold', color: palette.text }}>공인 자격사 실무 전담팀</div>
            <div style={{ display: 'flex', fontSize: '22px', color: palette.sub, fontWeight: 'bold' }}>사안별 1:1 비밀 보장 정밀 검토</div>
          </div>
          {/* 인라인 직인 도장 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '135px',
              height: '135px',
              borderRadius: '50%',
              border: '3.5px solid #BE123C',
              color: '#BE123C',
              transform: 'rotate(-8deg)',
              backgroundColor: 'rgba(254, 226, 226, 0.45)',
              boxSizing: 'border-box',
              padding: '6px',
              textAlign: 'center',
            }}
          >
            <div style={{ display: 'flex', fontSize: '11px', fontWeight: 'bold' }}>★ VERIFIED ★</div>
            <div style={{ display: 'flex', fontSize: '18px', fontWeight: 'bold', margin: '3px 0' }}>공인검토필</div>
            <div style={{ display: 'flex', fontSize: '11px', borderTop: '1px solid #BE123C', paddingTop: '2px' }}>POSTSYNK</div>
          </div>
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="개별 사안의 특수성에 따라 최적의 대응 전략이 달라지므로 사전 검토가 필수입니다." />
    </BentoContainer>
  )
}



// ─────────────────────────────────────────────────────────────────────────────
// 8. [2026 방향 A] 전문직 특화 정예 8종 벤토 카드 템플릿
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 1. 🚨 위기 경고 체크리스트 (CRITICAL_CHECKLIST)
 * 기존 RED_FLAGS + SELF_DIAGNOSIS 통합 발전
 */
export const CriticalChecklistTemplate = SelfDiagnosisTemplate

/**
 * 2. 🆚 비포/애프터 실익 대비표 (ROI_COMPARISON)
 * 기존 VS_SIMULATION + SUCCESS_RECEIPT 통합 발전
 * 글 제목(시드)에 따라 50:50 듀얼 대비형과 성공 영수증 티켓형이 자율 교차 생성
 */
export function RoiComparisonTemplate({ data, palette }: TemplateProps) {
  const seed = data.seed || data.title || data.userId || 'roi_comparison_seed'
  const isReceipt = data.extra3 === 'RECEIPT' || (data.extra3 !== 'DUAL' && getSeedDeterministicIndex(seed, 2, 'roi_variant') === 1)

  if (isReceipt) {
    return <SuccessReceiptTemplate data={data} palette={palette} />
  }
  return <VsSimulationTemplate data={data} palette={palette} />
}

/**
 * 3. 📉 골든타임 손실 게이지 (LOSS_GAUGE)
 * 기존 COST_OF_INACTION 계승 발전
 */
export const LossGaugeTemplate = CostOfInactionTemplate

/**
 * 4. ⏳ 사건 해결 3단계 로드맵 (PROCESS_ROADMAP)
 * 기존 ACTION_TIMELINE 계승 발전
 */
export const ProcessRoadmapTemplate = ActionTimelineTemplate

/**
 * 5. 📑 필수 구비 서류함 도감 (DOSSIER_INDEX)
 * 기존 REQUIRED_DOSSIER 계승 발전
 */
export const DossierIndexTemplate = RequiredDossierTemplate

/**
 * 6. ⚖️ 법정 처벌/과세 기준표 (STATUTORY_CRITERIA)
 * 기존 CRITERIA_TABLE 계승 발전
 */
export const StatutoryCriteriaTemplate = CriteriaTableTemplate

/**
 * 7. 💬 빈출 Q&A 팩트체크 & 전문가 직인 (FACT_QNA)
 * 네이버 2026 스마트블록/AI브리핑 인용 최우선 킬러 카드
 */
export function FactQnaTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '의뢰인이 가장 많이 묻는 핵심 Q&A 팩트체크')
  const seed = data.seed || title || data.userId || 'fact_qna_seed'
  const isLinedNote = data.extra3 === 'NOTE' || (data.extra3 !== 'CARDS' && getSeedDeterministicIndex(seed, 2, 'qna_variant') === 1)

  if (isLinedNote) {
    return <ExpertOpinionTemplate data={data} palette={palette} />
  }

  const q1 = data.extra1 && data.extra1.includes('|')
    ? sanitizeText(data.extra1.split('|')[0])
    : '소명서나 진술서를 혼자 작성해서 제출해도 될까요?'
  const a1 = data.extra1 && data.extra1.includes('|')
    ? sanitizeText(data.extra1.split('|')[1])
    : '초기 진술은 사후 번복이 불가능하므로, 유리한 적격증빙을 선제 검증한 후 법리에 맞춰 제출해야 합니다.'

  const q2 = data.extra2 && data.extra2.includes('|')
    ? sanitizeText(data.extra2.split('|')[0])
    : '법정 불복 기한(골든타임)을 넘기면 어떻게 되나요?'
  const a2 = data.extra2 && data.extra2.includes('|')
    ? sanitizeText(data.extra2.split('|')[1])
    : '법정 기한이 도과하면 구제 기회가 영구 박탈되므로 통지서 수령 즉시 전담 자격사 검토를 권장합니다.'

  return (
    <BentoContainer palette={palette} seed={seed}>
      <BentoHeader palette={palette} icon="💬" title={title} badgeText="Q&A 팩트체크" category={data.category} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '716px', justifyContent: 'space-between' }}>
        {/* Q1 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            border: `2.5px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '24px 28px',
            boxSizing: 'border-box',
            height: '240px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', backgroundColor: '#BE123C', color: '#FFF', borderRadius: '10px', padding: '8px 16px', fontSize: '26px', fontWeight: 'bold' }}>
              Q1
            </div>
            <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: '#1E293B', lineHeight: '1.25' }}>
              {q1}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', backgroundColor: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '14px 18px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: '900', color: palette.accent }}>A.</div>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: '#334155', lineHeight: '1.28', flex: 1, wordBreak: 'keep-all' }}>
              {a1}
            </div>
          </div>
        </div>

        {/* Q2 카드 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            border: `2.5px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '24px 28px',
            boxSizing: 'border-box',
            height: '240px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', backgroundColor: palette.accent, color: '#FFF', borderRadius: '10px', padding: '8px 16px', fontSize: '26px', fontWeight: 'bold' }}>
              Q2
            </div>
            <div style={{ display: 'flex', fontSize: '34px', fontWeight: 'bold', color: '#1E293B', lineHeight: '1.25' }}>
              {q2}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', backgroundColor: palette.highlightBg, border: `1.5px solid ${palette.border}`, padding: '14px 18px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', fontSize: '28px', fontWeight: '900', color: palette.accent }}>A.</div>
            <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: palette.text, lineHeight: '1.28', flex: 1, wordBreak: 'keep-all' }}>
              {a2}
            </div>
          </div>
        </div>

        {/* 하단 보증 & 직인 날인 바 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#FCFAF6',
            border: `2px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileCard,
            padding: '16px 28px',
            height: '190px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '30px' }}>⚖️</span>
              <span style={{ fontSize: '32px', fontWeight: 'bold', color: palette.text }}>공인 자격사 직접 사실관계 검토 완료</span>
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, fontWeight: 'bold' }}>
              * 본 답변은 최신 법령 및 실무 심사 기준에 근거하여 작성되었습니다.
            </div>
          </div>

          {/* 붉은색 공식 인감 직인 도장 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              border: '3.5px solid #BE123C',
              color: '#BE123C',
              transform: 'rotate(-6deg)',
              backgroundColor: 'rgba(254, 226, 226, 0.4)',
              boxSizing: 'border-box',
              padding: '6px',
              textAlign: 'center',
              flexShrink: 0,
            }}
          >
            <div style={{ display: 'flex', fontSize: '11px', fontWeight: 'bold' }}>★ VERIFIED ★</div>
            <div style={{ display: 'flex', fontSize: '18px', fontWeight: 'bold', margin: '2px 0' }}>공인검토필</div>
            <div style={{ display: 'flex', fontSize: '11px', borderTop: '1px solid #BE123C', paddingTop: '2px' }}>POSTSYNK</div>
          </div>
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="전문가 실무 팁: 개별 사안에 따라 적용 법리가 달라지므로 사전 1:1 진단을 권장합니다." />
    </BentoContainer>
  )
}

/**
 * 8. 💡 3초 실무 요약 카드 (EXECUTIVE_SUMMARY)
 * 서론 직후 바쁜 현대인의 시선을 3초 만에 사로잡는 핵심 마이크로 요약 카드
 */
export function ExecutiveSummaryTemplate({ data, palette }: TemplateProps) {
  const title = sanitizeText(data.title || '핵심 쟁점 3초 실무 요약')
  const seed = data.seed || title || data.userId || 'exec_summary_seed'
  const rawPoints = data.points && data.points.length > 0
    ? data.points
    : [
        '사실관계 불일치 방지를 위한 객관적 적격증빙 선제 확보 필수',
        '사안별 맞춤 법리 구성을 통해 법정 불복 기한 내 정밀 소명',
        '유사 판례 및 행정심판 인용 사례를 적용한 합법적 최대 권리 구제',
      ]

  return (
    <BentoContainer palette={palette} seed={seed}>
      <BentoHeader palette={palette} icon="💡" title={title} badgeText="3초 핵심 요약" category={data.category} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '716px', justifyContent: 'space-between' }}>
        {/* 상단 100% 헤드라인 요약 배너 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: palette.highlightBg,
            border: `2.5px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
            padding: '20px 28px',
            boxSizing: 'border-box',
            height: '144px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '26px', color: palette.accent, fontWeight: 'bold' }}>
              📌 EXECUTIVE BRIEFING
            </div>
            <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: palette.text, lineHeight: '1.25' }}>
              놓치면 불이익이 발생하는 3대 핵심 쟁점
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: palette.badgeBg,
              border: `1.5px solid ${palette.border}`,
              padding: '12px 20px',
              borderRadius: '16px',
            }}
          >
            <span style={{ fontSize: '36px' }}>⚡</span>
            <span style={{ fontSize: '26px', fontWeight: 'bold', color: palette.badgeText }}>3초 완성</span>
          </div>
        </div>

        {/* 3대 핵심 요약 카드 스택 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, justifyContent: 'space-between' }}>
          {rawPoints.slice(0, 3).map((pt, idx) => {
            const clean = cleanItemText(pt)
            // 22자 이하이면 1줄로 시원하게 배치, 22자 초과 시에만 균형 2줄 분할
            const lines = clean.length <= 22 ? [clean] : splitBalancedLines(clean, 16)
            const fontSize = lines.length > 1 ? 38 : 44

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  border: `2px solid ${palette.border}`,
                  borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
                  padding: '16px 24px',
                  boxSizing: 'border-box',
                  height: '160px',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, maxWidth: '820px' }}>
                  <div
                    style={{
                      display: 'flex',
                      backgroundColor: palette.accent,
                      color: '#FFFFFF',
                      borderRadius: '12px',
                      padding: '10px 18px',
                      fontSize: '26px',
                      fontWeight: 'bold',
                      flexShrink: 0,
                    }}
                  >
                    POINT 0{idx + 1}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                    {lines.map((l, lIdx) => (
                      <div
                        key={lIdx}
                        style={{
                          display: 'flex',
                          fontSize: `${fontSize}px`,
                          fontWeight: 'bold',
                          color: palette.text,
                          lineHeight: '1.24',
                          wordBreak: 'keep-all',
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', fontSize: '36px', flexShrink: 0 }}>
                  {idx === 0 ? '🎯' : idx === 1 ? '⚖️' : '🏆'}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <BentoFooterTip palette={palette} tipText="공인 자격사 검증: 본 요약은 의뢰인의 골든타임 보존 및 권리 구제를 위해 작성되었습니다." />
    </BentoContainer>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. 최상단 썸네일 & 최하단 CTA 배너 (1.5x 대형 타이포)
// ─────────────────────────────────────────────────────────────────────────────

export function ThumbnailTemplate({
  data,
  palette,
  layout = 'THUMB_A',
  tags = ['핵심 쟁점 분석', '법적 기준 검토', '실무 대응 절차'],
}: TemplateProps & { layout?: ThumbLayout; tags?: string[] }) {
  const title = sanitizeText(data.title || '2026 핵심 실무 가이드')
  const sub = sanitizeText(data.subText || data.subtitle || '전문가가 직접 짚어드리는 실무 핵심 분석')
  const cat = sanitizeText(data.category || '전문가 실무 분석')
  const sig = sanitizeText(data.signature || 'PostSynk Verified Guide')

  const lines = splitBalancedLines(title, 16)
  const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), '')
  const titleSize = getDynamicFontSize(longestLine, 76, 52, 14)

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
        border: `2px solid ${palette.border}`,
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: '56px 52px',
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        textAlign: 'center',
      }}
    >
      {/* 상단 카테고리 뱃지 (중앙 정렬) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.badgeBg,
            color: palette.badgeText,
            padding: '12px 32px',
            borderRadius: CARD_CONFIG.base.borderRadius.pill,
            fontSize: '28px',
            fontWeight: 'bold',
          }}
        >
          {cat}
        </div>
      </div>

      {/* 중앙 메인 타이틀 & 서브카피 (단어 단위 스마트 2줄 분할) */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '22px', maxWidth: '940px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            width: '100%',
          }}
        >
          {lines.map((line, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                fontSize: `${titleSize}px`,
                fontWeight: 'bold',
                color: palette.text,
                lineHeight: '1.22',
                textAlign: 'center',
                wordBreak: 'keep-all',
              }}
            >
              {line}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', fontSize: '34px', color: palette.sub, lineHeight: '1.4', fontWeight: 'bold', textAlign: 'center', maxWidth: '840px', wordBreak: 'keep-all' }}>
          {sub}
        </div>

        {/* 3개 태그 바 (중앙 정렬) */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '12px' }}>
          {tags.slice(0, 3).map((tag, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                backgroundColor: palette.cardBg,
                border: `2px solid ${palette.border}`,
                color: palette.text,
                padding: '10px 22px',
                borderRadius: '12px',
                fontSize: '24px',
                fontWeight: 'bold',
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>

      {/* 하단 브랜드 서명 바 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          borderTop: `2.5px solid ${palette.border}`,
          paddingTop: '22px',
        }}
      >
        <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.accent }}>
          🏛️ {sig}
        </div>
        <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, fontWeight: 'bold' }}>
          1:1 맞춤 검토 · 비밀 보장
        </div>
      </div>
    </div>
  )
}

export function CtaBannerTemplate({
  data,
  palette,
  layout = 'BANNER_A',
}: TemplateProps & { layout?: BannerLayout }) {
  const officeName = sanitizeText(data.title || '공인 전문 자격사 사무소')
  const phone = sanitizeText(data.extra1 || '02-0000-0000')
  const address = sanitizeText(data.extra2 || '사무소 상세 주소')
  const sub = sanitizeText(data.subText || data.subtitle || '1:1 심층 상담 및 방문 예약 안내')

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '1080px',
        backgroundColor: palette.bg,
        border: `2px solid ${palette.border}`,
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: '52px 48px',
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
      }}
    >
      {/* 상단 히어로 */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: palette.cardBg,
          border: `2.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileHero,
          padding: '38px 34px',
          height: '420px',
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
              fontSize: '26px',
              fontWeight: 'bold',
            }}
          >
            🏛️ 공식 1:1 심층 상담 창구
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: palette.accent, fontWeight: 'bold' }}>
            1:1 사전 예약제
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', fontSize: '54px', fontWeight: 'bold', color: palette.text, lineHeight: '1.2' }}>
            {officeName}
          </div>
          <div style={{ display: 'flex', fontSize: '32px', color: palette.sub, lineHeight: '1.4', fontWeight: 'bold' }}>
            {sub}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: '22px', color: '#94A3B8', fontWeight: 'bold' }}>
          * 풍부한 실무 경험을 바탕으로 의뢰인의 권익을 최우선으로 보호합니다.
        </div>
      </div>

      {/* 중앙 2단 분할 타일 (전화 & 주소) */}
      <div style={{ display: 'flex', gap: '18px', height: '420px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: palette.highlightBg,
            border: `2.5px solid ${palette.accent}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileCard,
            padding: '34px 28px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '26px', fontWeight: 'bold', color: palette.accent }}>
            <span>📞</span>
            <span>직통 전화 상담</span>
          </div>
          <div style={{ display: 'flex', fontSize: '48px', fontWeight: 'bold', color: palette.text }}>
            {phone}
          </div>
          <div style={{ display: 'flex', fontSize: '22px', color: palette.sub, fontWeight: 'bold' }}>
            사전 예약 시 심층 상담 가능
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            flex: 1,
            backgroundColor: palette.cardBg,
            border: `2.5px solid ${palette.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.tileCard,
            padding: '34px 28px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '26px', fontWeight: 'bold', color: palette.sub }}>
            <span>🏢</span>
            <span>사무소 오시는 길</span>
          </div>
          <div style={{ display: 'flex', fontSize: '32px', fontWeight: 'bold', color: palette.text, lineHeight: '1.35' }}>
            {address}
          </div>
          <div style={{ display: 'flex', fontSize: '22px', color: '#94A3B8', fontWeight: 'bold' }}>
            방문 상담 시 사전 접수 필수
          </div>
        </div>
      </div>

      {/* 하단 보증 바 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: palette.highlightBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.tileInner,
          padding: '14px 20px',
          fontSize: '22px',
          fontWeight: 'bold',
          color: palette.text,
        }}
      >
        🔒 의뢰인의 비밀은 100% 철저히 보호되며, 예약 후 방문 시 대기 없이 심층 상담이 진행됩니다.
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. 메인 렌더링 스위치 (Single Entrypoint)
// ─────────────────────────────────────────────────────────────────────────────

export function generateProceduralImage(data: InfographicData): React.ReactElement {
  const brandKit = hashUserIdToBrandKit(data.userId || '', data.seed || data.title)

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

    // ─── [2026 방향 A: 정예 8종 벤토 카드 라인업] ───
    case 'CRITICAL_CHECKLIST':
    case 'RED_FLAGS':
    case 'SELF_DIAGNOSIS':
    case 'CHECKLIST':
    case 'WARNING_RISK':
      return <CriticalChecklistTemplate data={data} palette={palette} />

    case 'ROI_COMPARISON':
    case 'VS_SIMULATION':
    case 'SUCCESS_RECEIPT':
    case 'COMPARISON':
      return <RoiComparisonTemplate data={data} palette={palette} />

    case 'LOSS_GAUGE':
    case 'COST_OF_INACTION':
      return <LossGaugeTemplate data={data} palette={palette} />

    case 'PROCESS_ROADMAP':
    case 'ACTION_TIMELINE':
    case 'PROCESS_FLOW':
      return <ProcessRoadmapTemplate data={data} palette={palette} />

    case 'DOSSIER_INDEX':
    case 'REQUIRED_DOSSIER':
      return <DossierIndexTemplate data={data} palette={palette} />

    case 'STATUTORY_CRITERIA':
    case 'CRITERIA_TABLE':
    case 'STAT_HIGHLIGHT':
      return <StatutoryCriteriaTemplate data={data} palette={palette} />

    case 'FACT_QNA':
    case 'EXPERT_OPINION':
    case 'QNA':
      return <FactQnaTemplate data={data} palette={palette} />

    case 'EXECUTIVE_SUMMARY':
    case 'FINAL_VERDICT':
    case 'KEY_TAKEAWAYS':
      return <ExecutiveSummaryTemplate data={data} palette={palette} />

    default:
      return <ThumbnailTemplate data={data} palette={palette} layout={thumbLayout} tags={tags} />
  }
}

export function buildProceduralCardComponent(payload: CardPayload): React.ReactElement {
  return generateProceduralImage(payload)
}
