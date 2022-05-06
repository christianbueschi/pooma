import type { AppProps } from 'next/app';

import { theme } from '../toolkit/theme';
import Head from 'next/head';
import CookieConsent from 'react-cookie-consent';
import { Footer } from '../toolkit/components/Footer';
import Script from 'next/script';
import { ChakraProvider, Grid, GridItem } from '@chakra-ui/react';

import '@fontsource/monoton/400.css';
import '@fontsource/montserrat/400.css';
import { colors } from '../toolkit/theme/colors';

const shouldRenderAnalytics =
  typeof window !== 'undefined' && window.location.hostname === 'pooma.app';

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

      {shouldRenderAnalytics && (
        <>
          <Script
            strategy='afterInteractive'
            src='https://www.googletagmanager.com/gtag/js?id=UA-119147367-1'
          ></Script>
          <Script id='google-analytics' strategy='afterInteractive'>
            {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
  
    gtag('config', 'UA-119147367-1');
      
    `}
          </Script>
        </>
      )}

      <ChakraProvider theme={theme}>
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
              style={{ background: colors.blue[500] }}
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
      </ChakraProvider>
    </>
  );
};

export default MyApp;
