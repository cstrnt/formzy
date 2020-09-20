import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Flex,
  Heading,
} from '@chakra-ui/core'
import { useFormzyToast } from '../src/hooks/toast'
import { signup } from '../src/lib/auth'

export type RegisterFormValues = {
  email: string
  password: string
  name: string
}

function LoginPage() {
  const { successToast, errorToast } = useFormzyToast()
  const { register, handleSubmit, errors, setValue } = useForm<
    RegisterFormValues
  >()
  const { push } = useRouter()

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await signup(values)
      successToast('Success! Please log in now.')
      push('/')
    } catch (e) {
      errorToast()
      setValue('password', '')
    }
  }

  return (
    <Flex
      w="full"
      justifyContent="center"
      alignItems="center"
      direction="column"
    >
      <Heading fontFamily="Pacifico" mb={8} size="2xl" color="green.400">
        Formzy
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <FormControl isInvalid={!!errors.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              aria-describedby="name-helper-text"
              ref={register({ required: 'Required' })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              aria-describedby="email-helper-text"
              ref={register({ required: 'Required' })}
            />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <Input
              type="password"
              id="password"
              name="password"
              aria-describedby="password-helper-text"
              ref={register({ required: 'Required' })}
            />
            <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
          </FormControl>
          <Button type="submit" variantColor="green">
            Sign Up
          </Button>
        </Stack>
      </form>
    </Flex>
  )
}

export default LoginPage
