import { useState } from 'react';
import { client } from '../supabase/client';

export const useDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const deleteEntry = async (table: string, id: string) => {
    setIsLoading(true);

    try {
      const { error } = await client.from(table).delete().eq('id', id);

      if (error) {
        setError(error);
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return [deleteEntry, isLoading, error] as const;
};
