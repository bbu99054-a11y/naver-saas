'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getPendingDeposits, checkIsAdmin } from '@/actions/deposit'
import DepositsAdminClient from './DepositsAdminClient'

export default async function AdminDepositsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = await checkIsAdmin()
  if (!isAdmin) {
    redirect('/dashboard')
  }

  const result = await getPendingDeposits()
  const initialDeposits = result.success && result.data ? result.data : []

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <DepositsAdminClient
        adminEmail={user.email || ''}
        initialDeposits={initialDeposits as any}
      />
    </div>
  )
}
