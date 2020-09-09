import Link from 'next/link'
import useSWR from 'swr'
import { Heading, Box, PseudoBox } from '@chakra-ui/core'
import { Form } from '@prisma/client'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch } from '../src/lib/helpers'

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const data = await ssrFetch<Form>(`/forms`, req)
  return { props: { data } }
}

const IndexPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { data, error } = useSWR('/forms', { initialData: props.data })
  if (error) return <p>Error</p>
  if (!data) return <div>loading...</div>
  return (
    <Box w="full">
      <Heading fontWeight="bold" size="2xl">
        Your Forms:
      </Heading>
      {data.map((form: Form) => (
        <Link href={`/forms/${form.id}`}>
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
    </Box>
  )
}

export default IndexPage
