import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import dayjs from 'dayjs'
import { handleError, HttpError, redirectUser } from '../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== HTTP_METHODS.POST) {
      throw new HttpError(403, 'Invalid Method')
    }
    const { formId } = req.query
    const client = new PrismaClient()

    if (!formId) {
      throw new HttpError(403, 'Invalid Query')
    }

    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress

    const uniqueIPID = crypto
      .createHash('md5')
      .update(ip as string)
      .digest('hex')

    const submissionsByUser = await client.submission.findMany({
      where: { AND: [{ formId: Number(formId) }, { submittedBy: uniqueIPID }] },
    })

    const isRepeatedSubmission = submissionsByUser.some(
      (submission) =>
        dayjs().diff(dayjs(submission.createdAt), 'second') <=
        parseInt(process.env.SPAM_TRESHOLD as string, 10)
    )

    const formData = await client.form.update({
      where: { id: Number(formId) },
      data: {
        submissions: {
          create: {
            content: req.body,
            submittedBy: uniqueIPID,
            isSpam: isRepeatedSubmission,
          },
        },
      },
    })

    await client.$disconnect()
    redirectUser(
      res,
      formData.hasCustomCallback && formData.callbackUrl
        ? formData.callbackUrl
        : `${process.env.BASE_URL}/thank-you/${formData.id}`
    )
  } catch (e) {
    handleError(res, e)
  }
}
