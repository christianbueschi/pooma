import 'react-toggle/style.css';
import { Box } from '@chakra-ui/react';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useTheme } from 'next-themes';

type StickyHeaderProps = {
  children?: React.ReactNode;
};

export const StickyHeader: React.FC<StickyHeaderProps> = ({ children }) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? 'grey.400' : 'white.400';

  const scrollPosition = useScrollPosition();

  return (
    <Box
      minH='66px'
      w='100%'
      position='sticky'
      top={0}
      bg={scrollPosition > 30 ? backgroundColor : 'transparent'}
      transition='background 0.3s ease-in-out'
      zIndex={999999}
    >
      {children}
    </Box>
  );
};
