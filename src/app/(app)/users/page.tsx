import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { UsersTable } from '@/features/users/components/users-table'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Users',
}

export default async function UsersPage() {
  const session = await getSession()

  if (session?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  return <UsersTable />
}
