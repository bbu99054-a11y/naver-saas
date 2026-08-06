import crypto from 'crypto'

export async function fetchNaverKeywords(hintKeywords: string[]) {
  const NAVER_API_KEY = process.env.NAVER_API_KEY
  const NAVER_SECRET_KEY = process.env.NAVER_SECRET_KEY
  const NAVER_CUSTOMER_ID = process.env.NAVER_CUSTOMER_ID

  if (!NAVER_API_KEY || !NAVER_SECRET_KEY || !NAVER_CUSTOMER_ID) {
    throw new Error('Naver API keys are not set')
  }

  const timestamp = Date.now().toString()
  const method = 'GET'
  const path = '/keywordstool'
  const message = `${timestamp}.${method}.${path}`

  const signature = crypto
    .createHmac('sha256', NAVER_SECRET_KEY)
    .update(message)
    .digest('base64')

  // 네이버 API는 hintKeywords를 콤마(,)로 구분하여 최대 5개까지 받음
  // 띄어쓰기를 없애야 에러(11001)가 안 남
  const processedKeywords = hintKeywords.map(k => k.replace(/\s+/g, '')).join(',')
  
  const url = `https://api.naver.com${path}?hintKeywords=${encodeURIComponent(processedKeywords)}&showDetail=1`

  const response = await fetch(url, {
    method,
    headers: {
      'X-Timestamp': timestamp,
      'X-API-KEY': NAVER_API_KEY,
      'X-Customer': NAVER_CUSTOMER_ID,
      'X-Signature': signature,
    }
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Naver API Error: ${response.status} - ${errorText}`)
  }

  const data = await response.json()
  return data.keywordList || []
}
