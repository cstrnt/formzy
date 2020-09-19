import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import {
  parseCookie,
  HttpError,
  handleError,
} from '../../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new HttpError(401)
    }
    switch (req.method) {
      case HTTP_METHODS.POST: {
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
      case HTTP_METHODS.DELETE: {
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
    handleError(res, e)
  }
}
