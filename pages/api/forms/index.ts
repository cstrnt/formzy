import { NextApiRequest, NextApiResponse } from 'next'
import { Form, PrismaClient } from '@prisma/client'
import { handleError, HttpError, parseCookie } from '../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new HttpError(401)
    }
    switch (req.method) {
      case HTTP_METHODS.GET: {
        const forms = await client.form.findMany({
          where: { users: { some: { id: userId } } },
        })
        res.json(forms)
        break
      }
      case HTTP_METHODS.POST: {
        const { name } = req.body
        await client.form.create({
          data: {
            name: name || 'New Form',
            adminId: userId,
            users: { connect: { id: userId } },
          },
        })
        res.json({ success: true })
        break
      }
      case HTTP_METHODS.PATCH: {
        const {
          name,
          formId,
          callbackUrl,
          hasCustomCallback,
          thankYouText,
        } = req.body as Form & { formId: number }
        await client.form.update({
          where: { id: formId },
          data: { name, callbackUrl, hasCustomCallback, thankYouText },
        })
        res.json({ success: true })
        break
      }
    }

    await client.$disconnect()
  } catch (e) {
    handleError(res, e)
  }
}
