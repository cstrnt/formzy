import { NextApiRequest, NextApiResponse } from 'next'
import { compare } from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error()
    }
    const { email, password } = req.body

    if (!email || !password) {
      throw new Error('Invalid body')
    }
    const client = new PrismaClient()
    const user = await client.user.findOne({
      where: { email },
    })
    if (!user) {
      throw new Error('User not found')
    }
    const passwordsMatch = await compare(password, user.hashedPassword)
    if (!passwordsMatch) {
      throw new Error('Passwords dont match')
    }
    const token = jwt.sign({ id: user.id }, 'GDSJKHD')
    res.setHeader(
      'Set-Cookie',
      `formzyToken=${token}; HttpOnly; Expires=${new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 30
      )}; Path=/`
    )
    await client.$disconnect()
    res.status(200)
    res.end()
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
