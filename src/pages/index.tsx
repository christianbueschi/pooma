import { NextPage, NextPageContext } from 'next';
import { useState } from 'react';
import { Button, Heading, VStack } from '@chakra-ui/react';
import { Header } from '../../toolkit/components/Header';
import { CreateModal } from '../../toolkit/components/CreateModal';
import { Logo } from '../../toolkit/components/Brand';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Trans, useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Member, Team } from '../../toolkit/types';
import { useSupabaseContext } from '../../toolkit/context/SupabaseProvider';

type HopeProps = {
  team?: Team;
  member?: Member;
};

const Home: NextPage<HopeProps> = ({ team, member }) => {
  const { t } = useTranslation(['common']);

  const [showStartModal, setShowStartModal] = useState(false);
  const { setShowJoinModal } = useSupabaseContext();

  return (
    <>
      <Head>
        <title>{t('title')}</title>
        <meta name='description' content={t('metaDescription') || ''} />
      </Head>

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
            <Trans i18nKey={t('heading')} />
          </Heading>
          <VStack gap={2}>
            <Button
              variant='solid'
              onClick={() => setShowStartModal(true)}
              data-testid='new-game-button'
            >
              {t('startButton')}
            </Button>
            <Button
              variant='link'
              onClick={() => setShowJoinModal(true)}
              data-testid='join-game-button'
            >
              {t('joinButton')}
            </Button>
          </VStack>

          <CreateModal
            handleClose={() => setShowStartModal(false)}
            isOpen={showStartModal}
          />
        </VStack>
      </VStack>
    </>
  );
};

export async function getServerSideProps({ locale }: NextPageContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
}

export default Home;
