import ky, { KyInstance, Options } from 'ky'
import { cookiesUtils } from '@/features/auth/actions/cookies-actions'
import { env } from '@/config/env'

const baseOptions: Options = {
  baseUrl: env.NEXT_PUBLIC_API_URL,
  timeout: 15_000,
  retry: 0,
  hooks: {
    beforeRequest: [
      ({ request }) => {
        const token = cookiesUtils.getToken()

        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
  },
}

/** Cliente HTTP padrão, usado em toda a aplicação. */
export const httpClient: KyInstance = ky.create(baseOptions)
