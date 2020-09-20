import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import Router from 'next/router'
import { verify } from 'jsonwebtoken'
import { User } from '@prisma/client'
import { IncomingMessage, ServerResponse } from 'http'

export function parseCookie(req: NextApiRequest) {
  const cookies = req.headers.cookie?.split(';').map((c) => c.trim())
  const cookie = cookies?.find((c) => c.startsWith('formzyToken'))
  if (cookie) {
    const token = cookie.split('=')[1]
    return (verify(token, 'GDSJKHD') as User).id
  }
  return null
}

interface CustomRequestInit extends RequestInit {
  body?: any
}

export async function fetcher(url: RequestInfo, config?: CustomRequestInit) {
  const res = await fetch(`/api${url}`, {
    ...config,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(config?.body && { body: JSON.stringify(config.body) }),
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
  const BASE_URL = getConfig().publicRuntimeConfig.BASE_URL
  console.log(BASE_URL)
  const response = await fetch(`${BASE_URL}/api${endpoint}`, config)
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

export function redirectUser(res: ServerResponse, url?: string) {
  res.writeHead(302, { Location: url || '/' })
  res.end()
}

export function handleError(res: NextApiResponse, error: any) {
  if (process.env.NODE_ENV === 'development') {
    console.error(error)
  }
  if (error instanceof HttpError) {
    res.status(error.statusCode)
    res.send(error.message)
  } else {
    res.status(500)
    res.end()
  }
}
