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
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { colors } from '../theme/colors';
import { useScrollPosition } from '../hooks/useScrollPosition';
import { useTranslation } from 'next-i18next';
import { useUpdateMemberMutations } from '../hooks/useUpdateMemberMutations';
import { useTeam } from '../hooks/useTeam';
import { useMember } from '../hooks/useMember';
import { useSupabaseContext } from '../context/SupabaseProvider';

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

  const [team] = useTeam();
  const [member] = useMember();

  const { setTeamId, setMemberId } = useSupabaseContext();

  const isTeamSet = team?.id;
  const isMemberSet = member?.id;

  const handleLogout = async () => {
    await router.push('/');

    setTeamId(undefined);
    setMemberId(undefined);

    location.reload();
  };

  const [mutateMember] = useUpdateMemberMutations();

  const handleToggleSpectactoreMode = (event: any) => {
    if (!team || !member) return;

    mutateMember({
      id: member.id,
      isSpectactorMode: event.currentTarget.checked,
    });
  };

  const backgrounColor = useColorModeValue('white.400', 'grey.400');

  const scrollPosition = useScrollPosition();

  return (
    <Grid
      templateColumns=' 1fr auto 1fr'
      columnGap={2}
      minH='66px'
      padding={[4]}
      justifyItems='center'
      w='100%'
      position='sticky'
      top={0}
      bg={scrollPosition > 30 ? backgrounColor : 'transparent'}
      transition='background 0.3s ease-in-out'
      zIndex={999999}
    >
      {!isHome && <LogoTitle onClick={onClickLogo}>{t('title')}</LogoTitle>}

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
              <FiMoon onClick={toggleColorMode} cursor='pointer' />
            </HStack>
          </HStack>
        </HStack>
      </GridItem>
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
