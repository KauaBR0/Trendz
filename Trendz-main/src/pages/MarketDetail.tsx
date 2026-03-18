import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Link as LinkIcon, CheckCircle2, XCircle, ChevronUp } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function MarketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { markets, selectBet } = useApp();
  
  const market = markets.find(m => m.id === id) || markets[0];

  const handleSelectBet = (choice: 'Sim' | 'Não', option?: any) => {
    if (market.type === 'multiple' && option) {
      selectBet({
        marketId: market.id,
        marketTitle: market.title,
        optionId: option.id,
        optionName: option.name,
        choice,
        odds: choice === 'Sim' ? option.yesOdds : option.noOdds,
        potentialReturn: choice === 'Sim' 
          ? parseFloat(option.yesReturn?.split(' -> ')[1].replace('R$', '') || '0')
          : parseFloat(option.noReturn?.split(' -> ')[1].replace('R$', '') || '0')
      });
    } else if (market.type === 'binary' && market.binaryData) {
      selectBet({
        marketId: market.id,
        marketTitle: market.title,
        choice,
        odds: choice === 'Sim' ? market.binaryData.yesOdds : market.binaryData.noOdds,
        potentialReturn: choice === 'Sim'
          ? parseFloat(market.binaryData.yesReturn.split(' -> ')[1].replace('R$', ''))
          : parseFloat(market.binaryData.noReturn.split(' -> ')[1].replace('R$', ''))
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 bg-[#1e1e1e] px-3 py-1.5 rounded-lg text-sm font-medium w-fit"
      >
        <ArrowLeft size={16} /> Voltar <span className="text-xs bg-[#2a2a2a] px-1.5 py-0.5 rounded text-gray-500 ml-1">ESC</span>
      </button>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <img src={market.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight">{market.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span className="flex items-center gap-1 text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded text-xs font-semibold">
                <CheckCircle2 size={12} /> Official
              </span>
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                Total Vol: {market.volume}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon size={14} /> Fim: {market.endDate}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 text-gray-400">
          <button className="p-2 hover:bg-[#1e1e1e] rounded-lg transition-colors"><Star size={20} /></button>
          <button className="p-2 hover:bg-[#1e1e1e] rounded-lg transition-colors"><LinkIcon size={20} /></button>
        </div>
      </div>

      {market.type === 'multiple' && market.options ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {market.options.map((opt: any, idx: number) => (
            <div key={idx} className="bg-[#1e1e1e] rounded-xl p-4 border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img src={opt.image} alt="" className="w-10 h-10 rounded-full object-cover" />
                  <span className="font-bold text-white">{opt.name}</span>
                </div>
                <button className="text-gray-500 hover:text-white"><ChevronUp size={20} /></button>
              </div>

              <div className="flex justify-between text-lg font-bold mb-2">
                <span className="text-white">{opt.chance}%</span>
                <span className="text-gray-500 text-xs font-normal self-center">Chance</span>
                <span className="text-white">{100 - (opt.chance || 0)}%</span>
              </div>
              
              <div className="flex h-2 rounded-full overflow-hidden mb-4">
                <div className="bg-green-500" style={{ width: `${opt.chance}%` }}></div>
                <div className="bg-red-500" style={{ width: `${100 - (opt.chance || 0)}%` }}></div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <button 
                    onClick={() => handleSelectBet('Sim', opt)}
                    className="w-full flex items-center justify-between bg-green-500/10 text-green-500 p-2 rounded-lg hover:bg-green-500/20 transition-colors border border-green-500/20"
                  >
                    <div className="flex items-center gap-1 font-bold text-sm">
                      <CheckCircle2 size={16} /> Sim
                    </div>
                    <span className="bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded">{opt.yesOdds}</span>
                  </button>
                  <div className="text-center text-[10px] font-medium mt-1.5">
                    <span className="text-gray-400">{opt.yesReturn?.split(' -> ')[0]}</span>
                    <span className="text-gray-500 mx-1">-&gt;</span>
                    <span className="text-green-500">{opt.yesReturn?.split(' -> ')[1]}</span>
                  </div>
                </div>
                <div>
                  <button 
                    onClick={() => handleSelectBet('Não', opt)}
                    className="w-full flex items-center justify-between bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/20"
                  >
                    <div className="flex items-center gap-1 font-bold text-sm">
                      <XCircle size={16} /> Não
                    </div>
                    <span className="bg-white text-black text-xs font-bold px-1.5 py-0.5 rounded">{opt.noOdds}</span>
                  </button>
                  <div className="text-center text-[10px] font-medium mt-1.5">
                    <span className="text-gray-400">{opt.noReturn?.split(' -> ')[0]}</span>
                    <span className="text-gray-500 mx-1">-&gt;</span>
                    <span className="text-green-500">{opt.noReturn?.split(' -> ')[1]}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : market.binaryData ? (
        <div className="space-y-8">
          <div className="bg-[#1e1e1e] rounded-xl p-6 border border-[#2a2a2a]">
            <div className="flex justify-between text-lg font-bold mb-2">
              <span className="text-green-500 flex items-center gap-2"><CheckCircle2 size={20} /> Sim</span>
              <span className="text-red-500 flex items-center gap-2">Não <XCircle size={20} /></span>
            </div>
            <div className="flex justify-between text-3xl font-black mb-4">
              <span className="text-white">{market.binaryData.yesChance}%</span>
              <span className="text-gray-500 text-sm font-normal self-center">Chance</span>
              <span className="text-white">{market.binaryData.noChance}%</span>
            </div>
            
            <div className="flex h-4 rounded-full overflow-hidden mb-8">
              <div className="bg-green-500" style={{ width: `${market.binaryData.yesChance}%` }}></div>
              <div className="bg-red-500" style={{ width: `${market.binaryData.noChance}%` }}></div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => handleSelectBet('Sim')}
                className="flex flex-col items-center justify-center bg-green-500/10 text-green-500 p-4 rounded-xl hover:bg-green-500/20 transition-colors border border-green-500/20"
              >
                <span className="font-bold text-lg">Apostar Sim</span>
                <span className="bg-green-500 text-black text-xs px-1.5 py-0.5 rounded mt-1">{market.binaryData.yesOdds}</span>
              </button>
              <button 
                onClick={() => handleSelectBet('Não')}
                className="flex flex-col items-center justify-center bg-red-500/10 text-red-500 p-4 rounded-xl hover:bg-red-500/20 transition-colors border border-red-500/20"
              >
                <span className="font-bold text-lg">Apostar Não</span>
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded mt-1">{market.binaryData.noOdds}</span>
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">O mercado fechará em</p>
              <div className="flex items-center justify-center gap-4 text-2xl font-bold font-mono">
                <div className="flex flex-col items-center"><span className="text-white">15</span><span className="text-[10px] text-gray-500 uppercase">Days</span></div>
                <span className="text-gray-600 pb-4">:</span>
                <div className="flex flex-col items-center"><span className="text-white">11</span><span className="text-[10px] text-gray-500 uppercase">Hours</span></div>
                <span className="text-gray-600 pb-4">:</span>
                <div className="flex flex-col items-center"><span className="text-white">39</span><span className="text-[10px] text-gray-500 uppercase">Minutes</span></div>
                <span className="text-gray-600 pb-4">:</span>
                <div className="flex flex-col items-center"><span className="text-white">47</span><span className="text-[10px] text-gray-500 uppercase">Seconds</span></div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Regras e Detalhes do Mercado</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-2">
              {market.rules}
            </p>
            <button className="text-white font-medium text-sm flex items-center gap-1 hover:text-lime-400 transition-colors">
              Ver mais <ChevronUp className="rotate-180" size={16} />
            </button>
          </div>

          {market.activity && market.activity.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-4">
                Atividade <span className="text-gray-500 text-sm font-normal">Titulares</span>
              </h3>
              <div className="space-y-4">
                {market.activity.map((act: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
                    <div className="flex items-center gap-4">
                      <img src={act.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm">
                          <span className="font-bold text-white">{act.user}</span> {act.action} <span className={`font-bold ${act.choice === 'Sim' ? 'text-green-500' : 'text-red-500'}`}>{act.choice}</span> at {act.amount}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{act.contracts} {act.value}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
