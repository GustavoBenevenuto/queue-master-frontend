import { ReactNode } from 'react'

import { Order } from './types/order.types'

export interface OrderColumn {
  header: string
  cell: (order: Order) => ReactNode
}

/** Columns specific to each section, on top of the shared base columns. */
export const QUEUE_EXTRA_COLUMNS: Record<string, OrderColumn[]> = {
  printing: [{ header: 'Print text', cell: order => order.printText }],
  'wire-cutting': [
    { header: 'Wire', cell: order => order.wireName },
    { header: 'Length (mm)', cell: order => order.lengthMm },
  ],
  'stock-withdrawal': [{ header: 'Item', cell: order => order.itemName }],
}
