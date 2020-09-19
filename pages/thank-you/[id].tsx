import { Flex, Heading } from '@chakra-ui/core'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Form } from '@prisma/client'
import { ssrFetch } from '../../src/lib/helpers'
import useSWR from 'swr'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  try {
    if (params?.id) {
      const data = await ssrFetch<Form>(`/forms/${params?.id}`, req)
      return { props: { data } }
    }
  } catch (e) {
    res.writeHead(302, { Location: '/' })
    res.end()
  }
  return { props: { data: {} } }
}

const ThankYouPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { query } = useRouter()
  const { data, error } = useSWR<Form>(query.id ? `/forms/${query.id}` : null, {
    initialData: props.data,
  })
  if (error) return <p>Error</p>
  if (!data) return <p>Loading...</p>
  return (
    <Flex>
      <Heading>Thank you! {data.name} </Heading>
    </Flex>
  )
}

export default ThankYouPage
