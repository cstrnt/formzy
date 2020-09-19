import React from 'react'
import useSWR, { mutate } from 'swr'
import {
  Heading,
  Box,
  IconButton,
  Grid,
  Input,
  Button,
  useToast,
} from '@chakra-ui/core'
import { Submission, Form } from '@prisma/client'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch, fetcher } from '../../../src/lib/helpers'

type returnData = Submission & { form: Form }

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  try {
    if (params?.submissionId) {
      const data = await ssrFetch<returnData>(
        `/submissions/${params?.submissionId}`,
        req
      )
      return { props: { data } }
    }
  } catch (e) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  return { props: { data: {} } }
}

const SubmissionPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const toast = useToast()
  const { query, push } = useRouter()
  const { submissionId } = query
  const { data, error } = useSWR<Submission & { form: Form }>(
    submissionId ? `/submissions/${submissionId}` : null,
    { initialData: props.data }
  )

  const handleDelete = async () => {
    try {
      await fetcher(`/submissions/${submissionId}`, {
        method: 'DELETE',
      })
      toast({
        position: 'top',
        title: `Successfully deleted Submission No ${submissionId}`,
      })
      mutate(`/forms/${data?.form.id}`)
      push(`/forms/${data?.form.id}`)
    } catch (e) {
      toast({
        position: 'top',
        status: 'error',
        title: `Something went wrong`,
      })
    }
  }

  const handleSetSpamStatus = async () => {
    try {
      await fetcher(`/submissions/${submissionId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PATCH',
        body: JSON.stringify({ isSpam: !data?.isSpam }),
      })
      mutate(`/submissions/${submissionId}`)
    } catch (e) {}
  }
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
        Submission (ID: {data.id})
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
          <React.Fragment key={key}>
            <Heading size="md">{key}</Heading>
            <Input value={(data.content as any)[key]} isDisabled />
          </React.Fragment>
        ))}
      </Grid>

      <Button
        size="sm"
        variantColor={data.isSpam ? 'blue' : 'red'}
        mt={8}
        onClick={handleSetSpamStatus}
      >
        {data.isSpam ? 'No Spam' : 'Spam'}
      </Button>

      <Button ml={4} size="sm" variantColor="red" mt={8} onClick={handleDelete}>
        Delete Submission
      </Button>
    </Box>
  )
}

export default SubmissionPage
