import { trpc } from '../../src/utils/trpc';

export const useTeam = ({ id }: { id: string }) => {
  const { data, isLoading, refetch, error } = trpc.team.useQuery({
    id,
  });

  return [data, isLoading, refetch, error?.message] as const;
};
