import { destroyCookie, parseCookies } from 'nookies';
import { useEffect } from 'react';
import { trpc } from '../../src/utils/trpc';

export const useMember = () => {
  const cookies = parseCookies();
  const myMemberId = cookies.memberId;

  const { data, isLoading, refetch, error } = trpc.member.useQuery({
    id: myMemberId || '',
  });

  useEffect(() => {
    if (!data && !isLoading) {
      destroyCookie({}, 'memberId', { path: '/' });
      return;
    }
  }, [data, isLoading]);

  return [data, isLoading, refetch, error?.message] as const;
};
