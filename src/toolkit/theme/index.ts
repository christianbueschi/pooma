import { createSystem, defaultConfig } from '@chakra-ui/react';
import { buttonStyles } from './button';
import { colors } from './colors';

export const system = createSystem(defaultConfig, {
  globalCss: {
    'html, body': {
      margin: 0,
      minHeight: '100vh',
      fontFamily: 'Montserrat, sans-serif',
      backgroundColor: { base: 'yellow.400', _dark: 'grey.400' },
      color: { base: 'grey.400', _dark: 'cyan.400' },
    },
  },
  theme: {
    tokens: {
      fonts: {
        heading: { value: 'Montserrat, sans-serif' },
        body: { value: 'Montserrat, sans-serif' },
      },
      colors,
    },

    recipes: {
      button: buttonStyles,
    },
  },
});
