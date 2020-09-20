import { Form } from '@prisma/client'
import { HTTP_METHODS } from './contants'
import { fetcher } from './helpers'

export const getFormUrl = (id: any) => `/forms/${id}`

export function updateForm(formId: number, values: Partial<Form>) {
  return fetcher('/forms', {
    method: HTTP_METHODS.PATCH,
    body: {
      formId: formId,
      ...values,
    },
  })
}

export function createForm() {
  return fetcher('/forms', {
    method: HTTP_METHODS.POST,
  })
}
export function deleteForm(formId: number) {
  return fetcher(getFormUrl(formId), {
    method: HTTP_METHODS.DELETE,
  })
}

export function addUserToForm(formId: number, email: string) {
  return fetcher('/forms/users/', {
    method: HTTP_METHODS.POST,
    body: { formId, email },
  })
}

export function removeUserFromForm(formId: number, email: string) {
  return fetcher('/forms/users/', {
    method: HTTP_METHODS.DELETE,
    body: { formId, email },
  })
}
