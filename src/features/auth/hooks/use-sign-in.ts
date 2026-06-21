'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

import { SignInPayload } from '../types/auth.types'

import { signInAction } from '@/app/auth/sign-in/actions'

class SignInError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number,
  ) {
    super(message)
    this.name = 'SignInError'
  }

  get isUnauthorized(): boolean {
    return this.statusCode === 401
  }
}

export function useSignIn() {
  const router = useRouter()

  return useMutation<void, SignInError, SignInPayload>({
    mutationFn: async payload => {
      const result = await signInAction(payload)

      if (!result.success) {
        throw new SignInError(result.message, result.statusCode)
      }
    },
    onSuccess: () => {
      router.replace('/dashboard')
    },
  })
}
