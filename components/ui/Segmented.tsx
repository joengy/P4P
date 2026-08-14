import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { colors, radii, shadows } from '@/constants/theme';

type Option = { id: string; label: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (id: string) => void;
};

export function Segmented({ options, value, onChange }: Props) {
  return (
    <View style={{ flexDirection: 'row', backgroundColor: colors.surface2, borderRadius: radii.pill, padding: 3, gap: 2 }}>
      {options.map((o) => {
        const on = value === o.id;
        return (
          <Pressable
            key={o.id}
            onPress={() => onChange(o.id)}
            style={[
              {
                flex: 1,
                minHeight: 40,
                paddingVertical: 8,
                paddingHorizontal: 6,
                borderRadius: radii.pill,
                backgroundColor: on ? colors.surface : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              },
              on ? shadows.soft : null,
            ]}
          >
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: on ? colors.accent : colors.muted, textAlign: 'center' }}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
