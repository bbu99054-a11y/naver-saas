export type AffiliatePlacement = 'blog_sidebar' | 'blog_bottom' | 'guide_bottom';

export interface AffiliateOfferConfig {
  placement: AffiliatePlacement;
  badge: string;
  title: string;
  description: string;
  ctaLabel: string;
  url: string;
  disclosure: string;
}

export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-3734423172731921';

export const IS_ADSENSE_APPROVED =
  process.env.NEXT_PUBLIC_ADSENSE_APPROVED === 'true';

export const ADSENSE_SLOTS = {
  blogTop: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_TOP || '',
  blogBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_BLOG_BOTTOM || '',
  guideBottom: process.env.NEXT_PUBLIC_ADSENSE_SLOT_GUIDE_BOTTOM || '',
} as const;

export const KAKAO_CHANNEL_CHAT_URL =
  process.env.NEXT_PUBLIC_KAKAO_CHAT_URL || 'https://pf.kakao.com/_xonxiaX/chat';

const DEFAULT_DISCLOSURE =
  '제휴 파트너 링크를 통해 상품 구매 또는 서비스 가입이 이루어지면 일정액의 수수료를 제공받을 수 있습니다.';

/**
 * 실제 URL이 환경변수에 설정된 경우에만 제휴 오퍼를 반환합니다.
 * 미설정 시 null을 반환해 가짜/빈 제휴 카드가 노출되지 않도록 보호합니다.
 */
export function getConfiguredAffiliateOffer(
  placement: AffiliatePlacement
): AffiliateOfferConfig | null {
  const envUrls: Record<AffiliatePlacement, string | undefined> = {
    blog_sidebar: process.env.NEXT_PUBLIC_AFFILIATE_BLOG_SIDEBAR_URL,
    blog_bottom: process.env.NEXT_PUBLIC_AFFILIATE_BLOG_BOTTOM_URL,
    guide_bottom: process.env.NEXT_PUBLIC_AFFILIATE_GUIDE_BOTTOM_URL,
  };

  const url = (envUrls[placement] || '').trim();
  if (!/^https?:\/\//i.test(url)) {
    return null;
  }

  const catalog: Record<AffiliatePlacement, Omit<AffiliateOfferConfig, 'placement' | 'url'>> = {
    blog_sidebar: {
      badge: '매장 운영 추천 용품 · 제휴',
      title: '카운터 QR 아크릴 거치대 · 리뷰 POP 용품',
      description: '테이블과 계산대에 비치해 방문자 리뷰와 저장하기 전환을 높이는 실무 용품을 모아두었습니다.',
      ctaLabel: '추천 용품 확인하기',
      disclosure: DEFAULT_DISCLOSURE,
    },
    blog_bottom: {
      badge: '로컬 마케팅 실무 도구 · 제휴',
      title: '매장 영수증 리뷰 POP 세팅 · 운영 추천 패키지',
      description: 'QR 인쇄 후 바로 세워둘 수 있는 A6 거치대와 방수 스티커 등 오프라인 매장 필수 비품을 확인해 보세요.',
      ctaLabel: '추천 상품 보러가기',
      disclosure: DEFAULT_DISCLOSURE,
    },
    guide_bottom: {
      badge: '전문직 · 병의원 운영 참고 · 제휴',
      title: '오프라인 상담실 · 대기실 안내물 제작 추천 용품',
      description: '상담 안내 POP 스탠드 및 대기실 비치용 홍보 거치대 규격을 확인해 보세요.',
      ctaLabel: '추천 규격 확인하기',
      disclosure: DEFAULT_DISCLOSURE,
    },
  };

  return {
    placement,
    url,
    ...catalog[placement],
  };
}
