import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Icon, Btn } from '@/components/ui';
import { colors, toneColors } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { pickYouTip } from '@/data/mock';
import { useHistory } from '@/data/queries';

export function TipsBlock() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: history = [] } = useHistory();
  const items = history.filter((h) => h.daysAgo <= 30);
  const tip = pickYouTip(items);
  const tone = toneColors(tip.kindTone);

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, gap: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', letterSpacing: -0.2, color: colors.ink, flexShrink: 1 }}>
          {t('profile.bodyLearning')}
        </Text>
        <Text
          style={{ fontSize: 11, color: colors.faint, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', flexShrink: 0 }}
        >
          {t('profile.basedOnRecent')}
        </Text>
      </View>
      <Card pad={16}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9, marginBottom: 9 }}>
          <View style={{ width: 36, height: 36, borderRadius: 11, backgroundColor: tone.bg, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={tip.icon as any} size={18} stroke={tone.fg} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: tone.fg, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {t('profile.gentleTips')}
            </Text>
            <Text style={{ fontSize: 18, fontWeight: '600', lineHeight: 22, color: colors.ink }}>{L(tip.title, lang)}</Text>
          </View>
        </View>
        <Text style={{ fontSize: 13.5, color: colors.muted, lineHeight: 20, marginBottom: 13 }}>{L(tip.body, lang)}</Text>
        <Btn size="sm" tone={tip.kindTone} icon={<Icon name="arrow" size={14} stroke="#fff" />}>
          {L(tip.cta, lang)}
        </Btn>
      </Card>
    </View>
  );
}
