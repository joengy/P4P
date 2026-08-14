import React from 'react';
import { View } from 'react-native';
import { toneColors, colors, type Tone } from '@/constants/theme';

type Props = { pct: number; tone?: Tone; h?: number };

export function Bar({ pct, tone = 'calm', h = 7 }: Props) {
  const t = toneColors(tone);
  return (
    <View style={{ height: h, borderRadius: 99, backgroundColor: colors.surface3, overflow: 'hidden' }}>
      <View style={{ width: `${pct}%`, height: '100%', borderRadius: 99, backgroundColor: t.solid }} />
    </View>
  );
}
