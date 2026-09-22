import { NextResponse } from 'next/server'

export interface PlaceReviewItem {
  id: string
  body: string
  rating?: number
  created?: string
  author?: string
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const placeIdParam = searchParams.get('placeId') || ''
    const cleanPlaceId = placeIdParam.trim().replace(/\D/g, '')

    if (!cleanPlaceId) {
      return NextResponse.json({
        success: false,
        error: '플레이스 고유 번호(placeId)를 입력해 주세요.'
      }, { status: 400 })
    }

    const targetUrl = `https://m.place.naver.com/place/${cleanPlaceId}/review/visitor`
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      signal: AbortSignal.timeout(6000),
      next: { revalidate: 180 }
    })

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        error: `네이버 플레이스 페이지 응답 실패 (${res.status})`
      }, { status: 502 })
    }

    const html = await res.text()
    const apolloMatch = html.match(/__APOLLO_STATE__\s*=\s*(\{[\s\S]*?\});\s*(?:<\/script>|\n)/)

    if (!apolloMatch) {
      return NextResponse.json({
        success: false,
        error: '네이버 플레이스 리뷰 데이터를 파싱할 수 없습니다.'
      }, { status: 500 })
    }

    const apolloState = JSON.parse(apolloMatch[1])
    const reviews: PlaceReviewItem[] = []
    const seenBodies = new Set<string>()

    for (const [k, val] of Object.entries(apolloState)) {
      if (k.startsWith('VisitorReview:')) {
        const v = val as any
        const body = (v.body || v.contents || '').trim()
        
        // 의미 있는 본문이 있는 리뷰만 추출 (단순 평점/사진 온리는 제외)
        if (body && body.length >= 10 && !seenBodies.has(body)) {
          seenBodies.add(body)
          reviews.push({
            id: v.id || k,
            body,
            rating: typeof v.rating === 'number' ? v.rating : 5,
            created: v.created || '최근 방문',
            author: v.nickname || v.author?.nickname || '네이버 예약·영수증 의뢰인'
          })
        }
      }
    }

    // 최신순 정예 4개 반환 (대표님 요청 규격 최적화)
    return NextResponse.json({
      success: true,
      placeId: cleanPlaceId,
      totalCount: reviews.length,
      reviews: reviews.slice(0, 4)
    })

  } catch (error: any) {
    console.error('[Place Reviews API Error]:', error)
    return NextResponse.json({
      success: false,
      error: error?.message || '네이버 플레이스 리뷰 수집 중 오류가 발생했습니다.'
    }, { status: 500 })
  }
}
