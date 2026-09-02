/**
 * [ZONE-4] 클라이언트 카드 이미지 2배수 초고화질 렌더링 & 본문 인포그래픽 자동 탐지/치환 파이프라인
 */

export type CardType =
  | 'MAIN_THUMBNAIL'
  | 'CTA_FOOTER'
  // [2026 방향 A] 전문직 특화 정예 8종 벤토 카드
  | 'CRITICAL_CHECKLIST'
  | 'ROI_COMPARISON'
  | 'LOSS_GAUGE'
  | 'PROCESS_ROADMAP'
  | 'DOSSIER_INDEX'
  | 'STATUTORY_CRITERIA'
  | 'FACT_QNA'
  | 'EXECUTIVE_SUMMARY'
  // [10종 본문 벤토 카드]
  | 'RED_FLAGS'
  | 'SELF_DIAGNOSIS'
  | 'VS_SIMULATION'
  | 'COST_OF_INACTION'
  | 'ACTION_TIMELINE'
  | 'REQUIRED_DOSSIER'
  | 'CRITERIA_TABLE'
  | 'SUCCESS_RECEIPT'
  | 'EXPERT_OPINION'
  | 'FINAL_VERDICT'
  // 레거시 호환
  | 'CHECKLIST'
  | 'COMPARISON'
  | 'STAT_HIGHLIGHT'
  | 'PROCESS_FLOW'
  | 'QNA'
  | 'WARNING_RISK'
  | 'KEY_TAKEAWAYS'

export const CARD_TYPE_KOREAN_NAMES: Record<CardType, string> = {
  MAIN_THUMBNAIL: '대표 썸네일',
  CTA_FOOTER: '1:1 전문 상담 및 예약 안내',
  // 정예 8종 벤토 카드
  CRITICAL_CHECKLIST: '위기 경고 체크리스트',
  ROI_COMPARISON: '비포/애프터 실익 대비표',
  LOSS_GAUGE: '골든타임 손실 게이지',
  PROCESS_ROADMAP: '사건 해결 3단계 로드맵',
  DOSSIER_INDEX: '필수 구비 서류함 도감',
  STATUTORY_CRITERIA: '법정 처벌 및 과세 기준표',
  FACT_QNA: '빈출 Q&A 팩트체크',
  EXECUTIVE_SUMMARY: '3초 핵심 실무 요약',
  // 기존 10종 매핑
  RED_FLAGS: '3대 레드플래그 경고',
  SELF_DIAGNOSIS: '위기 징후 자가진단표',
  VS_SIMULATION: '나홀로 vs 전문가 시뮬레이션',
  COST_OF_INACTION: '방치 시 손실 스노우볼',
  ACTION_TIMELINE: 'D-Day 진행 절차 로드맵',
  REQUIRED_DOSSIER: '필수 준비 서류함 도감',
  CRITERIA_TABLE: '법정 처벌 및 과세 기준표',
  SUCCESS_RECEIPT: '실제 권리 구제 성공 영수증',
  EXPERT_OPINION: '전문가 종합 소견서 및 팩트체크',
  FINAL_VERDICT: '최종 결단 촉구 및 즉시 상담 안내',
  // 레거시 매핑
  CHECKLIST: '위기 징후 자가진단표',
  COMPARISON: '나홀로 vs 전문가 시뮬레이션',
  STAT_HIGHLIGHT: '법정 처벌 및 과세 기준표',
  PROCESS_FLOW: 'D-Day 진행 절차 로드맵',
  QNA: '전문가 종합 소견서 및 팩트체크',
  WARNING_RISK: '3대 레드플래그 경고',
  KEY_TAKEAWAYS: '전문가 종합 소견서 및 팩트체크',
}

/**
 * Alt 텍스트 및 주변 문맥으로부터 적합한 CardType을 자동 판별
 */
export function determineCardType(altText: string): CardType {
  const t = altText.toLowerCase()
  if (t.includes('썸네일') || t.includes('대표')) return 'MAIN_THUMBNAIL'
  if (t.includes('qna') || t.includes('q&a') || t.includes('문답') || t.includes('팩트체크')) return 'FACT_QNA'
  if (t.includes('3초') || t.includes('요약') || t.includes('브리핑') || t.includes('summary')) return 'EXECUTIVE_SUMMARY'
  if (t.includes('체크리스트') || t.includes('위기') || t.includes('자가진단') || t.includes('레드플래그') || t.includes('실수')) return 'CRITICAL_CHECKLIST'
  if (t.includes('시뮬레이션') || t.includes('비교') || t.includes('대비') || t.includes('vs') || t.includes('나홀로') || t.includes('영수증') || t.includes('roi')) return 'ROI_COMPARISON'
  if (t.includes('스노우볼') || t.includes('손실') || t.includes('방치') || t.includes('inaction') || t.includes('게이지')) return 'LOSS_GAUGE'
  if (t.includes('타임라인') || t.includes('로드맵') || t.includes('절차') || t.includes('d-day') || t.includes('단계')) return 'PROCESS_ROADMAP'
  if (t.includes('서류') || t.includes('도감') || t.includes('준비물') || t.includes('dossier')) return 'DOSSIER_INDEX'
  if (t.includes('기준표') || t.includes('처벌') || t.includes('과세') || t.includes('세율') || t.includes('수치')) return 'STATUTORY_CRITERIA'
  if (t.includes('소견서') || t.includes('opinion')) return 'FACT_QNA'
  if (t.includes('결단') || t.includes('verdict') || t.includes('촉구') || t.includes('통화') || t.includes('직통')) return 'EXECUTIVE_SUMMARY'
  if (t.includes('상담') || t.includes('배너') || t.includes('안내') || t.includes('위치') || t.includes('문의') || t.includes('cta')) return 'CTA_FOOTER'
  return 'CRITICAL_CHECKLIST'
}

/**
 * 본문 내의 마크다운 이미지 태그(![...](...)), 빈 img 태그, 사진 안내 텍스트를 감지하여
 * 100% 동작하는 고화질 Headless Serverless 카드 이미지 태그로 자동 치환
 */
export function processPostInfographics(
  postContent: string,
  articleSeed: string = 'postsynk_post_seed'
): string {
  if (!postContent) return ''

  let updated = postContent
  const origin =
    typeof window !== 'undefined'
      ? process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
      : ''

  // 1. 마크다운 이미지 태그 감지 및 치환: ![헬리오시티 감정평가 체크리스트 인포그래픽](...)
  const mdImageRegex = /!\[(.*?)\]\((.*?)\)/gi
  updated = updated.replace(mdImageRegex, (match, altText, url) => {
    const cleanAlt = altText.trim() || '블로그 핵심 인포그래픽'
    // 이미 정상적인 /api/card-image/ URL이 들어있는 경우
    if (url && url.includes('/api/card-image/')) {
      const fullUrl = url.startsWith('/') && origin ? `${origin}${url}` : url
      return `<p style="text-align: center; margin: 25px 0;"><img src="${fullUrl}" alt="${cleanAlt}" style="display: block; max-width: 100%; height: auto; margin: 20px auto; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);" /></p>`
    }

    const cardType = determineCardType(cleanAlt)
    const encodedTitle = encodeURIComponent(cleanAlt.replace(/인포그래픽|이미지|카드/g, '').trim() || '핵심 실무 분석')
    const finalUrl = `${origin}/api/card-image/render?type=${cardType}&title=${encodedTitle}&category=2026+실무+분석&seed=${encodeURIComponent(articleSeed)}`

    return `<p style="text-align: center; margin: 25px 0;"><img src="${finalUrl}" alt="${cleanAlt}" style="display: block; max-width: 100%; height: auto; margin: 20px auto; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);" /></p>`
  })

  // 2. src가 비어있거나 플레이스홀더인 <img ...> 태그 치환
  const emptyImgRegex = /<img([^>]*?)src=(["'])([\s\S]*?)\2([^>]*?)>/gi
  updated = updated.replace(emptyImgRegex, (match, before, quote, srcValue, after) => {
    const combined = `${before} ${after}`
    const altMatch = combined.match(/alt=(["'])([\s\S]*?)\1/i)
    const altText = altMatch ? altMatch[2].trim() : '블로그 핵심 인포그래픽'

    const isInvalidSrc =
      !srcValue ||
      srcValue.trim() === '' ||
      srcValue === '#' ||
      srcValue.toLowerCase().includes('placeholder') ||
      srcValue.startsWith('data:image/svg+xml;utf8,<svg') === false && srcValue.startsWith('http') === false && srcValue.startsWith('/api/') === false

    if (isInvalidSrc) {
      const cardType = determineCardType(altText)
      const encodedTitle = encodeURIComponent(altText.replace(/인포그래픽|이미지|카드/g, '').trim() || '핵심 실무 분석')
      const finalUrl = `${origin}/api/card-image/render?type=${cardType}&title=${encodedTitle}&category=2026+실무+분석&seed=${encodeURIComponent(articleSeed)}`
      return `<img src="${finalUrl}" alt="${altText}" style="display: block; max-width: 100%; height: auto; margin: 20px auto; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.06);" />`
    }

    return match
  })

  return updated
}

/**
 * SVG Data-URI 또는 SVG 코드를 2배수 레티나(2x Retina) 초고해상도 순수 PNG(Base64)로 변환 (흰색 배경 보장)
 */
export function svgToPngDataUrl(svgSrc: string): Promise<string> {
  return new Promise((resolve) => {
    try {
      let cleanSvg = svgSrc

      // 1. data-uri에서 순수 SVG 문자열 추출 및 디코딩
      if (cleanSvg.includes('data:image/svg+xml')) {
        const commaIdx = cleanSvg.indexOf(',')
        if (commaIdx !== -1) {
          const rawPart = cleanSvg.substring(commaIdx + 1)
          try {
            cleanSvg = decodeURIComponent(rawPart)
          } catch {
            cleanSvg = rawPart
          }
        }
      }

      // 2. 어두운 배경/텍스트 보정 (라이트 모드 고대비 보장)
      cleanSvg = cleanSvg
        .replace(/fill=['"](#000000|#0f172a|#111827|black)['"]/gi, "fill='#0F172A'")
        .replace(/<rect([^>]*?)fill=['"](#000000|#0f172a|#111827|black)['"]/gi, "<rect$1fill='#F8FAFC'")

      // 3. 치수(viewBox) 파싱하여 정확한 원본 크기 추출
      let width = 800
      let height = 450
      const vbMatch = cleanSvg.match(/viewBox=['"]\s*0\s+0\s+(\d+)\s+(\d+)\s*['"]/i)
      if (vbMatch) {
        width = parseInt(vbMatch[1], 10)
        height = parseInt(vbMatch[2], 10)
      } else {
        const wMatch = cleanSvg.match(/width=['"](\d+)['"]/i)
        const hMatch = cleanSvg.match(/height=['"](\d+)['"]/i)
        if (wMatch && hMatch) {
          width = parseInt(wMatch[1], 10)
          height = parseInt(hMatch[2], 10)
        }
      }

      // 4. 필수 SVG 네임스페이스 및 명시적 width/height 보장
      if (!cleanSvg.includes('xmlns=')) {
        cleanSvg = cleanSvg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"')
      }
      if (!cleanSvg.includes('width=')) {
        cleanSvg = cleanSvg.replace('<svg', `<svg width="${width}" height="${height}"`)
      }

      // 5. Blob URL 생성
      const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' })
      const blobUrl = URL.createObjectURL(blob)

      const img = new Image()
      img.crossOrigin = 'anonymous'

      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          // 2x Retina 스케일 적용 (1600px 초고해상도)
          const scale = 2
          canvas.width = width * scale
          canvas.height = height * scale

          const ctx = canvas.getContext('2d')
          if (ctx) {
            // [검은 화면 원천 차단] 캔버스 바닥에 솔리드 화이트(#FFFFFF) 베이스 강제 주입
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            ctx.imageSmoothingEnabled = true
            ctx.imageSmoothingQuality = 'high'
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
            const pngData = canvas.toDataURL('image/png')
            URL.revokeObjectURL(blobUrl)
            resolve(pngData)
          } else {
            URL.revokeObjectURL(blobUrl)
            resolve(svgSrc)
          }
        } catch {
          URL.revokeObjectURL(blobUrl)
          resolve(svgSrc)
        }
      }

      img.onerror = () => {
        URL.revokeObjectURL(blobUrl)
        resolve(svgSrc)
      }

      img.src = blobUrl
    } catch {
      resolve(svgSrc)
    }
  })
}

/**
 * HTML 내의 모든 카드 이미지를 절대 공개 HTTPS URL로 정규화하고,
 * 레거시 SVG 카드가 있는 경우 2x PNG로 렌더링/업로드 수행
 */
export async function preUploadCardImages(
  htmlContent: string
): Promise<{ updatedHtml: string; totalUploaded: number }> {
  if (!htmlContent || typeof window === 'undefined') {
    return { updatedHtml: htmlContent, totalUploaded: 0 }
  }

  try {
    // 0. 마크다운 태그 및 빈 이미지 자동 복구 선제 적용
    const processedHtml = processPostInfographics(htmlContent)

    const parser = new DOMParser()
    const doc = parser.parseFromString(processedHtml, 'text/html')
    const images = Array.from(doc.querySelectorAll('img'))

    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      window.location.origin

    let totalUploaded = 0

    // 1. 상대 경로(/api/card-image/...)를 절대 공개 HTTPS URL로 정규화 및 SEO Alt 태그 보장
    images.forEach((img) => {
      let src = img.getAttribute('src') || ''
      let alt = img.getAttribute('alt') || ''

      if (!alt || alt.trim() === '' || alt === '블로그 핵심 인포그래픽') {
        const urlMatch = src.match(/type=([A-Z_]+)/i)
        const cardType = urlMatch ? (urlMatch[1].toUpperCase() as CardType) : determineCardType(alt || src)
        const cardNameKr = CARD_TYPE_KOREAN_NAMES[cardType] || '핵심 인포그래픽'
        img.setAttribute('alt', `${cardNameKr}`)
      }

      if (src.startsWith('/api/card-image/')) {
        src = `${origin}${src}`
        img.setAttribute('src', src)
        img.style.display = 'block'
        img.style.maxWidth = '100%'
        img.style.height = 'auto'
        img.style.margin = '20px auto'
        img.style.borderRadius = '14px'
        img.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
      }
    })

    // 1-2. 네이버 스마트에디터 ONE 붙여넣기 시 H2 22px 대제목 및 P 16px 본문 크기 100% 보장
    const h2Elements = Array.from(doc.querySelectorAll('h2'))
    h2Elements.forEach((h2) => {
      h2.style.fontSize = '22px'
      h2.style.fontWeight = 'bold'
      h2.style.color = '#0F172A'
      h2.style.margin = '36px 0 16px 0'
      h2.style.borderBottom = '2px solid #E2E8F0'
      h2.style.paddingBottom = '8px'
    })

    const pElements = Array.from(doc.querySelectorAll('p'))
    pElements.forEach((p) => {
      if (!p.style.fontSize) {
        p.style.fontSize = '16px'
        p.style.lineHeight = '1.85'
        p.style.margin = '16px 0'
        p.style.color = '#1F2937'
      }
    })

    // 2. 레거시 SVG Data-URI 이미지가 있는 경우에만 백그라운드 업로드 수행
    const targetImages = images.filter((img) => {
      const src = img.getAttribute('src') || ''
      if (src.includes('/api/card-image/')) return false
      return src.startsWith('data:image/') || src.includes('<svg') || src.includes('data:image/svg+xml')
    })

    if (targetImages.length > 0) {
      const timestamp = Date.now()

      await Promise.all(
        targetImages.map(async (img, idx) => {
          const originalSrc = img.getAttribute('src') || ''
          const alt = img.getAttribute('alt') || '블로그 핵심 요약 카드'
          const cardId = `card_${timestamp}_${idx}_${Math.random().toString(36).substring(2, 7)}`

          try {
            const pngDataUrl = await svgToPngDataUrl(originalSrc)

            const res = await fetch('/api/card-image/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id: cardId,
                imageBase64: pngDataUrl,
                mimeType: 'image/png',
              }),
            })

            if (res.ok) {
              const data = await res.json()
              const finalUrl = data.url || `${origin}/api/card-image/${cardId}.png`

              img.setAttribute('src', finalUrl)
              img.setAttribute('alt', alt)
              img.style.display = 'block'
              img.style.maxWidth = '100%'
              img.style.height = 'auto'
              img.style.margin = '20px auto'
              img.style.borderRadius = '14px'
              img.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
              totalUploaded++
            }
          } catch (uploadErr) {
            console.warn(`Legacy card image upload failed for index ${idx}:`, uploadErr)
          }
        })
      )
    }

    return {
      updatedHtml: doc.body.innerHTML,
      totalUploaded,
    }
  } catch (err) {
    console.error('preUploadCardImages error:', err)
    return { updatedHtml: htmlContent, totalUploaded: 0 }
  }
}
