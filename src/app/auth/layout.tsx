import { redirect } from 'next/navigation'

import { isAuthenticated } from './actions'

import { ThemeToggle } from '@/components/layout/theme-toggle'

export default async function AuthLayout({
  children,
}: {
  // eslint-disable-next-line no-undef
  children: React.ReactNode
}) {
  if (await isAuthenticated()) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center flex-col px-4">
      <div className="fixed top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-xs">{children}</div>
    </div>
  )
}
