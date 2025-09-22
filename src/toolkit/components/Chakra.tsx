'use client';

import { ChakraProvider } from '@chakra-ui/react';
import { ColorModeProvider } from '../../components/ui/color-mode';
import { system } from '../theme';

type ChakraProps = {
  children: React.ReactNode;
};

export const Chakra: React.FC<ChakraProps> = ({ children }) => {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  );
};
