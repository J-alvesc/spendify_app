-- ====================================================================================
-- CORREÇÕES DE PERFORMANCE (PERF-001)
-- ====================================================================================
CREATE INDEX IF NOT EXISTS idx_cards_user_id ON public.cards(user_id);
CREATE INDEX IF NOT EXISTS idx_people_user_id ON public.people(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_card_id ON public.transactions(card_id);
CREATE INDEX IF NOT EXISTS idx_transaction_splits_transaction_id ON public.transaction_splits(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_splits_person_id ON public.transaction_splits(person_id);
CREATE INDEX IF NOT EXISTS idx_ai_insights_user_id ON public.ai_insights(user_id);

-- ====================================================================================
-- CORREÇÕES DE BUGS E SCHEMA (BUG-001)
-- ====================================================================================
-- Adicionando campos faltantes na tabela cards para refletir o front-end financeiro
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS last4 TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS exp TEXT;
ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS available_limit NUMERIC(10, 2);

-- Ajusta o limite disponível default para ser igual ao total_limit quando o cartão nasce
UPDATE public.cards SET available_limit = total_limit WHERE available_limit IS NULL;

-- ====================================================================================
-- CORREÇÕES DE SEGURANÇA: CPF (SEC-001)
-- ====================================================================================
-- Função protegida para definir CPF. Recebe texto plano, encripta no banco.
CREATE OR REPLACE FUNCTION public.update_profile_cpf(p_cpf TEXT)
RETURNS void AS $$
DECLARE
    encryption_key text;
BEGIN
    encryption_key := coalesce(current_setting('app.encryption_key', true), 'spendify_secure_key_123');
    
    UPDATE public.profiles 
    SET cpf_encrypted = pgp_sym_encrypt(p_cpf, encryption_key)
    WHERE id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função protegida para ler CPF decriptado (Retorna nulo se o usuário tentar ler de outro)
CREATE OR REPLACE FUNCTION public.get_my_cpf()
RETURNS TEXT AS $$
DECLARE
    encryption_key text;
    decrypted_cpf text;
BEGIN
    encryption_key := coalesce(current_setting('app.encryption_key', true), 'spendify_secure_key_123');
    
    SELECT pgp_sym_decrypt(cpf_encrypted::bytea, encryption_key)
    INTO decrypted_cpf
    FROM public.profiles
    WHERE id = auth.uid();
    
    RETURN decrypted_cpf;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

