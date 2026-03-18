import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Tipo do perfil do banco
export interface Profile {
  id: string;
  email: string;
  name: string;
  avatar_url: string;
  role: 'admin' | 'user';
  balance: number;
  cpf?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (email: string, password: string, metadata?: { name?: string; cpf?: string; phone?: string }) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  profileError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [profileError, setProfileError] = useState<string | null>(null);

  // Buscar perfil do usuário no banco
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        setProfileError(error.message || 'Erro ao buscar perfil');
        return null;
      }

      setProfileError(null);
      console.log('Perfil buscado:', data);
      return data as Profile;
    } catch (err: any) {
      console.error('Erro no fetchProfile:', err);
      setProfileError(err.message || 'Erro desconhecido');
      return null;
    }
  };

  // Atualizar perfil
  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  // Escutar mudanças de auth
  useEffect(() => {
    // Obter sessão atual
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }

      setIsLoading(false);
    });

    // Listener de mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Pequeno delay para garantir que o trigger criou o perfil
          if (event === 'SIGNED_IN') {
            setTimeout(async () => {
              const profileData = await fetchProfile(session.user.id);
              setProfile(profileData);
            }, 500);
          } else {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }

        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Login com Email/Senha
  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // Cadastro com Email/Senha
  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata?: { name?: string; cpf?: string; phone?: string }
  ) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: metadata?.name,
          cpf: metadata?.cpf,
          phone: metadata?.phone,
        },
      },
    });

    return { error };
  };

  // Login com Google
  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { error };
  };

  // Logout
  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setUser(null);
    setSession(null);
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isAdmin,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        refreshProfile,
        profileError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
