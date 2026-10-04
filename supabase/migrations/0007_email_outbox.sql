-- Queue student invite emails so a rate-limited mailer can retry them.

create table if not exists public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  to_email text not null,
  first_name text,
  last_name text,
  invite_url text not null,
  expires_at timestamptz,
  status text not null default 'PENDING',
  attempts integer not null default 0,
  last_error text,
  created_at timestamptz not null default now(),
  sent_at timestamptz
);

alter table public.email_outbox enable row level security;

revoke all on table public.email_outbox from anon, authenticated, public;
grant all on table public.email_outbox to service_role;
