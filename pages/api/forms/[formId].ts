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

    const form = await client.form.findOne({
      where: { id },
      include: { submissions: true, users: { where: { id: userId } } },
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
