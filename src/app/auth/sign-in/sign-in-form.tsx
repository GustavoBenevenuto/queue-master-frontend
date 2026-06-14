'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignInForm() {
  const router = useRouter()

  const state = {
    success: true,
    message: null,
    errors: {
      email: null,
      password: null,
    },
  }

  const isPending = false

  return (
    // <form action={formAction} className="space-y-4">
    <Card className="w-full py-10 px-9">
      <h3 className="font-mono font-bold text-lg mb-3 text-foreground">
        Queue master
      </h3>
      <form onSubmit={() => {}} className="space-y-4">
        {state.success === false && state.message && (
          <Alert variant="destructive">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4" />
              <AlertTitle>Sign in failed!</AlertTitle>
            </div>

            <AlertDescription> {state.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email" />
          {state.errors?.email && (
            <p className="text-xs text-destructive">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input name="password" type="password" id="password" />
          {state.errors?.password && (
            <p className="text-xs text-destructive">
              {state.errors.password[0]}
            </p>
          )}
          <Link
            href="/auth/forgot-password"
            className="text-xs font-medium text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className=" size-4 animate-spin" />
          ) : (
            'Sign in with e-mail'
          )}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-up">Create new account</Link>
        </Button>
      </form>
    </Card>
  )
}
