'use client';

import { useEffect, useState } from 'react';
import { Card } from './Card';
import { CARDS } from './constants';
import { Grid } from '@chakra-ui/react';
import { Member, Team } from '../types';
import { useUpdate } from '../hooks/useUpdate';

type CardDeckProps = {
  member: Member;
  team: Team;
};

export const CardDeck: React.FC<CardDeckProps> = ({ team, member }) => {
  const [activeCard, setActiveCard] = useState<string | null>();

  const [updateMember] = useUpdate<Member>('members');

  const onClickCard = async (card: string) => {
    if (team.isLocked) return;
    let newCard = card;

    if (card === activeCard) {
      newCard = '';
    }

    setActiveCard(newCard);

    await updateMember({
      id: member.id,
      card: newCard,
    });
  };

  useEffect(() => {
    setActiveCard(member.card);
  }, [member.card]);

  const cardMode = team.cardMode as 'FIBONACCI' | 'TSHIRT';

  const cards = CARDS()[cardMode];

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
          gap={[2, 2, 4]}
          ml={[2, 2, 4]}
          mr={[2, 2, 4]}
        >
          {cards.map((card) => (
            <Card
              key={card}
              card={card}
              onClick={onClickCard}
              activeCard={activeCard}
              isLocked={team.isLocked || false}
            />
          ))}
        </Grid>
      )}
    </>
  );
};
