import { GetServerSidePropsContext, NextPage } from 'next';
import { useState } from 'react';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { configureAbly } from '@ably-labs/react-hooks';
import { Header } from '../../toolkit/components/Header';
import { JoinModal } from '../../toolkit/components/JoinModal';
import { CreateModal } from '../../toolkit/components/CreateModal';
import { Logo } from '../../toolkit/components/Brand';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '../server/routers/_app';
import superjson from 'superjson';
import { Member, Team } from '@prisma/client';

const authUrl = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ably/createTokenRequest`
  : `http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/ably/createTokenRequest`;

configureAbly({
  authUrl,
});

type HopeProps = {
  team?: Team;
  member?: Member;
};

const Home: NextPage<HopeProps> = ({ team, member }) => {
  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  return (
    <VStack gap={12}>
      <Header isHome team={team} member={member} />
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

export async function getServerSideProps({ req }: GetServerSidePropsContext) {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });

  const teamId = req.cookies.teamId || '';
  const memberId = req.cookies.memberId || '';

  let team = await ssg.team.fetch({ id: teamId });
  const member = await ssg.member.fetch({ id: memberId });

  // because createdAt date is not serializable
  team = JSON.parse(JSON.stringify(team));

  return {
    props: {
      cookies: req?.headers.cookie ?? '',
      team,
      member,
    },
  };
}

export default Home;
