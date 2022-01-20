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

    router.push(teamId);
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

    router.push(teamId);
  };

  return (
    <>
      <Flex css={{ alignItems: 'center' }} gap={12}>
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
            <Flex gap={24} css={{ alignItems: 'center' }}>
              <Flex gap={12} css={{ alignItems: 'center' }}>
                <Flex horizontal gap={24} css={{ alignItems: 'center' }}>
                  <Label>Team Name</Label>
                  <TabFormInput
                    type='text'
                    value={team}
                    onChange={(ev) => setTeam(ev.currentTarget.value)}
                  />
                </Flex>
                <Flex horizontal gap={24} css={{ alignItems: 'center' }}>
                  <Label>Member Name</Label>
                  <TabFormInput
                    type='text'
                    value={member}
                    onChange={(ev) => setMember(ev.currentTarget.value)}
                  />
                </Flex>
                <Flex horizontal gap={24} css={{ alignItems: 'center' }}>
                  <Label>Card Deck</Label>
                  <StyledDropdown
                    options={CARD_MODE_OPTIONS}
                    onChange={(option) => setCardModeOption(option)}
                    value={cardModeOption}
                    placeholder='Select an option'
                  />
                </Flex>
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
            <Flex gap={24} css={{ alignItems: 'center' }}>
              <Flex gap={12} css={{ alignItems: 'center' }}>
                <Flex horizontal gap={24} css={{ alignItems: 'center' }}>
                  <Label>Team ID</Label>
                  <TabFormInput
                    type='text'
                    value={teamId}
                    onChange={(ev) => setTeamId(ev.currentTarget.value)}
                  />
                </Flex>
                <Flex horizontal gap={24} css={{ alignItems: 'center' }}>
                  <Label>Member Name</Label>
                  <TabFormInput
                    type='text'
                    value={member}
                    onChange={(ev) => setMember(ev.currentTarget.value)}
                  />
                </Flex>
              </Flex>

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
  font-weight: 600;
`;

export const Label = styled.label`
  color: white;
  width: 150px;
`;

export const StyledDropdown = styled(Dropdown)`
  .Dropdown-control {
    min-width: 250px;
    border-radius: ${({ theme }) => theme.borderRadius[8]};
    height: 42px;
    display: flex;
    align-items: center;
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.red};
`;

const TabForm = styled.form`
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  max-width: 900px;
`;

const TabFormInput = styled.input`
  background: transparent;
  border: 1px solid white;
  border-radius: ${({ theme }) => theme.borderRadius[8]};
  height: 42px;
  padding: ${({ theme }) => theme.spacings[12]};
  font-size: 16px;
  display: block;
  color: white;
  min-width: 250px;

  -webkit-appearance: none;

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.green};
  }
`;
