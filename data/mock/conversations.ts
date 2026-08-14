import type { Conversation, ChatMessage } from './types';

// Ported from data-social.jsx's CONVERSATIONS.
export const CONVERSATIONS: Conversation[] = [
  {
    id: 'c1', name: 'Mei-Lin', kind: 'coach', idx: 3, online: true, unread: 0,
    last: { text: { en: 'See you Saturday at the rose garden 🌹', zh: '周六玫瑰园见 🌹' } },
    time: { en: '9:12', zh: '9:12' },
  },
  {
    id: 'c2', name: { en: 'Saturday Walkers', zh: '周六步行团' }, kind: 'group', idx: 1, count: 14, unread: 2,
    pinned: {
      by: 'Sarah', idx: 2, role: { en: 'Facilitator', zh: '带领者' },
      text: {
        en: '📍 Meet by the Mission Bay fountain at 9:00. Easy 40-min flat loop, slow pace, rest anytime. Bring water; family welcome. No pressure to chat — just come as you are. 💚',
        zh: '📍 9:00 在使命湾喷泉旁集合。轻松的 40 分钟平坦环线，慢节奏，随时可休息。带上水；欢迎家人。不强迫交谈——以你的样子来就好。💚',
      },
    },
    last: { text: { en: 'Lien: take it slow everyone 💚', zh: 'Lien：大家慢慢来 💚' } },
    time: { en: '8:40', zh: '8:40' },
  },
  {
    id: 'c3', name: 'Elena R.', kind: 'friend', idx: 2, online: false, unread: 0,
    last: { text: { en: 'That sunset walk was perfect', zh: '那段日落散步太完美了' } },
    time: { en: 'Yest', zh: '昨天' },
  },
  {
    id: 'c4', name: { en: 'Family 家人', zh: '家人' }, kind: 'family', idx: 4, count: 5, unread: 1,
    last: { text: { en: 'Mum: remember to drink water 记得多喝水', zh: '妈妈：记得多喝水' } },
    time: { en: 'Yest', zh: '昨天' },
  },
];

// Ported from data-social.jsx's CHATS.
export const CHATS: Record<string, ChatMessage[]> = {
  c1: [
    { from: 'them', text: { en: 'Kia ora Mei! How are your shoulders after the VR session?', zh: 'Kia ora 美！做完 VR 练习后，你的肩膀感觉如何？' }, origLang: 'en', time: '9:02' },
    { from: 'me', sticker: { id: 's4', en: 'Take it slow', zh: '慢慢来', tone: 'calm' }, time: '9:05' },
    { from: 'me', text: { en: 'Much better, thank you 谢谢', zh: '好多了，谢谢' }, origLang: 'en', time: '9:05' },
    { from: 'them', text: { en: 'Wonderful. Want to try the real kauri trail this Saturday? We walk very slowly, together.', zh: '太好了。这周六想试试真实的贝壳杉步道吗？我们会走得很慢，一起。' }, origLang: 'en', time: '9:08' },
    { from: 'them', sticker: { id: 's3', en: "Let's go together", zh: '我们一起去', tone: 'lav' }, time: '9:08' },
    { from: 'me', text: { en: 'Yes! Can I bring my sister?', zh: '好！我能带上我妹妹吗？' }, origLang: 'en', time: '9:11' },
    { from: 'them', text: { en: 'Of course — family is always welcome 🌿', zh: '当然——永远欢迎家人 🌿' }, origLang: 'en', time: '9:12' },
  ],
  c2: [
    { from: 'them', who: 'Sarah', text: { en: 'Morning all! Lovely day for our walk ☀️', zh: '大家早上好！今天很适合散步 ☀️' }, origLang: 'en', time: '8:30' },
    { from: 'them', who: 'Lien', sticker: { id: 's2', en: 'So proud of you', zh: '真为你骄傲', tone: 'calm' }, time: '8:36' },
    { from: 'them', who: 'Lien', text: { en: 'Take it slow everyone 💚', zh: '大家慢慢来 💚' }, origLang: 'zh', time: '8:40' },
    { from: 'me', sticker: { id: 's3', en: "Let's go together", zh: '我们一起去', tone: 'lav' }, time: '8:42' },
  ],
  c3: [
    { from: 'them', text: { en: 'That sunset walk was perfect', zh: '那段日落散步太完美了' }, origLang: 'en', time: 'Yest' },
    { from: 'me', sticker: '🫶', time: 'Yest' },
  ],
  c4: [
    { from: 'them', who: 'Mum', text: { en: 'Remember to drink water 记得多喝水', zh: '记得多喝水' }, origLang: 'zh', time: 'Yest' },
    { from: 'me', sticker: '🍵', time: 'Yest' },
  ],
};
