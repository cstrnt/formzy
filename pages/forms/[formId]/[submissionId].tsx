import useSWR from 'swr'
import {
  Heading,
  Box,
  IconButton,
  Grid,
  Input,
  Button,
  Link as ChakraLink,
} from '@chakra-ui/core'
import { Submission, Form } from '@prisma/client'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch } from '../../../src/lib/helpers'

type returnData = Submission & { form: Form }

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  if (params?.submissionId) {
    const data = await ssrFetch<returnData>(
      `/submissions/${params?.submissionId}`,
      req
    )
    return { props: { data } }
  }
  return { props: { data: {} } }
}

const IndexPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { query, push } = useRouter()
  const { submissionId } = query
  const { data, error } = useSWR<Submission & { form: Form }>(
    submissionId ? `/submissions/${submissionId}` : null,
    { initialData: props.data }
  )
  if (error) return <p>Error</p>
  if (!data) return <div>loading...</div>
  return (
    <Box>
      <IconButton
        aria-label="go back"
        icon="arrow-back"
        variantColor="green"
        onClick={() => {
          push(`/forms/${data.formId}`)
        }}
        mb={6}
      />

      <Heading fontWeight="bold" size="2xl">
        Submission {data.id} (
        <Link href={`/forms/${data.form.id}`} passHref>
          <ChakraLink>form {data.form.name}</ChakraLink>
        </Link>
        )
      </Heading>

      <Heading size="sm" fontWeight={400} color="gray.700">
        Submitted on {dayjs(data.createdAt).format('DD-MM-YYYY, hh:mm A')} (
        {dayjs(data.createdAt).from(dayjs())})
      </Heading>
      <Heading mt={6}>Submitted Fields:</Heading>
      <Grid
        gridTemplateColumns="auto 1fr"
        gridGap={4}
        py={2}
        alignItems="center"
      >
        {Object.keys(data.content as any).map((key) => (
          <>
            <Heading size="md">{key}</Heading>
            <Input value={(data.content as any)[key]} isDisabled />
          </>
        ))}
      </Grid>
      <Button size="sm" variantColor="red" mt={8}>
        Delete Submission
      </Button>
    </Box>
  )
}

export default IndexPage
