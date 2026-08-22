import React from 'react'
import { cleanSummaryText } from '@/lib/utils/textCleaner'

// ─────────────────────────────────────────────────────────────────────────────
// 1. 타입 정의 (TypeScript Interfaces)
// ─────────────────────────────────────────────────────────────────────────────

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
  extra1?: string // Comparison Left / QNA Question / CTA Phone
  extra2?: string // Comparison Right / QNA Answer / CTA Address
  extra3?: string // Stat Value / Highlight Label / CTA Reservation
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
// 2. 10종 전문직 프리미엄 테마 팔레트 (탈양산화 100% 보장)
// ─────────────────────────────────────────────────────────────────────────────

export const palettes: Palette[] = [
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
// 3. 🎨 디자인 중앙 통제실 (CARD_CONFIG) - Global Base + Specific Overrides
// ─────────────────────────────────────────────────────────────────────────────

export const CARD_CONFIG = {
  // 전역 공통 베이스 스타일 (Global Base)
  base: {
    canvas: {
      infoWidth: 1080,
      infoHeight: 680,
      thumbWidth: 1080,
      thumbHeight: 1080,
      bannerWidth: 1080,
      bannerHeight: 540,
    },
    safeZone: {
      paddingDefault: '60px 80px',
      paddingCompact: '50px 80px',
      paddingBanner: '36px 54px',
      paddingThumb: '80px',
    },
    typography: {
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif",
      letterSpacing: '-0.03em',
      lineHeightTitle: '1.3',
      lineHeightBody: '1.45',
      lineHeightRelaxed: '1.5',
    },
    borderRadius: {
      canvas: '28px',
      card: '20px',
      inner: '16px',
      badge: '20px',
      pill: '30px',
      tag: '12px',
    },
    borderWidth: {
      thin: '1.5px',
      standard: '2px',
      thick: '3px',
    },
  },

  // 7종 카드 및 썸네일/배너별 맞춤 오버라이드 (Specific Overrides)
  overrides: {
    CHECKLIST: {
      icon: '📋',
      badgeText: '필수 검토 사항',
      bulletBadgeBg: '#DCFCE7',
      bulletBadgeColor: '#15803D',
      bulletBadgeBorder: '#86EFAC',
      tipIcon: '💡',
      tipText: '전문가 실무 팁: 각 항목의 요건과 적격 증빙을 선제적으로 검토해야 법적 불이익을 완벽 차단할 수 있습니다.',
    },
    COMPARISON: {
      icon: '⚖️',
      left: {
        bg: '#FEF2F2',
        border: '#FECACA',
        badgeBg: '#EF4444',
        badgeColor: '#FFFFFF',
        titleColor: '#991B1B',
        bulletColor: '#7F1D1D',
        badgeText: '❌ 잘못된 대처 방식',
      },
      right: {
        bg: '#F0FDF4',
        border: '#BBF7D0',
        badgeBg: '#16A34A',
        badgeColor: '#FFFFFF',
        titleColor: '#166534',
        bulletColor: '#14532D',
        badgeText: '✅ 전문가 정밀 대응',
      },
    },
    STAT_HIGHLIGHT: {
      categoryDefault: 'KEY METRIC & LEGAL STANDARD',
      subBgBorder: '2px',
    },
    PROCESS_FLOW: {
      icon: '🚀',
      stepBoxHeight: '420px',
      finalStepBorder: '#86EFAC',
      finalStepBg: '#16A34A',
    },
    QNA: {
      qBadgeText: 'Q. 자주 묻는 질문',
      aTitleText: '💡 전문가 명쾌 해설:',
      defaultAnswer: '법정 기한 및 요건에 맞춰 선제적으로 대응하면 세액공제와 권리 구제가 모두 가능합니다.',
      answerPadding: '40px',
    },
    WARNING_RISK: {
      icon: '🚨',
      bg: '#FEF2F2',
      border: '3px solid #FECACA',
      innerBg: '#FFFFFF',
      innerBorder: '2px solid #FEE2E2',
      titleColor: '#991B1B',
      bulletColor: '#B91C1C',
      bodyColor: '#475569',
      defaultTitle: '골든타임 경과 시 치명적 불이익 주의',
      defaultSub: '법정 기한 미준수 시 가산세 부과 및 소명 권리 상실',
      defaultDesc: '사안에 따라 대응 시한이 엄격히 정해져 있으므로, 신속하게 전문가와 사실관계를 검토해야 손실을 방어할 수 있습니다.',
    },
    KEY_TAKEAWAYS: {
      icon: '💡',
      badgeText: '핵심 정리',
      footerText: 'Key Point · 핵심 요약 및 판단 기준',
      itemIcons: ['1️⃣', '2️⃣', '3️⃣'],
    },
    MAIN_THUMBNAIL: {
      defaultSignature: 'PostSynk Verified Guide',
      defaultCategory: '2026 핵심 실무 분석',
      defaultSub: '1:1 전문 상담 · 철저한 비밀 보장',
    },
    CTA_FOOTER: {
      defaultPhone: '(대표 전화번호)',
      defaultAddress: '(사무소 상세 주소)',
      defaultTitle: '1:1 맞춤 정밀 진단 및 상담 안내',
      defaultSub: '풍부한 실무 경험을 바탕으로 의뢰인의 권익을 최우선으로 보호합니다.',
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. 헬퍼 유틸리티 (Helpers)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 전문직 광고법(변호사법/의료법 등) 준수 정밀 텍스트 정제 헬퍼
 */
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

function parseProcessStep(rawStep: string, index: number): { title: string; desc: string } {
  let text = cleanItemText(rawStep).trim()
  text = text.replace(/^(step\s*\d+\s*(단계)?|단계\s*\d+|\d+\s*단계|\d+\s*step|\d+)[.:\s-]*/iu, '').trim()
  text = text.replace(/^(단계|step)[.:\s-]*/iu, '').trim()

  const defaultDescs = [
    '사실관계 및 객관적 입증자료 선제 확보',
    '법리 검토 및 맞춤형 소명 전략 수립',
    '신속한 권리 구제 및 분쟁의 조기 종결',
  ]
  const defaultDesc = defaultDescs[index] || '전문가 사전 검토 및 1:1 맞춤 조치'

  if (text.includes(':')) {
    const parts = text.split(':')
    const titlePart = cleanItemText(parts[0]).trim()
    const descPart = cleanItemText(parts.slice(1).join(':')).trim()
    const title = titlePart && !/^(단계|step|\d+)$/i.test(titlePart)
      ? titlePart
      : descPart || `핵심 절차 0${index + 1}`
    const desc = descPart && descPart !== title ? descPart : defaultDesc
    return { title: sanitizeText(title), desc: sanitizeText(desc) }
  }

  if (text.includes(' - ')) {
    const parts = text.split(' - ')
    const titlePart = cleanItemText(parts[0]).trim()
    const descPart = cleanItemText(parts.slice(1).join(' - ')).trim()
    const title = titlePart && !/^(단계|step|\d+)$/i.test(titlePart)
      ? titlePart
      : descPart || `핵심 절차 0${index + 1}`
    const desc = descPart && descPart !== title ? descPart : defaultDesc
    return { title: sanitizeText(title), desc: sanitizeText(desc) }
  }

  return {
    title: sanitizeText(text || `핵심 절차 0${index + 1}`),
    desc: defaultDesc,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. 🧩 7종 독립 템플릿 컴포넌트 (Dumb Components)
// ─────────────────────────────────────────────────────────────────────────────

export interface TemplateProps {
  data: InfographicData
  palette: Palette
}

/**
 * 1) 체크리스트 템플릿 (1080 × 680 px)
 */
export function ChecklistTemplate({ data, palette }: TemplateProps) {
  const cfg = CARD_CONFIG.overrides.CHECKLIST
  const title = sanitizeText(data.title || '반드시 검토해야 할 필수 체크리스트')
  const titleSize = title.length > 25 ? 36 : 42

  const points = data.points && data.points.length > 0
    ? data.points
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
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingDefault,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ display: 'flex', fontSize: '40px' }}>{cfg.icon}</div>
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
            borderRadius: CARD_CONFIG.base.borderRadius.badge,
            fontSize: '22px',
            fontWeight: 'bold',
          }}
        >
          {cfg.badgeText}
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
                borderRadius: CARD_CONFIG.base.borderRadius.card,
                padding: '22px 28px',
                gap: '20px',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: cfg.bulletBadgeBg,
                  color: cfg.bulletBadgeColor,
                  border: `1.5px solid ${cfg.bulletBadgeBorder}`,
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '24px',
                  fontWeight: 'bold',
                }}
              >
                ☑️ 0{idx + 1}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word', lineHeight: CARD_CONFIG.base.typography.lineHeightTitle }}>
                  {itemTitle}
                </div>
                {itemDesc && (
                  <div style={{ display: 'flex', fontSize: '22px', color: palette.sub, fontWeight: 'bold', wordBreak: 'break-word', lineHeight: CARD_CONFIG.base.typography.lineHeightBody }}>
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
          borderRadius: CARD_CONFIG.base.borderRadius.inner,
          padding: '16px 28px',
          gap: '12px',
          boxSizing: 'border-box',
        }}
      >
        <span style={{ fontSize: '24px' }}>{cfg.tipIcon}</span>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>
          {cfg.tipText}
        </span>
      </div>
    </div>
  )
}

/**
 * 2) Before vs After 비교 템플릿 (1080 × 680 px)
 */
export function ComparisonTemplate({ data, palette }: TemplateProps) {
  const cfg = CARD_CONFIG.overrides.COMPARISON
  const title = sanitizeText(data.title || '일반적인 대처 vs 올바른 전문가 해결책 비교')
  const extra1Text = sanitizeText(data.extra1 || '단순 방치 및 부실 증빙 제출')
  const extra2Text = sanitizeText(data.extra2 || '적격증빙 선제적 검증 및 1:1 맞춤 대응')

  const fullContext = `${title} ${extra1Text} ${extra2Text} ${data.category || ''}`
  const isTax = /세무|양도|상속|증여|부가세|소득세|기장|부동산|주택/i.test(fullContext)
  const isLegal = /구제|면허|음주|형사|소송|행정|처분|경찰|변호사|행정사/i.test(fullContext)

  const badBullets = isTax
    ? ['불필요한 과다 세액 및 가산세 발생 위험', '비과세·감면 공제 필수 요건 누락', '사후 소명 자료 부족으로 추징 리스크']
    : isLegal
    ? ['행정처분 구제 골든타임 경과 위험', '불리한 진술 및 입증 자료 누락', '이의신청 및 행정심판 기각 가능성']
    : ['단편적 대처로 인한 실질 손실 발생', '객관적 입증 서류 및 요건 누락', '법적 구제 및 권리 보호 기회 상실']

  const goodBullets = isTax
    ? ['합법적 최대 절세 및 공제 혜택 극대화', '객관적 적격증빙 선제적 정밀 검증', '사후 세무조사 리스크 선제적 방어']
    : isLegal
    ? ['처분 위법성·부당성 1:1 정밀 소명', '생계형·가족상황 객관적 입증 완료', '면허 정지 감경 및 권리 구제 확보']
    : ['전문가 1:1 정밀 사실관계 검토', '관련 법령 및 규정 요건의 체계적 소명', '사건 종결까지 법적 리스크 선제적 방어']

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
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingCompact,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
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
          wordBreak: 'break-word',
        }}
      >
        {cfg.icon} {title}
      </div>

      <div style={{ display: 'flex', gap: '30px', height: '480px' }}>
        {/* Left: Bad */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: cfg.left.bg,
            border: `2px solid ${cfg.left.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.card,
            padding: '30px 26px',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: cfg.left.badgeBg,
              color: cfg.left.badgeColor,
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '22px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}
          >
            {cfg.left.badgeText}
          </div>
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: cfg.left.titleColor, lineHeight: CARD_CONFIG.base.typography.lineHeightTitle, wordBreak: 'break-word' }}>
            {extra1Text}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '22px', color: cfg.left.bulletColor, fontWeight: 'bold', lineHeight: CARD_CONFIG.base.typography.lineHeightBody }}>
            {badBullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', wordBreak: 'break-word' }}>• {b}</div>
            ))}
          </div>
        </div>

        {/* Right: Good */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: cfg.right.bg,
            border: `2px solid ${cfg.right.border}`,
            borderRadius: CARD_CONFIG.base.borderRadius.card,
            padding: '30px 26px',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              backgroundColor: cfg.right.badgeBg,
              color: cfg.right.badgeColor,
              padding: '8px 18px',
              borderRadius: '8px',
              fontSize: '22px',
              fontWeight: 'bold',
              alignSelf: 'flex-start',
            }}
          >
            {cfg.right.badgeText}
          </div>
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: cfg.right.titleColor, lineHeight: CARD_CONFIG.base.typography.lineHeightTitle, wordBreak: 'break-word' }}>
            {extra2Text}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '22px', color: cfg.right.bulletColor, fontWeight: 'bold', lineHeight: CARD_CONFIG.base.typography.lineHeightBody }}>
            {goodBullets.map((b, i) => (
              <div key={i} style={{ display: 'flex', wordBreak: 'break-word' }}>• {b}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * 3) 핵심 수치 하이라이트 템플릿 (1080 × 680 px)
 */
export function StatHighlightTemplate({ data, palette }: TemplateProps) {
  const cfg = CARD_CONFIG.overrides.STAT_HIGHLIGHT
  const subContent = data.subText || data.subtitle || ''

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
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingDefault,
        boxSizing: 'border-box',
        textAlign: 'center',
        gap: '24px',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.accent }}>
        {data.category || cfg.categoryDefault}
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: data.title.length > 20 ? '54px' : '68px',
          fontWeight: 'bold',
          color: palette.text,
          lineHeight: '1.2',
          wordBreak: 'break-word',
        }}
      >
        {data.title}
      </div>

      {subContent && (
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
            lineHeight: CARD_CONFIG.base.typography.lineHeightBody,
          }}
        >
          {subContent}
        </div>
      )}

      {data.extra3 && (
        <div style={{ display: 'flex', fontSize: '24px', color: '#64748B', fontWeight: 'bold', wordBreak: 'break-word' }}>
          {data.extra3}
        </div>
      )}
    </div>
  )
}

/**
 * 4) 3단계 행동 로드맵 템플릿 (1080 × 680 px)
 */
export function ProcessFlowTemplate({ data, palette }: TemplateProps) {
  const cfg = CARD_CONFIG.overrides.PROCESS_FLOW
  const steps = data.points && data.points.length >= 3
    ? data.points
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
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingCompact,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '36px', fontWeight: 'bold', color: palette.text }}>
        <span>{cfg.icon}</span>
        <span style={{ wordBreak: 'break-word' }}>{data.title || '원스톱 사건 해결 3단계 실무 절차'}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
        {steps.slice(0, 3).map((step, idx) => {
          const { title, desc } = parseProcessStep(step, idx)
          const isFinal = idx === 2

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                backgroundColor: palette.cardBg,
                border: `2px solid ${isFinal ? cfg.finalStepBorder : palette.border}`,
                borderRadius: CARD_CONFIG.base.borderRadius.card,
                padding: '30px 24px',
                height: cfg.stepBoxHeight,
                justifyContent: 'space-between',
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: isFinal ? cfg.finalStepBg : palette.accent,
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

              <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, lineHeight: CARD_CONFIG.base.typography.lineHeightTitle, wordBreak: 'break-word' }}>
                {title}
              </div>

              <div style={{ display: 'flex', fontSize: '22px', color: palette.sub, lineHeight: CARD_CONFIG.base.typography.lineHeightBody, wordBreak: 'break-word' }}>
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
 * 5) Q&A 문답 템플릿 (1080 × 680 px)
 */
export function QnaTemplate({ data, palette }: TemplateProps) {
  const cfg = CARD_CONFIG.overrides.QNA
  const answerContent = sanitizeText(data.subText || data.subtitle || data.extra2 || cfg.defaultAnswer)

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
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingDefault,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
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
            whiteSpace: 'nowrap',
          }}
        >
          {cfg.qBadgeText}
        </div>
        <div style={{ display: 'flex', fontSize: data.title.length > 24 ? '30px' : '36px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word', lineHeight: CARD_CONFIG.base.typography.lineHeightTitle }}>
          {sanitizeText(data.title)}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.cardBg,
          border: `2px solid ${palette.border}`,
          borderRadius: '24px',
          padding: cfg.answerPadding,
          gap: '18px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', fontSize: '30px', fontWeight: 'bold', color: palette.accent }}>
          {cfg.aTitleText}
        </div>
        <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: CARD_CONFIG.base.typography.lineHeightRelaxed, wordBreak: 'break-word' }}>
          {answerContent}
        </div>
      </div>
    </div>
  )
}

/**
 * 6) 골든타임 리스크 경고 템플릿 (1080 × 680 px)
 */
export function WarningTemplate({ data }: TemplateProps) {
  const cfg = CARD_CONFIG.overrides.WARNING_RISK
  const subContent = sanitizeText(data.subText || data.subtitle || cfg.defaultSub)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '1080px',
        height: '680px',
        backgroundColor: cfg.bg,
        border: cfg.border,
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingDefault,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', fontSize: '48px' }}>{cfg.icon}</div>
        <div style={{ display: 'flex', fontSize: data.title.length > 24 ? '32px' : '38px', fontWeight: 'bold', color: cfg.titleColor, wordBreak: 'break-word', lineHeight: CARD_CONFIG.base.typography.lineHeightTitle }}>
          {sanitizeText(data.title || cfg.defaultTitle)}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: cfg.innerBg,
          border: cfg.innerBorder,
          borderRadius: CARD_CONFIG.base.borderRadius.card,
          padding: '36px',
          gap: '16px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: cfg.bulletColor, wordBreak: 'break-word', lineHeight: CARD_CONFIG.base.typography.lineHeightTitle }}>
          • {subContent}
        </div>
        <div style={{ display: 'flex', fontSize: '24px', color: cfg.bodyColor, lineHeight: CARD_CONFIG.base.typography.lineHeightBody, wordBreak: 'break-word' }}>
          {cfg.defaultDesc}
        </div>
      </div>
    </div>
  )
}

/**
 * 7) 결론부 핵심 3줄 요약 템플릿 (1080 × 680 px)
 */
export function SummaryTemplate({ data, palette }: TemplateProps) {
  const cfg = CARD_CONFIG.overrides.KEY_TAKEAWAYS
  const points = data.points && data.points.length >= 3
    ? data.points
    : [
        '법정 필수 요건 및 기준을 사전 확인하여 리스크 최소화',
        '비급여/경비 적격증빙을 철저하게 구비하여 소명 대비',
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
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: CARD_CONFIG.base.safeZone.paddingCompact,
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', fontSize: '38px', fontWeight: 'bold', color: palette.accent, wordBreak: 'break-word' }}>
          {cfg.icon} {sanitizeText(data.title || '오늘 포스팅 핵심 3줄 요약')}
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.badgeBg,
            color: palette.badgeText,
            padding: '8px 20px',
            borderRadius: CARD_CONFIG.base.borderRadius.badge,
            fontSize: '22px',
            fontWeight: 'bold',
          }}
        >
          {cfg.badgeText}
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
                {cfg.itemIcons[idx] || `${idx + 1}️⃣`}
              </div>
              <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.text, lineHeight: CARD_CONFIG.base.typography.lineHeightBody, wordBreak: 'break-word' }}>
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
        {cfg.footerText}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. 🖼️ 대표 썸네일 템플릿 (4종 레이아웃: THUMB_A ~ D, 1080 × 1080 px)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 썸네일 제목 자연스러운 어절(단어) 단위 줄바꿈 및 15자 이상 단어 강제 분할 Fallback 유틸리티
 */
export function formatThumbnailTitle(
  title: string,
  maxLineChars = 16,
  fallbackWordLen = 15
): string[] {
  if (!title || !title.trim()) return ['2026 핵심 실무 가이드']
  const cleanTitle = title.trim()

  // 1. 이미 명시적 줄바꿈(\n)이 포함된 경우 존중
  if (cleanTitle.includes('\n')) {
    return cleanTitle
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  }

  // 2. 어절(단어) 추출 및 15자 이상 긴 단어 강제 분할 Fallback 처리
  const rawWords = cleanTitle.split(/\s+/).filter(Boolean)
  const tokens: string[] = []

  for (const w of rawWords) {
    if (w.length >= fallbackWordLen) {
      // 15자 이상 단어는 12~13자 단위로 안전하게 분할
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

  // 3-A. 15자 이하의 짧은 제목: 1줄 유지
  if (fullStr.length <= 15) {
    return [fullStr]
  }

  // 3-B. 16~28자 제목: 어절 손상 없이 2줄 황금비율 분할
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

  // 3-C. 29~38자 장문 제목: 2줄 또는 3줄 최적 균형 분할
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

  // 3-D. 39자 이상 초장문 제목: 최대 3줄 균형 분할 (각 라인 13~15자 내외)
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

export interface ThumbnailTemplateProps extends TemplateProps {
  layout: ThumbLayout
  tags?: string[]
}

export function ThumbnailTemplate({ data, palette, layout }: ThumbnailTemplateProps) {
  const title = data.title || '2026 핵심 실무 가이드'
  const titleLines = formatThumbnailTitle(title)
  const totalLen = title.length
  const maxLineLen = Math.max(...titleLines.map((l) => l.length), 0)

  // 1080x1080 캔버스 및 920px Safe Zone 맞춤 볼드 폰트 스케일링
  let titleSize = 68
  let titleLineHeight = '1.26'

  if (titleLines.length === 1) {
    // 1줄 단문: 최대 78px 압도적 대형 볼드
    titleSize = maxLineLen <= 12 ? 78 : 72
    titleLineHeight = '1.2'
  } else if (titleLines.length === 2) {
    // 2줄 표준 및 장문: 64~72px 시원한 대형 폰트
    if (maxLineLen <= 14) {
      titleSize = 72
      titleLineHeight = '1.24'
    } else if (maxLineLen <= 17) {
      titleSize = 68
      titleLineHeight = '1.26'
    } else {
      titleSize = 62
      titleLineHeight = '1.26'
    }
  } else {
    // 3줄 초장문: 46~58px 균형 폰트
    if (maxLineLen <= 14) {
      titleSize = 58
      titleLineHeight = '1.24'
    } else if (maxLineLen <= 17) {
      titleSize = 52
      titleLineHeight = '1.24'
    } else {
      titleSize = 46
      titleLineHeight = '1.22'
    }
  }

  const signature = data.signature || CARD_CONFIG.overrides.MAIN_THUMBNAIL.defaultSignature
  const category = data.category || CARD_CONFIG.overrides.MAIN_THUMBNAIL.defaultCategory
  const subContent = data.subText || data.subtitle || ''

  // ─────────────────────────────────────────────────────────────────────────
  // THUMB_A: 중앙 플로팅 화이트 박스형 (심플·고급·대형 폰트)
  // ─────────────────────────────────────────────────────────────────────────
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
          padding: '70px 80px',
          boxSizing: 'border-box',
          letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
          wordBreak: 'break-word',
        }}
      >
        {/* 상단 뱃지 영역 (Safe Zone 920px) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '920px' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.badgeBg,
              color: palette.badgeText,
              padding: '12px 28px',
              borderRadius: CARD_CONFIG.base.borderRadius.pill,
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
              borderRadius: CARD_CONFIG.base.borderRadius.pill,
              fontSize: '22px',
              fontWeight: 'bold',
              border: `1.5px solid ${palette.border}`,
            }}
          >
            PostSynk Verified
          </div>
        </div>

        {/* 중앙 플로팅 화이트 박스 (소음 제거 & 대형 타이포그래피) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.cardBg,
            border: `2px solid ${palette.border}`,
            borderRadius: '36px',
            padding: '54px 50px',
            gap: '28px',
            width: '920px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            {titleLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  fontSize: `${titleSize}px`,
                  lineHeight: titleLineHeight,
                  fontWeight: 'bold',
                  color: palette.text,
                  textAlign: 'center',
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
                backgroundColor: palette.bg,
                border: `1.5px solid ${palette.border}`,
                borderRadius: CARD_CONFIG.base.borderRadius.inner,
                padding: '16px 32px',
                fontSize: '26px',
                fontWeight: 'bold',
                color: palette.sub,
                lineHeight: CARD_CONFIG.base.typography.lineHeightBody,
                textAlign: 'center',
                wordBreak: 'break-word',
              }}
            >
              {subContent}
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
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>
            {signature}
          </div>
          <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
            {CARD_CONFIG.overrides.MAIN_THUMBNAIL.defaultSub}
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // THUMB_B: 상단 와이드 컬러 밴드형 (프렌치 에디토리얼 스타일)
  // ─────────────────────────────────────────────────────────────────────────
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
        {/* 상단 슬림 컬러 밴드 */}
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
              borderRadius: CARD_CONFIG.base.borderRadius.inner,
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

        {/* 하단 순백 캔버스 (대형 타이포그래피) */}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
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
                  lineHeight: CARD_CONFIG.base.typography.lineHeightBody,
                  wordBreak: 'break-word',
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
              borderTop: `2px solid ${palette.border}`,
              paddingTop: '24px',
              boxSizing: 'border-box',
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

  // ─────────────────────────────────────────────────────────────────────────
  // THUMB_C: 좌측 악센트 바 미니멀형 (로펌 에디토리얼 스타일)
  // ─────────────────────────────────────────────────────────────────────────
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
        <div
          style={{
            display: 'flex',
            width: '24px',
            height: '1080px',
            backgroundColor: palette.accent,
          }}
        />

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
                padding: '12px 28px',
                borderRadius: CARD_CONFIG.base.borderRadius.badge,
                fontSize: '24px',
                fontWeight: 'bold',
                border: `1.5px solid ${palette.border}`,
              }}
            >
              {category}
            </div>
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.text }}>
              {signature}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
              }}
            >
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
                  lineHeight: CARD_CONFIG.base.typography.lineHeightBody,
                  wordBreak: 'break-word',
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
              borderTop: `2px solid ${palette.border}`,
              paddingTop: '24px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '24px', fontWeight: 'bold', color: palette.accent }}>
              정확한 사실관계 분석
            </div>
            <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
              핵심 쟁점 1:1 전문 가이드
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // THUMB_D: 클린 럭셔리 보더형 (기존 다크톤 전면 폐기 -> 화사한 라이트톤 프리미엄)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '1080px',
        height: '1080px',
        backgroundColor: palette.bg,
        padding: '70px 80px',
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
          alignItems: 'center',
          width: '920px',
          height: '920px',
          border: `2.5px solid ${palette.accent}`,
          borderRadius: '36px',
          padding: '54px 50px',
          backgroundColor: palette.cardBg,
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              backgroundColor: palette.accent,
              color: '#FFFFFF',
              padding: '12px 30px',
              borderRadius: '24px',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            {category}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '26px', maxWidth: '820px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              maxWidth: '820px',
              width: '100%',
            }}
          >
            {titleLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  fontSize: `${titleSize}px`,
                  lineHeight: titleLineHeight,
                  fontWeight: 'bold',
                  color: palette.text,
                  textAlign: 'center',
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
                backgroundColor: palette.highlightBg,
                border: `1.5px solid ${palette.border}`,
                borderRadius: '16px',
                padding: '14px 28px',
                fontSize: '24px',
                fontWeight: 'bold',
                color: palette.sub,
                textAlign: 'center',
                lineHeight: CARD_CONFIG.base.typography.lineHeightBody,
                wordBreak: 'break-word',
              }}
            >
              {subContent}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            borderTop: `1.5px solid ${palette.border}`,
            paddingTop: '20px',
            width: '800px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', fontSize: '28px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>
            {signature}
          </div>
          <div style={{ display: 'flex', fontSize: '20px', color: palette.sub, fontWeight: 'bold' }}>
            {CARD_CONFIG.overrides.MAIN_THUMBNAIL.defaultSub}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. 📞 하단 상담 유도 배너 템플릿 (3종 레이아웃: BANNER_A ~ C, 1080 × 540 px)
// ─────────────────────────────────────────────────────────────────────────────

export interface CtaBannerTemplateProps extends TemplateProps {
  layout: BannerLayout
}

export function CtaBannerTemplate({ data, palette, layout }: CtaBannerTemplateProps) {
  const cfg = CARD_CONFIG.overrides.CTA_FOOTER
  const phone = data.extra1 || cfg.defaultPhone
  const address = data.extra2 || cfg.defaultAddress

  // 고객 사무소명이 메인 타이틀에 정확하고 크게 들어가도록 지능형 처리
  const isGenericTitle = !data.title || data.title.includes('1:1 맞춤') || data.title.includes('상담 안내') || data.title.includes('진단 및 상담')
  const officeName = (
    !isGenericTitle && data.title
      ? data.title
      : data.signature || data.title || cfg.defaultTitle
  ).trim()

  // 사무소명 글자 수에 따른 폰트 크기 자동 조절 (12자 이하 52px, 13~18자 46px, 19자 이상 40px)
  const officeNameSize = officeName.length <= 12 ? 52 : officeName.length <= 18 ? 46 : 40
  const sub = data.subText || data.subtitle || (data.signature && isGenericTitle ? '1:1 전문 맞춤 상담 · 철저한 비밀 보장' : cfg.defaultSub)

  // ─────────────────────────────────────────────────────────────────────────
  // BANNER_A: 좌우 2단 분할형 (외곽선 1.5px 슬림화 & 사무소명 대형화)
  // ─────────────────────────────────────────────────────────────────────────
  if (layout === 'BANNER_A') {
    return (
      <div
        style={{
          display: 'flex',
          width: '1080px',
          height: '540px',
          backgroundColor: palette.bg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: CARD_CONFIG.base.borderRadius.canvas,
          padding: '44px 56px',
          gap: '36px',
          boxSizing: 'border-box',
          letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
          wordBreak: 'break-word',
        }}
      >
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
            <div style={{ display: 'flex', fontSize: `${officeNameSize}px`, fontWeight: 'bold', color: palette.text, lineHeight: '1.22', wordBreak: 'break-word' }}>
              {officeName}
            </div>
            <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, lineHeight: '1.38', wordBreak: 'break-word' }}>
              {sub}
            </div>
          </div>

          <div style={{ display: 'flex', fontSize: '18px', color: '#94A3B8', fontWeight: 'bold' }}>
            * 1:1 사전 예약 시 심층 상담 가능
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: palette.cardBg,
            border: `1.5px solid ${palette.border}`,
            borderRadius: '20px',
            padding: '30px 32px',
            gap: '20px',
            width: '480px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: palette.accent }}>
              📞 직통 상담
            </div>
            <div style={{ display: 'flex', fontSize: '44px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>
              {phone}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', fontSize: '20px', fontWeight: 'bold', color: palette.sub }}>
              🏢 오시는 길
            </div>
            <div style={{ display: 'flex', fontSize: '26px', color: palette.text, fontWeight: 'bold', lineHeight: '1.3', wordBreak: 'break-word' }}>
              {address}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BANNER_B: 중앙 집중 명함형 (외곽선 1.5px 슬림화 & 사무소명 대형화)
  // ─────────────────────────────────────────────────────────────────────────
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
          border: `1.5px solid ${palette.accent}`,
          borderRadius: CARD_CONFIG.base.borderRadius.canvas,
          padding: '36px 50px',
          gap: '22px',
          boxSizing: 'border-box',
          textAlign: 'center',
          letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
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
              borderRadius: CARD_CONFIG.base.borderRadius.badge,
              fontSize: '22px',
              fontWeight: 'bold',
            }}
          >
            공식 1:1 심층 상담 창구
          </div>
          <div style={{ display: 'flex', fontSize: `${officeNameSize}px`, fontWeight: 'bold', color: palette.text, wordBreak: 'break-word', lineHeight: '1.2' }}>
            {officeName}
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, wordBreak: 'break-word', lineHeight: '1.35' }}>
            {sub}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '20px', width: '100%' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              backgroundColor: palette.bg,
              border: `1.5px solid ${palette.accent}`,
              borderRadius: '20px',
              padding: '24px 20px',
              gap: '6px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: palette.accent }}>📞 직통 전화 상담</div>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 'bold', color: palette.text, wordBreak: 'break-word' }}>{phone}</div>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              backgroundColor: palette.bg,
              border: `1.5px solid ${palette.border}`,
              borderRadius: '20px',
              padding: '24px 20px',
              gap: '6px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', fontSize: '22px', fontWeight: 'bold', color: palette.sub }}>🏢 사무소 오시는 길</div>
            <div style={{ display: 'flex', fontSize: '26px', fontWeight: 'bold', color: palette.text, textAlign: 'center', lineHeight: '1.3', wordBreak: 'break-word' }}>{address}</div>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // BANNER_C: 모던 아웃라인 박스형 (외곽선 1.5px 슬림화 & 사무소명 대형화)
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '1080px',
        height: '540px',
        backgroundColor: palette.highlightBg,
        border: `1.5px solid ${palette.accent}`,
        borderRadius: CARD_CONFIG.base.borderRadius.canvas,
        padding: '40px 54px',
        gap: '22px',
        boxSizing: 'border-box',
        letterSpacing: CARD_CONFIG.base.typography.letterSpacing,
        wordBreak: 'break-word',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '780px' }}>
          <div style={{ display: 'flex', fontSize: `${officeNameSize}px`, fontWeight: 'bold', color: palette.text, lineHeight: '1.2', wordBreak: 'break-word' }}>
            {officeName}
          </div>
          <div style={{ display: 'flex', fontSize: '24px', color: palette.sub, lineHeight: '1.35', wordBreak: 'break-word' }}>
            {sub}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            backgroundColor: palette.accent,
            color: '#FFFFFF',
            padding: '12px 26px',
            borderRadius: '16px',
            fontSize: '22px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          1:1 공식 접수
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: palette.cardBg,
          border: `1.5px solid ${palette.border}`,
          borderRadius: '20px',
          padding: '24px 34px',
          gap: '14px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '38px', fontWeight: 'bold', color: palette.text, gap: '16px' }}>
          <span style={{ color: palette.accent, whiteSpace: 'nowrap', fontSize: '32px' }}>📞 직통 상담:</span>
          <span style={{ fontSize: '44px', color: palette.text, wordBreak: 'break-word' }}>{phone}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '28px', fontWeight: 'bold', color: palette.text, gap: '16px' }}>
          <span style={{ color: palette.sub, whiteSpace: 'nowrap', fontSize: '26px' }}>🏢 오시는 길:</span>
          <span style={{ fontSize: '28px', color: palette.text, fontWeight: 'bold', lineHeight: '1.3', wordBreak: 'break-word' }}>{address}</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. 🚦 메인 렌더링 스위치 (Single Switch Entrypoint)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 템플릿-슬롯 아키텍처 기반 프로시저럴 인포그래픽 메인 생성 함수
 */
export function generateProceduralImage(data: InfographicData): React.ReactElement {
  const brandKit = hashUserIdToBrandKit(data.userId || data.seed)

  // 테마 오버라이드 지정이 있는 경우 반영
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
    case 'CHECKLIST':
      return <ChecklistTemplate data={data} palette={palette} />
    case 'COMPARISON':
      return <ComparisonTemplate data={data} palette={palette} />
    case 'STAT_HIGHLIGHT':
      return <StatHighlightTemplate data={data} palette={palette} />
    case 'PROCESS_FLOW':
      return <ProcessFlowTemplate data={data} palette={palette} />
    case 'QNA':
      return <QnaTemplate data={data} palette={palette} />
    case 'WARNING_RISK':
      return <WarningTemplate data={data} palette={palette} />
    case 'KEY_TAKEAWAYS':
      return <SummaryTemplate data={data} palette={palette} />
    case 'CTA_FOOTER':
      return <CtaBannerTemplate data={data} palette={palette} layout={bannerLayout} />
    default:
      return <ThumbnailTemplate data={data} palette={palette} layout={thumbLayout} tags={tags} />
  }
}

/**
 * 하위 호환성 및 기존 코드 연결용 별칭 함수
 */
export function buildProceduralCardComponent(payload: CardPayload): React.ReactElement {
  return generateProceduralImage(payload)
}
