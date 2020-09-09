import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient, Form } from '@prisma/client'
import { parseCookie, HttpError } from '../../../src/lib/helpers'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error()
    }
    const {
      name,
      formId,
      callbackUrl,
      hasCustomCallback,
    } = req.body as Form & { formId: number }
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId) {
      throw new HttpError(404)
    }

    await client.form.update({
      where: { id: formId },
      data: { name, callbackUrl, hasCustomCallback },
    })

    await client.$disconnect()
    res.status(200)
    res.json({})
  } catch (e) {
    console.log(e)
    if (e instanceof HttpError) {
      res.status(e.statusCode)
      res.json({ success: false, message: e.message })
    } else {
      res.status(500)
      res.end()
    }
  }
}
