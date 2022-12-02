import {
  Box,
  Flex,
  FlexProps,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Member } from '@prisma/client';
import { parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';

type FlipCardProps = {
  isOpen: boolean;
  member: Member;
  onRemove: (member: Member) => void;
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

  const cardHeight = ['100px', '130px', '150px'];

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
        height={cardHeight}
      >
        <Box
          transition='all 0.6s ease-in-out'
          position='relative'
          transform={isOpen ? 'rotateY(180deg)' : ''}
          css={{
            transformStyle: 'preserve-3d',
          }}
        >
          <CardSite member={member} height={cardHeight} />
          <CardSite member={member} isFront height={cardHeight} />
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
            <FiX size={24} onClick={() => onRemove(member)} color='grey.400' />
          </Box>
        )}
      </Box>
    </VStack>
  );
};

type CardSiteProps = {
  member: Member;
  isFront?: boolean;
} & FlexProps;

const CardSite: React.FC<CardSiteProps> = ({ isFront, member, ...props }) => {
  const cardColor = useColorModeValue('cyan.500', 'green.400');
  const cardColorReady = useColorModeValue('green.400', 'cyan.500');

  const styles: FlexProps = {
    backgroundColor: !!member.card ? cardColorReady : cardColor,
    zIndex: isFront ? 1 : 2,
    transform: isFront ? 'rotateY(180deg)' : 'rotateY(0deg)',
    fontSize:
      isFront && member.card && member.card.length > 3
        ? '16px'
        : ['18px', '20px', '22px'],
    lineHeight:
      isFront && member.card && member.card.length > 3 ? '20px' : '26px',
    borderRadius: 'xl',
    padding: '12px',
    position: 'absolute',
    top: '0',
    left: '0',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 5px 20px -5px rgb(0, 0, 0)',
    width: '100%',
    sx: {
      backfaceVisibility: 'hidden',
      aspectRatio: '4/5',
    },
    ...props,
  };

  return (
    <Flex {...styles}>
      {isFront ? (
        <>
          {!!member.card && member.card.length > 3 ? (
            <Text
              textAlign='center'
              dangerouslySetInnerHTML={{
                __html: member.card || '',
              }}
              data-testid='card-value'
            />
          ) : (
            <Text
              textAlign='center'
              dangerouslySetInnerHTML={{
                __html: member.card || '',
              }}
              data-testid='card-value'
            />
          )}
        </>
      ) : (
        <Text textAlign='center'>{member.card ? 'Ready' : '?'}</Text>
      )}
    </Flex>
  );
};
