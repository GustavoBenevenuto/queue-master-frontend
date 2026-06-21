export interface SignInResponse {
  token: string
}

export interface SignInPayload {
  email: string
  password: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}
