import Link from 'next/link';
import { useState } from 'react';
import { api } from '../api/api';
import { Member, useTeam } from '../api/apiHooks';
import { Modal } from './Modal';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { COOKIE_OPTIONS } from './constants';
import {
  Box,
  Button,
  Flex,
  FormLabel,
  Grid,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';

type JoinModalProps = {
  title: string;
  isOpen: boolean;
  teamId?: string;
  preventClosing: boolean;
  handleClose?: () => void;
};

export const JoinModal: React.FC<JoinModalProps> = (props) => {
  const [team, teamIsLoading, error] = useTeam();
  const [teamId, setTeamId] = useState(props.teamId);
  const [memberName, setMemberName] = useState('');
  const [existingMember, setExistingMember] = useState<Member>();
  const [teamError, setTeamError] = useState('');

  const router = useRouter();

  const onJoinTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!teamId) return;

    // reroute to new teamId path if it doesn't exists
    const teamExists = await api.doesTeamExists(teamId);

    if (!teamExists) {
      setTeamError(
        `Sorry, but we couldn't find the team <b>${teamId}</b>. <br> Please try a different team or create a new one.`
      );
      return;
    }

    setTeamError('');

    // Otherwise we can try to add the member
    const memberRes = await api.addMember(teamId, memberName);

    if (memberRes.type === 'EXISTING') {
      setExistingMember(memberRes.member);
      return;
    }

    setCookie(null, 'teamId', teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', memberRes.member.id, COOKIE_OPTIONS);

    router.push('/team' + '/' + teamId);
  };

  const loginAs = (memberId: string) => {
    if (!teamId) return;
    setCookie(null, 'teamId', teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', memberId);
    router.push(`team/${teamId}`);
  };

  const handleClose = () => {
    setTeamError('');
    setTeamId(undefined);
    setMemberName('');
    setExistingMember(undefined);

    props.handleClose && props.handleClose();
  };

  return (
    <Modal
      title={props.title}
      handleClose={handleClose}
      isOpen={props.isOpen}
      preventClosing={props.preventClosing}
    >
      <VStack gap={8}>
        {(teamError || error) && (
          <Box p={4} backgroundColor='red.400' borderRadius='8px'>
            <Text dangerouslySetInnerHTML={{ __html: teamError || error }} />
          </Box>
        )}

        {existingMember && (
          <Flex gap={8}>
            <Box backgroundColor='blue.500' borderRadius='8px'>
              <Text
                color='white'
                dangerouslySetInnerHTML={{
                  __html: `The member <b>${existingMember.name}</b> already exists.`,
                }}
                backgroundColor='#ffffff20'
                p={4}
              />
              <VStack gap={4} alignItems='start' p={4}>
                <Text color='white'>
                  Is this you? Then you can just login. Otherwise please use a
                  different name.
                </Text>
                <Button
                  onClick={() => loginAs(existingMember.id)}
                  alignSelf='end'
                >
                  Login as {existingMember.name}
                </Button>
              </VStack>
            </Box>
          </Flex>
        )}

        <form onSubmit={onJoinTeam}>
          <VStack gap={12}>
            <Grid templateColumns='1fr 2fr' gridGap={2} alignItems='center'>
              <FormLabel>Team ID</FormLabel>
              <Input
                type='text'
                value={teamId}
                onChange={(ev) => setTeamId(ev.currentTarget.value)}
                data-testid='team-name-input'
              />
              <FormLabel>Member Name</FormLabel>
              <Input
                type='text'
                value={memberName}
                onChange={(ev) => setMemberName(ev.currentTarget.value)}
                data-testid='member-name-input'
              />
            </Grid>

            <VStack gap={2}>
              <Button
                variant='solid'
                type='submit'
                onClick={onJoinTeam}
                isDisabled={!teamId || !memberName}
                data-testid='join-button'
                colorScheme='green'
              >
                Join Game
              </Button>
              {/* {teamId && ( */}
              <Link href='/' passHref>
                <a onClick={handleClose}>
                  <Text>Start over</Text>
                </a>
              </Link>
              {/* )} */}
            </VStack>
          </VStack>
        </form>
      </VStack>
    </Modal>
  );
};
