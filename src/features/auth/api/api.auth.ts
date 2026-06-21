import { httpClient } from '@/lib/http/api'
import { SignInPayload, SignInResponse } from '../types/auth.types'

export async function signIn({
  email,
  password,
}: SignInPayload): Promise<SignInResponse> {
  return httpClient
    .post(`auth/login`, { json: { email, password } })
    .json<SignInResponse>()
}
