import { useQuery } from '@tanstack/react-query';
import { HISTORY, CONVERSATIONS } from './mock';
import { useDeviceStore } from '@/store/device';
import { useAuth } from '@/lib/auth';
import { fetchVrCompletions, completionToHistoryItem } from '@/lib/vrBridge';
import {
  fetchHomeRecs,
  fetchDiscoverItems,
  fetchVrSessions,
  fetchPlans,
  fetchCircleIdeas,
  resolveSaved,
} from './catalog';

// React Query hooks — the single data-access surface for screens. The public
// catalogue (activities, VR sessions, plans, circle ideas) comes from Supabase
// via data/catalog.ts. Each single-item hook selects from its list query, so a
// list and its detail sheet share one request and one cache entry.

const byId = <T extends { id: string }>(id: string | null | undefined) => (list: T[]) =>
  list.find((x) => x.id === id) ?? null;

export function useHomeRecs() {
  return useQuery({ queryKey: ['homeRecs'], queryFn: fetchHomeRecs });
}

export function useHomeRec(id: string | null | undefined) {
  return useQuery({ queryKey: ['homeRecs'], queryFn: fetchHomeRecs, select: byId(id), enabled: !!id });
}

export function useVrSessions() {
  return useQuery({ queryKey: ['vrSessions'], queryFn: fetchVrSessions });
}

export function useVrSession(id: string | null | undefined) {
  return useQuery({ queryKey: ['vrSessions'], queryFn: fetchVrSessions, select: byId(id), enabled: !!id });
}

export function useDiscoverItems() {
  return useQuery({ queryKey: ['discoverItems'], queryFn: fetchDiscoverItems });
}

export function useDiscoverItem(id: string | null | undefined) {
  return useQuery({ queryKey: ['discoverItems'], queryFn: fetchDiscoverItems, select: byId(id), enabled: !!id });
}

export function useConfirmedPlans() {
  const userId = useAuth().user?.id;
  return useQuery({ queryKey: ['confirmedPlans', userId], queryFn: () => fetchPlans(userId) });
}

export function useConfirmedPlan(id: string | null | undefined) {
  const userId = useAuth().user?.id;
  return useQuery({
    queryKey: ['confirmedPlans', userId],
    queryFn: () => fetchPlans(userId),
    select: byId(id),
    enabled: !!id,
  });
}

export function useCircleIdeas() {
  return useQuery({ queryKey: ['circleIdeas'], queryFn: fetchCircleIdeas });
}

export function useCircleIdea(id: string | null | undefined) {
  return useQuery({ queryKey: ['circleIdeas'], queryFn: fetchCircleIdeas, select: byId(id), enabled: !!id });
}

/** Resolves saved ids against the three catalogue lists (Home recs, VR, Discover). */
export function useResolveSaved() {
  const recs = useHomeRecs().data ?? [];
  const vr = useVrSessions().data ?? [];
  const discover = useDiscoverItems().data ?? [];
  return (id: string) => resolveSaved(id, recs, vr, discover);
}

// The one hook already reading real data: hikes completed in the VR game come
// back from Supabase and sit in front of the mock history.
//
// ponytail: real rows are prepended to the mock array rather than replacing it,
// so the You tab's chart still has a body of history to draw during the study.
// Drop the `...HISTORY` tail once there is enough real data to stand alone.
export function useHistory() {
  // Subscribed rather than read via getState(): zustand's persist middleware
  // rehydrates from AsyncStorage asynchronously, so the code is still null on
  // the first render. Keying the query on it refetches once it arrives.
  const deviceCode = useDeviceStore((s) => s.code);
  return useQuery({
    queryKey: ['history', deviceCode],
    queryFn: async () => {
      if (!deviceCode) return HISTORY;
      try {
        const rows = await fetchVrCompletions(deviceCode);
        return [...rows.map(completionToHistoryItem), ...HISTORY];
      } catch {
        // An unreachable backend shouldn't empty the You tab.
        return HISTORY;
      }
    },
  });
}

export function useHistoryItem(id: string | null | undefined) {
  return useQuery({
    queryKey: ['historyItem', id],
    queryFn: async () => HISTORY.find((h) => h.id === id) ?? null,
    enabled: !!id,
  });
}

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => CONVERSATIONS,
  });
}

export function useConversation(id: string | null | undefined) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => CONVERSATIONS.find((c) => c.id === id) ?? null,
    enabled: !!id,
  });
}
