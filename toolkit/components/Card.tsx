import { Flex, Text } from '@chakra-ui/react';
import { MQ } from './constants';

type CardProps = {
  card: string;
  activeCard?: string;
  isLocked: boolean;
  onClick: (card: string) => void;
};

export const Card: React.FC<CardProps> = ({
  card,
  activeCard,
  isLocked,
  onClick,
}) => {
  const isActiveCard = card === activeCard;

  const isLongText = card.length > 3;
  const fontSize = [
    isLongText ? '10px' : '14px',
    isLongText ? '10px' : '14px',
    isLongText ? '16px' : '22px',
  ];
  const lineHeight = [
    isLongText ? '12px' : '18px',
    isLongText ? '12px' : '18px',
    isLongText ? '20px' : '26px',
  ];

  const emFontSize = ['24px', '24px', '42px'];

  return (
    <Flex
      as='li'
      onClick={() => onClick(card)}
      data-testid='card'
      h={['130px', '130px', '150px']}
      borderRadius='8px'
      backgroundColor={isActiveCard ? 'blue.700' : 'green.500'}
      cursor={isLocked ? 'not-allowed' : 'pointer'}
      transition='transform 0.25s ease-in-out'
      color='white'
      alignItems=' center'
      justifyContent='center'
      padding='12px'
      textAlign='center'
      _hover={{
        transform: isLocked ? 'scale(1)' : 'scale(1.08)',
      }}
      css={{
        aspectRatio: '120 / 150',
      }}
    >
      <Text
        fontSize={fontSize}
        lineHeight={lineHeight}
        dangerouslySetInnerHTML={{ __html: card }}
        css={{
          em: {
            fontSize: '24px',

            [MQ[1]]: {
              fontSize: '32px',
            },
            [MQ[2]]: {
              fontSize: '42px',
            },
          },
        }}
      />
    </Flex>
  );
};
