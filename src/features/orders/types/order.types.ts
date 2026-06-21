export type OrderStatus = 'pending' | 'in_progress' | 'finished'

export interface Order {
  id: string
  operatorNumber: string
  status: OrderStatus
  createdAt: string
  updatedAt: string
  [key: string]: unknown
}
