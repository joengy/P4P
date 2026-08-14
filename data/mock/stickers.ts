import type { PhraseSticker } from '@/components/ui/Sticker';

// Ported from data-social.jsx's STICKERS_ENCOURAGE + STICKERS_ICONIC.
export const STICKERS_ENCOURAGE: PhraseSticker[] = [
  { id: 's1', en: "You've got this!", zh: '你可以的！', tone: 'accent' },
  { id: 's2', en: 'So proud of you', zh: '真为你骄傲', tone: 'calm' },
  { id: 's3', en: "Let's go together", zh: '我们一起去', tone: 'lav' },
  { id: 's4', en: 'Take it slow', zh: '慢慢来', tone: 'calm' },
  { id: 's5', en: 'Rest well today', zh: '今天好好休息', tone: 'lav' },
  { id: 's6', en: 'Just breathe', zh: '深呼吸就好', tone: 'accent' },
];

export const STICKERS_ICONIC: string[] = ['🌿', '🚶‍♀️', '☀️', '💪', '🍵', '👏', '🌸', '🫶'];
