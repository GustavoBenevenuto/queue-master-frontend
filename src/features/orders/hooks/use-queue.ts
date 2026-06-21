'use client'

import { useEffect, useState } from 'react'

import { Order } from '../types/order.types'

import { createAuthenticatedStompClient } from '@/lib/ws/stomp-client'
import { useUserStore } from '@/stores/user-store'

export type { ConnectionStatus } from '@/lib/ws/stomp-client'

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

    const topic =
      user.role === 'OPERATOR'
        ? `/topic/${queue}/operator/${user.operatorNumber}`
        : `/topic/${queue}`

    const client = createAuthenticatedStompClient({
      onStatusChange: setStatus,
      onConnect: connectedClient => {
        connectedClient.subscribe(topic, message => {
          try {
            setOrders(JSON.parse(message.body) as Order[])
          } catch {
            // ignore malformed payloads
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
