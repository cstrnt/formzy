import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parseCookie } from '../../../src/lib/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error()
    }
    const { name } = req.body
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new Error()
    }

    await client.form.create({
      data: {
        name: name || 'New Form',
        adminId: userId,
        users: { connect: { id: userId } },
      },
    })

    await client.$disconnect()
    res.status(200)
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
