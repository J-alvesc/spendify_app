import { createContext, useContext, type ReactNode } from 'react';
import { usePrivacy } from './usePrivacy';

interface PrivacyContextType {
  hideValues: boolean;
  toggleHideValues: () => void;
  formatPrivate: (value: string | number, formatter?: (v: number) => string) => string;
}

const PrivacyContext = createContext<PrivacyContextType | null>(null);

export function PrivacyProvider({ children }: { children: ReactNode }) {
  const privacy = usePrivacy();

  return (
    <PrivacyContext.Provider value={privacy}>
      {children}
    </PrivacyContext.Provider>
  );
}

export function usePrivacyContext() {
  const context = useContext(PrivacyContext);
  if (!context) {
    throw new Error('usePrivacyContext deve ser usado dentro de um PrivacyProvider');
  }
  return context;
}

