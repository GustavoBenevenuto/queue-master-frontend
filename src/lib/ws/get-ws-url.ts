import { env } from '@/config/env'

export function getWsUrl(): string {
  return (
    env.NEXT_PUBLIC_API_URL.replace(/^http/, 'ws').replace(/\/$/, '') +
    '/ws-queue'
  )
}
