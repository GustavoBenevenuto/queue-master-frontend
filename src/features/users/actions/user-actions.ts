'use server'

import {
  ChangePasswordPayload,
  CreateUserPayload,
  UpdateUserPayload,
  UserDTO,
} from '../types/user.types'

import { getSession } from '@/lib/auth/session'
import { createAuthenticatedHttpClient } from '@/lib/http/api'
import { getErrorMessage } from '@/lib/http/get-error-message'

type ActionResult<T = undefined> =
  | { success: true; data: T }
  | { success: false; message: string }

async function requireAdmin() {
  const session = await getSession()

  if (session?.role !== 'ADMIN') {
    throw new Error('Forbidden')
  }

  return session
}

export async function listUsersAction(): Promise<ActionResult<UserDTO[]>> {
  try {
    await requireAdmin()
    const client = await createAuthenticatedHttpClient()
    const data = await client.get('users').json<UserDTO[]>()

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to list users.'),
    }
  }
}

export async function createUserAction(
  payload: CreateUserPayload,
): Promise<ActionResult<UserDTO>> {
  try {
    await requireAdmin()
    const client = await createAuthenticatedHttpClient()
    const data = await client.post('users', { json: payload }).json<UserDTO>()

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to create user.'),
    }
  }
}

export async function updateUserAction(
  id: string,
  payload: UpdateUserPayload,
): Promise<ActionResult<UserDTO>> {
  try {
    await requireAdmin()
    const client = await createAuthenticatedHttpClient()
    const data = await client
      .put(`users/${id}`, { json: payload })
      .json<UserDTO>()

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to update user.'),
    }
  }
}

export async function deleteUserAction(
  id: string,
): Promise<ActionResult<undefined>> {
  try {
    await requireAdmin()
    const client = await createAuthenticatedHttpClient()
    await client.delete(`users/${id}`)

    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to delete user.'),
    }
  }
}

export async function changePasswordAction(
  id: string,
  payload: ChangePasswordPayload,
): Promise<ActionResult<undefined>> {
  try {
    const session = await getSession()

    if (!session || (session.id !== id && session.role !== 'ADMIN')) {
      throw new Error('Forbidden')
    }

    const client = await createAuthenticatedHttpClient()
    await client.patch(`users/${id}/password`, { json: payload })

    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      message: await getErrorMessage(error, 'Unable to change password.'),
    }
  }
}
