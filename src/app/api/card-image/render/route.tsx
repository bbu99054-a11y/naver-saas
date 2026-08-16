import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import {
  buildProceduralCardComponent,
  CardPayload,
  CardType,
} from '@/lib/image-engine/procedural-generator'

// 500KB 이하 경량화 한글 서브셋 폰트 인메모리 캐시
let cachedFontBuffer: ArrayBuffer | null = null

async function loadSubsetFont(): Promise<ArrayBuffer | null> {
  if (cachedFontBuffer) return cachedFontBuffer

  try {
    const fontRes = await fetch(
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff',
      { cache: 'force-cache', signal: AbortSignal.timeout(3000) }
    )
    if (fontRes.ok) {
      cachedFontBuffer = await fontRes.arrayBuffer()
      return cachedFontBuffer
    }
  } catch (fontErr) {
    console.warn('SubsetFont load timeout/error, using system fallback:', fontErr)
  }
  return null
}

function generateFailproofSvg(payload: CardPayload, width: number, height: number): string {
  const cleanTitle = (payload.title || '2026 핵심 실무 가이드')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
  const cleanSub = (payload.subText || payload.extra1 || '')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
  const cleanCat = (payload.category || '전문가 실무 분석')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
  const signature = (payload.signature || 'PostSynk Verified Guide')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')

  const titleSize = cleanTitle.length > 25 ? 32 : 38

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" rx="20" fill="#FDFBF7" stroke="#E2E8F0" stroke-width="2"/>
  <rect x="40" y="32" width="220" height="40" rx="20" fill="#FEF3C7" stroke="#FDE68A" stroke-width="1.5"/>
  <text x="150" y="58" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif" font-size="16" font-weight="bold" fill="#92400E" text-anchor="middle">${cleanCat}</text>
  
  <text x="40" y="${height > 600 ? 320 : 160}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif" font-size="${titleSize}" font-weight="bold" fill="#0F172A">${cleanTitle}</text>
  ${cleanSub ? `<text x="40" y="${height > 600 ? 390 : 225}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif" font-size="20" fill="#475569">${cleanSub}</text>` : ''}
  
  <line x1="40" y1="${height - 70}" x2="${width - 40}" y2="${height - 70}" stroke="#E2E8F0" stroke-width="1.5"/>
  <text x="40" y="${height - 35}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="15" fill="#64748B">${signature}</text>
  <text x="${width - 40}" y="${height - 35}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="14" fill="#94A3B8" text-anchor="end">C-Rank SEO 2026</text>
</svg>
`.trim()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const type = (searchParams.get('type') || 'MAIN_THUMBNAIL') as CardType
  const title = searchParams.get('title') || '2026 핵심 실무 가이드'
  const category = searchParams.get('category') || '전문가 실무 분석'
  const subText = searchParams.get('sub') || ''
  const signature = searchParams.get('sig') || ''
  const extra1 = searchParams.get('extra1') || ''
  const extra2 = searchParams.get('extra2') || ''
  const extra3 = searchParams.get('extra3') || ''
  const seed = searchParams.get('seed') || 'postsynk_default_seed'
  const rawPoints = searchParams.get('points') || ''

  let points: string[] | undefined = undefined
  if (rawPoints) {
    points = rawPoints.split('|').map((p) => p.trim()).filter(Boolean)
  }

  const payload: CardPayload = {
    type,
    title,
    category,
    subText,
    points,
    signature,
    extra1,
    extra2,
    extra3,
    seed,
  }

  // 치수(Dimension) 최적화
  let width = 800
  let height = 450
  if (type === 'MAIN_THUMBNAIL') {
    width = 800
    height = 800
  } else if (type === 'STAT_HIGHLIGHT') {
    width = 800
    height = 400
  } else if (type === 'WARNING_RISK') {
    width = 800
    height = 380
  } else if (type === 'QNA') {
    width = 800
    height = 420
  } else if (type === 'KEY_TAKEAWAYS' || type === 'CTA_FOOTER') {
    width = 800
    height = 480
  }

  // 1차 시도: ImageResponse (PNG 고화질)
  try {
    const element = buildProceduralCardComponent(payload)
    const fontData = await loadSubsetFont()
    const fonts = fontData
      ? [
          {
            name: 'Pretendard',
            data: fontData,
            weight: 700 as const,
            style: 'normal' as const,
          },
        ]
      : undefined

    return new ImageResponse(element, {
      width,
      height,
      fonts,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    })
  } catch (error) {
    console.warn('ImageResponse error, serving 100% fail-proof SVG fallback:', error)

    // 2차 Fallback: 100% 무장애 인라인 SVG (0% 500 에러 보장)
    const fallbackSvg = generateFailproofSvg(payload, width, height)
    return new Response(fallbackSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    },
  })
}
