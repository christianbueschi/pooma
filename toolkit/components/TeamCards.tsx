import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { Member } from '@prisma/client';
import { FlipCard } from './FlipCard';

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

  const filteredMembers = sortedMembers.filter(
    (member) => !member.isSpectactorMode
  );

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
            {filteredMembers.map((member, index) => (
              <FlipCard
                isOpen={isOpen}
                member={member}
                key={`${member.name}-${index}`}
                onRemove={onRemove}
              />
            ))}
          </Flex>
          <Button
            variant='solid'
            onClick={handleResolve}
            data-testid='show-cards-button'
          >
            {isOpen ? 'Hide Cards' : 'Show Cards'}
          </Button>
        </>
      ) : (
        <Flex gap={8} css={{ alignItems: 'center' }} px={4}>
          <Text>
            No players here. That&apos;s sad 😢. You can invite others..
          </Text>
        </Flex>
      )}
    </VStack>
  );
};
