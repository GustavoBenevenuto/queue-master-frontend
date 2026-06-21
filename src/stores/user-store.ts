import { create } from 'zustand'

import { UserRole } from '@/features/users/types/user.types'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: UserRole
  operatorNumber: string
}

interface UserStore {
  user: SessionUser | null
  setUser: (user: SessionUser) => void
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  setUser: user => set({ user }),
}))
