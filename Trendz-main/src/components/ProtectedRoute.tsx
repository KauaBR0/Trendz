import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, profile, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0f0f0f]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-lime-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  // Se não está logado, redireciona para home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Se requer role específica, verifica
  if (requiredRole && profile?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
