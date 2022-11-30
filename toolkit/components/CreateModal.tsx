import { setCookie } from 'nookies';
import { Button, FormLabel, Grid, Input, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { CardMode } from '@prisma/client';
import { COOKIE_OPTIONS } from './constants';
import { Modal } from './Modal';
import { trpc } from '../../src/utils/trpc';
import { Controller, useForm } from 'react-hook-form';
import { Select } from 'chakra-react-select';

const CARD_MODE_OPTIONS = [
  { value: 'FIBONACCI', label: 'Fibonacci' },
  { value: 'TSHIRT', label: 'T-Shirt' },
];

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<FormFields>();

  const teamMutation = trpc.createTeam.useMutation();
  const memberMutation = trpc.createMember.useMutation();

  const onCreateTeam = async (data: FormFields) => {
    // 1. create a new team
    const newTeam = await teamMutation.mutateAsync({
      name: data.team,
      cardMode: data.cardMode,
    });

    // 2. create a new member and connect it to the team
    const newMember = await memberMutation.mutateAsync({
      name: data.member,
      teamId: newTeam.id,
    });

    setCookie(null, 'teamId', newTeam.id, COOKIE_OPTIONS);
    setCookie(null, 'memberId', newMember.id, COOKIE_OPTIONS);

    router.push('/team' + '/' + newTeam.id);
  };

  return (
    <Modal title='Start a new game' onClose={handleClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(onCreateTeam)}>
        <VStack gap={12}>
          <Grid templateColumns='1fr 2fr' gridGap={2}>
            <FormLabel>Team Name</FormLabel>
            <Input
              {...register('team', { required: true })}
              data-testid='team-name-input'
            />

            <FormLabel>Member Name</FormLabel>
            <Input
              {...register('member', { required: true })}
              data-testid='member-name-input'
            />

            <FormLabel>Card Deck</FormLabel>
            <Controller
              control={control}
              name='cardMode'
              rules={{ required: true }}
              render={({ field: { ref, onChange } }) => (
                <Select
                  ref={ref}
                  options={CARD_MODE_OPTIONS}
                  onChange={(option) => onChange(option?.value)}
                  placeholder='Select an option'
                />
              )}
            />
          </Grid>

          <Button
            variant='solid'
            type='submit'
            isDisabled={!isValid}
            data-testid='start-game-button'
          >
            Start Game
          </Button>
        </VStack>
      </form>
    </Modal>
  );
};
