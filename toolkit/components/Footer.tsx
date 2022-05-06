import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <Box as='footer' backgroundColor='blue.700' color='white' p={6}>
      <VStack alignItems='end'>
        <Link
          href="mailto:hello@pooma.app?subject=Missing feature&amp;body=Hi, I'm missing the following feature:"
          passHref
        >
          <a>
            <Text color='white'>Missing a feature?</Text>
          </a>
        </Link>
        <Link href='mailto:hello@pooma.app' passHref>
          <a>
            <Text color='white'>hello@pooma.app</Text>
          </a>
        </Link>
        <Link href='/privacy' passHref>
          <a>
            <Text>Privacy Policy</Text>
          </a>
        </Link>
      </VStack>
    </Box>
  );
};
