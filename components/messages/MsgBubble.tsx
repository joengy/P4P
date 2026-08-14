import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Avatar, Sticker, Icon } from '@/components/ui';
import { colors } from '@/constants/theme';
import { L } from '@/lib/L';
import type { AppLang } from '@/i18n';
import type { ChatMessage } from '@/data/mock';

export function MsgBubble({ m, lang, isGroup }: { m: ChatMessage; lang: AppLang; isGroup: boolean }) {
  const { t } = useTranslation();
  const mine = m.from === 'me';
  const [showLang, setShowLang] = useState<AppLang>(m.origLang ?? lang);
  const canTranslate = !!m.text && !mine && !!m.origLang;
  const isTr = showLang !== m.origLang;

  if (m.sticker) {
    return (
      <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
        {!mine && <Avatar name={m.who || 'F'} size={28} idx={3} />}
        <View style={{ alignItems: mine ? 'flex-end' : 'flex-start', gap: 3 }}>
          {!mine && isGroup && m.who && <Text style={{ fontSize: 11, color: colors.faint, fontWeight: '600', marginLeft: 4 }}>{m.who}</Text>}
          <Sticker sticker={m.sticker} lang={lang} size={typeof m.sticker === 'string' ? 'lg' : 'md'} />
          <Text style={{ fontSize: 10, color: colors.faint }}>{m.time}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
      {!mine && <Avatar name={m.who || 'F'} size={28} idx={3} />}
      <View style={{ maxWidth: '74%', alignItems: mine ? 'flex-end' : 'flex-start', gap: 3 }}>
        {!mine && isGroup && m.who && <Text style={{ fontSize: 11, color: colors.faint, fontWeight: '600', marginLeft: 4 }}>{m.who}</Text>}
        <View
          style={{
            backgroundColor: mine ? colors.accent : colors.surface,
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 18,
            borderBottomRightRadius: mine ? 5 : 18,
            borderBottomLeftRadius: mine ? 18 : 5,
            borderWidth: mine ? 0 : 1,
            borderColor: colors.line,
          }}
        >
          <Text style={{ fontSize: 14, lineHeight: 20, color: mine ? colors.onAccent : colors.ink }}>{L(m.text, showLang)}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
          <Text style={{ fontSize: 10, color: colors.faint }}>{m.time}</Text>
          {canTranslate && (
            <Pressable
              onPress={() => setShowLang(isTr ? m.origLang! : m.origLang === 'en' ? 'zh' : 'en')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}
            >
              <Icon name="wave" size={12} stroke={colors.lavInk} />
              <Text style={{ fontSize: 10.5, fontWeight: '700', color: colors.lavInk }}>{isTr ? t('social.showOriginal') : t('social.translate')}</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
