import { Form, Submission, User } from '@prisma/client'
import useSWR from 'swr'
import { getFormUrl } from '../lib/form'

export function useUser(initialData?: User) {
  return useSWR<User | null>('/auth/me', { initialData })
}

export type FormData = Form & { submissions: Submission[]; users: User[] }

export function useFormData(formId: string, initialData?: FormData) {
  return useSWR<FormData>(formId ? getFormUrl(formId) : null, { initialData })
}

export function useForms(initialData: Form[]) {
  return useSWR<Form[]>('/forms', { initialData })
}

export type SubmissionData = Submission & { form: Form }
export function useSubmissions(
  submissionId: any,
  initialData?: SubmissionData
) {
  return useSWR<SubmissionData>(
    submissionId ? `/submissions/${submissionId}` : null,
    { initialData }
  )
}
