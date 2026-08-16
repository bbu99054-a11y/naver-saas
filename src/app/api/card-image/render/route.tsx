import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import {
  buildProceduralCardComponent,
  CardPayload,
  CardType,
} from '@/lib/image-engine/procedural-generator'

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

    const element = buildProceduralCardComponent(payload)

    return new ImageResponse(element, {
      width,
      height,
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
