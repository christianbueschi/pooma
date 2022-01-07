import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { api } from '../../components/api';
import { Member, useMembers } from '../../components/apiHooks';
import { Button } from '../../components/elements/Button';
import { Loading } from '../../components/elements/Loading';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { TableCards } from '../../components/TableCards';

type Statistic = {
  label: string;
  count: number;
};

const Dashboard: NextPage = () => {
  const [isOpen, toggleIsOpen] = useState(false);
  const [team, setTeam] = useState('');
  const [lowest, setLowest] = useState('');
  const [highest, setHighest] = useState('');
  // const [members, setMembers] = useState<Member[]>([]);
  const [cardMode, setCardMode] = useState('');

  const [members, isLoading] = useMembers(team);

  useEffect(() => {
    const myTeam = localStorage.getItem('teamId');

    if (!myTeam) return;

    setTeam(myTeam);
  }, []);

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

    api.updateTeam(team, { isLocked: true });

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
        api.updateMember(team, member.name, { card: '' });
      });
    await api.updateTeam(team, { isLocked: false });
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
    <>
      <Header />

      <Sidebar />

      {isLoading ? (
        <Loading />
      ) : (
        members && (
          <TableCards
            members={members}
            cardMode={cardMode}
            isOpen={isOpen}
            highest={highest}
            lowest={lowest}
            onRemove={remove}
          />
        )
      )}

      {!isLoading && members && members.length > 0 && (
        <Button variant='solid' isActive={isOpen} onClick={handleResolve}>
          {isOpen ? 'Hide Cards' : 'Show Cards'}
        </Button>
      )}

      {!team && (
        <div className='a-not-set'>
          <p>You have not yet created or selected a team.</p>
        </div>
      )}

      {members?.length === 0 && (
        <p className='a-not-set'>No members here at the moment.</p>
      )}
    </>
  );
};

export default Dashboard;
