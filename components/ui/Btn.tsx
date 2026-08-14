import React from 'react';
import { Pressable, Text, StyleProp, ViewStyle } from 'react-native';
import { toneColors, radii, colors, type Tone } from '@/constants/theme';

type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: React.ReactNode;
  tone?: Tone;
  size?: Size;
  full?: boolean;
  icon?: React.ReactNode;
  onPress?: () => void;
  ghost?: boolean;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

const pads: Record<Size, { h: number; v: number }> = {
  sm: { h: 14, v: 8 },
  md: { h: 18, v: 12 },
  lg: { h: 22, v: 15 },
};
const fss: Record<Size, number> = { sm: 13, md: 14.5, lg: 16 };

export function Btn({ children, tone = 'accent', size = 'md', full, icon, onPress, ghost, style, disabled }: Props) {
  const t = toneColors(tone);
  const pad = pads[size];
  const textColor = ghost ? t.solid : tone === 'accent' ? colors.onAccent : '#fff';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          backgroundColor: ghost ? 'transparent' : t.solid,
          borderWidth: ghost ? 1.5 : 0,
          borderColor: colors.line,
          paddingHorizontal: pad.h,
          paddingVertical: pad.v,
          borderRadius: radii.pill,
          width: full ? '100%' : undefined,
          opacity: disabled ? 0.5 : pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        style,
      ]}
    >
      {icon}
      <Text style={{ color: textColor, fontWeight: '700', fontSize: fss[size] }}>{children}</Text>
    </Pressable>
  );
}
