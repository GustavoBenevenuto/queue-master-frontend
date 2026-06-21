import './globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { cn } from '@/lib/utils'
import { QueryProvider } from './providers'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Create Next App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={cn('dark', 'font-sans', 'font-sans', inter.variable)}
    >
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
