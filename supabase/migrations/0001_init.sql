-- MediLink platform schema
-- Run this in a Supabase project before going live.
-- Enable RLS on every table. Do not disable it for convenience.

create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'SUPER_ADMIN',
  'STATE_ADMIN',
  'CHAPTER_ADVISOR',
  'STUDENT',
  'CHAPTER_OFFICER'
);

create type public.chapter_status as enum (
  'PROPOSED',
  'PENDING_APPROVAL',
  'FOUNDING',
  'ESTABLISHED',
  'FLAGSHIP_ELIGIBLE',
  'INACTIVE',
  'REACTIVATION_PENDING'
);

create type public.member_status as enum (
  'INVITED',
  'PENDING',
  'ACTIVE',
  'INACTIVE',
  'REMOVED'
);

create type public.advisor_status as enum (
  'PENDING',
  'ACTIVE',
  'SUSPENDED',
  'INACTIVE'
);

create type public.event_status as enum (
  'DRAFT',
  'PUBLISHED',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'COMPLETED',
  'CANCELLED'
);

create type public.competition_status as enum (
  'DRAFT',
  'UPCOMING',
  'REGISTRATION_OPEN',
  'REGISTRATION_CLOSED',
  'IN_PROGRESS',
  'JUDGING',
  'COMPLETED',
  'ARCHIVED'
);

create type public.idea_status as enum (
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'IN_DEVELOPMENT',
  'COMPLETED'
);

create type public.progress_status as enum (
  'NOT_STARTED',
  'IN_PROGRESS',
  'COMPLETED'
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'STUDENT',
  chapter_id uuid,
  grade text,
  status public.member_status not null default 'PENDING',
  advisor_status public.advisor_status,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_login_at timestamptz
);

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  chapter_code text unique not null,
  join_code text unique not null,
  name text not null,
  school text not null,
  city text,
  state text,
  country text not null default 'United States',
  status public.chapter_status not null default 'PROPOSED',
  founded_date date,
  advisor_id uuid references public.profiles(id),
  public_visibility boolean not null default false,
  chapter_description text,
  logo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_chapter_fk
  foreign key (chapter_id) references public.chapters(id);

create table public.chapter_members (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status public.member_status not null default 'PENDING',
  joined_at timestamptz,
  unique (chapter_id, profile_id)
);

create table public.chapter_officers (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  profile_id uuid not null references public.profiles(id),
  office text not null,
  active boolean not null default true
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  created_by uuid not null references public.profiles(id),
  intended_role public.app_role not null default 'STUDENT',
  email text,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  used_at timestamptz,
  max_uses integer not null default 1,
  use_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.apex_cycles (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  start_date date not null,
  end_date date not null,
  is_current boolean not null default false
);

create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind text not null,
  academic_year text,
  competition_year text,
  apex_cycle_id uuid references public.apex_cycles(id),
  status public.competition_status not null default 'DRAFT',
  team_event boolean not null default false,
  min_team_size integer,
  max_team_size integer,
  config jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type text not null,
  event_date date,
  start_time time,
  end_time time,
  location text,
  virtual_link text,
  eligibility text,
  registration_required boolean not null default false,
  capacity integer,
  chapter_id uuid references public.chapters(id),
  competition_id uuid references public.competitions(id),
  status public.event_status not null default 'DRAFT',
  created_at timestamptz not null default now()
);

create table public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'REGISTERED',
  created_at timestamptz not null default now(),
  unique (event_id, profile_id)
);

create table public.competition_teams (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id),
  name text not null,
  captain_id uuid references public.profiles(id),
  advisor_id uuid references public.profiles(id),
  status text not null default 'NOT_STARTED',
  created_at timestamptz not null default now()
);

create table public.competition_team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references public.competition_teams(id) on delete cascade,
  profile_id uuid not null references public.profiles(id),
  unique (team_id, profile_id)
);

create table public.competition_registrations (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  team_id uuid references public.competition_teams(id),
  chapter_id uuid not null references public.chapters(id),
  status text not null default 'NOT_STARTED',
  created_at timestamptz not null default now()
);

create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  chapter_id uuid not null references public.chapters(id),
  competition_id uuid references public.competitions(id),
  kind text not null,
  title text not null,
  status text not null default 'DRAFT',
  created_at timestamptz not null default now()
);

create table public.ideas (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id),
  chapter_id uuid not null references public.chapters(id),
  title text not null,
  problem text,
  who_affected text,
  proposed_solution text,
  why_it_matters text,
  technology_component text,
  financial_component text,
  healthcare_component text,
  category text not null default 'OTHER',
  status public.idea_status not null default 'DRAFT',
  advisor_feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.idea_members (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid not null references public.ideas(id) on delete cascade,
  profile_id uuid not null references public.profiles(id),
  unique (idea_id, profile_id)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  idea_id uuid references public.ideas(id),
  chapter_id uuid not null references public.chapters(id),
  advisor_id uuid references public.profiles(id),
  name text not null,
  problem text,
  solution text,
  goals text,
  competition_id uuid references public.competitions(id),
  created_at timestamptz not null default now()
);

create table public.curriculum_tracks (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique,
  name text not null,
  summary text
);

create table public.curriculum_modules (
  id uuid primary key default gen_random_uuid(),
  track_id uuid not null references public.curriculum_tracks(id) on delete cascade,
  code text not null unique,
  name text not null,
  short_description text,
  sort_order integer not null default 0
);

create table public.curriculum_progress (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  module_id uuid not null references public.curriculum_modules(id) on delete cascade,
  status public.progress_status not null default 'NOT_STARTED',
  unique (profile_id, module_id)
);

create table public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  audience text not null default 'MEMBER',
  url text,
  file_id uuid,
  competition_id uuid references public.competitions(id),
  track_id uuid references public.curriculum_tracks(id),
  academic_year text
);

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  audience text not null,
  chapter_id uuid references public.chapters(id),
  priority text not null default 'normal',
  publish_at timestamptz,
  expire_at timestamptz,
  author_id uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  image_path text,
  author_id uuid references public.profiles(id),
  published_at timestamptz,
  category text not null default 'MediLink',
  body text,
  tags text[] not null default '{}',
  published boolean not null default false
);

create table public.news_submissions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id),
  submitter_id uuid references public.profiles(id),
  title text not null,
  body text,
  status text not null default 'PENDING',
  created_at timestamptz not null default now()
);

create table public.points_transactions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters(id),
  profile_id uuid references public.profiles(id),
  apex_cycle_id uuid references public.apex_cycles(id),
  competition_id uuid references public.competitions(id),
  amount integer not null,
  reason text not null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.sponsors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  tier text,
  logo_path text,
  website text,
  description text,
  public_visibility boolean not null default false,
  benefits jsonb not null default '[]'::jsonb,
  active boolean not null default false
);

create table public.files (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id),
  chapter_id uuid references public.chapters(id),
  path text not null,
  mime_type text,
  byte_size integer,
  access text not null default 'CHAPTER',
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  target text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_super_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'SUPER_ADMIN'
  );
$$;

create or replace function public.chapter_id_for(uid uuid)
returns uuid
language sql
stable
as $$
  select chapter_id from public.profiles where id = uid;
$$;

alter table public.profiles enable row level security;
alter table public.chapters enable row level security;
alter table public.chapter_members enable row level security;
alter table public.chapter_officers enable row level security;
alter table public.invitations enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.competitions enable row level security;
alter table public.competition_teams enable row level security;
alter table public.competition_team_members enable row level security;
alter table public.competition_registrations enable row level security;
alter table public.submissions enable row level security;
alter table public.ideas enable row level security;
alter table public.idea_members enable row level security;
alter table public.projects enable row level security;
alter table public.curriculum_tracks enable row level security;
alter table public.curriculum_modules enable row level security;
alter table public.curriculum_progress enable row level security;
alter table public.resources enable row level security;
alter table public.announcements enable row level security;
alter table public.news_posts enable row level security;
alter table public.news_submissions enable row level security;
alter table public.points_transactions enable row level security;
alter table public.apex_cycles enable row level security;
alter table public.sponsors enable row level security;
alter table public.files enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

create policy "profiles self read" on public.profiles
  for select using (id = auth.uid() or public.is_super_admin() or chapter_id = public.chapter_id_for(auth.uid()));

create policy "profiles self update" on public.profiles
  for update using (id = auth.uid())
  with check (id = auth.uid() and role = (select role from public.profiles where id = auth.uid()));

create policy "chapters public read" on public.chapters
  for select using (public_visibility = true or public.is_super_admin() or id = public.chapter_id_for(auth.uid()));

create policy "members same chapter" on public.chapter_members
  for select using (chapter_id = public.chapter_id_for(auth.uid()) or public.is_super_admin());

create policy "invitations advisor" on public.invitations
  for all using (
    public.is_super_admin()
    or created_by = auth.uid()
    or chapter_id = public.chapter_id_for(auth.uid())
  );

create policy "events visible" on public.events
  for select using (
    status in ('PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'COMPLETED')
    or chapter_id = public.chapter_id_for(auth.uid())
    or public.is_super_admin()
  );

create policy "own registrations" on public.event_registrations
  for all using (profile_id = auth.uid() or public.is_super_admin());

create policy "competitions published" on public.competitions
  for select using (status <> 'DRAFT' or public.is_super_admin());

create policy "own ideas" on public.ideas
  for all using (owner_id = auth.uid() or chapter_id = public.chapter_id_for(auth.uid()) or public.is_super_admin());

create policy "own progress" on public.curriculum_progress
  for all using (profile_id = auth.uid() or public.is_super_admin());

create policy "tracks public" on public.curriculum_tracks for select using (true);
create policy "modules public" on public.curriculum_modules for select using (true);

create policy "resources by audience" on public.resources
  for select using (
    audience = 'PUBLIC'
    or (audience in ('MEMBER', 'ADVISOR') and auth.uid() is not null)
    or public.is_super_admin()
  );

create policy "announcements scoped" on public.announcements
  for select using (
    audience = 'ALL'
    or (chapter_id = public.chapter_id_for(auth.uid()))
    or public.is_super_admin()
  );

create policy "news published" on public.news_posts
  for select using (published = true or public.is_super_admin());

create policy "points chapter" on public.points_transactions
  for select using (chapter_id = public.chapter_id_for(auth.uid()) or public.is_super_admin());

create policy "no student write points" on public.points_transactions
  for insert with check (
    public.is_super_admin()
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role in ('CHAPTER_ADVISOR', 'STATE_ADMIN', 'SUPER_ADMIN')
    )
  );

create policy "notifications own" on public.notifications
  for all using (profile_id = auth.uid());

create policy "audit admin only" on public.audit_logs
  for select using (public.is_super_admin());

create policy "files scoped" on public.files
  for select using (
    owner_id = auth.uid()
    or (chapter_id = public.chapter_id_for(auth.uid()) and access in ('CHAPTER', 'ADVISOR'))
    or public.is_super_admin()
  );
