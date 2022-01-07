import styled from '@emotion/styled';
import { useEffect, useState } from 'react';
import { api } from './api';
import { Member, Team } from './apiHooks';
import { CARDS } from './constants';

type CardsProps = {
  member: Member;
  team: Team;
};

export const Cards: React.FC<CardsProps> = ({ team, member }) => {
  const [activeCard, setActiveCard] = useState<string>();

  const onClickCard = async (card: string) => {
    setActiveCard(card);
    await api.updateMember(team.id, member.id, { card });
  };

  const onClickReady = async () => {
    if (team.isLocked) return;

    setActiveCard(undefined);
    await api.updateMember(team.id, member.id, { card: '' });
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
          {CARDS[team.cardMode].map((card, index) => (
            <Card key={index} onClick={() => onClickCard(card)}>
              <CardTitle isSmall={card.length > 3}>{card}</CardTitle>
            </Card>
          ))}

          {(team.isLocked || activeCard) && (
            <CardReady isLocked={team.isLocked} onClick={onClickReady}>
              <p>{team.isLocked ? 'Locked' : 'Ready'}</p>
            </CardReady>
          )}
        </CardList>
      )}
    </section>
  );
};

const CardList = styled.ul`
  position: relative;
  overflow: hidden;
  display: block;
  padding: 0;
  width: 900px;
  max-width: 100%;
  margin: 0 auto;
`;

const Card = styled.li`
  float: left;
  padding: 1rem;
  margin: 0 0.5rem 0.5rem 0;
  list-style: none;
  font-size: 2rem;
  text-align: center;
  line-height: 2rem;
  background: ${({ theme }) => theme.colors.green};
  cursor: pointer;
  transition: transform 0.25s ease-in-out;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    content: '';
    padding-bottom: 100%;
  }

  @media (min-width: 320px) and (max-width: 768px) {
    width: calc(33% - 0.35rem);

    &:nth-child(3n) {
      margin-right: 0;
    }
  }

  @media (min-width: 769px) {
    width: calc(20% - 0.5rem);

    &:nth-child(5n) {
      margin-right: 0;
    }

    &:nth-child(5n + 1) {
      clear: left;
    }
  }

  &:hover {
    transform: scale(1.08);
  }
`;

const CardTitle = styled.span<{ isSmall: boolean }>`
  ${({ isSmall }) =>
    isSmall
      ? `
        font-size: 1.2rem;
        line-height: 1.4rem;
    `
      : ''}
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
