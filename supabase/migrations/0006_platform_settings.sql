-- Org-wide mail settings so student invites can leave MediLink automatically.
-- Only the service role reads this table. Browser clients have no policy.

create table if not exists public.platform_settings (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.profiles(id) on delete set null
);

alter table public.platform_settings enable row level security;

revoke all on table public.platform_settings from anon, authenticated, public;
grant all on table public.platform_settings to service_role;
