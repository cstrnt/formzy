import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { formId } = req.query
    const client = new PrismaClient()

    if (!formId) {
      throw new Error()
    }

    await client.form.update({
      where: { id: Number(formId) },
      data: { submissions: { create: { content: req.body } } },
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
