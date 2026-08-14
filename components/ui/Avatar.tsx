import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { avatarGradients, colors } from '@/constants/theme';

type Props = {
  name?: string;
  size?: number;
  idx?: number;
  ring?: boolean;
};

export function Avatar({ name = '?', size = 38, idx = 0, ring }: Props) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');
  const [c1, c2] = avatarGradients[idx % avatarGradients.length];
  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          overflow: 'hidden',
        },
        ring ? { borderWidth: 2.5, borderColor: colors.surface } : null,
      ]}
    >
      <LinearGradient
        colors={[c1, c2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: size * 0.36, letterSpacing: 0.2 }}>{initials}</Text>
    </View>
  );
}
