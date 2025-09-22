'use client';

import { Heading, Box } from '@chakra-ui/react';

const LOGO_STYLES = {
  display: 'inline-block',
  fontFamily: 'Monoton, cursive',
  fontWeight: 'normal',
  color: '#395B64',
  background:
    'linear-gradient(to right, #395B64 0%, #A5C9CA 50%, #395B64 100%)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textTransform: 'uppercase',
};

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
      lineHeight='1.2'
      css={LOGO_STYLES}
    >
      {text ? text : 'Pooma'}
    </Heading>
  );
};

type LogoTitleProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export const LogoTitle: React.FC<LogoTitleProps> = ({ children, onClick }) => {
  return (
    <Box
      as='h3'
      css={{
        ...LOGO_STYLES,
        gridColumnStart: 1,
        marginRight: 'auto',
        fontSize: '25px',
        cursor: 'pointer',
      }}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};
