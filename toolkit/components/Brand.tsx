import { Heading } from '@chakra-ui/react';
import styled from '@emotion/styled';

const LOGO_STYLES = `
display: inline-block;
font-family: 'Monoton', cursive;
font-weight: normal;
color: #395B64;
background: linear-gradient(to right, #395B64 0%, #A5C9CA 50%, #395B64 100%);
background-clip: text;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
`;

type LogoProps = {
  text?: string;
};

export const Logo: React.FC<LogoProps> = ({ text }) => {
  return (
    <Heading
      as='h1'
      size='xl'
      textAlign='center'
      fontSize='48px'
      sx={{
        LOGO_STYLES,
      }}
    >
      {text ? text : 'POOMA'}
    </Heading>
  );
};

export const LogoTitle = styled.h3`
  ${LOGO_STYLES};

  grid-column-start: 1;
  margin-right: auto;
  font-size: 25px;
  cursor: pointer;
`;
