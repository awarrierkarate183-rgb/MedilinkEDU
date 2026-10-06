-- Replace the draft Legacy catalog with the final championship events.

insert into public.catalog_events (id, name, tier, format, min_team_size, max_team_size, format_label, description, sort_order) values
  ('the-atlas-docket', 'The Atlas Docket', 'LEGACY', 'TEAM_ONLY', 2, 4, 'Mock appellate regulatory hearing. One group of 2 to 4.', 'Hospital AI governance counsel argues whether Atlas may remain in use, under what conditions, and with what safeguards.', 21),
  ('the-covenant-table', 'The Covenant Table', 'LEGACY', 'TEAM_ONLY', 2, 4, 'Five-year capital-allocation summit. One group of 2 to 4.', 'A capital allocation council decides what a health system funds, defers, or closes over five years, then rebalances after a credit shock.', 22),
  ('black-box-protocol', 'Black Box Protocol', 'LEGACY', 'TEAM_ONLY', 2, 4, 'Clinical technology deployment simulation. One group of 2 to 4.', 'An independent review board decides whether a high-stakes clinical tool may deploy, then faces a Kill Switch incident.', 23),
  ('the-last-mile-accord', 'The Last Mile Accord', 'LEGACY', 'TEAM_ONLY', 2, 4, 'Value-based payment negotiation and arbitration. One group of 2 to 4.', 'Teams negotiate and arbitrate a durable chronic-care payment accord after a live contract shock.', 24),
  ('nightfall-command', 'Nightfall Command', 'LEGACY', 'TEAM_ONLY', 2, 4, 'Four-round hospital crisis command. One group of 2 to 4.', 'An incident-command executive team keeps a hospital safe through stabilize, escalate, scrutiny, and recover rounds.', 25)
on conflict (id) do update set
  name = excluded.name,
  tier = excluded.tier,
  format = excluded.format,
  min_team_size = excluded.min_team_size,
  max_team_size = excluded.max_team_size,
  format_label = excluded.format_label,
  description = excluded.description,
  sort_order = excluded.sort_order;

update public.legacy_event_entries set catalog_event_id = 'the-atlas-docket' where catalog_event_id = 'the-meridian-hearing';
update public.legacy_event_entries set catalog_event_id = 'the-covenant-table' where catalog_event_id = 'the-rural-lifeline-case';
update public.legacy_event_entries set catalog_event_id = 'black-box-protocol' where catalog_event_id = 'project-onconova';
update public.legacy_event_entries set catalog_event_id = 'the-last-mile-accord' where catalog_event_id = 'the-valuecare-arbitration';
update public.legacy_event_entries set catalog_event_id = 'nightfall-command' where catalog_event_id = 'operation-containment';

update public.event_results set catalog_event_id = 'the-atlas-docket' where catalog_event_id = 'the-meridian-hearing';
update public.event_results set catalog_event_id = 'the-covenant-table' where catalog_event_id = 'the-rural-lifeline-case';
update public.event_results set catalog_event_id = 'black-box-protocol' where catalog_event_id = 'project-onconova';
update public.event_results set catalog_event_id = 'the-last-mile-accord' where catalog_event_id = 'the-valuecare-arbitration';
update public.event_results set catalog_event_id = 'nightfall-command' where catalog_event_id = 'operation-containment';

update public.event_guides set catalog_event_id = 'the-atlas-docket' where catalog_event_id = 'the-meridian-hearing';
update public.event_guides set catalog_event_id = 'the-covenant-table' where catalog_event_id = 'the-rural-lifeline-case';
update public.event_guides set catalog_event_id = 'black-box-protocol' where catalog_event_id = 'project-onconova';
update public.event_guides set catalog_event_id = 'the-last-mile-accord' where catalog_event_id = 'the-valuecare-arbitration';
update public.event_guides set catalog_event_id = 'nightfall-command' where catalog_event_id = 'operation-containment';

delete from public.catalog_events
where id in (
  'the-meridian-hearing',
  'the-rural-lifeline-case',
  'project-onconova',
  'the-valuecare-arbitration',
  'operation-containment'
);

notify pgrst, 'reload schema';
