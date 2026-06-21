'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  KeyRound,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'

import { ChangePasswordDialog } from './change-password-dialog'
import { DeleteUserAlert } from './delete-user-alert'
import { UserFormDialog } from './user-form-dialog'
import { listUsersAction } from '../actions/user-actions'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Admin',
  INVENTOR: 'Inventory clerk',
  OPERATOR: 'Operator',
}

export function UsersTable() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const result = await listUsersAction()
      if (!result.success) throw new Error(result.message)
      return result.data
    },
  })

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users</h1>
          <p className="text-sm text-muted-foreground">
            Manage the system users
          </p>
        </div>

        <UserFormDialog
          onSuccess={invalidate}
          trigger={
            <Button>
              <Plus className="size-4" />
              New user
            </Button>
          }
        />
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <Loader2 className="mx-auto size-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            )}

            {error && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-sm text-destructive"
                >
                  {error.message}
                </TableCell>
              </TableRow>
            )}

            {data?.map(user => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.operatorNumber}
                </TableCell>
                <TableCell>{ROLE_LABELS[user.role] ?? user.role}</TableCell>
                <TableCell>
                  <Badge variant={user.active ? 'default' : 'secondary'}>
                    {user.active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <UserFormDialog
                        user={user}
                        onSuccess={invalidate}
                        trigger={
                          <DropdownMenuItem
                            onSelect={event => event.preventDefault()}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </DropdownMenuItem>
                        }
                      />

                      <ChangePasswordDialog
                        userId={user.id}
                        trigger={
                          <DropdownMenuItem
                            onSelect={event => event.preventDefault()}
                          >
                            <KeyRound className="size-4" />
                            Change password
                          </DropdownMenuItem>
                        }
                      />

                      <DeleteUserAlert
                        userId={user.id}
                        userName={user.name}
                        onSuccess={invalidate}
                        trigger={
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={event => event.preventDefault()}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}

            {data?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-sm text-muted-foreground"
                >
                  No users registered.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
