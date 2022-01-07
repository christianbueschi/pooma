import styled from '@emotion/styled';
import { DocumentData } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import { api } from './api';
import { Member } from './apiHooks';
import { FIBONACCI_NUMBERS, T_SHIRT_SIZES } from './constants';

type TableCardsProps = {
  members: any[];
  cardMode: string;
  isOpen: boolean;
  highest: string;
  lowest: string;
  onRemove: (member: Member) => void;
};

export const TableCards: React.FC<TableCardsProps> = ({
  members,
  cardMode,
  isOpen,
  highest,
  lowest,
  onRemove,
}) => {
  const [team, setTeam] = useState<DocumentData>();

  const getTeam = async () => {
    const localTeam = localStorage.getItem('teamId');

    if (!localTeam) return;

    const myTeam = await api.getTeam(localTeam);
    setTeam(myTeam.data());
  };

  useEffect(() => {
    getTeam();
  }, []);

  return (
    <>
      {members.length > 0 && (
        <CardList>
          {members.map((member) => {
            return (
              <Card key={member.name}>
                <CardName>
                  <CardNameInner>{member.name}</CardNameInner>
                  <CardRemoveButton
                    onClick={() => onRemove(member.name)}
                  ></CardRemoveButton>
                </CardName>
                <CardContainer>
                  <CardContainerInner isOpen={isOpen}>
                    <CardFront isReady={member.card}>
                      <span>{member.card ? 'Ready' : '?'}</span>
                    </CardFront>
                    <CardBack
                      isOpen={isOpen}
                      isLowest={member.card === lowest}
                      isHighest={member.card === highest}
                      isSmall={member.card && member.card.length > 3}
                    >
                      {member.card}
                    </CardBack>
                  </CardContainerInner>
                </CardContainer>
              </Card>
            );
          })}
        </CardList>
      )}
    </>
  );
};

const CARD_STYLES = `
  width: 120px;
  height: 150px;
  border-radius: 8px;
`;

const FRONT_BACK_CARD_STYLES = `
padding: 1rem;
backface-visibility: hidden;
position: absolute;
top: 0;
left: 0;
display: flex;
color: white;
align-items: center;
justify-content: center;
font-size: 25px;
box-shadow: 0px 5px 20px -5px rgb(0, 0, 0);
`;

const CardList = styled.ul`
  display: block;
  overflow: hidden;
  padding-left: 0;
  padding-bottom: 5rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Card = styled.li`
  margin: 10px;
  display: inline-block;
  list-style: none;
  width: 120px;
`;

const CardName = styled.h4`
  color: ${({ theme }) => theme.colors.grey};
  position: relative;
  margin: 0;
  padding: 1rem 0 0.5rem;

  &:hover {
    CardRemoveButton {
      display: inline-block;

      &:hover {
        &:before,
        &:after {
          background-color: $red;
        }
      }
    }
  }
`;

const CardNameInner = styled.span`
  display: inline-block;
  width: calc(100% - 20px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardRemoveButton = styled.button`
  display: none;
  width: 20px;
  height: 18px;
  cursor: pointer;
  position: absolute;

  &:before,
  &:after {
    position: absolute;
    display: block;
    content: '';
    height: 15px;
    width: 2px;
    background-color: #333;
    top: 5px;
  }

  &:before {
    transform: rotate(45deg);
  }

  &:after {
    transform: rotate(-45deg);
  }
`;

const CardContainer = styled.div`
  perspective: 1000px;
  ${CARD_STYLES}
`;

const CardContainerInner = styled.div<{ isOpen: boolean }>`
  transition: all 0.6s ease-in-out;
  transform-style: preserve-3d;
  position: relative;

  ${({ isOpen }) => (isOpen ? 'transform: rotateY(180deg);' : '')}
`;

const CardFront = styled.div<{ isReady: boolean }>`
  background: ${({ theme, isReady }) =>
    isReady ? theme.colors.blue : theme.colors.green};
  z-index: 2;
  /* for firefox 31 */
  transform: rotateY(0deg);
  ${CARD_STYLES}
  ${FRONT_BACK_CARD_STYLES}
`;

const CardBack = styled.div<{
  isOpen: boolean;
  isLowest: boolean;
  isHighest: boolean;
  isSmall: boolean;
}>`
  background-color: ${({ theme, isOpen, isLowest, isHighest }) =>
    isOpen
      ? theme.colors.blue
      : isLowest
      ? theme.colors.green
      : isHighest
      ? theme.colors.red
      : theme.colors.red};
  transform: rotateY(180deg);
  ${CARD_STYLES}
  ${FRONT_BACK_CARD_STYLES}

  ${({ isSmall }) => (isSmall ? 'font-size: 16px' : '')};
`;
