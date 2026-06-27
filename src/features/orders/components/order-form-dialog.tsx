'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode, useEffect, useState } from 'react'
import { FormProvider, Resolver, useForm } from 'react-hook-form'

import { createOrderAction } from '../actions/order-actions'
import { QUEUE_EXTRA_FIELDS } from '../order-fields'
import { OrderFormValues, QUEUE_SCHEMAS } from '../schemas/order.schema'

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
import { Switch } from '@/components/ui/switch'
import { useUserStore } from '@/stores/user-store'

interface OrderFormDialogProps {
  queue: string
  trigger: ReactNode
  onSuccess?: () => void
}

export function OrderFormDialog({
  queue,
  trigger,
  onSuccess,
}: OrderFormDialogProps) {
  const user = useUserStore(state => state.user)
  const isOperator = user?.role === 'OPERATOR'

  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const schema = QUEUE_SCHEMAS[queue as keyof typeof QUEUE_SCHEMAS]
  const extraFields = QUEUE_EXTRA_FIELDS[queue] ?? []

  const form = useForm<OrderFormValues>({
    resolver: schema
      ? (zodResolver(schema) as unknown as Resolver<OrderFormValues>)
      : undefined,
    defaultValues: {
      workOrderNumber: '',
      operatorNumber: '',
      quantity: 1,
      isUrgent: false,
      reason: '',
    },
  })

  // `user` hidrata de forma assíncrona no store (depois do mount), então não
  // dá pra confiar nele em `defaultValues` (lido só uma vez). Sincroniza aqui.
  useEffect(() => {
    if (isOperator && user) {
      form.setValue('operatorNumber', String(user.operatorNumber ?? ''))
    }
  }, [isOperator, user, form])

  async function handleSubmit(values: OrderFormValues) {
    setFormError(null)
    setIsSubmitting(true)

    const payload = isOperator
      ? { ...values, operatorNumber: String(user?.operatorNumber ?? '') }
      : values

    const result = await createOrderAction(queue, payload)
    setIsSubmitting(false)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    form.reset({
      workOrderNumber: '',
      operatorNumber: isOperator ? String(user?.operatorNumber ?? '') : '',
      quantity: 1,
      isUrgent: false,
      reason: '',
    })
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
          <DialogTitle>New order</DialogTitle>
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

            <InputForm<OrderFormValues>
              name="workOrderNumber"
              label="Work order number"
            />

            <InputForm<OrderFormValues>
              name="operatorNumber"
              label="Operator number"
              disabled={isOperator}
            />

            <InputForm<OrderFormValues>
              name="quantity"
              label="Quantity"
              type="number"
              min={1}
            />

            {extraFields.map(field => (
              <InputForm<OrderFormValues>
                key={field.name}
                name={field.name}
                label={field.label}
                type={field.type ?? 'text'}
              />
            ))}

            <InputForm<OrderFormValues> name="reason" label="Reason" />

            <div className="flex items-center justify-between">
              <Label htmlFor="isUrgent">Urgent</Label>
              <Switch
                id="isUrgent"
                checked={form.watch('isUrgent')}
                onCheckedChange={checked => form.setValue('isUrgent', checked)}
              />
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create order'}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
