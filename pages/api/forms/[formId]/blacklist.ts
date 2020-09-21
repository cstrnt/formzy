import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import {
  handleError,
  HttpError,
  parseCookie,
} from '../../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = parseInt(req.query.formId as string, 10)
    const { submitterId } = req.body
    const client = new PrismaClient()
    const userId = parseCookie(req)

    if (!userId || !id) {
      throw new HttpError(401, 'Invalid user or formId')
    }
    const currentForm = await client.form.findOne({
      where: { id },
      select: { adminId: true },
    })

    if (currentForm?.adminId !== userId) {
      throw new HttpError(401)
    }

    switch (req.method) {
      case HTTP_METHODS.POST: {
        const form = await client.form.update({
          where: { id },
          data: {
            blacklistedUsers: {
              connectOrCreate: {
                create: { id: submitterId },
                where: { id: submitterId },
              },
            },
          },
        })

        res.json(form)
        break
      }
      case HTTP_METHODS.DELETE: {
        const form = await client.form.update({
          where: { id },
          data: { blacklistedUsers: { disconnect: { id: submitterId } } },
        })
        res.json(form)
        break
      }
    }
    await client.$disconnect()
  } catch (e) {
    handleError(res, e)
  }
}
