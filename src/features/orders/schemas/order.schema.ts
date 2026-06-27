import { z } from 'zod'

export const baseOrderSchema = z.object({
  workOrderNumber: z.string().min(1, 'Work order number is required'),
  operatorNumber: z.string().min(1, 'Operator number is required'),
  quantity: z.coerce.number().int().positive('Quantity must be greater than 0'),
  isUrgent: z.boolean(),
  reason: z.string().min(1, 'Reason is required'),
})

export const QUEUE_SCHEMAS = {
  printing: baseOrderSchema.extend({
    printText: z.string().min(1, 'Print text is required'),
  }),
  'wire-cutting': baseOrderSchema.extend({
    wireName: z.string().min(1, 'Wire name is required'),
    lengthMm: z.coerce.number().positive('Length must be greater than 0'),
  }),
  'stock-withdrawal': baseOrderSchema.extend({
    itemName: z.string().min(1, 'Item name is required'),
  }),
} as const

export interface OrderFormValues {
  workOrderNumber: string
  operatorNumber: string
  quantity: number
  isUrgent: boolean
  reason: string
  printText?: string
  itemName?: string
  wireName?: string
  lengthMm?: number
}
