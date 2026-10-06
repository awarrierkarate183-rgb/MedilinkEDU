alter table public.announcements
  add column if not exists scope text not null default 'CHAPTER';

alter table public.announcements
  drop constraint if exists announcements_scope_check;

alter table public.announcements
  add constraint announcements_scope_check
  check (scope in ('CHAPTER', 'ORGANIZATION'));

update public.announcements
set
  scope = 'ORGANIZATION',
  expires_at = null,
  expire_at = null
where chapter_id is null
  and (
    upper(coalesce(audience, '')) in ('ALL', 'ORGANIZATION')
    or upper(coalesce(audience_type, '')) in ('ALL', 'ORGANIZATION')
  );

drop policy if exists "announcements_write_managers" on public.announcements;
create policy "announcements_write_managers" on public.announcements
  for all using (
    public.manages_chapter(chapter_id)
    or (
      chapter_id is null
      and public.current_role() in ('SUPER_ADMIN', 'STATE_ADMIN')
    )
  )
  with check (
    public.manages_chapter(chapter_id)
    or (
      chapter_id is null
      and public.current_role() in ('SUPER_ADMIN', 'STATE_ADMIN')
    )
  );

drop policy if exists "announcements_select" on public.announcements;
create policy "announcements_select" on public.announcements
  for select using (
    (
      status in ('published', 'PUBLISHED')
      or publish_at is not null
      or published_at is not null
    )
    and (
      (scope = 'ORGANIZATION' and auth.uid() is not null)
      or audience in ('ALL', 'all')
      or audience_type in ('all', 'ALL')
      or (audience_type in ('students', 'STUDENTS') and public.current_role() in ('STUDENT', 'CHAPTER_OFFICER'))
      or (audience_type in ('advisors', 'ADVISORS') and public.is_staff())
      or public.in_chapter(chapter_id)
      or public.manages_chapter(chapter_id)
      or public.is_super_admin()
    )
  );
