-- Future cloud-sync schema. Run in Supabase SQL Editor only when sync implementation is added.
create table if not exists public.daymark_state (
 user_id uuid primary key references auth.users(id) on delete cascade,
 state jsonb not null default '{"items":[]}'::jsonb,
 updated_at timestamptz not null default now()
);
alter table public.daymark_state enable row level security;
create policy "Users read own state" on public.daymark_state for select to authenticated using (auth.uid() = user_id);
create policy "Users insert own state" on public.daymark_state for insert to authenticated with check (auth.uid() = user_id);
create policy "Users update own state" on public.daymark_state for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);