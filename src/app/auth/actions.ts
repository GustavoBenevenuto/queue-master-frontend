'use server'

import { redirect } from 'next/navigation'

import { getSession, clearSessionCookie } from '@/lib/auth/session'

export async function isAuthenticated() {
  return (await getSession()) !== null
}

export async function signOutAction() {
  await clearSessionCookie()
  redirect('/auth/sign-in')
}
