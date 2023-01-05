import { Button, Heading, Spinner, Text, VStack } from '@chakra-ui/react';
import { GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { useContext, useEffect, useState } from 'react';
import { CardDeck } from '../../../toolkit/components/CardDeck';
import { Header } from '../../../toolkit/components/Header';
import { Modal } from '../../../toolkit/components/Modal';
import { TeamCards } from '../../../toolkit/components/TeamCards';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useUpdateTeamMutations } from '../../../toolkit/hooks/useUpdateTeamMutations';
import { useUpdateMemberMutations } from '../../../toolkit/hooks/useUpdateMemberMutations';
import { SupabaseContext } from '../../../toolkit/context/SupabaseProvider';
import { Member } from '../../../toolkit/types';
import { useDeleteMemberMutations } from '../../../toolkit/hooks/useDeleteMemberMutations';

type TeamProps = {};

const Team: NextPage<TeamProps> = () => {
  const { t } = useTranslation(['common']);

  const [isOpen, toggleIsOpen] = useState(false);

  const { useTeamContext, useMemberContext, setShowJoinModal } =
    useContext(SupabaseContext);

  const [team, isTeamLoading, _, fetchTeam] = useTeamContext();
  const [member, isMemberLoading] = useMemberContext();

  const isMemberInTeam = team?.members?.some((m) => {
    return m.id === member?.id;
  });

  const isLoading = isTeamLoading || isMemberLoading;

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !team) {
      router.push('/404');
    }
  }, [team, isLoading, router]);

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

  const [mutateTeam] = useUpdateTeamMutations();
  const [mutateMember] = useUpdateMemberMutations();

  const resolve = () => {
    toggleIsOpen(true);
    if (!team?.id) return;

    mutateTeam({
      id: team.id,
      isLocked: true,
    });
  };

  const clear = async () => {
    toggleIsOpen(false);

    if (!team?.id) return;

    await mutateTeam({
      id: team.id,
      isLocked: false,
    });

    team.members?.forEach(async (member) => {
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

  const [deleteMemberMutation] = useDeleteMemberMutations();

  const onRemoveMember = async () => {
    if (!team || !memberToRemove) {
      toggleRemoveMemberModal(false);
      return;
    }

    await deleteMemberMutation({
      id: memberToRemove.id,
    });

    fetchTeam(team.id);

    toggleRemoveMemberModal(false);
  };

  useEffect(() => {
    toggleIsOpen(!!team?.isLocked);
  }, [team, router, isLoading]);

  const title = `${t('title')} ${team ? ' - ' + team?.name : ''}`;

  return (
    <VStack gap={[2, 4, 8]} mb={12}>
      <Head>
        <title>{title}</title>
      </Head>

      <Header team={team} member={member} />

      {isLoading ? (
        <Spinner />
      ) : isMemberInTeam && team?.members?.length && member && team ? (
        <>
          {!member.isSpectactorMode && (
            <VStack css={{ alignItems: 'center' }}>
              <CardDeck member={member} team={team} />
            </VStack>
          )}
          <Heading data-testid='title'>{team?.name}</Heading>
          <TeamCards
            members={team.members}
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
}: GetServerSidePropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

export default Team;
