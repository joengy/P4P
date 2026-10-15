import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { ChatMessage, PlanStatus } from './mock';
import type { CheckInValue } from '@/components/home/CheckInCard';
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
import {
  fetchSaved,
  setSaved,
  setRsvp,
  fetchTodayCheckIn,
  insertCheckIn,
  fetchConversations,
  fetchMessages,
  sendMessage,
  fetchMovementHistory,
  fetchProfile,
} from './user';

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

// Movement history: the user's movement_sessions rows, plus hikes the paired
// headset finished (vr_device_sessions), newest first.
export function useHistory() {
  const userId = useAuth().user?.id;
  // Subscribed rather than read via getState(): zustand's persist middleware
  // rehydrates from AsyncStorage asynchronously, so the code is still null on
  // the first render. Keying the query on it refetches once it arrives.
  const deviceCode = useDeviceStore((s) => s.code);
  return useQuery({
    queryKey: ['history', userId, deviceCode],
    enabled: !!userId,
    queryFn: async () => {
      const [moves, vr] = await Promise.all([
        fetchMovementHistory(userId!),
        deviceCode ? fetchVrCompletions(deviceCode).catch(() => []) : Promise.resolve([]),
      ]);
      return [...vr.map(completionToHistoryItem), ...moves].sort((a, b) => a.daysAgo - b.daysAgo);
    },
  });
}

export function useHistoryItem(id: string | null | undefined) {
  const history = useHistory();
  return { ...history, data: history.data?.find((h) => h.id === id) ?? null };
}

export function useConversations() {
  const userId = useAuth().user?.id;
  return useQuery({ queryKey: ['conversations', userId], queryFn: fetchConversations, enabled: !!userId });
}

export function useConversation(id: string | null | undefined) {
  const userId = useAuth().user?.id;
  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: fetchConversations,
    select: byId(id),
    enabled: !!userId && !!id,
  });
}

export function useMessages(convDbId: string | undefined) {
  const userId = useAuth().user?.id;
  return useQuery({
    queryKey: ['messages', convDbId],
    queryFn: () => fetchMessages(convDbId!, userId!),
    enabled: !!userId && !!convDbId,
  });
}

export function useSendMessage(convDbId: string | undefined) {
  const userId = useAuth().user?.id;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (msg: Partial<ChatMessage>) => sendMessage(convDbId!, userId!, msg),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['messages', convDbId] });
      qc.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
}

/** Saved catalogue items by slug, with an optimistic toggle. */
export function useSaved() {
  const userId = useAuth().user?.id;
  const qc = useQueryClient();
  const key = ['saved', userId];
  const { data: saved = [] } = useQuery({ queryKey: key, queryFn: () => fetchSaved(userId!), enabled: !!userId });
  const mutation = useMutation({
    mutationFn: ({ slug, on }: { slug: string; on: boolean }) => setSaved(userId!, slug, on),
    onMutate: async ({ slug, on }) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<string[]>(key) ?? [];
      qc.setQueryData<string[]>(key, on ? [...prev, slug] : prev.filter((s) => s !== slug));
      return { prev };
    },
    onError: (_e, _v, ctx) => ctx && qc.setQueryData(key, ctx.prev),
    onSettled: () => qc.invalidateQueries({ queryKey: key }),
  });
  return {
    saved,
    isSaved: (slug: string) => saved.includes(slug),
    toggleSaved: (slug: string) => mutation.mutate({ slug, on: !saved.includes(slug) }),
  };
}

export function useSetRsvp() {
  const userId = useAuth().user?.id;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ planDbId, status }: { planDbId: string; status: PlanStatus }) => setRsvp(userId!, planDbId, status),
    onSettled: () => qc.invalidateQueries({ queryKey: ['confirmedPlans'] }),
  });
}

export function useTodayCheckIn() {
  const userId = useAuth().user?.id;
  return useQuery({ queryKey: ['checkIn', userId], queryFn: () => fetchTodayCheckIn(userId!), enabled: !!userId });
}

export function useSaveCheckIn() {
  const userId = useAuth().user?.id;
  return useMutation({ mutationFn: (v: CheckInValue) => insertCheckIn(userId!, v) });
}

export function useProfile() {
  const userId = useAuth().user?.id;
  return useQuery({ queryKey: ['profile', userId], queryFn: () => fetchProfile(userId!), enabled: !!userId });
}
