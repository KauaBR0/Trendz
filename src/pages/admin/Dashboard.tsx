import { useApp } from '../../context/AppContext';
import { Users, ShoppingCart, DollarSign, Activity } from 'lucide-react';

export function AdminDashboard() {
  const { markets, bets } = useApp();

  const totalVolume = markets.reduce((acc, m) => {
    const vol = parseFloat(m.volume?.replace('R$', '').replace(',', '').replace('M', '000000').replace('K', '000') || '0');
    return acc + vol;
  }, 0);

  const activeMarkets = markets.filter(m => m.status === 'active').length;
  const totalBets = bets.length;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Visão Geral</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Volume Total" 
          value={`R$ ${(totalVolume / 1000000).toFixed(2)}M`} 
          icon={<DollarSign size={24} className="text-lime-500" />} 
        />
        <StatCard 
          title="Mercados Ativos" 
          value={activeMarkets.toString()} 
          icon={<ShoppingCart size={24} className="text-blue-500" />} 
        />
        <StatCard 
          title="Total de Apostas" 
          value={totalBets.toString()} 
          icon={<Activity size={24} className="text-purple-500" />} 
        />
        <StatCard 
          title="Usuários Ativos" 
          value="1,245" 
          icon={<Users size={24} className="text-orange-500" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Mercados Recentes</h3>
          <div className="space-y-4">
            {markets.slice(0, 5).map(market => (
              <div key={market.id} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-center gap-3">
                  <img src={market.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-bold text-white line-clamp-1">{market.title}</p>
                    <p className="text-xs text-gray-500">{market.category}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${market.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                  {market.status === 'active' ? 'Ativo' : 'Resolvido'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6">
          <h3 className="text-lg font-bold mb-4">Últimas Apostas</h3>
          <div className="space-y-4">
            {bets.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma aposta registrada ainda.</p>
            ) : (
              bets.slice(0, 5).map(bet => (
                <div key={bet.id} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#2a2a2a]">
                  <div>
                    <p className="text-sm font-bold text-white line-clamp-1">{bet.marketTitle}</p>
                    <p className="text-xs text-gray-500">{bet.choice} - {bet.odds}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-lime-500">R$ {bet.amount.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{new Date(bet.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string, icon: React.ReactNode }) {
  return (
    <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-xl p-6 flex items-center gap-4">
      <div className="p-4 bg-[#121212] rounded-xl border border-[#2a2a2a]">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
