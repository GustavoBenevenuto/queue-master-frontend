import { Client } from '@stomp/stompjs'

import { getWsUrl } from './get-ws-url'

import { getWebSocketTokenAction } from '@/app/auth/actions'

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

interface CreateAuthenticatedStompClientParams {
  onConnect: (client: Client) => void
  onStatusChange: (status: ConnectionStatus) => void
}

/** Centraliza o handshake autenticado: o token só existe em memória durante o connect. */
export function createAuthenticatedStompClient({
  onConnect,
  onStatusChange,
}: CreateAuthenticatedStompClientParams): Client {
  const client = new Client({
    brokerURL: getWsUrl(),
    reconnectDelay: 5000,
    beforeConnect: async () => {
      const token = await getWebSocketTokenAction()
      client.connectHeaders = token ? { Authorization: `Bearer ${token}` } : {}
    },
    onConnect: () => {
      onStatusChange('connected')
      onConnect(client)
    },
    onDisconnect: () => onStatusChange('disconnected'),
    onWebSocketClose: () => onStatusChange('disconnected'),
  })

  return client
}
