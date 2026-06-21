'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { NAV_ITEMS } from './nav-items'

import { cn } from '@/lib/utils'
import { useUserStore } from '@/stores/user-store'

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const pathname = usePathname()
  const role = useUserStore(state => state.user?.role)

  const items = NAV_ITEMS.filter(
    item => !item.roles || (role && item.roles.includes(role)),
  )

  return (
    <nav className="flex flex-col gap-1 p-3">
      {items.map(({ label, href, icon: Icon }) => {
        const isActive = pathname.startsWith(href)

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              'flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-secondary text-secondary-foreground'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
