import { Flex, Spinner } from '@chakra-ui/core'
import { useEffect } from 'react'
import { useFormzyToast } from '../hooks/toast'

const ErrorComponent = () => {
  const { errorToast } = useFormzyToast()
  useEffect(() => {
    errorToast()
  }, [])
  return (
    <Flex w="100vw" h="100vh" justifyContent="center" alignItems="center">
      <Spinner color="green.500" size="xl" />
    </Flex>
  )
}

export default ErrorComponent
