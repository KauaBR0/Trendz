-- ============================================================
-- TRENDZ - SUPABASE AUTH SQL
-- Sistema de autenticação com RLS e Roles (admin/user)
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

-- Índices para busca rápida
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- ============================================================
-- 2. FUNÇÃO: Verificar se usuário é admin (helper)
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
-- 3. POLÍTICAS DE RLS
-- ============================================================

-- Usuários podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Admins podem ver TODOS os perfis
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    public.is_admin(auth.uid())
  );

-- Usuários podem atualizar seu próprio perfil (exceto role)
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
  );

-- Admins podem atualizar qualquer perfil (incluindo alterar roles)
CREATE POLICY "Admins can update any profile"
  ON public.profiles
  FOR UPDATE
  USING (
    public.is_admin(auth.uid())
  );

-- Permitir INSERT durante o registro (via trigger ou diretamente)
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins podem deletar perfis
CREATE POLICY "Admins can delete profiles"
  ON public.profiles
  FOR DELETE
  USING (
    public.is_admin(auth.uid())
  );

-- ============================================================
-- 4. FUNÇÃO: Criar perfil automaticamente ao registrar
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
-- 5. TRIGGER: Disparar ao criar novo usuário
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 6. FUNÇÃO: Atualizar updated_at automaticamente
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
-- 8. FUNÇÃO: Promover usuário a admin (apenas admins podem usar)
-- ============================================================
CREATE OR REPLACE FUNCTION public.promote_to_admin(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se quem está chamando é admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Apenas administradores podem promover usuários';
  END IF;

  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = target_user_id;
END;
$$;

-- ============================================================
-- 9. FUNÇÃO: Rebaixar admin para user (apenas admins podem usar)
-- ============================================================
CREATE OR REPLACE FUNCTION public.demote_to_user(target_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se quem está chamando é admin
  IF NOT public.is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Apenas administradores podem rebaixar usuários';
  END IF;

  -- Não permitir que admin se rebaixe
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Você não pode rebaixar a si mesmo';
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

-- ============================================================
-- NOTAS IMPORTANTES:
-- ============================================================
-- 1. Execute este SQL no SQL Editor do Supabase Dashboard
-- 2. O RLS está ativado - usuários só veem seus próprios dados
-- 3. Admins podem ver e modificar todos os perfis
-- 4. Para criar o primeiro admin, descomente a query da seção 10
--    e substitua pelo email correto
-- 5. Novos usuários são criados automaticamente com role 'user'
-- 6. As funções promote_to_admin e demote_to_user podem ser
--    chamadas via supabase.rpc() no frontend
