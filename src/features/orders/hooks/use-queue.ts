'use client'

import { useEffect, useState } from 'react'

import { listOrdersAction } from '../actions/order-actions'
import { Order } from '../types/order.types'

import { createAuthenticatedStompClient } from '@/lib/ws/stomp-client'
import { useUserStore } from '@/stores/user-store'

export type { ConnectionStatus } from '@/lib/ws/stomp-client'

type QueueEvent =
  | { type: 'ORDER_CREATED'; data: Order }
  | { type: 'STATUS_CHANGED'; data: Order }
  | { type: 'ORDER_DELETED'; data: Order }

function applyEvent(orders: Order[], event: QueueEvent): Order[] {
  if (event.type === 'ORDER_DELETED') {
    return orders.filter(order => order.id !== event.data.id)
  }

  const index = orders.findIndex(order => order.id === event.data.id)
  if (index === -1) return [...orders, event.data]

  const next = [...orders]
  next[index] = event.data
  return next
}

export function useQueue(queue: string) {
  const user = useUserStore(state => state.user)
  const [orders, setOrders] = useState<Order[]>([])
  const [status, setStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting')

  useEffect(() => {
    if (!user) return

    setOrders([])
    setStatus('connecting')

    listOrdersAction(queue).then(result => {
      if (result.success) {
        setOrders(result.data)
      } else {
        console.error('Failed to load initial orders:', result.message)
      }
    })

    const topic =
      user.role === 'OPERATOR'
        ? `/topic/${queue}/operator/${user.operatorNumber}`
        : `/topic/${queue}`

    const client = createAuthenticatedStompClient({
      onStatusChange: setStatus,
      onConnect: connectedClient => {
        connectedClient.subscribe(topic, message => {
          try {
            const event = JSON.parse(message.body) as QueueEvent
            setOrders(previous => applyEvent(previous, event))
          } catch (error) {
            console.error('Failed to parse queue message:', error, message.body)
          }
        })
      },
    })

    client.activate()

    return () => {
      client.deactivate()
    }
  }, [queue, user])

  return { orders, status }
}
