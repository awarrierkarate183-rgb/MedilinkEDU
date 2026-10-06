-- Replace the five-event two-group Legacy catalog with the Legacy Triad.

insert into public.catalog_events (id, name, tier, format, min_team_size, max_team_size, format_label, description, sort_order) values
  ('the-sovereign-ledger', 'The Sovereign Ledger', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Medicine x finance. One four-student chapter team. Five-act live championship.', 'Asterion Health Alliance allocates a $48 million capital envelope without treating essential care as optional.', 21),
  ('nightfall-code-meridian', 'Nightfall: Code Meridian', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Medicine x management. One four-student chapter team. Five-act live championship.', 'Meridian Regional holds a 320-bed hospital through an electronic-record outage and a storm.', 22),
  ('the-janus-protocol', 'The Janus Protocol', 'LEGACY', 'TEAM_ONLY', 4, 4, 'Medicine x technology. One four-student chapter team. Five-act live championship.', 'A hospital consortium decides whether JANUS, an AI routing platform, is an accountable clinical system.', 23)
on conflict (id) do update set
  name = excluded.name,
  tier = excluded.tier,
  format = excluded.format,
  min_team_size = excluded.min_team_size,
  max_team_size = excluded.max_team_size,
  format_label = excluded.format_label,
  description = excluded.description,
  sort_order = excluded.sort_order;

update public.legacy_event_entries set catalog_event_id = 'the-sovereign-ledger' where catalog_event_id in ('the-covenant-table', 'the-rural-lifeline-case');
update public.legacy_event_entries set catalog_event_id = 'nightfall-code-meridian' where catalog_event_id in ('nightfall-command', 'operation-containment');
update public.legacy_event_entries set catalog_event_id = 'the-janus-protocol' where catalog_event_id in ('the-atlas-docket', 'black-box-protocol', 'the-meridian-hearing', 'project-onconova');
delete from public.legacy_event_entries where catalog_event_id in ('the-last-mile-accord', 'the-valuecare-arbitration');

update public.event_results set catalog_event_id = 'the-sovereign-ledger' where catalog_event_id in ('the-covenant-table', 'the-rural-lifeline-case');
update public.event_results set catalog_event_id = 'nightfall-code-meridian' where catalog_event_id in ('nightfall-command', 'operation-containment');
update public.event_results set catalog_event_id = 'the-janus-protocol' where catalog_event_id in ('the-atlas-docket', 'black-box-protocol', 'the-meridian-hearing', 'project-onconova');
delete from public.event_results where catalog_event_id in ('the-last-mile-accord', 'the-valuecare-arbitration');

update public.event_guides set catalog_event_id = 'the-sovereign-ledger' where catalog_event_id in ('the-covenant-table', 'the-rural-lifeline-case');
update public.event_guides set catalog_event_id = 'nightfall-code-meridian' where catalog_event_id in ('nightfall-command', 'operation-containment');
update public.event_guides set catalog_event_id = 'the-janus-protocol' where catalog_event_id in ('the-atlas-docket', 'black-box-protocol', 'the-meridian-hearing', 'project-onconova');
delete from public.event_guides where catalog_event_id in ('the-last-mile-accord', 'the-valuecare-arbitration');

delete from public.catalog_events
where id in (
  'the-atlas-docket',
  'the-covenant-table',
  'black-box-protocol',
  'the-last-mile-accord',
  'nightfall-command',
  'the-meridian-hearing',
  'the-rural-lifeline-case',
  'project-onconova',
  'the-valuecare-arbitration',
  'operation-containment'
);

notify pgrst, 'reload schema';
