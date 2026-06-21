'use client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { SignInPayload, SignInResponse, User } from '../types/auth.types'
import { signIn } from '../api/api.auth'
import { jwtDecode } from 'jwt-decode'
import { ApiError } from '@/lib/http/api-error'
import { cookiesUtils } from '../actions/cookies-actions'

export function useSignIn() {
  const router = useRouter()

  return useMutation<SignInResponse, ApiError, SignInPayload>({
    mutationFn: signIn,
    onSuccess: data => {
      // Grava o cookie diretamente no navegador (Síncrono, sem await)
      cookiesUtils.saveToken(data.token)

      const user = getProfile(data.token)
      console.log({ user })

      // Redireciona
      router.replace('/dashboard')
    },
    onError: error => {
      console.log({ error })

      if (error.isUnauthorized) {
        // toast.error('E-mail ou senha incorretos.')
        return
      }

      // toast.error(
      //   error.message || 'Não foi possível fazer login. Tente novamente.',
      // )
    },
  })
}

function getProfile(token: string): User | null {
  if (!token) return null

  try {
    // Decodifica o token JWT (Isso é puramente matemático, não faz requisição HTTP)
    const decoded = jwtDecode<{
      id: string
      name: string
      sub: string // O subject que você definiu no Java (email)
      role: string
    }>(token)

    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.sub,
      role: decoded.role,
    }
  } catch (error) {
    console.error('Falha ao decodificar token:', error)
    return null
  }
}
