import type { DiscoverFilterId } from './types';
import type { Bilingual } from '@/lib/L';

// Discover's filter chips. The items themselves come from Supabase
// (data/catalog.ts); their `kind` tags match these ids.
export const DISCOVER_FILTERS: { id: DiscoverFilterId; label: Bilingual }[] = [
  { id: 'all', label: { en: 'All', zh: '全部' } },
  { id: 'near', label: { en: 'Near me', zh: '附近' } },
  { id: 'group', label: { en: 'Group activities', zh: '集体活动' } },
  { id: 'home', label: { en: 'At home', zh: '居家' } },
  { id: 'vr', label: { en: 'Exergaming (VR)', zh: 'VR 运动' } },
  { id: 'women', label: { en: 'Women-only', zh: '仅限女性' } },
];
