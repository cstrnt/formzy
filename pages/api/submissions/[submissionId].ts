import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parseCookie } from '../../../src/lib/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = parseInt(req.query.submissionId as string, 10)
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId || !id) {
      throw new Error('Invalid user or submissionId')
    }
    switch (req.method) {
      case 'GET': {
        const form = await client.submission.findOne({
          where: { id },
          include: { form: true },
        })

        res.status(200)
        res.json(form)
        break
      }
      case 'DELETE': {
        await client.submission.delete({
          where: { id },
        })
        res.json({ success: true })
        res.end()
        break
      }
    }

    await client.$disconnect()
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
