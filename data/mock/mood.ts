import type { MoodOption, MoodEnergy } from './types';
import type { Bilingual } from '@/lib/L';

// Ported from data.jsx's MOODS + moodSuggestion().
export const MOODS: MoodOption[] = [
  { id: 'tired', label: { en: 'Tired', zh: '疲惫' }, tone: 'lav' },
  { id: 'calm', label: { en: 'Calm', zh: '平静' }, tone: 'calm' },
  { id: 'motivated', label: { en: 'Motivated', zh: '有动力' }, tone: 'accent' },
  { id: 'sore', label: { en: 'Sore', zh: '酸痛' }, tone: 'calm' },
  { id: 'anxious', label: { en: 'Anxious', zh: '焦虑' }, tone: 'lav' },
];

export type MoodSuggestion = { title: Bilingual; body: Bilingual; kind: 'vr' | 'home' | 'outdoor' };

export function moodSuggestion(energy: MoodEnergy, mood: string): MoodSuggestion {
  if (energy === 'low' || mood === 'tired' || mood === 'anxious') {
    return {
      title: { en: 'A 10-min VR forest walk', zh: '10 分钟 VR 森林漫步' },
      body: { en: 'Low pressure, private, indoors. Just enough to feel your body wake up.', zh: '低压力、私密、在室内。刚好够让身体慢慢醒来。' },
      kind: 'vr',
    };
  }
  if (mood === 'sore') {
    return {
      title: { en: 'Gentle shoulder & neck reset', zh: '温和的肩颈舒缓' },
      body: { en: '8 minutes of slow mobility. Be kind to a tired body.', zh: '8 分钟的慢速活动。善待疲惫的身体。' },
      kind: 'home',
    };
  }
  return {
    title: { en: 'A slow group walk nearby', zh: '附近的一次慢步走' },
    body: { en: 'Mei-Lin leads one this afternoon. Bring a friend if you like.', zh: '美琳今天下午带一场。愿意的话叫上一位朋友。' },
    kind: 'outdoor',
  };
}
