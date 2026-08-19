import { ReactNode } from 'react'
import { LayoutDashboard, PenTool, Globe, CreditCard, LogOut, FileText, UserCircle, BookOpen, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SidebarItem } from '@/components/SidebarItem'
import { checkIsAdmin } from '@/actions/deposit'
import Link from 'next/link'

const sidebarLinks = [
  { href: '/dashboard', label: '대시보드 메인', icon: LayoutDashboard },
  { href: '/dashboard/settings/profile', label: '내 정보 관리 (RAG)', icon: UserCircle },
  { href: '/dashboard/write', label: 'SEO 블로그 쓰기', icon: PenTool },
  { href: '/dashboard/archive', label: '나의 원고 저장소', icon: FileText },
  { href: '/dashboard/settings', label: '외부 블로그 연동 (WP·티스토리)', icon: Globe },
  { href: '/dashboard/billing', label: '요금제 및 결제', icon: CreditCard },
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = await checkIsAdmin()

  const handleLogout = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="flex h-screen flex-col md:flex-row bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 flex flex-col justify-between overflow-y-auto">
        <div>
          <div className="h-16 flex items-center px-6 border-b border-slate-200 sticky top-0 bg-white z-10">
            <Link href="/dashboard" className="flex items-center hover:opacity-80 transition-opacity">
              <h1 className="text-xl font-bold text-slate-800 cursor-pointer">PostSync</h1>
            </Link>
          </div>
          <nav className="p-4 space-y-1">
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

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
