-- Student event choices go to the chapter advisor. Approval writes the regular assignment.
-- Manual: the student's note and the advisor decision.
-- Computed: nothing. Status changes only when a student submits or an advisor reviews.

create table if not exists public.event_choices (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  catalog_event_id text not null references public.catalog_events(id),
  intent text not null default '',
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'DECLINED', 'WITHDRAWN')),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, profile_id, catalog_event_id)
);

create index if not exists event_choices_chapter_status_idx
  on public.event_choices (chapter_id, status, created_at desc);

create index if not exists event_choices_profile_season_idx
  on public.event_choices (profile_id, season_id);

comment on table public.event_choices is
  'A student request to compete in a catalog event. The advisor reviews it, then the official registration is written the same way as a typed assignment.';

alter table public.event_choices enable row level security;

drop policy if exists event_choices_read on public.event_choices;
create policy event_choices_read on public.event_choices
for select to authenticated
using (
  profile_id = auth.uid()
  or chapter_id in (
    select p.chapter_id from public.profiles p
    where p.id = auth.uid()
      and p.role in ('CHAPTER_ADVISOR', 'CHAPTER_OFFICER', 'STATE_ADMIN', 'SUPER_ADMIN')
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN')
  )
);

notify pgrst, 'reload schema';
