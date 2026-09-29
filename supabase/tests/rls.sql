-- RLS contract tests for a dedicated development Supabase project.
-- Run after 0001, 0002, and seed.dev.sql.
-- These statements document expected behavior. They are not a live CI suite
-- until a Supabase project exists.

-- Anonymous reads
-- profiles: deny
-- chapter_members: deny
-- invitations: deny
-- points_transactions: deny unless the tester is in-chapter (anon is not)
-- notifications: deny
-- audit_logs: deny
-- chapters: only public_visibility = true
-- competitions: non-draft
-- curriculum_tracks / modules: allow
-- news_posts: published only

-- Authenticated student
-- SELECT own profile: allow
-- SELECT another student's profile: deny
-- SELECT own chapter public fields: allow
-- UPDATE points_transactions: deny
-- INSERT points_transactions: deny
-- UPDATE chapter_members status to ACTIVE: deny
-- SELECT invitations: deny
-- SELECT another chapter's private members: deny

-- Authenticated advisor
-- SELECT members of managed chapter: allow
-- SELECT members of another chapter: deny
-- UPDATE pending members in managed chapter: allow
-- INSERT points_transactions for managed chapter: allow
-- INSERT points_transactions for another chapter: deny

-- Super admin
-- SELECT chapters: allow
-- UPDATE chapter status: allow (prefer the /api/admin/approve-chapter route)

-- Example probe when using the Supabase SQL editor as postgres (bypasses RLS).
-- To actually test RLS, use the Data API with anon and user JWTs, or:
--   set request.jwt.claim.sub = '<user uuid>';
--   set role authenticated;
-- then SELECT and confirm grants/denies.

select 'rls_contract_loaded' as status;
