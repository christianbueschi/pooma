import type { AppProps } from 'next/app';
import { css, Global, ThemeProvider } from '@emotion/react';
import emotionReset from 'emotion-reset';
import { theme } from '../toolkit/theme';
import Head from 'next/head';
import CookieConsent from 'react-cookie-consent';
import { Footer } from '../toolkit/components/Footer';

const GLOBAL_STYLES = css`
  @import url('https://fonts.googleapis.com/css?family=Monoton|Montserrat:300,400,600,700');

  ${emotionReset}

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: white;
    font-family: 'Montserrat', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f2f2f2;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%23ffffff' fill-opacity='0.78'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");

    padding-bottom: 50px;
  }
`;

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
      <Global styles={GLOBAL_STYLES} />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
        <Footer />
        <CookieConsent
          location='bottom'
          buttonText='Ok'
          cookieName='poomaCookieConsent'
          style={{ background: theme.colors.blue }}
          buttonStyle={{
            background: theme.colors.green,
            color: theme.colors.white,
            fontSize: '13px',
            borderRadius: '8px',
          }}
          expires={150}
        >
          This website uses cookies to enhance the user experience.
        </CookieConsent>
      </ThemeProvider>
    </>
  );
};

export default MyApp;
