import {
  Button,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Timestamp } from '@firebase/firestore';
import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { api, Round } from '../../toolkit/api/api';
import {
  Member,
  useMember,
  useMembers,
  useTeam,
} from '../../toolkit/api/apiHooks';
import { Cards } from '../../toolkit/components/Cards';
import { Header } from '../../toolkit/components/Header';
import { JoinModal } from '../../toolkit/components/JoinModal';
import { Modal } from '../../toolkit/components/Modal';
import { TeamCards } from '../../toolkit/components/TeamCards';

type TeamProps = {
  teamId: string;
};

const Team: NextPage<TeamProps> = ({ teamId }) => {
  const [isOpen, toggleIsOpen] = useState(false);

  const [team, teamIsLoading, error] = useTeam();

  const [members, membersIsLoading] = useMembers();
  const [member, memberIsLoading] = useMember();

  const [memberToRemove, setMemberToRemove] = useState<Member>();
  const [removeMemberModal, toggleRemoveMemberModal] = useState(false);

  const isLoading = teamIsLoading || membersIsLoading || memberIsLoading;

  const handleResolve = () => {
    isOpen ? clear() : resolve();
  };

  const [round, setRound] = useState<Round>();

  const resolve = () => {
    setRound({
      resolvedAt: Timestamp.now(),
      members: [...members],
    });
    api.updateTeam(team?.id, { isLocked: true });
  };

  useEffect(() => {
    if (!round) return;

    api.addRound(team?.id, round);
  }, [round]);

  const clear = async () => {
    // todo: add await
    members &&
      team &&
      members.forEach((member) => {
        api.updateMember(team.id, member.id, { card: '' });
      });
    await api.updateTeam(team?.id, { isLocked: false });
  };

  const handleRemove = async (member: Member) => {
    if (!team) return;

    setMemberToRemove(member);

    toggleRemoveMemberModal(true);
  };

  const onRemoveMember = () => {
    if (!team || !memberToRemove) {
      toggleRemoveMemberModal(false);
      return;
    }

    api.removeMember(team.id, memberToRemove.id);
    toggleRemoveMemberModal(false);
  };

  useEffect(() => {
    toggleIsOpen(!!team?.isLocked);
  }, [team?.isLocked]);

  return (
    <VStack gap={8} mb={12}>
      <Head>
        <title>POOMA - {team?.name}</title>
      </Head>
      <Header />

      {isLoading ? (
        <Spinner />
      ) : members && member && team ? (
        <>
          {!member.spectactorMode && (
            <VStack css={{ alignItems: 'center' }}>
              <Cards member={member} team={team} />
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
        handleClose={() => toggleRemoveMemberModal(false)}
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

export async function getServerSideProps(context: NextPageContext) {
  const teamId = `${context.query.teamId}`;

  return {
    props: { teamId },
  };
}

export default Team;
