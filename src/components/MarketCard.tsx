import { Link } from 'react-router-dom';
import { Star, Clock, CheckCircle2, XCircle } from 'lucide-react';

interface MarketCardProps {
  id: string;
  title: string;
  image: string;
  type: 'binary' | 'multiple';
  options?: { name: string; image: string; yesOdds: string; noOdds: string }[];
  binaryData?: { yesChance: number; noChance: number; yesOdds: string; noOdds: string; yesReturn: string; noReturn: string };
  category?: string;
}

export function MarketCard({ id, title, image, type, options, binaryData, category }: MarketCardProps) {
  return (
    <Link to={`/market/${id}`} className="block bg-[#1e1e1e] rounded-xl p-4 hover:bg-[#2a2a2a] transition-colors border border-transparent hover:border-gray-700 w-full min-w-[320px] max-w-[400px]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-3">
          <img src={image} alt="" className="w-10 h-10 rounded-lg object-cover" />
          <h3 className="text-sm font-bold text-white leading-tight line-clamp-2 pr-2">{title}</h3>
        </div>
        <div className="flex gap-2 text-gray-400">
          <button className="hover:text-white"><Star size={16} /></button>
          <button className="hover:text-white"><Clock size={16} /></button>
        </div>
      </div>

      {type === 'multiple' && options && (
        <div className="space-y-2">
          {options.slice(0, 3).map((opt, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <img src={opt.image} alt="" className="w-6 h-6 rounded-full object-cover" />
                <span className="text-xs text-gray-300 truncate">{opt.name}</span>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-semibold hover:bg-green-500/20 transition-colors">
                  <CheckCircle2 size={12} /> Sim {opt.yesOdds}
                </button>
                <button className="flex items-center gap-1 bg-red-500/10 text-red-500 px-2 py-1 rounded text-xs font-semibold hover:bg-red-500/20 transition-colors">
                  <XCircle size={12} /> Não {opt.noOdds}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {type === 'binary' && binaryData && (
        <div className="mt-4">
          <div className="flex justify-between text-lg font-bold mb-2">
            <span className="text-white">{binaryData.yesChance}%</span>
            <span className="text-gray-500 text-xs font-normal self-center">Chance</span>
            <span className="text-white">{binaryData.noChance}%</span>
          </div>
          
          <div className="flex h-2 rounded-full overflow-hidden mb-4">
            <div className="bg-green-500" style={{ width: `${binaryData.yesChance}%` }}></div>
            <div className="bg-red-500" style={{ width: `${binaryData.noChance}%` }}></div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <button className="w-full flex items-center justify-center gap-1 bg-green-500/10 text-green-500 p-2 rounded-lg hover:bg-green-500/20 transition-colors font-bold text-sm border border-green-500/20">
                <CheckCircle2 size={14} /> Sim - {binaryData.yesOdds}
              </button>
              <div className="text-center text-[10px] font-medium mt-1.5">
                <span className="text-gray-400">{binaryData.yesReturn.split(' -> ')[0]}</span>
                <span className="text-gray-500 mx-1">-&gt;</span>
                <span className="text-green-500">{binaryData.yesReturn.split(' -> ')[1]}</span>
              </div>
            </div>
            <div>
              <button className="w-full flex items-center justify-center gap-1 bg-red-500/10 text-red-500 p-2 rounded-lg hover:bg-red-500/20 transition-colors font-bold text-sm border border-red-500/20">
                <XCircle size={14} /> Não - {binaryData.noOdds}
              </button>
              <div className="text-center text-[10px] font-medium mt-1.5">
                <span className="text-gray-400">{binaryData.noReturn.split(' -> ')[0]}</span>
                <span className="text-gray-500 mx-1">-&gt;</span>
                <span className="text-green-500">{binaryData.noReturn.split(' -> ')[1]}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Link>
  );
}
