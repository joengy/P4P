import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Photo, Icon } from '@/components/ui';
import { colors } from '@/constants/theme';

export function EntryPromptCard() {
  const { t } = useTranslation();
  return (
    <Card pad={0} style={{ overflow: 'hidden' }}>
      <Photo kind="sky" height={110} round={0}>
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            width: 30,
            height: 30,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,.85)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="rain" size={16} stroke={colors.lavInk} />
        </View>
      </Photo>
      <View style={{ padding: 16, gap: 6 }}>
        <Text style={{ fontSize: 15.5, fontWeight: '700', color: colors.ink }}>{t('move.entryPrompt')}</Text>
        <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 19 }}>{t('move.entryPromptSub')}</Text>
      </View>
    </Card>
  );
}
