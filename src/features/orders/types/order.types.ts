export type OrderStatus = 'pending' | 'in_progress' | 'finished'

export interface Order {
  id: string
  workOrderNumber: string
  operatorNumber: string
  quantity: number
  isUrgent: boolean
  reason: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  // printing
  printText?: string
  // stock-withdrawal
  itemName?: string
  // wire-cutting
  wireName?: string
  lengthMm?: number
}
