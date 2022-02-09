import styled from '@emotion/styled';
import { Member, useMember } from './apiHooks';
import { Flex } from '../elements/Flex';
import { borderRadius } from '../theme/borderRadius';
import { FiX } from 'react-icons/fi';

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

  return (
    <Flex css={{ justifyContent: 'center' }}>
      {members.length > 0 && (
        <CardList>
          {sortedMembers.map((member, index) => {
            return (
              <Card key={index}>
                <CardName>
                  <CardNameInner>{member.name}</CardNameInner>
                  {currentMember?.id !== member.id && (
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
                    <CardBack
                      isOpen={isOpen}
                      isSmall={!!member.card && member.card.length > 3}
                      dangerouslySetInnerHTML={{
                        __html: member.card || '',
                      }}
                    />
                  </CardContainerInner>
                </CardContainer>
              </Card>
            );
          })}
        </CardList>
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
`;

const CardRemoveButton = styled(FiX)`
  display: none;
  cursor: pointer;
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
  isSmall: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.blue};
  transform: rotateY(180deg);
  ${CARD_STYLES}
  ${FRONT_BACK_CARD_STYLES}

  ${({ isSmall }) => (isSmall ? 'font-size: 16px' : '')};
`;
