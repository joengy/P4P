import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { colors, radii } from '@/constants/theme';

export function TextField(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={colors.faint}
      style={[
        {
          borderWidth: 1,
          borderColor: colors.line,
          borderRadius: radii.sm,
          backgroundColor: colors.surface2,
          paddingHorizontal: 14,
          paddingVertical: 13,
          fontSize: 14.5,
          color: colors.ink,
        },
        props.style,
      ]}
      {...props}
    />
  );
}
