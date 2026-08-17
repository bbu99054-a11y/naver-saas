/**
 * [ZONE-10] 실시간 검색 시그널 기반 키워드 엔진 유틸리티
 * 1. 네이버 실시간 자동완성 API 연동
 * 2. Tavily 실시간 지역/업종 이슈 검색
 */

/**
 * 네이버 실시간 자동완성/연관검색어 수집 함수
 * @param seedQuery 검색 시드 쿼리 (예: "송파구 세무사")
 * @returns 실시간 네이버 자동완성 키워드 배열
 */
export async function fetchNaverAutocomplete(seedQuery: string): Promise<string[]> {
  if (!seedQuery || !seedQuery.trim()) {
    return []
  }

  try {
    const encodedQuery = encodeURIComponent(seedQuery.trim())
    const url = `https://ac.search.naver.com/nx/ac?q=${encodedQuery}&con=0&frm=nv&ans=2&r_format=json&r_enc=UTF-8&r_unicode=0&t_koreng=1&run=2&rev=4&q_enc=UTF-8&st=100`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
      },
      signal: AbortSignal.timeout(3000), // 3초 타임아웃
      cache: 'no-store',
    })

    if (!response.ok) {
      console.warn(`[Naver AC] HTTP error! status: ${response.status}`)
      return []
    }

    const data = await response.json()
    // 네이버 자동완성 JSON 응답 포맷: { items: [ [ ["키워드1", ...], ["키워드2", ...] ] ] }
    if (data && Array.isArray(data.items) && data.items.length > 0) {
      const firstGroup = data.items[0]
      if (Array.isArray(firstGroup)) {
        const keywords: string[] = firstGroup
          .map((item: any) => {
            if (Array.isArray(item) && typeof item[0] === 'string') {
              return item[0].trim()
            } else if (typeof item === 'string') {
              return item.trim()
            }
            return ''
          })
          .filter((kw: string) => kw.length > 0)

        return keywords
      }
    }

    return []
  } catch (error) {
    console.warn('[Naver AC] 자동완성 수집 경고 (안전 Fallback):', error)
    return []
  }
}

/**
 * 최신 지역 및 전문직 이슈 검색 함수 (Tavily Search API)
 * @param region 지역명 (예: "송파구")
 * @param profession 전문직/업종 (예: "세무사")
 * @returns 최신 이슈 요약 텍스트
 */
export async function fetchTrendingTopics(region: string, profession: string): Promise<string> {
  if (!process.env.TAVILY_API_KEY) {
    return ''
  }

  try {
    const query = `${region} ${profession} 최신 부동산 세법 법률 개정 일정 이슈 트렌드`.trim()

    const searchRes = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        search_depth: 'basic',
        include_answer: true,
        max_results: 3,
      }),
      signal: AbortSignal.timeout(2500), // 2.5초 타임아웃
      cache: 'no-store',
    })

    if (!searchRes.ok) {
      return ''
    }

    const searchData = await searchRes.json()
    if (searchData && searchData.results && searchData.results.length > 0) {
      const summaries = searchData.results
        .map((r: any) => `- ${r.title}: ${r.content}`)
        .join('\n')
      
      const answer = searchData.answer ? `[요약]: ${searchData.answer}\n` : ''
      return `${answer}${summaries}`
    }

    return searchData.answer || ''
  } catch (error) {
    console.warn('[Tavily Trending] 최신 이슈 검색 경고 (안전 Fallback):', error)
    return ''
  }
}
