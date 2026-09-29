-- DEVELOPMENT SEED ONLY. Do not run this against production.
-- It does not create Auth users or passwords.
-- Create users in the Supabase Auth dashboard, then attach profiles by id.

insert into public.apex_cycles (label, name, start_date, end_date, is_current, status)
values ('2026-2028', '2026-2028', '2026-07-01', '2028-06-30', true, 'active')
on conflict (label) do nothing;

insert into public.curriculum_tracks (number, name, summary) values
  (1, 'Foundations of Health Economics', 'How care is paid for, why it costs what it costs, and who is left out.'),
  (2, 'Health Technology and Systems', 'Records, data, devices. No coding background required.'),
  (3, 'Financial Modeling for Health Ventures', 'Budgets, funding paths, and why ROI looks different in health.'),
  (4, 'Applied Capstone and Competition Prep', 'The yearly capstone becomes that year''s Nationals case.')
on conflict (number) do nothing;

insert into public.competitions (slug, name, kind, description, status, team_event, min_team_size, max_team_size, annual, apex_related, active, config)
values
  ('innovation', 'Innovation Challenge', 'one-time', 'Single annual pitch event.', 'UPCOMING', true, 1, 3, true, true, true, '{"datesHardcoded": false}'::jsonb),
  ('policy', 'Policy Cup', 'one-time', 'Single annual policy brief event.', 'UPCOMING', true, 1, 2, true, true, true, '{"datesHardcoded": false}'::jsonb),
  ('research', 'Research Symposium', 'one-time', 'Single annual research event.', 'UPCOMING', false, 1, 1, true, true, true, '{"datesHardcoded": false}'::jsonb),
  ('nationals', 'MediLink Nationals', 'ladder', 'The only Regional to State to National ladder.', 'UPCOMING', true, 3, 4, true, true, true, '{"ladder": ["regional", "state", "national"]}'::jsonb),
  ('apex', 'MediLink Apex', 'biennial', 'Biennial culmination drawn from the other four competitions.', 'UPCOMING', true, 3, 4, false, true, true, '{"datesHardcoded": false}'::jsonb)
on conflict (slug) do nothing;

insert into public.competition_stages (competition_id, name, sequence, description, active)
select c.id, stage.name, stage.seq, stage.about, true
from public.competitions c
join (values
  ('nationals', 'Regional', 1, 'Regional round'),
  ('nationals', 'State', 2, 'State round'),
  ('nationals', 'National', 3, 'National round')
) as stage(slug, name, seq, about) on stage.slug = c.slug
on conflict (competition_id, sequence) do nothing;

insert into public.curriculum_modules (track_id, code, name, title, short_description, description, number, sort_order, public_preview, active)
select t.id, m.code, m.title, m.title, m.about, m.about, m.num, m.num, true, true
from public.curriculum_tracks t
join (values
  (1, '1.1', 'How Healthcare Gets Paid For', 'Insurance basics, premiums, deductibles, and employer vs. government coverage.', 1),
  (1, '1.2', 'The Cost of Care', 'Why healthcare is expensive: administrative costs, drug pricing, and hospital billing.', 2),
  (1, '1.3', 'Access and Disparities', 'Rural care deserts, uninsured populations, and global health gaps.', 3),
  (2, '2.1', 'Digital Health 101', 'Electronic health records, telehealth, and patient portals.', 1),
  (2, '2.2', 'Data and AI in Medicine', 'Diagnostics, imaging, and predictive tools, explained conceptually.', 2),
  (2, '2.3', 'Medical Devices and Wearables', 'How monitoring technology is changing care delivery.', 3),
  (3, '3.1', 'Reading a Budget', 'Revenue, expenses, and break-even basics.', 1),
  (3, '3.2', 'Funding a Health Idea', 'Grants, investors, and nonprofit vs. for-profit funding paths.', 2),
  (3, '3.3', 'Measuring Impact and ROI', 'Why return on investment is measured differently in health.', 3),
  (4, '4.1', 'Applying the Framework', 'One case run through the three-lens framework.', 1),
  (4, '4.2', 'Case Analysis Practice', 'Guided practice on past-style cases.', 2),
  (4, '4.3', 'Competition-Specific Prep', 'Pitch, brief, poster, and case-team formats are not interchangeable.', 3)
) as m(track_number, code, title, about, num) on m.track_number = t.number
on conflict (code) do nothing;

insert into public.chapters (
  chapter_code, join_code, slug, name, school, city, state, country, status,
  public_visibility, description, chapter_description
) values (
  'DEV-001',
  'DEVCH01',
  'dev-sandbox',
  'MediLink Development Chapter',
  'Development Sandbox School',
  'Charlotte',
  'NC',
  'United States',
  'FOUNDING',
  false,
  'DEVELOPMENT SEED ONLY. Not a real chapter and not for production.',
  'DEVELOPMENT SEED ONLY. Not a real chapter and not for production.'
)
on conflict (chapter_code) do nothing;

insert into public.events (title, description, type, event_type, status, chapter_id, start_at, location, registration_required)
select
  'Development chapter meeting',
  'DEVELOPMENT SEED ONLY.',
  'chapter',
  'chapter',
  'PUBLISHED',
  id,
  now() + interval '14 days',
  'Development sandbox',
  false
from public.chapters
where chapter_code = 'DEV-001'
  and not exists (
    select 1 from public.events e
    where e.chapter_id = chapters.id and e.title = 'Development chapter meeting'
  );

insert into public.points_transactions (chapter_id, amount, reason, reason_code, event_date)
select id, 10, 'one time participation', 'one_time_participation', current_date
from public.chapters
where chapter_code = 'DEV-001'
  and not exists (
    select 1 from public.points_transactions p
    where p.chapter_id = chapters.id and p.reason_code = 'one_time_participation'
  );

-- Auth users are not created here. After creating development Auth users:
-- 1 advisor, 5 students, attach profiles.role and chapter_members to DEV-001.
-- Never copy those passwords into git.
