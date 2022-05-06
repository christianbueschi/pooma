import { StyledDropdown } from '../elements/Form';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { api } from '../api/api';
import { useState } from 'react';
import { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import { COOKIE_OPTIONS } from './constants';
import { Button, FormLabel, Grid, Input, VStack } from '@chakra-ui/react';
import { Modal } from './Modal';

const CARD_MODE_OPTIONS = [
  { value: 'fibonacci', label: 'Fibonacci' },
  { value: 'tshirt', label: 'T-Shirt' },
];

type CreateModalProps = {
  handleClose: () => void;
  isOpen: boolean;
};

export const CreateModal: React.FC<CreateModalProps> = ({
  handleClose,
  isOpen,
}) => {
  const router = useRouter();

  const [team, setTeam] = useState('');
  const [member, setMember] = useState('');
  const [cardModeOption, setCardModeOption] = useState<Option>(
    CARD_MODE_OPTIONS[0]
  );

  const onCreateTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const teamId = await api.setTeam(team, cardModeOption.value);

    if (!teamId) return;

    const memberRes = await api.addMember(teamId, member);

    setCookie(null, 'teamId', teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', memberRes.member.id, COOKIE_OPTIONS);

    router.push('/team' + '/' + teamId);
  };

  return (
    <Modal title='Start a new game' handleClose={handleClose} isOpen={isOpen}>
      <form onSubmit={onCreateTeam}>
        <VStack gap={12}>
          <Grid templateColumns='1fr 2fr' gridGap={2}>
            <FormLabel>Team Name</FormLabel>
            <Input
              type='text'
              value={team}
              onChange={(ev) => setTeam(ev.currentTarget.value)}
              data-testid='team-name-input'
            />

            <FormLabel>Member Name</FormLabel>
            <Input
              type='text'
              value={member}
              onChange={(ev) => setMember(ev.currentTarget.value)}
              data-testid='member-name-input'
            />

            <FormLabel>Card Deck</FormLabel>
            <StyledDropdown
              options={CARD_MODE_OPTIONS}
              onChange={(option) => setCardModeOption(option)}
              value={cardModeOption}
              placeholder='Select an option'
            />
          </Grid>

          <Button
            variant='solid'
            type='submit'
            onClick={onCreateTeam}
            isDisabled={!team || !member}
            data-testid='start-game-button'
            colorScheme='green'
          >
            Start Game
          </Button>
        </VStack>
      </form>
    </Modal>
  );
};
