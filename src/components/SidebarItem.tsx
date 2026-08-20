'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

export function SidebarItem({ 
  href, 
  children,
  onClick
}: { 
  href: string; 
  children: ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname()

  // 정확한 일치 또는 서브 경로 일치 여부 확인 (/dashboard 메인은 정확한 일치)
  const isActive = href === '/dashboard' 
    ? pathname === '/dashboard' 
    : pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))

  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all cursor-pointer ${
        isActive 
          ? 'bg-indigo-50 text-indigo-700 font-extrabold shadow-2xs border-r-2 border-indigo-600' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      {children}
    </Link>
  )
}
