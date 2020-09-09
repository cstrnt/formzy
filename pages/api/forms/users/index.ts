import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { parseCookie, HttpError } from '../../../../src/lib/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new Error()
    }
    switch (req.method) {
      case 'POST': {
        const { formId, email } = req.body
        const forms = await client.form.update({
          where: { id: formId },
          data: {
            users: { connect: { email } },
          },
        })

        res.status(200)
        res.json(forms)
        break
      }
      case 'DELETE': {
        const { formId, email } = req.body
        const currentForm = await client.form.findOne({
          where: { id: formId },
        })
        if (currentForm?.adminId !== userId) {
          throw new HttpError(401)
        }
        await client.form.update({
          where: { id: formId },
          data: {
            users: { disconnect: { email } },
          },
        })
        res.status(200)
        res.json({})
      }
    }
    await client.$disconnect()
  } catch (e) {
    console.error(e)
    res.status(500)
    res.end()
  }
}
