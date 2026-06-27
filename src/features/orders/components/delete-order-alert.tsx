'use client'

import { ReactNode } from 'react'

import { deleteOrderAction } from '../actions/order-actions'

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

interface DeleteOrderAlertProps {
  queue: string
  orderId: string
  workOrderNumber: string
  trigger: ReactNode
  onSuccess?: () => void
}

export function DeleteOrderAlert({
  queue,
  orderId,
  workOrderNumber,
  trigger,
  onSuccess,
}: DeleteOrderAlertProps) {
  async function handleConfirm() {
    const result = await deleteOrderAction(queue, orderId)

    if (result.success) {
      onSuccess?.()
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete order{' '}
            <strong>{workOrderNumber}</strong>? This action cannot be undone.
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
