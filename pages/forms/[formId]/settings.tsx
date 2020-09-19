import useSWR from 'swr'
import {
  Heading,
  Box,
  IconButton,
  Grid,
  Input,
  Button,
  useToast,
  Checkbox,
  PseudoBox,
  Avatar,
  InputGroup,
  InputRightElement,
  Link,
  Flex,
  Text,
  Divider,
} from '@chakra-ui/core'
import { Form, Submission, User } from '@prisma/client'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch, fetcher } from '../../../src/lib/helpers'
import { useForm } from 'react-hook-form'
import { useState, ChangeEvent } from 'react'

type returnData = Form & { submissions: Submission[]; users: User[] }

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  if (params?.formId) {
    const data = await ssrFetch<returnData>(`/forms/${params?.formId}`, req)
    return { props: { data } }
  }
  return { props: { data: {} } }
}

const SettingsPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const [newUser, setNewUser] = useState('')
  const toast = useToast()
  const { back, query, push } = useRouter()
  const { data: currentUser } = useSWR<User>('/auth/me')
  const { data, error, revalidate, mutate } = useSWR<returnData>(
    `/forms/${query?.formId}`,
    {
      initialData: props.data,
    }
  )
  const { register, handleSubmit } = useForm({
    defaultValues: {
      ...data,
    },
  })

  const onSubmit = async (values: any) => {
    try {
      await fetcher('/forms/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: data?.id,
          ...values,
        }),
      })
      toast({ position: 'top', title: 'Success', status: 'success' })
      mutate({ ...data, ...values })
      revalidate()
    } catch (e) {
      console.log(e)
    }
  }

  const handleDelete = async () => {
    try {
      await fetcher(`/forms/${data?.id}`, {
        method: 'DELETE',
      })
      toast({ position: 'top', title: 'Success', status: 'success' })
      push(`/forms/${data?.id}`)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAdd = async () => {
    try {
      await fetcher('/forms/users/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId: data?.id, email: newUser }),
      })

      toast({ position: 'top', title: 'Success' })
      mutate({
        ...(data as returnData),
        users: [...(data?.users || []), { email: newUser } as User],
      })
    } catch (e) {
      toast({
        status: 'error',
        title: 'No user with that email found!',
      })
    } finally {
      setNewUser('')
    }
  }

  const handleRemove = async (email: string) => {
    try {
      await fetcher('/forms/users/', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formId: data?.id, email }),
      })

      toast({ position: 'top', title: 'Success' })
      mutate({
        ...(data as returnData),
        users: [...(data?.users || [])].filter((user) => user.email !== email),
      })
    } catch (e) {
      toast({
        status: 'error',
        title: 'No user with that email found!',
      })
    }
  }

  if (error) return <p>Error</p>
  if (!data) return <div>loading...</div>
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
          Settings
        </Heading>
        <Heading size="sm" color="gray.700">
          Your Personal URL is:{' '}
          <Box
            bg="blue.100"
            display="inline-block"
            py={1}
            px={2}
            color="black"
            rounded="md"
            cursor="pointer"
            onClick={() => {
              toast({
                position: 'bottom-right',
                title: 'Successfully copied the URL to the clipboard',
              })
              navigator.clipboard.writeText(
                `${process.env.BASE_URL}/api/f/${data.id}`
              )
            }}
          >
            {process.env.BASE_URL}/api/f/{data.id}
          </Box>
        </Heading>
      </Box>
      <Heading mb={6}>General Settings:</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid
          gridTemplateColumns="auto 1fr"
          gridGap={4}
          py={2}
          alignItems="center"
        >
          <Heading size="md">ID</Heading>
          <Input name="name" value={data.id} isDisabled />
          <Heading size="md">Name</Heading>
          <Input name="name" ref={register()} />
          <Checkbox
            name="hasCustomCallback"
            ref={register()}
            onChange={() => {
              mutate(
                { ...data, hasCustomCallback: !data.hasCustomCallback },
                false
              )
            }}
          >
            Use Custom Callback
          </Checkbox>
          <Box />
          <Heading size="md">Callback Url:</Heading>
          <Input
            name="callbackUrl"
            ref={register()}
            isDisabled={!data.hasCustomCallback}
          />
        </Grid>
        <Button type="submit" variantColor="blue" mt={6}>
          Save Changes
        </Button>
      </form>
      <Divider borderColor="gray.400" my={12} />
      <Heading mb={6}>Users</Heading>
      {data.users.map((user) => (
        <PseudoBox
          key={user.email}
          py={2}
          px={3}
          rounded="md"
          display="flex"
          cursor="pointer"
          my={2}
          fontSize={18}
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex alignItems="center">
            <Avatar size="sm" name={user.name || ''} mr={6} />
            <Heading size="sm">
              {user.email}{' '}
              {data.adminId === user.id && (
                <Text display="inline" color="green.500">
                  (admin)
                </Text>
              )}
            </Heading>
          </Flex>
          {user.id !== currentUser?.id && data.adminId === currentUser?.id && (
            <Link
              color="blue.600"
              fontWeight="bold"
              fontSize={14}
              onClick={() => handleRemove(user.email)}
            >
              remove
            </Link>
          )}
        </PseudoBox>
      ))}
      <InputGroup>
        <Input
          type="email"
          value={newUser}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setNewUser(e.target.value)
          }
          placeholder="matt@example.com"
        />
        <InputRightElement
          width="auto"
          children={<Button variantColor="blue">Add User</Button>}
          onClick={handleAdd}
        />
      </InputGroup>

      <Button variantColor="red" onClick={handleDelete} mt={16}>
        Delete Form
      </Button>
    </Box>
  )
}

export default SettingsPage
