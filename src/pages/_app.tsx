import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Grid, GridItem } from '@chakra-ui/react';
import '@fontsource/monoton/400.css';
import '@fontsource/montserrat/400.css';
import { Chakra } from '../../toolkit/components/Chakra';
import { SupabaseProvider } from '../../toolkit/context/SupabaseProvider';
import { appWithTranslation, useTranslation } from 'next-i18next';
import { Footer } from '../../toolkit/components/Footer';
import CookieConsent from 'react-cookie-consent';
import { colors } from '../../toolkit/theme/colors';
import { theme } from '../../toolkit/theme';
import { JoinModal } from '../../toolkit/components/JoinModal';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { t } = useTranslation(['common']);

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      </Head>

      <Chakra cookies={pageProps.cookies}>
        <Grid gridTemplateRows='1fr auto' height='100vh'>
          <GridItem>
            <SupabaseProvider>
              <Component {...pageProps} />
              <JoinModal title={t('joinModalTitle')} />
            </SupabaseProvider>
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

export default appWithTranslation(MyApp);
