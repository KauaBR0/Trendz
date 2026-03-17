import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Market, Bet, BetOption } from '../types';
import { mockUser, mockMarkets } from '../mocks/data';

interface SelectedBet {
  marketId: string;
  marketTitle: string;
  optionId?: string;
  optionName?: string;
  choice: 'Sim' | 'Não';
  odds: string;
  potentialReturn: number;
}

interface AppContextType {
  user: User | null;
  markets: Market[];
  searchQuery: string;
  selectedBet: SelectedBet | null;
  bets: Bet[];
  login: () => void;
  logout: () => void;
  setSearchQuery: (query: string) => void;
  selectBet: (bet: SelectedBet | null) => void;
  placeBet: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [markets] = useState<Market[]>(mockMarkets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBet, setSelectedBet] = useState<SelectedBet | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);

  const login = () => {
    setUser(mockUser);
  };

  const logout = () => {
    setUser(null);
    setBets([]);
  };

  const placeBet = (amount: number) => {
    if (!user || !selectedBet) return;
    
    if (user.balance < amount) {
      alert('Saldo insuficiente');
      return;
    }

    const newBet: Bet = {
      id: crypto.randomUUID(),
      marketId: selectedBet.marketId,
      marketTitle: selectedBet.marketTitle,
      optionName: selectedBet.optionName || 'Mercado Binário',
      choice: selectedBet.choice,
      amount,
      odds: selectedBet.odds,
      potentialReturn: selectedBet.potentialReturn,
      createdAt: new Date().toISOString(),
    };

    setBets(prev => [newBet, ...prev]);
    setUser(prev => prev ? { ...prev, balance: prev.balance - amount } : null);
    setSelectedBet(null);
  };

  return (
    <AppContext.Provider value={{
      user,
      markets,
      searchQuery,
      selectedBet,
      bets,
      login,
      logout,
      setSearchQuery,
      selectBet: setSelectedBet,
      placeBet
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
