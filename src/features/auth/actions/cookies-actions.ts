import Cookies from 'js-cookie'
import { AUTH_TOKEN_KEY } from '@/config/constants'

// Expiração em dias (7 dias)
const ONE_WEEK_IN_DAYS = 7

export const cookiesUtils = {
  saveToken,
  getToken,
  removeToken,
}

function saveToken(token: string) {
  Cookies.set(AUTH_TOKEN_KEY, token, {
    expires: ONE_WEEK_IN_DAYS,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // NÃO usamos httpOnly aqui, pois o JavaScript do Ky precisa ler o token
  })
}

function getToken() {
  return Cookies.get(AUTH_TOKEN_KEY) ?? null
}

function removeToken() {
  Cookies.remove(AUTH_TOKEN_KEY, { path: '/' })
}
