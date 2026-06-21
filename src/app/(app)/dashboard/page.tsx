import type { Metadata } from 'next'

import { QueueSwitcher } from '@/features/orders/components/queue-switcher'

export const metadata: Metadata = {
  title: 'Dashboard',
}

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Select a queue to view its live orders
        </p>
      </div>

      <QueueSwitcher />
    </div>
  )
}
