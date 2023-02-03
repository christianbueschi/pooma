import {
  Box,
  Flex,
  FlexProps,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { Member } from '../types';
import { CARD_HEIGHT, GENERIC_CARD_STYLES } from './constants';

type FlipCardProps = {
  isOpen: boolean;
  member: Member;
  onRemove: (_member: Member) => void;
};

export const FlipCard: React.FC<FlipCardProps> = ({
  isOpen,
  member,
  onRemove,
}) => {
  const cookies = parseCookies();
  const [isMe, setIsMe] = useState(false);

  useEffect(() => {
    setIsMe(cookies.memberId === member.id);
  }, [cookies, member.id]);

  return (
    <VStack
      as='li'
      data-testid={`team-card-${member.name}`}
      position='relative'
      _hover={{
        borderRadius: 'xl',

        '> div span': {
          display: 'block',
        },
      }}
    >
      <Text noOfLines={1} textTransform='capitalize'>
        {member.name} {isMe ? '(Me)' : ''}
      </Text>

      <Box
        css={{ perspective: '1000px', aspectRatio: '120 / 150' }}
        borderRadius='xl'
        height={CARD_HEIGHT}
      >
        <Box
          transition='all 0.6s ease-in-out'
          position='relative'
          transform={isOpen ? 'rotateY(180deg)' : ''}
          css={{
            transformStyle: 'preserve-3d',
          }}
        >
          <CardSite card={member.card} />
          <CardSite card={member.card} isFront />
        </Box>
        {!isMe && (
          <Box
            as='span'
            position='absolute'
            top={0}
            right={0}
            cursor='pointer'
            display='none'
          >
            <FiX
              size={24}
              onClick={() => onRemove(member)}
              color='grey.400'
              data-testid='card-remove-button'
            />
          </Box>
        )}
      </Box>
    </VStack>
  );
};

type CardSiteProps = {
  card: string | null;
  isFront?: boolean;
} & FlexProps;

export const CardSite: React.FC<CardSiteProps> = ({
  isFront,
  card,
  ...props
}) => {
  const cardColor = useColorModeValue('cyan.500', 'green.400');
  const cardColorReady = useColorModeValue('green.400', 'cyan.500');

  const styles: FlexProps = {
    ...GENERIC_CARD_STYLES(card, !!isFront),
    backgroundColor: !!card ? cardColorReady : cardColor,
    zIndex: isFront ? 1 : 2,
    transform: isFront ? 'rotateY(180deg)' : 'rotateY(0deg)',
    position: 'absolute',
    top: '0',
    left: '0',
    color: 'white',
    boxShadow: '0px 5px 20px -5px rgb(0, 0, 0)',
    width: '100%',
    willChange: 'transform',
    ...props,
  };

  return (
    <Flex {...styles}>
      <Text
        textAlign='center'
        dangerouslySetInnerHTML={{
          __html: isFront ? card || '' : !card ? '?' : 'Ready',
        }}
        data-testid='card-value'
      />
    </Flex>
  );
};
