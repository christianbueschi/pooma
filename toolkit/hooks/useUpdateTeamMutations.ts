import { useCallback, useState } from 'react';
import { client } from '../supabase/client';
import { Team } from '../types';

export const useUpdateTeamMutations = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const updateTeam = useCallback(async (team: Partial<Team>) => {
    setIsLoading(true);

    try {
      const { error } = await client
        .from('teams')
        .update(team)
        .eq('id', team.id)
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

  return [updateTeam, isLoading, error] as const;
};
