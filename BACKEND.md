# MediLink backend

This is the authenticated platform layer on top of the public Next.js website.

The public site still renders from static content when Supabase is offline. The portal does not fake a login.

## What exists in this repository

- Next.js App Router on Vercel (`vercel.json` sets `framework: nextjs`)
- Supabase Auth, Postgres, Storage, and the Data API
- Versioned SQL: `supabase/migrations/0001_init.sql`, `supabase/migrations/0002_platform_complete.sql`
- Development seed: `supabase/seed.dev.sql` (marked development, do not run in production)
- Browser, server, and admin clients in `lib/supabase/`
- Privileged API routes under `app/api/`
- RLS policies in the migrations
- Unit tests in `tests/`
- RLS contract notes in `supabase/tests/rls.sql`

## What is not complete until a human does it

Supabase credentials have **not** been supplied to this workspace.

Therefore:

- No live Supabase project has been created by this implementation
- Migrations have **not** been executed against a database
- Authentication cannot be live-tested
- Vercel environment variables have **not** been configured here
- Transactional email is **pending** (password reset uses Supabase Auth email once a project exists; invitations are not emailed yet)
- Storage signed URLs cannot be live-tested
- RLS tests against a running database cannot be executed here

Do not treat the Git repository as a database backup.

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Where it runs | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Browser and server | Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Browser and server | RLS-scoped key |
| `SUPABASE_SECRET_KEY` or `SUPABASE_SERVICE_ROLE_KEY` | Server only | Invitation redeem and other trusted writes |
| `NEXT_PUBLIC_SITE_URL` | Browser and server | Join URLs, QR codes, password reset redirect |
| `MEDILINK_ALLOW_DEV_SEED` | Local only | Must stay `false` in production |

Never put the secret key in a `NEXT_PUBLIC_` variable. Never commit `.env.local`.

## Manual Supabase steps

1. Create a dedicated project named **MediLink Production** (and a separate development project if possible).
2. In Authentication, enable Email. Leave extra OAuth providers off for now.
3. Add redirect URLs for local, Vercel preview, and production:
   - `http://localhost:3000/portal/login`
   - `https://<preview>.vercel.app/portal/login`
   - `https://medilink-edu.vercel.app/portal/login`
4. Set the Supabase Site URL to the matching origin. Do not leave production pointed at localhost.
5. Run `0001_init.sql`, then `0002_platform_complete.sql`, in the SQL editor (or `supabase db push` if the CLI is linked).
6. On a development project only, run `seed.dev.sql`.
7. Create the first `SUPER_ADMIN` in Authentication, then set `public.profiles.role` to `SUPER_ADMIN` with the SQL editor. Users cannot assign that role to themselves.
8. Confirm backup/PITR settings in the Supabase dashboard before launch.

## Vercel

1. Keep the existing `medilink-edu.vercel.app` project.
2. Set Development, Preview, and Production env vars separately.
3. Use the production Supabase project only for Production.
4. Redeploy after changing env vars. They do not apply to an already-built deployment.

## Roles

Stored as `SUPER_ADMIN`, `STATE_ADMIN`, `CHAPTER_ADVISOR`, `STUDENT`, `CHAPTER_OFFICER`.

`CHAPTER_OFFICER` is a membership/office relationship, not a self-serve role. Portal routing still verifies the database role. URLs are not permissions.

## Privileged APIs

These routes authenticate the session, then derive chapter and role from `profiles` / membership. They do not trust `user_id`, `role`, or `chapter_id` from the client as authorization.

| Route | Purpose |
| --- | --- |
| `POST /api/invitations/create` | Advisor creates a hashed invitation |
| `POST /api/invitations/redeem` | Create account, attach membership, consume token |
| `POST /api/members/approve` | Approve a pending member in the actor's chapter |
| `POST /api/chapters/join-request` | Logged-in user requests a public chapter |
| `POST /api/events/register` | Register the current user for an event |
| `POST /api/announcements/create` | Advisor publishes to their chapter |
| `POST /api/admin/award-points` | Record a ledger row; amount comes from the reason code |
| `POST /api/admin/approve-chapter` | Admin updates chapter status in scope |
| `POST /api/admin/publish-results` | Super admin publishes a result |
| `GET /api/health` | Configuration flags only, no secrets |

Response shape:

```json
{ "data": {}, "error": null }
```

or

```json
{ "data": null, "error": { "code": "FORBIDDEN", "message": "..." } }
```

Ordinary reads use the Supabase Data API under RLS. There is not a custom REST handler for every table.

## Storage

Private buckets: `student-submissions`, `project-files`, `advisor-resources`.

Public bucket: `chapter-assets` for genuine public images only.

Private student files must be read through authorized paths, not a public URL.

## Email

`lib/email/index.ts` is the provider abstraction. No vendor is selected yet. Status: pending.

## Public content still in JSON

Until editors need database workflows, these remain files:

- `data/chapters.json`
- `data/apex-points.json`
- `data/sponsor-tiers.json`
- `data/forms.json`

## Tests

```bash
npm test
```

Unit tests cover tokens, role routing, point amounts, API envelopes, and env aliases.

Live RLS probes require a Supabase project and are listed in `supabase/tests/rls.sql`.

## Production checklist

- [ ] Supabase project connected
- [ ] Database migrations created (in git)
- [ ] Database migrations executed
- [ ] Authentication working
- [ ] Student accounts working
- [ ] Advisor accounts working
- [ ] Role system working
- [ ] Chapter relationships working
- [ ] Invitations working
- [ ] QR onboarding working
- [ ] Events working
- [ ] Competition registration working
- [ ] Teams working
- [ ] Curriculum working
- [ ] Ideas working
- [ ] Projects working
- [ ] Announcements working
- [ ] News workflow working
- [ ] Resources working
- [ ] Points working
- [ ] Apex cycle working
- [ ] Storage permissions working
- [ ] RLS enabled (in migrations)
- [ ] RLS tested against a live project
- [ ] Server secrets protected
- [ ] Vercel variables configured
- [ ] Production build successful
- [ ] Mobile tested with a live portal session
- [ ] Desktop tested with a live portal session
