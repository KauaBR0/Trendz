import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Wallet, Ticket, History, ArrowRight } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { RightSidebar } from '../components/RightSidebar';

export function UserDashboard() {
  const { profile, user } = useAuth();
  const { bets } = useApp();

  if (!user && !profile) return null;

  if (profile?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuário';
  const displayEmail = profile?.email || user?.email || '';
  const displayAvatar = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayEmail}`;
  const displayBalance = profile?.balance ?? 0;

  const totalBets = bets.length;
  // Mocking some stats
  const winRate = bets.length > 0 ? '64%' : '0%';
  const totalWinnings = bets.reduce((acc, bet) => acc + (bet.choice === 'Sim' ? bet.potentialReturn * 0.5 : 0), 0);

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      <div className="flex-1 space-y-8 w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img 
              src={displayAvatar} 
              alt={displayName} 
              className="w-16 h-16 rounded-full border-2 border-lime-500 object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">Olá, {displayName}</h1>
              <p className="text-gray-400">{displayEmail}</p>
            </div>
          </div>
        </div>

        {/* Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Saldo Disponível</span>
              <Wallet className="text-lime-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">R$ {displayBalance.toFixed(2)}</span>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 bg-lime-500 hover:bg-lime-400 text-black font-bold py-2 rounded-lg transition-colors text-sm">
                Depositar
              </button>
              <button className="flex-1 bg-[#2a2a2a] hover:bg-[#333] text-white font-bold py-2 rounded-lg transition-colors text-sm">
                Sacar
              </button>
            </div>
          </div>

          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Previsões Abertas</span>
              <Ticket className="text-blue-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">{totalBets}</span>
            <p className="text-xs text-gray-500 mt-2">Ativas no momento</p>
          </div>

          <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 font-medium">Ganhos / Win Rate</span>
              <History className="text-purple-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">R$ {totalWinnings.toFixed(2)}</span>
            <p className="text-xs text-lime-500 font-medium mt-2">{winRate} de vitórias</p>
          </div>
        </div>

        {/* Histórico Recente */}
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Previsões Recentes</h2>
            <Link to="/" className="text-lime-500 hover:text-lime-400 text-sm font-medium flex items-center gap-1 transition-colors">
              Fazer Nova Previsão <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="p-6">
            {bets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="mx-auto text-gray-600 mb-4" size={48} />
                <p className="text-gray-400 mb-4">Você ainda não fez nenhuma previsão.</p>
                <Link 
                  to="/" 
                  className="inline-block bg-lime-500 hover:bg-lime-400 text-black font-bold py-2 px-6 rounded-xl transition-colors"
                >
                  Explorar Mercados
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bets.slice(0, 5).map(bet => (
                  <div key={bet.id} className="bg-[#121212] rounded-xl p-4 border border-[#2a2a2a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-white font-medium text-sm sm:text-base line-clamp-1">{bet.marketTitle}</h3>
                      <p className="text-gray-400 text-xs sm:text-sm mt-1">Opção: <span className="text-white">{bet.optionName}</span></p>
                    </div>
                    
                    <div className="flex items-center gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs text-gray-500 mb-1">Escolha / Odds</p>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${bet.choice === 'Sim' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {bet.choice} @ {bet.odds}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Investido</p>
                        <span className="text-sm font-bold text-white">R$ {bet.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 mb-1">Retorno Potencial</p>
                        <span className="text-sm font-bold text-lime-500">R$ {bet.potentialReturn.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-96 shrink-0 hidden lg:block">
        <RightSidebar />
      </div>
    </div>
  );
}
