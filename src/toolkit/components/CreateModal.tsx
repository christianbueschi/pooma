'use client';

import { Button, Grid, Input, VStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { Modal } from './Modal';
import { Controller, useForm } from 'react-hook-form';
import { Select } from 'chakra-react-select';
import { useInsert } from '../hooks/useInsert';
import { MemberInsert, TeamInsert } from '../types';
import { setCookie } from 'nookies';
import { COOKIE_OPTIONS } from './constants';

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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<FormFields>();

  const [createTeam, teamCreating] = useInsert<TeamInsert>();
  const [createMember, memberCreating] = useInsert<MemberInsert>();

  const onCreateTeam = async (data: FormFields) => {
    const [team, teamError] = await createTeam('teams', {
      name: data.team,
      cardMode: data.cardMode,
    });

    if (!team?.id || teamError) {
      return;
    }

    const [member, memberError] = await createMember('members', {
      name: data.member,
      teamId: team.id,
    });

    if (!member?.id || memberError) {
      return;
    }

    setCookie(null, 'teamId', team.id, COOKIE_OPTIONS);
    setCookie(null, 'memberId', member.id, COOKIE_OPTIONS);

    router.push('/team/' + team.id);
  };

  return (
    <Modal title='Start New Game' onClose={handleClose} isOpen={isOpen}>
      <form onSubmit={handleSubmit(onCreateTeam)}>
        <VStack gap={12}>
          <Grid templateColumns='1fr 2fr' gridGap={2} alignItems='center'>
            <Text as='label'>Team Name</Text>
            <Input
              {...register('team', { required: true })}
              data-testid='team-name-input'
            />

            <Text as='label'>Member Name</Text>
            <Input
              {...register('member', { required: true })}
              data-testid='member-name-input'
            />

            <Text as='label'>Card Deck</Text>
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
            disabled={!isValid}
            loading={teamCreating || memberCreating}
            data-testid='start-game-button'
          >
            Start Game
          </Button>
        </VStack>
      </form>
    </Modal>
  );
};
