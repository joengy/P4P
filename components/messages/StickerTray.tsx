import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Sticker } from '@/components/ui';
import { colors, shadows } from '@/constants/theme';
import type { AppLang } from '@/i18n';
import { STICKERS_ENCOURAGE, STICKERS_ICONIC } from '@/data/mock';
import type { PhraseSticker } from '@/components/ui/Sticker';

export function StickerTray({ lang, onPick }: { lang: AppLang; onPick: (s: string | PhraseSticker) => void }) {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'encourage' | 'icons'>('encourage');

  return (
    <View style={{ backgroundColor: colors.surface2, borderTopWidth: 1, borderTopColor: colors.line, maxHeight: 230 }}>
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingTop: 10, paddingBottom: 6 }}>
        {(['encourage', 'icons'] as const).map((id) => {
          const on = tab === id;
          return (
            <Pressable
              key={id}
              onPress={() => setTab(id)}
              style={[
                { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99, backgroundColor: on ? colors.surface : 'transparent' },
                on ? shadows.soft : null,
              ]}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: on ? colors.accent : colors.muted }}>
                {id === 'encourage' ? t('social.stickersTab') : t('social.iconsTab')}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 14, paddingBottom: 14, paddingTop: 8 }}>
        {tab === 'encourage' ? (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 9 }}>
            {STICKERS_ENCOURAGE.map((s) => (
              <Sticker key={s.id} sticker={s} lang={lang} size="sm" onPress={() => onPick(s)} />
            ))}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {STICKERS_ICONIC.map((e, i) => (
              <Pressable
                key={i}
                onPress={() => onPick(e)}
                style={{ width: '17%', aspectRatio: 1, borderRadius: 14, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.line, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 28 }}>{e}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
