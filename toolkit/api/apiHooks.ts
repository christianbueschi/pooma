import { collection, doc, onSnapshot, query, where } from '@firebase/firestore';
import { useRouter } from 'next/router';
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

export const useMembers = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const teamId = router.query.teamId as string | undefined;

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

  return [members, isLoading] as const;
};

export type Team = {
  id: string;
  name: string;
  members: any[];
  cardMode: string;
  isLocked: boolean;
};

export const useTeam = () => {
  const [team, setTeam] = useState<Team>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const teamId = router.query.teamId as string | undefined;

  useEffect(() => {
    const cookies = parseCookies();

    const myTeamId = teamId || cookies.teamId;

    if (!myTeamId) return;

    setIsLoading(true);

    const teamDoc = doc(db, 'teams', myTeamId);
    const unsubscribe = onSnapshot(teamDoc, (querySnapshot) => {
      // if team is not there remotly, remove the cookie
      if (!querySnapshot.data()) {
        setError(
          `Sorry, but we couldn't find the team <b>${myTeamId}</b>. <br> Please try a different team or create a new one.`
        );

        setIsLoading(false);

        return;
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

  return [team, isLoading, error] as const;
};

export const useMember = (memberId?: string) => {
  const router = useRouter();
  const teamId = router.query.teamId as string | undefined;

  const [member, setMember] = useState<Member>();
  const [isLoading, setIsLoading] = useState(false);

  const myTeamId = teamId || parseCookies().teamId;
  const myMemberId = memberId || parseCookies().memberId;

  useEffect(() => {
    if (!myTeamId || !myMemberId) {
      destroyCookie(null, 'memberId');
      return;
    }

    setIsLoading(true);

    const memberDoc = doc(db, 'teams', myTeamId, 'members', myMemberId);

    const unsubscribe = onSnapshot(memberDoc, (querySnapshot) => {
      // if we don't get a member here means that there is a member cookie which belongs to another team
      // therefore we need the user to register again
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

  return [member, isLoading] as const;
};
