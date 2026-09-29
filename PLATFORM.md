# MediLink platform notes

## Architecture

One Next.js App Router application.

- Public routes: `(public)`
- Portal: `/portal`, `/portal/login`, `/portal/advisor`, `/portal/student`, `/portal/admin`
- Chapter join: `/join/[code]`
- Auth: Supabase Auth + Postgres + RLS
- Service role: server only

## Roles

SUPER_ADMIN, STATE_ADMIN, CHAPTER_ADVISOR, STUDENT. CHAPTER_OFFICER exists in the schema and is not a day-one login destination.

## Invitations

Advisor-generated codes are hashed (SHA-256), expiring, revocable, and chapter-scoped. The chapter QR encodes only `/join/[join_code]`.

## Content rules

Do not invent dates, school names, sponsors, statistics, or founder biography. Empty states are intentional.

## Temporary public headline

The homepage line "Healthcare is bigger than one discipline." is page copy, not a locked slogan.
