import { Flex, Heading, Avatar, Text } from '@chakra-ui/core'
import useSWR from 'swr'
import { User } from '@prisma/client'

const Layout: React.FC = ({ children }) => {
  const { data } = useSWR<User>('/auth/me')
  return (
    <Flex direction="column" minH="100vh">
      <Flex
        bg="green.400"
        py={2}
        color="white"
        justifyContent="space-between"
        alignItems="center"
        px={12}
      >
        <Heading fontWeight={400} fontFamily="Pacifico">
          Formzy
        </Heading>
        {data && (
          <Flex alignItems="center">
            <Avatar size="sm" name={data.name || ''} mr={2} />
            <Text fontWeight="bold">{data.name}</Text>
          </Flex>
        )}
      </Flex>
      <Flex bg="gray.100" flex={1} px={12} py={6}>
        {children}
      </Flex>
      <Flex bg="green.400" py={2}>
        Footer
      </Flex>
    </Flex>
  )
}

export default Layout
