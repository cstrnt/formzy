import { HTTP_METHODS } from './contants'
import { fetcher } from './helpers'

export const getSubmissionURL = (id: any) => `/submissions/${id}`

export function deleteSubmission(id: string) {
  return fetcher(getSubmissionURL(id), {
    method: HTTP_METHODS.DELETE,
  })
}

export function setSpamStatus(submissionId: string, newStatus: boolean) {
  return fetcher(getSubmissionURL(submissionId), {
    method: 'PATCH',
    body: { isSpam: newStatus },
  })
}
