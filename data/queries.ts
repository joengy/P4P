import { useQuery } from '@tanstack/react-query';
import { HOME_REC_LIBRARY, VR_SESSIONS, DISCOVER_ITEMS, CONFIRMED, CIRCLE_IDEAS, HISTORY, CONVERSATIONS } from './mock';
import { useDeviceStore } from '@/store/device';
import { fetchVrCompletions, completionToHistoryItem } from '@/lib/vrBridge';

// React Query wrappers around the in-memory mock arrays. Phase 3 swaps the
// queryFn bodies for Supabase calls (`supabase.from('activities').select()`
// etc.) — call sites (useHomeRecs(), useVrSession(id), ...) stay the same.

export function useHomeRecs() {
  return useQuery({
    queryKey: ['homeRecs'],
    queryFn: async () => Object.values(HOME_REC_LIBRARY),
  });
}

export function useHomeRec(id: string | null | undefined) {
  return useQuery({
    queryKey: ['homeRec', id],
    queryFn: async () => (id ? HOME_REC_LIBRARY[id] ?? null : null),
    enabled: !!id,
  });
}

export function useVrSessions() {
  return useQuery({
    queryKey: ['vrSessions'],
    queryFn: async () => VR_SESSIONS,
  });
}

export function useVrSession(id: string | null | undefined) {
  return useQuery({
    queryKey: ['vrSession', id],
    queryFn: async () => VR_SESSIONS.find((v) => v.id === id) ?? null,
    enabled: !!id,
  });
}

export function useDiscoverItems() {
  return useQuery({
    queryKey: ['discoverItems'],
    queryFn: async () => DISCOVER_ITEMS,
  });
}

export function useDiscoverItem(id: string | null | undefined) {
  return useQuery({
    queryKey: ['discoverItem', id],
    queryFn: async () => DISCOVER_ITEMS.find((d) => d.id === id) ?? null,
    enabled: !!id,
  });
}

export function useConfirmedPlans() {
  return useQuery({
    queryKey: ['confirmedPlans'],
    queryFn: async () => CONFIRMED,
  });
}

export function useConfirmedPlan(id: string | null | undefined) {
  return useQuery({
    queryKey: ['confirmedPlan', id],
    queryFn: async () => CONFIRMED.find((c) => c.id === id) ?? null,
    enabled: !!id,
  });
}

export function useCircleIdeas() {
  return useQuery({
    queryKey: ['circleIdeas'],
    queryFn: async () => CIRCLE_IDEAS,
  });
}

export function useCircleIdea(id: string | null | undefined) {
  return useQuery({
    queryKey: ['circleIdea', id],
    queryFn: async () => CIRCLE_IDEAS.find((c) => c.id === id) ?? null,
    enabled: !!id,
  });
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
