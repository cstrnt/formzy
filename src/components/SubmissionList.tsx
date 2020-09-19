import { PseudoBox, Text } from '@chakra-ui/core'
import Link from 'next/link'
import { Submission } from '@prisma/client'
import dayjs from 'dayjs'

interface SubmissionListProps {
  submissions: Submission[]
}

const SubmissionList = ({ submissions }: SubmissionListProps) => {
  return (
    <>
      {submissions.map((submission) => (
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
            <Text>Submission (ID: {submission.id})</Text>
            <Text>({dayjs(submission.createdAt).from(dayjs())})</Text>
          </PseudoBox>
        </Link>
      ))}
    </>
  )
}

export default SubmissionList
