import { Member, useMember } from '../api/apiHooks';
import { FiX } from 'react-icons/fi';

import { ShareLink } from './ShareLink';
import { Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { colors } from '../theme/colors';

type TeamCardsProps = {
  members: Member[];
  isOpen: boolean;
  onRemove: (member: Member) => void;
  handleResolve: () => void;
};

export const TeamCards: React.FC<TeamCardsProps> = ({
  members,
  isOpen,
  onRemove,
  handleResolve,
}) => {
  const sortedMembers = members.sort((a, b) => (a.name > b.name ? 1 : -1));

  const [currentMember] = useMember();

  // filter out spectactors
  const filteredMembers = sortedMembers.filter(
    (member) => !member.spectactorMode
  );

  const isCurrentUserOnlyMember =
    filteredMembers.length === 1 &&
    filteredMembers[0].name_lowercase === currentMember?.name_lowercase;

  const isMe = (member: Member) => currentMember?.id === member.id;

  return (
    <VStack justifyContent='center' alignItems='center' gap={8}>
      {filteredMembers.length > 0 ? (
        <>
          <Flex
            data-testid='team-card-list'
            justifyContent='center'
            flexWrap='wrap'
            gap={4}
            paddingLeft={0}
            paddingBottom={4}
          >
            {filteredMembers.map((member, index) => {
              return (
                <VStack
                  as='li'
                  key={index}
                  data-testid={`team-card-${member.name}`}
                  p={2}
                  position='relative'
                  _hover={{
                    outline: `1px solid ${colors.green[500]}`,
                    borderRadius: '8px',

                    '> div span': {
                      display: 'block',
                    },
                  }}
                >
                  <Text noOfLines={1} isTruncated textTransform='capitalize'>
                    {member.name} {isMe(member) ? '(Me)' : ''}
                  </Text>

                  <Box>
                    <Box
                      css={{ perspective: '1000px', aspectRatio: '120 / 150' }}
                      borderRadius='8px'
                      height={['130px', '130px', '150px']}
                    >
                      <Box
                        transition='all 0.6s ease-in-out'
                        position='relative'
                        transform={isOpen ? 'rotateY(180deg)' : ''}
                        css={{
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <Flex
                          backgroundColor={
                            !!member.card ? 'blue.700' : 'green.500'
                          }
                          zIndex={2}
                          transform='rotateY(0deg)'
                          fontSize='22px'
                          lineHeight='26px'
                          height={['130px', '130px', '150px']}
                          css={{
                            padding: '12px',
                            backfaceVisibility: 'hidden',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            flexDirection: 'column',
                            color: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxShadow: '0px 5px 20px -5px rgb(0, 0, 0)',
                            aspectRatio: '120 / 150',
                            borderRadius: '8px',
                          }}
                        >
                          <span>{member.card ? 'Ready' : '?'}</span>
                        </Flex>
                        <Flex
                          backgroundColor='blue.700'
                          transform='rotateY(180deg)'
                          fontSize={
                            member.card && member.card.length > 3
                              ? '16px'
                              : '22px'
                          }
                          lineHeight={
                            member.card && member.card.length > 3
                              ? '20px'
                              : '26px'
                          }
                          height={['130px', '130px', '150px']}
                          css={{
                            padding: '12px',
                            backfaceVisibility: 'hidden',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            flexDirection: 'column',
                            color: 'white',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            boxShadow: '0px 5px 20px -5px rgb(0, 0, 0)',
                            borderRadius: '8px',
                            em: {
                              fontSize: '42px',
                            },
                            aspectRatio: '120 / 150',
                          }}
                        >
                          {!!member.card && member.card.length > 3 ? (
                            <Text
                              dangerouslySetInnerHTML={{
                                __html: member.card || '',
                              }}
                              data-testid='card-value'
                            />
                          ) : (
                            <Text
                              dangerouslySetInnerHTML={{
                                __html: member.card || '',
                              }}
                              data-testid='card-value'
                            />
                          )}
                        </Flex>
                      </Box>
                    </Box>
                    {!isMe(member) && (
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
                          color={colors.grey[700]}
                        />
                      </Box>
                    )}
                  </Box>
                </VStack>
              );
            })}
          </Flex>
          <Button
            variant='solid'
            onClick={handleResolve}
            data-testid='show-cards-button'
            colorScheme={isOpen ? 'blue' : 'green'}
            w='120px'
          >
            {isOpen ? 'Hide Cards' : 'Show Cards'}
          </Button>
        </>
      ) : (
        <Flex gap={8} css={{ alignItems: 'center' }}>
          <Text>
            No players here. That's sad 😢. Quick, go and invite others..
          </Text>
          <ShareLink />
        </Flex>
      )}
      {isCurrentUserOnlyMember && (
        <VStack gap={2}>
          <Text>
            Quite boring to play alone 😪 don't you think? Quick, go and invite
            others..
          </Text>
          <ShareLink />
        </VStack>
      )}
    </VStack>
  );
};
