import type { AppProps } from 'next/app';
import Head from 'next/head';
import CookieConsent from 'react-cookie-consent';
import { Footer } from '../../toolkit/components/Footer';
import { Grid, GridItem } from '@chakra-ui/react';
import '@fontsource/monoton/400.css';
import '@fontsource/montserrat/400.css';
import { colors } from '../../toolkit/theme/colors';
import { trpc } from '../utils/trpc';
import { Chakra } from '../../toolkit/components/Chakra';
import { theme } from '../../toolkit/theme';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>POOMA</title>
        <meta
          name='description'
          content='Dead simple planning poker for your scrum team!'
        />
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
              buttonText='Ok'
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
              This website uses cookies to enhance the user experience.
            </CookieConsent>
          </GridItem>
        </Grid>
      </Chakra>
    </>
  );
};

export default trpc.withTRPC(MyApp);
