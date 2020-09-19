import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { handleError, HttpError } from '../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== HTTP_METHODS.POST) {
      throw new HttpError(403)
    }
    const { email, password, name } = req.body
    const hashedPassword = await hash(password, 10)
    const client = new PrismaClient()
    await client.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    })

    await client.$disconnect()
    res.status(200)
    res.end()
  } catch (e) {
    handleError(res, e)
  }
}
