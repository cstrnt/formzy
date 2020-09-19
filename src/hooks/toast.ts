import { useToast } from '@chakra-ui/core'
import { useCallback } from 'react'

export function useFormzyToast() {
  const toast = useToast()

  const errorToast = useCallback(
    (title?: string, text?: string) =>
      toast({
        position: 'top',
        status: 'error',
        title: title || 'Something Went Wrong',
        description: text,
      }),
    []
  )
  const successToast = useCallback(
    (title?: string, text?: string) =>
      toast({
        position: 'top',
        status: 'success',
        title: title || 'Success',
        description: text,
      }),
    []
  )

  return { errorToast, successToast }
}
