import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import { trpc } from '../../src/utils/trpc';

export const useMembers = () => {
  const router = useRouter();
  const teamId = router.query.teamId as string | undefined;

  const cookies = parseCookies();
  const myTeamId = teamId || cookies.teamId;

  const { data, isLoading, refetch, error } = trpc.members.useQuery({
    teamId: myTeamId || '',
  });

  return [data, isLoading, refetch, error?.message] as const;
};
