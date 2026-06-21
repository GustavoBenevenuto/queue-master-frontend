import { Activity, DollarSign, Users as UsersIcon } from 'lucide-react'
import type { Metadata } from 'next'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Dashboard',
}

const SUMMARY_CARDS = [
  { title: 'Active users', value: '1,204', icon: UsersIcon },
  { title: 'Monthly revenue', value: '$48,290', icon: DollarSign },
  { title: 'Sessions today', value: '342', icon: Activity },
] as const

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your application
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SUMMARY_CARDS.map(({ title, value, icon: Icon }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon
                className="h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
