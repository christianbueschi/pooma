import { useCallback, useEffect, useState } from 'react';
import { client } from '../supabase/client';
import { Member, Team } from '../types';

export const useTeam = (id?: string) => {
  const [team, setTeam] = useState<Team | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchTeam = useCallback(async (id: string) => {
    try {
      const { data, error } = await client
        .from('teams')
        .select(
          `
          id,
          name,
          isLocked,
          cardMode,
          created_at,
          members (
            id,
            name,
            card
          )
        `
        )
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      }

      setTeam(data as Team);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    fetchTeam(id);
    const memberSubscription = subscribeToMemberUpdates(id);
    const teamSubscription = subscribeToTeamUpdates(id);

    return () => {
      memberSubscription.unsubscribe();
      teamSubscription.unsubscribe();
    };
  }, [id, fetchTeam]);

  const subscribeToMemberUpdates = (id: string) => {
    return client
      .channel(`public:members:insert`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
          filter: `teamId=eq.${id}`,
        },
        async (payload) => {
          const newMember = payload.new as Member;

          setTeam((prevTeam) => {
            if (!prevTeam) return null;

            if (payload.eventType === 'UPDATE') {
              const updated = {
                ...prevTeam,
                members: prevTeam.members?.map((member) => {
                  if (member.id === newMember.id) {
                    return newMember;
                  }

                  return member;
                }),
              };

              return updated;
            } else if (payload.eventType === 'INSERT') {
              const inserted = {
                ...prevTeam,
                members: [...(prevTeam.members || []), newMember],
              };

              return inserted;
            } else if (payload.eventType === 'DELETE') {
              return prevTeam;
            }
          });
        }
      )
      .subscribe();
  };

  const subscribeToTeamUpdates = (id: string) => {
    return client
      .channel(`public:teams:update`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'teams',
          filter: `id=eq.${id}`,
        },
        async (payload) => {
          const changedTeam = payload.new as Team;

          setTeam((prevTeam) => {
            if (!prevTeam) return null;

            return {
              ...prevTeam,
              ...changedTeam,
            };
          });
        }
      )
      .subscribe();
  };

  return [team, isLoading, error, fetchTeam] as const;
};
