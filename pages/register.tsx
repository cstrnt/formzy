import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import {
  useToast,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Stack,
  Flex,
  Heading,
} from '@chakra-ui/core'

function LoginPage() {
  const toast = useToast()
  const { register, handleSubmit, errors, setValue } = useForm({
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })
  const { push } = useRouter()

  const onSubmit = async ({ name, email, password }: any) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      credentials: 'include',
    })
    if (res.ok) {
      toast({
        position: 'top',
        status: 'info',
        title: 'Success! Please log in now.',
      })
      push('/')
    } else {
      toast({
        position: 'top',
        status: 'error',
        title: 'Something went wrong!',
      })
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
