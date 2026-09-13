CREATE TABLE "public"."ai_insights" (
  "id"           uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"      uuid,
  "insight_text" text,
  "score_value"  integer,
  "created_at"   timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "ai_insights_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."ai_insights"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."cards" (
  "id"          uuid    NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     uuid,
  "name"        text    NOT NULL,
  "brand"       text,
  "total_limit" numeric,
  "closing_day" integer,
  "due_day"     integer,
  "color_theme" text,
  CONSTRAINT "cards_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."cards"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."people" (
  "id"       uuid NOT NULL DEFAULT gen_random_uuid(),
  "user_id"  uuid,
  "name"     text NOT NULL,
  "whatsapp" text,
  "pix_key"  text,
  CONSTRAINT "people_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."people"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."profiles" (
  "id"            uuid                     NOT NULL,
  "name"          text,
  "cpf_encrypted" text,
  "avatar_url"    text,
  "created_at"    timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "profiles_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."profiles"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."transaction_splits" (
  "id"             uuid    NOT NULL DEFAULT gen_random_uuid(),
  "transaction_id" uuid,
  "person_id"      uuid,
  "amount"         numeric NOT NULL,
  CONSTRAINT "transaction_splits_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."transaction_splits"
  ENABLE ROW LEVEL SECURITY;

CREATE TABLE "public"."transactions" (
  "id"          uuid                     NOT NULL DEFAULT gen_random_uuid(),
  "user_id"     uuid,
  "card_id"     uuid,
  "amount"      numeric                  NOT NULL,
  "description" text,
  "category"    text,
  "date"        date                     DEFAULT CURRENT_DATE,
  "created_at"  timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT "transactions_pkey" PRIMARY KEY (id)
);

ALTER TABLE "public"."transactions"
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles"
  ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id);

ALTER TABLE "public"."ai_insights"
  ADD CONSTRAINT "ai_insights_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."cards"
  ADD CONSTRAINT "cards_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."people"
  ADD CONSTRAINT "people_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

ALTER TABLE "public"."transaction_splits"
  ADD CONSTRAINT "transaction_splits_person_id_fkey" FOREIGN KEY (person_id) REFERENCES public.people(id) ON DELETE CASCADE;

ALTER TABLE "public"."transactions"
  ADD CONSTRAINT "transactions_card_id_fkey" FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE SET NULL;

ALTER TABLE "public"."transaction_splits"
  ADD CONSTRAINT "transaction_splits_transaction_id_fkey" FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON DELETE CASCADE;

ALTER TABLE "public"."transactions"
  ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

CREATE POLICY "Usuários só acessam seus próprios dados" ON "public"."transactions"
  FOR ALL
  TO PUBLIC
  USING ((auth.uid() = user_id));

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."ai_insights" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."cards" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."people" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."profiles" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transaction_splits" TO "anon", "authenticated", "postgres", "service_role";

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE "public"."transactions" TO "anon", "authenticated", "postgres", "service_role";

