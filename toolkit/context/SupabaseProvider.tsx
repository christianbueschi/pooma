import { useRouter } from 'next/router';
import { parseCookies, setCookie } from 'nookies';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { COOKIE_OPTIONS } from '../components/constants';
import { Member, Team } from '../types';

export const SupabaseContext = createContext<SupabaseContextType>({
  team: null,
  member: null,
  teamId: undefined,
  memberId: undefined,
  setTeam: () => {},
  setTeamId: () => {},
  setMember: () => {},
  setMemberId: () => {},
  showJoinModal: false,
  setShowJoinModal: () => {},
});

type SupabaseContextType = {
  team: Team | null | undefined;
  member: Member | null | undefined;
  teamId: string | undefined;
  setTeam: Dispatch<SetStateAction<Team | null | undefined>>;
  setTeamId: Dispatch<SetStateAction<string | undefined>>;
  memberId: string | undefined;
  setMember: Dispatch<SetStateAction<Member | null | undefined>>;
  setMemberId: Dispatch<SetStateAction<string | undefined>>;
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

  const [teamId, setTeamId] = useState<string | undefined>(
    router.query.teamId as string | undefined
  );

  const [memberId, setMemberId] = useState<string | undefined>(
    cookies.memberId || undefined
  );

  const [team, setTeam] = useState<Team | null>();
  const [member, setMember] = useState<Member | null>();

  useEffect(() => {
    if (teamId) {
      setCookie(null, 'teamId', teamId, COOKIE_OPTIONS);
    }

    if (memberId) {
      setCookie(null, 'memberId', memberId, COOKIE_OPTIONS);
    }
  }, [teamId, memberId]);

  const [showJoinModal, setShowJoinModal] = useState(false);

  const contextValue = {
    showJoinModal,
    setShowJoinModal,
    teamId,
    team,
    setTeam,
    setTeamId,
    memberId,
    member,
    setMember,
    setMemberId,
  };

  return (
    <SupabaseContext.Provider value={contextValue}>
      {children}
    </SupabaseContext.Provider>
  );
};
