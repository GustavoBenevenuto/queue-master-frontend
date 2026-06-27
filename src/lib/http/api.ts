import 'server-only'

import ky, { KyInstance, Options } from 'ky'

import { env } from '@/config/env'
import { getSessionToken } from '@/lib/auth/session'

const baseOptions: Options = {
  prefix: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  retry: 0,
}

/** Cliente HTTP server-side sem autenticação (ex.: login). */
export const api: KyInstance = ky.create(baseOptions)

/** Cliente HTTP server-side que anexa o Bearer token da sessão atual. */
export async function createAuthenticatedHttpClient(): Promise<KyInstance> {
  const token = await getSessionToken()
  return api.extend({
    hooks: {
      beforeRequest: [
        ({ request }) => {
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`)
          }
        },
      ],
    },
  })
}
