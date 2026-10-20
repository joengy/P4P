import { supabase } from '@/lib/supabase';
import type { Bilingual } from '@/lib/L';
import type { HistoryItem } from '@/data/mock';

// The phone half of the bridge to the Unity VR hike (dsaw04/Hoa_XR_Hiking_Game).
//
// Both ends talk to one table, vr_device_sessions (migration 0004). The app
// inserts a row when the player taps "Start session"; the headset claims it at
// launch, pre-fills its in-VR check-in from it, and PATCHes the outcome back.
// Nothing here waits on the headset — queueing is fire-and-forget and the
// completion shows up on the next history refetch.

/** Mirrors vr_sessions.felt_intensity and the game's MovementMode. */
export type VrMode = 'gentle' | 'steady' | 'strong';
/** Mirrors the game's MovementIntensity. */
export type VrIntensity = 'low' | 'medium' | 'high';

export type VrDeviceSession = {
  id: string;
  device_code: string;
  vr_session_ref: string | null;
  title: Bilingual | null;
  mode: VrMode;
  intensity: VrIntensity;
  minutes: number;
  created_at: string;
  started_at: string | null;
  ended_at: string | null;
  actual_minutes: number | null;
  kcal: number | null;
};

const TABLE = 'vr_device_sessions';

// The catalogue only carries a felt intensity, not the game's separate
// low/medium/high dial, so derive one. A player who wants a gentle session at
// high intensity is not a case the UI offers yet.
export function intensityForMode(mode: VrMode): VrIntensity {
  return mode === 'gentle' ? 'low' : mode === 'strong' ? 'high' : 'medium';
}

/** Queues a hike for the paired headset. Resolves to the new row's id once written. */
export async function queueVrSession(args: {
  deviceCode: string;
  vrSessionRef: string;
  title: Bilingual;
  mode: VrMode;
  minutes: number;
}) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({
    device_code: args.deviceCode,
    vr_session_ref: args.vrSessionRef,
    title: typeof args.title === 'string' ? { en: args.title } : args.title,
    mode: args.mode,
    intensity: intensityForMode(args.mode),
    minutes: args.minutes,
    })
    .select('id')
    .single();
  if (error) throw error;
  return data.id as string;
}

export type HandoffState = 'waiting' | 'started' | 'finished';

/** Where a queued hike is: still waiting for the headset, started, or finished. */
export async function fetchHandoffState(id: string): Promise<HandoffState> {
  const { data, error } = await supabase.from(TABLE).select('started_at, ended_at').eq('id', id).single();
  if (error) throw error;
  if (data.ended_at) return 'finished';
  return data.started_at ? 'started' : 'waiting';
}

/** Hikes this headset has finished, newest first. */
export async function fetchVrCompletions(deviceCode: string): Promise<VrDeviceSession[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('device_code', deviceCode)
    .not('ended_at', 'is', null)
    .order('ended_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data ?? []) as VrDeviceSession[];
}

const DAY_MS = 86_400_000;

/** Shapes a completed row like the movement history entries the You tab renders. */
export function completionToHistoryItem(row: VrDeviceSession): HistoryItem {
  const ended = row.ended_at ? new Date(row.ended_at) : new Date();
  const daysAgo = Math.max(0, Math.floor((Date.now() - ended.getTime()) / DAY_MS));
  return {
    id: row.id,
    daysAgo,
    // ponytail: absolute date rather than the mock's bilingual "Tue morning"
    // phrasing — add a relative-time formatter if the copy starts to jar.
    when: ended.toLocaleDateString(),
    title: row.title ?? { en: 'VR hike', zh: 'VR 徒步' },
    type: 'vr',
    min: row.actual_minutes ?? row.minutes,
    kcal: row.kcal ?? 0,
    intensity: row.mode,
    mood: { en: '', zh: '' },
  };
}
