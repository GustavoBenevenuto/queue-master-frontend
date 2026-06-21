import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { QueueSwitcher } from '@/features/orders/components/queue-switcher'
import { getSession } from '@/lib/auth/session'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default async function DashboardPage() {
  const session = await getSession()

  if (!session) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Select a queue to view its live orders
        </p>
      </div>

      <QueueSwitcher
        role={session.role}
        operatorNumber={session.operatorNumber}
      />
    </div>
  )
}
