import { Box, Text, VStack } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

type PModalProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  preventClosing?: boolean;
  onClose?: () => void;
};

export const Modal: React.FC<PModalProps> = ({
  title,
  isOpen,
  preventClosing,
  onClose,
  children,
}) => {
  const { theme } = useTheme();
  const backgroundColor = theme === 'dark' ? 'grey.400' : 'white';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !preventClosing && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, preventClosing, onClose]);

  if (!isOpen) return null;

  return (
    <Box
      position='fixed'
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={1000}
      bg='rgba(0, 0, 0, 0.5)'
      display='flex'
      alignItems='center'
      justifyContent='center'
      onClick={!preventClosing ? onClose : undefined}
    >
      <Box
        backgroundColor={backgroundColor}
        mx={[4]}
        maxWidth='2xl'
        borderRadius='lg'
        boxShadow='xl'
        onClick={(e) => e.stopPropagation()}
      >
        <Box p={[4, 6, 12]} position='relative'>
          <Text fontSize='xl' fontWeight='bold' textAlign='center' mb={4}>
            {title}
          </Text>
          {!preventClosing && (
            <Box
              position='absolute'
              top='2'
              right='2'
              cursor='pointer'
              onClick={onClose}
              fontSize='xl'
              fontWeight='bold'
            >
              ×
            </Box>
          )}
          <VStack gap={4}>{children}</VStack>
        </Box>
      </Box>
    </Box>
  );
};
