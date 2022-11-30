import { Button, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { Member } from '@prisma/client';
import { NextPage, NextPageContext } from 'next';
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

type TeamProps = {
  teamId: string;
};

export const ablyClient = new Ably.Realtime(
  process.env.NEXT_PUBLIC_ABLY_CLIENT_API_KEY || ''
);

const Team: NextPage<TeamProps> = ({ teamId }) => {
  const [isOpen, toggleIsOpen] = useState(false);

  const [team, teamIsLoading, refetchTeam] = useTeam();
  const [members, membersIsLoading, refetchMembers] = useMembers();
  const [member, memberIsLoading, refetchMember] = useMember();

  const [memberToRemove, setMemberToRemove] = useState<Member>();
  const [removeMemberModal, toggleRemoveMemberModal] = useState(false);

  const isLoading = teamIsLoading || membersIsLoading || memberIsLoading;

  const handleResolve = () => {
    isOpen ? clear() : resolve();
  };

  useEffect(() => {
    const membersChannel = ablyClient.channels.get(`${teamId}-members`);
    const teamChannel = ablyClient.channels.get(`${teamId}-team`);

    membersChannel.subscribe(() => {
      refetchMembers();
      refetchMember();
    });

    teamChannel.subscribe(() => {
      refetchTeam();
    });
  }, [teamId, refetchMembers, refetchMember, refetchTeam]);

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
      teamId,
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

  useEffect(() => {
    toggleIsOpen(!!team?.isLocked);
  }, [team?.isLocked]);

  const title = `POOMA - ${team?.name}`;

  return (
    <VStack gap={8} mb={12}>
      <Head>
        <title>{title}</title>
      </Head>
      <Header />

      {isLoading ? (
        <Spinner />
      ) : members && member && team ? (
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
          teamId={teamId}
          title='Join this game'
          isOpen={(!members || !member || !team) && !isLoading}
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

export async function getServerSideProps({ req, query }: NextPageContext) {
  const teamId = `${query.teamId}`;

  return {
    props: {
      teamId,
      cookies: req?.headers.cookie ?? '',
    },
  };
}

export default Team;
