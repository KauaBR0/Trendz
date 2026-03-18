import { createContext, useContext, useState, type ReactNode } from 'react';
import { Bet, Market } from '../types';
import { mockMarkets } from '../mocks/data';

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
  markets: Market[];
  searchQuery: string;
  selectedBet: SelectedBet | null;
  bets: Bet[];
  setSearchQuery: (query: string) => void;
  selectBet: (bet: SelectedBet | null) => void;
  placeBet: (amount: number, balance: number) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [markets] = useState<Market[]>(mockMarkets);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBet, setSelectedBet] = useState<SelectedBet | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);

  const placeBet = (amount: number, balance: number): boolean => {
    if (!selectedBet) {
      return false;
    }

    if (balance < amount) {
      alert('Saldo insuficiente');
      return false;
    }

    const newBet: Bet = {
      id: Math.random().toString(36).substr(2, 9),
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
    setSelectedBet(null);
    return true;
  };

  return (
    <AppContext.Provider value={{
      markets,
      searchQuery,
      selectedBet,
      bets,
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
