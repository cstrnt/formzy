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

    const form = await client.submission.findOne({
      where: { id },
      include: { form: true },
    })

    await client.$disconnect()
    res.status(200)
    res.json(form)
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
