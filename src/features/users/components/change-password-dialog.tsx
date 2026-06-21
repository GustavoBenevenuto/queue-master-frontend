'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { changePasswordAction } from '../actions/user-actions'
import {
  ChangePasswordFormValues,
  changePasswordSchema,
} from '../schemas/user.schema'

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

interface ChangePasswordDialogProps {
  userId: string
  requireCurrentPassword?: boolean
  trigger: ReactNode
}

export function ChangePasswordDialog({
  userId,
  requireCurrentPassword = false,
  trigger,
}: ChangePasswordDialogProps) {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  async function handleSubmit(values: ChangePasswordFormValues) {
    if (requireCurrentPassword && !values.currentPassword) {
      form.setError('currentPassword', {
        message: 'Current password is required',
      })
      return
    }

    setFormError(null)
    setIsSubmitting(true)

    const result = await changePasswordAction(userId, {
      currentPassword: values.currentPassword || undefined,
      newPassword: values.newPassword,
    })

    setIsSubmitting(false)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    form.reset()
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (!isOpen) {
          form.reset()
          setFormError(null)
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
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

            {requireCurrentPassword && (
              <InputForm<ChangePasswordFormValues>
                name="currentPassword"
                label="Current password"
                type="password"
              />
            )}

            <InputForm<ChangePasswordFormValues>
              name="newPassword"
              label="New password"
              type="password"
            />

            <InputForm<ChangePasswordFormValues>
              name="confirmPassword"
              label="Confirm new password"
              type="password"
            />

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
