'use client'

import { ReactNode, useEffect } from 'react'

import { SessionUser, useUserStore } from '@/stores/user-store'

interface UserStoreProviderProps {
  user: SessionUser
  children: ReactNode
}

export function UserStoreProvider({ user, children }: UserStoreProviderProps) {
  useEffect(() => {
    useUserStore.setState({ user })
  }, [user])

  return children
}
