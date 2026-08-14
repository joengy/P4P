-- Hoa — Phase 3 initial schema.
-- Bilingual copy is stored as jsonb {en, zh} matching the app's Bilingual
-- type (lib/L.ts) so client code can keep using the same L(node, lang)
-- resolver against Supabase rows as it does against data/mock/*.ts.
--
-- Table-count deviations from the original plan doc, noted for the record:
--   - `activity_saves` was folded into the generic `saved_items` table —
--     the app's useSavedStore already treats activity/vr saves through one
--     id space via resolveSaved(), so a second per-activity table would be
--     a duplicate concept.
--   - `vr_completions` was generalized into `movement_sessions`, which
--     covers every entry in the You tab's rhythm history (vr/outdoor/home/
--     social), not just VR — the mock HISTORY array already mixes all four
--     types in one feed, so the real table should too.

create extension if not exists "pgcrypto";

-- ── profiles ──────────────────────────────────────────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Hoa member',
  avatar_url text,
  bio text,
  is_guide boolean not null default false,
  lang text not null default 'en' check (lang in ('en', 'zh')),
  created_at timestamptz not null default now()
);

-- ── check-ins (Home tab) ─────────────────────────────────────
create table check_ins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  body text not null check (body in ('ok', 'sore', 'energised')),
  place text not null check (place in ('home', 'indoorNearby', 'outside')),
  mood text not null check (mood in ('reset', 'neutral', 'motivated')),
  social text not null check (social in ('alone', 'with', 'group')),
  created_at timestamptz not null default now()
);
create index check_ins_user_id_created_at_idx on check_ins (user_id, created_at desc);

-- ── conversations (created before activities/plans, which reference it) ──
create table conversations (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('coach', 'group', 'friend', 'family')),
  name jsonb,
  pinned_by_user_id uuid references profiles(id) on delete set null,
  pinned_text jsonb,
  created_at timestamptz not null default now()
);

create table conversation_members (
  conversation_id uuid not null references conversations(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (conversation_id, user_id)
);

create table messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_id uuid not null references profiles(id) on delete cascade,
  text jsonb,
  orig_lang text check (orig_lang in ('en', 'zh')),
  sticker jsonb,
  created_at timestamptz not null default now(),
  constraint messages_text_or_sticker check (text is not null or sticker is not null)
);
create index messages_conversation_id_created_at_idx on messages (conversation_id, created_at);

-- ── activities (merges Home recs + Discover catalogue) ───────
create table activities (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('group', 'home', 'vr', 'library', 'outdoor')),
  tags text[] not null default '{}',
  headline jsonb not null,
  subline jsonb,
  why jsonb,
  photo_kind text not null default 'park',
  photo_url text,
  org_name jsonb,
  org_initials text,
  org_verified boolean not null default false,
  org_tone text,
  guide_name text,
  guide_bilingual boolean not null default false,
  guide_idx int,
  guide_bio jsonb,
  trust text[] not null default '{}',
  comfort text[] not null default '{}',
  badges text[] not null default '{}',
  cta text not null check (cta in ('rsvp', 'start', 'startVR', 'addPlan', 'saveRoute', 'askFirst', 'join')),
  rating numeric(2, 1),
  reviews_count int not null default 0,
  attended_count int not null default 0,
  group_chat_id uuid references conversations(id) on delete set null,
  detail_time text,
  detail_location text,
  detail_cost text,
  detail_language text,
  detail_intensity text,
  detail_bring text,
  dur jsonb,
  when_text jsonb,
  distance_text jsonb,
  min_duration int,
  access text[] not null default '{}',
  testimonial_text jsonb,
  testimonial_by jsonb,
  created_at timestamptz not null default now()
);

create table activity_comments (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid not null references activities(id) on delete cascade,
  user_id uuid references profiles(id) on delete set null,
  display_name text not null,
  avatar_idx int not null default 0,
  body jsonb not null,
  created_at timestamptz not null default now()
);
create index activity_comments_activity_id_idx on activity_comments (activity_id, created_at desc);

-- ── VR sessions ───────────────────────────────────────────────
create table vr_sessions (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  sub jsonb,
  min int not null,
  tone text not null check (tone in ('calm', 'accent', 'lav')),
  goal jsonb,
  env text not null default 'forest',
  felt_intensity text not null check (felt_intensity in ('gentle', 'steady', 'strong')),
  beginner_safe boolean not null default true,
  can_stop boolean not null default true,
  space jsonb,
  movement jsonb,
  energy_kcal int not null default 0,
  tried_by int not null default 0,
  feedback jsonb not null default '[]',
  guide_name text,
  guide_bilingual boolean not null default false,
  guide_beginner boolean not null default true,
  guide_idx int,
  guide_bio jsonb,
  real_world_activity_id uuid references activities(id) on delete set null,
  real_world_when jsonb,
  created_at timestamptz not null default now()
);

-- ── movement history (You tab rhythm — vr/outdoor/home/social) ──
create table movement_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  activity_id uuid references activities(id) on delete set null,
  vr_session_id uuid references vr_sessions(id) on delete set null,
  type text not null check (type in ('vr', 'outdoor', 'home', 'social')),
  title jsonb not null,
  min int not null,
  kcal int not null default 0,
  intensity text not null check (intensity in ('gentle', 'steady', 'strong')),
  mood jsonb,
  location jsonb,
  led_by jsonb,
  led_by_idx int,
  with_who text[] not null default '{}',
  notes jsonb,
  occurred_at timestamptz not null default now()
);
create index movement_sessions_user_id_occurred_at_idx on movement_sessions (user_id, occurred_at desc);

-- ── Plan tab: facilitated plans + RSVPs ──────────────────────
create table plans (
  id uuid primary key default gen_random_uuid(),
  title jsonb not null,
  day jsonb,
  date text,
  time jsonb,
  where_text jsonb,
  type text not null check (type in ('outdoor', 'social', 'vr')),
  facilitator_name text,
  facilitator_idx int,
  facilitator_bilingual boolean not null default false,
  facilitator_role jsonb,
  language jsonb,
  welcome jsonb,
  norms text[] not null default '{}',
  group_chat_id uuid references conversations(id) on delete set null,
  created_at timestamptz not null default now()
);

create table plan_rsvps (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null check (status in ('going', 'maybe', 'saved')),
  created_at timestamptz not null default now(),
  unique (plan_id, user_id)
);

-- ── Plan tab: circle ideas (decide-together) ─────────────────
create table circle_ideas (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid references profiles(id) on delete set null,
  who_name text not null,
  who_idx int not null default 0,
  relation jsonb,
  source jsonb,
  title jsonb not null,
  body jsonb,
  tag jsonb,
  tag_tone text,
  pref_lang jsonb,
  pref_size jsonb,
  pref_pace jsonb,
  created_at timestamptz not null default now()
);

create table circle_interests (
  id uuid primary key default gen_random_uuid(),
  circle_idea_id uuid not null references circle_ideas(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (circle_idea_id, user_id)
);

-- ── friend graph (ShareSheet people picker, circle relation labels) ──
create table friendships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  friend_id uuid not null references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, friend_id),
  check (user_id <> friend_id)
);

-- ── saved items (generic — replaces the single-array saved store) ──
create table saved_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  item_type text not null check (item_type in ('activity', 'vr_session')),
  item_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, item_type, item_id)
);

-- ════════════════════ RLS ════════════════════

alter table profiles enable row level security;
alter table check_ins enable row level security;
alter table conversations enable row level security;
alter table conversation_members enable row level security;
alter table messages enable row level security;
alter table activities enable row level security;
alter table activity_comments enable row level security;
alter table vr_sessions enable row level security;
alter table movement_sessions enable row level security;
alter table plans enable row level security;
alter table plan_rsvps enable row level security;
alter table circle_ideas enable row level security;
alter table circle_interests enable row level security;
alter table friendships enable row level security;
alter table saved_items enable row level security;

-- profiles: public read (names/avatars appear throughout shared content), self write
create policy "profiles are publicly readable" on profiles for select using (true);
create policy "users insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "users update their own profile" on profiles for update using (auth.uid() = id);

-- check_ins: private to the user
create policy "users manage their own check-ins" on check_ins for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- activities / vr_sessions: public read-only content, writes reserved for service role
create policy "activities are publicly readable" on activities for select using (true);
create policy "vr sessions are publicly readable" on vr_sessions for select using (true);

-- activity_comments: public read, authenticated users write their own
create policy "activity comments are publicly readable" on activity_comments for select using (true);
create policy "users insert their own activity comments" on activity_comments for insert
  with check (auth.uid() = user_id);

-- movement_sessions: private to the user
create policy "users manage their own movement sessions" on movement_sessions for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- plans: public read-only content, writes reserved for service role (facilitators, later)
create policy "plans are publicly readable" on plans for select using (true);

-- plan_rsvps: readable by anyone (drives "who's going"), users write their own
create policy "plan rsvps are publicly readable" on plan_rsvps for select using (true);
create policy "users manage their own plan rsvps" on plan_rsvps for insert with check (auth.uid() = user_id);
create policy "users update their own plan rsvps" on plan_rsvps for update using (auth.uid() = user_id);
create policy "users delete their own plan rsvps" on plan_rsvps for delete using (auth.uid() = user_id);

-- circle_ideas: public read, authenticated users author their own
create policy "circle ideas are publicly readable" on circle_ideas for select using (true);
create policy "users insert their own circle ideas" on circle_ideas for insert
  with check (auth.uid() = author_user_id);

-- circle_interests: public read (drives interest counts), users write their own
create policy "circle interests are publicly readable" on circle_interests for select using (true);
create policy "users manage their own circle interests" on circle_interests for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- friendships: visible only to the two people in the relationship
create policy "users read their own friendships" on friendships for select
  using (auth.uid() = user_id or auth.uid() = friend_id);
create policy "users insert their own friendships" on friendships for insert
  with check (auth.uid() = user_id);

-- saved_items: private to the user
create policy "users manage their own saved items" on saved_items for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- conversations / members: visible only to members
create policy "members read their conversations" on conversations for select
  using (exists (
    select 1 from conversation_members cm
    where cm.conversation_id = conversations.id and cm.user_id = auth.uid()
  ));
create policy "members read conversation membership" on conversation_members for select
  using (exists (
    select 1 from conversation_members cm
    where cm.conversation_id = conversation_members.conversation_id and cm.user_id = auth.uid()
  ));

-- messages: visible/writable only by conversation members
create policy "members read messages" on messages for select
  using (exists (
    select 1 from conversation_members cm
    where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
  ));
create policy "members send messages" on messages for insert
  with check (
    auth.uid() = sender_id
    and exists (
      select 1 from conversation_members cm
      where cm.conversation_id = messages.conversation_id and cm.user_id = auth.uid()
    )
  );
