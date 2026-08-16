import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const maxDuration = 30

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rawId = (await params).id
    if (!rawId) {
      return new NextResponse('Missing image ID', { status: 400 })
    }

    // 1. Next.js dynamic route 확장자(.png) 안전 제거
    const cleanId = rawId.replace(/\.png$/i, '')

    // 2. PostgreSQL 영구 스토리지에서 바이너리 조회
    const card = await prisma.cardImage.findUnique({
      where: { id: cleanId },
    })

    if (!card || !card.data) {
      return new NextResponse('Image Not Found', {
        status: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
    }

    // 3. 네이버 크롤러 및 브라우저 맞춤 필수 헤더 응답
    return new NextResponse(Buffer.from(card.data), {
      status: 200,
      headers: {
        'Content-Type': card.mime_type || 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
      },
    })
  } catch (error: any) {
    console.error('Error fetching card image:', error)
    return new NextResponse('Internal Server Error', {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
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
