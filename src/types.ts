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
  status?: 'active' | 'resolved' | 'cancelled';
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
  role?: 'admin' | 'user';
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

export type EditorialWorkflowStatus =
  | 'rascunho'
  | 'em_revisao'
  | 'aprovado'
  | 'publicado'
  | 'travado'
  | 'em_resolucao'
  | 'resolvido'
  | 'cancelado';

export type EditorialMarketType = 'binario' | 'multipla_escolha';

export interface EditorialEvent {
  id: string;
  title: string;
  category: string;
  subtype: string;
  description: string;
  image: string;
  region: string;
  eventDate: string;
  status: EditorialWorkflowStatus;
  tags: string[];
  marketCount: number;
  owner: string;
  lastUpdated: string;
}

export interface EditorialMarketOption {
  id: string;
  label: string;
}

export interface EditorialMarket {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  question: string;
  marketType: EditorialMarketType;
  status: EditorialWorkflowStatus;
  closeAt: string;
  resolutionRule: string;
  cancellationRule: string;
  officialSources: string[];
  options: EditorialMarketOption[];
  owner: string;
  reviewer?: string;
  resolver?: string;
  riskLevel: 'baixo' | 'medio' | 'alto';
  notes?: string;
  template: string;
  lastUpdated: string;
}

export interface EditorialTemplate {
  id: string;
  label: string;
  category: string;
  marketType: EditorialMarketType;
  description: string;
  questionExample: string;
  defaultSources: string[];
  checklist: string[];
}
