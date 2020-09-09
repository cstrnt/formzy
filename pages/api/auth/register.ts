import { NextApiRequest, NextApiResponse } from 'next'
import { hash } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error()
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
    console.error(e)
    res.status(500)
    res.end()
  }
}
