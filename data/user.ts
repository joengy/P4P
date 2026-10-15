import { supabase } from '@/lib/supabase';
import type { Bilingual } from '@/lib/L';
import type { CheckInValue } from '@/components/home/CheckInCard';
import type { ChatMessage, Conversation, HistoryItem, PlanStatus } from './mock/types';

// Per-user reads and writes. Every table here is RLS-scoped to auth.uid(), so
// these only work signed in; the hooks in data/queries.ts gate on the user id.

type Row = Record<string, any>;

async function rows(query: PromiseLike<{ data: Row[] | null; error: unknown }>) {
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

async function run(query: PromiseLike<{ error: unknown }>) {
  const { error } = await query;
  if (error) throw error;
}

const DAY_MS = 86_400_000;
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
/** Calendar days between then and today, so last night at 7pm is "yesterday". */
const daysAgo = (iso: string) =>
  Math.max(0, Math.round((startOfDay(new Date()) - startOfDay(new Date(iso))) / DAY_MS));

// ── Profile ───────────────────────────────────────────────────

export async function fetchProfile(userId: string): Promise<{ name: string; since: string }> {
  const data = await rows(supabase.from('profiles').select('display_name, created_at').eq('id', userId));
  return { name: data[0]?.display_name ?? '', since: data[0]?.created_at ?? new Date().toISOString() };
}

// ── Saved items ───────────────────────────────────────────────
// The app saves by slug (r1, d4, v1); saved_items stores the catalogue uuid
// and whether it is an activity or a VR session.

async function catalogIds() {
  const [acts, vrs] = await Promise.all([
    rows(supabase.from('activities').select('id, slug')),
    rows(supabase.from('vr_sessions').select('id, slug')),
  ]);
  return [
    ...acts.map((r) => ({ id: r.id, slug: r.slug, type: 'activity' as const })),
    ...vrs.map((r) => ({ id: r.id, slug: r.slug, type: 'vr_session' as const })),
  ];
}

export async function fetchSaved(userId: string): Promise<string[]> {
  const [saved, ids] = await Promise.all([
    rows(supabase.from('saved_items').select('item_id').eq('user_id', userId).order('created_at')),
    catalogIds(),
  ]);
  const slugOf = new Map(ids.map((x) => [x.id, x.slug]));
  return saved.map((s) => slugOf.get(s.item_id)).filter((s): s is string => !!s);
}

export async function setSaved(userId: string, slug: string, saved: boolean) {
  const item = (await catalogIds()).find((x) => x.slug === slug);
  if (!item) throw new Error(`Unknown catalogue item ${slug}`);
  if (saved) {
    await run(
      supabase
        .from('saved_items')
        .upsert({ user_id: userId, item_type: item.type, item_id: item.id }, { onConflict: 'user_id,item_type,item_id' })
    );
  } else {
    await run(supabase.from('saved_items').delete().eq('user_id', userId).eq('item_id', item.id));
  }
}

// ── RSVPs ─────────────────────────────────────────────────────

export async function setRsvp(userId: string, planDbId: string, status: PlanStatus) {
  await run(
    supabase.from('plan_rsvps').upsert({ plan_id: planDbId, user_id: userId, status }, { onConflict: 'plan_id,user_id' })
  );
}

// ── Check-ins ─────────────────────────────────────────────────

/** Today's most recent check-in, so Home reopens where the user left it. */
export async function fetchTodayCheckIn(userId: string): Promise<CheckInValue | null> {
  const midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  const data = await rows(
    supabase
      .from('check_ins')
      .select('body, place, mood, social')
      .eq('user_id', userId)
      .gte('created_at', midnight.toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
  );
  return (data[0] as CheckInValue | undefined) ?? null;
}

export async function insertCheckIn(userId: string, v: CheckInValue) {
  await run(supabase.from('check_ins').insert({ user_id: userId, ...v }));
}

// ── Conversations and messages ────────────────────────────────

const clock = (iso: string) => {
  const d = new Date(iso);
  return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
};

function listTime(iso: string): Bilingual {
  const days = daysAgo(iso);
  if (days === 0) return { en: clock(iso), zh: clock(iso) };
  if (days === 1) return { en: 'Yest', zh: '昨天' };
  const d = new Date(iso);
  const label = `${d.getDate()}/${d.getMonth() + 1}`;
  return { en: label, zh: label };
}

function toChatMessage(m: Row, userId: string): ChatMessage {
  return {
    from: m.sender_id === userId ? 'me' : 'them',
    who: m.sender_name ?? undefined,
    text: m.text ?? undefined,
    origLang: m.orig_lang ?? undefined,
    sticker: m.sticker ?? undefined,
    time: clock(m.created_at),
  };
}

function lastPreview(m: Row | undefined, kind: string): Conversation['last'] {
  if (!m) return {};
  // The list renders text only, so a sticker previews as its phrase or emoji.
  const text: Bilingual =
    m.text ?? (typeof m.sticker === 'string' ? { en: m.sticker, zh: m.sticker } : { en: m.sticker.en, zh: m.sticker.zh });
  // Group and family lists name who spoke, as the mock copy did ("Lien: …").
  if ((kind === 'group' || kind === 'family') && m.sender_name) {
    const part = (k: 'en' | 'zh') => (typeof text === 'string' ? text : text[k]);
    return { text: { en: `${m.sender_name}: ${part('en')}`, zh: `${m.sender_name}：${part('zh')}` } };
  }
  return { text };
}

/** Conversations the user is a member of (RLS hides the rest), newest first. */
export async function fetchConversations(): Promise<Conversation[]> {
  const data = await rows(
    supabase
      .from('conversations')
      .select('*, messages(text, sticker, sender_id, sender_name, created_at)')
      .order('slug')
  );
  return data
    .map((c) => {
      const msgs = [...(c.messages ?? [])].sort((a: Row, b: Row) => a.created_at.localeCompare(b.created_at));
      const last = msgs[msgs.length - 1];
      const conv: Conversation = {
        id: c.slug,
        dbId: c.id,
        name: c.name,
        kind: c.kind,
        idx: c.avatar_idx,
        unread: 0,
        count: c.member_count ?? undefined,
        last: lastPreview(last, c.kind),
        time: last ? listTime(last.created_at) : { en: '', zh: '' },
        pinned: c.pinned_text
          ? { by: c.pinned_by_name, idx: c.pinned_by_idx ?? undefined, role: c.pinned_role ?? undefined, text: c.pinned_text }
          : undefined,
      };
      return { conv, at: last?.created_at ?? '' };
    })
    .sort((a, b) => b.at.localeCompare(a.at))
    .map((x) => x.conv);
}

export async function fetchMessages(convDbId: string, userId: string): Promise<ChatMessage[]> {
  const data = await rows(
    supabase.from('messages').select('*').eq('conversation_id', convDbId).order('created_at')
  );
  return data.map((m) => toChatMessage(m, userId));
}

export async function sendMessage(convDbId: string, userId: string, msg: Partial<ChatMessage>) {
  await run(
    supabase.from('messages').insert({
      conversation_id: convDbId,
      sender_id: userId,
      text: msg.text ?? null,
      orig_lang: msg.origLang ?? null,
      sticker: msg.sticker ?? null,
    })
  );
}

// ── Movement history ──────────────────────────────────────────

function historyWhen(days: number): Bilingual {
  if (days === 0) return { en: 'Today', zh: '今天' };
  if (days === 1) return { en: 'Yesterday', zh: '昨天' };
  return { en: `${days} days ago`, zh: `${days} 天前` };
}

export async function fetchMovementHistory(userId: string): Promise<HistoryItem[]> {
  const data = await rows(
    supabase.from('movement_sessions').select('*').eq('user_id', userId).order('occurred_at', { ascending: false })
  );
  return data.map((r) => {
    const days = daysAgo(r.occurred_at);
    return {
      id: r.id,
      daysAgo: days,
      when: historyWhen(days),
      title: r.title,
      type: r.type,
      min: r.min,
      kcal: r.kcal,
      intensity: r.intensity,
      mood: r.mood ?? { en: '', zh: '' },
      location: r.location ?? undefined,
      ledBy: r.led_by ?? undefined,
      ledByIdx: r.led_by_idx,
      withWho: r.with_who,
      notes: r.notes ?? undefined,
    };
  });
}
