import { useCallback, useState } from 'react';
import { client } from '../supabase/client';
import { Member } from '../types';

export const useUpdateMemberMutations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateMember = useCallback(async (member: Partial<Member>) => {
    setIsLoading(true);

    try {
      const { error } = await client
        .from('members')
        .update(member)
        .eq('id', member.id)
        .single();

      if (error) {
        setError(error);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return [updateMember, isLoading, error] as const;
};
