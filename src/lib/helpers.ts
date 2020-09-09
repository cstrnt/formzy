import { NextApiRequest } from 'next'

import { verify } from 'jsonwebtoken'
import { User } from '@prisma/client'
import { IncomingMessage } from 'http'

export function parseCookie(req: NextApiRequest) {
  const cookies = req.headers.cookie?.split(';').map((c) => c.trim())
  const cookie = cookies?.find((c) => c.startsWith('formzyToken'))
  if (cookie) {
    const token = cookie.split('=')[1]
    return (verify(token, 'GDSJKHD') as User).id
  }
  return null
}

export function fetcher(url: RequestInfo, config?: RequestInit) {
  return fetch(`/api${url}`, {
    ...config,
    credentials: 'include',
  }).then((res) => res.json())
}

export async function ssrFetch<T>(
  endpoint: string,
  req: IncomingMessage,
  customConfig?: RequestInit
) {
  const config: any = {
    ...customConfig,
    credentials: 'include',
    headers: {
      cookie: req.headers.cookie,
    },
    method: 'GET',
  }
  const response = await fetch(
    `${'http://localhost:3000'}/api${endpoint}`,
    config
  )
  if (response.ok) {
    const data = await response.json()
    return data as T
  }
  throw new Error()
}
