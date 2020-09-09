import useSWR from 'swr'
import { Heading, Box, Flex, IconButton, Grid, Input } from '@chakra-ui/core'
import { Form, Submission } from '@prisma/client'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch } from '../../../src/lib/helpers'
import { FormEvent } from 'react'

type returnData = Form & { submissions: Submission[] }

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

const IndexPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { back } = useRouter()
  const { data, error } = useSWR<returnData>('/forms', {
    initialData: props.data,
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
  }

  if (error) return <p>Error</p>
  if (!data) return <div>loading...</div>
  return (
    <Box w="full">
      <IconButton
        aria-label="go back"
        icon="arrow-back"
        variantColor="green"
        onClick={back}
        mb={6}
      />
      <Flex justifyContent="space-between" mb={6}>
        <Heading fontWeight="bold" size="2xl">
          Settings
        </Heading>
      </Flex>
      <form onSubmit={handleSubmit}>
        <Grid
          gridTemplateColumns="auto 1fr"
          gridGap={4}
          py={2}
          alignItems="center"
          maxW="724px"
        >
          <Heading size="md">Name</Heading>
          <Input value={data.name} />
        </Grid>
      </form>{' '}
    </Box>
  )
}

export default IndexPage
