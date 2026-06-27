'use client'

import { ReactNode, useState } from 'react'

import { updateOrderStatusAction } from '../actions/order-actions'
import { Order, OrderStatus } from '../types/order.types'

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

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'finished', label: 'Finished' },
]

interface EditOrderStatusDialogProps {
  queue: string
  order: Order
  trigger: ReactNode
  onSuccess?: () => void
}

export function EditOrderStatusDialog({
  queue,
  order,
  trigger,
  onSuccess,
}: EditOrderStatusDialogProps) {
  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<OrderStatus>(order.status)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit() {
    setFormError(null)
    setIsSubmitting(true)

    const result = await updateOrderStatusAction(queue, order.id, status)

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
        if (!isOpen) {
          setFormError(null)
          setStatus(order.status)
        }
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update status — {order.workOrderNumber}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {formError && (
            <p className="text-sm font-medium text-destructive">{formError}</p>
          )}

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={value => setStatus(value as OrderStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}
