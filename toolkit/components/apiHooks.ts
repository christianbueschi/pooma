import { collection, doc, onSnapshot, query, where } from '@firebase/firestore';
import { destroyCookie, parseCookies } from 'nookies';
import { useEffect, useState } from 'react';
import db from './api';

export type Member = {
  id: string;
  name: string;
  name_lowercase: string;
  state: 'active' | 'removed';
  card?: string;
  spectactorMode?: boolean;
};

export const useMembers = (
  teamId?: string
): [Member[] | undefined, boolean] => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const myTeamId = teamId || parseCookies(null).teamId;

    if (!myTeamId) return;

    setIsLoading(true);

    const membersQuery = query(
      collection(db, 'teams', myTeamId, 'members'),
      where('state', '!=', 'removed')
    );
    const unsubscribe = onSnapshot(membersQuery, (querySnapshot) => {
      const newMembers: any = [];
      querySnapshot.forEach((doc) => {
        newMembers.push(doc.data());
      });

      setMembers(newMembers);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [teamId]);

  return [members, isLoading];
};

export type Team = {
  id: string;
  name: string;
  members: any[];
  cardMode: string;
  isLocked: boolean;
};

export const useTeam = (
  teamId?: string | null
): [Team | undefined, boolean, string] => {
  const [team, setTeam] = useState<Team>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cookies = parseCookies();

    const myTeamId = teamId || cookies.teamId;
    console.log('useTeam', myTeamId);

    if (!myTeamId) return;

    setIsLoading(true);

    const teamDoc = doc(db, 'teams', myTeamId);
    const unsubscribe = onSnapshot(teamDoc, (querySnapshot) => {
      // if team is not there remotly, remove the cookie
      if (!querySnapshot.data()) {
        // destroyCookie(null, 'teamId');
        // destroyCookie(null, 'memberId');
        console.log('!querySnapshot.data()', myTeamId);
        setError(
          `Sorry, but we couldn't find the team <b>${myTeamId}</b>. <br> Please try a different team or create a new one.`
        );
      }

      const newTeam = {
        id: querySnapshot.id,
        ...querySnapshot.data(),
      } as Team;

      setTeam(newTeam);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [teamId]);

  return [team, isLoading, error];
};

export const useMember = (
  teamId?: string,
  memberId?: string
): [Member | undefined, boolean] => {
  const [member, setMember] = useState<Member>();
  const [isLoading, setIsLoading] = useState(false);

  const myTeamId = teamId || parseCookies(null).teamId;
  const myMemberId = memberId || parseCookies(null).memberId;

  useEffect(() => {
    if (!myTeamId || !myMemberId) {
      // destroyCookie(null, "memberId");
      return;
    }

    setIsLoading(true);

    const memberDoc = doc(db, 'teams', myTeamId, 'members', myMemberId);
    const unsubscribe = onSnapshot(memberDoc, (querySnapshot) => {
      if (!querySnapshot.data()) {
        destroyCookie(null, 'memberId');
        setIsLoading(false);
        return;
      }
      const newMember = {
        id: querySnapshot.id,
        ...querySnapshot.data(),
      } as Member;

      setMember(newMember);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [myTeamId, myMemberId]);

  return [member, isLoading];
};
