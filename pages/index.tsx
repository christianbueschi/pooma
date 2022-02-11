import { NextPage } from 'next';
import { MainTitle } from '../toolkit/elements/Title';
import { Flex } from '../toolkit/elements/Flex';
import { BodyBig } from '../toolkit/elements/Body';
import { Header } from '../toolkit/components/Header';
import { useState } from 'react';
import { Button } from '../toolkit/elements/Button';
import { JoinModal } from '../toolkit/components/JoinModal';
import { CreateModal } from '../toolkit/components/CreateModal';
import { spacings } from '../toolkit/theme/spacings';

const Home: NextPage = () => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <Flex gap={48}>
      <Header isHome />
      <Flex css={{ justifyContent: 'center', alignItems: 'center' }} gap={48}>
        <MainTitle>POOMA</MainTitle>
        <BodyBig as='h2' css={{ textAlign: 'center', padding: spacings[12] }}>
          Scrum Planning Poker at it&apos;s finest!
          <br />
          Virtually estimate your team stories with ease 🎉
        </BodyBig>
        <Flex css={{ alignItems: 'center' }} gap={12}>
          <Button variant='solid' onClick={() => setShowStartModal(true)}>
            Start New Game
          </Button>
          <Button variant='link' onClick={() => setShowJoinModal(true)}>
            Join Game
          </Button>
        </Flex>

        {showStartModal && (
          <CreateModal handleClose={() => setShowStartModal(false)} />
        )}

        {showJoinModal && (
          <JoinModal
            title='Join A Game'
            handleClose={() => setShowJoinModal(false)}
          />
        )}
      </Flex>
    </Flex>
  );
};

export default Home;
