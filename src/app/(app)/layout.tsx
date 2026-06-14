import { redirect } from 'next/navigation'

// import { isAuthenticated } from '@/auth/auth'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // if (!(await isAuthenticated())) {
  //   redirect('/auth/-sign-in')
  // }

  return <>{children}</>
}
