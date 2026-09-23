import { NextResponse } from 'next/server';
import { fetchLiveNaverPlaceRanking, PlaceItem } from '../rank/route';

// 카카오 오픈빌더 스킬 응답 헬퍼 함수들
function createSimpleTextResponse(text: string) {
  return {
    version: '2.0',
    template: {
      outputs: [
        {
          simpleText: { text }
        }
      ],
      quickReplies: [
        { action: 'message', label: '💡 사용법 안내', messageText: '사용법' },
        { action: 'message', label: '🔍 예시 조회', messageText: '강남역 맛집, 김밥천국' }
      ]
    }
  };
}

function createBasicCardResponse({
  title,
  description,
  thumbnail,
  buttons = [],
  quickReplies = []
}: {
  title: string;
  description: string;
  thumbnail?: string;
  buttons?: Array<{ action: string; label: string; webLinkUrl?: string; messageText?: string; phoneNumber?: string }>;
  quickReplies?: Array<{ action: string; label: string; messageText: string }>;
}) {
  const card: any = { title, description };
  if (thumbnail) {
    card.thumbnail = { imageUrl: thumbnail };
  }
  if (buttons.length > 0) {
    card.buttons = buttons;
  }

  return {
    version: '2.0',
    template: {
      outputs: [
        {
          basicCard: card
        }
      ],
      quickReplies: quickReplies.length > 0 ? quickReplies : [
        { action: 'message', label: '💡 사용법 안내', messageText: '사용법' },
        { action: 'message', label: '🔍 다른 매장 조회', messageText: '사용법' }
      ]
    }
  };
}

// 텍스트에서 [키워드, 매장명] 파싱 로직
function parseUtterance(raw: string): { query: string; target: string; isHelp: boolean } {
  const text = raw.trim();

  // 도움말 키워드 체크
  if (!text || /^(도움말|사용법|안내|시작|메뉴|help|\?|순위조회|조회방법)$/i.test(text)) {
    return { query: '', target: '', isHelp: true };
  }

  // 1. 콤마(,), 슬래시(/), 구분선(|) 기준 분리 시도
  const delimiters = [',', '，', '/', '|', ' - '];
  for (const delim of delimiters) {
    if (text.includes(delim)) {
      const parts = text.split(delim).map(p => p.trim()).filter(Boolean);
      if (parts.length >= 2) {
        return { query: parts[0], target: parts[1], isHelp: false };
      }
    }
  }

  // 2. 공백 기준 분리 (단어가 2개 이상일 때: 앞쪽 키워드 + 마지막 상호명 또는 역순 추론)
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    // 예: "강남역 맛집 홍길동식당" -> query: "강남역 맛집", target: "홍길동식당"
    const target = words[words.length - 1];
    const query = words.slice(0, words.length - 1).join(' ');
    return { query, target, isHelp: false };
  }

  // 매장명이 없는 단일 키워드일 경우
  return { query: text, target: '', isHelp: false };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const utterance = body?.userRequest?.utterance || '';

    const { query, target, isHelp } = parseUtterance(utterance);

    // 1. 사용법 요청이거나 빈 입력일 경우
    if (isHelp || !query) {
      return NextResponse.json(
        createBasicCardResponse({
          title: '🪄 1초 플레이스 실시간 순위 조회기',
          description:
            '채팅창에 [키워드, 매장명]을 입력하시면 1초 만에 네이버 실시간 노출 순위를 알려드립니다!\n\n' +
            '📌 입력 예시:\n' +
            '• 강남역 맛집, 대박식당\n' +
            '• 서초동 변호사, 법무법인희망\n' +
            '• 성수동 카페, 블루보틀\n\n' +
            '지금 바로 매장명을 입력해 보세요!',
          buttons: [
            {
              action: 'webLink',
              label: '🌐 웹에서 1~20위 전체 보기',
              webLinkUrl: 'https://www.postsyncapp.com/place'
            }
          ],
          quickReplies: [
            { action: 'message', label: '강남역 맛집, 김밥천국', messageText: '강남역 맛집, 김밥천국' },
            { action: 'message', label: '서초동 변호사, 법무법인', messageText: '서초동 변호사, 법무법인' }
          ]
        })
      );
    }

    // 2. 매장명이 누락된 경우 안내
    if (!target) {
      return NextResponse.json(
        createBasicCardResponse({
          title: `🔍 [${query}] 매장명을 함께 적어주세요!`,
          description:
            `입력하신 검색어: "${query}"\n\n` +
            '순위를 확인할 상호명도 콤마(,) 뒤에 함께 적어주셔야 정확한 순위를 찾을 수 있습니다.\n\n' +
            `👉 예시: ${query}, 우리매장명`,
          buttons: [
            {
              action: 'webLink',
              label: '🌐 웹에서 1~20위 순위표 보기',
              webLinkUrl: `https://www.postsyncapp.com/place?query=${encodeURIComponent(query)}`
            }
          ]
        })
      );
    }

    // 3. 네이버 실시간 순위 수집 (카카오 4.2초 안전 타임아웃 레이스)
    const timeoutPromise = new Promise<{ isTimeout: true }>(resolve =>
      setTimeout(() => resolve({ isTimeout: true }), 4200)
    );

    const rankingPromise = fetchLiveNaverPlaceRanking(query).then(data => ({ isTimeout: false as const, data }));

    const result = await Promise.race([rankingPromise, timeoutPromise]);

    // 3-1. 타임아웃 발생 시 웹 링크로 즉시 안내
    if (result.isTimeout) {
      return NextResponse.json(
        createBasicCardResponse({
          title: `⏳ [${target}] 정밀 데이터 분석 중`,
          description:
            `네이버 실시간 순위 조회 요청이 몰려 분석이 진행 중입니다.\n` +
            `아래 버튼을 누르시면 웹에서 1초 만에 결과를 확인하실 수 있습니다!`,
          buttons: [
            {
              action: 'webLink',
              label: '📊 웹에서 즉시 순위 확인',
              webLinkUrl: `https://www.postsyncapp.com/place?query=${encodeURIComponent(query)}&target=${encodeURIComponent(target)}`
            }
          ]
        })
      );
    }

    const { items, totalCount } = result.data;
    const targetNorm = target.toLowerCase().replace(/\s+/g, '');

    // 타겟 매장 탐색
    const found = items.find(item => {
      const nameNorm = item.name.toLowerCase().replace(/\s+/g, '');
      return nameNorm.includes(targetNorm) || targetNorm.includes(nameNorm);
    });

    const webDetailUrl = `https://www.postsyncapp.com/place?query=${encodeURIComponent(query)}&target=${encodeURIComponent(target)}`;

    // 4. 순위 발견 시 (1~20위 내 진입)
    if (found) {
      const isTop5 = found.rank <= 5;
      const statusEmoji = isTop5 ? '🚀 1페이지 골든존' : '📈 2페이지 도약권';
      const bookingText = found.hasBooking ? '운영 중 ✅' : '미등록 ⚠️ (설치 시 순위 점수↑)';

      return NextResponse.json(
        createBasicCardResponse({
          title: `📍 [${found.name}] 실시간 ${found.rank}위!`,
          description:
            `• 검색 키워드: ${query}\n` +
            `• 실시간 순위: 전체 ${found.rank}위 (${statusEmoji})\n` +
            `• 스마트예약: ${bookingText}\n` +
            `• 주소: ${found.address}\n\n` +
            `${isTop5 ? '🎉 1페이지에 안정적으로 노출 중입니다!' : '💡 1페이지(5위 이내) 진입을 위한 경쟁사 역추적 처방전을 확인하세요.'}`,
          buttons: [
            {
              action: 'webLink',
              label: '📊 1위~20위 상세 리포트 보기',
              webLinkUrl: webDetailUrl
            },
            {
              action: 'webLink',
              label: '🚀 플레이스 상위노출 1:1 상담',
              webLinkUrl: 'https://www.postsyncapp.com/consult'
            }
          ]
        })
      );
    }

    // 5. 20위권 밖 (미노출 상태)
    const top1Name = items.length > 0 ? items[0].name : '1위 매장';
    return NextResponse.json(
      createBasicCardResponse({
        title: `⚠️ [${target}] 20위권 밖 (미노출)`,
        description:
          `• 검색 키워드: ${query}\n` +
          `• 현재 상태: 20위권 밖 (검색 유입 누수 ⚠️)\n` +
          `• 현재 1위: ${top1Name}\n\n` +
          `현재 해당 키워드에서 고객 노출이 되지 않고 있습니다. 스마트플레이스 키워드 세팅과 최신 리뷰 점수를 점검해 보세요.`,
        buttons: [
          {
            action: 'webLink',
            label: '💡 웹에서 1위 경쟁사 분석하기',
            webLinkUrl: webDetailUrl
          },
          {
            action: 'webLink',
            label: '🚀 1위 노출 1:1 무료 진단받기',
            webLinkUrl: 'https://www.postsyncapp.com/consult'
          }
        ]
      })
    );
  } catch (error: any) {
    console.error('[Kakao Place Webhook Error]:', error);
    return NextResponse.json(
      createSimpleTextResponse(
        '네이버 실시간 순위 조회 중 일시적인 지연이 발생했습니다.\n웹사이트(https://www.postsyncapp.com/place)에서 즉시 확인하실 수 있습니다.'
      )
    );
  }
}

// GET 요청 시 헬스체크 지원
export async function GET() {
  return NextResponse.json({
    status: 'online',
    service: 'PostSync Kakao Place Rank Webhook',
    timestamp: new Date().toISOString()
  });
}
