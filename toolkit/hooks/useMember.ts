import { useCallback, useEffect, useState } from 'react';
import { client } from '../supabase/client';
import { Member } from '../types';

export const useMember = (id?: string) => {
  const [member, setMember] = useState<Member | null>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchMember = useCallback(async (id: string) => {
    try {
      const { data, error } = await client
        .from('members')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        setError(error);
      }

      setMember(data);
      subscribeToMemberUpdates(id);
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

    fetchMember(id);
  }, [id, fetchMember]);

  const subscribeToMemberUpdates = (id: string) => {
    client
      .channel(`public:member:update`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'members',
          filter: `id=eq.${id}`,
        },
        async (payload) => {
          const changedMember = payload.new as Member;

          setMember((prevMember) => {
            if (!prevMember) return null;

            return {
              ...prevMember,
              ...changedMember,
            };
          });
        }
      )
      .subscribe();
  };

  return [member, isLoading, error] as const;
};
