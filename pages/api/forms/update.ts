import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parseCookie } from '../../../src/lib/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error()
    }
    const { name, formId } = req.body
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new Error()
    }

    await client.form.update({
      where: { id: formId },
      data: { name },
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
