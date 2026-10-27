-- Lingo schema for Supabase/Postgres. Enable RLS on every table.
-- Auth is handled by Supabase Auth; profiles.id matches auth.users.id.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text unique not null,
  full_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  role text not null check (role in ('learner', 'content', 'admin'))
);

create table if not exists public.learning_goals (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  target_level text not null default 'A2',
  daily_minutes integer not null default 20 check (daily_minutes in (10, 20, 30, 45)),
  goals text[] not null default '{}'
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  level text not null,
  is_premium boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'review', 'published')),
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

create table if not exists public.units (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  sort_order integer not null default 1
);

create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references public.units (id) on delete cascade,
  title text not null,
  content_type text not null default 'lesson',
  data_json jsonb not null default '{}'::jsonb
);

create table if not exists public.learning_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_data jsonb not null default '{}'::jsonb,
  active_status boolean not null default true
);

create table if not exists public.activity_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  activity_id text not null,
  score integer not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.ai_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  prompt_tokens integer not null default 0,
  cost_credits integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  plan_type text not null check (plan_type in ('free', 'pro')),
  status text not null default 'active',
  expires_at timestamptz
);

create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  points integer not null,
  reason text not null,
  source_key text not null,
  created_at timestamptz not null default now(),
  unique (user_id, source_key)
);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  template text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid,
  action text not null,
  target text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.learning_goals enable row level security;
alter table public.courses enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.learning_plans enable row level security;
alter table public.activity_attempts enable row level security;
alter table public.ai_sessions enable row level security;
alter table public.subscriptions enable row level security;
alter table public.points_ledger enable row level security;
alter table public.email_logs enable row level security;
alter table public.audit_logs enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

create policy "profiles_self" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

create policy "roles_self" on public.user_roles
  for select using (user_id = auth.uid() or public.is_admin());

create policy "goals_self" on public.learning_goals
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid() or public.is_admin());

create policy "published_courses" on public.courses
  for select using (status = 'published' or public.is_admin() or created_by = auth.uid());

create policy "attempts_self" on public.activity_attempts
  for all using (user_id = auth.uid() or public.is_admin())
  with check (user_id = auth.uid());

create policy "points_self" on public.points_ledger
  for select using (user_id = auth.uid() or public.is_admin());

create policy "ai_self" on public.ai_sessions
  for select using (user_id = auth.uid() or public.is_admin());
