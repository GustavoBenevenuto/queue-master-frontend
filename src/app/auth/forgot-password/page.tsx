import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordPage() {
  return (
    <Card className="w-full py-10 px-9">
      <form action="" className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input name="email" type="email" id="email" />
        </div>

        <Button className="w-full" type="submit">
          Recover password
        </Button>

        <Button className="w-full" variant="link" size="sm" asChild>
          <Link href="/auth/sign-in">Sign in instead</Link>
        </Button>
      </form>
    </Card>
  )
}
