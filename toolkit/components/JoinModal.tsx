import { useEffect, useState } from 'react';
import { Modal } from './Modal';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { COOKIE_OPTIONS } from './constants';
import {
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
import { FiCheck, FiX } from 'react-icons/fi';
import { ComponentWithTooltip } from './ComponentWithTooltip';
import { useTranslation } from 'next-i18next';
import { useCreateMember } from '../hooks/useCreateMember';
import { useTeam } from '../hooks/useTeam';
import { useSupabaseContext } from '../context/SupabaseProvider';

type FormFields = { teamId: string; member: string };

type JoinModalProps = {
  title: string;
  preventClosing?: boolean;
};

export const JoinModal: React.FC<JoinModalProps> = ({
  title,
  preventClosing,
}) => {
  const { t } = useTranslation(['common']);

  const router = useRouter();

  const { showJoinModal, setShowJoinModal } = useSupabaseContext();

  const [team, teamIsLoading, _, fetchTeam] = useTeam();

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    formState: { isValid },
    watch,
  } = useForm<FormFields>({});

  const [showTeamExistsBadge, setShowTeamExistsBadge] = useState(false);
  const handleBlurTeamId = () => {
    setShowTeamExistsBadge(true);
    fetchTeam(teamIdInternal);
  };

  const { createMember, memberCreating } = useCreateMember();

  const teamIdInternal = watch('teamId');

  useEffect(() => {
    if (!team) return;

    setValue('teamId', team.id);
  }, [team, setValue]);

  const onJoinTeam = async (data: FormFields) => {
    if (!data.teamId) return;

    const [member, error] = await createMember({
      name: data.member,
      teamId: data.teamId,
    });

    if (!member || error) {
      return;
    }

    setCookie(null, 'teamId', data.teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', member.id, COOKIE_OPTIONS);

    router.push({
      pathname: '/team' + '/' + data.teamId,
    });
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
              <FormLabel>{t('teamId')}</FormLabel>
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
              <FormLabel>{t('memberName')}</FormLabel>
              <Input
                {...register('member', { required: true, minLength: 3 })}
                data-testid='member-name-input'
              />
            </Grid>

            <VStack gap={2}>
              <Button
                variant='solid'
                type='submit'
                isDisabled={!isValid || !team}
                isLoading={memberCreating}
                data-testid='join-button'
                colorScheme='green'
              >
                {t('joinButton')}
              </Button>

              <Button variant='ghost' onClick={handleClose}>
                {t('cancelButton')}
              </Button>
            </VStack>
          </VStack>
        </form>
      </VStack>
    </Modal>
  );
};
