import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const keyword = searchParams.get('keyword')

  if (!keyword) {
    return NextResponse.json({ error: '키워드를 입력해주세요.' }, { status: 400 })
  }

  const NAVER_API_KEY = process.env.NAVER_API_KEY
  const NAVER_SECRET_KEY = process.env.NAVER_SECRET_KEY
  const NAVER_CUSTOMER_ID = process.env.NAVER_CUSTOMER_ID

  if (!NAVER_API_KEY || !NAVER_SECRET_KEY || !NAVER_CUSTOMER_ID) {
    return NextResponse.json(
      { error: '서버에 네이버 API 연동 키가 설정되지 않았습니다.' },
      { status: 500 }
    )
  }

  try {
    const { fetchNaverKeywords } = await import('@/lib/naverApi');
    const keywordList = await fetchNaverKeywords([keyword]);
    return NextResponse.json({ success: true, data: keywordList });
  } catch (error: any) {
    console.error('Failed to fetch from Naver API:', error)
    return NextResponse.json(
      { error: error.message || '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
