import styled from '@emotion/styled';
import { useMember, useTeam } from './apiHooks';
import { Flex } from './elements/Flex';
import { FiSettings } from 'react-icons/fi';
import { FiUser } from 'react-icons/fi';
import { colors } from './theme/colors';
import { useRouter } from 'next/router';
import { LogoTitle, MainTitle, Title } from './elements/Title';
import { useState } from 'react';
import { Body } from './elements/Body';
import { Button, LINK_STYLES } from './elements/Button';
import Link from 'next/link';
import { ContextNav } from './ContextNav';

type HeaderProps = {
  isHome?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isHome }) => {
  const [team] = useTeam();
  const [member] = useMember();

  const [showUserNav, toggleUserNav] = useState(false);

  const router = useRouter();

  // const onClickSettings = () => {};

  const onClickLogo = () => {
    router.push('/');
  };

  const isTeamSet = team?.id;

  const handleLogout = () => {
    localStorage.removeItem('teamId');
    localStorage.removeItem('member');
    router.push('/');
  };

  return (
    <StyledHeader>
      {!isHome && (
        <>
          <LogoTitle onClick={onClickLogo}>POOMA</LogoTitle>
          <Title>{team?.name}</Title>
        </>
      )}

      <StyledNav>
        <Flex horizontal css={{ alignItems: 'center' }} gap={24}>
          <Flex
            horizontal
            css={{ alignItems: 'center', position: 'relative' }}
            gap={4}
          >
            <StyledIconButton onClick={() => toggleUserNav(!showUserNav)}>
              <Flex horizontal css={{ alignItems: 'center' }} gap={8}>
                <FiUser color={colors.green} size='32px' />
                <Body css={{ color: colors.green }} ellipsis>
                  {member?.name}
                </Body>
              </Flex>
            </StyledIconButton>
            {showUserNav && (
              <ContextNav handleClose={() => toggleUserNav(false)}>
                {isTeamSet ? (
                  <Flex gap={24}>
                    <Body css={{ color: colors.white }}>
                      Logged in to: <br />
                      <Link href={team?.id} passHref>
                        <StyledLink>{team?.name}</StyledLink>
                      </Link>
                    </Body>
                    <StyledLinkButton variant='link' onClick={handleLogout}>
                      Logout
                    </StyledLinkButton>
                  </Flex>
                ) : (
                  <Body css={{ color: colors.white }}>
                    You are not logged in yet: <br />
                    Start a new game or join one.
                  </Body>
                )}
              </ContextNav>
            )}
          </Flex>
          {/* <FiSettings
            color={colors.green}
            size='32px'
            onClick={onClickSettings}
          /> */}
        </Flex>
      </StyledNav>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-column-gap: 5px;
  justify-items: center;
  padding: ${({ theme }) => theme.spacings[16]};
`;

const StyledNav = styled.nav`
  grid-column-start: 3;
  margin-left: auto;
`;

const StyledIconButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const StyledLinkButton = styled(Button)`
  color: ${({ theme }) => theme.colors.green};
  font-size: 16px;
  text-align: left;

  &:hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: underline;
  }
`;

const StyledLink = styled.a`
  padding: ${LINK_STYLES.default.padding};
  font-size: 20px;
  border: none;

  color: ${LINK_STYLES.default.color};
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
