import { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { handleError, parseCookie } from '../../../src/lib/helpers'
import { HTTP_METHODS } from '../../../src/lib/contants'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = parseInt(req.query.submissionId as string, 10)
    const client = new PrismaClient()
    const userId = parseCookie(req)
    if (!userId || !id) {
      throw new Error('Invalid user or submissionId')
    }
    switch (req.method) {
      case HTTP_METHODS.GET: {
        const submission = await client.submission.findOne({
          where: { id },
          include: {
            form: { include: { blacklistedUsers: true } },
            submitter: true,
          },
        })
        res.json(submission)
        break
      }
      case HTTP_METHODS.PATCH: {
        const submission = await client.submission.update({
          where: { id },
          data: { isSpam: req.body.isSpam },
        })
        res.json(submission)
        break
      }
      case HTTP_METHODS.DELETE: {
        await client.submission.delete({
          where: { id },
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
