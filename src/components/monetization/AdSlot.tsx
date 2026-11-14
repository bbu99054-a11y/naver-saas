'use client';

import { useEffect } from 'react';
import { ADSENSE_CLIENT_ID, IS_ADSENSE_APPROVED } from '@/lib/monetizationConfig';

interface AdSlotProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * 애드센스 승인(NEXT_PUBLIC_ADSENSE_APPROVED=true)과 슬롯 ID가 모두 유효할 때만
 * 수동 광고 영역을 렌더링합니다. 미승인 상태에서는 빈 여백 없이 null을 반환합니다.
 */
export default function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const enabled = IS_ADSENSE_APPROVED && Boolean(slot && slot.trim());

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // ignore duplicate or blocked ad push
    }
  }, [enabled, slot]);

  if (!enabled) {
    return null;
  }

  return (
    <div className={`my-8 w-full min-h-[120px] overflow-hidden text-center ${className}`}>
      <div translate="no" className="text-[10px] font-medium text-slate-400 mb-1.5 tracking-wide">ADVERTISEMENT</div>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', minHeight: '90px' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot.trim()}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
