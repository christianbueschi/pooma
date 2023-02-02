import { PostgrestResponse } from '@supabase/supabase-js';
import { useState } from 'react';
import { client } from '../supabase/client';

export const useInsert = <T>() => {
  const [isLoading, setIsLoading] = useState(false);

  const insert = async (table: string, payload: any) => {
    setIsLoading(true);

    try {
      const { data, error } = (await client
        .from(table)
        .insert(payload)
        .select()
        .single()) as PostgrestResponse<T>;

      if (error) {
        return [null, error] as const;
      }

      return [data as T, null] as const;
    } catch (error) {
      return [null, error as any] as const;
    } finally {
      setIsLoading(false);
    }
  };

  return [insert, isLoading] as const;
};
