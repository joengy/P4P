import type { Bilingual } from '@/lib/L';
import type { BadgeKey } from '@/components/ui/BadgeRow';
import type { Tone } from '@/constants/theme';

export type TrustKey = 'communityLed' | 'professional' | 'beginner' | 'lowCost' | 'stopAnytime';
export type ComfortKey =
  | 'beginner' | 'friendWelcome' | 'women' | 'seated' | 'stopAnytime' | 'quiet' | 'noBooking';

export type CtaKey = 'rsvp' | 'start' | 'startVR' | 'addPlan' | 'saveRoute' | 'askFirst' | 'join';

export type Comment = {
  name: string;
  idx: number;
  when: Bilingual;
  text: Bilingual;
};

export type PeerEvidence = {
  triedBy: number;
  safe: number;
  welcoming: number;
  useful: number;
  quote?: Bilingual;
  by?: Bilingual;
};

export type ActivityDetail = {
  time: string;
  location: string;
  cost: string;
  language: string;
  intensity: string;
  bring: string;
};

export type HomeRecKind = 'group' | 'home' | 'vr' | 'library' | 'outdoor';

export type HomeRec = {
  id: string;
  kind: HomeRecKind;
  invite: Bilingual;
  sub: Bilingual;
  photo: string;
  why: Bilingual;
  trust: TrustKey[];
  org: { name: Bilingual; initials: string } | null;
  guide?: { name: string; bilingual: boolean; idx: number; bio?: Bilingual };
  peer: PeerEvidence;
  cta: CtaKey;
  detail: ActivityDetail;
  rating: number;
  reviewsCount: number;
  groupChatId?: string;
  comfort: ComfortKey[];
  dur: Bilingual;
  comments: Comment[];
};

export type CheckInBody = 'ok' | 'sore' | 'energised';
export type CheckInPlace = 'home' | 'indoorNearby' | 'outside';
export type CheckInMood = 'reset' | 'neutral' | 'motivated';
export type CheckInSocial = 'alone' | 'with' | 'group';

export type VrFeedback = { id: string; label: Bilingual; pct: number };

export type VrSession = {
  id: string;
  title: Bilingual;
  sub: Bilingual;
  min: number;
  tone: 'calm' | 'accent' | 'lav';
  goal: Bilingual;
  env: string;
  feltIntensity: 'gentle' | 'steady' | 'strong';
  beginnerSafe: boolean;
  canStop: boolean;
  space: Bilingual;
  movement: Bilingual;
  energyKcal: number;
  triedBy: number;
  feedback: VrFeedback[];
  guide: { name: string; bilingual: boolean; beginner: boolean; idx: number; bio: Bilingual };
  realWorld?: { title: Bilingual; when: Bilingual };
};

export type DiscoverFilterId = 'all' | 'near' | 'group' | 'home' | 'vr' | 'women';

export type DiscoverItem = {
  id: string;
  title: Bilingual;
  kind: string[];
  cta: CtaKey;
  photo: string;
  min?: number;
  org: { name: Bilingual; initials: string; tone: 'calm' | 'lav' | 'accent'; verified: boolean } | null;
  coach?: { name: string; bio: Bilingual; idx: number };
  rating: number;
  reviews: number;
  attended?: number;
  badges?: BadgeKey[];
  when?: Bilingual;
  distance?: Bilingual;
  note: Bilingual;
  trust?: TrustKey[];
  access?: string[];
  testimonial?: { text: Bilingual; by: Bilingual };
  feedback?: VrFeedback[];
};

export type MoodOption = { id: string; label: Bilingual; tone: 'lav' | 'calm' | 'accent' };
export type MoodEnergy = 'low' | 'med' | 'high';

export type SavedResolved =
  | { kind: 'rec'; item: HomeRec }
  | { kind: 'vr'; item: VrSession }
  | { kind: 'discover'; item: DiscoverItem };

// ── Plan ──────────────────────────────────────────────────────
export type PlanStatus = 'going' | 'maybe' | 'saved';
export type GroupNormKey = 'slowPace' | 'newcomers' | 'noChat' | 'restAnytime' | 'familyWelcome' | 'stayClose';

export type ConfirmedPlan = {
  id: string;
  /** Database uuid, for writes (RSVPs). Absent on mock data. */
  dbId?: string;
  title: Bilingual;
  day: Bilingual;
  date: string;
  time: Bilingual;
  where: Bilingual;
  host: Bilingual;
  type: 'outdoor' | 'social' | 'vr';
  going: number;
  names: string[];
  status: PlanStatus;
  groupChatId?: string;
  chatUnread: number;
  facilitator?: { name: string; idx: number; bilingual: boolean; role: Bilingual };
  language?: Bilingual;
  welcome?: Bilingual;
  norms?: GroupNormKey[];
  friends?: string[];
};

export type CircleIdea = {
  id: string;
  who: Bilingual;
  idx: number;
  relation: Bilingual;
  source?: Bilingual;
  title: Bilingual;
  body: Bilingual;
  tag: Bilingual;
  tagTone: Tone;
  interested: number;
  names: string[];
  prefLang: Bilingual;
  prefSize: Bilingual;
  prefPace: Bilingual;
};

// ── You / rhythm history ─────────────────────────────────────
export type HistoryType = 'vr' | 'outdoor' | 'home' | 'social';
export type HistoryIntensity = 'gentle' | 'steady' | 'strong';

export type HistoryItem = {
  id: string;
  daysAgo: number;
  when: Bilingual;
  title: Bilingual;
  type: HistoryType;
  min: number;
  kcal: number;
  intensity: HistoryIntensity;
  mood: Bilingual;
  location?: Bilingual;
  ledBy?: Bilingual;
  ledByIdx?: number | null;
  withWho?: string[];
  notes?: Bilingual;
};

export type YouTip = {
  id: string;
  kind: string;
  match: 'mostly-outdoor' | 'mostly-vr' | 'rest-stretch';
  title: Bilingual;
  body: Bilingual;
  cta: Bilingual;
  kindTone: Tone;
  icon: string;
};

export type KnowledgeItem = {
  id: string;
  icon: string;
  tone: Tone;
  title: Bilingual;
  teaser: Bilingual;
  body: Bilingual;
};

// ── Messages ──────────────────────────────────────────────────
export type ConversationKind = 'coach' | 'group' | 'friend' | 'family';

export type Conversation = {
  id: string;
  /** Database uuid, for writes (sending messages). Absent on mock data. */
  dbId?: string;
  name: Bilingual;
  kind: ConversationKind;
  idx: number;
  online?: boolean;
  unread: number;
  count?: number;
  last: { text?: Bilingual; sticker?: string | null };
  time: Bilingual;
  pinned?: { by: string; idx?: number; role?: Bilingual; text: Bilingual };
};

export type ChatMessage = {
  from: 'me' | 'them';
  who?: string;
  text?: Bilingual;
  origLang?: 'en' | 'zh';
  sticker?: string | { id: string; en: string; zh: string; tone: Tone };
  time: string;
};
