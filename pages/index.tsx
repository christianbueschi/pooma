import { NextPage } from 'next';
import { Header } from '../toolkit/components/Header';
import { useState } from 'react';
import { JoinModal } from '../toolkit/components/JoinModal';
import { CreateModal } from '../toolkit/components/CreateModal';

import { Button, Heading, VStack } from '@chakra-ui/react';
import { LOGO_STYLES } from '../toolkit/elements/Title';

const Home: NextPage = () => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <VStack gap={12}>
      <Header isHome />
      <VStack justifyContent='center' alignItems='center' gap={2}>
        <Heading
          as='h1'
          size='xl'
          textAlign='center'
          fontSize='48px'
          css={{
            LOGO_STYLES,
          }}
        >
          POOMA
        </Heading>
        <Heading
          as='h2'
          size='md'
          fontWeight='normal'
          textAlign='center'
          padding={12}
        >
          Scrum Planning Poker at it&apos;s finest!
          <br />
          Virtually estimate your team stories with ease 🎉
        </Heading>
        <VStack gap={2}>
          <Button
            variant='solid'
            colorScheme='green'
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

export default Home;
