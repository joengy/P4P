-- Lets the app read its catalogue from these tables instead of the bundled
-- mock fixtures.
--
-- slug: the short id the app already routes and links by ('r1', 'd4', 'v1',
-- 'u1', 'ci1', 'c2'). The recommendation rules, saved items, deep links and
-- group-chat links all use these, so keeping them means no call site changes.
-- The uuid stays the primary key and the target of every foreign key.
--
-- The remaining columns hold fields the screens show that 0001 had no place
-- for. going_count / attendee_names / interested_* describe the demonstration
-- community, whose members are not accounts; once they are, derive these from
-- plan_rsvps and circle_interests instead.

alter table activities
  add column slug text unique,
  -- Home recommendations and Discover cards share this table but render
  -- different fields; this says which screen a row was written for.
  add column surface text not null default 'discover' check (surface in ('home', 'discover')),
  add column peer_safe int,
  add column peer_welcoming int,
  add column peer_useful int,
  add column feedback jsonb not null default '[]';

alter table vr_sessions add column slug text unique;

alter table plans
  add column slug text unique,
  add column host jsonb,
  add column going_count int not null default 0,
  add column attendee_names text[] not null default '{}',
  add column friend_names text[] not null default '{}';

alter table circle_ideas
  add column slug text unique,
  add column who jsonb,
  add column interested_count int not null default 0,
  add column interested_names text[] not null default '{}';

alter table conversations add column slug text unique;
