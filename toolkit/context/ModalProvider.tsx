import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

export const ModalContext = createContext<ModalContextType>({
  showJoinModal: false,
  setShowJoinModal: () => {},
});

type ModalContextType = {
  showJoinModal: boolean;
  setShowJoinModal: Dispatch<SetStateAction<boolean>>;
};

type MoalProviderProps = {
  children: React.ReactNode;
};

export const useModalContext = () => {
  const context = useContext(ModalContext);

  if (context === undefined) {
    throw new Error('useModalContext must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider: React.FC<MoalProviderProps> = ({ children }) => {
  const [showJoinModal, setShowJoinModal] = useState(false);

  const contextValue = {
    showJoinModal,
    setShowJoinModal,
  };

  return (
    <ModalContext.Provider value={contextValue}>
      {children}
    </ModalContext.Provider>
  );
};
