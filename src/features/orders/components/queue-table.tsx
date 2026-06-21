'use client'

import { Circle } from 'lucide-react'

import { useQueue } from '../hooks/use-queue'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUserStore } from '@/stores/user-store'

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In progress',
  finished: 'Finished',
}

const STATUS_VARIANTS: Record<string, 'secondary' | 'default' | 'outline'> = {
  pending: 'secondary',
  in_progress: 'default',
  finished: 'outline',
}

const CONNECTION_LABELS = {
  connecting: 'Connecting...',
  connected: 'Live',
  disconnected: 'Disconnected',
} as const

const CONNECTION_COLORS = {
  connecting: 'text-amber-500',
  connected: 'text-emerald-500',
  disconnected: 'text-destructive',
} as const

interface QueueTableProps {
  queue: string
  label: string
}

export function QueueTable({ queue, label }: QueueTableProps) {
  const user = useUserStore(state => state.user)
  const { orders, status } = useQueue(queue)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">{label}</h2>
          <p className="text-sm text-muted-foreground">
            {user?.role === 'OPERATOR'
              ? `Live orders for operator ${user.operatorNumber}`
              : 'Live orders across the factory'}
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Circle
            className={`size-2.5 fill-current ${CONNECTION_COLORS[status]}`}
          />
          {CONNECTION_LABELS[status]}
        </div>
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated at</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="text-muted-foreground">
                  {order.operatorNumber}
                </TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[order.status] ?? 'secondary'}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.updatedAt}
                </TableCell>
              </TableRow>
            ))}

            {orders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-sm text-muted-foreground"
                >
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
