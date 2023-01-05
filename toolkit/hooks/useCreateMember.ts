import { useState } from 'react';
import { client } from '../supabase/client';
import { Member } from '../types';

export const useCreateMember = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createMember = async ({
    name,
    teamId,
  }: {
    name: string;
    teamId: string;
  }) => {
    setIsLoading(true);

    try {
      const { data, error } = await client
        .from('members')
        .insert({ name, teamId })
        .select()
        .single();

      if (error) {
        return [null, error] as const;
      }

      return [data as Member, null] as const;
    } catch (error) {
      return [null, error as any] as const;
    } finally {
      setIsLoading(false);
    }
  };

  return { createMember, memberCreating: isLoading };
};
