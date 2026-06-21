'use server'

import { jwtDecode } from 'jwt-decode'
import { HTTPError } from 'ky'

import {
  SignInPayload,
  SignInResponse,
  User,
} from '@/features/auth/types/auth.types'
import { setSessionCookie } from '@/lib/auth/session'
import { api } from '@/lib/http/api'
import { ApiErrorResponse } from '@/lib/http/api-error'

interface AccessTokenClaims {
  id: string
  name: string
  sub: string
  role: string
}

type SignInResult =
  | { success: true; user: User }
  | { success: false; message: string; statusCode?: number }

export async function signInAction(
  payload: SignInPayload,
): Promise<SignInResult> {
  try {
    const { token } = await api
      .post('auth/login', { json: payload })
      .json<SignInResponse>()

    await setSessionCookie(token)

    const claims = jwtDecode<AccessTokenClaims>(token)

    return {
      success: true,
      user: {
        id: claims.id,
        name: claims.name,
        email: claims.sub,
        role: claims.role,
      },
    }
  } catch (error) {
    console.log({ error })
    if (error instanceof HTTPError) {
      const statusCode = error.response.status
      const body = await error.response
        .json<ApiErrorResponse>()
        .catch(() => null)

      return {
        success: false,
        statusCode,
        message: body?.message ?? 'Unable to log in. Please try again.',
      }
    }

    return {
      success: false,
      message: 'Unable to log in. Please try again.',
    }
  }
}
