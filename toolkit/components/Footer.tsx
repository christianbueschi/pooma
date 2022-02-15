import styled from '@emotion/styled';
import Link from 'next/link';
import { Body } from '../elements/Body';
import { Flex } from '../elements/Flex';
import { colors } from '../theme/colors';

export const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <Flex horizontal gap={24} css={{ justifyContent: 'flex-end' }}>
        {/* <Body>pooma App</Body> */}
        <Link
          href="mailto:hello@pooma.app?subject=Missing feature&amp;body=Hi, I'm missing the following feature:"
          passHref
        >
          <a css={{ color: colors.white, textDecoration: 'none' }}>
            <Body>Missing a feature?</Body>
          </a>
        </Link>
        <Link href='mailto:hello@pooma.app' passHref>
          <a css={{ color: colors.white, textDecoration: 'none' }}>
            <Body>hello@pooma.app</Body>
          </a>
        </Link>
        <Link href='/privacy' passHref>
          <a css={{ color: colors.white, textDecoration: 'none' }}>
            <Body>Privacy Policy</Body>
          </a>
        </Link>
      </Flex>
    </StyledFooter>
  );
};

const StyledFooter = styled.footer`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.blue};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacings[12]};
`;
