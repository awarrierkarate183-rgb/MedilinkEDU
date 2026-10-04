-- Event instructions and rubrics.
-- Manual: body and files when MediLink publishes them.
-- Computed: nothing. Students only see published rows. Empty means the slot is waiting.

create table if not exists public.event_guides (
  id uuid primary key default gen_random_uuid(),
  catalog_event_id text not null references public.catalog_events(id) on delete cascade,
  kind text not null check (kind in ('INSTRUCTIONS', 'RUBRIC')),
  title text not null,
  body text not null default '',
  file_path text,
  published boolean not null default false,
  updated_at timestamptz not null default now(),
  unique (catalog_event_id, kind)
);

comment on table public.event_guides is
  'Published instructions and rubrics for each catalog event. When empty or unpublished, the student page shows a waiting slot. Adding a published row is enough. No extra code is required.';

alter table public.event_guides enable row level security;

drop policy if exists event_guides_public on public.event_guides;
create policy event_guides_public on public.event_guides
for select to authenticated
using (published = true or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN')
));

notify pgrst, 'reload schema';
