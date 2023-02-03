import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { CARD_HEIGHT, GENERIC_CARD_STYLES } from './constants';

type CardProps = {
  card: string;
  activeCard?: string | null;
  isLocked: boolean;
  onClick: (_card: string) => void;
};

export const Card: React.FC<CardProps> = ({
  card,
  activeCard,
  isLocked,
  onClick,
}) => {
  const isActiveCard = card === activeCard;

  const cardColor = useColorModeValue(
    isLocked ? 'cyan.400' : 'cyan.500',
    isLocked ? 'grey.400' : 'green.400'
  );
  const cardColorActive = useColorModeValue(
    isLocked ? 'green.500' : 'green.400',
    isLocked ? 'cyan.500' : 'cyan.500'
  );

  return (
    <Box
      css={{ perspective: '1000px', aspectRatio: '120 / 150' }}
      borderRadius='xl'
      height={CARD_HEIGHT}
    >
      <Flex
        as='li'
        onClick={() => onClick(card)}
        data-testid='card'
        {...GENERIC_CARD_STYLES(card, true)}
        backgroundColor={isActiveCard ? cardColorActive : cardColor}
        cursor={isLocked ? 'not-allowed' : 'pointer'}
        transition='transform 0.25s ease-in-out'
        color={isLocked ? 'grey.300' : 'white'}
        _hover={{
          transform: isLocked ? 'scale(1);' : 'scale(1.08);',
        }}
      >
        <Text
          wordBreak='break-word'
          dangerouslySetInnerHTML={{ __html: card }}
          css={{
            em: {
              opacity: isLocked ? 0.3 : 1,
            },
          }}
        />
      </Flex>
    </Box>
  );
};
