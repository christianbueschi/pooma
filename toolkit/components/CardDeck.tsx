import { useEffect, useState } from 'react';
import { Card } from './Card';
import { CARDS } from './constants';
import { Grid } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { useUpdateMemberMutations } from '../hooks/useUpdateMemberMutations';
import { Member, Team } from '../types';

type CardDeckProps = {
  member: Member;
  team: Team;
};

export const CardDeck: React.FC<CardDeckProps> = ({ team, member }) => {
  const { t } = useTranslation(['common']);

  const [activeCard, setActiveCard] = useState<string | null>();

  const [memberMutation] = useUpdateMemberMutations();

  const onClickCard = async (card: string) => {
    if (team.isLocked) return;
    let newCard = card;

    if (card === activeCard) {
      newCard = '';
    }

    setActiveCard(newCard);

    await memberMutation({
      id: member.id,
      card: newCard,
    });
  };

  useEffect(() => {
    setActiveCard(member.card);
  }, [member.card]);

  const cardMode = team.cardMode as 'FIBONACCI' | 'TSHIRT';

  const cards = CARDS(t)[cardMode];

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
