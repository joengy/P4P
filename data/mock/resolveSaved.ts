import { HOME_REC_LIBRARY } from './homeRecs';
import { VR_SESSIONS } from './vrSessions';
import { DISCOVER_ITEMS } from './discover';
import type { SavedResolved } from './types';

// Ported from data.jsx's resolveSaved() — resolves a saved id back to its
// source item + kind, since saves can come from Home recs, VR sessions, or
// Discover activities (mirrors the merged `activities` table planned for Phase 3).
export function resolveSaved(id: string): SavedResolved | null {
  if (HOME_REC_LIBRARY[id]) return { kind: 'rec', item: HOME_REC_LIBRARY[id] };
  const vr = VR_SESSIONS.find((v) => v.id === id);
  if (vr) return { kind: 'vr', item: vr };
  const disc = DISCOVER_ITEMS.find((x) => x.id === id);
  if (disc) return { kind: 'discover', item: disc };
  return null;
}
