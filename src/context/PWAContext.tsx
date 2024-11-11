import React, { createContext, useContext } from 'react';

const PWAContext = createContext<boolean | undefined>(undefined);

export const PWAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isPWA = window.matchMedia('(display-mode: standalone)').matches;

  return (
    <PWAContext.Provider value={isPWA}>
      {children}
    </PWAContext.Provider>
  );
};

export const usePWA = () => {
  const context = useContext(PWAContext);
  if (context === undefined) {
    throw new Error('usePWA must be used within a PWAProvider');
  }
  return context;
}; 