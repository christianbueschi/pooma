import Link from 'next/link';
import { useState } from 'react';
import { Body } from '../elements/Body';
import { Button } from '../elements/Button';
import { Flex } from '../elements/Flex';
import { ErrorInfo, FormGrid, Info, Input, Label } from '../elements/Form';
import { api } from './api';
import { Member, useTeam } from './apiHooks';
import { StyledLink } from './Header';
import { Modal } from './Modal';
import { setCookie } from 'nookies';
import { useRouter } from 'next/router';
import { COOKIE_OPTIONS } from './constants';

type JoinModalProps = {
  title: string;
  handleClose?: () => void;
  teamId?: string;
};

export const JoinModal: React.FC<JoinModalProps> = (props) => {
  const [team, teamIsLoading, error] = useTeam(props.teamId);
  const [teamId, setTeamId] = useState(props.teamId);
  const [memberName, setMemberName] = useState('');
  const [existingMember, setExistingMember] = useState<Member>();
  const [teamError, setTeamError] = useState('');

  const router = useRouter();

  const onJoinTeam = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!teamId) return;

    // reroute to new teamId path if it doesn't exists
    const teamExists = await api.doesTeamExists(teamId);

    if (!teamExists) {
      setTeamError(
        `Sorry, but we couldn't find the team <b>${teamId}</b>. <br> Please try a different team or create a new one.`
      );
      return;
    }

    setTeamError('');

    // Otherwise we can try to add the member
    const memberRes = await api.addMember(teamId, memberName);

    if (memberRes.type === 'EXISTING') {
      setExistingMember(memberRes.member);
      return;
    }

    setCookie(null, 'teamId', teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', memberRes.member.id, COOKIE_OPTIONS);

    router.push('/team' + '/' + teamId);
  };

  const loginAs = (memberId: string) => {
    if (!teamId) return;
    setCookie(null, 'teamId', teamId, COOKIE_OPTIONS);
    setCookie(null, 'memberId', memberId);
    router.push(teamId);
  };

  return (
    <Modal title={props.title} handleClose={props.handleClose}>
      {(teamError || error) && (
        <ErrorInfo>
          <Body dangerouslySetInnerHTML={{ __html: teamError || error }} />
        </ErrorInfo>
      )}

      {existingMember && (
        <Flex gap={8}>
          <ErrorInfo>
            <Body
              dangerouslySetInnerHTML={{
                __html: `The member <b>${existingMember.name}</b> already exists.`,
              }}
            />
          </ErrorInfo>
          <Info color='blue'>
            <Flex gap={8}>
              <Body>
                Is this you? Then you can just login. Otherwise please use a
                different name.
              </Body>
              <Button onClick={() => loginAs(existingMember.id)}>
                Login as {existingMember.name}
              </Button>
            </Flex>
          </Info>
        </Flex>
      )}

      <form onSubmit={onJoinTeam}>
        <Flex gap={24} css={{ alignItems: 'center' }}>
          <FormGrid>
            <Label>Team ID</Label>
            <Input
              type='text'
              value={teamId}
              onChange={(ev) => setTeamId(ev.currentTarget.value)}
            />
            <Label>Member Name</Label>
            <Input
              type='text'
              value={memberName}
              onChange={(ev) => setMemberName(ev.currentTarget.value)}
            />
          </FormGrid>

          <Button
            variant='solid'
            type='submit'
            onClick={onJoinTeam}
            isDisabled={!teamId || !memberName}
            isFullWidth
          >
            Join Game
          </Button>
          <Link href='/' passHref>
            <StyledLink>Start over</StyledLink>
          </Link>
        </Flex>
      </form>
    </Modal>
  );
};
