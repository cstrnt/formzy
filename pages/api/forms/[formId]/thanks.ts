import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { handleError, HttpError } from '../../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = parseInt(req.query.formId as string, 10)
    if (!id) {
      throw new HttpError(404, 'Form not found')
    }
    const client = new PrismaClient()
    switch (req.method) {
      case HTTP_METHODS.GET: {
        const form = await client.form.findOne({
          where: { id },
          select: { name: true, thankYouText: true },
        })
        await client.$disconnect()
        res.json(form)
        break
      }
    }
  } catch (e) {
    handleError(res, e)
  }
}
