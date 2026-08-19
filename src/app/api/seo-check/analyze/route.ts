import { NextRequest, NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

interface AnalysisResponse {
  success: boolean
  message?: string
  post?: {
    title: string
    link: string
    pubDate: string
    blogId: string
    logNo?: string
  }
  score?: number
  resultType?: 'EXCELLENT' | 'NEEDS_IMPROVEMENT'
  badge?: string
  headline?: string
  subHeadline?: string
  salesPitch?: string
  ctaText?: string
  metrics?: {
    charCount: {
      withSpaces: number
      withoutSpaces: number
      status: 'good' | 'warning' | 'danger'
      message: string
      solution: string
    }
    keywordDensity: {
      topKeywords: Array<{ word: string; count: number; density: number }>
      status: 'good' | 'warning' | 'danger'
      message: string
      solution: string
    }
    imageCount: {
      count: number
      status: 'good' | 'warning' | 'danger'
      message: string
      solution: string
    }
    adLaw: {
      flaggedWords: string[]
      status: 'good' | 'danger'
      message: string
      solution: string
    }
  }
}

// 전문직(변호사, 세무사, 의료, 전문직종) 광고법 금지/주의 키워드 사전
const AD_LAW_PROHIBITED_WORDS = [
  '100% 승소',
  '100%승소',
  '완치',
  '최고의',
  '최고',
  '무조건',
  '단언컨대',
  '무죄 보장',
  '승소 보장',
  '승소율 1위',
  '국내 유일',
  '전국 1위',
  '업계 1위',
  '부작용 없는',
  '환불 보장',
  '완벽한 치료',
  '절대적',
  '최저가',
  '독보적'
]

// 불용어 (조사 및 일반 어미 등)
const STOP_WORDS = new Set([
  '이', '그', '저', '것', '수', '등', '들', '및', '에서', '그리고', '하지만', '대한',
  '통해', '위해', '경우', '때문', '관련', '내용', '확인', '진행', '작성', '방법',
  '네이버', '블로그', '포스팅', '오늘', '이번', '사진', '출처', '있습니다', '합니다',
  '입니다', '하는', '있는', '하면', '대해', '모든', '대한', '또한', '바로', '위한'
])

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const inputUrl = (body.url || '').trim()

    if (!inputUrl) {
      return NextResponse.json(
        { success: false, message: '네이버 블로그 주소를 입력해주세요.' },
        { status: 400 }
      )
    }

    // 1. blogId 및 logNo 파싱
    let blogId = ''
    let logNo = ''

    // 패턴 분석
    // 1) https://blog.naver.com/아이디/글번호
    // 2) https://m.blog.naver.com/아이디/글번호
    // 3) https://blog.naver.com/PostView.naver?blogId=아이디&logNo=글번호
    // 4) https://blog.naver.com/아이디
    // 5) 아이디 단독 입력
    const urlMatch = inputUrl.match(/blog\.naver\.com\/([a-zA-Z0-9_-]+)(?:\/(\d+))?/)
    const paramMatch = inputUrl.match(/blogId=([a-zA-Z0-9_-]+)(?:&logNo=(\d+))?/)

    if (urlMatch) {
      blogId = urlMatch[1]
      logNo = urlMatch[2] || ''
    } else if (paramMatch) {
      blogId = paramMatch[1]
      logNo = paramMatch[2] || ''
    } else if (/^[a-zA-Z0-9_-]+$/.test(inputUrl)) {
      blogId = inputUrl
    } else {
      return NextResponse.json(
        { success: false, message: '올바른 네이버 블로그 주소(blog.naver.com/아이디)를 입력해주세요.' },
        { status: 400 }
      )
    }

    if (blogId === 'PostView' || blogId === 'PostList') {
      const realId = inputUrl.match(/blogId=([a-zA-Z0-9_-]+)/)
      if (realId) blogId = realId[1]
    }

    // 2. RSS 피드로부터 최신 글 정보 가져오기
    const rssUrl = `https://rss.blog.naver.com/${blogId}.xml`
    let rssResponse: Response
    try {
      rssResponse = await fetch(rssUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        next: { revalidate: 0 }
      })
    } catch {
      return NextResponse.json(
        { success: false, message: '네이버 블로그 서버에 연결할 수 없습니다. 아이디를 다시 확인해주세요.' },
        { status: 404 }
      )
    }

    if (!rssResponse.ok) {
      return NextResponse.json(
        { success: false, message: '존재하지 않거나 비공개로 설정된 네이버 블로그입니다.' },
        { status: 404 }
      )
    }

    const rssXml = await rssResponse.text()
    const $rss = cheerio.load(rssXml, { xmlMode: true })
    const latestItem = $rss('item').first()

    if (!latestItem || latestItem.length === 0) {
      return NextResponse.json(
        { success: false, message: '해당 블로그에 공개된 최신 포스팅이 없습니다.' },
        { status: 404 }
      )
    }

    const postTitle = latestItem.find('title').text().trim() || '제목 없는 포스팅'
    const postLink = latestItem.find('link').text().trim() || `https://blog.naver.com/${blogId}`
    const postPubDate = latestItem.find('pubDate').text().trim() || ''
    const rssDescription = latestItem.find('description').text().trim() || ''

    // logNo 추출 (RSS 링크에서 추출 시도)
    if (!logNo) {
      const extractedLogNo = postLink.match(/(\d{8,})/)
      if (extractedLogNo) {
        logNo = extractedLogNo[1]
      }
    }

    // 3. 모바일 페이지 실본문 스크래핑 (요약본 잘림 방지)
    let fullText = ''
    let imageCount = 0

    if (logNo) {
      try {
        const mobileUrl = `https://m.blog.naver.com/${blogId}/${logNo}`
        const mobileRes = await fetch(mobileUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
          },
          next: { revalidate: 0 }
        })

        if (mobileRes.ok) {
          const mobileHtml = await mobileRes.text()
          const $mobile = cheerio.load(mobileHtml)

          // 스마트에디터 ONE 및 일반 뷰어 컨테이너 추출
          const mainContainer = $mobile('.se-main-container, .post_ct, #viewTypeSelector, .se_component_wrap, .post-view')
          if (mainContainer.length > 0) {
            // 이미지 개수
            imageCount = mainContainer.find('img').length
            // 텍스트 추출 (스크립트/스타일 제외)
            mainContainer.find('script, style').remove()
            fullText = mainContainer.text().replace(/\s+/g, ' ').trim()
          }
        }
      } catch (err) {
        console.warn('[SEO Check] Mobile parsing fallback:', err)
      }
    }

    // 모바일 본문 추출 실패 시 RSS description fallback
    if (!fullText || fullText.length < 50) {
      const $desc = cheerio.load(rssDescription)
      imageCount = $desc('img').length
      fullText = $desc.text().replace(/\s+/g, ' ').trim()
    }

    // 4. 텍스트 분석 알고리즘
    // 4-1. 글자 수 분석
    const charCountWithSpaces = fullText.length
    const charCountWithoutSpaces = fullText.replace(/\s+/g, '').length

    // 4-2. 단어 빈도 및 키워드 밀도 계산
    // 2글자 이상 한글/영문 단어 추출
    const words = fullText.match(/[가-힣a-zA-Z]{2,}/g) || []
    const wordFreq: Record<string, number> = {}

    words.forEach((w) => {
      const cleanWord = w.trim()
      if (cleanWord.length >= 2 && !STOP_WORDS.has(cleanWord)) {
        wordFreq[cleanWord] = (wordFreq[cleanWord] || 0) + 1
      }
    })

    const sortedWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)

    const totalWordCount = words.length || 1
    const topKeywords = sortedWords.map(([word, count]) => ({
      word,
      count,
      density: Number(((count / totalWordCount) * 100).toFixed(1))
    }))

    const maxDensity = topKeywords.length > 0 ? topKeywords[0].density : 0
    const maxDensityWord = topKeywords.length > 0 ? topKeywords[0].word : ''

    // 4-3. 전문직 광고법 금지어 매칭
    const flaggedWords: string[] = []
    const combinedContent = `${postTitle} ${fullText}`
    AD_LAW_PROHIBITED_WORDS.forEach((pw) => {
      if (combinedContent.includes(pw)) {
        flaggedWords.push(pw)
      }
    })

    // 5. 점수 산출 알고리즘 (100점 만점 기준)
    let score = 0

    // 글자 수 (최대 30점)
    let charScore = 0
    let charStatus: 'good' | 'warning' | 'danger' = 'good'
    let charMessage = ''
    let charSolution = ''

    if (charCountWithSpaces >= 1800) {
      charScore = 30
      charStatus = 'good'
      charMessage = `총 ${charCountWithSpaces.toLocaleString()}자(공백 제외 ${charCountWithoutSpaces.toLocaleString()}자)로 C-Rank 권장 분량(1,800자 이상)을 충분히 충족합니다.`
      charSolution = `고품질 장문 구조가 잘 유지되고 있습니다. PostSync를 이용하시면 이 분량을 단 1분 만에 판례 RAG로 자동 완성할 수 있습니다.`
    } else if (charCountWithSpaces >= 1200) {
      charScore = 20
      charStatus = 'warning'
      charMessage = `총 ${charCountWithSpaces.toLocaleString()}자로 상위 노출 기준(1,800자) 대비 다소 부족합니다. 경쟁 키워드에서 밀릴 위험이 있습니다.`
      charSolution = `PostSync의 [실무 판례 · 심층 지식 RAG 엔진]을 통해 부족한 전문 법률/사례 내용을 자연스럽게 2,000자 이상으로 보강할 수 있습니다.`
    } else {
      charScore = 10
      charStatus = 'danger'
      charMessage = `총 ${charCountWithSpaces.toLocaleString()}자로 분량이 매우 짧습니다. 네이버 알고리즘이 '단순 정보성 요약글'로 판단해 검색 누락 위험이 높습니다.`
      charSolution = `전문직 블로그는 최소 1,800자 이상의 깊이 있는 칼럼이 필수입니다. PostSync로 1인칭 실무 후킹 스토리와 판례를 채워 완벽한 분량을 만드세요.`
    }
    score += charScore

    // 키워드 밀도 (최대 25점)
    let keywordScore = 0
    let keywordStatus: 'good' | 'warning' | 'danger' = 'good'
    let keywordMessage = ''
    let keywordSolution = ''

    if (topKeywords.length === 0) {
      keywordScore = 10
      keywordStatus = 'warning'
      keywordMessage = '본문에서 명확한 타겟 핵심 키워드가 발견되지 않았습니다.'
      keywordSolution = 'PostSync의 [황금 키워드 자동 배분 시스템]으로 메인 키워드를 최적 비율로 배치하세요.'
    } else if (maxDensity > 5.0) {
      keywordScore = 10
      keywordStatus = 'danger'
      keywordMessage = `주요 키워드 '${maxDensityWord}'가 ${topKeywords[0].count}회(${maxDensity}%) 과다 반복되어 네이버 AI 도배(어뷰징) 필터에 걸릴 위험이 있습니다.`
      keywordSolution = `PostSync의 [중복 키워드 방어 시스템]은 키워드 밀도를 네이버가 가장 선호하는 3.5% 황금 비율로 균형 있게 분산 작성합니다.`
    } else if (maxDensity >= 2.0 && maxDensity <= 4.5) {
      keywordScore = 25
      keywordStatus = 'good'
      keywordMessage = `최상위 키워드 '${maxDensityWord}'가 ${topKeywords[0].count}회(${maxDensity}%)로 네이버 권장 황금 밀도(2.5~4.5%)를 완벽히 유지하고 있습니다.`
      keywordSolution = `키워드 밸런스가 훌륭합니다! PostSync를 활용하면 매번 계산할 필요 없이 황금 밀도가 100% 자동 유지됩니다.`
    } else {
      keywordScore = 18
      keywordStatus = 'warning'
      keywordMessage = `최상위 키워드 '${maxDensityWord}' 밀도가 ${maxDensity}%로 다소 낮아 네이버 검색 로봇이 메인 주제를 파악하기 어려울 수 있습니다.`
      keywordSolution = `PostSync AI는 제목, 서론, 소제목, 본문에 메인 키워드를 자연스럽게 배치해 검색 엔진 가중치를 극대화합니다.`
    }
    score += keywordScore

    // 이미지 개수 (최대 25점)
    let imageScore = 0
    let imageStatus: 'good' | 'warning' | 'danger' = 'good'
    let imageMessage = ''
    let imageSolution = ''

    if (imageCount >= 3) {
      imageScore = 25
      imageStatus = 'good'
      imageMessage = `본문 내 이미지 ${imageCount}장이 감지되어 모바일 독자의 스크롤 체류시간을 확보하기에 적합합니다.`
      imageSolution = `PostSync의 [스마트에디터 ONE 전용 인포그래픽 카드뉴스]를 결합하면 독자 체류시간(Dwell Time)을 2배 이상 끌어올릴 수 있습니다.`
    } else if (imageCount >= 1) {
      imageScore = 15
      imageStatus = 'warning'
      imageMessage = `이미지가 ${imageCount}장으로 다소 적습니다. 텍스트만 빽빽한 글은 모바일 독자의 이탈률(90%)을 높입니다.`
      imageSolution = `PostSync는 전문직 칼럼에 맞는 실사 인포그래픽과 서식형 도표 카드를 본문 작성과 동시에 자동 제작해 드립니다.`
    } else {
      imageScore = 5
      imageStatus = 'danger'
      imageMessage = `본문에 이미지가 없습니다. 이미지가 없는 글은 네이버 통합 검색 뷰(VIEW) 탭에서 썸네일 누락으로 클릭률이 급감합니다.`
      imageSolution = `PostSync는 클릭을 부르는 썸네일과 본문 맞춤형 인포그래픽을 1클릭으로 생성하여 스마트에디터에 바로 붙여넣게 해줍니다.`
    }
    score += imageScore

    // 광고법 안전도 (최대 20점)
    let adScore = 0
    let adStatus: 'good' | 'danger' = 'good'
    let adMessage = ''
    let adSolution = ''

    if (flaggedWords.length === 0) {
      adScore = 20
      adStatus = 'good'
      adMessage = '변호사법/의료법/세무사법상 제재 대상이 되는 위험 과장 문구가 발견되지 않았습니다. (100% 안전)'
      adSolution = 'PostSync는 2026 최신 전문직 광고 심의 가이드라인을 사전 학습하여 언제나 100% 합법 안전 문구만 산출합니다.'
    } else {
      adScore = 5
      adStatus = 'danger'
      adMessage = `광고 심의 위험 단어 [${flaggedWords.join(', ')}]가 검출되었습니다. 변호사협회 징계나 보건소 고발, 네이버 어뷰징 제재 대상이 될 수 있습니다.`
      adSolution = `PostSync는 '100% 승소', '완치' 등 위험 단어를 원천 차단하고, 신뢰감을 극대화하는 합법적 전문직 표현으로 자동 치환합니다.`
    }
    score += adScore

    // 6. 점수별 세일즈 메시지 분기 (85점 이상: 시간 절약 vs 85점 미만: 퀄리티 보정)
    const isHighScore = score >= 85
    const resultType: 'EXCELLENT' | 'NEEDS_IMPROVEMENT' = isHighScore ? 'EXCELLENT' : 'NEEDS_IMPROVEMENT'
    const badge = isHighScore ? '상위 5% 최적화 마스터' : 'SEO 개선 & 위험 보완 필요'

    const headline = isHighScore
      ? '🏆 네이버 상위노출 최적화 수준 우수! (상위 5%)'
      : '🚨 네이버 C-Rank 저품질 및 노출 누락 위험 감지'

    const subHeadline = isHighScore
      ? '완벽한 최적화 글입니다! 하지만 매번 작성하는데 1~2시간씩 걸리셨나요?'
      : '부족한 글자 수와 키워드 불균형, 광고법 위험 요소를 즉시 개선해야 합니다.'

    const salesPitch = isHighScore
      ? '글자 수, 키워드 밸런스, 포스팅 구조가 매우 훌륭합니다. 하지만 바쁜 본업 중에 매번 이런 고품질 글을 작성하려면 1~2시간의 귀중한 시간이 소모됩니다. PostSync AI를 사용하시면 대표님의 전문 지식과 판례를 결합하여 이 완벽한 퀄리티 그대로 [단 1분 만에] 완성할 수 있습니다.'
      : '네이버 검색 알고리즘은 분량 미달, 키워드 과다 도배(어뷰징), 광고법 위반 문구를 엄격히 감점합니다. PostSync의 [판례 RAG 엔진]과 [3.5% 황금 밀도 조절기]를 통해 다음 포스팅은 1분 만에 100점짜리 글로 완성해 보세요.'

    const ctaText = isHighScore
      ? '⚡ 포스팅 작성 시간 90% 단축하기 (3회 무료 체험)'
      : '🚀 PostSync 3회 무료로 100점짜리 글 작성하기'

    const responseData: AnalysisResponse = {
      success: true,
      post: {
        title: postTitle,
        link: postLink,
        pubDate: postPubDate,
        blogId,
        logNo
      },
      score,
      resultType,
      badge,
      headline,
      subHeadline,
      salesPitch,
      ctaText,
      metrics: {
        charCount: {
          withSpaces: charCountWithSpaces,
          withoutSpaces: charCountWithoutSpaces,
          status: charStatus,
          message: charMessage,
          solution: charSolution
        },
        keywordDensity: {
          topKeywords,
          status: keywordStatus,
          message: keywordMessage,
          solution: keywordSolution
        },
        imageCount: {
          count: imageCount,
          status: imageStatus,
          message: imageMessage,
          solution: imageSolution
        },
        adLaw: {
          flaggedWords,
          status: adStatus,
          message: adMessage,
          solution: adSolution
        }
      }
    }

    return NextResponse.json(responseData)
  } catch (error: any) {
    console.error('[SEO Check API Error]:', error)
    return NextResponse.json(
      {
        success: false,
        message: '블로그 분석 중 오류가 발생했습니다. 블로그 주소를 확인 후 다시 시도해 주세요.'
      },
      { status: 500 }
    )
  }
}
