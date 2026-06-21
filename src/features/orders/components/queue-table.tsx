'use client'

import { Circle, X } from 'lucide-react'

import { useOrderFilters } from '../hooks/use-order-filters'
import { useQueue } from '../hooks/use-queue'
import { QUEUE_EXTRA_COLUMNS } from '../order-columns'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

  const {
    filteredOrders,
    statusFilter,
    setStatusFilter,
    urgentFilter,
    setUrgentFilter,
    operatorFilter,
    setOperatorFilter,
    operatorFilterLocked,
    hasActiveFilters,
    clearFilters,
  } = useOrderFilters(orders)

  const extraColumns = QUEUE_EXTRA_COLUMNS[queue] ?? []
  const columnCount = 6 + extraColumns.length

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

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select
            value={statusFilter}
            onValueChange={value =>
              setStatusFilter(value as typeof statusFilter)
            }
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In progress</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Urgency</Label>
          <Select
            value={urgentFilter}
            onValueChange={value =>
              setUrgentFilter(value as typeof urgentFilter)
            }
          >
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All orders</SelectItem>
              <SelectItem value="urgent">Urgent only</SelectItem>
              <SelectItem value="normal">Normal only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label>Operator</Label>
          <Input
            value={operatorFilter}
            onChange={event => setOperatorFilter(event.target.value)}
            disabled={operatorFilterLocked}
            placeholder="Operator number"
            className="w-40"
          />
        </div>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="size-4" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Work order</TableHead>
              <TableHead>Operator</TableHead>
              {extraColumns.map(column => (
                <TableHead key={column.header}>{column.header}</TableHead>
              ))}
              <TableHead>Qty</TableHead>
              <TableHead>Urgent</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated at</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredOrders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.workOrderNumber}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {order.operatorNumber}
                </TableCell>
                {extraColumns.map(column => (
                  <TableCell
                    key={column.header}
                    className="text-muted-foreground"
                  >
                    {column.cell(order)}
                  </TableCell>
                ))}
                <TableCell className="text-muted-foreground">
                  {order.quantity}
                </TableCell>
                <TableCell>
                  {order.isUrgent ? (
                    <Badge variant="destructive">Urgent</Badge>
                  ) : (
                    <Badge variant="secondary">No urgent</Badge>
                  )}
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

            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columnCount}
                  className="text-center py-8 text-sm text-muted-foreground"
                >
                  {orders.length === 0
                    ? 'No orders yet.'
                    : 'No orders match the filters.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
