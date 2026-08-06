import * as cheerio from 'cheerio';
import { unstable_cache } from 'next/cache';

export interface ScrapedData {
  averageTextLength: number;
  averageImageCount: number;
  commonHeaders: string[];
  imageContexts: string[];
  recommendedComponents: {
    useTable: boolean;
    useQuote: boolean;
    useDivider: boolean;
  }
}

async function scrapeNaverSerpContextImpl(keyword: string): Promise<ScrapedData | null> {
  try {
    // 1. Fetch Naver View (Blog) Search Results
    const searchUrl = `https://search.naver.com/search.naver?where=view&sm=tab_jum&query=${encodeURIComponent(keyword)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      next: { revalidate: 3600 }
    });
    
    if (!searchRes.ok) return null;
    
    const searchHtml = await searchRes.text();
    const $ = cheerio.load(searchHtml);
    
    // Extract top 5 blog links
    const blogLinks: string[] = [];
    $('.api_txt_lines.total_tit').each((i, el) => {
      const href = $(el).attr('href');
      if (href && href.includes('blog.naver.com') && blogLinks.length < 5) {
        blogLinks.push(href);
      }
    });

    if (blogLinks.length === 0) {
      return null;
    }

    let totalTextLength = 0;
    let totalImageCount = 0;
    const headersCount: Record<string, number> = {};
    const imageContexts: string[] = [];
    const componentUsage = { hasTable: 0, hasQuote: 0, hasDivider: 0 };

    // 2. Fetch and parse each blog post
    for (const link of blogLinks) {
      try {
        let blogId = '';
        let logNo = '';

        const urlObj = new URL(link);
        const pathParts = urlObj.pathname.split('/').filter(Boolean);
        
        if (urlObj.searchParams.has('logNo')) {
          blogId = pathParts[0];
          logNo = urlObj.searchParams.get('logNo') || '';
        } else if (pathParts.length >= 2) {
          blogId = pathParts[0];
          logNo = pathParts[1];
        }

        if (!blogId || !logNo) continue;

        const postUrl = `https://blog.naver.com/PostView.naver?blogId=${blogId}&logNo=${logNo}`;
        const postRes = await fetch(postUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        });

        if (!postRes.ok) continue;

        const postHtml = await postRes.text();
        const $post = cheerio.load(postHtml);
        
        const mainContainer = $post('.se-main-container');
        if (!mainContainer.length) continue;

        const text = mainContainer.text().replace(/\s+/g, ' ').trim();
        totalTextLength += text.length;

        const images = mainContainer.find('.se-image-resource, .se-image');
        totalImageCount += images.length;

        // UI Component Analysis
        if (mainContainer.find('.se-table').length > 0) componentUsage.hasTable++;
        if (mainContainer.find('.se-quote').length > 0) componentUsage.hasQuote++;
        if (mainContainer.find('.se-hr').length > 0) componentUsage.hasDivider++;

        images.each((i, el) => {
          if (imageContexts.length < 10) {
            let caption = $post(el).closest('.se-image').find('.se-caption').text().trim();
            if (!caption) {
               const prevText = $post(el).closest('.se-component').prev('.se-text').text().replace(/\s+/g, ' ').trim();
               if (prevText && prevText.length < 50) caption = prevText;
            }
            if (caption && caption.length > 2) {
              imageContexts.push(caption);
            }
          }
        });

        mainContainer.find('.se-component-text').each((i, el) => {
          const isHeader = $post(el).hasClass('se-is-fs_24') || $post(el).hasClass('se-is-fs_32') || $post(el).find('h2, h3, h4, strong').length > 0;
          if (isHeader) {
            let headerText = $post(el).text().trim();
            if (headerText.length > 2 && headerText.length < 30) {
               headersCount[headerText] = (headersCount[headerText] || 0) + 1;
            }
          }
        });
        
      } catch (err) {
        console.error('Error parsing blog post:', link, err);
      }
    }

    const count = blogLinks.length;
    if (count === 0) return null;

    const commonHeaders = Object.entries(headersCount)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 5);

    return {
      averageTextLength: Math.round(totalTextLength / count),
      averageImageCount: Math.round(totalImageCount / count),
      commonHeaders,
      imageContexts,
      recommendedComponents: {
        useTable: componentUsage.hasTable >= 2,
        useQuote: componentUsage.hasQuote >= 2,
        useDivider: componentUsage.hasDivider >= 2,
      }
    };

  } catch (error) {
    console.error('Scraping Naver SERP failed:', error);
    return null;
  }
}

export const scrapeNaverSerpContext = unstable_cache(
  async (keyword: string) => scrapeNaverSerpContextImpl(keyword),
  ['naver-serp-scrape'],
  { revalidate: 3600 } // 1 hour cache
);
