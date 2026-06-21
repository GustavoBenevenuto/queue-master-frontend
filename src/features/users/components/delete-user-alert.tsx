'use client'

import { ReactNode } from 'react'

import { deleteUserAction } from '../actions/user-actions'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface DeleteUserAlertProps {
  userId: string
  userName: string
  trigger: ReactNode
  onSuccess?: () => void
}

export function DeleteUserAlert({
  userId,
  userName,
  trigger,
  onSuccess,
}: DeleteUserAlertProps) {
  async function handleConfirm() {
    const result = await deleteUserAction(userId)

    if (result.success) {
      onSuccess?.()
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete <strong>{userName}</strong>? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleConfirm}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
