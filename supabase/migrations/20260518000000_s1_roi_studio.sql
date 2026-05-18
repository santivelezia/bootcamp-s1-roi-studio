-- ─── Smart4AI · Demo S1 · ROI Studio · migration ────────────────
-- agente-demo-builder v0.2.1 · 2026-05-18
-- Tabla con prefijo s1_* (regla CLAUDE.md demo-builder)

create extension if not exists "uuid-ossp";

-- Tabla de sesiones del ROI Studio (multi-user vía Realtime)
create table if not exists public.s1_sessions (
  id          uuid primary key default uuid_generate_v4(),
  session_id  text not null unique,
  state       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists s1_sessions_session_id_idx
  on public.s1_sessions (session_id);

-- Trigger para mantener updated_at
create or replace function public.s1_sessions_set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists s1_sessions_updated_at on public.s1_sessions;
create trigger s1_sessions_updated_at
  before update on public.s1_sessions
  for each row execute function public.s1_sessions_set_updated_at();

-- ─── Row Level Security ────────────────────────────────────────
alter table public.s1_sessions enable row level security;

-- Lectura: cualquiera puede leer si conoce el session_id (es la clave por convención)
drop policy if exists "anyone can read by session_id" on public.s1_sessions;
create policy "anyone can read by session_id"
  on public.s1_sessions for select
  using (true);

-- Inserción: cualquiera puede crear sessions nuevas (anon role).
drop policy if exists "anyone can insert sessions" on public.s1_sessions;
create policy "anyone can insert sessions"
  on public.s1_sessions for insert
  with check (true);

-- Actualización: cualquiera puede actualizar (workshop multi-user efímero).
-- Para producción real, restringir vía session_id firmado o auth.uid().
drop policy if exists "anyone can update sessions" on public.s1_sessions;
create policy "anyone can update sessions"
  on public.s1_sessions for update
  using (true);

-- ─── Realtime publication ──────────────────────────────────────
-- Permite que el cliente se suscriba a postgres_changes en esta tabla.
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 's1_sessions'
  ) then
    alter publication supabase_realtime add table public.s1_sessions;
  end if;
end$$;
