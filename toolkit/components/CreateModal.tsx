import { Button, FormLabel, Grid, Input, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { Modal } from './Modal';
import { Controller, useForm } from 'react-hook-form';
import { Select } from 'chakra-react-select';
import { useTranslation } from 'next-i18next';
import { useCreateTeam } from '../hooks/useCreateTeam';
import { useCreateMember } from '../hooks/useCreateMember';
import { useSupabaseContext } from '../context/SupabaseProvider';

const CARD_MODE_OPTIONS = [
  { value: 'FIBONACCI', label: 'Fibonacci' },
  { value: 'TSHIRT', label: 'T-Shirt' },
];

export type CardMode = 'FIBONACCI' | 'TSHIRT';

type FormFields = {
  team: string;
  cardMode: CardMode;
  member: string;
  fdf: string;
};

type CreateModalProps = {
  handleClose: () => void;
  isOpen: boolean;
};

export const CreateModal: React.FC<CreateModalProps> = ({
  handleClose,
  isOpen,
}) => {
  const { t } = useTranslation(['common']);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<FormFields>();

  const { createTeam, teamCreating } = useCreateTeam();
  const { createMember, memberCreating } = useCreateMember();

  const { setTeamId, setMemberId } = useSupabaseContext();

  const onCreateTeam = async (data: FormFields) => {
    // 1. create a new team
    const [team, teamError] = await createTeam({
      name: data.team,
      cardMode: data.cardMode,
    });

    if (!team || teamError) {
      return;
    }

    // 2. create a new member and connect it to the team
    const [member, memberError] = await createMember({
      name: data.member,
      teamId: team.id,
    });

    if (!member || memberError) {
      return;
    }

    setTeamId(team.id);
    setMemberId(member.id);

    router.push('/team' + '/' + team.id);
  };

  return (
    <Modal title={t('startModalTitle')} onClose={handleClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(onCreateTeam)}>
        <VStack gap={12}>
          <Grid templateColumns='1fr 2fr' gridGap={2} alignItems='center'>
            <FormLabel>{t('teamName')}</FormLabel>
            <Input
              {...register('team', { required: true })}
              data-testid='team-name-input'
            />

            <FormLabel>{t('memberName')}</FormLabel>
            <Input
              {...register('member', { required: true })}
              data-testid='member-name-input'
            />

            <FormLabel>{t('cardDeck')}</FormLabel>
            <Controller
              control={control}
              name='cardMode'
              rules={{ required: true }}
              render={({ field: { ref, onChange } }) => (
                <Select
                  ref={ref}
                  options={CARD_MODE_OPTIONS}
                  onChange={(option) => onChange(option?.value)}
                  placeholder={t('selectOptionPlaceholder')}
                />
              )}
            />
          </Grid>

          <Button
            variant='solid'
            type='submit'
            isDisabled={!isValid}
            isLoading={teamCreating || memberCreating}
            data-testid='start-game-button'
          >
            {t('startGame')}
          </Button>
        </VStack>
      </form>
    </Modal>
  );
};
