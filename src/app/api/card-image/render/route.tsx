import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import {
  buildProceduralCardComponent,
  CardPayload,
  CardType,
} from '@/lib/image-engine/procedural-generator'

// 500KB 이하 경량화 한글 서브셋 폰트 인메모리 캐시 (서버리스 인스턴스 간 재사용)
let cachedFontBuffer: ArrayBuffer | null = null

async function loadSubsetFont(): Promise<ArrayBuffer | null> {
  if (cachedFontBuffer) return cachedFontBuffer

  try {
    // 경량 Pretendard Bold WOFF 서브셋 (<450KB)
    const fontRes = await fetch(
      'https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard/dist/web/static/woff/Pretendard-Bold.woff',
      { cache: 'force-cache' }
    )
    if (fontRes.ok) {
      cachedFontBuffer = await fontRes.arrayBuffer()
      return cachedFontBuffer
    }
  } catch (fontErr) {
    console.warn('SubsetFont load failed, falling back to system sans-serif:', fontErr)
  }
  return null
}

export async function GET(req: NextRequest) {
  try {
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

    // 3. 섭동 연산 비동기 동기화 (100% 계산 완료 보장)
    const element = await Promise.resolve(buildProceduralCardComponent(payload))

    // 2. 경량 서브셋 폰트 로드 (<500KB)
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
  } catch (error: any) {
    console.error('Procedural ImageResponse render error:', error)
    return new NextResponse('Internal Image Render Error', {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
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
