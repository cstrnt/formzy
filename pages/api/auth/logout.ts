import { NextApiResponse, NextApiRequest } from 'next'
import { COOKIE_NAME } from '../../../src/lib/contants'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
  )
  res.json({})
}
