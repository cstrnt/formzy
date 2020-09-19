import { Link, Flex, Heading, Text, Button } from '@chakra-ui/core'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { Form } from '@prisma/client'
import { redirectUser, ssrFetch } from '../../src/lib/helpers'
import useSWR from 'swr'
import { useRouter } from 'next/router'

const getThankYouUrl = (id: any) => `/forms/${id}/thanks`

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
  res,
}) => {
  try {
    if (params?.id) {
      const data = await ssrFetch<Form>(getThankYouUrl(params.id), req)
      return { props: { data } }
    }
  } catch (e) {
    redirectUser(res)
  }
  return { props: { data: {} } }
}

const ThankYouPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { query, back } = useRouter()
  const { data, error } = useSWR<Form>(
    query.id ? getThankYouUrl(query.id) : null,
    {
      initialData: props.data,
    }
  )

  if (error) return <p>Error</p>
  if (!data) return <p>Loading...</p>

  return (
    <Flex
      w="100vw"
      h="100vh"
      direction="column"
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      bg="gray.100"
    >
      <Heading mb={6}>Thank you!</Heading>
      <Text>{data.thankYouText}</Text>
      <Button onClick={back} variantColor="green" mt={12}>
        Go Back
      </Button>
      <Link
        href="https://github.com/cstrnt/formzy"
        _hover={{ textDecoration: 'none' }}
        mt={48}
      >
        <Heading fontFamily="Pacifico" size="lg" color="green.400">
          Formzy
        </Heading>
      </Link>
    </Flex>
  )
}

export default ThankYouPage
