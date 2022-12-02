import { useEffect, useState } from 'react';
import { Card } from './Card';
import { CARDS } from './constants';
import { Grid } from '@chakra-ui/react';
import { Member, Team } from '@prisma/client';
import { trpc } from '../../src/utils/trpc';

type CardDeckProps = {
  member: Member;
  team: Team;
};

export const CardDeck: React.FC<CardDeckProps> = ({ team, member }) => {
  const [activeCard, setActiveCard] = useState<string | null>();

  const updateMemberMutation = trpc.updateMember.useMutation();

  const onClickCard = async (card: string) => {
    if (team.isLocked) return;
    let newCard = card;

    if (card === activeCard) {
      newCard = '';
    }

    setActiveCard(newCard);

    await updateMemberMutation.mutateAsync({
      id: member.id,
      card: newCard,
    });
  };

  useEffect(() => {
    setActiveCard(member.card);
  }, [member.card]);

  return (
    <>
      {team && (
        <Grid
          as='ul'
          templateColumns={[
            'repeat(4, 1fr)',
            'repeat(4, 1fr)',
            'repeat(5, 1fr)',
          ]}
          gap={4}
          ml={[2, 2, 4]}
          mr={[2, 2, 4]}
        >
          {CARDS[team.cardMode].map((card) => (
            <Card
              key={card}
              card={card}
              onClick={onClickCard}
              activeCard={activeCard}
              isLocked={team.isLocked}
            />
          ))}
        </Grid>
      )}
    </>
  );
};
