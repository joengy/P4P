import type { HistoryItem, HistoryType, HistoryIntensity, YouTip, KnowledgeItem } from './types';
import type { Bilingual } from '@/lib/L';
import type { Tone } from '@/constants/theme';

// Ported from data-social.jsx's rangeRead() — gentle qualitative read for a stretch of time.
export function rangeRead(count: number): { word: Bilingual; line: Bilingual } {
  if (count === 0) {
    return {
      word: { en: 'rest', zh: '休息' },
      line: { en: 'Rest is part of moving. Your body will be ready when you are.', zh: '休息也是运动的一部分。当你准备好时，身体也会准备好。' },
    };
  }
  if (count <= 2) {
    return {
      word: { en: 'gentle', zh: '温和' },
      line: { en: 'A gentle stretch of days — every time you showed up counted.', zh: '温和的几天——每一次你的出现都算数。' },
    };
  }
  if (count <= 5) {
    return {
      word: { en: 'steady', zh: '平稳' },
      line: { en: 'A steady rhythm. You kept turning up for yourself.', zh: '平稳的节奏。你一直在为自己出现。' },
    };
  }
  return {
    word: { en: 'strong', zh: '充实' },
    line: { en: 'A full, strong stretch — and you let it stay kind to your body.', zh: '充实有力的一段时间——而你始终温柔待己。' },
  };
}

export const INTENSITY: Record<HistoryIntensity, { label: Bilingual; tone: Tone }> = {
  gentle: { label: { en: 'gentle', zh: '温和' }, tone: 'lav' },
  steady: { label: { en: 'steady', zh: '平稳' }, tone: 'calm' },
  strong: { label: { en: 'strong', zh: '有力' }, tone: 'accent' },
};

export const TYPE_META: Record<HistoryType, { label: Bilingual; tone: Tone; icon: 'headset' | 'pin' | 'leaf' | 'people' }> = {
  vr: { label: { en: 'VR', zh: 'VR' }, tone: 'lav', icon: 'headset' },
  outdoor: { label: { en: 'Outdoor', zh: '户外' }, tone: 'calm', icon: 'pin' },
  home: { label: { en: 'At home', zh: '居家' }, tone: 'accent', icon: 'leaf' },
  social: { label: { en: 'Social', zh: '社交' }, tone: 'accent', icon: 'people' },
};

// Ported from data-social.jsx's YOU_TIPS + pickYouTip().
export const YOU_TIPS: YouTip[] = [
  {
    id: 't1', kind: 'recover', match: 'mostly-outdoor',
    title: { en: 'Try a recovery stretch this week', zh: '本周试试一节恢复拉伸' },
    body: { en: 'You’ve walked outdoors three times. A short shoulder & neck reset can help your body settle.', zh: '你已经在户外走了三次。一段简短的肩颈舒缓能帮助身体安稳下来。' },
    cta: { en: 'Open 8-min reset', zh: '打开 8 分钟舒缓' }, kindTone: 'accent', icon: 'leaf',
  },
  {
    id: 't2', kind: 'step-out', match: 'mostly-vr',
    title: { en: 'A gentle real-world step', zh: '一次温和的户外尝试' },
    body: { en: 'You’ve been moving mostly in VR. The flat Cornwall Park loop might feel like a soft outdoor first step.', zh: '你最近的运动多在 VR 中。康沃尔公园的平坦环线，也许是一段温柔的户外起点。' },
    cta: { en: 'See the real trail', zh: '查看真实步道' }, kindTone: 'calm', icon: 'pin',
  },
  {
    id: 't3', kind: 'rest', match: 'rest-stretch',
    title: { en: 'Rest is part of moving', zh: '休息也是运动的一部分' },
    body: { en: 'A quiet stretch is okay. When you’re ready, a 10-min VR walk is a soft way back.', zh: '安静的一段时间没关系。当你准备好，10 分钟 VR 漫步可以是温和的回归。' },
    cta: { en: 'Save for later', zh: '稍后再看' }, kindTone: 'lav', icon: 'moon',
  },
];

export function pickYouTip(items: HistoryItem[]): YouTip {
  if (!items.length) return YOU_TIPS[2];
  const out = items.filter((h) => h.type === 'outdoor').length;
  const vr = items.filter((h) => h.type === 'vr').length;
  if (out >= 2 && out >= vr) return YOU_TIPS[0];
  if (vr >= 2 && vr > out) return YOU_TIPS[1];
  return YOU_TIPS[0];
}

// Ported from data-social.jsx's KNOWLEDGE — light, non-clinical "why movement helps" layer.
export const KNOWLEDGE: KnowledgeItem[] = [
  {
    id: 'k1', icon: 'leaf', tone: 'calm',
    title: { en: 'A gentle baseline', zh: '温和的基线' },
    teaser: { en: 'How much is “enough”?', zh: '多少才算“够”？' },
    body: { en: 'There’s no number you have to hit. A few short walks, some stretching, or light movement spread across the week is plenty to keep your body feeling like itself. Little and often counts — a rest day counts too.', zh: '没有你必须达到的数字。一周里几段短的散步、一些拉伸，或分散的轻度活动，就足以让身体保持它本来的感觉。少而常，就算数——休息的一天也算数。' },
  },
  {
    id: 'k2', icon: 'heart', tone: 'accent',
    title: { en: 'Heart & breath', zh: '心跳与呼吸' },
    teaser: { en: 'Light, moderate, or too much?', zh: '轻、适中，还是过多？' },
    body: { en: 'A helpful sign: if you can still talk in full sentences, you’re at a light-to-moderate effort — a kind place for the heart. If talking gets hard, ease back. You’re always in charge of the dial.', zh: '一个有用的信号：如果你还能说完整的句子，就是轻到适中的强度——对心脏很友好。如果说话变得吃力，就放缓。节奏始终由你掌握。' },
  },
  {
    id: 'k3', icon: 'moon', tone: 'lav',
    title: { en: 'Stress & recovery', zh: '压力与恢复' },
    teaser: { en: 'Movement for the mind', zh: '为心情而动' },
    body: { en: 'Movement isn’t only for the body. A slow walk or a few minutes of stretching can lower tension, lift a low mood, and help a tired mind settle. Some days that’s the whole reason to move — and that is more than enough.', zh: '运动不只是为了身体。一段慢步走或几分钟拉伸，可以缓解紧张、提振低落的情绪、帮助疲惫的头脑安定。有些日子，这就是活动的全部理由——而这已经足够。' },
  },
];
