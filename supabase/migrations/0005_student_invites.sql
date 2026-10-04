-- Student invitations store the roster details the advisor entered.
-- The student later creates their own password from the emailed link.

alter table public.invitations
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists grade text,
  add column if not exists invited_user_id uuid references auth.users(id) on delete set null;
