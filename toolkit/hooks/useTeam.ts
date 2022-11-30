import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { trpc } from '../../src/utils/trpc';

export const useTeam = (id?: string) => {
  const router = useRouter();
  const teamId = id || (router.query.teamId as string | undefined);

  const cookies = parseCookies();
  const myTeamId = teamId || cookies.teamId;

  const { data, isLoading, refetch, error } = trpc.team.useQuery({
    id: myTeamId || '',
  });

  return [data, isLoading, refetch, error?.message] as const;
};
