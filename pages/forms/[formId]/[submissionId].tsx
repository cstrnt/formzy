import React, { useMemo } from 'react'
import { mutate } from 'swr'
import { Heading, Box, IconButton, Grid, Input, Button } from '@chakra-ui/core'
import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ssrFetch, fetcher, redirectUser } from '../../../src/lib/helpers'
import { useSubmissions } from '../../../src/hooks'
import { useFormzyToast } from '../../../src/hooks/toast'

const getSubmissionURL = (id: any) => `/submissions/${id}`

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  try {
    if (params?.submissionId) {
      const data = await ssrFetch(getSubmissionURL(params?.submissionId), req)
      return { props: { data } }
    }
  } catch (e) {
    redirectUser(res)
  }
  return { props: { data: {} } }
}

const SubmissionPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { errorToast, successToast } = useFormzyToast()
  const { query, push } = useRouter()
  const { submissionId } = query
  const { data, error } = useSubmissions(submissionId, props.data)
  const submissionUrl = useMemo(() => getSubmissionURL(submissionId), [
    submissionId,
  ])
  const formUrl = useMemo(() => `/forms/${data?.formId}`, [data?.formId])

  const handleDelete = async () => {
    try {
      await fetcher(submissionUrl, {
        method: 'DELETE',
      })
      successToast(`Successfully deleted Submission No ${submissionId}`)

      mutate(formUrl)
      push(formUrl)
    } catch (e) {
      errorToast()
    }
  }

  const handleSetSpamStatus = async () => {
    try {
      await fetcher(submissionUrl, {
        method: 'PATCH',
        body: { isSpam: !data?.isSpam },
      })
      mutate(submissionUrl)
      mutate(formUrl)
    } catch (e) {
      errorToast()
    }
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
          push(formUrl)
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
