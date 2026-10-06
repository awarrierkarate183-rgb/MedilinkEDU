create table if not exists public.medilink_listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  kind text not null,
  region text not null default 'national',
  scope text not null,
  chapter_id uuid references public.chapters(id) on delete cascade,
  status text not null default 'published',
  href text,
  event_date date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.medilink_listings
  drop constraint if exists medilink_listings_kind_check;
alter table public.medilink_listings
  add constraint medilink_listings_kind_check
  check (kind in ('volunteer', 'event', 'internship', 'research'));

alter table public.medilink_listings
  drop constraint if exists medilink_listings_region_check;
alter table public.medilink_listings
  add constraint medilink_listings_region_check
  check (region in ('national', 'northeast', 'southeast', 'midwest', 'southwest', 'west'));

alter table public.medilink_listings
  drop constraint if exists medilink_listings_scope_check;
alter table public.medilink_listings
  add constraint medilink_listings_scope_check
  check (scope in ('ORGANIZATION', 'CHAPTER'));

alter table public.medilink_listings
  drop constraint if exists medilink_listings_status_check;
alter table public.medilink_listings
  add constraint medilink_listings_status_check
  check (status in ('published', 'unpublished'));

alter table public.medilink_listings
  drop constraint if exists medilink_listings_scope_chapter_check;
alter table public.medilink_listings
  add constraint medilink_listings_scope_chapter_check
  check (
    (scope = 'ORGANIZATION' and chapter_id is null)
    or (scope = 'CHAPTER' and chapter_id is not null)
  );

create index if not exists idx_medilink_listings_scope on public.medilink_listings (scope, status, created_at desc);
create index if not exists idx_medilink_listings_chapter on public.medilink_listings (chapter_id, status, created_at desc);

alter table public.medilink_listings enable row level security;

drop policy if exists "medilink_listings_select" on public.medilink_listings;
create policy "medilink_listings_select" on public.medilink_listings
  for select using (
    status = 'published'
    and (
      scope = 'ORGANIZATION'
      or public.in_chapter(chapter_id)
      or public.manages_chapter(chapter_id)
      or public.is_super_admin()
    )
  );

drop policy if exists "medilink_listings_write" on public.medilink_listings;
create policy "medilink_listings_write" on public.medilink_listings
  for all using (
    (
      scope = 'ORGANIZATION'
      and chapter_id is null
      and public.current_role() in ('SUPER_ADMIN', 'STATE_ADMIN')
    )
    or (
      scope = 'CHAPTER'
      and chapter_id is not null
      and public.manages_chapter(chapter_id)
    )
  )
  with check (
    (
      scope = 'ORGANIZATION'
      and chapter_id is null
      and public.current_role() in ('SUPER_ADMIN', 'STATE_ADMIN')
    )
    or (
      scope = 'CHAPTER'
      and chapter_id is not null
      and public.manages_chapter(chapter_id)
    )
  );

grant select on public.medilink_listings to anon, authenticated;
grant insert, update on public.medilink_listings to authenticated;
grant all on table public.medilink_listings to service_role;
