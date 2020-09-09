import { NextApiResponse, NextApiRequest } from 'next'

export default async (_req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader(
    'Set-Cookie',
    'formzyToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
  )
  res.end()
}
