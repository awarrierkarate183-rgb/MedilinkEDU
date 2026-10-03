-- Chapter applications, profile emails, and service-role privilege updates.

alter table public.profiles
  add column if not exists email text;

create unique index if not exists profiles_email_lower_key
  on public.profiles (lower(email))
  where email is not null;

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
    if coalesce(auth.role(), '') = 'service_role' then
      return new;
    end if;
    if new.role is distinct from old.role and not public.is_super_admin() then
      raise exception 'Role changes must be performed by a trusted administrator.';
    end if;
    if new.state_scope is distinct from old.state_scope and not public.is_super_admin() then
      raise exception 'Administrative scope cannot be changed by this user.';
    end if;
  end if;
  return new;
end;
$$;

create table if not exists public.chapter_applications (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  advisor_profile_id uuid not null references public.profiles(id) on delete cascade,
  school_name text not null,
  city text not null,
  state text not null,
  advisor_first_name text not null,
  advisor_last_name text not null,
  advisor_email text not null,
  advisor_phone text not null default '',
  advisor_title text not null default '',
  principal_name text not null default '',
  estimated_students integer,
  statement text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists idx_chapter_applications_chapter
  on public.chapter_applications (chapter_id);
create index if not exists idx_chapter_applications_email
  on public.chapter_applications (lower(advisor_email));

alter table public.chapter_applications enable row level security;

drop policy if exists "applications_select" on public.chapter_applications;
create policy "applications_select" on public.chapter_applications
  for select using (
    public.is_super_admin()
    or advisor_profile_id = auth.uid()
    or public.manages_chapter(chapter_id)
  );

revoke all on function public.protect_profile_privileges() from public, anon, authenticated;
