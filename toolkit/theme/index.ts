import { colors } from './colors';
import { spacings } from './spacings';
import { borderRadius } from './borderRadius';
import { extendTheme } from '@chakra-ui/react';

const globalStyles = {
  global: {
    body: {
      margin: 0,
      minHeight: '100vh',
      background: 'white',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: '#f2f2f2',
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='12' viewBox='0 0 20 12'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='charlie-brown' fill='%23ffffff' fill-opacity='0.78'%3E%3Cpath d='M9.8 12L0 2.2V.8l10 10 10-10v1.4L10.2 12h-.4zm-4 0L0 6.2V4.8L7.2 12H5.8zm8.4 0L20 6.2V4.8L12.8 12h1.4zM9.8 0l.2.2.2-.2h-.4zm-4 0L10 4.2 14.2 0h-1.4L10 2.8 7.2 0H5.8z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
    },
  },
};

export const theme = extendTheme({ colors, styles: globalStyles });
