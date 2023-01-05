import { useState } from 'react';
import { CardMode } from '../components/CreateModal';
import { client } from '../supabase/client';
import { Team } from '../types';

export const useCreateTeam = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createTeam = async ({
    name,
    cardMode,
  }: {
    name: string;
    cardMode: CardMode;
  }) => {
    setIsLoading(true);

    try {
      const { data, error } = await client
        .from('teams')
        .insert({ name, cardMode, isLocked: false })
        .select()
        .single();

      if (error) {
        return [null, error] as const;
      }

      return [data as Team, null] as const;
    } catch (error) {
      return [null, error as any] as const;
    } finally {
      setIsLoading(false);
    }
  };

  return { createTeam, teamCreating: isLoading };
};
