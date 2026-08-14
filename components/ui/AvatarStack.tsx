import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar } from './Avatar';
import { colors } from '@/constants/theme';

type Props = {
  names?: string[];
  extra?: number;
  size?: number;
};

export function AvatarStack({ names = [], extra = 0, size = 26 }: Props) {
  return (
    <View style={styles.row}>
      {names.map((n, i) => (
        <View key={i} style={{ marginLeft: i ? -9 : 0, borderRadius: size / 2 }}>
          <Avatar name={n} size={size} idx={i + 1} />
        </View>
      ))}
      {extra > 0 && (
        <View
          style={[
            styles.extra,
            { marginLeft: -9, width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={{ color: colors.muted, fontSize: size * 0.34, fontWeight: '700' }}>+{extra}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  extra: {
    backgroundColor: colors.surface2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
