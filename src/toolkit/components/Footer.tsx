'use client';

import { Stack, Text, useColorModeValue, VStack } from '@chakra-ui/react';
import Link from 'next/link';
import { ShareLink } from './ShareLink';
import { FiGithub } from 'react-icons/fi';

export const Footer: React.FC = () => {
  const backgroundcolor = useColorModeValue('cyan.500', 'green.500');

  return (
    <VStack
      as='footer'
      p={6}
      bg={backgroundcolor}
      justifyContent='space-between'
    >
      <ShareLink />
      <Stack
        alignItems='center'
        flexDirection='row'
        gap={[2, 4, 8]}
        spacing={0}
      >
        <Link href='/privacy' passHref>
          <Text>Privacy Policy</Text>
        </Link>
        <Link href='mailto:hello@pooma.app' passHref>
          <Text>Contact</Text>
        </Link>
        <Link
          href='https://github.com/christianbueschi/pooma'
          passHref
          target='_blank'
        >
          <FiGithub />
        </Link>
      </Stack>
    </VStack>
  );
};
