import { trpc } from '../../src/utils/trpc';

export const useMembers = ({ teamId }: { teamId: string }) => {
  const { data, isLoading, refetch, error } = trpc.members.useQuery({
    teamId,
  });

  return [data, isLoading, refetch, error?.message] as const;
};
