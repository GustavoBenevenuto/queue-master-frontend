import { FileQuestion } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Card className="w-full max-w-xs py-10 px-9 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="size-6 text-muted-foreground" />
        </div>

        <h1 className="text-2xl font-bold tracking-tight">404</h1>
        <p className="mt-1 text-sm text-muted-foreground">Page not found</p>
        <p className="mt-1 text-sm text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <Button asChild className="mt-6 w-full">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </Card>
    </div>
  )
}
