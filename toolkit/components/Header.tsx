import styled from '@emotion/styled';
import { destroyCookie } from 'nookies';
import { useMember, useTeam } from '../api/apiHooks';
import { FiUser, FiExternalLink } from 'react-icons/fi';
import { LogoTitle } from '../elements/Title';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import { api } from '../api/api';
import { ShareLink } from './ShareLink';
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
  MenuItem,
  MenuList,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Modal } from './Modal';
import { colors } from '../theme/colors';

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

  const handleToggleSpectactoreMode = (event: any) => {
    if (!team || !member) return;

    api.updateMember(team?.id, member?.id, {
      spectactorMode: event.currentTarget.checked,
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
    >
      {!isHome && <LogoTitle onClick={onClickLogo}>POOMA</LogoTitle>}

      <GridItem as='nav' gridColumnStart={3} marginLeft='auto'>
        <HStack alignItems='center'>
          <HStack alignItems='center'>
            {isTeamSet && (
              <HStack gap={24} alignItems='center'>
                <Link href={`/team/${team.id}`} passHref>
                  <a>
                    <Button
                      variant='ghost'
                      colorScheme='green'
                      leftIcon={
                        <FiExternalLink color='green.500' size='24px' />
                      }
                    >
                      <Text>{team?.name}</Text>
                    </Button>
                  </a>
                </Link>
              </HStack>
            )}
            {isMemberSet && (
              <Menu>
                <MenuButton
                  as={Button}
                  variant='ghost'
                  colorScheme='green'
                  rightIcon={<FiUser color='green.500' size='24px' />}
                  data-testid='user-context-menu-button'
                >
                  <Text>{member?.name}</Text>
                </MenuButton>
                <MenuList backgroundColor='blue.700' p={4} border='none'>
                  <VStack gap={4} alignItems='flex-start'>
                    {!isHome && (
                      <>
                        <HStack as='label' gap={2} alignItems='center'>
                          <StyledToggle
                            defaultChecked={member?.spectactorMode}
                            onChange={handleToggleSpectactoreMode}
                          />
                          <Text color='white'>Spectactor Mode</Text>
                        </HStack>
                        <VStack gap={2}>
                          <ShareLink inverse />
                        </VStack>
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
          </HStack>
        </HStack>
      </GridItem>

      <Modal
        title='You have been removed'
        isOpen={member?.state === 'removed' && !isHome}
        handleClose={handleMemberRemovedModalOk}
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
    background-color: ${colors.grey[700]};
  }

  &.react-toggle--checked .react-toggle-track {
    background-color: ${colors.grey[700]};

    &:hover {
      background-color: ${colors.grey[700]};
    }
  }
`;
