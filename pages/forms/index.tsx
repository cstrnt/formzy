import Link from 'next/link'
import useSWR, { mutate } from 'swr'
import { Heading, Box, PseudoBox, Button } from '@chakra-ui/core'
import { Form } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch, fetcher } from '../../src/lib/helpers'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  try {
    const data = await ssrFetch<Form[]>(`/forms`, req)
    return { props: { data } }
  } catch (e) {
    res.writeHead(302, { Location: '/' })
    res.end()
    return { props: {} }
  }
}

const IndexPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data, error } = useSWR<Form[]>('/forms', {
    initialData: props.data,
  })

  const handleCreate = async () => {
    try {
      await fetcher('/forms/create', { method: 'POST' })
      mutate('/forms')
    } catch (e) {}
  }

  if (error) return <p>Error</p>
  if (!data) return <div>loading...</div>

  return (
    <Box w="full">
      <Heading fontWeight="bold" size="2xl">
        Your Forms:
      </Heading>
      {data.map((form: Form) => (
        <Link key={form.id} href={`/forms/${form.id}`}>
          <PseudoBox
            py={2}
            px={4}
            rounded="md"
            display="flex"
            _hover={{ bg: 'gray.200' }}
            cursor="pointer"
            my={4}
            fontSize={18}
            justifyContent="space-between"
            maxW="600px"
          >
            <Heading cursor="pointer">{form.name}</Heading>
          </PseudoBox>
        </Link>
      ))}
      <Button leftIcon="add" variantColor="blue" onClick={handleCreate}>
        New Form
      </Button>
    </Box>
  )
}

export default IndexPage
