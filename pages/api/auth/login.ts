import { NextApiRequest, NextApiResponse } from 'next'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { handleError, HttpError } from '../../../src/lib/helpers'
import { COOKIE_NAME, HTTP_METHODS } from '../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== HTTP_METHODS.POST) {
      throw new HttpError(403, 'Invalid Method')
    }
    const { email, password } = req.body

    if (!email || !password) {
      throw new HttpError(403, 'Invalid Body')
    }
    const client = new PrismaClient()
    const user = await client.user.findOne({
      where: { email },
    })
    if (!user) {
      throw new HttpError(500, 'User not found')
    }
    const passwordsMatch = await compare(password, user.hashedPassword)
    if (!passwordsMatch) {
      throw new HttpError(401)
    }
    const token = jwt.sign({ id: user.id }, 'GDSJKHD')
    res.setHeader(
      'Set-Cookie',
      `${COOKIE_NAME}=${token}; HttpOnly; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30
      )}; Path=/`
    )
    await client.$disconnect()
    res.json({})
  } catch (e) {
    handleError(res, e)
  }
}
