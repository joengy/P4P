import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { photoGradients, radii } from '@/constants/theme';

type Props = {
  kind?: keyof typeof photoGradients | string;
  height?: number;
  label?: string;
  round?: number;
  style?: any;
  children?: React.ReactNode;
};

// Gradient placeholder standing in for real trail/activity photography
// (ported from components.jsx's Photo + PHOTO_GRAD). Once Supabase Storage
// has a real photo_url for an activity, swap this for an <Image>.
export function Photo({ kind = 'forest', height = 150, label, round = radii.sm, style, children }: Props) {
  const g = photoGradients[kind] ?? photoGradients.forest;
  return (
    <View style={[{ width: '100%', height, borderRadius: round, overflow: 'hidden' }, style]}>
      <LinearGradient
        colors={g}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.7, y: 1 }}
        style={{ position: 'absolute', inset: 0 }}
      />
      {label ? (
        <View style={{ position: 'absolute', left: 10, bottom: 9, backgroundColor: 'rgba(20,18,16,.28)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
          <Text style={{ fontSize: 10, letterSpacing: 0.4, color: 'rgba(255,255,255,.92)' }}>{label}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}
