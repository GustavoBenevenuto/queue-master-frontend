'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function isAuthenticated() {
  return false
}

export async function saveToken(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('token', token, {
    path: '/',
    maxAge: 60 * 60 * 24 * 1,
  })
}
