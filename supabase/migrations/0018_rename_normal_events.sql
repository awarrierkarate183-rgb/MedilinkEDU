update public.catalog_events set name = 'Medical Triage' where id = 'triage-protocol';
update public.catalog_events set name = 'Chart Audit' where id = 'the-chart-room';
update public.catalog_events set name = 'Disease Pathway' where id = 'system-failure';
update public.catalog_events set name = 'Outbreak Investigation' where id = 'patient-zero';
update public.catalog_events set name = 'Research Review' where id = 'under-review';
update public.catalog_events set name = 'Medical Ethics' where id = 'the-gray-area';
update public.catalog_events set name = 'Health Policy Debate' where id = 'the-floor';
update public.catalog_events set name = 'Solution Design' where id = 'pitch-day';
update public.catalog_events set name = 'Healthcare Budgeting' where id = 'the-ledger';
update public.catalog_events set name = 'Market Analysis' where id = 'market-call';
update public.catalog_events set name = 'Deal Negotiation' where id = 'the-term-sheet';
update public.catalog_events set name = 'Resource Allocation' where id = 'scarcity';
update public.catalog_events set name = 'Clinic Operations' where id = 'operating-margin';
update public.catalog_events set name = 'Biotech Review' where id = 'the-pipeline';
update public.catalog_events set name = 'Insurance Appeals' where id = 'claim-denied';
update public.catalog_events set name = 'Hospital Recovery' where id = 'the-turnaround';
update public.catalog_events set name = 'Digital Health Review' where id = 'signal-vs-noise';
update public.catalog_events set name = 'Healthcare Startup' where id = 'seed-round';
update public.catalog_events set name = 'Global Health' where id = 'borders-and-budgets';
update public.catalog_events set name = 'Crisis Communications' where id = 'on-record';

create or replace function public.enforce_normal_event_rules()
returns trigger
language plpgsql
as $$
declare
  event_row public.catalog_events%rowtype;
  event_count integer;
  member_count integer;
begin
  select * into event_row from public.catalog_events where id = new.catalog_event_id;
  if event_row.tier <> 'NORMAL' then
    raise exception 'That event is not a Normal Event.';
  end if;
  if event_row.format = 'SOLO_ONLY' and new.team_id is not null then
    raise exception 'Chart Audit and Healthcare Budgeting are solo-only.';
  end if;
  if event_row.format = 'TEAM_ONLY' and new.team_id is null then
    raise exception 'That Normal Event requires a team of 2 to 5.';
  end if;
  if new.team_id is not null then
    select count(*) into member_count from public.normal_team_members where team_id = new.team_id;
    if member_count < event_row.min_team_size or member_count > event_row.max_team_size then
      raise exception 'That team does not match the event format.';
    end if;
  end if;
  select count(distinct catalog_event_id) into event_count
  from public.normal_event_registrations
  where season_id = new.season_id
    and profile_id = new.profile_id
    and catalog_event_id <> new.catalog_event_id;
  if event_count >= 6 then
    raise exception 'A student may register for at most six Normal Events in a season.';
  end if;
  return new;
end;
$$;

update public.event_guides
set
  title = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
            replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(title,
            'Triage Protocol', 'Medical Triage'),
            'The Chart Room', 'Chart Audit'),
            'System Failure', 'Disease Pathway'),
            'Patient Zero', 'Outbreak Investigation'),
            'Under Review', 'Research Review'),
            'The Gray Area', 'Medical Ethics'),
            'The Floor', 'Health Policy Debate'),
            'Pitch Day', 'Solution Design'),
            'The Ledger', 'Healthcare Budgeting'),
            'Market Call', 'Market Analysis'),
            'The Term Sheet', 'Deal Negotiation'),
            'Operating Margin', 'Clinic Operations'),
            'The Pipeline', 'Biotech Review'),
            'Claim Denied', 'Insurance Appeals'),
            'The Turnaround', 'Hospital Recovery'),
            'Signal vs. Noise', 'Digital Health Review'),
            'Seed Round', 'Healthcare Startup'),
            'Borders & Budgets', 'Global Health'),
            'On Record', 'Crisis Communications'),
            'Scarcity', 'Resource Allocation'),
  body = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
           replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(coalesce(body, ''),
           'Triage Protocol', 'Medical Triage'),
           'The Chart Room', 'Chart Audit'),
           'System Failure', 'Disease Pathway'),
           'Patient Zero', 'Outbreak Investigation'),
           'Under Review', 'Research Review'),
           'The Gray Area', 'Medical Ethics'),
           'The Floor', 'Health Policy Debate'),
           'Pitch Day', 'Solution Design'),
           'The Ledger', 'Healthcare Budgeting'),
           'Market Call', 'Market Analysis'),
           'The Term Sheet', 'Deal Negotiation'),
           'Operating Margin', 'Clinic Operations'),
           'The Pipeline', 'Biotech Review'),
           'Claim Denied', 'Insurance Appeals'),
           'The Turnaround', 'Hospital Recovery'),
           'Signal vs. Noise', 'Digital Health Review'),
           'Seed Round', 'Healthcare Startup'),
           'Borders & Budgets', 'Global Health'),
           'On Record', 'Crisis Communications'),
           'Scarcity', 'Resource Allocation')
where catalog_event_id in (
  'triage-protocol', 'the-chart-room', 'system-failure', 'patient-zero', 'under-review',
  'the-gray-area', 'the-floor', 'pitch-day', 'the-ledger', 'market-call', 'the-term-sheet',
  'scarcity', 'operating-margin', 'the-pipeline', 'claim-denied', 'the-turnaround',
  'signal-vs-noise', 'seed-round', 'borders-and-budgets', 'on-record'
);

update public.event_prep_items
set
  title = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
            replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(title,
            'Triage Protocol', 'Medical Triage'),
            'The Chart Room', 'Chart Audit'),
            'System Failure', 'Disease Pathway'),
            'Patient Zero', 'Outbreak Investigation'),
            'Under Review', 'Research Review'),
            'The Gray Area', 'Medical Ethics'),
            'The Floor', 'Health Policy Debate'),
            'Pitch Day', 'Solution Design'),
            'The Ledger', 'Healthcare Budgeting'),
            'Market Call', 'Market Analysis'),
            'The Term Sheet', 'Deal Negotiation'),
            'Operating Margin', 'Clinic Operations'),
            'The Pipeline', 'Biotech Review'),
            'Claim Denied', 'Insurance Appeals'),
            'The Turnaround', 'Hospital Recovery'),
            'Signal vs. Noise', 'Digital Health Review'),
            'Seed Round', 'Healthcare Startup'),
            'Borders & Budgets', 'Global Health'),
            'On Record', 'Crisis Communications'),
            'Scarcity', 'Resource Allocation'),
  body = replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(
           replace(replace(replace(replace(replace(replace(replace(replace(replace(replace(coalesce(body, ''),
           'Triage Protocol', 'Medical Triage'),
           'The Chart Room', 'Chart Audit'),
           'System Failure', 'Disease Pathway'),
           'Patient Zero', 'Outbreak Investigation'),
           'Under Review', 'Research Review'),
           'The Gray Area', 'Medical Ethics'),
           'The Floor', 'Health Policy Debate'),
           'Pitch Day', 'Solution Design'),
           'The Ledger', 'Healthcare Budgeting'),
           'Market Call', 'Market Analysis'),
           'The Term Sheet', 'Deal Negotiation'),
           'Operating Margin', 'Clinic Operations'),
           'The Pipeline', 'Biotech Review'),
           'Claim Denied', 'Insurance Appeals'),
           'The Turnaround', 'Hospital Recovery'),
           'Signal vs. Noise', 'Digital Health Review'),
           'Seed Round', 'Healthcare Startup'),
           'Borders & Budgets', 'Global Health'),
           'On Record', 'Crisis Communications'),
           'Scarcity', 'Resource Allocation')
where catalog_event_id in (
  'triage-protocol', 'the-chart-room', 'system-failure', 'patient-zero', 'under-review',
  'the-gray-area', 'the-floor', 'pitch-day', 'the-ledger', 'market-call', 'the-term-sheet',
  'scarcity', 'operating-margin', 'the-pipeline', 'claim-denied', 'the-turnaround',
  'signal-vs-noise', 'seed-round', 'borders-and-budgets', 'on-record'
);
