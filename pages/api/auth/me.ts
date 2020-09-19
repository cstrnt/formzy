import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookie, HttpError } from '../../../src/lib/helpers'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new HttpError(404, 'Invalid cookie')
    }
    switch (req.method) {
      case 'GET': {
        const userData = await client.user.findOne({
          where: { id: userId },
          include: { forms: true },
        })
        res.status(200)
        res.json(userData)
        break
      }
      case 'PATCH': {
        const { password, ...rest } = req.body
        let hashedPassword = undefined
        if (password) {
          hashedPassword = await hash(password, 10)
        }
        const userData = await client.user.update({
          where: { id: userId },
          data: { hashedPassword, ...rest },
        })
        res.status(200)
        res.json(userData)
        break
      }
    }

    await client.$disconnect()
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
