import { Heading, Box, IconButton, Input, Grid, Button } from '@chakra-ui/core'
import { Form, Submission, User } from '@prisma/client'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch } from '../src/lib/helpers'
import { useForm } from 'react-hook-form'
import React from 'react'
import { useUser } from '../src/hooks'
import { updateProfile } from '../src/lib/auth'
import { useFormzyToast } from '../src/hooks/toast'
import ErrorComponent from '../src/components/Error'
import Loading from '../src/components/Loading'

type returnData = Form & { submissions: Submission[]; users: User[] }

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  try {
    const data = await ssrFetch<returnData>('/auth/me', req)
    return { props: { data } }
  } catch (e) {
    return { props: {} }
  }
}

const SettingsPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { errorToast, successToast } = useFormzyToast()
  const { back } = useRouter()
  const { data, error, mutate } = useUser(props.data)
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...data,
      newPassword: '',
      repeatPassword: '',
    },
  })

  const onSubmit = async ({
    newPassword,
    repeatPassword,
    name,
  }: {
    newPassword: string
    repeatPassword: string
    name: string
  }) => {
    let body
    if (newPassword && newPassword === repeatPassword) {
      body = { name, password: newPassword }
    } else {
      body = { name }
    }
    try {
      await updateProfile(body)
      mutate({ ...data, name } as User, true)
      setValue('name', name)
      successToast()
    } catch (e) {
      errorToast()
    }
  }

  if (error) return <ErrorComponent />
  if (!data) return <Loading />

  return (
    <Box w="full" maxW="724px">
      <IconButton
        aria-label="go back"
        icon="arrow-back"
        variantColor="green"
        onClick={back}
        mb={6}
      />
      <Box mb={16}>
        <Heading fontWeight="bold" size="2xl">
          Account Settings
        </Heading>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid
            gridTemplateColumns="auto 1fr"
            gridGap={4}
            py={2}
            alignItems="center"
          >
            <Heading size="md">ID</Heading>
            <Input name="name" ref={register} isDisabled />
            <Heading size="md">Email</Heading>
            <Input name="email" ref={register} isDisabled />
            <Heading size="md">Name</Heading>
            <Input name="name" ref={register} />
            <Heading size="md" mt={12}>
              New Password
            </Heading>
            <Input name="newPassword" ref={register} mt={12} />
            <Heading size="md">Repeat Password</Heading>
            <Input name="repeatPassword" ref={register} />
          </Grid>
          <Button type="submit" variantColor="blue" mt={6}>
            Save Changes
          </Button>
        </form>
      </Box>
    </Box>
  )
}

export default SettingsPage
