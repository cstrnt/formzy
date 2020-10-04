import { NextApiRequest, NextApiResponse } from 'next'
import getConfig from 'next/config'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'
import dayjs from 'dayjs'
import { handleError, HttpError, redirectUser } from '../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../src/lib/contants'

const BASE_URL = getConfig().publicRuntimeConfig.BASE_URL

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
        parseInt(getConfig().publicRuntimeConfig.SPAM_TRESHOLD, 10)
    )
    const denylistedUsers = await client.form.findOne({
      where: { id: Number(formId) },
      select: { denylistedUsers: { where: { id: uniqueIPID } } },
    })

    if (denylistedUsers?.denylistedUsers.length !== 0) {
      throw new HttpError(403, 'Unauthorized')
    }

    const formData = await client.form.update({
      where: { id: Number(formId) },
      data: {
        submissions: {
          create: {
            content: req.body,
            submitter: {
              connectOrCreate: {
                create: { id: uniqueIPID },
                where: { id: uniqueIPID },
              },
            },
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
        : `${BASE_URL}/thank-you/${formData.id}`
    )
  } catch (e) {
    handleError(res, e)
  }
}
