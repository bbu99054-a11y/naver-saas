import { NextResponse } from 'next/server'
import { inspectLawyerAdComplianceWithJev } from '@/lib/adcheck/lawyerCompliance'

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { text = '' } = body

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: '검사할 본문 텍스트를 입력해 주세요.' },
        { status: 400 }
      )
    }

    const result = await inspectLawyerAdComplianceWithJev(text)

    return NextResponse.json({
      success: true,
      ...result
    })
  } catch (err: any) {
    console.error('[AdCheck Analyze API Error]:', err)
    return NextResponse.json(
      { error: err.message || '광고 규정 검사 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
