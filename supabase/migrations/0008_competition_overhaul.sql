-- Competition system overhaul.
-- Extends existing chapters, profiles, and apex_cycles. Does not create a second chapter or member system.
-- Manual fields: placements, confidential invitational scores, roster exceptions, publish flags.
-- Computed fields: Legacy points from the placement table, Normal chapter points from placements,
-- annual 65/25/10 scores, 2-year Apex ledger, Legacy Regional-top-5 and State-top-3 cutoffs.

create table if not exists public.catalog_events (
  id text primary key,
  name text not null,
  tier text not null check (tier in ('NORMAL', 'LEGACY')),
  format text not null check (format in ('SOLO_ONLY', 'TEAM_ONLY', 'SOLO_OR_TEAM')),
  min_team_size integer not null,
  max_team_size integer not null,
  format_label text not null,
  description text not null,
  sort_order integer not null
);
comment on table public.catalog_events is
  'The 20 Normal Events and 5 Legacy Events. Content catalogue, not a season registration.';

create table if not exists public.competition_seasons (
  id uuid primary key default gen_random_uuid(),
  label text not null unique,
  starts_on date not null,
  ends_on date not null,
  roster_locked boolean not null default false,
  invitational_nominations_open boolean not null default false,
  invitational_published boolean not null default false,
  is_current boolean not null default false,
  apex_cycle_id uuid references public.apex_cycles(id),
  created_at timestamptz not null default now()
);
comment on table public.competition_seasons is
  'One school-year competition season. roster_locked turns Legacy roster edits into an exception-only flow. is_current is the season the portal uses.';

create table if not exists public.normal_teams (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  catalog_event_id text not null references public.catalog_events(id),
  name text not null default '',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.normal_team_members (
  team_id uuid not null references public.normal_teams(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key (team_id, profile_id)
);

create table if not exists public.normal_event_registrations (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  catalog_event_id text not null references public.catalog_events(id),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  team_id uuid references public.normal_teams(id) on delete set null,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (season_id, catalog_event_id, profile_id)
);
comment on table public.normal_event_registrations is
  'One student in one Normal Event for a season. The six-event cap is enforced here. team_id is required for team-only events.';

create table if not exists public.legacy_delegations (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  submitted_at timestamptz,
  created_at timestamptz not null default now(),
  unique (season_id, chapter_id)
);
comment on table public.legacy_delegations is
  'The chapter eight-person Legacy roster for one season. Two groups of four live in legacy_delegation_members.';

create table if not exists public.legacy_delegation_members (
  delegation_id uuid not null references public.legacy_delegations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  group_label text not null check (group_label in ('A', 'B')),
  primary key (delegation_id, profile_id)
);

create table if not exists public.legacy_roster_exceptions (
  id uuid primary key default gen_random_uuid(),
  delegation_id uuid not null references public.legacy_delegations(id) on delete cascade,
  profile_id_out uuid references public.profiles(id),
  profile_id_in uuid references public.profiles(id),
  reason text not null check (reason in ('WITHDRAWAL_FROM_SCHOOL', 'MEDICAL', 'NATIONALLY_APPROVED')),
  notes text,
  approved_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
comment on table public.legacy_roster_exceptions is
  'The only allowed Legacy roster change after the season lock. Ordinary edits are blocked.';

create table if not exists public.legacy_event_entries (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  catalog_event_id text not null references public.catalog_events(id),
  group_label text not null check (group_label in ('A', 'B')),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (season_id, chapter_id, catalog_event_id)
);
comment on table public.legacy_event_entries is
  'Which group a chapter sends to a Legacy event. One group per event. Both groups cannot enter the same event.';

create table if not exists public.event_results (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  catalog_event_id text not null references public.catalog_events(id),
  round text not null check (round in ('REGIONAL', 'STATE', 'NATIONAL')),
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  profile_id uuid references public.profiles(id),
  team_id uuid references public.normal_teams(id),
  legacy_entry_id uuid references public.legacy_event_entries(id),
  placement integer not null check (placement >= 1),
  points integer not null default 0,
  published boolean not null default false,
  entered_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.event_results is
  'Entered placement. points is computed from the Legacy table or the Normal chapter-points table, not typed by hand.';

create table if not exists public.chapter_annual_rankings (
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  legacy_score numeric not null default 0,
  normal_score numeric not null default 0,
  membership_score numeric not null default 0,
  weighted_score numeric not null default 0,
  national_rank integer,
  state_rank integer,
  published boolean not null default false,
  computed_at timestamptz not null default now(),
  primary key (season_id, chapter_id)
);
comment on table public.chapter_annual_rankings is
  'Computed annual snapshot: 65% Legacy, 25% Normal, 10% membership. Not hand-entered. Distinct from the 2-year Apex ledger.';

create table if not exists public.apex_cumulative_ledger (
  apex_cycle_id uuid not null references public.apex_cycles(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  legacy_score numeric not null default 0,
  normal_score numeric not null default 0,
  membership_score numeric not null default 0,
  weighted_score numeric not null default 0,
  published boolean not null default false,
  computed_at timestamptz not null default now(),
  primary key (apex_cycle_id, chapter_id)
);
comment on table public.apex_cumulative_ledger is
  'Computed 2-year running total using the same 65/25/10 weights. Do not treat this as the annual Top 10.';

create table if not exists public.invitational_candidates (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  confidential_score numeric,
  nominated boolean not null default false,
  nominated_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (season_id, profile_id)
);
comment on table public.invitational_candidates is
  'Admin-only working list. confidential_score is never public and never shown to students.';

create table if not exists public.invitational_invitees (
  id uuid primary key default gen_random_uuid(),
  season_id uuid not null references public.competition_seasons(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  chapter_id uuid not null references public.chapters(id) on delete cascade,
  announced boolean not null default false,
  created_at timestamptz not null default now(),
  unique (season_id, profile_id)
);
comment on table public.invitational_invitees is
  'Final announced invitee list. Public only after announced = true.';

create or replace function public.enforce_normal_event_rules()
returns trigger
language plpgsql
as $$
declare
  event_row public.catalog_events%rowtype;
  event_count integer;
  member_count integer;
begin
  select * into event_row from public.catalog_events where id = new.catalog_event_id;
  if event_row.tier <> 'NORMAL' then
    raise exception 'That event is not a Normal Event.';
  end if;
  if event_row.format = 'SOLO_ONLY' and new.team_id is not null then
    raise exception 'The Chart Room and The Ledger are solo-only.';
  end if;
  if event_row.format = 'TEAM_ONLY' and new.team_id is null then
    raise exception 'That Normal Event requires a team of 2 to 5.';
  end if;
  if new.team_id is not null then
    select count(*) into member_count from public.normal_team_members where team_id = new.team_id;
    if member_count < event_row.min_team_size or member_count > event_row.max_team_size then
      raise exception 'That team does not match the event format.';
    end if;
  end if;
  select count(distinct catalog_event_id) into event_count
  from public.normal_event_registrations
  where season_id = new.season_id
    and profile_id = new.profile_id
    and catalog_event_id <> new.catalog_event_id;
  if event_count >= 6 then
    raise exception 'A student may register for at most six Normal Events in a season.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_normal_event_rules on public.normal_event_registrations;
create trigger trg_normal_event_rules
before insert or update on public.normal_event_registrations
for each row execute function public.enforce_normal_event_rules();

create or replace function public.enforce_legacy_roster_rules()
returns trigger
language plpgsql
as $$
declare
  group_count integer;
  total_count integer;
  locked boolean;
  season uuid;
begin
  select count(*) into group_count
  from public.legacy_delegation_members
  where delegation_id = new.delegation_id and group_label = new.group_label and profile_id <> new.profile_id;
  if group_count >= 4 then
    raise exception 'A Legacy group may have at most four students.';
  end if;
  select count(*) into total_count
  from public.legacy_delegation_members
  where delegation_id = new.delegation_id and profile_id <> new.profile_id;
  if total_count >= 8 then
    raise exception 'A chapter Legacy roster may have at most eight students.';
  end if;
  select s.roster_locked, d.season_id into locked, season
  from public.legacy_delegations d
  join public.competition_seasons s on s.id = d.season_id
  where d.id = new.delegation_id;
  if locked and tg_op = 'INSERT' then
    if not exists (
      select 1 from public.legacy_roster_exceptions e
      where e.delegation_id = new.delegation_id and e.profile_id_in = new.profile_id
    ) then
      raise exception 'The Legacy roster is locked for this season. Use a documented exception.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_legacy_roster_rules on public.legacy_delegation_members;
create trigger trg_legacy_roster_rules
before insert or update on public.legacy_delegation_members
for each row execute function public.enforce_legacy_roster_rules();

create or replace function public.enforce_legacy_entry_rules()
returns trigger
language plpgsql
as $$
declare
  event_tier text;
begin
  select tier into event_tier from public.catalog_events where id = new.catalog_event_id;
  if event_tier <> 'LEGACY' then
    raise exception 'That event is not a Legacy Event.';
  end if;
  if not exists (
    select 1
    from public.legacy_delegations d
    join public.legacy_delegation_members m on m.delegation_id = d.id
    where d.season_id = new.season_id
      and d.chapter_id = new.chapter_id
      and m.group_label = new.group_label
    group by m.group_label
    having count(*) = 4
  ) then
    raise exception 'That Legacy group must have four students before it can enter an event.';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_legacy_entry_rules on public.legacy_event_entries;
create trigger trg_legacy_entry_rules
before insert or update on public.legacy_event_entries
for each row execute function public.enforce_legacy_entry_rules();

create or replace function public.enforce_invitational_nomination_cap()
returns trigger
language plpgsql
as $$
declare
  nomination_count integer;
begin
  if new.nominated then
    select count(*) into nomination_count
    from public.invitational_candidates
    where season_id = new.season_id
      and chapter_id = new.chapter_id
      and nominated = true
      and profile_id <> new.profile_id;
    if nomination_count >= 2 then
      raise exception 'A chapter may nominate at most two students for the invitational.';
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_invitational_nomination_cap on public.invitational_candidates;
create trigger trg_invitational_nomination_cap
before insert or update on public.invitational_candidates
for each row execute function public.enforce_invitational_nomination_cap();

insert into public.catalog_events (id, name, tier, format, min_team_size, max_team_size, format_label, description, sort_order) values
  ('triage-protocol', 'Triage Protocol', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'On-site clinical-reasoning case, patient prioritization and safe action sequencing under uncertainty.', 1),
  ('the-chart-room', 'The Chart Room', 'NORMAL', 'SOLO_ONLY', 1, 1, 'Solo-only', 'Timed event finding a planted documentation error in a fictional patient chart before it causes harm or a billing issue.', 2),
  ('system-failure', 'System Failure', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Trace a physiological system breakdown through its clinical and financial cascade.', 3),
  ('patient-zero', 'Patient Zero', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Investigate a fictional outbreak using case data and exposure patterns to find the source and recommend a response.', 4),
  ('under-review', 'Under Review', 'NORMAL', 'TEAM_ONLY', 2, 5, 'Team-only, 2 to 5', 'Evaluate a fictional study with a planted methodological or ethical flaw and rule on its conclusion.', 5),
  ('the-gray-area', 'The Gray Area', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Work a genuinely hard ethical dilemma and defend one actual recommendation.', 6),
  ('the-floor', 'The Floor', 'NORMAL', 'TEAM_ONLY', 2, 5, 'Team-only, 2 to 5', 'Argue opposite sides of a healthcare policy proposal before a judged panel.', 7),
  ('pitch-day', 'Pitch Day', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Pitch a healthcare solution and defend need, implementation, and financial viability live.', 8),
  ('the-ledger', 'The Ledger', 'NORMAL', 'SOLO_ONLY', 1, 1, 'Solo-only', 'Individual financial-literacy event built around real healthcare money decisions.', 9),
  ('market-call', 'Market Call', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Read real market information, build a position, defend it under live questioning.', 10),
  ('the-term-sheet', 'The Term Sheet', 'NORMAL', 'TEAM_ONLY', 2, 5, 'Team-only, 2 to 5', 'Analyze a company''s financials and negotiate a funding recommendation.', 11),
  ('scarcity', 'Scarcity', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Work through how price, supply, insurance, and regulation shape access to care.', 12),
  ('operating-margin', 'Operating Margin', 'NORMAL', 'TEAM_ONLY', 2, 5, 'Team-only, 2 to 5', 'Solve a real operational problem for a fictional hospital or clinic under budget constraints.', 13),
  ('the-pipeline', 'The Pipeline', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Evaluate how trials, patents, manufacturing, and pricing shape a biotech or pharmaceutical bet.', 14),
  ('claim-denied', 'Claim Denied', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Work a denied insurance claim from both sides toward a fair, defensible resolution.', 15),
  ('the-turnaround', 'The Turnaround', 'NORMAL', 'TEAM_ONLY', 2, 5, 'Team-only, 2 to 5', 'Run a struggling fictional healthcare organization through an operational crisis.', 16),
  ('signal-vs-noise', 'Signal vs. Noise', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Evaluate a proposed AI or digital health tool on safety, bias, adoption, and business case.', 17),
  ('seed-round', 'Seed Round', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Build a healthcare venture concept and pitch it as something an investor could fund.', 18),
  ('borders-and-budgets', 'Borders & Budgets', 'NORMAL', 'SOLO_OR_TEAM', 1, 5, 'Solo or team, up to 5', 'Take on a specific under-resourced region''s health challenge within real budget and infrastructure limits.', 19),
  ('on-record', 'On Record', 'NORMAL', 'TEAM_ONLY', 2, 5, 'Team-only, 2 to 5', 'Respond to a health misinformation or public-trust crisis with a real communication strategy under deadline.', 20),
  ('the-meridian-hearing', 'The Meridian Hearing', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Mock hearing. One group of four.', 'A hospital system''s AI triage algorithm faces a regulatory challenge over bias, liability, and cost savings.', 21),
  ('the-rural-lifeline-case', 'The Rural Lifeline Case', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Executive turnaround case. One group of four.', 'Lead a financially distressed rural hospital''s response to an obstetrics unit closure threat.', 22),
  ('project-onconova', 'Project OncoNova', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Investment-committee simulation. One group of four.', 'Evaluate a fictional oncology therapy''s trial data, patent risk, and valuation for a funding decision.', 23),
  ('the-valuecare-arbitration', 'The ValueCare Arbitration', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Negotiation and adjudication. One group of four.', 'Resolve a dispute over a value-based payment contract for chronic-disease care.', 24),
  ('operation-containment', 'Operation Containment', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Crisis command simulation. One group of four.', 'Manage a multi-jurisdiction outbreak response under a fixed emergency budget.', 25)
on conflict (id) do update set
  name = excluded.name,
  tier = excluded.tier,
  format = excluded.format,
  min_team_size = excluded.min_team_size,
  max_team_size = excluded.max_team_size,
  format_label = excluded.format_label,
  description = excluded.description,
  sort_order = excluded.sort_order;

insert into public.competition_seasons (label, starts_on, ends_on, roster_locked, is_current)
values ('2026-2027', '2026-07-01', '2027-06-30', false, true)
on conflict (label) do nothing;

alter table public.catalog_events enable row level security;
alter table public.competition_seasons enable row level security;
alter table public.normal_teams enable row level security;
alter table public.normal_team_members enable row level security;
alter table public.normal_event_registrations enable row level security;
alter table public.legacy_delegations enable row level security;
alter table public.legacy_delegation_members enable row level security;
alter table public.legacy_roster_exceptions enable row level security;
alter table public.legacy_event_entries enable row level security;
alter table public.event_results enable row level security;
alter table public.chapter_annual_rankings enable row level security;
alter table public.apex_cumulative_ledger enable row level security;
alter table public.invitational_candidates enable row level security;
alter table public.invitational_invitees enable row level security;

revoke all on table public.invitational_candidates from anon, authenticated, public;
grant all on table public.invitational_candidates to service_role;

drop policy if exists catalog_events_read on public.catalog_events;
create policy catalog_events_read on public.catalog_events for select using (true);

drop policy if exists seasons_read on public.competition_seasons;
create policy seasons_read on public.competition_seasons for select to authenticated using (true);

drop policy if exists normal_reg_read on public.normal_event_registrations;
create policy normal_reg_read on public.normal_event_registrations
for select to authenticated
using (
  profile_id = auth.uid()
  or chapter_id in (select chapter_id from public.profiles where id = auth.uid())
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN'))
);

drop policy if exists legacy_del_read on public.legacy_delegations;
create policy legacy_del_read on public.legacy_delegations
for select to authenticated
using (
  chapter_id in (select chapter_id from public.profiles where id = auth.uid())
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN'))
);

drop policy if exists legacy_mem_read on public.legacy_delegation_members;
create policy legacy_mem_read on public.legacy_delegation_members
for select to authenticated
using (
  profile_id = auth.uid()
  or delegation_id in (
    select d.id from public.legacy_delegations d
    join public.profiles p on p.chapter_id = d.chapter_id
    where p.id = auth.uid()
  )
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN'))
);

drop policy if exists results_read_published on public.event_results;
create policy results_read_published on public.event_results
for select to authenticated
using (
  published = true
  or exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN'))
);

drop policy if exists annual_rank_public on public.chapter_annual_rankings;
create policy annual_rank_public on public.chapter_annual_rankings
for select using (published = true or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN')
));

drop policy if exists apex_ledger_public on public.apex_cumulative_ledger;
create policy apex_ledger_public on public.apex_cumulative_ledger
for select using (published = true or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN')
));

drop policy if exists invitees_public on public.invitational_invitees;
create policy invitees_public on public.invitational_invitees
for select using (announced = true or exists (
  select 1 from public.profiles p where p.id = auth.uid() and p.role in ('SUPER_ADMIN', 'STATE_ADMIN')
));

notify pgrst, 'reload schema';
