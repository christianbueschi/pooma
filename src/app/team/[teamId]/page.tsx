'use client';

import { Button, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { CardDeck } from '../../../toolkit/components/CardDeck';
import { Header } from '../../../toolkit/components/Header';
import { Modal } from '../../../toolkit/components/Modal';
import { TeamCards } from '../../../toolkit/components/TeamCards';
import { useParams } from 'next/navigation';
import { Member, type Team } from '../../../toolkit/types';
import { useDelete } from '../../../toolkit/hooks/useDelete';
import { useModalContext } from '../../../toolkit/context/ModalProvider';
import { useSelect } from '../../../toolkit/hooks/useSelect';
import { parseCookies } from 'nookies';
import { teamSelectProps } from '../../../toolkit/constants';
import { useUpdate } from '../../../toolkit/hooks/useUpdate';

export default function TeamPage() {
  const [isOpen, toggleIsOpen] = useState(false);
  const { setShowJoinModal } = useModalContext();
  const params = useParams();
  const teamId = params.teamId as string;

  const cookies = parseCookies();

  // Those filters need to be in a ref, otherwise it will cause an infinite loop
  const teamFilter = useRef({
    prop: 'id',
    operator: 'eq',
    value: teamId,
  });

  const membersFilter = useRef({
    prop: 'teamId',
    operator: 'eq',
    value: teamId,
  });

  const [teams, isTeamLoading] = useSelect<Team>('teams', {
    props: teamSelectProps,
    filter: teamFilter.current,
    shouldSubscribe: true,
  });

  const team = teams?.[0];

  const [members, isMembersLoading] = useSelect<Member>('members', {
    filter: membersFilter.current,
    shouldSubscribe: true,
  });

  const member = members?.find((m) => {
    return m.id === cookies.memberId;
  });

  const isMemberInTeam = members?.some((m) => {
    return m.id === member?.id;
  });

  const isLoading = isTeamLoading || isMembersLoading;

  useEffect(() => {
    if (isLoading) return;

    if (!team || !member || !isMemberInTeam) {
      setShowJoinModal(true);
    } else {
      setShowJoinModal(false);
    }
  }, [team, member, isMemberInTeam, setShowJoinModal, isLoading]);

  const [memberToRemove, setMemberToRemove] = useState<Member>();
  const [removeMemberModal, toggleRemoveMemberModal] = useState(false);

  const handleResolve = () => {
    isOpen ? clear() : resolve();
  };

  const [updateTeam] = useUpdate<Team>('teams');
  const [mutateMember] = useUpdate<Member>('members');

  const resolve = () => {
    toggleIsOpen(true);
    if (!team?.id) return;

    updateTeam({
      id: team.id,
      isLocked: true,
    });
  };

  const clear = async () => {
    toggleIsOpen(false);

    if (!team?.id) return;

    await updateTeam({
      id: team.id,
      isLocked: false,
    });

    members?.forEach(async (member) => {
      await mutateMember({
        id: member.id,
        card: '',
      });
    });
  };

  const handleRemove = async (member: Member) => {
    if (!team) return;

    setMemberToRemove(member);
    toggleRemoveMemberModal(true);
  };

  const [deleteMember] = useDelete();

  const onRemoveMember = async () => {
    if (!team || !memberToRemove) {
      toggleRemoveMemberModal(false);
      return;
    }

    await deleteMember('members', memberToRemove.id);
    toggleRemoveMemberModal(false);
  };

  useEffect(() => {
    toggleIsOpen(!!team?.isLocked);
  }, [team, isLoading]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!isMemberInTeam || !members?.length || !member || !team) {
    return <></>;
  }

  return (
    <VStack gap={[2, 4, 8]} mb={12}>
      <Header />

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

      <Modal
        title='Remove Member'
        onClose={() => toggleRemoveMemberModal(false)}
        isOpen={!!removeMemberModal && !!memberToRemove}
      >
        <VStack gap={2}>
          <Text css={{ textAlign: 'center' }}>
            Are you sure you want to remove {memberToRemove?.name}?
          </Text>
          <Button
            variant='solid'
            onClick={onRemoveMember}
            colorScheme='red'
            data-testid='modal-remove-button'
          >
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
}
