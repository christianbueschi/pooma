import styled from '@emotion/styled';
import { Member, useMember } from './apiHooks';
import { Flex } from '../elements/Flex';
import { borderRadius } from '../theme/borderRadius';
import { FiX } from 'react-icons/fi';
import { Body, BodyBig } from '../elements/Body';
import { Info } from '../elements/Form';
import { Router, useRouter } from 'next/router';
import { NextRequest } from 'next/server';
import { NextPageContext } from 'next';
import { ShareLink } from './ShareLink';
import { useState } from 'react';

type TeamCardsProps = {
  members: Member[];
  isOpen: boolean;
  onRemove: (member: Member) => void;
};

export const TeamCards: React.FC<TeamCardsProps> = ({
  members,
  isOpen,
  onRemove,
}) => {
  const sortedMembers = members.sort((a, b) => (a.name > b.name ? 1 : -1));

  const [currentMember] = useMember();

  // filter out spectactors
  const filteredMembers = sortedMembers.filter(
    (member) => !member.spectactorMode
  );

  const isCurrentUserOnlyMember =
    filteredMembers.length === 1 &&
    filteredMembers[0].name_lowercase === currentMember?.name_lowercase;

  const [highestCard, setHighestCard] = useState<number>();
  const [lowestCard, setLowestCard] = useState<number>();
  const [average, setAverage] = useState<number>();

  const calculateStats = () => {
    const cards: number[] = [];
    filteredMembers.forEach((member) => {
      // @ts-ignore
      if (member.card && isNaN(member.card)) return;
      cards.push(Number(member.card));
    });
    const sortedCards = cards.sort((a, b) => (a < b ? 1 : -1));

    setHighestCard(sortedCards[0]);
    setLowestCard(sortedCards[cards.length - 1]);

    const average = (sortedCards[0] + sortedCards[cards.length - 1]) / 2;
  };

  const isMe = (member: Member) => currentMember?.id === member.id;

  return (
    <Flex css={{ justifyContent: 'center', alignItems: 'center' }}>
      {filteredMembers.length > 0 ? (
        <CardList>
          {filteredMembers.map((member, index) => {
            return (
              <Card key={index}>
                <CardName>
                  <CardNameInner>
                    {member.name} {isMe(member) ? '(Me)' : ''}
                  </CardNameInner>
                  {!isMe(member) && (
                    <CardRemoveButton
                      size={16}
                      onClick={() => onRemove(member)}
                    />
                  )}
                </CardName>
                <CardContainer>
                  <CardContainerInner isOpen={isOpen}>
                    <CardFront isReady={!!member.card}>
                      <span>{member.card ? 'Ready' : '?'}</span>
                    </CardFront>
                    <CardBack isOpen={isOpen}>
                      {!!member.card && member.card.length > 3 ? (
                        <Body
                          dangerouslySetInnerHTML={{
                            __html: member.card || '',
                          }}
                        />
                      ) : (
                        <BodyBig
                          dangerouslySetInnerHTML={{
                            __html: member.card || '',
                          }}
                        />
                      )}
                    </CardBack>
                  </CardContainerInner>
                </CardContainer>
              </Card>
            );
          })}
        </CardList>
      ) : (
        <Flex gap={8} css={{ alignItems: 'center' }}>
          <Body>
            No players here. That's sad 😢. Quick, go and invite others..
          </Body>
          <ShareLink />
        </Flex>
      )}
      {isCurrentUserOnlyMember && (
        <Flex gap={8} css={{ alignItems: 'center' }}>
          <Body>
            Quite boring to play alone 😪 don't you think? Quick, go and invite
            others..
          </Body>
          <ShareLink />
        </Flex>
      )}
    </Flex>
  );
};

export const CARD_STYLES = `
  width: 120px;
  height: 150px;
  border-radius: ${borderRadius[8]};
`;

const FRONT_BACK_CARD_STYLES = `
padding: 1rem;
backface-visibility: hidden;
position: absolute;
top: 0;
left: 0;
display: flex;
flex-direction: column;
color: white;
align-items: center;
justify-content: center;
font-size: 22px;
box-shadow: 0px 5px 20px -5px rgb(0, 0, 0);
`;

const CardList = styled.ul`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => `${theme.spacings[16]} ${theme.spacings[24]}`};
  padding-left: 0;
  padding-bottom: 2rem;
`;

const Card = styled.li`
  display: flex;
  gap: ${({ theme }) => theme.spacings[8]};
  width: 120px;
  flex-direction: column;
  list-style: none;
  text-align: center; // center text with ellispis
`;

const CardName = styled.h4`
  color: ${({ theme }) => theme.colors.grey60};
  position: relative;
  margin: 0;
  text-transform: capitalize;

  &:hover {
    svg {
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
  line-height: 22px;
`;

const CardRemoveButton = styled(FiX)`
  display: none;
  cursor: pointer;
  position: absolute;
  top: 4px;
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
}>`
  background-color: ${({ theme }) => theme.colors.blue};
  transform: rotateY(180deg);
  ${CARD_STYLES}
  ${FRONT_BACK_CARD_STYLES}

  em {
    font-size: 42px;
  }
`;
