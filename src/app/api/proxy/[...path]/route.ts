import { NextRequest, NextResponse } from 'next/server'

import { env } from '@/config/env'
import { getSessionToken } from '@/lib/auth/session'

async function forward(request: NextRequest, path: string[]) {
  const token = await getSessionToken()

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const targetUrl = new URL(
    `${path.join('/')}${request.nextUrl.search}`,
    env.NEXT_PUBLIC_API_URL,
  )

  const headers = new Headers(request.headers)
  headers.set('Authorization', `Bearer ${token}`)
  headers.delete('host')
  headers.delete('cookie')

  const hasBody = !['GET', 'HEAD'].includes(request.method)

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
    redirect: 'manual',
  })

  const responseHeaders = new Headers(response.headers)
  responseHeaders.delete('set-cookie')

  return new NextResponse(response.body, {
    status: response.status,
    headers: responseHeaders,
  })
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path)
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path)
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path)
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  return forward(request, (await params).path)
}
