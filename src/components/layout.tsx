import {
  Flex,
  Heading,
  Avatar,
  Box,
  Text,
  useDisclosure,
  PseudoBox,
} from '@chakra-ui/core'
import Link from 'next/link'
import { fetcher } from '../lib/helpers'
import { useRouter } from 'next/router'
import { useUser } from '../hooks'

interface DropDownProps {
  handleClose: () => Promise<void>
}

const AvatarDropDown = ({ handleClose }: DropDownProps) => {
  const { push } = useRouter()

  const handleLogout = async () => {
    await fetcher('/auth/logout')
    handleClose()
    push('/')
  }
  return (
    <Box
      position="absolute"
      bg="gray.200"
      bottom={'-5.5rem'}
      right={'3rem'}
      px={4}
      py={1}
      onClick={(e) => e.stopPropagation()}
      color="black"
      rounded="md"
    >
      <Link href={`/settings`}>
        <PseudoBox
          mt={2}
          _hover={{ bg: 'gray.300' }}
          rounded="md"
          py={1}
          px={2}
          cursor="pointer"
        >
          <Text>Account Settings</Text>
        </PseudoBox>
      </Link>
      <PseudoBox
        role="link"
        onClick={handleLogout}
        my={2}
        _hover={{ bg: 'gray.300' }}
        rounded="md"
        py={1}
        px={2}
        cursor="pointer"
        marginLeft="auto"
      >
        <Text>Logout</Text>
      </PseudoBox>
    </Box>
  )
}

const Layout: React.FC = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: user, mutate } = useUser()

  return (
    <Flex direction="column" minH="100vh" onClick={onClose}>
      <Flex
        bg="green.400"
        py={2}
        color="white"
        justifyContent="space-between"
        alignItems="center"
        px={12}
        position="relative"
      >
        <Link href="/forms">
          <Heading fontWeight={400} fontFamily="Pacifico" cursor="pointer">
            Formzy
          </Heading>
        </Link>
        <Flex alignItems="center">
          {user ? (
            <Avatar
              cursor="pointer"
              height={10}
              width={10}
              name={user.name || ''}
              onClick={(e) => {
                e.stopPropagation()
                onOpen()
              }}
            />
          ) : null}
        </Flex>
        {isOpen && (
          <AvatarDropDown
            handleClose={async () => {
              mutate(null)
              onClose()
            }}
          />
        )}
      </Flex>
      <Flex bg="gray.100" flex={1} px={12} py={6}>
        {children}
      </Flex>
    </Flex>
  )
}

export default Layout
