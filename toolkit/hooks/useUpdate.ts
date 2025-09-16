import { useCallback, useState } from 'react';
import { client } from '../supabase/client';

export const useUpdate = <T extends { id: string }>(table: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const update = useCallback(
    async (data: Partial<T>) => {
      setIsLoading(true);

      try {
        const { error } = await (client as any)
          .from(table)
          .update(data)
          .eq('id', data.id)
          .single();

        if (error) {
          setError(error);
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [table]
  );

  return [update, isLoading, error] as const;
};
