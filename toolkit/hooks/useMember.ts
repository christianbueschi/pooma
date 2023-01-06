import { useCallback, useEffect, useState } from 'react';
import { useSupabaseContext } from '../context/SupabaseProvider';
import { client } from '../supabase/client';
import { Member } from '../types';

export const useMember = () => {
  const { memberId, member, setMember } = useSupabaseContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const subscribeToMemberUpdates = useCallback(
    (id: string) => {
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
    },
    [setMember]
  );

  const fetchMember = useCallback(
    async (id: string) => {
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
    },
    [setMember, subscribeToMemberUpdates]
  );

  useEffect(() => {
    if (!memberId) {
      setIsLoading(false);
      return;
    }

    fetchMember(memberId);
  }, [memberId, fetchMember]);

  return [member, isLoading, error] as const;
};
