import React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { toneColors, radii, type Tone } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  icon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function Tag({ children, tone = 'neutral', icon, style }: Props) {
  const t = toneColors(tone);
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          backgroundColor: t.bg,
          paddingHorizontal: 9,
          paddingVertical: 4,
          borderRadius: radii.pill,
        },
        style,
      ]}
    >
      {icon}
      <Text style={{ color: t.fg, fontSize: 11.5, fontWeight: '700', letterSpacing: 0.1 }}>{children}</Text>
    </View>
  );
}
