import { destroyCookie } from 'nookies';
import { useEffect } from 'react';
import { trpc } from '../../src/utils/trpc';

type UseMemberType = {
  id: string;
  teamId: string;
};

export const useMember = ({ id, teamId }: UseMemberType) => {
  const { data, isLoading, refetch, error } = trpc.member.useQuery({
    id,
    teamId,
  });

  useEffect(() => {
    if (!data && !isLoading) {
      destroyCookie({}, 'memberId', { path: '/' });
      return;
    }
  }, [data, isLoading]);

  return [data, isLoading, refetch, error?.message] as const;
};
