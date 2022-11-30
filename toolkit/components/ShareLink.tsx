import {
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useClipboard,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

type ShareLinkProps = {};

export const ShareLink: React.FC<ShareLinkProps> = ({}) => {
  const router = useRouter();

  const { hasCopied, onCopy, setValue, value } = useClipboard('');

  useEffect(() => {
    if (router.pathname === '/team/[teamId]') {
      setValue(window.location.href);
    } else {
      setValue('');
    }
  }, [router.pathname, setValue]);

  const color = useColorModeValue('cyan.400', 'grey.500');
  const backgroundColor = useColorModeValue('green.400', 'green.400');

  return (
    <>
      {value && (
        <Flex
          mb={2}
          border='1px solid'
          borderColor={backgroundColor}
          borderRadius='8px'
        >
          <VStack alignItems='normal'>
            <Heading
              size='sm'
              color={color}
              backgroundColor={backgroundColor}
              p={2}
              borderRadius='8px 8px 0 0'
            >
              Invite others to this team
            </Heading>
            <HStack p={2}>
              <Text
                noOfLines={1}
                maxW={['200px', '200px', '300px']}
                data-testid='share-link'
              >
                {value}
              </Text>
              <Button onClick={onCopy} ml={2} w='80px'>
                {hasCopied ? 'Copied' : 'Copy'}
              </Button>
            </HStack>
          </VStack>
        </Flex>
      )}
    </>
  );
};
