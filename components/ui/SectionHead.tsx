import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, fonts } from '@/constants/theme';

type Props = {
  children: React.ReactNode;
  action?: string;
  onAction?: () => void;
};

export function SectionHead({ children, action, onAction }: Props) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 }}>
      <Text style={{ fontFamily: fonts.displayMedium, fontSize: 18, fontWeight: '600', letterSpacing: -0.2, color: colors.ink }}>
        {children}
      </Text>
      {action ? (
        <Pressable onPress={onAction}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent }}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}
