import styled from '@emotion/styled';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { api } from './api';
import { Button } from './elements/Button';
import { Flex } from './elements/Flex';
import { Modal } from './Modal';
import Dropdown, { Option } from 'react-dropdown';
import 'react-dropdown/style.css';

const CARD_MODE_OPTIONS = [
  { value: 'fibonacci', label: 'Fibonacci' },
  { value: 'tshirt', label: 'T-Shirt' },
];

export const Tabs = () => {
  const [team, setTeam] = useState('');
  const [teamId, setTeamId] = useState('');
  const [member, setMember] = useState('');
  const [cardModeOption, setCardModeOption] = useState<Option>(
    CARD_MODE_OPTIONS[0]
  );
  const [error, setError] = useState('');

  const router = useRouter();

  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const onCreateTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const teamId = await api.setTeam(team, cardModeOption.value);
    await api.setMember(teamId, member);

    localStorage.setItem('teamId', teamId);
    localStorage.setItem('member', member);

    router.push(`${teamId}/dashboard`);
  };

  const onJoinTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const myTeam = await api.getTeam(teamId);

    if (!myTeam.data()) {
      setError('Uuh ooh, Team does not exist');
      return;
    }

    const res = await api.setMember(teamId, member);

    if (res?.error) {
      setError(res.error);
      return;
    }

    localStorage.setItem('teamId', teamId);
    localStorage.setItem('member', member);

    router.push(`${teamId}/play`);
  };

  return (
    <>
      <Flex css={{ alignItems: 'center' }} gap={4}>
        <Button variant='solid' onClick={() => setShowStartModal(true)}>
          Start New Game
        </Button>
        <Button variant='link' onClick={() => setShowJoinModal(true)}>
          Join Game
        </Button>
      </Flex>

      {showStartModal && (
        <Modal
          title='Start a new game'
          handleClose={() => setShowStartModal(false)}
        >
          <TabForm onSubmit={onCreateTeam}>
            <Flex gap={12} css={{ alignItems: 'center' }}>
              <TabFormInput
                type='text'
                value={team}
                placeholder='Team Name'
                onChange={(ev) => setTeam(ev.currentTarget.value)}
              />
              <TabFormInput
                type='text'
                value={member}
                placeholder='Member Name'
                onChange={(ev) => setMember(ev.currentTarget.value)}
              />
              <Flex gap={8}>
                <Label>Card Deck</Label>
                <StyledDropdownd
                  options={CARD_MODE_OPTIONS}
                  onChange={(option) => setCardModeOption(option)}
                  value={cardModeOption}
                  placeholder='Select an option'
                />
              </Flex>
              <Button variant='solid' type='submit' onClick={onCreateTeam}>
                Start Game
              </Button>
            </Flex>
            {error && <ErrorText>{error}</ErrorText>}
          </TabForm>
        </Modal>
      )}

      {showJoinModal && (
        <Modal title='Join a game' handleClose={() => setShowJoinModal(false)}>
          <TabForm onSubmit={onJoinTeam}>
            <Flex gap={12} css={{ alignItems: 'center' }}>
              <TabFormInput
                type='text'
                value={teamId}
                placeholder='Team ID'
                onChange={(ev) => setTeamId(ev.currentTarget.value)}
              />
              <TabFormInput
                type='text'
                value={member}
                placeholder='Member Name'
                onChange={(ev) => setMember(ev.currentTarget.value)}
              />

              <Button variant='solid' type='submit' onClick={onJoinTeam}>
                Join Game
              </Button>
            </Flex>
            {error && <ErrorText>{error}</ErrorText>}
          </TabForm>
        </Modal>
      )}
    </>
  );
};

export const Title = styled.h2`
  font-size: 32px;
`;

export const Label = styled.label`
  color: white;
`;

export const StyledDropdownd = styled(Dropdown)`
  .Dropdown-control {
    min-width: 250px;
    border-radius: 8px;
  }
`;

const TabItem = styled.button<{ isActive: boolean }>`
  font-size: 18px;
  margin: 0 0.5rem;
  padding: 1rem;
  border: none;
  max-width: 30%;
  background-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.blue : theme.colors.green};
  color: white;
  transition: background-color 0.25s ease-in-out;
  border-radius: 8px 8px 0 0;
  cursor: pointer;

  &:focus {
    outline: none;
  }

  @media (min-width: 672px) {
    font-size: 24px;
    min-width: 160px;
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.red};
`;

const TabForm = styled.form`
  border-radius: 8px;
  max-width: 900px;
  margin: 0 auto;
`;

const TabFormInput = styled.input`
  background: transparent;
  border: 1px solid white;
  border-radius: 8px;
  padding: 1rem;
  font-size: 16px;
  display: block;
  color: white;
  min-width: 250px;

  -webkit-appearance: none;

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.green};
  }

  &::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: 'white';
  }

  &:-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #20323c;
  }

  &::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #20323c;
  }
`;
