import * as cheerio from 'cheerio';
import { unstable_cache } from 'next/cache';

export interface ScrapedData {
  averageTextLength: number;
  recommendedTextLength: number;
  averageImageCount: number;
  commonHeaders: string[];
  imageContexts: string[];
  recommendedComponents: {
    useTable: boolean;
    useQuote: boolean;
    useDivider: boolean;
  };
}

const MOBILE_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9',
  'Referer': 'https://m.search.naver.com/',
};

async function scrapeNaverSerpContextImpl(keyword: string): Promise<ScrapedData | null> {
  try {
    // 1. 네이버 블로그 탭 검색 (where=blog 및 where=m_blog 호환)
    const searchUrl = `https://search.naver.com/search.naver?where=blog&sm=tab_jum&query=${encodeURIComponent(keyword)}`;
    const searchRes = await fetch(searchUrl, {
      headers: MOBILE_HEADERS,
      signal: AbortSignal.timeout(2000),
      next: { revalidate: 3600 },
    });

    if (!searchRes.ok) return null;

    const searchHtml = await searchRes.text();
    const $ = cheerio.load(searchHtml);

    // 2. 실제 블로그 포스팅 링크 상위 5개 추출
    const blogLinks: { blogId: string; logNo: string }[] = [];
    const seenLinks = new Set<string>();

    $('a[href*="blog.naver.com"]').each((_, el) => {
      const href = $(el).attr('href');
      if (!href) return;

      try {
        const urlObj = new URL(href);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        let blogId = '';
        let logNo = '';

        if (urlObj.searchParams.has('logNo')) {
          blogId = pathParts[0] || '';
          logNo = urlObj.searchParams.get('logNo') || '';
        } else if (pathParts.length >= 2 && /^\d+$/.test(pathParts[1])) {
          blogId = pathParts[0];
          logNo = pathParts[1];
        }

        if (blogId && logNo && !seenLinks.has(`${blogId}_${logNo}`) && blogLinks.length < 5) {
          seenLinks.add(`${blogId}_${logNo}`);
          blogLinks.push({ blogId, logNo });
        }
      } catch {
        // invalid URL skip
      }
    });

    if (blogLinks.length === 0) {
      return null;
    }

    // 3. 상위 5개 블로그 본문 병렬 비동기 조회 (Promise.all + 2초 타임아웃)
    const postResults = await Promise.all(
      blogLinks.map(async ({ blogId, logNo }) => {
        try {
          // 데스크톱 iframe 회피: 모바일 URL(m.blog.naver.com)로 직접 조회하여 스마트에디터 ONE 본문 100% 파싱
          const postUrl = `https://m.blog.naver.com/${blogId}/${logNo}`;
          const postRes = await fetch(postUrl, {
            headers: MOBILE_HEADERS,
            signal: AbortSignal.timeout(2000),
          });

          if (!postRes.ok) return null;

          const postHtml = await postRes.text();
          const $post = cheerio.load(postHtml);

          const mainContainer = $post('.se-main-container');
          if (!mainContainer.length) return null;

          const text = mainContainer.text().replace(/\s+/g, ' ').trim();
          const images = mainContainer.find('.se-image-resource, .se-image, img');
          const imageCount = images.length;

          const hasTable = mainContainer.find('.se-table, table').length > 0;
          const hasQuote = mainContainer.find('.se-quote, blockquote').length > 0;
          const hasDivider = mainContainer.find('.se-hr, hr').length > 0;

          const headers: string[] = [];
          mainContainer.find('.se-component-text').each((_, el) => {
            const isHeader =
              $post(el).hasClass('se-is-fs_24') ||
              $post(el).hasClass('se-is-fs_32') ||
              $post(el).find('h2, h3, h4, strong').length > 0;
            if (isHeader) {
              const headerText = $post(el).text().trim();
              if (headerText.length > 2 && headerText.length < 40) {
                headers.push(headerText);
              }
            }
          });

          return {
            textLength: text.length,
            imageCount,
            hasTable,
            hasQuote,
            hasDivider,
            headers,
          };
        } catch {
          return null;
        }
      })
    );

    const validPosts = postResults.filter((p): p is NonNullable<typeof p> => p !== null && p.textLength > 300);

    if (validPosts.length === 0) {
      return null;
    }

    const totalTextLength = validPosts.reduce((acc, cur) => acc + cur.textLength, 0);
    const totalImageCount = validPosts.reduce((acc, cur) => acc + cur.imageCount, 0);
    const avgLength = Math.round(totalTextLength / validPosts.length);
    const avgImages = Math.round(totalImageCount / validPosts.length);

    const headersCount: Record<string, number> = {};
    let tableCount = 0;
    let quoteCount = 0;
    let dividerCount = 0;

    for (const post of validPosts) {
      if (post.hasTable) tableCount++;
      if (post.hasQuote) quoteCount++;
      if (post.hasDivider) dividerCount++;
      for (const h of post.headers) {
        headersCount[h] = (headersCount[h] || 0) + 1;
      }
    }

    const commonHeaders = Object.entries(headersCount)
      .sort((a, b) => b[1] - a[1])
      .map((entry) => entry[0])
      .slice(0, 5);

    return {
      averageTextLength: avgLength,
      // 상위 글 평균보다 300자 더 길고 풍부하게 작성 유도
      recommendedTextLength: Math.max(avgLength + 300, 2500),
      averageImageCount: Math.max(avgImages, 5),
      commonHeaders,
      imageContexts: [],
      recommendedComponents: {
        useTable: tableCount >= 1,
        useQuote: quoteCount >= 1,
        useDivider: dividerCount >= 1,
      },
    };
  } catch (error) {
    console.error('Scraping Naver SERP failed:', error);
    return null;
  }
}

export const scrapeNaverSerpContext = unstable_cache(
  async (keyword: string) => scrapeNaverSerpContextImpl(keyword),
  ['naver-serp-scrape-2026'],
  { revalidate: 3600 } // 1 hour cache
);

