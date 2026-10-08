alter table public.chapter_applications
  drop constraint if exists chapter_applications_request_type_check;

alter table public.chapter_applications
  add constraint chapter_applications_request_type_check
  check (request_type in ('START', 'REACTIVATE', 'PORTAL_CLAIM'));
