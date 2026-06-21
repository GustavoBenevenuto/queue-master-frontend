import 'server-only'

import { HTTPError } from 'ky'

import { ApiErrorResponse } from './api-error'

export async function getErrorMessage(
  error: unknown,
  fallback: string,
): Promise<string> {
  if (error instanceof HTTPError) {
    const body = await error.response.json<ApiErrorResponse>().catch(() => null)

    return body?.message ?? fallback
  }

  return fallback
}
