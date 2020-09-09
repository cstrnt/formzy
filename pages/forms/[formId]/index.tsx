import Link from 'next/link'
import useSWR from 'swr'
import {
  Heading,
  Box,
  Flex,
  IconButton,
  Text,
  PseudoBox,
} from '@chakra-ui/core'
import { Form, Submission } from '@prisma/client'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch } from '../../../src/lib/helpers'

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
  const { query, push } = useRouter()
  const { data, error } = useSWR<returnData>(
    query.formId ? `/forms/${query.formId}` : null,
    { initialData: props.data }
  )
  if (error) return <p>Error</p>
  if (!data) return <div>loading...</div>
  return (
    <Box w="full">
      <IconButton
        aria-label="go back"
        icon="arrow-back"
        variantColor="green"
        onClick={() => {
          push(`/`)
        }}
        mb={6}
      />
      <Flex justifyContent="space-between" mb={6}>
        <Heading fontWeight="bold" size="2xl">
          {data.name}
        </Heading>
        <IconButton
          icon="settings"
          aria-label="settings"
          variantColor="blue"
          onClick={() => {
            push(`/forms/${data.id}/settings`)
          }}
        />
      </Flex>

      <Heading size="xl">Submissions</Heading>
      {data.submissions.map((submission) => (
        <Link
          key={submission.id}
          href={`/forms/${submission.formId}/${submission.id}`}
        >
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
            <Text>Submission No. {submission.id}</Text>
            <Text>({dayjs(submission.createdAt).from(dayjs())})</Text>
          </PseudoBox>
        </Link>
      ))}
    </Box>
  )
}

export default IndexPage
