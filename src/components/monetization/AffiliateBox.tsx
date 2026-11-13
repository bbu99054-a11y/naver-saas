'use client';

import { ExternalLink, Tag } from 'lucide-react';
import {
  AffiliatePlacement,
  getConfiguredAffiliateOffer,
} from '@/lib/monetizationConfig';

interface AffiliateBoxProps {
  placement: AffiliatePlacement;
  compact?: boolean;
}

/**
 * 환경변수에 실제 제휴 URL이 등록된 경우에만 노출되는 비대면 추천 카드.
 * 미설정 시 null을 반환해 가짜 링크나 빈 플레이스홀더를 노출하지 않습니다.
 */
export default function AffiliateBox({ placement, compact = false }: AffiliateBoxProps) {
  const offer = getConfiguredAffiliateOffer(placement);
  if (!offer) {
    return null;
  }

  const handleTrackClick = () => {
    try {
      const w = window as unknown as { gtag?: (...args: unknown[]) => void };
      if (typeof w.gtag === 'function') {
        w.gtag('event', 'click_affiliate', {
          placement,
          tool: 'nextjs',
        });
      }
    } catch {
      // ignore analytics error
    }
  };

  return (
    <aside
      aria-label="매장 운영 제휴 추천"
      className={`rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 break-keep break-words ${
        compact ? 'p-4' : 'my-8 p-5 sm:p-6'
      }`}
    >
      <div className="inline-flex items-center gap-1.5 rounded-full bg-slate-200/80 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 mb-2.5">
        <Tag className="w-3 h-3" />
        <span>{offer.badge}</span>
      </div>

      <h4 className={`${compact ? 'text-sm' : 'text-base sm:text-lg'} font-extrabold text-slate-900 leading-snug mb-1.5`}>
        {offer.title}
      </h4>

      <p className={`${compact ? 'text-xs' : 'text-xs sm:text-sm'} text-slate-600 leading-relaxed mb-4`}>
        {offer.description}
      </p>

      <a
        href={offer.url}
        target="_blank"
        rel="sponsored noopener noreferrer"
        onClick={handleTrackClick}
        className="inline-flex items-center justify-center gap-1.5 min-h-10 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold transition-colors"
      >
        <span>{offer.ctaLabel}</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      <p className="mt-3 text-[11px] text-slate-500 leading-normal">
        {offer.disclosure}
      </p>
    </aside>
  );
}
