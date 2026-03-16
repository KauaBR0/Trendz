import { useState } from 'react';
import { Ticket, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export function RightSidebar() {
  const location = useLocation();
  const { user, selectedBet, selectBet, placeBet, bets } = useApp();
  const [activeTab, setActiveTab] = useState<'previsao' | 'abertas'>('previsao');
  const [amount, setAmount] = useState<string>('10');

  const isMarketPage = location.pathname.startsWith('/market/');
  const numAmount = parseFloat(amount) || 0;
  const potentialReturn = numAmount * (selectedBet?.potentialReturn || 0) / 52.69; // Using the mock ratio

  const handlePlaceBet = () => {
    if (!user) {
      alert('Por favor, faça login para apostar.');
      return;
    }
    placeBet(numAmount);
  };

  return (
    <aside className="w-80 bg-[#121212] border-l border-[#2a2a2a] flex flex-col h-screen sticky top-0 overflow-y-auto hidden lg:flex">
      <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('previsao')}
            className={`font-bold text-lg pb-1 transition-colors ${activeTab === 'previsao' ? 'text-white border-b-2 border-lime-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Previsão
          </button>
          <button 
            onClick={() => setActiveTab('abertas')}
            className={`font-bold text-lg pb-1 transition-colors flex items-center gap-2 ${activeTab === 'abertas' ? 'text-white border-b-2 border-lime-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            Abertas
            {bets.length > 0 && (
              <span className="bg-lime-500 text-black text-xs px-1.5 py-0.5 rounded-full">{bets.length}</span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        {activeTab === 'previsao' ? (
          <>
            <div className="bg-[#1e1e1e] rounded-full px-4 py-1.5 text-xs font-semibold text-gray-400 mb-6 text-center mx-auto">
              1. Escolha sua Previsão
            </div>
            
            {!selectedBet ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center">
                <div className="w-24 h-24 bg-[#1e1e1e] rounded-full flex items-center justify-center mb-6">
                  <Ticket size={48} className="text-gray-600 -rotate-45" />
                </div>
                <p className="text-gray-400 text-sm">
                  {isMarketPage ? 'Selecione uma opção no mercado ao lado.' : 'Você ainda não escolheu um Mercado.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 flex-1">
                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#2a2a2a] relative">
                  <button 
                    onClick={() => selectBet(null)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                  <p className="text-xs text-gray-400 mb-1">{selectedBet.marketTitle}</p>
                  <p className="font-bold text-white mb-3">{selectedBet.optionName || 'Mercado Binário'}</p>
                  
                  <div className={`flex items-center justify-between p-3 rounded-lg ${selectedBet.choice === 'Sim' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                    <span className="font-bold">{selectedBet.choice}</span>
                    <span className="font-bold">{selectedBet.odds}</span>
                  </div>
                </div>

                <div className="bg-[#1e1e1e] rounded-xl p-4 border border-[#2a2a2a]">
                  <label className="text-xs text-gray-400 block mb-2">Valor da Previsão (R$)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-[#121212] border border-[#2a2a2a] rounded-lg p-3 text-white font-bold text-lg focus:outline-none focus:border-lime-500"
                    min="1"
                  />
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#2a2a2a]">
                    <span className="text-sm text-gray-400">Retorno Potencial</span>
                    <span className="text-lg font-bold text-green-500">R$ {potentialReturn.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handlePlaceBet}
                  disabled={!user || numAmount <= 0 || (user && user.balance < numAmount)}
                  className="w-full bg-lime-500 hover:bg-lime-400 disabled:bg-[#2a2a2a] disabled:text-gray-500 text-black font-bold py-4 rounded-xl transition-colors mt-auto"
                >
                  {!user ? 'Faça Login para Apostar' : user.balance < numAmount ? 'Saldo Insuficiente' : 'Confirmar Previsão'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-4">
            {bets.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-gray-400 text-sm">Nenhuma previsão aberta.</p>
              </div>
            ) : (
              bets.map(bet => (
                <div key={bet.id} className="bg-[#1e1e1e] rounded-xl p-4 border border-[#2a2a2a]">
                  <p className="text-xs text-gray-400 mb-1 line-clamp-2">{bet.marketTitle}</p>
                  <p className="font-bold text-white mb-3">{bet.optionName}</p>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${bet.choice === 'Sim' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {bet.choice} @ {bet.odds}
                    </span>
                    <span className="text-xs text-gray-400">R$ {bet.amount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-[#2a2a2a]">
                    <span className="text-xs text-gray-400">Retorno Potencial</span>
                    <span className="text-sm font-bold text-green-500">R$ {bet.potentialReturn.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#2a2a2a] text-center">
        <p className="text-xs text-gray-500">
          Ao realizar uma previsão, você aceita os <a href="#" className="text-gray-400 underline hover:text-white">Termos de Serviço</a>.
        </p>
      </div>
    </aside>
  );
}
