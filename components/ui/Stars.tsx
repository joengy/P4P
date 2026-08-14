import React from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/constants/theme';

type Props = { value?: number; size?: number };

export function Stars({ value = 5, size = 13 }: Props) {
  const full = Math.round(value);
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ flexDirection: 'row', gap: 1 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Text key={i} style={{ fontSize: size, color: colors.accent, opacity: i < full ? 1 : 0.22 }}>
            ★
          </Text>
        ))}
      </View>
      <Text style={{ fontSize: size, fontWeight: '700', color: colors.ink }}>{value.toFixed(1)}</Text>
    </View>
  );
}
