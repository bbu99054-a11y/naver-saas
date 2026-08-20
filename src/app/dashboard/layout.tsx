import { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { checkIsAdmin } from '@/actions/deposit'
import { DashboardNavigation } from '@/components/DashboardNavigation'

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
      {/* Navigation (Mobile Header + Drawer / Desktop Sidebar) */}
      <DashboardNavigation isAdmin={isAdmin} handleLogout={handleLogout} />

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto">
        <div className="mx-auto max-w-6xl">
          {children}
        </div>
      </main>
    </div>
  )
}
