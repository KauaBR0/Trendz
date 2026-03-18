import { ArrowRight, History, Ticket, Wallet } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { RightSidebar } from '../components/RightSidebar';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export function UserDashboard() {
  const { profile, user } = useAuth();
  const { bets } = useApp();

  if (!user && !profile) {
    return null;
  }

  if (profile?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const displayName = profile?.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Usuario';
  const displayEmail = profile?.email || user?.email || '';
  const displayAvatar = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayEmail}`;
  const displayBalance = profile?.balance ?? 0;
  const totalBets = bets.length;
  const winRate = bets.length > 0 ? '64%' : '0%';
  const totalWinnings = bets.reduce(
    (accumulator, bet) => accumulator + (bet.choice === 'Sim' ? bet.potentialReturn * 0.5 : 0),
    0
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-8 lg:flex-row">
      <div className="w-full flex-1 space-y-8">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <img src={displayAvatar} alt={displayName} className="h-16 w-16 rounded-full border-2 border-lime-500 object-cover" />
            <div>
              <h1 className="text-2xl font-bold text-white">Ola, {displayName}</h1>
              <p className="text-gray-400">{displayEmail}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-gray-400">Saldo Disponivel</span>
              <Wallet className="text-lime-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">R$ {displayBalance.toFixed(2)}</span>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 rounded-lg bg-lime-500 py-2 text-sm font-bold text-black transition-colors hover:bg-lime-400">
                Depositar
              </button>
              <button className="flex-1 rounded-lg bg-[#2a2a2a] py-2 text-sm font-bold text-white transition-colors hover:bg-[#333]">
                Sacar
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-gray-400">Previsoes Abertas</span>
              <Ticket className="text-blue-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">{totalBets}</span>
            <p className="mt-2 text-xs text-gray-500">Ativas no momento</p>
          </div>

          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e] p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-medium text-gray-400">Ganhos / Win Rate</span>
              <History className="text-purple-500" size={24} />
            </div>
            <span className="text-3xl font-bold text-white">R$ {totalWinnings.toFixed(2)}</span>
            <p className="mt-2 text-xs font-medium text-lime-500">{winRate} de vitorias</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1e1e1e]">
          <div className="flex items-center justify-between border-b border-[#2a2a2a] p-6">
            <h2 className="text-lg font-bold text-white">Previsoes Recentes</h2>
            <Link to="/" className="flex items-center gap-1 text-sm font-medium text-lime-500 transition-colors hover:text-lime-400">
              Fazer Nova Previsao <ArrowRight size={16} />
            </Link>
          </div>

          <div className="p-6">
            {bets.length === 0 ? (
              <div className="py-8 text-center">
                <Ticket className="mx-auto mb-4 text-gray-600" size={48} />
                <p className="mb-4 text-gray-400">Voce ainda nao fez nenhuma previsao.</p>
                <Link to="/" className="inline-block rounded-xl bg-lime-500 px-6 py-2 font-bold text-black transition-colors hover:bg-lime-400">
                  Explorar Mercados
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bets.slice(0, 5).map(bet => (
                  <div key={bet.id} className="flex flex-col justify-between gap-4 rounded-xl border border-[#2a2a2a] bg-[#121212] p-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="line-clamp-1 text-sm font-medium text-white sm:text-base">{bet.marketTitle}</h3>
                      <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Opcao: <span className="text-white">{bet.optionName}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-4 sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="mb-1 text-xs text-gray-500">Escolha / Odds</p>
                        <span className={`rounded px-2 py-1 text-xs font-bold ${bet.choice === 'Sim' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                          {bet.choice} @ {bet.odds}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="mb-1 text-xs text-gray-500">Investido</p>
                        <span className="text-sm font-bold text-white">R$ {bet.amount.toFixed(2)}</span>
                      </div>
                      <div className="text-right">
                        <p className="mb-1 text-xs text-gray-500">Retorno Potencial</p>
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

      <div className="hidden w-full shrink-0 lg:block lg:w-96">
        <RightSidebar />
      </div>
    </div>
  );
}
