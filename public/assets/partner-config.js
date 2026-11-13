(function () {
  'use strict';

  /**
   * PostSync 정적 웹툴 공용 파트너/오픈채팅 설정.
   * 실제 제휴 URL이 비어 있거나 enabled가 false이면 화면에 카드를 렌더링하지 않습니다.
   */
  window.POSTSYNC_PARTNER_CONFIG = {
    kakaoChannelUrl: 'https://pf.kakao.com/_xonxiaX/chat',
    affiliates: {
      utmStand: {
        enabled: false,
        url: '',
        badge: '매장 비치 추천 용품 · 제휴',
        title: 'A6 아크릴 테이블 POP 거치대 · 방수 QR 스티커 모음',
        desc: '인쇄한 A6 QR 안내판을 구겨짐 없이 테이블·카운터에 세워둘 수 있는 실물 거치대 및 라벨 용품입니다.',
        cta: '추천 용품 보러가기',
        disclosure: '제휴 링크를 통해 구매가 이루어지면 일정액의 수수료를 제공받을 수 있습니다.',
      },
      placeTool: {
        enabled: false,
        url: '',
        badge: '매장 운영 실무 용품 · 제휴',
        title: '테이블 QR 리뷰 안내판 거치대 · 매장 POP 세트',
        desc: '영수증 리뷰와 플레이스 저장하기 유도를 바로 현장에 적용할 수 있는 실무 비품을 확인해 보세요.',
        cta: '추천 용품 확인하기',
        disclosure: '제휴 링크를 통해 구매가 이루어지면 일정액의 수수료를 제공받을 수 있습니다.',
      },
    },
  };

  window.trackPostSyncEvent = function (eventName, params) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params || {});
      }
    } catch {
      // ignore analytics errors
    }
  };

  /**
   * 설정된 실 URL이 있을 때만 안전한 DOM 노드로 제휴 추천 카드를 렌더링합니다.
   */
  window.renderPostSyncAffiliateCard = function (containerId, offerKey, toolName) {
    var container = document.getElementById(containerId);
    if (!container) return false;

    var cfg = window.POSTSYNC_PARTNER_CONFIG;
    var offer = cfg && cfg.affiliates ? cfg.affiliates[offerKey] : null;
    if (!offer || !offer.enabled || !offer.url || !/^https?:\/\//i.test(offer.url)) {
      container.textContent = '';
      container.style.display = 'none';
      return false;
    }

    container.textContent = '';
    container.style.display = 'block';

    var card = document.createElement('div');
    card.style.cssText =
      'background:#f8fafc; border:1px solid #cbd5e1; border-radius:12px; padding:14px 16px; color:#0f172a; word-break:keep-all; overflow-wrap:break-word; box-sizing:border-box;';

    var badge = document.createElement('div');
    badge.style.cssText =
      'display:inline-block; font-size:11px; font-weight:700; color:#475569; background:#e2e8f0; padding:2px 8px; border-radius:999px; margin-bottom:8px;';
    badge.textContent = offer.badge || '제휴 추천';

    var title = document.createElement('div');
    title.style.cssText =
      'font-size:14px; font-weight:800; color:#0f172a; margin-bottom:4px; line-height:1.4;';
    title.textContent = offer.title || '';

    var desc = document.createElement('p');
    desc.style.cssText =
      'font-size:12px; color:#475569; margin:0 0 12px 0; line-height:1.55;';
    desc.textContent = offer.desc || '';

    var link = document.createElement('a');
    link.href = offer.url;
    link.target = '_blank';
    link.rel = 'sponsored noopener noreferrer';
    link.style.cssText =
      'display:inline-flex; align-items:center; justify-content:center; gap:6px; min-height:40px; padding:8px 16px; border-radius:8px; background:#0f172a; color:#ffffff; font-size:12.5px; font-weight:700; text-decoration:none;';
    link.textContent = (offer.cta || '자세히 보기') + ' ->';
    link.addEventListener('click', function () {
      window.trackPostSyncEvent('click_affiliate', {
        tool: toolName || 'static',
        offer_key: offerKey,
      });
    });

    var note = document.createElement('div');
    note.style.cssText =
      'margin-top:8px; font-size:10.5px; color:#64748b; line-height:1.4;';
    note.textContent = offer.disclosure || '';

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(link);
    if (offer.disclosure) {
      card.appendChild(note);
    }
    container.appendChild(card);
    return true;
  };
})();
