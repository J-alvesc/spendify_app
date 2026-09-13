-- Add detailed columns for "Nova Compra" UI
ALTER TABLE public.transactions
ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'credit' CHECK (type IN ('credit', 'pix', 'cash')),
ADD COLUMN IF NOT EXISTS installments INTEGER NOT NULL DEFAULT 1 CHECK (installments >= 1);
