import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { formId } = req.query
    const client = new PrismaClient()

    if (!formId) {
      throw new Error()
    }

    const formData = await client.form.update({
      where: { id: Number(formId) },
      data: { submissions: { create: { content: req.body } } },
    })

    await client.$disconnect()
    res.writeHead(302, {
      Location: formData.hasCustomCallback
        ? (formData.callbackUrl as string)
        : `${process.env.BASE_URL}/thank-you/${formData.id}`,
    })
    res.end()
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
