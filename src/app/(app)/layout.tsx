import { redirect } from 'next/navigation'
import React from 'react'

import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'
import { getSession } from '@/lib/auth/session'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar role={session.role} />

      <div className="flex min-h-screen flex-col md:pl-64">
        <Header
          userId={session.id}
          userName={session.name}
          role={session.role}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
