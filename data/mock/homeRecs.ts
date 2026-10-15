import type { CheckInBody, CheckInPlace, CheckInMood, CheckInSocial } from './types';

// pickHomeRec — ported 1:1 from data.jsx's rules-table recommendation engine.
// Returns activity slugs; the rows themselves come from Supabase (data/catalog.ts).
export function pickHomeRec(
  body: CheckInBody,
  place: CheckInPlace,
  mood: CheckInMood,
  social: CheckInSocial = 'with'
): { primaryId: string; alternatives: string[] } {
  if (place === 'outside') {
    if (social === 'alone') return { primaryId: 'r5', alternatives: ['r1', 'r3'] };
    return { primaryId: 'r1', alternatives: ['r5', 'r3'] };
  }
  if (place === 'home') {
    if (body === 'sore' || mood === 'reset') return { primaryId: 'r2', alternatives: ['r3', 'r4'] };
    return { primaryId: 'r3', alternatives: ['r2', 'r4'] };
  }
  if (body === 'sore') return { primaryId: 'r2', alternatives: ['r4', 'r3'] };
  return { primaryId: 'r4', alternatives: ['r3', 'r2'] };
}
