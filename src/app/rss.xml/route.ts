import { blogPosts } from '@/lib/blogData'
import { INDUSTRY_PLACE_LIST } from '@/lib/industryPlaceData'

export const dynamic = 'force-static'

function escapeXml(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(dateInput: string): string {
  const parsed = new Date(dateInput)
  if (Number.isNaN(parsed.getTime())) {
    return new Date('2026-11-13T00:00:00.000Z').toUTCString()
  }
  return parsed.toUTCString()
}

export async function GET() {
  const baseUrl = 'https://www.postsyncapp.com'
  const buildDate = new Date('2026-11-13T09:00:00.000Z').toUTCString()

  const coreAndIndustryItems = [
    {
      title: '플레이스 순위 체크 무료 · 네이버 플레이스 순위 확인 & 1위 비교 | PostSync',
      link: `${baseUrl}/place`,
      description:
        '회원가입 없이 키워드와 상호명 입력만으로 네이버 플레이스 실시간 1~20위 순위와 1위 매장 대비 리뷰·예약·저장수 차이를 3초 만에 실측 진단합니다.',
      pubDate: buildDate,
      category: '무료 웹툴',
    },
    {
      title: '네이버 영수증 리뷰 QR코드 만들기 · 무료 매장 안내판 A6 바로 인쇄',
      link: `${baseUrl}/utm`,
      description:
        '테이블·카운터용 네이버 스마트플레이스 영수증 리뷰·저장하기·쿠폰 직행 QR코드와 인쇄용 A6 안내판을 10초 만에 제작합니다.',
      pubDate: buildDate,
      category: '무료 웹툴',
    },
    {
      title: '스마트플레이스 소개글 금칙어 검사 · 2,000자 무료 진단',
      link: `${baseUrl}/adcheck`,
      description:
        '의료법·변호사법·세무사법·식품표시광고법 기준 온라인 금칙어를 1초 만에 검사하고 안전 표현으로 치환합니다.',
      pubDate: buildDate,
      category: '무료 웹툴',
    },
    {
      title: '네이버 플레이스 AI 2,000자 소개글 · 리뷰 답글 · 새소식 생성기',
      link: `${baseUrl}/reply`,
      description:
        '상세설명 2,000자 초안과 영수증 리뷰 맞춤 답글 3종, 주간 새소식 공지를 회원가입 없이 무료로 작성합니다.',
      pubDate: buildDate,
      category: '무료 웹툴',
    },
    {
      title: 'ChatGPT·노션 네이버 블로그 서식 1초 변환기 (SmartEditor ONE)',
      link: `${baseUrl}/convert`,
      description:
        'ChatGPT·노션 마크다운 소제목과 표를 네이버 블로그 스마트에디터 ONE 깨짐 없는 HTML 서식으로 변환합니다.',
      pubDate: buildDate,
      category: '무료 웹툴',
    },
    {
      title: '2026 전문직 · 병의원 · 로컬 비즈니스 온라인 광고법 심의 백서',
      link: `${baseUrl}/guide/ad-law-2026`,
      description:
        '의료법 제56조, 변호사 광고규정, 세무사회 광고규정, 표시광고법 위반 사례와 안전 표현 기준 총정리.',
      pubDate: buildDate,
      category: '가이드 백서',
    },
    ...INDUSTRY_PLACE_LIST.map((ind) => ({
      title: ind.metaTitle,
      link: `${baseUrl}/place/${ind.slug}`,
      description: ind.answerFirstSummary,
      pubDate: buildDate,
      category: `업종별 진단 (${ind.shortName})`,
    })),
  ]

  const blogItems = [...blogPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => ({
      title: post.title,
      link: `${baseUrl}/blog/${post.slug}`,
      description: post.excerpt,
      pubDate: toRfc822(post.date),
      category: post.categoryLabel,
    }))

  const allItems = [...coreAndIndustryItems, ...blogItems]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>PostSync 플레이스 연구소 · 스마트플레이스 상위노출 &amp; 무료 웹툴 피드</title>
    <link>${baseUrl}</link>
    <description>네이버 스마트플레이스 실시간 순위 조회, 업종별 상위노출 진단 기준, 영수증 리뷰 QR 및 광고법 금칙어 실무 칼럼 최신 피드입니다.</description>
    <language>ko</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${allItems
  .map(
    (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
      <description>${escapeXml(item.description)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>`

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
