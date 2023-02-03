import styled from '@emotion/styled';
import { FiUser, FiUsers, FiMoon } from 'react-icons/fi';
import { LogoTitle } from './Brand';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import {
  Button,
  Grid,
  GridItem,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react';
import { colors } from '../theme/colors';
import { useTranslation } from 'next-i18next';
import { useSelect } from '../hooks/useSelect';
import { useEffect, useRef } from 'react';
import { destroyCookie, parseCookies } from 'nookies';
import { Member, Team } from '../types';
import { teamSelectProps } from '../constants';
import { useUpdate } from '../hooks/useUpdate';
import { COOKIE_OPTIONS } from './constants';
import { StickyHeader } from './StickyHeader';

type HeaderProps = {
  isHome?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isHome }) => {
  const { t } = useTranslation(['common']);

  const router = useRouter();

  const { toggleColorMode } = useColorMode();

  const onClickLogo = () => {
    router.push('/');
  };

  const teamId = router.query.teamId as string;

  const cookies = parseCookies();

  const filter = useRef({
    prop: 'id',
    operator: 'eq',
    value: teamId || cookies.teamId,
  });

  const [teams] = useSelect<Team>('teams', {
    props: teamSelectProps,
    filter: filter.current,
  });

  const team = teams?.[0];

  const memberFilter = useRef({
    prop: 'id',
    operator: 'eq',
    value: cookies.memberId,
  });

  useEffect(() => {
    if (!cookies.memberId) return;

    memberFilter.current = {
      prop: 'id',
      operator: 'eq',
      value: cookies.memberId,
    };
  }, [cookies.memberId]);

  const [members] = useSelect<Member>('members', {
    filter: memberFilter.current,
  });

  const member = members?.[0];

  const isTeamSet = team?.id;
  const isMemberSet = member?.id;

  const handleLogout = async () => {
    destroyCookie(null, 'teamId', COOKIE_OPTIONS);
    destroyCookie(null, 'memberId', COOKIE_OPTIONS);

    if (router.pathname === '/') {
      location.reload();
    }

    await router.push('/');
  };

  const [updateMember] = useUpdate<Member>('members');

  const handleToggleSpectactoreMode = (event: any) => {
    if (!team || !member) return;

    updateMember({
      id: member.id,
      isSpectactorMode: event.currentTarget.checked,
    });
  };

  return (
    <StickyHeader>
      <Grid
        templateColumns=' 1fr auto 1fr'
        columnGap={2}
        padding={[4]}
        justifyItems='center'
        w='100%'
      >
        {!isHome && <LogoTitle onClick={onClickLogo}>{t('title')}</LogoTitle>}

        <GridItem as='nav' gridColumnStart={3} marginLeft='auto'>
          <HStack alignItems='center'>
            <HStack alignItems='center'>
              {isTeamSet && (
                <HStack gap={24} alignItems='center'>
                  <Link href={`/team/${team.id}`} passHref>
                    <Button variant='ghost' leftIcon={<FiUsers size='24px' />}>
                      <Text display={['none', 'block']}>{team?.name}</Text>
                    </Button>
                  </Link>
                </HStack>
              )}
              {isMemberSet && (
                <Menu>
                  <MenuButton
                    as={Button}
                    variant='ghost'
                    leftIcon={<FiUser color='green.500' size='24px' />}
                    data-testid='user-context-menu-button'
                  >
                    <Text display={['none', 'block']}>{member?.name}</Text>
                  </MenuButton>
                  <MenuList p={4} border='none'>
                    <VStack gap={4} alignItems='flex-start'>
                      {!isHome && (
                        <>
                          <HStack as='label' gap={2} alignItems='center'>
                            <StyledToggle
                              defaultChecked={member?.isSpectactorMode || false}
                              onChange={handleToggleSpectactoreMode}
                            />
                            <Text>{t('spectactorMode')}</Text>
                          </HStack>
                        </>
                      )}
                      <Button
                        onClick={handleLogout}
                        data-testid='logout-button'
                        alignSelf='flex-end'
                      >
                        {t('logout')}
                      </Button>
                    </VStack>
                  </MenuList>
                </Menu>
              )}
              <HStack>
                <Button variant='ghost' onClick={toggleColorMode}>
                  <FiMoon />
                </Button>
              </HStack>
            </HStack>
          </HStack>
        </GridItem>
      </Grid>
    </StickyHeader>
  );
};

const StyledToggle = styled(Toggle)`
  .react-toggle-track {
    background-color: ${colors.green[400]};
  }

  &.react-toggle--checked .react-toggle-track {
    background-color: ${colors.green[400]};

    &:hover {
      background-color: ${colors.green[400]};
    }
  }
`;
