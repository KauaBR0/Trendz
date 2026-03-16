export interface BetOption {
  id: string;
  name: string;
  image?: string;
  chance?: number;
  yesOdds: string;
  noOdds: string;
  yesReturn?: string;
  noReturn?: string;
}

export interface Activity {
  user: string;
  action: string;
  choice: string;
  amount: string;
  contracts: string;
  value: string;
  time: string;
  avatar: string;
}

export interface Market {
  id: string;
  title: string;
  image: string;
  type: 'binary' | 'multiple';
  category: string;
  volume?: string;
  endDate?: string;
  options?: BetOption[];
  binaryData?: {
    yesChance: number;
    noChance: number;
    yesOdds: string;
    noOdds: string;
    yesReturn: string;
    noReturn: string;
  };
  rules?: string;
  activity?: Activity[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
}

export interface Bet {
  id: string;
  marketId: string;
  marketTitle: string;
  optionName: string;
  choice: 'Sim' | 'Não';
  amount: number;
  odds: string;
  potentialReturn: number;
  createdAt: string;
}
