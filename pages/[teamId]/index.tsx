import { useTheme } from '@emotion/react';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../components/api';
import {
  Member,
  useMember,
  useMembers,
  useTeam,
} from '../../components/apiHooks';
import { Cards } from '../../components/Cards';
import { Button } from '../../components/elements/Button';
import { Flex } from '../../components/elements/Flex';
import { Loading } from '../../components/elements/Loading';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { TableCards } from '../../components/TableCards';

type Statistic = {
  label: string;
  count: number;
};

const Team: NextPage = () => {
  const [isOpen, toggleIsOpen] = useState(false);

  const [lowest, setLowest] = useState('');
  const [highest, setHighest] = useState('');
  const [cardMode, setCardMode] = useState('');

  const [team, teamIsLoading] = useTeam();
  const [members, membersIsLoading] = useMembers(team?.id);
  const [member, memberIsLoading] = useMember();

  const isLoading = teamIsLoading || membersIsLoading;

  const handleResolve = () => {
    isOpen ? clear() : resolve();
  };

  const addToStats = (stats: Statistic[], card: string) => {
    let alreadySet = false;

    stats.forEach((item) => {
      if (item.label === card) {
        item.count++;
        alreadySet = true;
      }
    });

    if (!alreadySet) {
      stats.push({ label: card, count: 1 });
    }
  };

  const setStats = () => {
    let lowest = '';
    let highest = '';
    const stats: Statistic[] = [];

    members &&
      members.forEach((member) => {
        if (member && member.card === '') return;

        addToStats(stats, member.card);

        if (!lowest && !highest) {
          lowest = member.card;
          highest = member.card;
        } else if (member.card < lowest) {
          lowest = member.card;
        } else if (member.card > highest) {
          highest = member.card;
        }
      });

    setLowest(lowest);
    setHighest(highest);

    return stats;
  };

  const resolve = () => {
    toggleIsOpen(true);
    // const stats = this.setStats();

    api.updateTeam(team?.id, { isLocked: true });

    const getColor = (number: string) => {
      if (number === highest) return 'rgba(222,91,73,1)';
      else if (number === lowest) return 'rgba(70,178,157,1)';
      else return 'rgba(7,134,216,1)';
    };
  };

  const clear = async () => {
    // todo: add await
    members &&
      members.forEach((member) => {
        api.updateMember(team?.id, member.name, { card: '' });
      });
    await api.updateTeam(team?.id, { isLocked: false });
    toggleIsOpen(false);
  };

  const remove = async (member: Member) => {
    if (member.name === window.localStorage.getItem('member')) {
      if (window.confirm('Do you want to remove yourself from the team?')) {
        await api.removeMember(team, member.name);
      }
    } else {
      await api.removeMember(team, member.name);
    }
  };
  return (
    <Flex gap={48}>
      <Header />

      <Flex>
        {member && team && !memberIsLoading && (
          <Cards member={member} team={team} />
        )}
      </Flex>

      {isLoading ? (
        <Loading />
      ) : (
        members && (
          <TableCards
            members={members}
            isOpen={isOpen}
            highest={highest}
            lowest={lowest}
            onRemove={remove}
          />
        )
      )}
      <Flex horizontal css={{ justifyContent: 'center' }}>
        {!isLoading && members && members.length > 0 && (
          <Button variant='solid' isActive={isOpen} onClick={handleResolve}>
            {isOpen ? 'Hide Cards' : 'Show Cards'}
          </Button>
        )}

        {!team && !isLoading && (
          <div className='a-not-set'>
            <p>You have not yet created or selected a team.</p>
          </div>
        )}

        {!isLoading && members?.length === 0 && (
          <p className='a-not-set'>No members here at the moment.</p>
        )}
      </Flex>
    </Flex>
  );
};

export default Team;
