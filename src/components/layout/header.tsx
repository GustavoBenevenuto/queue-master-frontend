'use client'

import { KeyRound, LogOut, Menu, User as UserIcon } from 'lucide-react'
import { useState, useTransition } from 'react'

import { SidebarNav } from './sidebar-nav'
import { ThemeToggle } from './theme-toggle'

import { signOutAction } from '@/app/auth/actions'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ChangePasswordDialog } from '@/features/users/components/change-password-dialog'
import { useUserStore } from '@/stores/user-store'

export function Header() {
  const user = useUserStore(state => state.user)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [isSigningOut, startSignOut] = useTransition()

  const initials = user?.name.slice(0, 2).toUpperCase()

  function handleSignOut() {
    startSignOut(() => signOutAction())
  }

  if (!user) return null

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="h-14 justify-center border-b border-border p-4">
              <SheetTitle>Queue master</SheetTitle>
            </SheetHeader>
            <SidebarNav onNavigate={() => setMobileNavOpen(false)} />
          </SheetContent>
        </Sheet>

        <span className="font-mono text-sm font-bold md:hidden">
          Queue master
        </span>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label="User menu"
            >
              <Avatar>
                <AvatarFallback>
                  {initials || <UserIcon className="size-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <ChangePasswordDialog
              userId={user.id}
              requireCurrentPassword
              trigger={
                <DropdownMenuItem onSelect={event => event.preventDefault()}>
                  <KeyRound className="size-4" />
                  Change password
                </DropdownMenuItem>
              }
            />

            <DropdownMenuItem
              variant="destructive"
              disabled={isSigningOut}
              onSelect={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
