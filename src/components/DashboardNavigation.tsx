'use client'

import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  PenTool, 
  Globe, 
  CreditCard, 
  LogOut, 
  FileText, 
  UserCircle, 
  BookOpen, 
  ShieldCheck,
  Menu,
  X,
  Coins,
  Briefcase,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SidebarItem } from '@/components/SidebarItem'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sidebarLinks = [
  { href: '/dashboard', label: '수임 대시보드', icon: LayoutDashboard },
  { href: '/dashboard/pipeline', label: '수임 파이프라인 CRM', icon: Briefcase },
  { href: '/dashboard/write', label: '전문 칼럼 스튜디오', icon: PenTool },
  { href: '/dashboard/intake', label: '사건 1분 진단 폼 관리', icon: FileText },
  { href: '/dashboard/archive', label: '나의 원고 보관함', icon: BookOpen },
  { href: '/dashboard/settings/profile', label: '사무소 프로필 (RAG)', icon: UserCircle },
  { href: '/dashboard/billing', label: '요금제 및 구독', icon: CreditCard },
]

interface DashboardNavigationProps {
  isAdmin: boolean
  handleLogout: () => Promise<void>
}

export function DashboardNavigation({ isAdmin, handleLogout }: DashboardNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // 경로 이동 시 모바일 메뉴 자동 닫기
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const closeMenu = () => setMobileMenuOpen(false)

  return (
    <>
      {/* ========================================================================= */}
      {/* 📱 1. 모바일 전용 상단 콤팩트 헤더 (md:hidden) */}
      {/* ========================================================================= */}
      <header className="md:hidden h-14 bg-slate-900 text-white border-b border-white/10 px-4 flex items-center justify-between sticky top-0 z-40 shadow-sm shrink-0">
        <Link href="/dashboard" className="flex items-center gap-1.5 hover:opacity-80">
          <h1 className="text-lg font-black text-white tracking-tight">PostSync</h1>
          {isAdmin && (
            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              CEO
            </span>
          )}
        </Link>

        <div className="flex items-center gap-1.5">
          {isAdmin && (
            <>
              <Link href="/dashboard/admin">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 px-2.5 text-xs font-black rounded-lg ${
                    pathname === '/dashboard/admin'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  관제
                </Button>
              </Link>

              <Link href="/dashboard/admin/deposits">
                <Button
                  size="sm"
                  variant="ghost"
                  className={`h-8 px-2.5 text-xs font-black rounded-lg ${
                    pathname.startsWith('/dashboard/admin/deposits')
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 hover:bg-indigo-600/50'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 mr-1 text-amber-400" />
                  입금
                </Button>
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer ml-1"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 모바일 슬라이드 드로어 메뉴 오버레이 */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* 반투명 배경 */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={closeMenu}
          />

          {/* 슬라이드 메뉴 패널 */}
          <div className="relative ml-auto w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-4 overflow-y-auto animate-in slide-in-from-right duration-200 z-10">
            <div>
              <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-base">전체 메뉴</span>
                <button onClick={closeMenu} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isAdmin && (
                <div className="mb-3 p-2 bg-gradient-to-r from-amber-50 to-indigo-50 rounded-xl border border-amber-200/60 space-y-1">
                  <p className="text-[10px] font-extrabold text-amber-800 px-2 py-0.5">👑 CEO 전용 메뉴</p>
                  <SidebarItem href="/dashboard/admin" onClick={closeMenu}>
                    <ShieldCheck className="mr-2.5 h-4 w-4 text-amber-600" />
                    <span className="font-black text-amber-950 text-xs">CEO 통합 관제</span>
                  </SidebarItem>
                  <SidebarItem href="/dashboard/admin/deposits" onClick={closeMenu}>
                    <Coins className="mr-2.5 h-4 w-4 text-indigo-600" />
                    <span className="font-bold text-slate-800 text-xs">입금 승인 관리</span>
                  </SidebarItem>
                </div>
              )}

              <nav className="space-y-1">
                {sidebarLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <SidebarItem key={link.href} href={link.href} onClick={closeMenu}>
                      <Icon className="mr-3 h-4 w-4 shrink-0 text-slate-500" />
                      <span className="truncate text-xs font-semibold">{link.label}</span>
                    </SidebarItem>
                  )
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <SidebarItem href="/dashboard/guide" onClick={closeMenu}>
                <BookOpen className="mr-3 h-4 w-4 text-indigo-600" />
                <span className="font-bold text-xs">📖 사용 가이드</span>
              </SidebarItem>
              <form action={handleLogout}>
                <Button variant="ghost" className="w-full justify-start text-xs text-rose-600 hover:bg-rose-50 cursor-pointer h-9" type="submit">
                  <LogOut className="mr-2.5 h-4 w-4" />
                  로그아웃
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💻 2. 데스크톱 전용 좌측 고정 사이드바 (hidden md:flex) */}
      {/* ========================================================================= */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-shrink-0 flex-col justify-between overflow-y-auto">
        <div>
          <div className="h-16 flex items-center px-5 border-b border-slate-200/80 sticky top-0 bg-white z-10 justify-between">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <span className="w-7 h-7 rounded-lg bg-[#0284C7] text-white flex items-center justify-center font-black text-xs shadow-xs">
                P
              </span>
              <span className="text-lg font-black text-slate-900 tracking-tight">PostSync</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#E0F2FE] text-[#0284C7] border border-[#0284C7]/30">
                PRO
              </span>
            </Link>
          </div>
          
          <div className="p-3">
            <Link href="/consult" target="_blank">
              <Button className="w-full bg-[#FF6B00] hover:bg-[#E05D00] text-white font-black text-xs h-9 rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                + 1분 진단 폼 열기
              </Button>
            </Link>
          </div>

          <nav className="px-3 py-1 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              return (
                <SidebarItem key={link.href} href={link.href}>
                  <Icon className="mr-3 h-5 w-5 shrink-0" />
                  <span className="truncate">{link.label}</span>
                </SidebarItem>
              )
            })}

            {isAdmin && (
              <div className="pt-2 mt-2 border-t border-slate-100 space-y-1">
                <SidebarItem href="/dashboard/admin">
                  <ShieldCheck className="mr-3 h-5 w-5 shrink-0 text-amber-600" />
                  <span className="font-extrabold text-amber-900">👑 CEO 통합 관제</span>
                </SidebarItem>
                <SidebarItem href="/dashboard/admin/deposits">
                  <CreditCard className="mr-3 h-5 w-5 shrink-0 text-indigo-600" />
                  <span className="font-semibold text-slate-700">💳 입금 승인 관리</span>
                </SidebarItem>
              </div>
            )}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 space-y-1 bg-white mt-auto">
          <SidebarItem href="/dashboard/guide">
            <BookOpen className="mr-3 h-5 w-5 shrink-0 text-indigo-600" />
            <span className="font-bold">📖 사용 가이드</span>
          </SidebarItem>
          <form action={handleLogout} className="pt-2 mt-2 border-t border-slate-100">
            <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900 cursor-pointer" type="submit">
              <LogOut className="mr-3 h-5 w-5" />
              로그아웃
            </Button>
          </form>
        </div>
      </aside>
    </>
  )
}
