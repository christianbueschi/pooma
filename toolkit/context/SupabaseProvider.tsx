import { useRouter } from 'next/router';
import { parseCookies, setCookie } from 'nookies';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { CardMode } from '../components/CreateModal';
import { useCreateMember } from '../hooks/useCreateMember';
import { useCreateTeam } from '../hooks/useCreateTeam';
import { useMember } from '../hooks/useMember';
import { useTeam } from '../hooks/useTeam';
import { Member, Team } from '../types';

export const SupabaseContext = createContext<SupabaseContextType>(null!);

type SupabaseContextType = {
  useTeamContext: () => readonly [
    Team | null | undefined,
    boolean,
    any,
    (id: string) => Promise<void>
  ];
  useMemberContext: () => readonly [Member | null | undefined, boolean, any];
  useCreateTeam: () => {
    createTeam: ({
      name,
      cardMode,
    }: {
      name: string;
      cardMode: CardMode;
    }) => Promise<
      readonly [team: Team, error: null] | readonly [team: null, error: any]
    >;
    teamCreating: boolean;
  };
  useCreateMember: () => {
    createMember: ({
      name,
      teamId,
    }: {
      name: string;
      teamId: string;
    }) => Promise<
      | readonly [member: Member, error: null]
      | readonly [member: null, error: any]
    >;
    memberCreating: boolean;
  };
  showJoinModal: boolean;
  setShowJoinModal: Dispatch<SetStateAction<boolean>>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
  children,
}) => {
  const router = useRouter();

  const cookies = parseCookies();

  if (router.query.teamId) {
    setCookie(null, 'teamId', router.query.teamId as string);
  }

  const [teamId, setTeamId] = useState(cookies.teamId);
  const [memberId, setMemberId] = useState<string>(cookies.memberId);

  useEffect(() => {
    if (!cookies) return;

    if (cookies.teamId) {
      setTeamId(cookies.teamId);
    }

    if (cookies.memberId) {
      setMemberId(cookies.memberId);
    }
  }, [cookies]);

  // NB: We can not just pass the hooks to the context, because the provider needs to be aware of the changes.
  // There we create new consts here and pass those to the context.
  const [team, isTeamLoading, isTeamError, fetchTeam] = useTeam(teamId);
  const [member, isMemberLoading, isMemberError] = useMember(memberId);

  const useTeamHook = () => {
    return [team, isTeamLoading, isTeamError, fetchTeam] as const;
  };

  const useMemberHook = () => {
    return [member, isMemberLoading, isMemberError] as const;
  };

  const [showJoinModal, setShowJoinModal] = useState(false);

  const contextValue = {
    teamId,
    memberId,
    showJoinModal,
    setShowJoinModal,
    useTeamContext: useTeamHook,
    useMemberContext: useMemberHook,
    useCreateTeam,
    useCreateMember,
  };

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
};
