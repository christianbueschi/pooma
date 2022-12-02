import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { Member } from '@prisma/client';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(['common']);

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
            gap={[4, 2, 4]}
            px={2}
            paddingBottom={4}
            as='ul'
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
          <Text>{t('noPlayersText')}</Text>
        </Flex>
      )}
    </VStack>
  );
};
