import { createContext, useContext, useEffect, type ReactNode } from 'react';

import {
  setConsent,
  syncConsentServices,
  useConsentStatus,
  type ConsentStatus,
} from '../../lib/privacyConsent';

type PrivacyConsentContextValue = {
  status: ConsentStatus;
  setConsent: (status: 'granted' | 'denied') => Promise<void>;
};

const PrivacyConsentContext = createContext<PrivacyConsentContextValue>({
  status: 'undetermined',
  setConsent,
});

export type PrivacyConsentProviderProps = {
  children: ReactNode;
};

export function PrivacyConsentProvider({ children }: PrivacyConsentProviderProps) {
  const status = useConsentStatus();

  useEffect(() => {
    void syncConsentServices(status);
  }, [status]);

  return (
    <PrivacyConsentContext.Provider
      value={{
        status,
        setConsent,
      }}
    >
      {children}
    </PrivacyConsentContext.Provider>
  );
}

export function usePrivacyConsent() {
  return useContext(PrivacyConsentContext);
}
