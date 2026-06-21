'use server'

import { redirect } from 'next/navigation'

import {
  clearSessionCookie,
  getSession,
  getSessionToken,
} from '@/lib/auth/session'

export async function isAuthenticated() {
  return (await getSession()) !== null
}

export async function signOutAction() {
  await clearSessionCookie()
  redirect('/auth/sign-in')
}

/**
 * Fornece o token apenas para o handshake STOMP no client (já que o
 * cookie é httpOnly e o JS do navegador não consegue lê-lo). O token
 * fica em memória só durante a conexão, nunca é persistido no client.
 */
export async function getWebSocketTokenAction(): Promise<string | null> {
  const session = await getSession()
  if (!session) return null

  return getSessionToken()
}
