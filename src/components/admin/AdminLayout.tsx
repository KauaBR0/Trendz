import { Outlet, Navigate } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useApp } from '../../context/AppContext';

export function AdminLayout() {
  const { user } = useApp();

  // Protect admin route
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-[#121212] border-b border-[#2a2a2a] flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="text-lg font-bold">Painel de Administração</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Logado como Admin</span>
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-lime-500" />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
