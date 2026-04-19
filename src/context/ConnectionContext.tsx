import React, { createContext, useContext, useState, useEffect } from 'react';

interface ConnectionContextType {
  isOffline: boolean;
  lowDataMode: boolean;
  setLowDataMode: (v: boolean) => void;
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

export function ConnectionProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lowDataMode, setLowDataMode] = useState(() => {
    // Initial check: if connection is slow (2g/3g), enable data saver automatically
    const conn = (navigator as any).connection;
    if (conn && (conn.saveData || /2g|3g/.test(conn.effectiveType))) {
      return true;
    }
    return localStorage.getItem('lowDataMode') === 'true';
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('lowDataMode', String(lowDataMode));
  }, [lowDataMode]);

  return (
    <ConnectionContext.Provider value={{ isOffline, lowDataMode, setLowDataMode }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (!context) throw new Error('useConnection must be used within ConnectionProvider');
  return context;
}
