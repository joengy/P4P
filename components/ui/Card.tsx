import React from 'react';
import { Pressable, View, ViewStyle, StyleProp } from 'react-native';
import { colors, radii, shadows } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  pad?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  soft?: boolean;
};

export function Card({ children, pad = 16, style, onPress, soft }: Props) {
  const base: ViewStyle = {
    backgroundColor: soft ? colors.surface2 : colors.surface,
    borderRadius: radii.card,
    padding: pad,
    ...(soft ? null : shadows.card),
  };
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [base, style, pressed && { transform: [{ scale: 0.97 }] }]}
      >
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}
