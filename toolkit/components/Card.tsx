import styled from '@emotion/styled';
import { Body } from '../elements/Body';
import { borderRadius } from '../theme/borderRadius';
import { CARD_STYLES } from './TeamCards';

type CardProps = {
  card: string;
  activeCard?: string;
  isLocked: boolean;
  onClick: (card: string) => void;
};

export const Card: React.FC<CardProps> = ({
  card,
  activeCard,
  isLocked,
  onClick,
}) => {
  const isActiveCard = card === activeCard;

  return (
    <StyledCard
      onClick={() => onClick(card)}
      isActiveCard={isActiveCard}
      isLocked={isLocked}
      data-testid='card'
    >
      <CardTitle
        isSmall={card.length > 3}
        dangerouslySetInnerHTML={{ __html: card }}
      />
    </StyledCard>
  );
};

const StyledCard = styled.li<{ isActiveCard: boolean; isLocked: boolean }>`
  height: 150px;
  border-radius: ${borderRadius[8]};
  list-style: none;
  background: ${({ theme, isActiveCard, isLocked }) =>
    isActiveCard ? theme.colors.blue : theme.colors.green};
  cursor: ${({ isLocked }) => (isLocked ? 'not-allowed' : 'pointer')};
  transition: transform 0.25s ease-in-out;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacings[12]};
  text-align: center;

  &:before {
    // content: '';
    // padding-bottom: 100%;
  }

  &:hover {
    transform: ${({ isLocked }) => (isLocked ? 'scale(1)' : 'scale(1.08)')};
  }
`;

const CardTitle = styled(Body)<{ isSmall: boolean }>`
  ${({ isSmall }) =>
    isSmall
      ? `
        font-size: 16px;
        line-height: 20px;
    `
      : `
        font-size: 22px;
        line-height: 26px;
  `}

  em {
    font-size: 42px;
  }
`;
