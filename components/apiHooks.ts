import { collection, doc, onSnapshot, query } from '@firebase/firestore';
import { useEffect, useState } from 'react';
import db from './api';

export type Member = {
  id: string;
  card: string;
  name: string;
};

export const useMembers = (team?: string): [Member[] | undefined, boolean] => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!team) return;

    setIsLoading(true);

    const membersQuery = query(collection(db, 'teams', team, 'members'));
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
  }, [team]);

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
  teamName?: string | null
): [Team | undefined, boolean] => {
  const [team, setTeam] = useState<Team>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const myTeamName = teamName || localStorage.getItem('teamId');

    if (!myTeamName) return;

    setIsLoading(true);

    const teamDoc = doc(db, 'teams', myTeamName);
    const unsubscribe = onSnapshot(teamDoc, (querySnapshot) => {
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
  }, [teamName]);

  return [team, isLoading];
};

export const useMember = (
  teamName?: string,
  memberName?: string
): [Member | undefined, boolean] => {
  const [member, setMember] = useState<Member>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const myTeamName = memberName || localStorage.getItem('teamId');
    const myMemberName = memberName || localStorage.getItem('member');

    if (!myTeamName || !myMemberName) return;

    setIsLoading(true);

    const memberDoc = doc(db, 'teams', myTeamName, 'members', myMemberName);
    const unsubscribe = onSnapshot(memberDoc, (querySnapshot) => {
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
  }, [teamName, memberName]);

  return [member, isLoading];
};
