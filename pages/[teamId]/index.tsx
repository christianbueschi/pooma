import { NextPage, NextPageContext } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../toolkit/components/api';
import {
  Member,
  useMember,
  useMembers,
  useTeam,
} from '../../toolkit/components/apiHooks';
import { Cards } from '../../toolkit/components/Cards';
import { Header } from '../../toolkit/components/Header';
import { JoinModal } from '../../toolkit/components/JoinModal';
import { Modal } from '../../toolkit/components/Modal';
import { TeamCards } from '../../toolkit/components/TeamCards';
import { Body } from '../../toolkit/elements/Body';

import { Button } from '../../toolkit/elements/Button';
import { Flex } from '../../toolkit/elements/Flex';

import { Loading } from '../../toolkit/elements/Loading';
import { Title } from '../../toolkit/elements/Title';

type TeamProps = {
  teamId: string;
};

const Team: NextPage<TeamProps> = (props) => {
  const [isOpen, toggleIsOpen] = useState(false);

  const [team, teamIsLoading, error] = useTeam(props.teamId);
  const [members, membersIsLoading] = useMembers(props.teamId);
  const [member, memberIsLoading] = useMember(props.teamId);

  const [memberToRemove, setMemberToRemove] = useState<Member>();
  const [removeMemberModal, toggleRemoveMemberModal] = useState(false);

  const isLoading = teamIsLoading || membersIsLoading || memberIsLoading;

  const handleResolve = () => {
    isOpen ? clear() : resolve();
  };

  const resolve = () => {
    toggleIsOpen(true);
    api.updateTeam(team?.id, { isLocked: true });
  };

  const clear = async () => {
    // todo: add await
    members &&
      team &&
      members.forEach((member) => {
        api.updateMember(team.id, member.id, { card: '' });
      });
    await api.updateTeam(team?.id, { isLocked: false });
    toggleIsOpen(false);
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
    if (team?.isLocked) {
      toggleIsOpen(true);
    }
  }, [team]);

  return (
    <Flex gap={48}>
      <Header />

      {isLoading ? (
        <Loading />
      ) : members && member && team ? (
        <>
          <Flex>
            <Cards member={member} team={team} />
          </Flex>
          <Title>{team?.name}</Title>
          <TeamCards
            members={members}
            isOpen={isOpen}
            onRemove={handleRemove}
          />
          <Flex horizontal css={{ justifyContent: 'center' }}>
            {!isLoading && members && members.length > 0 && (
              <Button variant='solid' isActive={isOpen} onClick={handleResolve}>
                {isOpen ? 'Hide Cards' : 'Show Cards'}
              </Button>
            )}

            {!team && !isLoading && (
              <div className='a-not-set'>
                <p>You have not yet created or selected a team.</p>
              </div>
            )}

            {!isLoading && members?.length === 0 && (
              <p className='a-not-set'>No members here at the moment.</p>
            )}
          </Flex>
        </>
      ) : (
        <JoinModal teamId={props.teamId} title='Join this game' />
      )}
      {removeMemberModal && memberToRemove && (
        <Modal
          title='Remove Member'
          handleClose={() => toggleRemoveMemberModal(false)}
        >
          <Body css={{ textAlign: 'center' }}>
            Are you sure you want to remove <b>{memberToRemove.name}</b>?
          </Body>
          <Flex gap={8}>
            <Button variant='solid' onClick={onRemoveMember}>
              Remove
            </Button>
            <Button
              variant='ghost'
              onClick={() => toggleRemoveMemberModal(false)}
            >
              Cancel
            </Button>
          </Flex>
        </Modal>
      )}
    </Flex>
  );
};

export default Team;

export async function getServerSideProps(context: NextPageContext) {
  const teamId = `${context.query.teamId}`;

  return {
    props: { teamId },
  };
}
