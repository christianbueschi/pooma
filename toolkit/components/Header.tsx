import styled from '@emotion/styled';
import { destroyCookie } from 'nookies';
import { FiUser, FiUsers, FiMoon } from 'react-icons/fi';
import { LogoTitle } from './Brand';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { COOKIE_OPTIONS } from './constants';
import {
  Box,
  Button,
  Flex,
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
import { Modal } from './Modal';
import { colors } from '../theme/colors';
import { trpc } from '../../src/utils/trpc';
import { Member, Team } from '@prisma/client';

type HeaderProps = {
  team?: Team | null;
  member?: Member | null;
  isHome?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ team, member, isHome }) => {
  const router = useRouter();

  const { toggleColorMode } = useColorMode();

  const onClickLogo = () => {
    router.push('/');
  };

  const isTeamSet = team?.id;
  const isMemberSet = member?.id;

  const handleLogout = () => {
    destroyCookie(null, 'teamId', COOKIE_OPTIONS);
    destroyCookie(null, 'memberId', COOKIE_OPTIONS);

    if (router.pathname === '/') {
      location.reload();
    } else {
      router.push('/');
    }
  };

  const memberMutation = trpc.updateMember.useMutation();

  const handleToggleSpectactoreMode = (event: any) => {
    if (!team || !member) return;

    memberMutation.mutateAsync({
      id: member.id,
      isSpectactorMode: event.currentTarget.checked,
    });
  };

  const handleMemberRemovedModalOk = () => {
    destroyCookie(null, 'teamId', COOKIE_OPTIONS);
    destroyCookie(null, 'memberId', COOKIE_OPTIONS);
    router.push('/');
  };

  return (
    <Grid
      templateColumns=' 1fr auto 1fr'
      columnGap={2}
      minH='66px'
      padding={4}
      justifyItems='center'
      w='100%'
      position='sticky'
      top={0}
    >
      {!isHome && <LogoTitle onClick={onClickLogo}>POOMA</LogoTitle>}

      <GridItem as='nav' gridColumnStart={3} marginLeft='auto'>
        <HStack alignItems='center'>
          <HStack alignItems='center'>
            {isTeamSet && (
              <HStack gap={24} alignItems='center'>
                <Link href={`/team/${team.id}`} passHref>
                  <Button variant='ghost' leftIcon={<FiUsers size='24px' />}>
                    <Text>{team?.name}</Text>
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
                  <Text>{member?.name}</Text>
                </MenuButton>
                <MenuList p={4} border='none'>
                  <VStack gap={4} alignItems='flex-start'>
                    {!isHome && (
                      <>
                        <HStack as='label' gap={2} alignItems='center'>
                          <StyledToggle
                            defaultChecked={member?.isSpectactorMode}
                            onChange={handleToggleSpectactoreMode}
                          />
                          <Text>Spectactor Mode</Text>
                        </HStack>
                      </>
                    )}
                    <Button
                      onClick={handleLogout}
                      data-testid='logout-button'
                      alignSelf='flex-end'
                    >
                      Logout
                    </Button>
                  </VStack>
                </MenuList>
              </Menu>
            )}
            <HStack>
              <FiMoon onClick={toggleColorMode} cursor='pointer' />
            </HStack>
          </HStack>
        </HStack>
      </GridItem>

      <Modal
        title='You have been removed'
        isOpen={member?.state === 'REMOVED' && !isHome}
        onClose={handleMemberRemovedModalOk}
      >
        <VStack gap={4}>
          <Text textAlign='center'>
            You have been removed from the team <b>{team?.name}</b>.
          </Text>
          <Button variant='solid' onClick={handleMemberRemovedModalOk}>
            Ok
          </Button>
        </VStack>
      </Modal>
    </Grid>
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
