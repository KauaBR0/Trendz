import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AuthError, Session, User as SupabaseUser } from '@supabase/supabase-js';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

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
  profileError: string | null;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    metadata?: { name?: string; cpf?: string; phone?: string }
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  adjustBalance: (delta: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const missingSupabaseError = {
  message: 'Supabase nao configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
} as AuthError;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        setProfileError(error.message || 'Erro ao buscar perfil');
        return null;
      }

      setProfileError(null);
      return data as Profile;
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Erro ao buscar perfil');
      return null;
    }
  };

  const refreshProfile = async () => {
    if (!user || !isSupabaseConfigured) {
      return;
    }

    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  };

  const adjustBalance = (delta: number) => {
    setProfile(prev => {
      if (!prev) {
        return prev;
      }

      return {
        ...prev,
        balance: Math.max(0, prev.balance + delta),
        updated_at: new Date().toISOString(),
      };
    });
  };

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return;
    }

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        const profileData = await fetchProfile(currentSession.user.id);
        setProfile(profileData);
      }

      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        if (event === 'SIGNED_IN') {
          setTimeout(async () => {
            const profileData = await fetchProfile(currentSession.user.id);
            setProfile(profileData);
          }, 500);
        } else {
          const profileData = await fetchProfile(currentSession.user.id);
          setProfile(profileData);
        }
      } else {
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: missingSupabaseError };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error };
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    metadata?: { name?: string; cpf?: string; phone?: string }
  ) => {
    if (!isSupabaseConfigured) {
      return { error: missingSupabaseError };
    }

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

  const signInWithGoogle = async () => {
    if (!isSupabaseConfigured) {
      return { error: missingSupabaseError };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    return { error };
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    setProfile(null);
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isAdmin: profile?.role === 'admin',
        profileError,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOut,
        refreshProfile,
        adjustBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
