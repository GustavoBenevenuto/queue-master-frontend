import { PackageMinus, Printer, Scissors, type LucideIcon } from 'lucide-react'

export interface QueueListItem {
  key: string
  label: string
  description: string
  href: string
  icon: LucideIcon
  available: boolean
}

export const QUEUE_LISTS: QueueListItem[] = [
  {
    key: 'printing',
    label: 'Printing',
    description: 'Live printing orders',
    href: '/orders/printing',
    icon: Printer,
    available: true,
  },
  {
    key: 'wire-cutting',
    label: 'Wire cutting',
    description: 'Live wire-cutting orders',
    href: '/orders/wire-cutting',
    icon: Scissors,
    available: true,
  },
  {
    key: 'stock-withdrawal',
    label: 'Stock withdrawal',
    description: 'Live stock withdrawal orders',
    href: '/orders/stock-withdrawal',
    icon: PackageMinus,
    available: true,
  },
]
