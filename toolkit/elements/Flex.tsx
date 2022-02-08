import styled from '@emotion/styled';

type FlexProps = {
  horizontal?: boolean;
  gap?: 4 | 8 | 12 | 24 | 32 | 48;
};

export const Flex = styled.div<FlexProps>`
  display: flex;
  flex-direction: ${({ horizontal }) => (horizontal ? 'row' : 'column')};
  ${({ gap }) => (gap ? `gap: ${gap}px;` : '')}
`;
