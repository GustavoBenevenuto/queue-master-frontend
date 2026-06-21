import 'server-only'

import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'

import { AUTH_TOKEN_KEY } from '@/config/constants'

interface AccessTokenClaims {
  id: string
  name: string
  sub: string
  role: string
  exp: number
}

export async function setSessionCookie(token: string) {
  const { exp } = jwtDecode<AccessTokenClaims>(token)
  const cookieStore = await cookies()

  cookieStore.set(AUTH_TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: exp * 1000,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_TOKEN_KEY)
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get(AUTH_TOKEN_KEY)?.value ?? null
}

export async function getSession() {
  const token = await getSessionToken()
  if (!token) return null

  try {
    const claims = jwtDecode<AccessTokenClaims>(token)

    if (claims.exp * 1000 <= Date.now()) {
      return null
    }

    return {
      id: claims.id,
      name: claims.name,
      email: claims.sub,
      role: claims.role,
    }
  } catch {
    return null
  }
}
