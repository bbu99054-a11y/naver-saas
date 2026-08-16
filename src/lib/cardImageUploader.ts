/**
 * [ZONE-4] 클라이언트 카드 이미지 2배수 초고화질 렌더링 & 영구 DB 사전 업로드 (Pre-upload) 엔진
 */

/**
 * SVG Data-URI 또는 SVG 코드를 2배수 레티나(2x Retina) 초고해상도 순수 PNG(Base64)로 변환
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
 * HTML 내의 모든 SVG 카드를 2x PNG로 렌더링하고, 개별 병렬 업로드하여 영구 HTTPS URL로 교체
 */
export async function preUploadCardImages(
  htmlContent: string
): Promise<{ updatedHtml: string; totalUploaded: number }> {
  if (!htmlContent || typeof window === 'undefined') {
    return { updatedHtml: htmlContent, totalUploaded: 0 }
  }

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, 'text/html')
    const images = Array.from(doc.querySelectorAll('img'))

    const targetImages = images.filter((img) => {
      const src = img.getAttribute('src') || ''
      // 이미 /api/card-image/ URL이 들어간 경우 스킵
      if (src.includes('/api/card-image/')) return false
      return src.startsWith('data:image/') || src.includes('<svg') || src.includes('data:image/svg+xml')
    })

    if (targetImages.length === 0) {
      return { updatedHtml: doc.body.innerHTML, totalUploaded: 0 }
    }

    const timestamp = Date.now()

    // 4. Vercel 페이로드 제한 방지: 개별 병렬 업로드 (Promise.all)
    await Promise.all(
      targetImages.map(async (img, idx) => {
        const originalSrc = img.getAttribute('src') || ''
        const alt = img.getAttribute('alt') || '블로그 핵심 요약 카드'
        const cardId = `card_${timestamp}_${idx}_${Math.random().toString(36).substring(2, 7)}`

        try {
          // 1. 2x Retina PNG 변환
          const pngDataUrl = await svgToPngDataUrl(originalSrc)

          // 2. 단일 카드 개별 POST 업로드
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
            const finalUrl = data.url || `${window.location.origin}/api/card-image/${cardId}.png`

            // 3. 네이버 스마트에디터 ONE 최적화 포맷팅 적용
            img.setAttribute('src', finalUrl)
            img.setAttribute('alt', alt)
            img.style.display = 'block'
            img.style.maxWidth = '100%'
            img.style.height = 'auto'
            img.style.margin = '20px auto'
            img.style.borderRadius = '14px'
            img.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)'
          }
        } catch (uploadErr) {
          console.warn(`Card image upload failed for index ${idx}:`, uploadErr)
        }
      })
    )

    return {
      updatedHtml: doc.body.innerHTML,
      totalUploaded: targetImages.length,
    }
  } catch (err) {
    console.error('preUploadCardImages error:', err)
    return { updatedHtml: htmlContent, totalUploaded: 0 }
  }
}
