-- ====================================================================================
-- FASE 1: INFRAESTRUTURA DE DADOS ROBUSTA E SEGURA (SPENDIFY)
-- ====================================================================================

-- 1. EXTENSÕES
-- Habilita o pgcrypto para criptografia (Ex: CPF)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. FUNÇÕES ÚTEIS
-- Função para atualizar a coluna updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ====================================================================================
-- 3. TABELAS (Criação com Constraints Rígidas)
-- ====================================================================================

-- Tabela: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  cpf_encrypted TEXT, -- Armazena o CPF cifrado
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: cards
CREATE TABLE IF NOT EXISTS public.cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT,
  total_limit NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (total_limit >= 0),
  closing_day INTEGER NOT NULL CHECK (closing_day >= 1 AND closing_day <= 31),
  due_day INTEGER NOT NULL CHECK (due_day >= 1 AND due_day <= 31),
  color_theme TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: people (para dividir dívidas)
CREATE TABLE IF NOT EXISTS public.people (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  pix_key TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: transactions
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES public.cards(id) ON DELETE SET NULL, -- Compra pode ser no débito
  amount NUMERIC(12, 2) NOT NULL CHECK (amount != 0),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: transaction_splits (O "Racha")
CREATE TABLE IF NOT EXISTS public.transaction_splits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID REFERENCES public.transactions(id) ON DELETE CASCADE NOT NULL,
  person_id UUID REFERENCES public.people(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela: ai_insights
CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  insight_text TEXT NOT NULL,
  score_value INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- ====================================================================================
-- 4. TRIGGERS (Auto-Update e Criação de Perfil)
-- ====================================================================================

-- Adiciona trigger de updated_at para as tabelas aplicáveis
DO $$ BEGIN
  CREATE TRIGGER on_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TRIGGER on_cards_updated BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TRIGGER on_people_updated BEFORE UPDATE ON public.people FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TRIGGER on_transactions_updated BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();
EXCEPTION WHEN duplicate_object THEN null; END $$;


-- Função para criar profile automaticamente quando o usuário faz Sign Up no Auth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger atrelada à tabela auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();


-- ====================================================================================
-- 5. ROW LEVEL SECURITY (RLS) - Regra de Ouro da LGPD/Privacidade
-- ====================================================================================

-- Habilita RLS em TODAS as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;


-- Políticas para PROFILES
CREATE POLICY "Usuários veem o próprio perfil" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Usuários atualizam o próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Políticas para CARDS
CREATE POLICY "Usuários gerenciam próprios cartões" ON public.cards FOR ALL USING (auth.uid() = user_id);

-- Políticas para PEOPLE
CREATE POLICY "Usuários gerenciam próprios contatos" ON public.people FOR ALL USING (auth.uid() = user_id);

-- Políticas para TRANSACTIONS
CREATE POLICY "Usuários gerenciam próprias transações" ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Políticas para AI_INSIGHTS
CREATE POLICY "Usuários veem próprios insights" ON public.ai_insights FOR ALL USING (auth.uid() = user_id);

-- Políticas para TRANSACTION_SPLITS (Checa através da transaction_id)
CREATE POLICY "Usuários gerenciam divisões de suas transações" ON public.transaction_splits 
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.transactions t 
    WHERE t.id = transaction_splits.transaction_id 
    AND t.user_id = auth.uid()
  )
);

