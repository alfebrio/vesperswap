import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export type TabType = 'swap' | 'token' | 'nft';

interface AppContextProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  solBalance: number | null;
  refreshBalance: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabType>('swap');
  const [solBalance, setSolBalance] = useState<number | null>(null);

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const refreshBalance = async () => {
    if (publicKey) {
      try {
        const balance = await connection.getBalance(publicKey);
        setSolBalance(balance / LAMPORTS_PER_SOL);
      } catch (err) {
        console.error("Failed to fetch balance:", err);
      }
    } else {
      setSolBalance(null);
    }
  };

  // Fetch balance on connection
  useEffect(() => {
    refreshBalance();
    
    // Set up a listener for real-time balance updates
    if (publicKey) {
      const id = connection.onAccountChange(
        publicKey,
        (account) => {
          setSolBalance(account.lamports / LAMPORTS_PER_SOL);
        },
        'confirmed'
      );
      return () => {
        connection.removeAccountChangeListener(id);
      };
    }
  }, [publicKey, connection]);

  return (
    <AppContext.Provider value={{ activeTab, setActiveTab, solBalance, refreshBalance }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
