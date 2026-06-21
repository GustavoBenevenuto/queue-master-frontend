'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormProvider, useForm } from 'react-hook-form'

import { SignInFormValues, signInSchema } from '../schemas/sign-in.schema'

import { InputForm } from '@/components/form/input-form'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSignIn } from '../hooks/use-sign-in'

export function SignInForm() {
  const signInFn = useSignIn()

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const router = useRouter()

  function handleSignIn(data: SignInFormValues) {
    signInFn.mutate({ email: data.email, password: data.password })
  }

  return (
    <FormProvider {...form}>
      <Card className="w-full py-10 px-9">
        <h3 className="font-mono font-bold text-lg mb-3 text-foreground">
          Queue master
        </h3>
        <form onSubmit={form.handleSubmit(handleSignIn)} className="space-y-4">
          {signInFn.error && (
            <Alert variant="destructive">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="size-4" />
                <AlertTitle>Sign in failed!</AlertTitle>
              </div>

              <AlertDescription> {signInFn.error.message}</AlertDescription>
            </Alert>
          )}

          <InputForm<SignInFormValues>
            name="email"
            label="E-mail"
            placeholder="test@test.com"
          />

          <InputForm<SignInFormValues>
            name="password"
            label="Password"
            placeholder="*******"
            type="password"
          />

          <div className="space-y-1">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={signInFn.isPending}
          >
            {signInFn.isPending ? (
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
    </FormProvider>
  )
}
