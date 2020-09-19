import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parseCookie } from '../../../src/lib/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = parseInt(req.query.formId as string, 10)
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId || !id) {
      throw new Error('Invalid user or formId')
    }
    switch (req.method) {
      case 'GET': {
        const form = await client.form.findOne({
          where: { id },
          include: {
            submissions: { orderBy: { createdAt: 'desc' } },
            users: true,
          },
        })

        await client.$disconnect()
        res.status(200)
        res.json(form)
        break
      }
      case 'DELETE': {
        const form = await client.form.delete({
          where: { id },
        })

        await client.$disconnect()
        res.status(200)
        res.json(form)
        break
      }
    }
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
