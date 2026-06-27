'use server'

import { OrderFormValues } from '../schemas/order.schema'
import { Order, OrderStatus } from '../types/order.types'

import { getSession } from '@/lib/auth/session'
import { createAuthenticatedHttpClient } from '@/lib/http/api'
import { getErrorMessage } from '@/lib/http/get-error-message'

type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; message: string }

async function requireAdminOrInventor() {
  const session = await getSession()

  if (!session || (session.role !== 'ADMIN' && session.role !== 'INVENTOR')) {
    throw new Error('Forbidden')
  }

  return session
}

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

export async function createOrderAction(
  queue: string,
  payload: OrderFormValues,
): Promise<ActionResult<Order[]>> {
  try {
    const session = await getSession()
    if (!session) throw new Error('Forbidden')

    const client = await createAuthenticatedHttpClient()
    const data = await client
      .post(`orders/${queue}`, { json: [payload] })
      .json<Order[]>()

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to create order.'),
    }
  }
}

export async function updateOrderStatusAction(
  queue: string,
  id: string,
  status: OrderStatus,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdminOrInventor()
    const client = await createAuthenticatedHttpClient()
    await client.patch(`orders/${queue}/${id}/status`, { json: { status } })

    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to update order status.'),
    }
  }
}

export async function deleteOrderAction(
  queue: string,
  id: string,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdminOrInventor()
    const client = await createAuthenticatedHttpClient()
    await client.delete(`orders/${queue}/${id}`)

    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to delete order.'),
    }
  }
}
