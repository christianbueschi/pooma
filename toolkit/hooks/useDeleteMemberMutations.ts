import { useState } from 'react';
import { client } from '../context/SupabaseProvider';
import { Member } from '../types';

export const useDeleteMemberMutations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const deleteMember = async (member: Partial<Member>) => {
    setIsLoading(true);

    try {
      const { error } = await client
        .from('members')
        .delete()
        .eq('id', member.id);

      if (error) {
        setError(error);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return [deleteMember, isLoading, error] as const;
};
