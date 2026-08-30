import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import {
  buildProceduralCardComponent,
  CardPayload,
  CardType,
  ThumbLayout,
  BannerLayout,
  hashUserIdToBrandKit,
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

  const titleSize = cleanTitle.length > 25 ? 42 : 52

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" rx="32" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="3"/>
  <rect x="80" y="80" width="320" height="56" rx="28" fill="#FEF3C7" stroke="#FDE68A" stroke-width="2"/>
  <text x="240" y="117" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif" font-size="22" font-weight="bold" fill="#92400E" text-anchor="middle">${cleanCat}</text>
  
  <text x="80" y="480" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif" font-size="${titleSize}" font-weight="bold" fill="#0F172A">${cleanTitle}</text>
  ${cleanSub ? `<text x="80" y="580" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', 'Malgun Gothic', sans-serif" font-size="28" fill="#475569">${cleanSub}</text>` : ''}
  
  <line x1="80" y1="${height - 120}" x2="${width - 80}" y2="${height - 120}" stroke="#E2E8F0" stroke-width="2"/>
  <text x="80" y="${height - 65}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="24" font-weight="bold" fill="#64748B">${signature}</text>
  <text x="${width - 80}" y="${height - 65}" font-family="-apple-system, BlinkMacSystemFont, 'Pretendard', sans-serif" font-size="22" fill="#94A3B8" text-anchor="end">1:1 맞춤 검토 · 비밀 보장</text>
</svg>
`.trim()
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const type = (searchParams.get('type') || 'MAIN_THUMBNAIL') as CardType
    let title = searchParams.get('title') || '2026 핵심 실무 가이드'
    let category = searchParams.get('category') || '전문가 실무 분석'
    let subText = searchParams.get('sub') || ''
    let signature = searchParams.get('sig') || ''
    let extra1 = searchParams.get('extra1') || ''
    let extra2 = searchParams.get('extra2') || ''
    let extra3 = searchParams.get('extra3') || ''
    const userId = searchParams.get('userId') || ''
    const themeName = searchParams.get('theme') || undefined
    const thumbLayout = (searchParams.get('thumbLayout') as ThumbLayout) || undefined
    const bannerLayout = (searchParams.get('bannerLayout') as BannerLayout) || undefined

    // AI가 URL 쿼리 작성 시 '&extra2=' 대신 '|extra2=' 또는 파이프로 넘겼을 때 지능형 자동 분리 복구
    if (extra1.includes('|extra2=') || extra1.includes('&extra2=')) {
      const parts = extra1.split(/[|&]extra2=/)
      extra1 = parts[0].trim()
      if (!extra2 && parts[1]) {
        extra2 = parts[1].trim()
      }
    } else if (!extra2 && extra1.includes('|') && type === 'COMPARISON') {
      const parts = extra1.split('|')
      extra1 = parts[0].trim()
      extra2 = parts.slice(1).join('|').trim()
    }

    // extra2 내부에 extra3가 연결된 경우도 자동 분리
    if (extra2.includes('|extra3=') || extra2.includes('&extra3=')) {
      const parts = extra2.split(/[|&]extra3=/)
      extra2 = parts[0].trim()
      if (!extra3 && parts[1]) {
        extra3 = parts[1].trim()
      }
    }

    // 3개 태그 파싱
    const rawTags = searchParams.get('tags') || ''
    let tags: string[] | undefined = undefined
    if (rawTags) {
      tags = rawTags.split('|').map((t) => t.trim()).filter(Boolean)
    }

    // 시드(Seed)가 기본값이거나 없을 경우, 요청된 글의 제목/카테고리/타입 문자열을 결합하여 고유 시드 자동 생성
    let seed = searchParams.get('seed')
    if (!seed || seed === 'postsynk_default_seed') {
      seed = `${userId}_${type}_${title}_${category}_${subText}_${extra1}`
    }

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
      userId,
      themeName,
      tags,
      thumbLayout,
      bannerLayout,
    }

    // 1080×1080px 1:1 정방형 벤토 그리드 표준 캔버스 치수 (모바일 최적화)
    const width = 1080
    const height = 1080

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

      const isDev = process.env.NODE_ENV === 'development'
      const cacheControl = isDev
        ? 'no-cache, no-store, must-revalidate'
        : 'public, max-age=31536000, immutable'

      return new ImageResponse(element, {
        width,
        height,
        fonts,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': cacheControl,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      })
    } catch (innerError) {
      console.warn('ImageResponse inner error, serving SVG fallback:', innerError)
      const fallbackSvg = generateFailproofSvg(payload, width, height)
      const isDev = process.env.NODE_ENV === 'development'
      const cacheControl = isDev
        ? 'no-cache, no-store, must-revalidate'
        : 'public, max-age=31536000, immutable'

      return new Response(fallbackSvg, {
        status: 200,
        headers: {
          'Content-Type': 'image/svg+xml; charset=utf-8',
          'Cache-Control': cacheControl,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
        },
      })
    }
  } catch (outerError: any) {
    console.error('Fatal GET error in card render:', outerError)
    return new Response(`Error: ${outerError?.message || outerError}`, { status: 200 })
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
