import { RegisterFormValues } from '../../pages/register'
import { HTTP_METHODS } from './contants'
import { fetcher } from './helpers'

export function login(values: { email: string; password: string }) {
  return fetcher('/auth/login', {
    method: HTTP_METHODS.POST,
    body: values,
  })
}

export function signup(values: RegisterFormValues) {
  return fetcher('/auth/register', {
    method: HTTP_METHODS.POST,
    body: values,
  })
}

type UpdateUserInput = Partial<{ name: string; password: string }>

export function updateProfile(newValues: UpdateUserInput) {
  return fetcher('/auth/me', {
    method: HTTP_METHODS.PATCH,
    body: newValues,
  })
}
