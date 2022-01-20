import styled from '@emotion/styled';

export const Body = styled.p<{ ellipsis?: boolean }>`
  font-size: 16px;
  line-height: 20px;

  ${({ ellipsis }) =>
    ellipsis
      ? `
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;`
      : ''};
`;

export const BodyBig = styled.p`
  font-size: 20px;
  line-height: 24px;
`;
