import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { AUTH_TOKEN_KEY } from '@/config/constants'

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth')

  if (!token && !isAuthRoute) {
    return NextResponse.redirect(new URL('/auth/sign-in', request.url))
  }

  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
