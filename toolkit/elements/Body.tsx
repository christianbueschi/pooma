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

  b {
    font-weight: bold;
  }
`;

export const BodyBig = styled.p`
  font-size: 22px;
  line-height: 26px;
`;
