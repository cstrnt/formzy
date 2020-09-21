import Link from 'next/link'
import {
  Heading,
  Box,
  Flex,
  IconButton,
  TabList,
  Tabs,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/core'
import { useRouter } from 'next/router'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { redirectUser, ssrFetch } from '../../../src/lib/helpers'
import { useFormData } from '../../../src/hooks'
import SubmissionList from '../../../src/components/SubmissionList'
import Loading from '../../../src/components/Loading'
import ErrorComponent from '../../../src/components/Error'
import { getFormUrl } from '../../../src/lib/form'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  try {
    if (params?.formId) {
      const data = await ssrFetch(getFormUrl(params.formId), req)
      return { props: { data } }
    }
  } catch (e) {
    redirectUser(res)
  }
  return { props: { data: {} } }
}

const FormsPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { query, push } = useRouter()
  const { data, error } = useFormData(query.formId as string, props.data, 5000)
  const spamSubmissions =
    data?.submissions.filter((submission) => submission.isSpam) || []

  const regularSubmissions =
    data?.submissions.filter((submission) => !submission.isSpam) || []

  if (error) return <ErrorComponent />
  if (!data) return <Loading />

  return (
    <Box w="full">
      <Link href="/">
        <IconButton
          aria-label="go back"
          icon="arrow-back"
          variantColor="green"
          mb={6}
        />
      </Link>
      <Flex justifyContent="space-between" mb={6}>
        <Box>
          <Heading size="2xl">{data.name}</Heading>
          <Heading size="sm" color="gray.600">
            FormID: {data.id}
          </Heading>
        </Box>
        <IconButton
          icon="settings"
          aria-label="settings"
          variantColor="blue"
          onClick={() => {
            push(`/forms/${data.id}/settings`)
          }}
        />
      </Flex>
      <Tabs variant="solid-rounded" variantColor="green">
        <TabList>
          <Tab>Submissions</Tab>
          <Tab>Spam</Tab>
        </TabList>
        <TabPanels py={8}>
          <TabPanel>
            <SubmissionList submissions={regularSubmissions} />
          </TabPanel>
          <TabPanel>
            <SubmissionList submissions={spamSubmissions} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}

export default FormsPage
