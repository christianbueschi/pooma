import { useEffect, useState } from 'react';
import { api } from '../api/api';
import { Member, Team } from '../api/apiHooks';
import { Card } from './Card';
import { CARDS } from './constants';
import { Grid } from '@chakra-ui/react';

type CardsProps = {
  member: Member;
  team: Team;
};

export const Cards: React.FC<CardsProps> = ({ team, member }) => {
  const [activeCard, setActiveCard] = useState<string>();

  const onClickCard = async (card: string) => {
    if (team.isLocked) return;
    let newCard = card;

    if (card === activeCard) {
      newCard = '';
    }

    setActiveCard(newCard);
    await api.updateMember(team.id, member.id, { card: newCard });
  };

  // reset card when changed via dashboard
  // keep card in sync with FS
  useEffect(() => {
    setActiveCard(member.card);
  }, [member.card]);

  return (
    <>
      {team && (
        <Grid
          as='ul'
          templateColumns={[
            'repeat(3, 1fr)',
            'repeat(4, 1fr)',
            'repeat(5, 1fr)',
          ]}
          gap={4}
          margin={4}
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
