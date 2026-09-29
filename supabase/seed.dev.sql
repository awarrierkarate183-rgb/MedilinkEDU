-- DEVELOPMENT SEED ONLY.
-- Do not run this against production.
-- It does not create login passwords. Create users in the Supabase Auth dashboard,
-- then attach profiles by id.

insert into public.apex_cycles (label, start_date, end_date, is_current)
values ('2026-2028', '2026-07-01', '2028-06-30', true)
on conflict (label) do nothing;

insert into public.curriculum_tracks (number, name, summary) values
  (1, 'Foundations of Health Economics', 'How care is paid for, why it costs what it costs, and who is left out.'),
  (2, 'Health Technology and Systems', 'Records, data, devices. No coding background required.'),
  (3, 'Financial Modeling for Health Ventures', 'Budgets, funding paths, and why ROI looks different in health.'),
  (4, 'Applied Capstone and Competition Prep', 'The yearly capstone becomes that year''s Nationals case.')
on conflict (number) do nothing;

insert into public.competitions (slug, name, kind, status, team_event, min_team_size, max_team_size, config)
values
  ('innovation', 'Innovation Challenge', 'one-time', 'UPCOMING', true, 1, 3, '{"datesHardcoded": false}'::jsonb),
  ('policy', 'Policy Cup', 'one-time', 'UPCOMING', true, 1, 2, '{"datesHardcoded": false}'::jsonb),
  ('research', 'Research Symposium', 'one-time', 'UPCOMING', false, 1, 1, '{"datesHardcoded": false}'::jsonb),
  ('nationals', 'MediLink Nationals', 'ladder', 'UPCOMING', true, 3, 4, '{"ladder": ["regional", "state", "national"]}'::jsonb),
  ('apex', 'MediLink Apex', 'biennial', 'UPCOMING', true, 3, 4, '{"datesHardcoded": false}'::jsonb)
on conflict (slug) do nothing;
