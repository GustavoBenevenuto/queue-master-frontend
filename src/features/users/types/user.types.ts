export type UserRole = 'ADMIN' | 'INVENTOR' | 'OPERATOR'

export interface UserDTO {
  id: string
  name: string
  email: string
  operatorNumber: string
  role: UserRole
  active: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateUserPayload {
  name: string
  email: string
  operatorNumber: string
  role: UserRole
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  operatorNumber?: string
  role?: UserRole
  active?: boolean
}

export interface ChangePasswordPayload {
  currentPassword?: string
  newPassword: string
}
