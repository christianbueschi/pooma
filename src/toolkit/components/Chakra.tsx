'use client';

import { ChakraProvider, localStorageManager } from '@chakra-ui/react';
import { theme } from '../theme';

type ChakraProps = {
  children: React.ReactNode;
};

export const Chakra: React.FC<ChakraProps> = ({ children }) => {
  return (
    <ChakraProvider colorModeManager={localStorageManager} theme={theme}>
      {children}
    </ChakraProvider>
  );
};
