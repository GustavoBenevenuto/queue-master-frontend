import { LayoutDashboard, Users, type LucideIcon } from 'lucide-react'

import { UserRole } from '@/features/users/types/user.types'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  roles?: UserRole[]
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/users', icon: Users, roles: ['ADMIN'] },
]
