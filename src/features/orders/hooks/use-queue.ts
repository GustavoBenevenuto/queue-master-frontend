'use client'

import { Client } from '@stomp/stompjs'
import { useEffect, useRef, useState } from 'react'

import { Order } from '../types/order.types'

import { getWebSocketTokenAction } from '@/app/auth/actions'
import { UserRole } from '@/features/users/types/user.types'
import { getWsUrl } from '@/lib/ws/get-ws-url'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface UseQueueParams {
  queue: string
  role: UserRole
  operatorNumber: string
}

export function useQueue({ queue, role, operatorNumber }: UseQueueParams) {
  const [orders, setOrders] = useState<Order[]>([])
  const [status, setStatus] = useState<ConnectionStatus>('connecting')
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    setOrders([])
    setStatus('connecting')

    const topic =
      role === 'OPERATOR'
        ? `/topic/${queue}/operator/${operatorNumber}`
        : `/topic/${queue}`

    const client = new Client({
      brokerURL: getWsUrl(),
      reconnectDelay: 5000,
      beforeConnect: async () => {
        const token = await getWebSocketTokenAction()
        client.connectHeaders = token
          ? { Authorization: `Bearer ${token}` }
          : {}
      },
      onConnect: () => {
        setStatus('connected')
        client.subscribe(topic, message => {
          try {
            setOrders(JSON.parse(message.body) as Order[])
          } catch {
            // ignore malformed payloads
          }
        })
      },
      onDisconnect: () => setStatus('disconnected'),
      onWebSocketClose: () => setStatus('disconnected'),
    })

    clientRef.current = client
    client.activate()

    return () => {
      client.deactivate()
      clientRef.current = null
    }
  }, [queue, role, operatorNumber])

  return { orders, status }
}
