import { PostgrestResponse } from '@supabase/supabase-js';
import { useCallback, useContext, useEffect, useState } from 'react';
import { SupabaseQueryContext } from '../context/SupabaseQueryProvider';
import { client } from '../supabase/client';
import { getKey, handleMutation } from '../utils';

export type Options = {
  filter?: Filter;
  props?: string;
  shouldSubscribe?: boolean;
};

type Filter = {
  prop: string;
  operator: string;
  value: string;
};

export const useSelect = <T extends { id: string }>(
  table: string,
  options: Options
) => {
  const key = getKey(table, options);

  const { queryKeys, setQueryKeys, activePromises, activeSubscriptions } =
    useContext(SupabaseQueryContext);

  const { filter, props, shouldSubscribe } = options || {};

  const subscribeToUpdates = useCallback(() => {
    return client
      .channel(`public:${table}:update`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          filter: filter && `${filter.prop}=${filter.operator}.${filter.value}`,
        },
        async (payload) => {
          const old = payload.old as T;
          const changed = payload.new as T;

          setSelectState((prev) => {
            const mutation = handleMutation(
              payload.eventType,
              prev.data,
              changed,
              old
            );

            return {
              data: mutation,
              error: null,
              isLoading: false,
            };
          });

          setQueryKeys((prev) => {
            const mutation = handleMutation(
              payload.eventType,
              prev[key],
              changed,
              old
            );

            return {
              ...prev,
              [key]: mutation,
            };
          });
        }
      )
      .subscribe();
  }, [table, filter, key, setQueryKeys]);

  useEffect(() => {
    if (!shouldSubscribe || activeSubscriptions[key]) return;

    activeSubscriptions[key] = subscribeToUpdates();
  }, [activeSubscriptions, key, subscribeToUpdates, shouldSubscribe]);

  const [selectState, setSelectState] = useState<{
    data: T[] | null | undefined;
    error: any;
    isLoading: boolean;
  }>({
    data: null,
    error: null,
    isLoading: true,
  });

  const fetch = useCallback(async () => {
    if (activePromises[key]) return;

    // If we don't have a property to filter for we don't need to fetch anything
    if (!filter?.value) return;

    activePromises[key] = (async () => {
      try {
        const res = (await client
          .from(table)
          .select(props)
          .filter(
            filter.prop,
            filter.operator,
            filter.value
          )) as PostgrestResponse<T>;

        const { data, error } = res;

        setSelectState({
          data: data as T[],
          error,
          isLoading: false,
        });

        setQueryKeys((prev) => {
          return {
            ...prev,
            [key]: data,
          };
        });
      } catch (error) {
      } finally {
        activePromises[key] = false;
      }
    })();
  }, [props, key, filter, setQueryKeys, table, activePromises]);

  useEffect(() => {
    if (queryKeys.hasOwnProperty(key)) {
      const item = Object.entries(queryKeys).find(([entriesKey, _]) => {
        if (entriesKey === key) {
          return true;
        }
      });

      if (!item) return;

      setSelectState({
        data: item[1] as T[],
        error: null,
        isLoading: false,
      });
    } else {
      fetch();
    }
  }, [fetch, key, queryKeys]);

  const { data, error, isLoading } = selectState;

  return [data, isLoading, error, fetch] as const;
};
