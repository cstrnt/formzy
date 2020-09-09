import { NextApiRequest } from 'next'
import Router from 'next/router'
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

export async function fetcher(url: RequestInfo, config?: RequestInit) {
  const res = await fetch(`/api${url}`, {
    ...config,
    credentials: 'include',
  })
  if (res.ok) {
    const data = await res.json()
    return data
  } else {
    switch (res.status) {
      case 404: {
        Router.replace('/')
        break
      }
      default: {
        throw new Error()
      }
    }
  }
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
  const response = await fetch(`${process.env.BASE_URL}/api${endpoint}`, config)
  if (response.ok) {
    const data = await response.json()
    return data as T
  }
  throw new Error()
}

export class HttpError extends Error {
  statusCode: number

  message: string

  constructor(statusCode?: number, message?: string) {
    super()
    this.statusCode = statusCode || 500
    this.message = message || 'Something went wrong'
  }
}
