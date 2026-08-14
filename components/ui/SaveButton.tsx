import React from 'react';
import { Pressable } from 'react-native';
import { Icon } from './Icon';
import { colors } from '@/constants/theme';

type Props = { saved: boolean; onToggle?: () => void; size?: number };

export function SaveButton({ saved, onToggle, size = 44 }: Props) {
  return (
    <Pressable
      onPress={onToggle}
      hitSlop={8}
      accessibilityLabel="Save for later"
      style={({ pressed }) => [
        {
          width: size,
          height: size,
          borderRadius: 99,
          borderWidth: saved ? 0 : 1.5,
          borderColor: colors.line,
          backgroundColor: saved ? colors.accent : colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <Icon
        name="bookmark"
        size={Math.round(size * 0.42)}
        stroke={saved ? colors.onAccent : colors.muted}
        fill={saved ? colors.onAccent : 'none'}
        sw={2}
      />
    </Pressable>
  );
}
