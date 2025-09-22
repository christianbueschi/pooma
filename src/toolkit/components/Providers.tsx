'use client';

import '@fontsource/monoton/400.css';
import '@fontsource/montserrat/400.css';
import { Chakra } from './Chakra';
import { SupabaseQueryProvider } from '../context/SupabaseQueryProvider';
import { ModalProvider } from '../context/ModalProvider';
import { JoinModal } from './JoinModal';
import { Footer } from './Footer';
import CookieConsent from 'react-cookie-consent';
import { colors } from '../theme/colors';
import { theme } from '../theme';
import { Grid, GridItem, ColorModeScript } from '@chakra-ui/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Chakra>
        <SupabaseQueryProvider>
          <ModalProvider>
            <Grid gridTemplateRows='1fr auto' height='100vh'>
              <GridItem>
                {children}
                <JoinModal title='Join Game' />
              </GridItem>
              <GridItem>
                <Footer />
                <CookieConsent
                  location='bottom'
                  buttonText='Accept'
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
                  This website uses cookies to enhance your experience.
                </CookieConsent>
              </GridItem>
            </Grid>
          </ModalProvider>
        </SupabaseQueryProvider>
      </Chakra>
    </>
  );
}
