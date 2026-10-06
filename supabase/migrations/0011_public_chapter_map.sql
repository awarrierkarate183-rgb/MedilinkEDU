-- Accepted chapters from Start a Chapter appear on the public chapter map.

update public.chapters
set public_visibility = true
where status in ('FOUNDING', 'ESTABLISHED', 'FLAGSHIP_ELIGIBLE');

update public.chapters
set public_visibility = false
where status in ('PENDING_APPROVAL', 'PROPOSED', 'INACTIVE');
