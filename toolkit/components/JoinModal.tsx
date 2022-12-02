import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Modal } from './Modal';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { COOKIE_OPTIONS } from './constants';
import {
  Box,
  Button,
  FormLabel,
  Grid,
  Input,
  InputGroup,
  InputRightAddon,
  Spinner,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { trpc } from '../../src/utils/trpc';
import { useTeam } from '../hooks/useTeam';
import { FiCheck, FiX } from 'react-icons/fi';
import { ComponentWithTooltip } from './ComponentWithTooltip';

type FormFields = { teamId: string; member: string };

type JoinModalProps = {
  title: string;
  isOpen: boolean;
  teamId?: string;
  preventClosing: boolean;
  handleClose?: () => void;
};

export const JoinModal: React.FC<JoinModalProps> = ({
  title,
  isOpen,
  teamId,
  preventClosing,
  handleClose,
}) => {
  const [teamError, setTeamError] = useState('');

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { isValid },
  } = useForm<FormFields>({
    defaultValues: {
      teamId: teamId || '',
    },
  });

  const memberMutation = trpc.createMember.useMutation();

  const [teamIdInternal, setTeamIdInternal] = useState(getValues().teamId);

  const [team, teamIsLoading, refetch, error] = useTeam({ id: teamIdInternal });

  const [showTeamExistsBadge, setShowTeamExistsBadge] = useState(false);
  const handleBlurTeamId = () => {
    setTeamIdInternal(getValues().teamId);
    setShowTeamExistsBadge(true);
  };

  useEffect(() => {
    refetch();
  }, [teamIdInternal, refetch]);

  const onJoinTeam = async (data: FormFields) => {
    if (!data.teamId) return;

    const newMember = await memberMutation.mutateAsync({
      teamId: data.teamId,
      name: data.member,
    });

    setTeamError('');

    setCookie(null, 'teamId', data.teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', newMember.id, COOKIE_OPTIONS);

    router.push('/team' + '/' + data.teamId);
  };

  useEffect(() => {
    if (!team) return;

    setValue('teamId', team.id);
  }, [team, setValue]);

  const onClose = () => {
    setValue('teamId', '');
    setValue('member', '');

    if (handleClose) handleClose();
  };

  const memberRef = useRef<HTMLInputElement>(null);
  teamId && memberRef.current?.focus();

  return (
    <Modal
      title={title}
      onClose={onClose}
      isOpen={isOpen}
      preventClosing={preventClosing}
    >
      <VStack gap={8}>
        {(teamError || error) && (
          <Box p={4} backgroundColor='red.400' borderRadius='8px'>
            <Text
              dangerouslySetInnerHTML={{ __html: teamError || error || '' }}
            />
          </Box>
        )}

        <form onSubmit={handleSubmit(onJoinTeam)}>
          <VStack gap={12}>
            <Grid templateColumns='1fr 2fr' gridGap={2} alignItems='center'>
              <FormLabel>Team ID</FormLabel>
              <InputGroup>
                <Input
                  {...register('teamId', { required: true })}
                  data-testid='team-name-input'
                  onBlur={handleBlurTeamId}
                />
                {(showTeamExistsBadge || team) && (
                  <InputRightAddon
                    bg={
                      teamIsLoading
                        ? 'grey.400'
                        : team
                        ? 'green.400'
                        : 'red.400'
                    }
                  >
                    {teamIsLoading ? (
                      <Spinner color='white' size='sm' />
                    ) : team ? (
                      <FiCheck color='white' />
                    ) : (
                      <Tooltip label='No team found'>
                        <ComponentWithTooltip>
                          <FiX color='white' />
                        </ComponentWithTooltip>
                      </Tooltip>
                    )}
                  </InputRightAddon>
                )}
              </InputGroup>
              <FormLabel>Member Name</FormLabel>
              <Input
                {...register('member', { required: true, minLength: 3 })}
                ref={memberRef}
                data-testid='member-name-input'
              />
            </Grid>

            <VStack gap={2}>
              <Button
                variant='solid'
                type='submit'
                isDisabled={!isValid || !team}
                isLoading={memberMutation.isLoading}
                data-testid='join-button'
                colorScheme='green'
              >
                Join Game
              </Button>

              <Link href='/' passHref>
                <Text onClick={handleClose}>Cancel</Text>
              </Link>
            </VStack>
          </VStack>
        </form>
      </VStack>
    </Modal>
  );
};
