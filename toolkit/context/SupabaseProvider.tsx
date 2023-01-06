import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Member, Team } from '../types';

export const SupabaseContext = createContext<SupabaseContextType>({
  team: null,
  member: null,
  teamId: undefined,
  memberId: undefined,
  setTeam: () => {},
  setMember: () => {},
  showJoinModal: false,
  setShowJoinModal: () => {},
});

type SupabaseContextType = {
  team: Team | null | undefined;
  member: Member | null | undefined;
  teamId: string | undefined;
  setTeam: Dispatch<SetStateAction<Team | null | undefined>>;
  memberId: string | undefined;
  setMember: Dispatch<SetStateAction<Member | null | undefined>>;
  showJoinModal: boolean;
  setShowJoinModal: Dispatch<SetStateAction<boolean>>;
};

type SupabaseProviderProps = {
  children: React.ReactNode;
};

export const useSupabaseContext = () => {
  const context = useContext(SupabaseContext);

  if (context === undefined) {
    throw new Error(
      'useSupabaseContext must be used within a SupabaseProvider'
    );
  }
  return context;
};

export const SupabaseProvider: React.FC<SupabaseProviderProps> = ({
  children,
}) => {
  const router = useRouter();

  const cookies = parseCookies();

  const [teamId, setTeamId] = useState<string>(router.query.teamId as string);
  const [memberId, setMemberId] = useState<string>();

  const [team, setTeam] = useState<Team | null>();
  const [member, setMember] = useState<Member | null>();

  useEffect(() => {
    if (router.query.teamId) {
      setTeamId(router.query.teamId as string);
    } else if (cookies.teamId) {
      setTeamId(cookies.teamId);
    }

    if (cookies.memberId) {
      setMemberId(cookies.memberId);
    }
  }, [router.query.teamId, cookies.teamId, cookies.memberId, router]);

  const [showJoinModal, setShowJoinModal] = useState(false);

  const contextValue = {
    showJoinModal,
    setShowJoinModal,
    teamId,
    team,
    setTeam,
    memberId,
    member,
    setMember,
  };

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
};
