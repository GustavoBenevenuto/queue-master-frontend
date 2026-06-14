'use client'

import { AlertTriangle, Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import githubIcon from '@/assets/github-icon.svg'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export function SignUpForm() {
  const router = useRouter()

  // const [state, handleSubmit, isPending] = useFormState(signUpAction, () => {
  //   router.push('/auth/sign-in')
  // })

  return (
    <Card className="w-full py-10 px-9">
      {/* <form onSubmit={handleSubmit} className="space-y-4">
        {state.success === false && state.message && (
          <Alert variant="destructive">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="size-4" />
              <AlertTitle>Sign uo failed!</AlertTitle>
            </div>

            <AlertDescription> {state.message}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input name="name" type="name" id="name" />
          {state.errors?.name && (
            <p className="text-xs text-destructive">{state.errors.name[0]}</p>
          )}
        </div>

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
        </div>

        <div className="space-y-1">
          <Label htmlFor="password_confirmation">Confirm your password</Label>
          <Input
            name="password_confirmation"
            type="password"
            id="password_confirmation"
          />
          {state.errors?.password_confirmation && (
            <p className="text-xs text-destructive">
              {state.errors.password_confirmation[0]}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className=" size-4 animate-spin" />
          ) : (
            'Create account'
          )}
        </Button>

        <Button variant="link" className="w-full" size="sm" asChild>
          <Link href="/auth/sign-in">Already regsitred? Sign in</Link>
        </Button>
      </form> */}

      <Separator className="h-px" />

      {/* <form action={signInWithGitHub}>
        <Button type="submit" className="w-full" variant="outline">
          <Image
            src={githubIcon}
            alt="GitHub icon"
            className="size-4 mr-2 dark:invert"
          />
          Sign in with GitHub
        </Button>
      </form> */}
    </Card>
  )
}
