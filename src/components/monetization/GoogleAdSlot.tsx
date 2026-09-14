'use client'

import React, { useEffect, useRef } from 'react'

interface GoogleAdSlotProps {
  adSlot?: string
  adFormat?: 'auto' | 'horizontal' | 'rectangle' | 'vertical'
  fullWidthResponsive?: boolean
  className?: string
}

declare global {
  interface Window {
    adsbygoogle?: any[]
  }
}

export default function GoogleAdSlot({
  adSlot = '3734423172', // 기본 슬롯 ID (추후 각 슬롯별 지정 가능)
  adFormat = 'auto',
  fullWidthResponsive = true,
  className = ''
}: GoogleAdSlotProps) {
  const adRef = useRef<HTMLModElement>(null)
  const isPushed = useRef(false)

  useEffect(() => {
    // 광고 스크립트 중복 푸시 방지 및 브라우저 환경 검증
    if (typeof window !== 'undefined' && !isPushed.current) {
      try {
        if (adRef.current && adRef.current.children.length === 0) {
          window.adsbygoogle = window.adsbygoogle || []
          window.adsbygoogle.push({})
          isPushed.current = true
        }
      } catch (err) {
        console.warn('[GoogleAdSlot Push Notice]:', err)
      }
    }
  }, [])

  // 슬롯 포맷별 추천 최소 높이 (CLS 레이아웃 시프트 방지)
  const getMinHeight = () => {
    switch (adFormat) {
      case 'horizontal':
        return 'min-h-[90px]'
      case 'rectangle':
        return 'min-h-[250px]'
      case 'vertical':
        return 'min-h-[600px]'
      default:
        return 'min-h-[100px]'
    }
  }

  return (
    <div
      className={`w-full overflow-hidden flex flex-col items-center justify-center my-4 ${getMinHeight()} ${className}`}
    >
      <div className="w-full text-center">
        <span className="text-[10px] tracking-wider text-slate-500 uppercase block mb-1">
          SPONSORED
        </span>
        <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl overflow-hidden flex items-center justify-center min-h-[90px] w-full relative">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', width: '100%', textAlign: 'center' }}
            data-ad-client="ca-pub-3734423172731921"
            data-ad-slot={adSlot}
            data-ad-format={adFormat}
            data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
          />
        </div>
      </div>
    </div>
  )
}
