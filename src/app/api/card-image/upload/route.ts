import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const maxDuration = 30

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, imageBase64, mimeType = 'image/png' } = body

    if (!id || !imageBase64) {
      return NextResponse.json(
        { error: 'id and imageBase64 are required' },
        { status: 400 }
      )
    }

    // data:image/png;base64,... 프리픽스 제거
    let rawBase64 = imageBase64
    const commaIndex = imageBase64.indexOf(',')
    if (commaIndex !== -1) {
      rawBase64 = imageBase64.substring(commaIndex + 1)
    }

    const imageBuffer = Buffer.from(rawBase64, 'base64')

    // PostgreSQL Bytes (@db.ByteA) 저장
    await prisma.cardImage.upsert({
      where: { id },
      update: {
        data: imageBuffer,
        mime_type: mimeType,
      },
      create: {
        id,
        data: imageBuffer,
        mime_type: mimeType,
      },
    })

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      req.nextUrl.origin
    const publicUrl = `${origin}/api/card-image/${id}.png`


    return NextResponse.json({
      success: true,
      id,
      url: publicUrl,
    })
  } catch (error: any) {
    console.error('Card image upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload card image' },
      { status: 500 }
    )
  }
}
