import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookie, HttpError, handleError } from '../../../src/lib/helpers'
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import { HTTP_METHODS } from '../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new HttpError(401, 'Invalid cookie')
    }
    switch (req.method) {
      case HTTP_METHODS.GET: {
        const userData = await client.user.findOne({
          where: { id: userId },
          include: { forms: true },
        })
        res.json(userData)
        break
      }
      case HTTP_METHODS.PATCH: {
        const { password, ...rest } = req.body
        let hashedPassword = undefined
        if (password) {
          hashedPassword = await hash(password, 10)
        }
        const userData = await client.user.update({
          where: { id: userId },
          data: { hashedPassword, ...rest },
        })
        res.json(userData)
        break
      }
    }

    await client.$disconnect()
  } catch (e) {
    handleError(res, e)
  }
}
