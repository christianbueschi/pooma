import styled from '@emotion/styled';
import { destroyCookie } from 'nookies';
import { useMember, useTeam } from './apiHooks';
import { Flex } from '../elements/Flex';
import { FiUser, FiExternalLink } from 'react-icons/fi';
import { LogoTitle } from '../elements/Title';
import { useRouter } from 'next/router';
import { Body } from '../elements/Body';
import { Button, LINK_STYLES } from '../elements/Button';
import Link from 'next/link';
import { ContextNav } from './ContextNav';
import { colors } from '../theme/colors';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { api } from './api';
import { Modal } from './Modal';
import { ShareLink } from './ShareLink';

type HeaderProps = {
  isHome?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isHome }) => {
  const [team] = useTeam();
  const [member] = useMember();

  const router = useRouter();

  const onClickLogo = () => {
    router.push('/');
  };

  const isTeamSet = team?.id;

  const handleLogout = () => {
    destroyCookie(null, 'teamId');
    destroyCookie(null, 'memberId');
    router.push('/');
  };

  const handleToggleSpectactoreMode = (event: any) => {
    if (!team || !member) return;

    api.updateMember(team?.id, member?.id, {
      spectactorMode: event.currentTarget.checked,
    });
  };

  const handleMemberRemovedModalOk = () => {
    destroyCookie(null, 'teamId');
    destroyCookie(null, 'memberId');
    router.push('/');
  };

  return (
    <StyledHeader>
      {!isHome && <LogoTitle onClick={onClickLogo}>POOMA</LogoTitle>}

      <StyledNav>
        <Flex horizontal css={{ alignItems: 'center' }} gap={24}>
          <Flex
            horizontal
            css={{ alignItems: 'center', position: 'relative' }}
            gap={4}
          >
            {isTeamSet && (
              <Flex gap={24} horizontal css={{ alignItems: 'center' }}>
                <Link href={`/team/${team.id}`} passHref>
                  <Flex horizontal css={{ alignItems: 'center' }} gap={4}>
                    <FiExternalLink color={colors.green} size='32px' />
                    <StyledLink>{team?.name}</StyledLink>
                  </Flex>
                </Link>
              </Flex>
            )}
            <ContextNav
              TriggerComponent={
                <StyledIconButton>
                  <Flex horizontal css={{ alignItems: 'center' }} gap={4}>
                    <FiUser color={colors.green} size='32px' />
                    <Body
                      css={{ color: colors.green, textTransform: 'capitalize' }}
                      ellipsis
                    >
                      {member?.name}
                    </Body>
                  </Flex>
                </StyledIconButton>
              }
            >
              <Flex gap={24}>
                <Flex
                  as='label'
                  horizontal
                  gap={8}
                  css={{ alignItems: 'center' }}
                >
                  <StyledToggle
                    defaultChecked={member?.spectactorMode}
                    onChange={handleToggleSpectactoreMode}
                  />
                  <Body css={{ color: 'white' }}>Spectactor Mode</Body>
                </Flex>
                <Flex gap={8}>
                  <Body css={{ color: colors.white }} as='label'>
                    Invite others:
                  </Body>
                  <ShareLink inverse />
                </Flex>
                <StyledLinkButton variant='link' onClick={handleLogout}>
                  Logout
                </StyledLinkButton>
              </Flex>
            </ContextNav>
          </Flex>
        </Flex>
      </StyledNav>
      {member?.state === 'removed' && (
        <Modal title='You have been removed'>
          <Body css={{ textAlign: 'center' }}>
            You have been removed from the team <b>{team?.name}</b>.
          </Body>
          <Flex gap={8}>
            <Button variant='solid' onClick={handleMemberRemovedModalOk}>
              Ok
            </Button>
          </Flex>
        </Modal>
      )}
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-column-gap: 5px;
  justify-items: center;
  padding: ${({ theme }) => theme.spacings[16]};
  min-height: 66px;
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
  justify-content: start;

  &:hover {
    color: ${({ theme }) => theme.colors.green};
    text-decoration: underline;
  }
`;

export const StyledLink = styled.a`
  padding: ${LINK_STYLES.default.padding};

  border: none;
  text-transform: capitalize;

  color: ${LINK_STYLES.default.color};
  cursor: pointer;
  /* text-decoration: none; */

  &:hover {
    text-decoration: underline;
  }
`;

const StyledToggle = styled(Toggle)`
  .react-toggle-track {
    background-color: ${({ theme }) => theme.colors.grey40};
  }

  &.react-toggle--checked .react-toggle-track {
    background-color: ${({ theme }) => theme.colors.green};

    &:hover {
      background-color: ${({ theme }) => theme.colors.greenDark};
    }
  }
`;
