import {
  Button,
  Flex,
  Heading,
  HStack,
  Text,
  useClipboard,
  VStack,
} from '@chakra-ui/react';

type ShareLinkProps = {
  inverse?: boolean;
};

export const ShareLink: React.FC<ShareLinkProps> = ({ inverse }) => {
  const href = window?.location.href;

  const { hasCopied, onCopy } = useClipboard(href);

  const color = inverse ? 'white' : 'grey.700';
  const backgroundColor = inverse ? '#ffffff20' : '#33333320';

  return (
    <Flex mb={2} border='1px solid' borderColor={color} borderRadius='8px'>
      <VStack alignItems='normal'>
        <Heading
          size='sm'
          color={color}
          backgroundColor={backgroundColor}
          p={2}
        >
          Invite others
        </Heading>
        <HStack p={2}>
          <Text
            color={color}
            isTruncated
            maxW={['200px', '200px', '400px']}
            data-testid='share-link'
          >
            {href}
          </Text>
          <Button onClick={onCopy} ml={2} w='80px'>
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </HStack>
      </VStack>
    </Flex>
  );
};
