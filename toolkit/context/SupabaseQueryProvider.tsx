import { RealtimeChannel } from '@supabase/supabase-js';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from 'react';

export const SupabaseQueryContext = createContext<SupabaseQueryContextType>({
  queryKeys: [],
  setQueryKeys: () => {},
  activePromises: {},
  activeSubscriptions: {},
});

type SupabaseQueryContextType = {
  queryKeys: { [key: string]: any };
  setQueryKeys: Dispatch<SetStateAction<{ [key: string]: any }>>;
  activePromises: { [key: string]: Promise<any> | boolean };
  activeSubscriptions: { [key: string]: RealtimeChannel };
};

type SupabaseQueryProviderProps = {
  children: React.ReactNode;
};

export const useSupabaseQueryContext = () => {
  const context = useContext(SupabaseQueryContext);

  if (context === undefined) {
    throw new Error(
      'useSupabaseQueryContext must be used within a SupabaseQueryProvider'
    );
  }
  return context;
};

export const SupabaseQueryProvider: React.FC<SupabaseQueryProviderProps> = ({
  children,
}) => {
  const [queryKeys, setQueryKeys] = useState<{ [key: string]: any }>({});
  console.log('🚀 ~ file: SupabaseQueryProvider.tsx:38 ~ queryKeys', queryKeys);

  const activePromisesRef = useRef<{ [key: string]: Promise<any> | false }>({});
  const activeSubscriptionsRef = useRef<{
    [key: string]: RealtimeChannel;
  }>({});

  console.log(
    '🚀 ~ file: SupabaseQueryProvider.tsx:52 ~ activeSubscriptionsRef',
    activeSubscriptionsRef
  );
  const contextValue = {
    queryKeys,
    setQueryKeys,
    activePromises: activePromisesRef.current,
    activeSubscriptions: activeSubscriptionsRef.current,
  };

  return (
    <SupabaseQueryContext.Provider value={contextValue}>
      {children}
    </SupabaseQueryContext.Provider>
  );
};
