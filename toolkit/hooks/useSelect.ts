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

  console.log('🚀 ~ file: useSelect.ts:18 ~ key ~ key', key);

  const { queryKeys, setQueryKeys, activePromises, activeSubscriptions } =
    useContext(SupabaseQueryContext);

  const { filter, props, shouldSubscribe } = options || {};

  const subscribeToUpdates = useCallback(() => {
    console.log('subscribing');
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

          console.log('🚀 ~ file: useSelect.ts:48 ~ payload', payload);

          setSelectState((prev) => {
            console.log(
              '🚀 ~ file: useSelect.ts:87 ~ setSelectState ~ prev',
              prev
            );
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
            console.log(
              '🚀 ~ file: useSelect.ts:106 ~ setQueryKeys ~ prev',
              prev
            );
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
    console.log('EFFECT useSelect.ts:74');
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

        console.log(
          '🚀 ~ file: useSelect.ts:167 ~ activePromises[key]= ~ setSelectState'
        );
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
    console.log('EFFECT useSelect.ts:127');
    if (queryKeys.hasOwnProperty(key)) {
      const item = Object.entries(queryKeys).find(([entriesKey, _]) => {
        if (entriesKey === key) {
          return true;
        }
      });

      if (!item) return;

      console.log('🚀 ~ file: useSelect.ts:196 ~ useEffect ~ setSelectState');

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

  console.log('🚀 ~ file: useSelect.ts:153 ~ useSelect ~ data', data);
  return [data, isLoading, error, fetch] as const;
};
