import type { HomeRec, CheckInBody, CheckInPlace, CheckInMood, CheckInSocial } from './types';

// Ported from data.jsx's HOME_REC_LIBRARY (+ the Object.assign enrichments
// for rating/reviewsCount/comfort/dur/comments).
export const HOME_REC_LIBRARY: Record<string, HomeRec> = {
  r1: {
    id: 'r1',
    kind: 'group',
    invite: { en: 'A slow, friendly walk this afternoon', zh: '今天下午有一段慢步走' },
    sub: { en: 'Cornwall Park · 40 min · plenty of benches', zh: '康沃尔公园 · 40 分钟 · 沿途多长椅' },
    photo: 'park',
    why: { en: 'Flat ground, group pace, and a guide who speaks both your languages.', zh: '平坦的路面、集体节奏，向导会说你的两种语言。' },
    trust: ['communityLed', 'beginner', 'lowCost'],
    org: { name: { en: 'Auckland Women Walk', zh: '奥克兰女性步行会' }, initials: 'AW' },
    guide: { name: 'Mei-Lin', bilingual: true, idx: 3 },
    peer: {
      triedBy: 12,
      safe: 96,
      welcoming: 94,
      useful: 90,
      quote: { en: 'I finally felt safe to start moving again.', zh: '我终于敢重新开始活动了。' },
      by: { en: 'Hana · 3 months in', zh: 'Hana · 加入 3 个月' },
    },
    cta: 'rsvp',
    detail: { time: '9:00 AM Sat', location: 'Cornwall Park rose garden', cost: 'Free', language: 'EN / 中', intensity: 'Gentle', bring: 'Comfortable shoes, water' },
    rating: 4.9,
    reviewsCount: 38,
    groupChatId: 'c2',
    comfort: ['beginner', 'friendWelcome', 'women', 'seated'],
    dur: { en: '40 min', zh: '40 分钟' },
    comments: [
      { name: 'Hana', idx: 1, when: { en: '3 days ago', zh: '3 天前' }, text: { en: 'I finally felt safe to start moving again. The pace was very kind.', zh: '我终于敢重新开始活动了。节奏很温柔。' } },
      { name: 'Priya', idx: 2, when: { en: 'last week', zh: '上周' }, text: { en: 'Met two other Mums. We walked, chatted, and rested when we needed to.', zh: '认识了两位妈妈——一边走一边聊，累了就休息。' } },
      { name: 'Wei', idx: 4, when: { en: '2 weeks ago', zh: '2 周前' }, text: { en: 'Mei-Lin explained everything in Mandarin too. So welcoming for newcomers.', zh: '美琳还会用普通话讲解，对新人非常友善。' } },
    ],
  },
  r2: {
    id: 'r2',
    kind: 'home',
    invite: { en: 'A 10-minute shoulder & neck reset', zh: '10 分钟肩颈舒缓' },
    sub: { en: 'In your living room · seated or standing', zh: '在你的客厅 · 站姿或坐姿' },
    photo: 'home',
    why: { en: 'Releases the tightness from carrying, caring, and screen time.', zh: '缓解照顾家人、久坐与屏幕带来的肩颈紧绷。' },
    trust: ['professional', 'beginner', 'stopAnytime'],
    org: { name: { en: 'Hoa VR studio', zh: 'Hoa VR 工作室' }, initials: 'VR' },
    peer: { triedBy: 42, safe: 98, welcoming: 90, useful: 92 },
    cta: 'start',
    detail: { time: 'Anytime', location: 'Home', cost: 'Free', language: 'EN / 中', intensity: 'Very gentle', bring: 'A chair, water' },
    rating: 4.8,
    reviewsCount: 31,
    comfort: ['beginner', 'stopAnytime', 'seated'],
    dur: { en: '10 min', zh: '10 分钟' },
    comments: [
      { name: 'Lien', idx: 1, when: { en: '2 days ago', zh: '2 天前' }, text: { en: 'Did this from my couch after work. Shoulders much looser after.', zh: '下班后在沙发上跟着做。结束时肩膀松了很多。' } },
      { name: 'Elena', idx: 2, when: { en: 'last week', zh: '上周' }, text: { en: 'Calm voice. No pressure to do every movement — just what felt right.', zh: '声音很平和。没有强迫做完每个动作——只做让自己舒服的。' } },
    ],
  },
  r3: {
    id: 'r3',
    kind: 'vr',
    invite: { en: 'A 10-min VR walk through kauri forest', zh: '10 分钟 VR 贝壳杉森林漫步' },
    sub: { en: 'Indoors, private, headset on', zh: '室内、私密、戴上头显' },
    photo: 'forest-vr',
    why: { en: 'A soft warm-up for body and mood — and a bridge to a real trail nearby.', zh: '温和地唤醒身体与心情——也是通往附近真实步道的桥梁。' },
    trust: ['professional', 'beginner', 'stopAnytime'],
    org: { name: { en: 'Hoa VR', zh: 'Hoa VR' }, initials: 'VR' },
    peer: { triedBy: 84, safe: 96, welcoming: 88, useful: 88 },
    cta: 'startVR',
    detail: { time: 'Anytime', location: 'Home · 1.5m space', cost: 'Free', language: 'EN / 中', intensity: 'Gentle', bring: 'Headset, water' },
    rating: 4.8,
    reviewsCount: 84,
    comfort: ['beginner', 'stopAnytime', 'quiet'],
    dur: { en: '10 min', zh: '10 分钟' },
    comments: [
      { name: 'Hana', idx: 1, when: { en: '4 days ago', zh: '4 天前' }, text: { en: 'It felt like a real walk. I forgot I had the headset on.', zh: '感觉就像真的在散步。一会儿就忘了头显戴着。' } },
      { name: 'Sarah', idx: 2, when: { en: 'last week', zh: '上周' }, text: { en: 'Booked the real Cornwall Park walk after this. It made me brave.', zh: '体验完之后我报名了真正的康沃尔公园散步。它让我有了勇气。' } },
      { name: 'Priya', idx: 4, when: { en: '2 weeks ago', zh: '2 周前' }, text: { en: 'I paused once to look around. The kauri trees are stunning.', zh: '我中途停下来看了一会儿。贝壳杉真的很美。' } },
    ],
  },
  r4: {
    id: 'r4',
    kind: 'library',
    invite: { en: 'Quiet library stretch circle', zh: '安静的图书馆拉伸小圈' },
    sub: { en: 'Mt Roskill Library · Wed 11 AM · 30 min', zh: '罗斯希尔图书馆 · 周三上午 11:00 · 30 分钟' },
    photo: 'home',
    why: { en: 'A calm, dry, indoor space when the weather or noise feels too much.', zh: '当天气或喧嚣令人疲惫时，一个安静、干燥、室内的空间。' },
    trust: ['communityLed', 'beginner', 'lowCost'],
    org: { name: { en: 'Auckland Libraries Wellbeing', zh: '奥克兰图书馆健康项目' }, initials: 'LB' },
    guide: { name: 'Priya', bilingual: false, idx: 2 },
    peer: { triedBy: 9, safe: 94, welcoming: 100, useful: 86 },
    cta: 'addPlan',
    detail: { time: 'Wed 11:00 AM', location: 'Mt Roskill Library', cost: 'Free', language: 'EN only', intensity: 'Gentle', bring: 'Yourself' },
    rating: 4.7,
    reviewsCount: 18,
    groupChatId: 'c2',
    comfort: ['beginner', 'noBooking', 'friendWelcome', 'quiet'],
    dur: { en: '30 min', zh: '30 分钟' },
    comments: [
      { name: 'Wei', idx: 4, when: { en: '3 days ago', zh: '3 天前' }, text: { en: 'Quiet space, no music. My back loved it.', zh: '空间安静，没有音乐。背部很喜欢。' } },
      { name: 'Priya', idx: 2, when: { en: '2 weeks ago', zh: '2 周前' }, text: { en: 'Easy parking. I came back the next week with my daughter.', zh: '停车方便。第二周我带女儿一起来了。' } },
    ],
  },
  r5: {
    id: 'r5',
    kind: 'outdoor',
    invite: { en: 'A quiet self-guided shore walk', zh: '一段安静的自助海岸散步' },
    sub: { en: 'Mission Bay · 2.4 km flat loop · at your own pace', zh: '使命湾 · 2.4 公里平坦环线 · 按自己的节奏' },
    photo: 'beach',
    why: { en: 'Flat, well-lit, and yours to pace — no group, no pressure to talk.', zh: '平坦、灯光充足、完全按你的节奏——没有小组，没有交谈压力。' },
    trust: ['lowCost', 'stopAnytime'],
    org: null,
    peer: { triedBy: 12, safe: 95, welcoming: 88, useful: 84 },
    cta: 'saveRoute',
    detail: { time: 'Anytime', location: 'Mission Bay waterfront', cost: 'Free', language: '—', intensity: 'Gentle', bring: 'Water, comfortable shoes' },
    rating: 4.6,
    reviewsCount: 12,
    comfort: ['stopAnytime'],
    dur: { en: '35 min', zh: '35 分钟' },
    comments: [],
  },
};

// pickHomeRec — ported 1:1 from data.jsx's rules-table recommendation engine.
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
