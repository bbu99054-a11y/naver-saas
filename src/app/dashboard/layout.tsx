import { ReactNode } from 'react'
import { LayoutDashboard, PenTool, Settings, CreditCard, LogOut, Search, FileText, Network, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SidebarItem } from '@/components/SidebarItem'

const sidebarLinks = [
  { href: '/dashboard', label: '대시보드 메인', icon: LayoutDashboard },
  { href: '/dashboard/settings/profile', label: '내 정보 관리 (RAG)', icon: UserCircle },

  { href: '/dashboard/clustering', label: '블로그 연재 기획', icon: Network },
  { href: '/dashboard/write', label: 'SEO 블로그 쓰기', icon: PenTool },
  { href: '/dashboard/archive', label: '나의 원고 저장소', icon: FileText },
  { href: '/dashboard/settings', label: 'API 설정', icon: Settings },
  { href: '/dashboard/billing', label: '요금제 및 결제', icon: CreditCard },
]

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
            <h1 className="text-xl font-bold text-slate-800">PostSync</h1>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon
              return (
                <SidebarItem key={link.href} href={link.href}>
                  <Icon className="mr-3 h-5 w-5" />
                  {link.label}
                </SidebarItem>
              )
            })}
          </nav>
        </div>
        <div className="p-4 border-t border-slate-200 space-y-1 bg-white mt-auto">
          {/* TODO: 대표님의 실제 노션 가이드 링크로 교체하세요 */}
          <a href="https://notion.so" className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
            <span className="mr-3">📖</span>
            사용 가이드
          </a>
          <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md">
            <span className="mr-3">🔔</span>
            공지사항
          </a>
          <form action={handleLogout} className="pt-2 mt-2 border-t border-slate-100">
            <Button variant="ghost" className="w-full justify-start text-slate-600 hover:text-slate-900" type="submit">
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
