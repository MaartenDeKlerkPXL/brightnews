"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AppContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('NL'); // Standaard taal op NL

  return (
    <AppContext.Provider value={{ language, setLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp moet binnen een AppProvider worden gebruikt');
  }
  return context;
}