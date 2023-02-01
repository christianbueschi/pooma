import 'react-toggle/style.css';
import { Box, useColorModeValue } from '@chakra-ui/react';
import { useScrollPosition } from '../hooks/useScrollPosition';

type StickyHeaderProps = {
  children?: React.ReactNode;
};

export const StickyHeader: React.FC<StickyHeaderProps> = ({ children }) => {
  const backgrounColor = useColorModeValue('white.400', 'grey.400');

  const scrollPosition = useScrollPosition();

  return (
    <Box
      minH='66px'
      w='100%'
      position='sticky'
      top={0}
      bg={scrollPosition > 30 ? backgrounColor : 'transparent'}
      transition='background 0.3s ease-in-out'
      zIndex={999999}
    >
      {children}
    </Box>
  );
};
