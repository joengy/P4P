-- Bridge between the phone app and the Unity VR hike (dsaw04/Hoa_XR_Hiking_Game).
--
-- One row = one hike. The app inserts it (which session, how hard, how long),
-- the headset claims it at launch, pre-fills its in-VR check-in from it, and
-- writes the outcome back when the session ends. That completed row is what
-- the You tab's history reads.
--
-- Device-scoped, not user-scoped: the app has no auth right now (removed
-- 2026-09-04), so a headset identifies itself with a short pairing code the
-- player types into the phone once. When auth returns, add a user_id column
-- and tighten the policies at the bottom of this file.

create table vr_device_sessions (
  id uuid primary key default gen_random_uuid(),
  device_code text not null,

  -- Plain text, deliberately not an FK to vr_sessions(id): the app is still on
  -- the mock catalogue where ids are 'v1'/'v2'/'v3', not uuids. Once the app
  -- reads the seeded vr_sessions table this column just holds the uuid string.
  vr_session_ref text,

  -- Denormalised so the headset panel and the app's history can both render a
  -- name without joining the catalogue. Bilingual {en, zh}, same shape as
  -- vr_sessions.title.
  title jsonb,

  -- Queued by the app. `mode` mirrors vr_sessions.felt_intensity and maps onto
  -- the game's MovementMode; `intensity` maps onto its MovementIntensity.
  mode text not null check (mode in ('gentle', 'steady', 'strong')),
  intensity text not null check (intensity in ('low', 'medium', 'high')),
  minutes int not null check (minutes > 0),
  created_at timestamptz not null default now(),

  -- Filled in by the game.
  started_at timestamptz,
  ended_at timestamptz,
  actual_minutes int,
  kcal int
);

-- The two queries that actually run: the headset asking "anything queued for
-- me?" and the app asking "what has this headset finished?".
create index vr_device_sessions_pending_idx
  on vr_device_sessions (device_code, created_at desc)
  where started_at is null;

create index vr_device_sessions_done_idx
  on vr_device_sessions (device_code, ended_at desc)
  where ended_at is not null;

alter table vr_device_sessions enable row level security;

-- ponytail: anon can read and write any row, scoped only by a guessable 6-char
-- device code — a headset could claim another headset's queued hike. Acceptable
-- for a supervised study with a handful of devices and no personal data in the
-- table; replace with auth.uid()-scoped policies when the auth layer returns.
create policy "anon reads device sessions"
  on vr_device_sessions for select to anon, authenticated using (true);

create policy "anon queues device sessions"
  on vr_device_sessions for insert to anon, authenticated with check (true);

create policy "anon updates device sessions"
  on vr_device_sessions for update to anon, authenticated using (true) with check (true);
