import { DenylistUser, Form, Submission, User } from '@prisma/client'
import useSWR from 'swr'
import { getFormUrl } from '../lib/form'

export function useUser(initialData?: User) {
  return useSWR<User | null>('/auth/me', { initialData })
}

export type FormData = Form & {
  submissions: Submission[]
  users: User[]
  denylistedUsers: DenylistUser[]
}

export function useFormData(
  formId: string,
  initialData?: FormData,
  interval?: number
) {
  return useSWR<FormData>(formId ? getFormUrl(formId) : null, {
    initialData,
    refreshInterval: interval,
  })
}

export function useForms(initialData: Form[]) {
  return useSWR<Form[]>('/forms', { initialData })
}

export type SubmissionData = Submission & {
  form: Form & { denylistedUsers: DenylistUser[] }
  submitter: DenylistUser
}
export function useSubmissions(
  submissionId: any,
  initialData?: SubmissionData
) {
  return useSWR<SubmissionData>(
    submissionId ? `/submissions/${submissionId}` : null,
    { initialData }
  )
}
