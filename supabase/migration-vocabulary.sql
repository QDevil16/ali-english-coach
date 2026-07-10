-- Mevcut kurulumlar için: kelime defteri tablosunu ekler.
-- Supabase → SQL Editor'de bir kez çalıştır.
create table if not exists public.vocabulary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  word text not null,
  meaning_tr text,
  example text,
  mastery_score integer default 0,
  repeat_count integer default 0,
  last_seen_at timestamptz default now(),
  created_at timestamptz default now(),
  unique (user_id, word)
);
alter table public.vocabulary enable row level security;
drop policy if exists "vocab_self" on public.vocabulary;
create policy "vocab_self" on public.vocabulary
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create index if not exists idx_vocab_user on public.vocabulary(user_id);
