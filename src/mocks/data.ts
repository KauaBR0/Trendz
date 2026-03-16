import { Market, User } from '../types';

export const mockUser: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao@gmail.com',
  avatar: 'https://picsum.photos/seed/joao/100/100',
  balance: 150.00,
};

export const mockMarkets: Market[] = [
  {
    id: 'bbb26',
    title: 'Quem vencerá o BBB 26?',
    image: 'https://picsum.photos/seed/bbb/100/100',
    type: 'multiple',
    category: 'Entretenimento',
    volume: 'R$4,243.78',
    endDate: 'Apr 21, 2026',
    options: [
      { id: 'opt1', name: 'Milena', image: 'https://picsum.photos/seed/milena/100/100', chance: 50, yesOdds: '1.07x', noOdds: '1.07x', yesReturn: 'R$52.69 -> R$56.53', noReturn: 'R$52.69 -> R$56.53' },
      { id: 'opt2', name: 'Gabriela', image: 'https://picsum.photos/seed/gabriela/100/100', chance: 50, yesOdds: '1.07x', noOdds: '1.07x', yesReturn: 'R$52.69 -> R$56.53', noReturn: 'R$52.69 -> R$56.53' },
      { id: 'opt3', name: 'Samira', image: 'https://picsum.photos/seed/samira/100/100', chance: 77, yesOdds: '1.01x', noOdds: '1.07x', yesReturn: 'R$52.69 -> R$53.05', noReturn: 'R$52.69 -> R$56.23' },
      { id: 'opt4', name: 'Ana Paula Renault', image: 'https://picsum.photos/seed/ana/100/100', chance: 63, yesOdds: '1.44x', noOdds: '1.01x', yesReturn: 'R$52.69 -> R$75.84', noReturn: 'R$52.69 -> R$52.98' },
      { id: 'opt5', name: 'Leandro', image: 'https://picsum.photos/seed/leandro/100/100', chance: 23, yesOdds: '1.22x', noOdds: '1.02x', yesReturn: 'R$52.69 -> R$64.17', noReturn: 'R$52.69 -> R$53.67' },
      { id: 'opt6', name: 'Alberto Cowboy', image: 'https://picsum.photos/seed/alberto/100/100', chance: 23, yesOdds: '1.38x', noOdds: '1.04x', yesReturn: 'R$52.69 -> R$72.65', noReturn: 'R$52.69 -> R$54.65' },
    ],
    rules: 'Este mercado prevê o vencedor do Big Brother Brasil 26. A resolução será baseada no anúncio oficial da TV Globo.',
    activity: [
      { user: 'HN7u...kD56q', action: 'comprou', choice: 'Sim', amount: '81.9¢', contracts: '2.29 Contratos', value: 'R$9.89', time: 'há 2 dias', avatar: 'https://picsum.photos/seed/u1/50/50' },
      { user: 'Predictor', action: 'comprou', choice: 'Não', amount: '22¢', contracts: '2.29 Contratos', value: 'R$2.66', time: 'há 2 dias', avatar: 'https://picsum.photos/seed/u2/50/50' },
    ]
  },
  {
    id: 'bbb26-eliminated',
    title: 'Quem será ELIMINADO no próximo Paredão do Big Brother Brasil 26?',
    image: 'https://picsum.photos/seed/bbb2/100/100',
    type: 'multiple',
    category: 'Entretenimento',
    volume: 'R$1,243.00',
    endDate: 'Mar 24, 2026',
    options: [
      { id: 'opt1', name: 'Breno', image: 'https://picsum.photos/seed/breno/50/50', chance: 0, yesOdds: '0.00x', noOdds: '0.00x', yesReturn: 'R$0.00 -> R$0.00', noReturn: 'R$0.00 -> R$0.00' },
      { id: 'opt2', name: 'Ana Paula Renault', image: 'https://picsum.photos/seed/ana/50/50', chance: 0, yesOdds: '0.00x', noOdds: '0.00x', yesReturn: 'R$0.00 -> R$0.00', noReturn: 'R$0.00 -> R$0.00' },
      { id: 'opt3', name: 'Leandro', image: 'https://picsum.photos/seed/leandro/50/50', chance: 0, yesOdds: '0.00x', noOdds: '0.00x', yesReturn: 'R$0.00 -> R$0.00', noReturn: 'R$0.00 -> R$0.00' },
    ],
    rules: 'Este mercado prevê o próximo eliminado do BBB 26.',
    activity: []
  },
  {
    id: 'trump-iran',
    title: 'Trump declarará o fim das operações dos EUA no Irã até 31/03/2026?',
    image: 'https://picsum.photos/seed/trump/100/100',
    type: 'binary',
    category: 'Política',
    volume: 'R$218.42',
    endDate: 'Mar 31, 2026',
    binaryData: {
      yesChance: 22,
      noChance: 78,
      yesOdds: '1.38x',
      noOdds: '1.22x',
      yesReturn: 'R$52.69 -> R$72.81',
      noReturn: 'R$52.69 -> R$64.31'
    },
    rules: 'Este mercado prevê se Donald Trump declarará o fim das operações militares dos EUA no Irã até 31/03/2026 (BRT). Resolve como SIM se, até 31/03/2026 23:59 (BRT), a Casa Branca publicar em...',
    activity: [
      { user: 'HN7u...kD56q', action: 'comprou', choice: 'Não', amount: '81.9¢', contracts: '2.29 Contratos', value: 'R$9.89', time: 'há 2 dias', avatar: 'https://picsum.photos/seed/u1/50/50' },
      { user: 'Predictor', action: 'comprou', choice: 'Sim', amount: '22¢', contracts: '2.29 Contratos', value: 'R$2.66', time: 'há 2 dias', avatar: 'https://picsum.photos/seed/u2/50/50' },
    ]
  },
  {
    id: 'buzeira',
    title: 'Buzeira será solto em 2026?',
    image: 'https://picsum.photos/seed/buzeira/100/100',
    type: 'binary',
    category: 'Celebridades',
    volume: 'R$1,542.10',
    endDate: 'Dec 31, 2026',
    binaryData: {
      yesChance: 39,
      noChance: 61,
      yesOdds: '1.33x',
      noOdds: '1.08x',
      yesReturn: 'R$52.69 -> R$69.89',
      noReturn: 'R$52.69 -> R$57.13'
    },
    rules: 'Este mercado prevê se o influenciador Buzeira será solto da prisão até o final de 2026.',
    activity: []
  },
  {
    id: 'virginia',
    title: 'Virginia Fonseca anunciará projeto com a Globo até 31/03/2026?',
    image: 'https://picsum.photos/seed/virginia/100/100',
    type: 'binary',
    category: 'Celebridades',
    volume: 'R$890.50',
    endDate: 'Mar 31, 2026',
    binaryData: {
      yesChance: 42,
      noChance: 58,
      yesOdds: '1.45x',
      noOdds: '1.13x',
      yesReturn: 'R$52.69 -> R$76.58',
      noReturn: 'R$52.69 -> R$59.32'
    },
    rules: 'Este mercado prevê se Virginia Fonseca anunciará oficialmente um projeto com a TV Globo até 31/03/2026.',
    activity: []
  }
];
