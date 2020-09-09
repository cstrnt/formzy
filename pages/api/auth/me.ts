import { NextApiRequest, NextApiResponse } from 'next'
import { parseCookie } from '../../../src/lib/helpers'
import { PrismaClient } from '@prisma/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new Error()
    }
    const userData = await client.user.findOne({
      where: { id: userId },
      include: { forms: true },
    })
    await client.$disconnect()
    res.status(200)
    res.json(userData)
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
