import { NextPage } from 'next';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { Header } from '../../toolkit/components/Header';
import { Logo } from '../../toolkit/components/Brand';
import Link from 'next/link';

const NotFound: NextPage = () => {
  return (
    <VStack gap={12}>
      <Header isHome />
      <VStack justifyContent='center' alignItems='center' gap={2}>
        <Logo text='4O4' />
        <Heading
          as='h2'
          size='md'
          fontWeight='normal'
          textAlign='center'
          padding={12}
        >
          Nothing found here 😢
        </Heading>
        <Link href='/'>
          <Button variant='solid' data-testid='new-game-button'>
            Go to start page
          </Button>
        </Link>
      </VStack>
    </VStack>
  );
};

export default NotFound;
