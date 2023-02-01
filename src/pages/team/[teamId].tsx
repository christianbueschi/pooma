import { Button, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { CardDeck } from '../../../toolkit/components/CardDeck';
import { Header } from '../../../toolkit/components/Header';
import { Modal } from '../../../toolkit/components/Modal';
import { TeamCards } from '../../../toolkit/components/TeamCards';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member, Team } from '../../../toolkit/types';
import { useDelete } from '../../../toolkit/hooks/useDelete';
import { useModalContext } from '../../../toolkit/context/ModalProvider';
import { client } from '../../../toolkit/supabase/client';
import { useSelect } from '../../../toolkit/hooks/useSelect';
import { parseCookies } from 'nookies';
import { teamSelectProps } from '../../../toolkit/constants';
import { useUpdate } from '../../../toolkit/hooks/useUpdate';

type TeamProps = {};

const Team: NextPage<TeamProps> = () => {
  const { t } = useTranslation(['common']);

  const [isOpen, toggleIsOpen] = useState(false);

  const { setShowJoinModal } = useModalContext();

  const router = useRouter();

  const teamId = (router.query.teamId as string) || '';

  const cookies = parseCookies();

  const teamFilter = useRef(['id', 'eq', teamId]);
  const membersFilter = useRef(['teamId', 'eq', teamId]);

  const [teams, isTeamLoading] = useSelect<Team>('teams', {
    props: teamSelectProps,
    filter: teamFilter.current,
    shouldSubscribe: true,
  });
  console.log('🚀 ~ file: [teamId].tsx:44 ~ teams', teams);

  const team = teams?.[0];

  const [members, isMembersLoading] = useSelect<Member>('members', {
    filter: membersFilter.current,
    shouldSubscribe: true,
  });
  console.log('🚀 ~ file: [teamId].tsx:51 ~ members', members);

  const member = members?.find((m) => {
    return m.id === cookies.memberId;
  });
  console.log('🚀 ~ file: [teamId].tsx:55 ~ member ~ member', member);

  const isMemberInTeam = members?.some((m) => {
    return m.id === member?.id;
  });

  const isLoading = isTeamLoading || isMembersLoading;

  useEffect(() => {
    console.log('EFFECT [teamId].tsx:68');

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

    // refetchMembers();

    toggleRemoveMemberModal(false);
  };

  useEffect(() => {
    console.log('EFFECT [teamId].tsx:135');
    toggleIsOpen(!!team?.isLocked);
  }, [team, router, isLoading]);

  const title = `${t('title')} ${team ? ' - ' + team?.name : ''}`;

  return (
    <VStack gap={[2, 4, 8]} mb={12}>
      <Head>
        <title>{title}</title>
      </Head>

      <Header />

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
        <></>
      )}

      <Modal
        title={t('removeMemberModalTitle')}
        onClose={() => toggleRemoveMemberModal(false)}
        isOpen={!!removeMemberModal && !!memberToRemove}
      >
        <VStack gap={2}>
          <Text css={{ textAlign: 'center' }}>
            {t('removeMemberHint', { name: memberToRemove?.name })}
          </Text>
          <Button variant='solid' onClick={onRemoveMember} colorScheme='red'>
            {t('removeButton')}
          </Button>
          <Button
            variant='ghost'
            onClick={() => toggleRemoveMemberModal(false)}
          >
            {t('cancelButton')}
          </Button>
        </VStack>
      </Modal>
    </VStack>
  );
};

export async function getServerSideProps({
  locale,
  query,
}: GetServerSidePropsContext) {
  const teamId = query.teamId as string;

  const { data } = await client
    .from('teams')
    .select()
    .eq('id', teamId)
    .single();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

export default Team;
