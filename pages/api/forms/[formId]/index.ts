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
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId || !id) {
      throw new HttpError(401, 'Invalid user or formId')
    }
    switch (req.method) {
      case HTTP_METHODS.GET: {
        const form = await client.form.findOne({
          where: { id },
          include: {
            submissions: { orderBy: { createdAt: 'desc' } },
            users: true,
            denylistedUsers: true,
          },
        })

        res.status(200)
        res.json(form)
        break
      }
      case HTTP_METHODS.DELETE: {
        const form = await client.form.delete({
          where: { id },
        })

        res.status(200)
        res.json(form)
        break
      }
    }
    await client.$disconnect()
  } catch (e) {
    handleError(res, e)
  }
}
