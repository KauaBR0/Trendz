import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';

export function AdminLayout() {
  const { profile, user } = useAuth();
  const location = useLocation();

  const displayName = profile?.name || user?.email || 'Admin';
  const displayAvatar = profile?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${displayName}`;
  const pageTitle = getAdminPageTitle(location.pathname);

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white font-sans overflow-hidden">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-[#121212] border-b border-[#2a2a2a] flex items-center justify-between px-6 sticky top-0 z-10">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Painel de Administracao</p>
            <h1 className="text-lg font-bold text-white">{pageTitle}</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">Logado como Admin</span>
            <img src={displayAvatar} alt={displayName} className="w-8 h-8 rounded-full border border-lime-500 object-cover" />
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function getAdminPageTitle(pathname: string) {
  if (pathname.includes('/admin/events')) return 'Eventos Editoriais';
  if (pathname.includes('/admin/markets/new')) return 'Wizard de Mercado';
  if (pathname.includes('/admin/review')) return 'Fila de Revisao';
  if (pathname.includes('/admin/resolution')) return 'Painel de Resolucao';
  if (pathname.includes('/admin/users')) return 'Gestao de Usuarios';

  return 'Visao Geral';
}
