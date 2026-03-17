import { useState } from 'react';
import { Search, Menu, LogOut, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoginModal } from './LoginModal';
import { RegisterModal } from './RegisterModal';
import { AlertModal } from './AlertModal';
import { useApp } from '../context/AppContext';

export function Header() {
  const { user, logout, searchQuery, setSearchQuery } = useApp();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleCloseRegister = () => {
    setIsAlertOpen(true);
  };

  const handleConfirmExit = () => {
    setIsAlertOpen(false);
    setIsRegisterOpen(false);
  };

  return (
    <>
      <header className="h-16 bg-[#121212] border-b border-[#2a2a2a] flex items-center justify-between px-4 sticky top-0 z-10">
        <div className="flex items-center flex-1">
          <div className="relative w-full max-w-md hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por Mercados, Tópicos..."
              className="w-full bg-[#1e1e1e] text-white text-sm rounded-lg pl-10 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-lime-500 placeholder-gray-500"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2a2a2a] text-gray-400 text-xs px-1.5 py-0.5 rounded">
              /
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-purple-400 bg-purple-400/10 px-3 py-1.5 rounded-lg hover:bg-purple-400/20 transition-colors border border-purple-400/20"
                >
                  <Shield size={16} /> Painel Admin
                </Link>
              )}
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400">Saldo</span>
                <span className="text-sm font-bold text-lime-500">R$ {user.balance.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-[#2a2a2a]" />
                <button onClick={logout} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <button 
                onClick={() => setIsLoginOpen(true)}
                className="text-sm font-medium text-white hover:text-lime-400 transition-colors px-4 py-2 border border-[#2a2a2a] rounded-lg bg-[#1e1e1e]"
              >
                Entrar
              </button>
              <button 
                onClick={() => setIsRegisterOpen(true)}
                className="text-sm font-bold text-black bg-lime-500 hover:bg-lime-400 transition-colors px-4 py-2 rounded-lg"
              >
                Criar Conta
              </button>
            </>
          )}
          <button className="p-2 text-gray-400 hover:text-white md:hidden">
            <Menu size={24} />
          </button>
        </div>
      </header>

      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
      
      <RegisterModal 
        isOpen={isRegisterOpen} 
        onClose={handleCloseRegister}
        onLoginClick={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={handleConfirmExit}
      />
    </>
  );
}
