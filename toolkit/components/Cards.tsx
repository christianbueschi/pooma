import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { spacings } from '../theme/spacings';
import { api } from './api';
import { Member, Team } from './apiHooks';
import { Card } from './Card';
import { CARDS, MQ } from './constants';

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
        <CardList>
          {CARDS[team.cardMode].map((card) => (
            <Card
              key={card}
              card={card}
              onClick={onClickCard}
              activeCard={activeCard}
              isLocked={team.isLocked}
            />
          ))}
        </CardList>
      )}
    </>
  );
};

const CardList = styled.ul`
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 0;
  margin: ${spacings[12]};

  ${MQ[1]} {
    max-width: 632px; // 120px*5 + 4*8px
    grid-template-columns: repeat(5, 1fr);
  }
`;
