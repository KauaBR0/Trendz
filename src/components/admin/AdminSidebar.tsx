import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ClipboardList, FilePenLine, Gavel, LayoutDashboard, LogOut, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function AdminSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 bg-[#121212] border-r border-[#2a2a2a] flex flex-col h-screen sticky top-0 overflow-y-auto hidden md:flex">
      <div className="p-6">
        <Link to="/admin" className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center text-black font-bold text-xl">
            A
          </div>
          <span className="text-white font-bold text-xl tracking-tight">AdminPanel</span>
        </Link>

        <nav className="space-y-2">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/admin'} to="/admin" />
          <NavItem icon={<FilePenLine size={20} />} label="Eventos" active={location.pathname.includes('/admin/events') || location.pathname === '/admin/markets'} to="/admin/events" />
          <NavItem icon={<ClipboardList size={20} />} label="Novo Mercado" active={location.pathname.includes('/admin/markets/new')} to="/admin/markets/new" />
          <NavItem icon={<ClipboardList size={20} />} label="Revisao" active={location.pathname.includes('/admin/review')} to="/admin/review" />
          <NavItem icon={<Gavel size={20} />} label="Resolucao" active={location.pathname.includes('/admin/resolution')} to="/admin/resolution" />
          <NavItem icon={<Users size={20} />} label="Usuários" active={location.pathname.includes('/admin/users')} to="/admin/users" />
        </nav>
      </div>

      <div className="mt-auto p-4 space-y-2">
        <Link to="/" className="w-full bg-[#1e1e1e] hover:bg-[#2a2a2a] text-gray-400 hover:text-white rounded-xl p-3 flex items-center gap-3 transition-colors border border-[#2a2a2a]">
          <ArrowLeft size={18} />
          <span className="font-medium text-sm">Voltar ao App</span>
        </Link>
        <button 
          onClick={() => void signOut()}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl p-3 flex items-center gap-3 transition-colors border border-red-500/20"
        >
          <LogOut size={18} />
          <span className="font-medium text-sm">Sair</span>
        </button>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, to }: { icon: ReactNode; label: string; active?: boolean; to: string }) {
  return (
    <Link 
      to={to}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
        active 
          ? 'bg-lime-500/10 text-lime-500 border border-lime-500/20' 
          : 'text-gray-400 hover:bg-[#1e1e1e] hover:text-white'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
}
