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
  Link as ChakraLink,
  Text,
} from '@chakra-ui/core'

import { GetServerSideProps } from 'next'
import { fetcher, redirectUser, ssrFetch } from '../src/lib/helpers'
import { mutate } from 'swr'
import Link from 'next/link'
import { useFormzyToast } from '../src/hooks/toast'

function LoginPage() {
  const { errorToast } = useFormzyToast()
  const { register, handleSubmit, errors, setValue } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })
  const { push } = useRouter()

  const onSubmit = async (values: any) => {
    const res = await fetcher('/auth/login', {
      method: 'POST',
      body: values,
      credentials: 'include',
    })
    if (res.ok) {
      push('/forms')
      mutate('/auth/me')
    } else {
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
            Log In
          </Button>
          <Link href="/register" passHref>
            <ChakraLink
              textAlign="center"
              _hover={{ textDecoration: 'none' }}
              _active={{ border: 'none' }}
            >
              No account yet?{' '}
              <Text display="inline" textDecoration="underline">
                Create One
              </Text>
            </ChakraLink>
          </Link>
        </Stack>
      </form>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    await ssrFetch('/auth/me', req)
    redirectUser(res, '/forms')
  } catch (e) {}
  return { props: {} }
}

export default LoginPage
