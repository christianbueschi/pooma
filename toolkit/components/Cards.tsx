import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { api } from './api';
import { Member, Team } from './apiHooks';
import { Card } from './Card';
import { CARDS } from './constants';

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
    <section>
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
    </section>
  );
};

const CardList = styled.ul`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
  padding: 0;
  width: 632px; // 120px*5 + 4*8px
  max-width: 100%;
  margin: 0 auto;
`;

const CardReady = styled.li<{ isLocked: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme, isLocked }) =>
    isLocked ? theme.colors.red : theme.colors.blue};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${({ isLocked }) => (isLocked ? 'default' : 'poiner')};
  color: white;
  font-size: 24px;
`;
