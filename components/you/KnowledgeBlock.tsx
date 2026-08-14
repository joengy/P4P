import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card, Icon } from '@/components/ui';
import { colors, toneColors } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { KNOWLEDGE } from '@/data/mock';

export function KnowledgeBlock() {
  const { t } = useTranslation();
  const { lang } = useLang();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8, gap: 4 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', letterSpacing: -0.2, color: colors.ink, flexShrink: 1 }}>
          {t('profile.knowledgeTitle')}
        </Text>
        <Text
          style={{ fontSize: 11, color: colors.faint, fontWeight: '700', letterSpacing: 0.4, textTransform: 'uppercase', flexShrink: 0 }}
        >
          {t('profile.knowledgeSub')}
        </Text>
      </View>
      <View style={{ gap: 9 }}>
        {KNOWLEDGE.map((k) => {
          const tone = toneColors(k.tone);
          const isOpen = open === k.id;
          return (
            <Card key={k.id} pad={0} style={{ overflow: 'hidden' }}>
              <Pressable onPress={() => setOpen(isOpen ? null : k.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13 }}>
                <View style={{ width: 38, height: 38, borderRadius: 11, backgroundColor: tone.bg, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={k.icon as any} size={19} stroke={tone.fg} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={{ fontSize: 14.5, fontWeight: '700', lineHeight: 18, color: colors.ink }}>{L(k.title, lang)}</Text>
                  <Text style={{ fontSize: 11.5, color: colors.faint, marginTop: 1 }}>{isOpen ? t('profile.knowledgeSub') : L(k.teaser, lang)}</Text>
                </View>
                <Icon name="chev" size={17} stroke={colors.muted} style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }} />
              </Pressable>
              {isOpen && (
                <View style={{ paddingHorizontal: 14, paddingLeft: 64, paddingBottom: 15 }}>
                  <Text style={{ fontSize: 13.5, lineHeight: 20, color: colors.ink }}>{L(k.body, lang)}</Text>
                </View>
              )}
            </Card>
          );
        })}
      </View>
    </View>
  );
}
