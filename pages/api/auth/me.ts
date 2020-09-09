import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookie, HttpError } from '../../../src/lib/helpers'
import { PrismaClient } from '@prisma/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new HttpError(404, 'Invalid cookie')
    }
    const userData = await client.user.findOne({
      where: { id: userId },
      include: { forms: true },
    })
    await client.$disconnect()
    res.status(200)
    res.json(userData)
  } catch (e) {
    if (e instanceof HttpError) {
      res.status(e.statusCode)
      res.json({ success: false, message: e.message })
    } else {
      res.status(500)
      res.json({ success: false })
    }
  }
}
