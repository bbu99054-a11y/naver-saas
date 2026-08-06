'use client'

import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

export function SidebarItem({ href, children }: { href: string; children: ReactNode }) {
  const router = useRouter()
  return (
    <div 
      onClick={() => router.push(href)} 
      className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
    >
      {children}
    </div>
  )
}
