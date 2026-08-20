'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { checkIsAdmin, getAdminOverviewStats, getAdminUsersList } from '@/actions/admin'
import UsersAdminClient from './UsersAdminClient'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    redirect('/dashboard')
  }

  const [statsResult, usersResult] = await Promise.all([
    getAdminOverviewStats(),
    getAdminUsersList({ page: 1, pageSize: 15 }),
  ])

  const stats = statsResult.success && statsResult.stats ? statsResult.stats : {
    totalUsers: 0,
    todayNewUsers: 0,
    freeUsersCount: 0,
    basicUsersCount: 0,
    proUsersCount: 0,
    totalArticles: 0,
    freeArticles: 0,
    paidArticles: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingDepositsCount: 0,
    topKeywords: [],
  }

  const initialUsers = usersResult.success && usersResult.users ? usersResult.users : []
  const initialTotalCount = usersResult.totalCount || 0
  const initialTotalPages = usersResult.totalPages || 1

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 space-y-6">
      <UsersAdminClient
        adminEmail={user.email || ''}
        initialStats={stats as any}
        initialUsers={initialUsers as any}
        initialTotalCount={initialTotalCount}
        initialTotalPages={initialTotalPages}
      />
    </div>
  )
}
