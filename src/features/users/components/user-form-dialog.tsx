'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { createUserAction, updateUserAction } from '../actions/user-actions'
import {
  USER_ROLES,
  UserFormValues,
  userFormSchema,
} from '../schemas/user.schema'
import { UserDTO } from '../types/user.types'

import { InputForm } from '@/components/form/input-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

const ROLE_LABELS: Record<(typeof USER_ROLES)[number], string> = {
  ADMIN: 'Admin',
  INVENTOR: 'Inventory clerk',
  OPERATOR: 'Operator',
}

interface UserFormDialogProps {
  trigger: ReactNode
  user?: UserDTO
  onSuccess?: () => void
}

export function UserFormDialog({
  trigger,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const isEditing = Boolean(user)
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      operatorNumber: user?.operatorNumber ?? '',
      role: user?.role ?? 'OPERATOR',
      active: user?.active ?? true,
    },
  })

  async function handleSubmit(values: UserFormValues) {
    setFormError(null)
    setIsSubmitting(true)

    const result = isEditing
      ? await updateUserAction(user!.id, values)
      : await createUserAction(values)

    setIsSubmitting(false)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (!isOpen) setFormError(null)
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit user' : 'New user'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {formError && (
              <p className="text-sm font-medium text-destructive">
                {formError}
              </p>
            )}

            <InputForm<UserFormValues> name="name" label="Name" />
            <InputForm<UserFormValues>
              name="email"
              label="Email"
              type="email"
            />
            <InputForm<UserFormValues>
              name="operatorNumber"
              label="Operator number"
            />

            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select
                value={form.watch('role')}
                onValueChange={value =>
                  form.setValue('role', value as UserFormValues['role'])
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {USER_ROLES.map(role => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isEditing && (
              <div className="flex items-center justify-between">
                <Label htmlFor="active">Active user</Label>
                <Switch
                  id="active"
                  checked={form.watch('active')}
                  onCheckedChange={checked => form.setValue('active', checked)}
                />
              </div>
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
