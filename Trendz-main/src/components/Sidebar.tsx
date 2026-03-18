import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Landmark, Users, Star, DollarSign, Trophy, Film, HelpCircle, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Sidebar() {
  const { markets } = useApp();
  const location = useLocation();

  const counts = markets.reduce((acc, market) => {
    acc[market.category] = (acc[market.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalMarkets = markets.length;
  const isHome = location.pathname === '/';

  return (
    <aside className="w-64 bg-[#121212] border-r border-[#2a2a2a] flex-col h-screen sticky top-0 overflow-y-auto hidden md:flex">
      <div className="p-4 flex items-center gap-2">
        <div className="w-8 h-8 bg-lime-500 rounded flex items-center justify-center text-black font-bold text-xl">
          Z
        </div>
        <span className="text-white font-bold text-xl tracking-tight">Trendz</span>
        <span className="text-xs text-gray-400 ml-1 mt-1">Mercados</span>
      </div>

      <div className="px-4 py-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Explorar</h3>
        <button className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-[#1e1e1e] text-gray-300 transition-colors">
          <div className="flex items-center gap-3">
            <Star size={18} />
            <span className="text-sm font-medium">Favoritos</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#2a2a2a] text-xs px-2 py-0.5 rounded-full">0</span>
            <ArrowLeft size={14} className="text-gray-500" />
          </div>
        </button>
      </div>

      <div className="px-4 py-2 flex-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Temas</h3>
        <nav className="space-y-1">
          <NavItem icon={<Home size={18} />} label="Tela Inicial" count={totalMarkets} active={isHome} />
          <NavItem icon={<Landmark size={18} />} label="Política" count={counts['Política'] || 0} />
          <NavItem icon={<Users size={18} />} label="Social" count={counts['Social'] || 0} />
          <NavItem icon={<Star size={18} />} label="Celebridades" count={counts['Celebridades'] || 0} />
          <NavItem icon={<DollarSign size={18} />} label="Economia" count={counts['Economia'] || 0} />
          <NavItem icon={<Trophy size={18} />} label="Esportes" count={counts['Esportes'] || 0} />
          <NavItem icon={<Film size={18} />} label="Entretenimento" count={counts['Entretenimento'] || 0} />
        </nav>
      </div>

      <div className="p-4 border-t border-[#2a2a2a]">
        <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-[#1e1e1e]">
          <HelpCircle size={18} />
          <span className="text-sm font-medium">Dúvidas</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, count, active }: { icon: React.ReactNode; label: string; count: number; active?: boolean }) {
  return (
    <Link
      to="/"
      className={`flex items-center justify-between w-full p-2 rounded-lg transition-colors ${
        active ? 'bg-[#1e1e1e] text-lime-400' : 'text-gray-300 hover:bg-[#1e1e1e] hover:text-white'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-xs font-medium">{count}</span>
    </Link>
  );
}
