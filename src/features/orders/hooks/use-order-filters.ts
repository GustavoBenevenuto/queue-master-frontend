'use client'

import { useEffect, useMemo, useState } from 'react'

import { Order, OrderStatus } from '../types/order.types'

import { useUserStore } from '@/stores/user-store'

export type StatusFilter = 'all' | OrderStatus
export type UrgentFilter = 'all' | 'urgent' | 'normal'

export function useOrderFilters(orders: Order[]) {
  const user = useUserStore(state => state.user)
  const isOperator = user?.role === 'OPERATOR'

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [urgentFilter, setUrgentFilter] = useState<UrgentFilter>('all')
  const [operatorFilter, setOperatorFilter] = useState('')

  useEffect(() => {
    if (isOperator && user) {
      setOperatorFilter(String(user.operatorNumber))
    }
  }, [isOperator, user])

  const filteredOrders = useMemo(() => {
    const needle = operatorFilter.toLowerCase()

    return orders.filter(order => {
      if (statusFilter !== 'all' && order.status !== statusFilter) return false
      if (urgentFilter === 'urgent' && !order.isUrgent) return false
      if (urgentFilter === 'normal' && order.isUrgent) return false
      if (
        needle &&
        !String(order.operatorNumber).toLowerCase().includes(needle)
      ) {
        return false
      }
      return true
    })
  }, [orders, statusFilter, urgentFilter, operatorFilter])

  const hasActiveFilters =
    statusFilter !== 'all' ||
    urgentFilter !== 'all' ||
    (!isOperator && operatorFilter !== '')

  function clearFilters() {
    setStatusFilter('all')
    setUrgentFilter('all')
    setOperatorFilter(isOperator ? String(user?.operatorNumber ?? '') : '')
  }

  return {
    filteredOrders,
    statusFilter,
    setStatusFilter,
    urgentFilter,
    setUrgentFilter,
    operatorFilter,
    setOperatorFilter,
    operatorFilterLocked: isOperator,
    hasActiveFilters,
    clearFilters,
  }
}
