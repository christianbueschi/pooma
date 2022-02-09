import { Body } from '../elements/Body';
import { Button } from '../elements/Button';
import { Flex } from '../elements/Flex';
import {
  ErrorInfo,
  FormGrid,
  Input,
  Label,
  StyledDropdown,
} from '../elements/Form';
import { Modal } from './Modal';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { api } from './api';
import { useState } from 'react';
import { Option } from 'react-dropdown';
import 'react-dropdown/style.css';

const CARD_MODE_OPTIONS = [
  { value: 'fibonacci', label: 'Fibonacci' },
  { value: 'tshirt', label: 'T-Shirt' },
];

type CreateModalProps = {
  handleClose: () => void;
};

export const CreateModal: React.FC<CreateModalProps> = ({ handleClose }) => {
  const router = useRouter();

  const [team, setTeam] = useState('');
  const [member, setMember] = useState('');
  const [cardModeOption, setCardModeOption] = useState<Option>(
    CARD_MODE_OPTIONS[0]
  );
  const [teamError, setTeamError] = useState('');

  const onCreateTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const teamId = await api.setTeam(team, cardModeOption.value);
    const memberRes = await api.addMember(teamId, member);

    setCookie(null, 'teamId', teamId);
    setCookie(null, 'memberId', memberRes.member.id);

    router.push(teamId);
  };

  return (
    <Modal title='Start a new game' handleClose={handleClose}>
      {teamError && (
        <ErrorInfo>
          <Body dangerouslySetInnerHTML={{ __html: teamError }} />
        </ErrorInfo>
      )}

      <form onSubmit={onCreateTeam}>
        <Flex gap={24} css={{ alignItems: 'center' }}>
          <FormGrid>
            <Label>Team Name</Label>
            <Input
              type='text'
              value={team}
              onChange={(ev) => setTeam(ev.currentTarget.value)}
            />

            <Label>Member Name</Label>
            <Input
              type='text'
              value={member}
              onChange={(ev) => setMember(ev.currentTarget.value)}
            />

            <Label>Card Deck</Label>
            <StyledDropdown
              options={CARD_MODE_OPTIONS}
              onChange={(option) => setCardModeOption(option)}
              value={cardModeOption}
              placeholder='Select an option'
            />
          </FormGrid>

          <Button
            variant='solid'
            type='submit'
            onClick={onCreateTeam}
            isFullWidth
            isDisabled={!team || !member}
          >
            Start Game
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};
