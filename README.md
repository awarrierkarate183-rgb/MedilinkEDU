# MediLink digital platform

Public website, advisor portal, student portal, and admin tools in one Next.js application.

The public site runs without backend credentials. The portal signs in through Supabase. There is no fake login and no invented chapter roster.

## Local preview

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Connect the portal

Follow `BACKEND.md`. Short version:

1. Copy `.env.example` to `.env.local`.
2. Create a dedicated MediLink Supabase project. Credentials have not been added in this repository.
3. Run `supabase/migrations/0001_init.sql`, then `0002_platform_complete.sql`.
4. Run `supabase/seed.dev.sql` only on a development project.
5. Add `NEXT_PUBLIC_SUPABASE_URL` and a publishable/anon key.
6. Add `SUPABASE_SECRET_KEY` (or `SUPABASE_SERVICE_ROLE_KEY`) on the server only. Never prefix it with `NEXT_PUBLIC_`.
7. Create the first SUPER_ADMIN user in the Supabase Auth dashboard, then set the matching `public.profiles.role`.

Do not run the development seed against production.

Migrations in git are not the same as migrations applied. Until the SQL is executed in a live project, authentication cannot be tested.

## What editors still change as data

- `data/chapters.json` public chapter listings
- `data/apex-points.json` Road to Apex ledger
- `data/sponsor-tiers.json` approved corporate tiers
- `data/forms.json` Google Form URLs

School names in `chapters.json` stay empty until the board records them.

## Archived static site

The previous HTML site is in `_archive/` for reference. Do not deploy it.
