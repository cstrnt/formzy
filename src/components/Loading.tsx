import { Flex, Spinner } from '@chakra-ui/core'

const Loading = () => (
  <Flex w="100vw" h="100vh" justifyContent="center" alignItems="center">
    <Spinner color="green.500" size="xl" />
  </Flex>
)

export default Loading
