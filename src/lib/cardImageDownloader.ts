/**
 * 본문 HTML 내의 인포그래픽 카드뉴스 이미지 일괄 다운로드 헬퍼
 * - 브라우저에서 외부 프로그램 설치 없이 1080px 고화질 카드를 즉시 다운로드 폴더로 저장
 * - 다운로드된 이미지를 네이버 스마트에디터로 드래그 앤 드롭 시 네이버 정규 사진(se-module-image)으로 100% 인식
 */

export interface ExtractedCardImage {
  src: string
  alt: string
  index: number
}

/**
 * HTML 본문에서 모든 카드 이미지 추출
 */
export function extractCardImagesFromHtml(html: string): ExtractedCardImage[] {
  if (!html || typeof window === 'undefined') return []

  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const imgs = Array.from(doc.querySelectorAll('img'))

    const origin = window.location.origin
    const cardImages: ExtractedCardImage[] = []

    imgs.forEach((img, idx) => {
      let src = img.getAttribute('src') || ''
      const alt = img.getAttribute('alt') || `카드_${idx + 1}`

      if (!src) return

      // 상대 경로를 절대 경로로 정규화
      if (src.startsWith('/')) {
        src = `${origin}${src}`
      }

      // 카드 이미지 또는 data-uri 이미지 선별
      if (src.includes('/api/card-image/') || src.startsWith('data:image/') || src.includes('card_')) {
        cardImages.push({
          src,
          alt: alt.replace(/[\\/:*?"<>|]/g, '_').trim(),
          index: idx + 1
        })
      }
    })

    return cardImages
  } catch (err) {
    console.error('extractCardImagesFromHtml error:', err)
    return []
  }
}

/**
 * 카드 이미지 1장을 클립보드에 순수 이미지(image/png Blob)로 복사
 * - 네이버 스마트에디터에서 Ctrl+V 누르면 네이버 정규 사진으로 즉시 자동 업로드됨
 */
export async function copySingleCardImageToClipboard(src: string): Promise<boolean> {
  if (typeof window === 'undefined' || !navigator.clipboard || !window.ClipboardItem) {
    throw new Error('클립보드 API가 지원되지 않는 브라우저입니다.')
  }

  try {
    const res = await fetch(src)
    const blob = await res.blob()
    
    // PNG 형식으로 보장
    let pngBlob = blob
    if (blob.type !== 'image/png') {
      pngBlob = new Blob([blob], { type: 'image/png' })
    }

    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': pngBlob
      })
    ])

    return true
  } catch (err) {
    console.error('copySingleCardImageToClipboard error:', err)
    return false
  }
}

/**
 * 모든 카드 이미지를 브라우저 다운로드 폴더로 순차 다운로드
 */
export async function downloadAllCardImages(
  html: string,
  postTitle: string = '블로그카드'
): Promise<number> {
  const images = extractCardImagesFromHtml(html)
  if (images.length === 0) return 0

  const safeTitle = postTitle.replace(/[\\/:*?"<>|]/g, '_').slice(0, 20).trim() || '사건칼럼'

  for (let i = 0; i < images.length; i++) {
    const item = images[i]
    try {
      const res = await fetch(item.src)
      const blob = await res.blob()
      const blobUrl = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = blobUrl
      a.download = `${safeTitle}_카드${item.index}_${item.alt || '인포그래픽'}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)

      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)

      // 브라우저 다운로드 스로틀 방지 (200ms 지연)
      if (i < images.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 200))
      }
    } catch (err) {
      console.warn(`Card image download failed for index ${i}:`, err)
    }
  }

  return images.length
}
