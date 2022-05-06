import styled from '@emotion/styled';

export const LOGO_STYLES = `
display: inline-block;
font-family: 'Monoton', cursive;
font-weight: normal;
color: #324d5c;
background: linear-gradient(to right, #324d5c 0%, #46b29d 50%, #324d5c 100%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
`;

export const Title = styled.h1`
  grid-column-start: 2;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  color: #324d5c;
  text-align: center;
  font-size: 25px;
  line-height: 32px;
  color: ${({ theme }) => theme.colors.blue};
  text-transform: capitalize;
`;

export const LogoTitle = styled.h3`
  ${LOGO_STYLES};

  grid-column-start: 1;
  margin-right: auto;
  font-size: 25px;
  cursor: pointer;
`;

export const MainTitle = styled.h1`
  ${LOGO_STYLES};

  text-align: center;
  font-size: 48px;
`;
