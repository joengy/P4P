import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Card, Icon, Btn } from '@/components/ui';
import { colors } from '@/constants/theme';

export function WhenHardCard() {
  const { t } = useTranslation();
  const router = useRouter();
  return (
    <Card style={{ gap: 12, backgroundColor: colors.lavSoft }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="rain" size={18} stroke={colors.lavInk} />
        </View>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: colors.lavInk }}>{t('home.feelsHard')}</Text>
      </View>
      <Text style={{ fontSize: 13, color: colors.ink, lineHeight: 19 }}>{t('home.feelsHardSub')}</Text>
      <Btn tone="lav" onPress={() => router.push('/(tabs)/move')}>
        {t('home.tryVr')}
      </Btn>
    </Card>
  );
}
