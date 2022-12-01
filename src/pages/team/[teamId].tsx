import { Button, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { Member } from '@prisma/client';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { CardDeck } from '../../../toolkit/components/CardDeck';
import { Header } from '../../../toolkit/components/Header';
import { JoinModal } from '../../../toolkit/components/JoinModal';
import { Modal } from '../../../toolkit/components/Modal';
import { TeamCards } from '../../../toolkit/components/TeamCards';
import { trpc } from '../../utils/trpc';
import Ably from 'ably/promises';
import { useTeam } from '../../../toolkit/hooks/useTeam';
import { useMembers } from '../../../toolkit/hooks/useMembers';
import { useMember } from '../../../toolkit/hooks/useMember';
import { useRouter } from 'next/router';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { appRouter } from '../../server/routers/_app';
import superjson from 'superjson';

type TeamProps = {
  id: string;
  memberId: string;
};

export const ablyClient = new Ably.Realtime(
  process.env.NEXT_PUBLIC_ABLY_CLIENT_API_KEY || ''
);

const Team: NextPage<TeamProps> = ({ id, memberId }) => {
  const [isOpen, toggleIsOpen] = useState(false);

  const [team, teamIsLoading, refetchTeam] = useTeam({ id });
  const [members, membersIsLoading, refetchMembers] = useMembers({
    teamId: id,
  });
  const [member, memberIsLoading, refetchMember] = useMember({
    id: memberId,
    teamId: id,
  });

  const [memberToRemove, setMemberToRemove] = useState<Member>();
  const [removeMemberModal, toggleRemoveMemberModal] = useState(false);

  const isLoading = teamIsLoading || membersIsLoading || memberIsLoading;

  const handleResolve = () => {
    isOpen ? clear() : resolve();
  };

  useEffect(() => {
    const membersChannel = ablyClient.channels.get(`${id}-members`);
    const teamChannel = ablyClient.channels.get(`${id}-team`);

    membersChannel.subscribe(() => {
      refetchMembers();
      refetchMember();
    });

    teamChannel.subscribe(() => {
      refetchTeam();
    });
  }, [id, refetchMembers, refetchMember, refetchTeam]);

  const updateTeamMutation = trpc.updateTeam.useMutation();
  const updateMembersMutation = trpc.updateMembers.useMutation();

  const resolve = () => {
    toggleIsOpen(true);
    if (!team?.id) return;

    updateTeamMutation.mutate({
      id: team.id,
      isLocked: true,
    });
  };

  const clear = async () => {
    toggleIsOpen(false);

    updateMembersMutation.mutate({
      teamId: id,
      card: '',
    });

    if (!team?.id) return;

    updateTeamMutation.mutate({
      id: team.id,
      isLocked: false,
    });
  };

  const handleRemove = async (member: Member) => {
    if (!team) return;

    setMemberToRemove(member);

    toggleRemoveMemberModal(true);
  };

  const deleteMemberMutation = trpc.deleteMember.useMutation();

  const onRemoveMember = () => {
    if (!team || !memberToRemove) {
      toggleRemoveMemberModal(false);
      return;
    }

    deleteMemberMutation.mutateAsync({
      id: memberToRemove.id,
    });

    toggleRemoveMemberModal(false);
  };

  const router = useRouter();

  useEffect(() => {
    if (!teamIsLoading && !team) {
      router.push('/404');
    }

    toggleIsOpen(!!team?.isLocked);
  }, [team, teamIsLoading, router]);

  const title = `POOMA - ${team?.name}`;

  const isMemberInTeam = members?.some((m) => m.id === member?.id);

  return (
    <VStack gap={8} mb={12}>
      <Head>
        <title>{title}</title>
      </Head>

      <Header team={team} member={member} />

      {isLoading ? (
        <Spinner />
      ) : isMemberInTeam && members?.length && member && team ? (
        <>
          {!member.isSpectactorMode && (
            <VStack css={{ alignItems: 'center' }}>
              <CardDeck member={member} team={team} />
            </VStack>
          )}
          <Heading data-testid='title'>{team?.name}</Heading>
          <TeamCards
            members={members}
            isOpen={isOpen}
            onRemove={handleRemove}
            handleResolve={handleResolve}
          />
        </>
      ) : (
        <JoinModal
          teamId={id}
          title='Join this game'
          isOpen={!members?.length || !member || !team || !isMemberInTeam}
          preventClosing={true}
        />
      )}

      <Modal
        title='Remove Member'
        onClose={() => toggleRemoveMemberModal(false)}
        isOpen={!!removeMemberModal && !!memberToRemove}
      >
        <VStack gap={2}>
          <Text css={{ textAlign: 'center' }}>
            Are you sure you want to remove <b>{memberToRemove?.name}</b>?
          </Text>
          <Button variant='solid' onClick={onRemoveMember} colorScheme='red'>
            Remove
          </Button>
          <Button
            variant='ghost'
            onClick={() => toggleRemoveMemberModal(false)}
          >
            Cancel
          </Button>
        </VStack>
      </Modal>
    </VStack>
  );
};

export async function getServerSideProps({
  req,
  query,
}: GetServerSidePropsContext) {
  const teamId = `${query.teamId}`;
  const preventFetching = query.preventFetching;

  const memberId = req.cookies.memberId || '';

  if (preventFetching) {
    return {
      props: {
        cookies: req.headers.cookie ?? '',
        id: teamId,
        memberId,
      },
    };
  }

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson,
  });

  const team = await ssg.team.fetch({ id: teamId });
  await ssg.member.fetch({ id: memberId, teamId });
  await ssg.members.fetch({ teamId });

  if (!team) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      cookies: req.headers.cookie ?? '',
      trpcState: ssg.dehydrate(),
      id: teamId,
      memberId,
    },
  };
}

export default Team;
