import { NextPage, NextPageContext } from 'next';
import { useState } from 'react';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { configureAbly } from '@ably-labs/react-hooks';
import { Header } from '../../toolkit/components/Header';
import { JoinModal } from '../../toolkit/components/JoinModal';
import { CreateModal } from '../../toolkit/components/CreateModal';
import { Logo } from '../../toolkit/components/Brand';

const authUrl = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ably/createTokenRequest`
  : `http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ably/createTokenRequest`;

configureAbly({
  authUrl,
});

const Home: NextPage = () => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <VStack gap={12}>
      <Header isHome />
      <VStack justifyContent='center' alignItems='center' gap={2}>
        <Logo />
        <Heading
          as='h2'
          size='md'
          fontWeight='normal'
          textAlign='center'
          padding={12}
        >
          Scrum Planning Poker at it&apos;s finest!
          <br />
          Estimate virtually your team stories with ease 🎉
        </Heading>
        <VStack gap={2}>
          <Button
            variant='solid'
            onClick={() => setShowStartModal(true)}
            data-testid='new-game-button'
          >
            Start New Game
          </Button>
          <Button
            variant='link'
            onClick={() => setShowJoinModal(true)}
            data-testid='join-game-button'
          >
            Join Game
          </Button>
        </VStack>

        <CreateModal
          handleClose={() => setShowStartModal(false)}
          isOpen={showStartModal}
        />

        <JoinModal
          title='Join A Game'
          handleClose={() => setShowJoinModal(false)}
          isOpen={showJoinModal}
          preventClosing={false}
        />
      </VStack>
    </VStack>
  );
};

export function getServerSideProps({ req }: NextPageContext) {
  return {
    props: {
      cookies: req?.headers.cookie ?? '',
    },
  };
}

export default Home;
