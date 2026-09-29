-- MediLink platform completion: columns, tables, indexes, helpers, RLS, storage.
-- Apply after 0001_init.sql. Do not recreate the database from memory.

alter table public.profiles
  add column if not exists first_name text not null default '',
  add column if not exists last_name text not null default '',
  add column if not exists display_name text not null default '',
  add column if not exists avatar_url text,
  add column if not exists state_scope text;

alter table public.chapters
  add column if not exists slug text,
  add column if not exists description text;

update public.chapters
set slug = lower(regexp_replace(coalesce(chapter_code, id::text), '[^a-zA-Z0-9]+', '-', 'g'))
where slug is null;

update public.chapters
set description = chapter_description
where description is null and chapter_description is not null;

create unique index if not exists chapters_slug_key on public.chapters (slug);

alter table public.chapter_members
  add column if not exists left_at timestamptz,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$ begin
  create type public.officer_position as enum (
    'president',
    'vp_operations',
    'finance_treasury',
    'technology',
    'outreach_service'
  );
exception
  when duplicate_object then null;
end $$;

alter table public.chapter_officers
  add column if not exists position public.officer_position,
  add column if not exists start_date date,
  add column if not exists end_date date,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

alter table public.events
  add column if not exists start_at timestamptz,
  add column if not exists end_at timestamptz,
  add column if not exists created_by uuid references public.profiles(id),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists event_type text;

update public.events
set event_type = type
where event_type is null;

update public.events
set start_at = (event_date::timestamptz)
where start_at is null and event_date is not null;

alter table public.event_registrations
  add column if not exists registered_at timestamptz not null default now(),
  add column if not exists cancelled_at timestamptz;

alter table public.competitions
  add column if not exists description text,
  add column if not exists annual boolean not null default true,
  add column if not exists apex_related boolean not null default false,
  add column if not exists active boolean not null default true,
  add column if not exists current_year text,
  add column if not exists created_at timestamptz not null default now();

create table if not exists public.competition_stages (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  name text not null,
  sequence integer not null,
  description text,
  requirements text,
  active boolean not null default true,
  unique (competition_id, sequence)
);

alter table public.competition_registrations
  add column if not exists stage_id uuid references public.competition_stages(id),
  add column if not exists updated_at timestamptz not null default now();

alter table public.competition_teams
  add column if not exists updated_at timestamptz not null default now();

alter table public.competition_team_members
  add column if not exists role text not null default 'member',
  add column if not exists joined_at timestamptz not null default now();

alter table public.submissions
  add column if not exists stage_id uuid references public.competition_stages(id),
  add column if not exists team_id uuid references public.competition_teams(id),
  add column if not exists submitted_by uuid references public.profiles(id),
  add column if not exists description text,
  add column if not exists file_id uuid references public.files(id),
  add column if not exists submitted_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles(id),
  add column if not exists feedback text,
  add column if not exists updated_at timestamptz not null default now();

create table if not exists public.competition_results (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  stage_id uuid references public.competition_stages(id),
  team_id uuid references public.competition_teams(id),
  chapter_id uuid references public.chapters(id),
  profile_id uuid references public.profiles(id),
  placement integer,
  award text,
  score numeric,
  year text,
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.points_transactions
  add column if not exists stage_id uuid references public.competition_stages(id),
  add column if not exists team_id uuid references public.competition_teams(id),
  add column if not exists event_date date,
  add column if not exists reason_code text;

alter table public.apex_cycles
  add column if not exists name text,
  add column if not exists status text not null default 'planned',
  add column if not exists created_at timestamptz not null default now();

update public.apex_cycles set name = label where name is null;

alter table public.curriculum_tracks
  add column if not exists active boolean not null default true;

alter table public.curriculum_modules
  add column if not exists number integer,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists content text,
  add column if not exists estimated_time text,
  add column if not exists public_preview boolean not null default false,
  add column if not exists active boolean not null default true;

update public.curriculum_modules set title = name where title is null;
update public.curriculum_modules set description = short_description where description is null;

alter table public.curriculum_progress
  add column if not exists started_at timestamptz,
  add column if not exists completed_at timestamptz,
  add column if not exists progress_percent integer not null default 0
    check (progress_percent >= 0 and progress_percent <= 100);

alter table public.ideas
  add column if not exists clinical_component text,
  add column if not exists archived_at timestamptz;

update public.ideas
set clinical_component = healthcare_component
where clinical_component is null and healthcare_component is not null;

alter table public.idea_members
  add column if not exists role text not null default 'member',
  add column if not exists created_at timestamptz not null default now();

alter table public.projects
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists status text not null default 'active',
  add column if not exists updated_at timestamptz not null default now();

update public.projects set title = name where title is null;
update public.projects set description = problem where description is null;

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  status text not null default 'pending',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  content text not null,
  created_at timestamptz not null default now()
);

alter table public.announcements
  add column if not exists body text,
  add column if not exists audience_type text,
  add column if not exists published_at timestamptz,
  add column if not exists expires_at timestamptz,
  add column if not exists created_by uuid references public.profiles(id),
  add column if not exists status text not null default 'draft';

update public.announcements set body = message where body is null;
update public.announcements set audience_type = audience where audience_type is null;
update public.announcements set published_at = publish_at where published_at is null;
update public.announcements set expires_at = expire_at where expires_at is null;
update public.announcements set created_by = author_id where created_by is null;

alter table public.news_posts
  add column if not exists slug text,
  add column if not exists excerpt text,
  add column if not exists cover_image text,
  add column if not exists status text not null default 'draft',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

update public.news_posts set excerpt = subtitle where excerpt is null;
update public.news_posts set cover_image = image_path where cover_image is null;
update public.news_posts
set status = case when published then 'published' else 'draft' end
where status = 'draft' and published = true;

create unique index if not exists news_posts_slug_key on public.news_posts (slug) where slug is not null;

alter table public.resources
  add column if not exists description text,
  add column if not exists resource_type text not null default 'link',
  add column if not exists access_level text not null default 'member',
  add column if not exists curriculum_module_id uuid references public.curriculum_modules(id),
  add column if not exists created_at timestamptz not null default now();

alter table public.notifications
  add column if not exists message text,
  add column if not exists link text;

update public.notifications set message = body where message is null;

alter table public.audit_logs
  add column if not exists entity_type text,
  add column if not exists entity_id uuid;

create index if not exists idx_profiles_chapter on public.profiles (chapter_id);
create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_chapter_members_profile on public.chapter_members (profile_id);
create index if not exists idx_chapter_members_chapter_status on public.chapter_members (chapter_id, status);
create index if not exists idx_chapters_state on public.chapters (state);
create index if not exists idx_chapters_status on public.chapters (status);
create index if not exists idx_events_chapter on public.events (chapter_id);
create index if not exists idx_events_start on public.events (start_at);
create index if not exists idx_events_status on public.events (status);
create index if not exists idx_event_registrations_profile on public.event_registrations (profile_id);
create index if not exists idx_invitations_chapter on public.invitations (chapter_id);
create index if not exists idx_invitations_email on public.invitations (email);
create index if not exists idx_competitions_status on public.competitions (status);
create index if not exists idx_competition_stages_comp on public.competition_stages (competition_id);
create index if not exists idx_competition_regs_chapter on public.competition_registrations (chapter_id);
create index if not exists idx_competition_regs_profile on public.competition_registrations (profile_id);
create index if not exists idx_teams_chapter on public.competition_teams (chapter_id);
create index if not exists idx_team_members_profile on public.competition_team_members (profile_id);
create index if not exists idx_submissions_chapter on public.submissions (chapter_id);
create index if not exists idx_results_competition on public.competition_results (competition_id);
create index if not exists idx_points_chapter_created on public.points_transactions (chapter_id, created_at);
create index if not exists idx_points_profile on public.points_transactions (profile_id);
create index if not exists idx_ideas_owner on public.ideas (owner_id);
create index if not exists idx_ideas_chapter on public.ideas (chapter_id);
create index if not exists idx_projects_chapter on public.projects (chapter_id);
create index if not exists idx_milestones_project on public.project_milestones (project_id);
create index if not exists idx_progress_profile on public.curriculum_progress (profile_id);
create index if not exists idx_announcements_chapter on public.announcements (chapter_id);
create index if not exists idx_notifications_profile_created on public.notifications (profile_id, created_at);
create index if not exists idx_audit_created on public.audit_logs (created_at);
create index if not exists idx_resources_access on public.resources (access_level);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'SUPER_ADMIN'
  );
$$;

create or replace function public.current_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.current_state_scope()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select state_scope from public.profiles where id = auth.uid();
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role in ('CHAPTER_ADVISOR', 'STATE_ADMIN', 'SUPER_ADMIN')
  );
$$;

create or replace function public.manages_chapter(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles p
    left join public.chapters c on c.id = cid
    where p.id = auth.uid()
      and (
        p.role = 'SUPER_ADMIN'
        or (p.role = 'STATE_ADMIN' and c.state is not null and c.state = p.state_scope)
        or (
          p.role = 'CHAPTER_ADVISOR'
          and (
            p.chapter_id = cid
            or c.advisor_id = p.id
            or exists (
              select 1 from public.chapter_members m
              where m.chapter_id = cid
                and m.profile_id = p.id
                and m.status = 'ACTIVE'
            )
          )
        )
      )
  );
$$;

create or replace function public.in_chapter(cid uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid()
      and (
        p.chapter_id = cid
        or exists (
          select 1 from public.chapter_members m
          where m.profile_id = p.id
            and m.chapter_id = cid
            and m.status in ('ACTIVE', 'PENDING', 'INVITED')
        )
      )
  );
$$;

create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'UPDATE' then
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

drop trigger if exists trg_protect_profile_privileges on public.profiles;
create trigger trg_protect_profile_privileges
before update on public.profiles
for each row execute function public.protect_profile_privileges();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  given_name text;
  family_name text;
  display text;
begin
  given_name := coalesce(new.raw_user_meta_data->>'first_name', '');
  family_name := coalesce(new.raw_user_meta_data->>'last_name', '');
  display := coalesce(
    new.raw_user_meta_data->>'display_name',
    new.raw_user_meta_data->>'full_name',
    trim(both from given_name || ' ' || family_name),
    ''
  );
  insert into public.profiles (
    id, full_name, first_name, last_name, display_name, role, status
  ) values (
    new.id,
    display,
    given_name,
    family_name,
    display,
    'STUDENT',
    'PENDING'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.competition_stages enable row level security;
alter table public.competition_results enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_updates enable row level security;

drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "chapters public read" on public.chapters;
drop policy if exists "members same chapter" on public.chapter_members;
drop policy if exists "invitations advisor" on public.invitations;
drop policy if exists "events visibile" on public.events;
drop policy if exists "events visible" on public.events;
drop policy if exists "own registrations" on public.event_registrations;
drop policy if exists "competitions published" on public.competitions;
drop policy if exists "own ideas" on public.ideas;
drop policy if exists "own progress" on public.curriculum_progress;
drop policy if exists "tracks public" on public.curriculum_tracks;
drop policy if exists "modules public" on public.curriculum_modules;
drop policy if exists "resources by audience" on public.resources;
drop policy if exists "announcements scoped" on public.announcements;
drop policy if exists "news published" on public.news_posts;
drop policy if exists "points chapter" on public.points_transactions;
drop policy if exists "no student write points" on public.points_transactions;
drop policy if exists "notifications own" on public.notifications;
drop policy if exists "audit admin only" on public.audit_logs;
drop policy if exists "files scoped" on public.files;

create policy "profiles_select_own" on public.profiles
  for select using (id = auth.uid() or public.is_super_admin() or public.manages_chapter(chapter_id));

create policy "profiles_update_own" on public.profiles
  for update using (id = auth.uid() or public.is_super_admin())
  with check (id = auth.uid() or public.is_super_admin());

create policy "chapters_select" on public.chapters
  for select using (
    public_visibility = true
    or public.is_super_admin()
    or public.in_chapter(id)
    or public.manages_chapter(id)
  );

create policy "chapters_update_managers" on public.chapters
  for update using (public.manages_chapter(id))
  with check (public.manages_chapter(id));

create policy "members_select" on public.chapter_members
  for select using (
    profile_id = auth.uid()
    or public.manages_chapter(chapter_id)
  );

create policy "members_insert_self_pending" on public.chapter_members
  for insert with check (
    profile_id = auth.uid()
    and status in ('PENDING', 'INVITED')
    and exists (
      select 1 from public.chapters c
      where c.id = chapter_id and c.public_visibility = true
    )
  );

create policy "members_update_managers" on public.chapter_members
  for update using (public.manages_chapter(chapter_id))
  with check (public.manages_chapter(chapter_id));

create policy "officers_select" on public.chapter_officers
  for select using (public.in_chapter(chapter_id) or public.manages_chapter(chapter_id));

create policy "officers_manage" on public.chapter_officers
  for all using (public.manages_chapter(chapter_id))
  with check (public.manages_chapter(chapter_id));

create policy "invitations_select_managers" on public.invitations
  for select using (public.manages_chapter(chapter_id));

create policy "invitations_insert_managers" on public.invitations
  for insert with check (
    public.manages_chapter(chapter_id)
    and created_by = auth.uid()
  );

create policy "invitations_update_managers" on public.invitations
  for update using (public.manages_chapter(chapter_id))
  with check (public.manages_chapter(chapter_id));

create policy "events_select" on public.events
  for select using (
    status in ('PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'COMPLETED')
    or public.in_chapter(chapter_id)
    or public.manages_chapter(chapter_id)
    or public.is_super_admin()
  );

create policy "events_write_managers" on public.events
  for all using (
    public.manages_chapter(chapter_id)
    or (chapter_id is null and public.is_super_admin())
  )
  with check (
    public.manages_chapter(chapter_id)
    or (chapter_id is null and public.is_super_admin())
  );

create policy "event_regs_select" on public.event_registrations
  for select using (
    profile_id = auth.uid()
    or public.is_super_admin()
    or exists (
      select 1 from public.events e
      where e.id = event_id and public.manages_chapter(e.chapter_id)
    )
  );

create policy "event_regs_insert_self" on public.event_registrations
  for insert with check (profile_id = auth.uid());

create policy "event_regs_update_self" on public.event_registrations
  for update using (profile_id = auth.uid() or public.is_super_admin())
  with check (profile_id = auth.uid() or public.is_super_admin());

create policy "competitions_select" on public.competitions
  for select using (status <> 'DRAFT' or public.is_staff());

create policy "competition_stages_select" on public.competition_stages
  for select using (
    exists (
      select 1 from public.competitions c
      where c.id = competition_id and (c.status <> 'DRAFT' or public.is_staff())
    )
  );

create policy "teams_select" on public.competition_teams
  for select using (
    public.in_chapter(chapter_id)
    or public.manages_chapter(chapter_id)
    or captain_id = auth.uid()
  );

create policy "teams_manage" on public.competition_teams
  for all using (public.manages_chapter(chapter_id))
  with check (public.manages_chapter(chapter_id));

create policy "team_members_select" on public.competition_team_members
  for select using (
    profile_id = auth.uid()
    or exists (
      select 1 from public.competition_teams t
      where t.id = team_id
        and (public.in_chapter(t.chapter_id) or public.manages_chapter(t.chapter_id))
    )
  );

create policy "comp_regs_select" on public.competition_registrations
  for select using (
    profile_id = auth.uid()
    or public.manages_chapter(chapter_id)
  );

create policy "comp_regs_insert_self" on public.competition_registrations
  for insert with check (
    profile_id = auth.uid()
    and public.in_chapter(chapter_id)
  );

create policy "submissions_select" on public.submissions
  for select using (
    owner_id = auth.uid()
    or submitted_by = auth.uid()
    or public.manages_chapter(chapter_id)
  );

create policy "submissions_insert_own" on public.submissions
  for insert with check (
    owner_id = auth.uid()
    and public.in_chapter(chapter_id)
  );

create policy "submissions_update_own_draft" on public.submissions
  for update using (
    (owner_id = auth.uid() and status in ('DRAFT', 'revision_requested', 'REVISION_REQUESTED'))
    or public.manages_chapter(chapter_id)
  )
  with check (
    (owner_id = auth.uid() and status in ('DRAFT', 'SUBMITTED', 'revision_requested', 'REVISION_REQUESTED'))
    or public.manages_chapter(chapter_id)
  );

create policy "results_select_published" on public.competition_results
  for select using (published = true or public.is_staff() or public.manages_chapter(chapter_id));

create policy "results_write_admins" on public.competition_results
  for all using (public.is_super_admin())
  with check (public.is_super_admin());

create policy "ideas_select" on public.ideas
  for select using (
    owner_id = auth.uid()
    or public.manages_chapter(chapter_id)
    or exists (
      select 1 from public.idea_members m
      where m.idea_id = id and m.profile_id = auth.uid()
    )
  );

create policy "ideas_insert_own" on public.ideas
  for insert with check (owner_id = auth.uid() and public.in_chapter(chapter_id));

create policy "ideas_update_members" on public.ideas
  for update using (
    owner_id = auth.uid()
    or public.manages_chapter(chapter_id)
    or exists (
      select 1 from public.idea_members m
      where m.idea_id = id and m.profile_id = auth.uid()
    )
  )
  with check (
    owner_id = auth.uid()
    or public.manages_chapter(chapter_id)
    or exists (
      select 1 from public.idea_members m
      where m.idea_id = id and m.profile_id = auth.uid()
    )
  );

create policy "idea_members_select" on public.idea_members
  for select using (
    profile_id = auth.uid()
    or exists (
      select 1 from public.ideas i
      where i.id = idea_id
        and (i.owner_id = auth.uid() or public.manages_chapter(i.chapter_id))
    )
  );

create policy "projects_select" on public.projects
  for select using (public.in_chapter(chapter_id) or public.manages_chapter(chapter_id));

create policy "projects_write_managers" on public.projects
  for all using (public.manages_chapter(chapter_id))
  with check (public.manages_chapter(chapter_id));

create policy "milestones_select" on public.project_milestones
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (public.in_chapter(p.chapter_id) or public.manages_chapter(p.chapter_id))
    )
  );

create policy "updates_select" on public.project_updates
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_id
        and (public.in_chapter(p.chapter_id) or public.manages_chapter(p.chapter_id))
    )
  );

create policy "updates_insert_members" on public.project_updates
  for insert with check (
    author_id = auth.uid()
    and exists (
      select 1 from public.projects p
      where p.id = project_id and public.in_chapter(p.chapter_id)
    )
  );

create policy "progress_select" on public.curriculum_progress
  for select using (
    profile_id = auth.uid()
    or public.is_super_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = profile_id and public.manages_chapter(p.chapter_id)
    )
  );

create policy "progress_write_own" on public.curriculum_progress
  for all using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "tracks_select" on public.curriculum_tracks for select using (true);
create policy "modules_select" on public.curriculum_modules for select using (true);

create policy "resources_select" on public.resources
  for select using (
    access_level = 'public' or audience = 'PUBLIC'
    or (access_level in ('member', 'student') and auth.uid() is not null)
    or (access_level = 'advisor' and public.is_staff())
    or (access_level = 'admin' and public.is_super_admin())
    or public.is_super_admin()
  );

create policy "announcements_select" on public.announcements
  for select using (
    (status in ('published', 'PUBLISHED') or publish_at is not null or published_at is not null)
    and (
      audience in ('ALL', 'all')
      or audience_type in ('all', 'ALL')
      or (audience_type in ('students', 'STUDENTS') and public.current_role() in ('STUDENT', 'CHAPTER_OFFICER'))
      or (audience_type in ('advisors', 'ADVISORS') and public.is_staff())
      or public.in_chapter(chapter_id)
      or public.manages_chapter(chapter_id)
      or public.is_super_admin()
    )
  );

create policy "announcements_write_managers" on public.announcements
  for all using (
    public.manages_chapter(chapter_id)
    or (chapter_id is null and public.is_super_admin())
  )
  with check (
    public.manages_chapter(chapter_id)
    or (chapter_id is null and public.is_super_admin())
  );

create policy "news_select" on public.news_posts
  for select using (published = true or status = 'published' or public.is_staff());

create policy "news_submissions_own" on public.news_submissions
  for select using (submitter_id = auth.uid() or public.is_staff());

create policy "news_submissions_insert" on public.news_submissions
  for insert with check (submitter_id = auth.uid());

create policy "points_select" on public.points_transactions
  for select using (
    public.in_chapter(chapter_id)
    or public.manages_chapter(chapter_id)
    or profile_id = auth.uid()
  );

create policy "points_insert_managers" on public.points_transactions
  for insert with check (public.manages_chapter(chapter_id));

create policy "apex_select" on public.apex_cycles for select using (true);

create policy "sponsors_select" on public.sponsors
  for select using (public_visibility = true or public.is_staff());

create policy "files_select" on public.files
  for select using (
    owner_id = auth.uid()
    or public.is_super_admin()
    or (access = 'PUBLIC')
    or (public.manages_chapter(chapter_id) and access in ('CHAPTER', 'ADVISOR', 'ADMIN'))
    or (public.in_chapter(chapter_id) and access = 'CHAPTER')
  );

create policy "files_insert_own" on public.files
  for insert with check (owner_id = auth.uid());

create policy "notifications_own" on public.notifications
  for select using (profile_id = auth.uid());

create policy "notifications_insert_self_or_staff" on public.notifications
  for insert with check (profile_id = auth.uid() or public.is_staff());

create policy "notifications_update_own" on public.notifications
  for update using (profile_id = auth.uid())
  with check (profile_id = auth.uid());

create policy "audit_select_admins" on public.audit_logs
  for select using (public.is_super_admin());

create policy "audit_insert_authenticated" on public.audit_logs
  for insert with check (actor_id = auth.uid() or public.is_staff());

insert into storage.buckets (id, name, public)
values
  ('chapter-assets', 'chapter-assets', true),
  ('student-submissions', 'student-submissions', false),
  ('project-files', 'project-files', false),
  ('advisor-resources', 'advisor-resources', false)
on conflict (id) do nothing;

drop policy if exists "public_chapter_assets_read" on storage.objects;
create policy "public_chapter_assets_read" on storage.objects
  for select using (bucket_id = 'chapter-assets');

drop policy if exists "managers_upload_chapter_assets" on storage.objects;
create policy "managers_upload_chapter_assets" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'chapter-assets' and public.is_staff());

drop policy if exists "own_student_submissions_read" on storage.objects;
create policy "own_student_submissions_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'student-submissions'
    and (
      (storage.foldername(name))[1] = auth.uid()::text
      or public.is_staff()
    )
  );

drop policy if exists "own_student_submissions_write" on storage.objects;
create policy "own_student_submissions_write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'student-submissions'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "project_files_read" on storage.objects;
create policy "project_files_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-files' and auth.uid() is not null);

drop policy if exists "advisor_resources_read" on storage.objects;
create policy "advisor_resources_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'advisor-resources' and public.is_staff());

drop policy if exists "advisor_resources_write" on storage.objects;
create policy "advisor_resources_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'advisor-resources' and public.is_staff());

grant select, insert, update, delete on public.competition_stages to authenticated;
grant select, insert, update, delete on public.competition_results to authenticated;
grant select, insert, update, delete on public.project_milestones to authenticated;
grant select, insert, update, delete on public.project_updates to authenticated;
grant select on public.competition_stages to anon;
grant select on public.competition_results to anon;
