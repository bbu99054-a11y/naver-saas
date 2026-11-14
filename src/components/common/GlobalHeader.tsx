'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  MapPin,
  QrCode,
  Wand2,
  Scale,
  BookOpen,
  Search,
  Grid,
} from 'lucide-react'

interface GlobalHeaderProps {
  currentPath?: string
}

export default function GlobalHeader({ currentPath }: GlobalHeaderProps) {
  const pathname = usePathname() || currentPath || ''

  const navItems = [
    { label: '순위 조회', href: '/place', icon: MapPin },
    { label: '리뷰 QR', href: '/utm', icon: QrCode },
    { label: 'AI 소개글', href: '/reply', icon: Wand2 },
    { label: '금칙어 검사', href: '/adcheck', icon: Scale },
    { label: '공략 칼럼', href: '/blog', icon: BookOpen },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-black/[0.06] shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors">
      <div className="max-w-[1280px] mx-auto px-5 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            title="PostSync 홈으로 이동"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-base shadow-xs group-hover:bg-blue-700 transition-colors" aria-hidden="true">
              P
            </div>
            <div className="flex items-center gap-1.5">
              <span translate="no" className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                PostSync
              </span>
              <span translate="no" className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/80 leading-none">
                LAB
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="메인 네비게이션">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                    active
                      ? 'text-blue-600 bg-blue-50/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <item.icon className={`w-3.5 h-3.5 ${active ? 'text-blue-600' : 'text-slate-400'}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tools"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
              isActive('/tools')
                ? 'bg-slate-100 text-slate-900 border-slate-300'
                : 'text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-slate-900 border-slate-200'
            }`}
          >
            <Grid className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>전체 도구</span>
          </Link>
          <Link
            href="/place"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            <span>순위 1초 진단</span>
          </Link>
        </div>
      </div>

      {/* Mobile Sub Nav Pill Bar (Horizontal Scroll) */}
      <div className="md:hidden border-t border-black/[0.04] bg-white/80 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                active
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <item.icon className="w-3 h-3" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
        <Link
          href="/tools"
          className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
            isActive('/tools')
              ? 'bg-blue-600 text-white'
              : 'bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Grid className="w-3 h-3" aria-hidden="true" />
          <span>전체도구</span>
        </Link>
      </div>
    </header>
  )
}
