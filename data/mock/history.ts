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

// Ported from data-social.jsx's HISTORY, pre-merged with HISTORY_DETAILS.
export const HISTORY: HistoryItem[] = [
  {
    id: 'h1', daysAgo: 0, when: { en: 'Today', zh: '今天' }, title: { en: 'Kauri forest walk', zh: '贝壳杉森林漫步' },
    type: 'vr', min: 10, kcal: 45, intensity: 'gentle', mood: { en: 'calmer', zh: '更平静' },
    location: { en: 'Home · VR (1.5 m clear space)', zh: '居家 · VR（1.5 米空地）' }, ledBy: { en: 'Mei-Lin (voice guide)', zh: '美琳（语音引导）' }, ledByIdx: 3, withWho: [],
    notes: { en: 'You paused near the kauri grove, then kept walking. Breath stayed steady throughout.', zh: '你在贝壳杉林前停了一下，然后继续走。呼吸全程平稳。' },
  },
  {
    id: 'h2', daysAgo: 1, when: { en: 'Yesterday', zh: '昨天' }, title: { en: 'Cornwall Park slow walk', zh: '康沃尔公园慢步走' },
    type: 'outdoor', min: 40, kcal: 150, intensity: 'steady', mood: { en: 'restored', zh: '恢复了' },
    location: { en: 'Cornwall Park · rose garden', zh: '康沃尔公园 · 玫瑰园' }, ledBy: { en: 'Mei-Lin', zh: '美琳' }, ledByIdx: 3, withWho: ['Sarah', 'Elena', 'Priya'],
    notes: { en: 'A flat loop. You walked the full 40 minutes and rested twice on the benches.', zh: '平坦的环线。你走完了整整 40 分钟，在长椅上休息了两次。' },
  },
  {
    id: 'h3', daysAgo: 3, when: { en: '3 days ago', zh: '3 天前' }, title: { en: 'Shoulder & neck reset', zh: '肩颈舒缓' },
    type: 'home', min: 8, kcal: 30, intensity: 'gentle', mood: { en: 'looser', zh: '放松了' },
    location: { en: 'Living room · seated', zh: '客厅 · 坐姿' }, ledBy: { en: 'Aroha (voice guide)', zh: 'Aroha（语音引导）' }, ledByIdx: 1, withWho: [],
    notes: { en: 'Quick reset after a long screen day. Shoulders dropped noticeably by the end.', zh: '盯了一天屏幕后的快速舒缓。结束时肩膀明显放松。' },
  },
  {
    id: 'h4', daysAgo: 5, when: { en: '5 days ago', zh: '5 天前' }, title: { en: 'Harbour evening walk', zh: '海港傍晚散步' },
    type: 'outdoor', min: 35, kcal: 130, intensity: 'steady', mood: { en: 'peaceful', zh: '平静' },
    location: { en: 'Mission Bay waterfront', zh: '使命湾海滨' }, ledBy: { en: 'Self-guided', zh: '自助' }, ledByIdx: null, withWho: ['Elena'],
    notes: { en: 'Slower than your morning walks. You stopped to watch the sunset for a while.', zh: '比早晨的散步更慢。你停下来看了一会儿日落。' },
  },
  {
    id: 'h5', daysAgo: 6, when: { en: '6 days ago', zh: '6 天前' }, title: { en: 'Lakeside rhythm (VR)', zh: '湖畔律动（VR）' },
    type: 'vr', min: 12, kcal: 70, intensity: 'strong', mood: { en: 'energised', zh: '充满活力' },
    location: { en: 'Home · VR (2 m space)', zh: '居家 · VR（2 米空地）' }, ledBy: { en: 'Sun (voice guide)', zh: 'Sun（语音引导）' }, ledByIdx: 4, withWho: [],
    notes: { en: "First time at 'steady' intensity in VR. You took a 1-minute pause halfway and finished.", zh: '第一次在 VR 中尝试「平稳」强度。中途暂停了 1 分钟，最后完成了练习。' },
  },
  {
    id: 'h6', daysAgo: 9, when: { en: '9 days ago', zh: '9 天前' }, title: { en: 'Beginner badminton', zh: '初学者羽毛球' },
    type: 'social', min: 45, kcal: 220, intensity: 'strong', mood: { en: 'tired but happy', zh: '累但开心' },
    location: { en: 'Sandringham Community House', zh: '桑德灵厄姆社区中心' }, ledBy: { en: 'Community House host', zh: '社区中心主持' }, ledByIdx: null, withWho: ['Hana', 'Lien'],
    notes: { en: 'First real game. Many laughs. Knees felt it the next day — but in a good way.', zh: '第一次真正比赛。笑得很多。第二天膝盖有感觉——但是好的那种。' },
  },
  {
    id: 'h7', daysAgo: 12, when: { en: '12 days ago', zh: '12 天前' }, title: { en: 'Beach clean-up walk', zh: '海滩清洁散步' },
    type: 'outdoor', min: 50, kcal: 180, intensity: 'steady', mood: { en: 'connected', zh: '有连接感' },
    location: { en: 'Mission Bay shore', zh: '使命湾海岸' }, ledBy: { en: 'Blue Coast group', zh: '蓝海岸小组' }, ledByIdx: 2, withWho: ['Sarah', 'Priya', 'Hana'],
    notes: { en: 'Walked + tidied. Surprising how good carrying a small bag felt.', zh: '边走边清理。意外地，提一个小袋子感觉很好。' },
  },
  {
    id: 'h8', daysAgo: 18, when: { en: '18 days ago', zh: '18 天前' }, title: { en: 'Wake the upper body (VR)', zh: '唤醒上半身（VR）' },
    type: 'vr', min: 8, kcal: 35, intensity: 'gentle', mood: { en: 'awake', zh: '清醒' },
    location: { en: 'Home · seated', zh: '居家 · 坐姿' }, ledBy: { en: 'Aroha (voice guide)', zh: 'Aroha（语音引导）' }, ledByIdx: 1, withWho: [],
    notes: { en: 'Two short sessions back-to-back. Stiffness in the neck eased a lot.', zh: '连续做了两节短练习。颈部僵硬大大缓解。' },
  },
  {
    id: 'h9', daysAgo: 26, when: { en: '26 days ago', zh: '26 天前' }, title: { en: 'Sunrise park yoga', zh: '日出公园瑜伽' },
    type: 'outdoor', min: 30, kcal: 90, intensity: 'gentle', mood: { en: 'grounded', zh: '安定' },
    location: { en: 'Cornwall Park · rose garden', zh: '康沃尔公园 · 玫瑰园' }, ledBy: { en: 'Mei-Lin', zh: '美琳' }, ledByIdx: 3, withWho: ['Mei-Lin', 'Hana'],
    notes: { en: 'Cool morning air. Calmed your breath for the rest of the day.', zh: '清凉的清晨空气。整天的呼吸都比较平静。' },
  },
];

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
