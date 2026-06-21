'use server'

import { Order } from '../types/order.types'

import { getSession } from '@/lib/auth/session'
import { createAuthenticatedHttpClient } from '@/lib/http/api'
import { getErrorMessage } from '@/lib/http/get-error-message'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string }

export async function listOrdersAction(
  queue: string,
): Promise<ActionResult<Order[]>> {
  try {
    const session = await getSession()
    if (!session) throw new Error('Forbidden')

    const client = await createAuthenticatedHttpClient()

    const data =
      session.role === 'OPERATOR'
        ? await client
            .get(`orders/${queue}/operator/${session.operatorNumber}`)
            .json<Order[]>()
        : await client.get(`orders/${queue}`).json<Order[]>()

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to list orders.'),
    }
  }
}
