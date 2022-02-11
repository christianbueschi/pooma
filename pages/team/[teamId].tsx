import { NextPage, NextPageContext } from 'next';
import Head from 'next/head';
import { setCookie } from 'nookies';
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
import { spacings } from '../../toolkit/theme/spacings';

type TeamProps = {
  teamId: string;
};

const Team: NextPage<TeamProps> = ({ teamId }) => {
  const [isOpen, toggleIsOpen] = useState(false);

  const [team, teamIsLoading, error] = useTeam(teamId);
  const [members, membersIsLoading] = useMembers(teamId);
  const [member, memberIsLoading] = useMember(teamId);

  const [memberToRemove, setMemberToRemove] = useState<Member>();
  const [removeMemberModal, toggleRemoveMemberModal] = useState(false);

  const isLoading = teamIsLoading || membersIsLoading || memberIsLoading;

  const handleResolve = () => {
    isOpen ? clear() : resolve();
  };

  const resolve = () => {
    // toggleIsOpen(true);
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
    // toggleIsOpen(false);
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

  useEffect(() => {
    if (!teamId) return;
    // always save the path as teamId cookie
    // if the team doesn't exists, we will later delete it
    setCookie(null, 'teamId', teamId);
  }, [teamId]);

  return (
    <Flex gap={48}>
      <Head>
        <title>POOMA - {team?.name}</title>
      </Head>
      <Header />

      {isLoading ? (
        <Loading />
      ) : members && member && team ? (
        <>
          {!member.spectactorMode && (
            <Flex css={{ alignItems: 'center' }}>
              <Cards member={member} team={team} />
            </Flex>
          )}
          <Title>{team?.name}</Title>
          <TeamCards
            members={members}
            isOpen={isOpen}
            onRemove={handleRemove}
          />
          <Flex
            horizontal
            css={{ justifyContent: 'center', padding: spacings[12] }}
          >
            {!isLoading && members && members.length > 0 && (
              <Button variant='solid' isActive={isOpen} onClick={handleResolve}>
                {isOpen ? 'Hide Cards' : 'Show Cards'}
              </Button>
            )}
          </Flex>
        </>
      ) : (
        <JoinModal teamId={teamId} title='Join this game' />
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

export async function getServerSideProps(context: NextPageContext) {
  const teamId = `${context.query.teamId}`;

  return {
    props: { teamId },
  };
}

export default Team;
