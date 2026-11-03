import { NextResponse } from 'next/server';
import { getClientIp, checkIpRateLimit } from '@/lib/rateLimit';

interface ReplyRequest {
  storeName?: string;
  customerReview?: string;
  keyword?: string;
  tone?: 'friendly' | 'polite' | 'witty' | 'complaint';
  mode?: 'review' | 'news' | 'intro';
}

function generateFallbackReplies(store: string, review: string, kw: string, tone: string) {
  const storeLabel = store || '저희 매장';
  const kwSnippet = kw ? `${kw}을(를) 찾아주신 ` : '';

  if (tone === 'complaint') {
    return [
      {
        type: '정중·사과형',
        text: `안녕하세요 고객님, ${storeLabel} 대표입니다.\n먼저 소중한 발걸음 해주셨음에도 만족스러운 경험을 드리지 못해 진심으로 고개 숙여 사과드립니다. 남겨주신 말씀은 전 직원과 공유하여 즉시 서비스 개선 및 재발 방지 조치를 완료하겠습니다. 다음 방문 시에는 훨씬 더 나아진 모습으로 보답하겠습니다. 죄송하고 감사합니다.`
      },
      {
        type: '원인공유·개선형',
        text: `고객님 안녕하세요, ${storeLabel}입니다.\n솔직하고 정성 어린 피드백 남겨주셔서 감사드립니다. 지적해 주신 부분은 매장 운영에 있어 가장 중요한 개선 과제로 삼고 조치하고 있습니다. 부족했던 점 너그러운 양해 부탁드리며, 다시 찾아주실 때는 더욱 편안하고 만족스러운 시간 보내실 수 있도록 최선을 다하겠습니다.`
      },
      {
        type: '재방문보상·경청형',
        text: `안녕하세요, ${storeLabel} 매니저입니다.\n방문 중 불편을 겪으시게 하여 마음이 무겁습니다. 고객님의 애정 어린 쓴소리를 거울삼아 위생과 서비스 품질을 다시 한번 철저히 점검하겠습니다. 다음 방문 시 매장으로 미리 말씀해 주시면 더욱 신경 써서 모시겠습니다. 진심으로 죄송합니다.`
      }
    ];
  }

  if (tone === 'witty') {
    return [
      {
        type: '센스·위트형',
        text: `우와 고객님! 남겨주신 영수증 리뷰 읽고 ${storeLabel} 전 직원이 광대 승천했습니다! 😆 ${kwSnippet}귀한 발걸음 감사드리며, 다음엔 더 맛있는 텐션과 따뜻한 서비스로 모실게요! 오늘도 행복한 하루 보내세요 💖`
      },
      {
        type: '흥미·친근형',
        text: `칭찬은 ${storeLabel}도 춤추게 만듭니다! 💃 소중한 리뷰 남겨주셔서 오늘 하루 피로가 싹 날아갔어요. 저희 단골 VIP 고객님으로 마음속에 찜해두었습니다! 조만간 또 뵙길 기대할게요 ☕✨`
      },
      {
        type: '감동·유쾌형',
        text: `이렇게 정성껏 리뷰를 남겨주시다니 정말 감동입니다! 고객님의 칭찬 한마디가 저희에겐 가장 큰 보약이에요. ${kw ? `${kw} 최고 매장이 될 수 있도록 ` : ''}언제나 초심 잃지 않고 열심히 뛰겠습니다!`
      }
    ];
  }

  if (tone === 'polite') {
    return [
      {
        type: '정중·격조형',
        text: `안녕하십니까, ${storeLabel} 대표입니다.\n귀한 시간 내어 저희 매장을 찾아주시고, 정성 어린 리뷰까지 남겨주셔서 깊이 감사드립니다. ${kwSnippet}고객님께 늘 변함없는 품질과 최선의 서비스를 선사할 수 있도록 전 직원이 성심을 다하겠습니다. 늘 건강과 평안이 함께하시길 기원합니다.`
      },
      {
        type: '신뢰·전문형',
        text: `안녕하세요, ${storeLabel}입니다.\n저희 공간에서의 경험이 기분 좋은 시간으로 기억되신 것 같아 보람을 느낍니다. 앞으로도 ${kw ? `${kw} 대표 명소로서 ` : ''}정직한 재료와 한결같은 정성으로 보답하겠습니다. 소중한 인연에 감사드립니다.`
      },
      {
        type: '정성·감사형',
        text: `소중한 방문자 리뷰를 남겨주셔서 머리 숙여 감사드립니다.\n${storeLabel}을(를) 선택해 주신 고객님의 믿음에 부응할 수 있도록 매 순간 최선을 다하겠습니다. 언제든 편안한 휴식과 만족이 필요하실 때 다시 찾아주십시오. 정성을 다해 모시겠습니다.`
      }
    ];
  }

  // Default: friendly
  return [
    {
      type: '정성·감동형',
      text: `안녕하세요 고객님! ${storeLabel}입니다 😊\n소중한 방문에 이어 이렇게 따뜻한 영수증 리뷰까지 남겨주셔서 정말 큰 힘이 됩니다! ${kwSnippet}언제 찾아주셔도 한결같이 만족스러운 맛과 서비스를 느끼실 수 있도록 정성을 다하겠습니다. 늘 행복한 일만 가득하세요! 감사합니다 ✨`
    },
    {
      type: '친근·재방문형',
      text: `방문해 주셔서 진심으로 감사드려요, 고객님! 🥰\n저희 매장에서 즐거운 시간 보내셨다니 정말 뿌듯합니다. 네이버 플레이스에서 '쿠폰' 받으시면 다음 방문 시에도 혜택을 챙겨 받으실 수 있으니 꼭 기억해 주세요! 조만간 반가운 얼굴로 다시 뵙겠습니다 🎈`
    },
    {
      type: '간결·임팩트형',
      text: `감사합니다 고객님! 남겨주신 소중한 별점과 리뷰에 보답할 수 있도록, ${kw ? `${kw} 대표 매장으로서 ` : ''}늘 신선한 재료와 친절한 서비스로 기다리고 있겠습니다. 오늘도 기분 좋은 하루 보내세요! 🌿`
    }
  ];
}

function generateFallbackNews(store: string, topic: string, kw: string) {
  const storeLabel = store || '저희 매장';
  const topicLabel = topic || '이번 주 새로운 소식 및 이벤트';
  const kwSnippet = kw ? ` [${kw}]` : '';

  return {
    title: `📢 ${storeLabel}${kwSnippet} ${topicLabel} 안내드립니다!`,
    content: `안녕하세요, 고객 여러분! ${storeLabel}입니다.\n\n` +
      `어느덧 새로운 한 주가 시작되었습니다. 이번 주 저희 매장을 찾아주시는 고객님들을 위해 기분 좋은 소식을 전해드립니다.\n\n` +
      `✨ [이 주의 안내 사항]\n` +
      `• ${topicLabel}\n` +
      `• 네이버 플레이스 [저장하기] 누르시면 시원한 음료 또는 추가 혜택 쿠폰을 즉시 이용하실 수 있습니다.\n` +
      `• 당일 방문 전 [네이버 실시간 예약]을 이용하시면 대기 없이 더욱 쾌적하게 이용 가능합니다.\n\n` +
      `늘 정성을 다해 고객님을 맞이하겠습니다. ${kw ? `${kw}에서 ` : ''}따뜻하고 특별한 시간 보내러 오세요!\n\n` +
      `📍 위치: 네이버 지도에서 '${storeLabel}' 검색`,
    hashtags: ['스마트플레이스', storeLabel.replace(/\s+/g, ''), kw ? kw.replace(/\s+/g, '') : '동네맛집', '네이버예약', '단골이벤트']
  };
}

function generateFallbackIntro(store: string, strengths: string, kw: string) {
  const storeLabel = store || '우리 매장';
  const kwLabel = kw || '지역 대표 매장';
  const customPoints = strengths
    ? strengths.split(/\n|,|·/).map(s => s.trim()).filter(Boolean)
    : ['당일 엄선한 최상급 재료와 원칙을 지키는 정직한 품질', '쾌적하고 아늑한 공간 구성으로 모임·데이트·혼자 방문 모두 편안한 분위기', '네이버 실시간 예약 및 플레이스 저장 쿠폰을 통한 대기 없는 스마트 이용'];

  const fullText = [
    `[${kwLabel}] 고객님의 소중한 일상에 특별한 만족을 더하는 '${storeLabel}'에 오신 것을 환영합니다.`,
    `수많은 곳 중에서도 ${kwLabel}을(를) 검색해 저희 ${storeLabel}을(를) 찾아주신 고객님께 후회 없는 선택이 될 수 있도록 매일 기본과 정성을 다하고 있습니다.`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 1. 왜 '${storeLabel}'이어야 할까요? (핵심 약속 3가지)`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    ...customPoints.map((pt, i) => `✔ [약속 0${i + 1}] ${pt}`),
    `저희는 일시적인 유행이나 과장된 홍보보다 한 번 방문하신 고객님이 지인, 가족과 함께 다시 찾고 싶은 '${kwLabel}'의 기준점이 되는 것을 최우선 가치로 삼고 있습니다. 보이지 않는 위생 관리부터 작은 응대 디테일까지 대표가 직접 꼼꼼히 점검합니다.`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 2. 이런 분들에게 '${storeLabel}' 방문을 강력히 추천합니다`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `• ${kwLabel} 인근에서 실패 없는 검증된 품질과 세심한 서비스를 찾으시는 분`,
    `• 소중한 사람과의 만남, 가족 외식, 비즈니스 미팅 또는 온전한 휴식이 필요하신 분`,
    `• 복잡한 대기 없이 네이버 실시간 예약으로 원하는 시간대에 편안하게 이용하고 싶으신 분`,
    `• 정찰제 안내와 깔끔한 매장 환경에서 기분 좋은 시간을 보내고 싶으신 분`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 3. 네이버 플레이스 고객 전용 100% 혜택 & 스마트 이용 가이드`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🎁 [혜택 1] 플레이스 '저장하기(★)' 및 쿠폰 혜택`,
    `지금 보고 계신 네이버 스마트플레이스 화면에서 [저장하기]를 누르시고 쿠폰함을 확인해 보세요. 방문 고객님께 드리는 기분 좋은 웰컴 혜택을 즉시 다운로드하실 수 있습니다.`,
    ``,
    `🎁 [혜택 2] 영수증 포토 리뷰 이벤트 상시 진행`,
    `이용 후 매장 내 비치된 QR코드를 스캔하여 생생한 방문자 포토 리뷰를 남겨주시면 감사의 마음을 담아 현장 혜택을 제공해 드립니다. 고객님이 남겨주시는 한 줄의 리뷰는 저희 ${storeLabel}이(가) 더 나은 품질로 발전하는 가장 큰 원동력입니다.`,
    ``,
    `📅 [혜택 3] 네이버 실시간 예약 & 톡톡 1:1 빠른 문의`,
    `피크타임이나 주말에도 기다림 없이 바로 안내받으실 수 있도록 [네이버 예약]을 운영하고 있습니다. 단체 방문, 사전 요청 사항, 주차 및 이용 문의는 언제든 [네이버 톡톡]이나 대표번호로 연락 주시면 가장 빠르고 친절하게 안내해 드리겠습니다.`,
    ``,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📌 4. 찾아오시는 길 및 방문 전 체크리스트`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `• 상호명: ${storeLabel}`,
    `• 주요 키워드: ${kwLabel} / 네이버 지도에서 '${storeLabel}'을(를) 검색하시면 가장 빠른 길찾기 안내를 받으실 수 있습니다.`,
    `• 쾌적한 이용을 위해 방문 전 영업시간 및 새소식 탭의 주간 공지사항을 확인해 주시면 더욱 편리합니다.`,
    ``,
    `오늘도 저희 ${storeLabel}을(를) 찾아주시는 모든 분의 발걸음에 진심으로 감사드리며, 언제 방문하셔도 변함없는 감동과 만족을 드릴 것을 약속드립니다. 감사합니다!`
  ].join('\n');

  const baseKw = kw ? kw.replace(/\s+/g, '') : '플레이스추천';
  const cleanStore = storeLabel.replace(/\s+/g, '');

  return {
    oneLineIntro: `${kwLabel} 정직한 품질과 세심한 서비스로 보답하는 ${storeLabel}입니다. 네이버 예약 및 저장 쿠폰 혜택을 지금 만나보세요.`,
    fullDescription: fullText,
    charCount: fullText.length,
    recommendedKeywords: [
      kw || storeLabel,
      `${baseKw}추천`,
      `${baseKw}예약`,
      cleanStore,
      `${baseKw}인기`
    ].slice(0, 5)
  };
}

export async function POST(req: Request) {
  try {
    const clientIp = getClientIp(req);
    const ipCheck = checkIpRateLimit(clientIp, 12, 60000);
    if (!ipCheck.allowed) {
      return NextResponse.json(
        { error: `요청이 너무 빈번합니다. ${ipCheck.remainingSec}초 후 다시 시도해 주세요.` },
        { status: 429 }
      );
    }

    const body: ReplyRequest = await req.json().catch(() => ({}));
    const store = String(body.storeName || '').trim().slice(0, 50);
    const review = String(body.customerReview || '').trim().slice(0, 500);
    const kw = String(body.keyword || '').trim().slice(0, 40);
    const tone = body.tone || 'friendly';
    const mode = body.mode || 'review';

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      // Fallback Engine
      if (mode === 'intro') {
        const intro = generateFallbackIntro(store, review, kw);
        return NextResponse.json({ success: true, mode: 'intro', data: intro });
      }
      if (mode === 'news') {
        const news = generateFallbackNews(store, review, kw);
        return NextResponse.json({ success: true, mode: 'news', data: news });
      }
      const replies = generateFallbackReplies(store, review, kw, tone);
      return NextResponse.json({ success: true, mode: 'review', data: replies });
    }

    // Call Gemini 2.5 Flash with safe timeout
    const prompt = mode === 'intro'
      ? `너는 대한민국 네이버 스마트플레이스 상위노출 SEO 전문 카피라이터이다.
매장명: "${store || '우리 매장'}"
타깃 검색 키워드: "${kw || '지역 대표 매장'}"
매장 핵심 강점/특징: "${review || '엄선된 재료, 쾌적한 공간, 네이버 예약 및 쿠폰 혜택'}"

네이버 스마트플레이스 [상세설명(소개글)] 2,000자 규격에 최적화된 원고를 작성하라.
조건:
1. 첫 3줄 안에 타깃 검색 키워드와 매장명을 자연스럽게 배치하여 검색 적합도와 클릭 후킹을 극대화하라.
2. 매장의 핵심 강점, 추천 대상, 네이버 예약·저장 쿠폰·영수증 리뷰 혜택, 찾아오시는 길 안내를 소제목과 구분선으로 가독성 높게 구성하라(공백 포함 1,200~1,900자).
3. 과장·절대적 표현(최고, 1위, 최초, 완치 등 법정 금칙어)을 절대 사용하지 마라.
4. 아래 JSON 형식만 순수 반환하라(마크다운 백틱 제외):
{"oneLineIntro":"한줄 소개(120자 이내)","fullDescription":"상세설명 본문","recommendedKeywords":["대표키워드1","대표키워드2","대표키워드3","대표키워드4","대표키워드5"]}`
      : mode === 'news'
      ? `너는 대한민국 네이버 스마트플레이스 전문 마케터이자 사장님 대변인이다.
매장명: "${store || '우리 매장'}"
새소식 주제/내용: "${review || '이번 주 특별 할인 및 제철 재료 안내'}"
타깃 검색 키워드: "${kw || '지역 맛집/전문점'}"

네이버 스마트플레이스 [새소식]에 등록할 고품질 게시글을 작성하라.
조건:
1. 검색 로봇(Yeti)의 키워드 적합도 점수와 손님의 클릭률을 극대화하라.
2. 네이버 예약이나 플레이스 저장 쿠폰 혜택을 자연스럽게 언급하라.
3. 이모지와 불릿포인트를 적절히 섞어 모바일 가독성을 높여라.
4. 아래 JSON 형식만 반환하라(마크다운 백틱 제외):
{"title":"제목(30자 이내)","content":"본문(300~500자)","hashtags":["태그1","태그2","태그3"]}`
      : `너는 대한민국 네이버 스마트플레이스 전문 마케터이다.
매장명: "${store || '우리 매장'}"
고객 영수증 리뷰: "${review || '음식도 맛있고 직원분들도 친절해서 정말 좋았습니다. 다음에도 또 올게요!'}"
타깃 키워드(답글에 자연스럽게 녹일 것): "${kw || ''}"
답변 톤앤매너: "${tone}" (friendly: 친근하고 다정한, polite: 정중하고 격조있는, witty: 재치있고 센스있는, complaint: 불만 사항에 대해 정중히 사과하고 신뢰를 회복하는)

고객의 리뷰에 달아줄 서로 다른 3가지 스타일의 답글을 작성하라.
조건:
1. 복사-붙여넣기 느낌을 지양하고 고객 리뷰의 핵심 단어를 자연스럽게 인용할 것.
2. 타깃 키워드가 있다면 어색하지 않게 1회 자연스럽게 녹여 스마트플레이스 SEO 가중치를 획득할 것.
3. 재방문 시 네이버 예약이나 쿠폰 혜택을 센스있게 권할 것.
4. 아래 JSON 포맷만 순수 반환할 것:
[
  {"type": "정성·감동형", "text": "답글 내용..."},
  {"type": "친근·재방문형", "text": "답글 내용..."},
  {"type": "간결·임팩트형", "text": "답글 내용..."}
]`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: mode === 'intro' ? 2000 : 1000
            }
          }),
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const textOut = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleaned = textOut.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);

        return NextResponse.json({
          success: true,
          mode,
          data: parsed
        });
      }
    } catch (apiErr) {
      console.warn('[Reply API AI fallback triggered]:', apiErr);
    }

    // Fallback if AI call failed
    if (mode === 'intro') {
      const intro = generateFallbackIntro(store, review, kw);
      return NextResponse.json({ success: true, mode: 'intro', data: intro });
    }
    if (mode === 'news') {
      const news = generateFallbackNews(store, review, kw);
      return NextResponse.json({ success: true, mode: 'news', data: news });
    }
    const replies = generateFallbackReplies(store, review, kw, tone);
    return NextResponse.json({ success: true, mode: 'review', data: replies });
  } catch (err: any) {
    console.error('[Reply API Exception]:', err);
    return NextResponse.json(
      { error: err.message || '답글 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
