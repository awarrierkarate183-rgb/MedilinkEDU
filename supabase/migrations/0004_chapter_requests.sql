-- Chapter applications stay pending until an administrator accepts them.

alter table public.chapter_applications
  add column if not exists review_status text not null default 'PENDING',
  add column if not exists last_sign_in_attempt_at timestamptz,
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references public.profiles(id),
  add column if not exists review_note text not null default '';

alter table public.chapter_applications
  drop constraint if exists chapter_applications_review_status_check;

alter table public.chapter_applications
  add constraint chapter_applications_review_status_check
  check (review_status in ('PENDING', 'APPROVED', 'DENIED'));

create index if not exists idx_chapter_applications_review
  on public.chapter_applications (review_status, created_at desc);
