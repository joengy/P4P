import { supabase } from '@/lib/supabase';
import type { Bilingual } from '@/lib/L';
import type {
  HomeRec,
  DiscoverItem,
  VrSession,
  ConfirmedPlan,
  CircleIdea,
  Comment,
  PlanStatus,
  SavedResolved,
} from './mock/types';

// Reads the public catalogue from Supabase and shapes each row like the
// matching mock type, so screens and their props don't change. Rows carry a
// `slug` ('r1', 'd4', 'v1' …) that the app uses as its id; the uuid stays
// internal. See supabase/migrations/0005_catalogue_slugs.sql.

// PostgREST rows are untyped JSON here; the mappers below are the one place
// that knows their shape. ponytail: hand-written, swap for generated types
// (`supabase gen types`) if the schema starts moving.
type Row = Record<string, any>;

const orUndef = <T,>(v: T | null | undefined) => (v == null ? undefined : v);
const nonEmpty = <T,>(v: T[] | null | undefined) => (v && v.length ? v : undefined);

const DAY_MS = 86_400_000;

/** "3 days ago" / "3 天前" from a timestamp, at the granularity the mock copy used. */
export function relativeWhen(iso: string, now = Date.now()): Bilingual {
  const days = Math.max(0, Math.floor((now - new Date(iso).getTime()) / DAY_MS));
  if (days === 0) return { en: 'today', zh: '今天' };
  if (days === 1) return { en: 'yesterday', zh: '昨天' };
  if (days < 7) return { en: `${days} days ago`, zh: `${days} 天前` };
  if (days < 14) return { en: 'last week', zh: '上周' };
  const weeks = Math.floor(days / 7);
  return { en: `${weeks} weeks ago`, zh: `${weeks} 周前` };
}

function toComment(c: Row): Comment {
  return { name: c.display_name, idx: c.avatar_idx, when: relativeWhen(c.created_at), text: c.body };
}

function toHomeRec(r: Row): HomeRec {
  return {
    id: r.slug,
    kind: r.kind,
    invite: r.headline,
    sub: r.subline,
    photo: r.photo_kind,
    why: r.why,
    trust: r.trust,
    org: r.org_name ? { name: r.org_name, initials: r.org_initials } : null,
    guide: r.guide_name
      ? { name: r.guide_name, bilingual: r.guide_bilingual, idx: r.guide_idx, bio: orUndef(r.guide_bio) }
      : undefined,
    peer: {
      triedBy: r.attended_count,
      safe: r.peer_safe,
      welcoming: r.peer_welcoming,
      useful: r.peer_useful,
      quote: orUndef(r.testimonial_text),
      by: orUndef(r.testimonial_by),
    },
    cta: r.cta,
    detail: {
      time: r.detail_time,
      location: r.detail_location,
      cost: r.detail_cost,
      language: r.detail_language,
      intensity: r.detail_intensity,
      bring: r.detail_bring,
    },
    rating: Number(r.rating),
    reviewsCount: r.reviews_count,
    // Null unless the viewer is a member: conversations are members-only (RLS).
    groupChatId: orUndef(r.chat?.slug),
    comfort: r.comfort,
    dur: r.dur,
    comments: [...(r.comments ?? [])]
      .sort((a: Row, b: Row) => b.created_at.localeCompare(a.created_at))
      .map(toComment),
  };
}

function toDiscoverItem(r: Row): DiscoverItem {
  return {
    id: r.slug,
    title: r.headline,
    kind: r.tags,
    cta: r.cta,
    photo: r.photo_kind,
    min: orUndef(r.min_duration),
    org: r.org_name
      ? { name: r.org_name, initials: r.org_initials, tone: r.org_tone, verified: r.org_verified }
      : null,
    coach: r.guide_name ? { name: r.guide_name, bio: r.guide_bio, idx: r.guide_idx } : undefined,
    rating: Number(r.rating),
    reviews: r.reviews_count,
    attended: r.attended_count || undefined,
    badges: nonEmpty(r.badges),
    when: orUndef(r.when_text),
    distance: orUndef(r.distance_text),
    // Discover's one-line note was seeded into `why`.
    note: r.why,
    trust: nonEmpty(r.trust),
    access: nonEmpty(r.access),
    testimonial: r.testimonial_text ? { text: r.testimonial_text, by: r.testimonial_by } : undefined,
    feedback: nonEmpty(r.feedback),
  };
}

function toVrSession(r: Row): VrSession {
  return {
    id: r.slug,
    title: r.title,
    sub: r.sub,
    min: r.min,
    tone: r.tone,
    goal: r.goal,
    env: r.env,
    feltIntensity: r.felt_intensity,
    beginnerSafe: r.beginner_safe,
    canStop: r.can_stop,
    space: r.space,
    movement: r.movement,
    energyKcal: r.energy_kcal,
    triedBy: r.tried_by,
    feedback: r.feedback,
    guide: {
      name: r.guide_name,
      bilingual: r.guide_bilingual,
      beginner: r.guide_beginner,
      idx: r.guide_idx,
      bio: r.guide_bio,
    },
    realWorld: r.real_world ? { title: r.real_world.headline, when: r.real_world_when } : undefined,
  };
}

function toPlan(r: Row, status: PlanStatus | undefined): ConfirmedPlan {
  return {
    id: r.slug,
    dbId: r.id,
    title: r.title,
    day: r.day,
    date: r.date,
    time: r.time,
    where: r.where_text,
    host: r.host,
    type: r.type,
    going: r.going_count,
    names: r.attendee_names,
    status: status ?? 'saved',
    groupChatId: orUndef(r.chat?.slug),
    chatUnread: 0,
    facilitator: r.facilitator_name
      ? { name: r.facilitator_name, idx: r.facilitator_idx, bilingual: r.facilitator_bilingual, role: r.facilitator_role }
      : undefined,
    language: orUndef(r.language),
    welcome: orUndef(r.welcome),
    norms: r.norms,
    friends: r.friend_names,
  };
}

function toCircleIdea(r: Row): CircleIdea {
  return {
    id: r.slug,
    who: r.who ?? { en: r.who_name, zh: r.who_name },
    idx: r.who_idx,
    relation: r.relation,
    source: orUndef(r.source),
    title: r.title,
    body: r.body,
    tag: r.tag,
    tagTone: r.tag_tone,
    interested: r.interested_count,
    names: r.interested_names,
    prefLang: r.pref_lang,
    prefSize: r.pref_size,
    prefPace: r.pref_pace,
  };
}

async function rows(query: PromiseLike<{ data: Row[] | null; error: unknown }>) {
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchHomeRecs(): Promise<HomeRec[]> {
  const data = await rows(
    supabase
      .from('activities')
      .select('*, chat:conversations(slug), comments:activity_comments(display_name, avatar_idx, body, created_at)')
      .eq('surface', 'home')
      .order('slug')
  );
  return data.map(toHomeRec);
}

export async function fetchDiscoverItems(): Promise<DiscoverItem[]> {
  const data = await rows(supabase.from('activities').select('*').eq('surface', 'discover').order('slug'));
  return data.map(toDiscoverItem);
}

export async function fetchVrSessions(): Promise<VrSession[]> {
  const data = await rows(
    supabase.from('vr_sessions').select('*, real_world:activities(headline)').order('slug')
  );
  return data.map(toVrSession);
}

export async function fetchPlans(userId: string | undefined): Promise<ConfirmedPlan[]> {
  const [plans, rsvps] = await Promise.all([
    rows(supabase.from('plans').select('*, chat:conversations(slug)').order('slug')),
    userId ? rows(supabase.from('plan_rsvps').select('plan_id, status').eq('user_id', userId)) : Promise.resolve([]),
  ]);
  const statusByPlan = new Map(rsvps.map((r) => [r.plan_id, r.status as PlanStatus]));
  return plans.map((p) => toPlan(p, statusByPlan.get(p.id)));
}

export async function fetchCircleIdeas(): Promise<CircleIdea[]> {
  const data = await rows(supabase.from('circle_ideas').select('*').order('slug'));
  return data.map(toCircleIdea);
}

/** A saved id can point at a Home rec, a VR session or a Discover item. */
export function resolveSaved(
  id: string,
  recs: HomeRec[],
  vr: VrSession[],
  discover: DiscoverItem[]
): SavedResolved | null {
  const rec = recs.find((r) => r.id === id);
  if (rec) return { kind: 'rec', item: rec };
  const v = vr.find((x) => x.id === id);
  if (v) return { kind: 'vr', item: v };
  const d = discover.find((x) => x.id === id);
  if (d) return { kind: 'discover', item: d };
  return null;
}
