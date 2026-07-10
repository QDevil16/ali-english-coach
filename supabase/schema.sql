-- Ali English Coach — Supabase şeması
-- Tüm tablolarda RLS açıktır; kullanıcı yalnızca kendi verisine erişir.

-- ---------- yardımcı: updated_at otomatik güncelleme ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- profiles ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  native_language text default 'tr',
  target_language text default 'en',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- yeni kullanıcı için otomatik profil
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- learner_profiles ----------
create table if not exists public.learner_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  goal text,
  motivation text,
  struggle_description text,
  learning_style jsonb,
  daily_minutes integer,
  priority_skills text[],
  cefr_level text,
  listening_level text,
  speaking_level text,
  grammar_level text,
  vocabulary_level text,
  reading_level text,
  ai_summary text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- placement_tests ----------
create table if not exists public.placement_tests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  answers jsonb,
  raw_score integer,
  result jsonb,
  confirmed_level text,
  created_at timestamptz default now()
);

-- ---------- curriculums ----------
create table if not exists public.curriculums (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text,
  level text,
  duration_weeks integer,
  plan jsonb,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- lessons ----------
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  curriculum_id uuid references public.curriculums(id) on delete set null,
  title text,
  level text,
  focus_skills text[],
  estimated_minutes integer,
  lesson_date date,
  content jsonb,
  status text default 'planned',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- lesson_attempts ----------
create table if not exists public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  answers jsonb,
  score integer,
  time_spent_minutes integer,
  ai_feedback text,
  completed_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- mistakes ----------
create table if not exists public.mistakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  attempt_id uuid references public.lesson_attempts(id) on delete set null,
  category text,
  user_answer text,
  correct_answer text,
  explanation_tr text,
  severity integer,
  repeat_count integer default 1,
  mastery_score integer default 0,
  last_seen_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- progress_metrics ----------
create table if not exists public.progress_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  date date,
  listening_score integer,
  speaking_score integer,
  grammar_score integer,
  vocabulary_score integer,
  reading_score integer,
  writing_score integer,
  total_minutes integer,
  completed_lessons integer,
  notes text,
  created_at timestamptz default now()
);

-- ---------- ai_memories ----------
create table if not exists public.ai_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  memory_type text,
  content text,
  importance integer,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------- updated_at trigger'ları ----------
create trigger t_profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger t_learner_updated before update on public.learner_profiles
  for each row execute function public.set_updated_at();
create trigger t_curriculums_updated before update on public.curriculums
  for each row execute function public.set_updated_at();
create trigger t_lessons_updated before update on public.lessons
  for each row execute function public.set_updated_at();
create trigger t_ai_memories_updated before update on public.ai_memories
  for each row execute function public.set_updated_at();

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.learner_profiles enable row level security;
alter table public.placement_tests enable row level security;
alter table public.curriculums enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_attempts enable row level security;
alter table public.mistakes enable row level security;
alter table public.progress_metrics enable row level security;
alter table public.ai_memories enable row level security;

-- profiles: id = auth.uid()
create policy "profiles_self" on public.profiles
  for all using (id = auth.uid()) with check (id = auth.uid());

-- diğer tablolar: user_id = auth.uid()
create policy "learner_self" on public.learner_profiles
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "placement_self" on public.placement_tests
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "curriculums_self" on public.curriculums
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "lessons_self" on public.lessons
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "attempts_self" on public.lesson_attempts
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mistakes_self" on public.mistakes
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "progress_self" on public.progress_metrics
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "memories_self" on public.ai_memories
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- vocabulary (kelime defteri + spaced repetition) ----------
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
create policy "vocab_self" on public.vocabulary
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- indexler ----------
create index if not exists idx_vocab_user on public.vocabulary(user_id);
create index if not exists idx_learner_user on public.learner_profiles(user_id);
create index if not exists idx_curriculums_user on public.curriculums(user_id);
create index if not exists idx_lessons_user on public.lessons(user_id);
create index if not exists idx_lessons_date on public.lessons(user_id, lesson_date);
create index if not exists idx_attempts_user on public.lesson_attempts(user_id);
create index if not exists idx_mistakes_user on public.mistakes(user_id);
create index if not exists idx_progress_user on public.progress_metrics(user_id, date);
