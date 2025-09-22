'use client';

import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import { useRouter, useParams } from 'next/navigation';
import {
  Button,
  Grid,
  Input,
  Spinner,
  Text,
  VStack,
  InputGroup,
  Box,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { FiCheck, FiX } from 'react-icons/fi';
import { useModalContext } from '../context/ModalProvider';
import { useSelect } from '../hooks/useSelect';
import { MemberInsert, Team } from '../types';
import { teamSelectProps } from '../constants';
import { setCookie } from 'nookies';
import { COOKIE_OPTIONS } from './constants';
import { useInsert } from '../hooks/useInsert';

type FormFields = { teamId: string; member: string };

type JoinModalProps = {
  title: string;
  preventClosing?: boolean;
};

export const JoinModal: React.FC<JoinModalProps> = ({
  title,
  preventClosing,
}) => {
  const router = useRouter();
  const params = useParams();

  const { showJoinModal, setShowJoinModal } = useModalContext();

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    getValues,
    formState: { isValid },
  } = useForm<FormFields>({
    defaultValues: {
      teamId: params.teamId as string,
    },
  });

  const filter = useRef({
    prop: 'id',
    operator: 'eq',
    value: getValues('teamId'),
  });

  const [teams, teamIsLoading] = useSelect<Team>('teams', {
    props: teamSelectProps,
    filter: filter.current,
  });

  const team = teams?.[0];

  const [showTeamExistsBadge, setShowTeamExistsBadge] = useState(false);

  const handleBlurTeamId = () => {
    setShowTeamExistsBadge(true);
    filter.current = { prop: 'id', operator: 'eq', value: getValues('teamId') };
  };

  const [createMember, memberCreating] = useInsert<MemberInsert>();

  useEffect(() => {
    if (!team) return;

    setValue('teamId', team.id);
  }, [team, setValue]);

  const onJoinTeam = async (data: FormFields) => {
    if (!data.teamId) return;

    const [member, error] = await createMember('members', {
      name: data.member,
      teamId: data.teamId,
    });

    if (!member?.id || error) {
      return;
    }

    setCookie(null, 'teamId', data.teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', member.id, COOKIE_OPTIONS);

    router.push('/team/' + data.teamId);
  };

  useEffect(() => {
    if (!team) return;

    setFocus('member');
  }, [team, setValue, setFocus]);

  const handleClose = () => {
    setShowJoinModal(false);
    router.push('/');
  };

  return (
    <Modal
      title={title}
      onClose={handleClose}
      isOpen={showJoinModal}
      preventClosing={preventClosing}
    >
      <VStack gap={8}>
        <Text>{team?.name}</Text>

        <form onSubmit={handleSubmit(onJoinTeam)}>
          <VStack gap={12}>
            <Grid templateColumns='1fr 2fr' gridGap={2} alignItems='center'>
              <Text as='label'>Team ID</Text>
              <InputGroup
                endElement={
                  showTeamExistsBadge || team ? (
                    <Box
                      bg={
                        teamIsLoading
                          ? 'grey.400'
                          : team
                          ? 'green.400'
                          : 'red.400'
                      }
                      px={3}
                      display='flex'
                      alignItems='center'
                      borderRightRadius='md'
                    >
                      {teamIsLoading ? (
                        <Spinner color='white' size='sm' />
                      ) : team ? (
                        <FiCheck color='white' />
                      ) : (
                        <FiX color='white' />
                      )}
                    </Box>
                  ) : undefined
                }
              >
                <Input
                  {...register('teamId', { required: true })}
                  data-testid='team-name-input'
                  onBlur={handleBlurTeamId}
                />
              </InputGroup>
              <Text as='label'>Member Name</Text>
              <Input
                {...register('member', { required: true, minLength: 3 })}
                data-testid='member-name-input'
              />
            </Grid>

            <VStack gap={2}>
              <Button
                variant='solid'
                type='submit'
                disabled={!isValid || !team}
                loading={memberCreating}
                data-testid='join-button'
                colorScheme='green'
              >
                Join
              </Button>

              <Button variant='ghost' onClick={handleClose}>
                Cancel
              </Button>
            </VStack>
          </VStack>
        </form>
      </VStack>
    </Modal>
  );
};
