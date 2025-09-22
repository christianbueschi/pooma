'use client';

import { FiUser, FiUsers } from 'react-icons/fi';
import { LogoTitle } from './Brand';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Grid, GridItem, HStack, Text } from '@chakra-ui/react';
import { useTheme } from 'next-themes';
import { useSelect } from '../hooks/useSelect';
import { useEffect, useRef } from 'react';
import { destroyCookie, parseCookies } from 'nookies';
import { Member, Team } from '../types';
import { teamSelectProps } from '../constants';
import { COOKIE_OPTIONS } from './constants';
import { StickyHeader } from './StickyHeader';
import { ColorModeButton } from '../../components/ui/color-mode';

type HeaderProps = {
  isHome?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ isHome }) => {
  const router = useRouter();
  const params = useParams();
  const { theme, setTheme } = useTheme();

  const toggleColorMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const onClickLogo = () => {
    router.push('/');
  };

  const teamId = params.teamId as string;

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

    router.push('/');
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
        {!isHome && <LogoTitle onClick={onClickLogo}>Pooma</LogoTitle>}

        <GridItem as='nav' gridColumnStart={3} marginLeft='auto'>
          <HStack alignItems='center'>
            <HStack alignItems='center'>
              {isTeamSet && (
                <HStack gap={24} alignItems='center'>
                  <Link href={`/team/${team.id}`} passHref>
                    <Button variant='ghost'>
                      <FiUsers size='24px' />
                      <Text display={['none', 'block']}>{team?.name}</Text>
                    </Button>
                  </Link>
                </HStack>
              )}
              {isMemberSet && (
                <HStack gap={2}>
                  <Button
                    variant='ghost'
                    data-testid='user-context-menu-button'
                  >
                    <FiUser color='green.500' size='24px' />
                    <Text display={['none', 'block']} truncate maxW={130}>
                      {member?.name}
                    </Text>
                  </Button>
                  <Button
                    onClick={handleLogout}
                    data-testid='logout-button'
                    variant='ghost'
                  >
                    Logout
                  </Button>
                </HStack>
              )}
              <HStack>
                <ColorModeButton />
              </HStack>
            </HStack>
          </HStack>
        </GridItem>
      </Grid>
    </StickyHeader>
  );
};
