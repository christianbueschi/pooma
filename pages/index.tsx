import { NextPage } from 'next';
import { MainTitle } from '../toolkit/elements/Title';
import { Flex } from '../toolkit/elements/Flex';
import { Body, BodyBig } from '../toolkit/elements/Body';
import { Header } from '../toolkit/components/Header';

import { setCookie } from 'nookies';
import { useRouter } from 'next/router';

import { Option } from 'react-dropdown';
import 'react-dropdown/style.css';
import { useState } from 'react';
import { api } from '../toolkit/components/api';
import { Button } from '../toolkit/elements/Button';
import { Modal } from '../toolkit/components/Modal';
import {
  ErrorInfo,
  FormGrid,
  Info,
  Input,
  Label,
  StyledDropdown,
} from '../toolkit/elements/Form';
import { JoinModal } from '../toolkit/components/JoinModal';

const CARD_MODE_OPTIONS = [
  { value: 'fibonacci', label: 'Fibonacci' },
  { value: 'tshirt', label: 'T-Shirt' },
];

const Home: NextPage = () => {
  const [team, setTeam] = useState('');
  const [member, setMember] = useState('');
  const [cardModeOption, setCardModeOption] = useState<Option>(
    CARD_MODE_OPTIONS[0]
  );
  const [teamError, setTeamError] = useState('');

  const router = useRouter();

  const [showStartModal, setShowStartModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const onCreateTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const teamId = await api.setTeam(team, cardModeOption.value);
    const memberRes = await api.addMember(teamId, member);

    setCookie(null, 'teamId', teamId);
    setCookie(null, 'memberId', memberRes.member.id);

    router.push(teamId);
  };

  return (
    <>
      <Header isHome />

      <Flex css={{ justifyContent: 'center', alignItems: 'center' }} gap={48}>
        <MainTitle>POOMA</MainTitle>
        <BodyBig css={{ textAlign: 'center' }}>
          Scrum Planning Poker at it&apos;s finest!
          <br />
          Virtually estimate your team stories with ease 🎉
        </BodyBig>
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
        )}

        {showJoinModal && <JoinModal title='Join A Game' />}
      </Flex>
    </>
  );
};

export default Home;
