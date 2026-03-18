-- ============================================================
-- TRENDZ - SUPABASE AUTH SQL
-- Sistema de autenticacao com RLS e Roles (admin/user)
-- ============================================================

-- ============================================================
-- 1. TABELA DE PERFIS (profiles)
-- Vinculada ao auth.users do Supabase
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
  cpf TEXT UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================
-- 2. FUNCAO: Verificar se usuario e admin (helper)
-- ============================================================
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'
  );
END;
$$;

-- ============================================================
-- 3. ATIVAR RLS (Row Level Security)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. POLITICAS DE RLS
-- ============================================================
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (public.is_admin(auth.uid()));

-- ============================================================
-- 5. FUNCAO: Criar perfil automaticamente ao registrar
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, avatar_url, role, balance)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(
      NEW.raw_user_meta_data->>'avatar_url',
      'https://api.dicebear.com/7.x/initials/svg?seed=' || split_part(NEW.email, '@', 1)
    ),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    0.00
  );
  RETURN NEW;
END;
$$;

-- ============================================================
-- 6. TRIGGER: Disparar ao criar novo usuario
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 7. FUNCAO: Atualizar updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- 8. FUNCAO: Promover usuario a admin (apenas admins podem usar)
-- ============================================================
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Apenas administradores podem promover usuarios';
  END IF;

  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = target_user_id;
END;
$$;

-- ============================================================
-- 9. FUNCAO: Rebaixar admin para user (apenas admins podem usar)
-- ============================================================
CREATE OR REPLACE FUNCTION public.demote_to_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Apenas administradores podem rebaixar usuarios';
  END IF;

  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Voce nao pode rebaixar a si mesmo';
  END IF;

  UPDATE public.profiles
  SET role = 'user'
  WHERE id = target_user_id;
END;
$$;

-- ============================================================
-- 10. CRIAR PRIMEIRO ADMIN (EXECUTE APENAS UMA VEZ)
-- Substitua 'SEU_EMAIL_ADMIN@email.com' pelo email do admin
-- ============================================================
-- UPDATE public.profiles
-- SET role = 'admin'
-- WHERE email = 'SEU_EMAIL_ADMIN@email.com';
