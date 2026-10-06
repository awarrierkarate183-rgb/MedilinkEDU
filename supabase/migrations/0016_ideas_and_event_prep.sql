alter table public.ideas
  add column if not exists request_kind text not null default 'ACTIVITY';

alter table public.ideas
  drop constraint if exists ideas_request_kind_check;

alter table public.ideas
  add constraint ideas_request_kind_check
  check (request_kind in ('EVENT', 'ACTIVITY', 'OTHER'));

create table if not exists public.event_prep_items (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  catalog_event_id text not null,
  kind text not null,
  title text not null,
  body text,
  status text not null default 'NOT_STARTED',
  notes text,
  file_path text,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, profile_id, catalog_event_id, kind, title)
);

alter table public.event_prep_items
  drop constraint if exists event_prep_items_kind_check;

alter table public.event_prep_items
  add constraint event_prep_items_kind_check
  check (kind in ('SUBMIT', 'DEVELOP'));

alter table public.event_prep_items
  drop constraint if exists event_prep_items_status_check;

alter table public.event_prep_items
  add constraint event_prep_items_status_check
  check (status in ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'DONE'));

create index if not exists idx_event_prep_profile on public.event_prep_items (profile_id, season_id);
create index if not exists idx_event_prep_chapter on public.event_prep_items (chapter_id, season_id);

alter table public.event_prep_items enable row level security;

drop policy if exists "event_prep_select" on public.event_prep_items;
create policy "event_prep_select" on public.event_prep_items
  for select using (
    profile_id = auth.uid()
    or public.manages_chapter(chapter_id)
    or public.is_super_admin()
  );

drop policy if exists "event_prep_insert_managers" on public.event_prep_items;
create policy "event_prep_insert_managers" on public.event_prep_items
  for insert with check (
    public.manages_chapter(chapter_id)
    or public.is_super_admin()
  );

drop policy if exists "event_prep_update_own" on public.event_prep_items;
create policy "event_prep_update_own" on public.event_prep_items
  for update using (
    profile_id = auth.uid()
    or public.manages_chapter(chapter_id)
    or public.is_super_admin()
  )
  with check (
    profile_id = auth.uid()
    or public.manages_chapter(chapter_id)
    or public.is_super_admin()
  );

grant select, insert, update on public.event_prep_items to authenticated;
grant all on table public.event_prep_items to service_role;
