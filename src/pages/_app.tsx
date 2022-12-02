import type { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithTranslation, useTranslation } from 'next-i18next';
import CookieConsent from 'react-cookie-consent';
import { Footer } from '../../toolkit/components/Footer';
import { Grid, GridItem } from '@chakra-ui/react';
import '@fontsource/monoton/400.css';
import '@fontsource/montserrat/400.css';
import { colors } from '../../toolkit/theme/colors';
import { trpc } from '../utils/trpc';
import { Chakra } from '../../toolkit/components/Chakra';
import { theme } from '../../toolkit/theme';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { NextPageContext } from 'next';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { t } = useTranslation(['common']);

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>{t('title')}</title>
        <meta name='description' content={t('metaDescription') || ''} />
      </Head>

      <Chakra cookies={pageProps.cookies}>
        <Grid gridTemplateRows='1fr auto' height='100vh'>
          <GridItem>
            <Component {...pageProps} />
          </GridItem>
          <GridItem>
            <Footer />
            <CookieConsent
              location='bottom'
              buttonText={t('cookieButton')}
              cookieName='poomaCookieConsent'
              style={{ background: colors.green[400] }}
              buttonStyle={{
                background: colors.green[500],
                color: theme.colors.white,
                fontSize: '13px',
                borderRadius: '8px',
              }}
              expires={150}
            >
              {t('cookieText')}
            </CookieConsent>
          </GridItem>
        </Grid>
      </Chakra>
    </>
  );
};

export const getServerSideProps = async ({ locale }: NextPageContext) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common'])),
    },
  };
};

export default trpc.withTRPC(appWithTranslation(MyApp));
