'use client';

import { useState } from 'react';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { Header } from '../toolkit/components/Header';
import { CreateModal } from '../toolkit/components/CreateModal';
import { Logo } from '../toolkit/components/Brand';
import { useModalContext } from '../toolkit/context/ModalProvider';

export default function Home() {
  const [showStartModal, setShowStartModal] = useState(false);
  const { setShowJoinModal } = useModalContext();

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
          Planning poker made simple
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
      </VStack>
    </VStack>
  );
}
