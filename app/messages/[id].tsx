import React, { useRef, useState } from 'react';
import { View, Text, Pressable, TextInput, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Icon, Avatar } from '@/components/ui';
import { colors } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useConversation } from '@/data/queries';
import { CHATS } from '@/data/mock';
import type { ChatMessage } from '@/data/mock';
import { MsgBubble } from '@/components/messages/MsgBubble';
import { StickerTray } from '@/components/messages/StickerTray';
import type { PhraseSticker } from '@/components/ui/Sticker';

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: conv } = useConversation(id);
  const [msgs, setMsgs] = useState<ChatMessage[]>(() => CHATS[id] ?? []);
  const [tray, setTray] = useState(false);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const isGroup = conv?.kind === 'group' || conv?.kind === 'family';

  const send = (payload: Partial<ChatMessage>) => {
    setMsgs((m) => [...m, { from: 'me', time: 'now', ...payload }]);
    setDraft('');
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  if (!conv) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24, paddingTop: insets.top + 24 }}>
        <Text>Not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingBottom: 12,
          paddingHorizontal: 12,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.line,
        }}
      >
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="chev" size={19} stroke={colors.ink} style={{ transform: [{ rotate: '180deg' }] }} />
        </Pressable>
        <Avatar name={L(conv.name, lang)} size={38} idx={conv.idx} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: colors.ink }}>{L(conv.name, lang)}</Text>
          <Text style={{ fontSize: 11.5, color: conv.online ? colors.calmInk : colors.faint }}>
            {isGroup ? `${conv.count} ${t('social.members')}` : conv.online ? t('social.online') : t('social.coachTag')}
          </Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {conv.pinned && (
        <View style={{ padding: 14, backgroundColor: colors.calmSoft, borderBottomWidth: 1, borderBottomColor: colors.line }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 6 }}>
            <Icon name="pin" size={13} stroke={colors.calmInk} />
            <Text style={{ fontSize: 10.5, fontWeight: '800', color: colors.calmInk, letterSpacing: 0.5, textTransform: 'uppercase' }}>
              {t('plan.pinnedWelcome')} · {conv.pinned.by}
            </Text>
          </View>
          <Text style={{ fontSize: 12.5, lineHeight: 19, color: colors.ink }}>{L(conv.pinned.text, lang)}</Text>
        </View>
      )}

      <ScrollView ref={scrollRef} contentContainerStyle={{ padding: 14, gap: 12 }} style={{ flex: 1 }}>
        {msgs.map((m, i) => (
          <MsgBubble key={i} m={m} lang={lang} isGroup={!!isGroup} />
        ))}
      </ScrollView>

      {tray && (
        <StickerTray
          lang={lang}
          onPick={(s: string | PhraseSticker) => {
            send({ sticker: s });
            setTray(false);
          }}
        />
      )}

      <View
        style={{
          paddingHorizontal: 12,
          paddingTop: 10,
          paddingBottom: insets.bottom + 12,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.line,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 9,
        }}
      >
        <Pressable
          onPress={() => setTray((v) => !v)}
          style={{ width: 40, height: 40, borderRadius: 99, backgroundColor: tray ? colors.accentSoft : colors.surface2, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="spark" size={20} stroke={tray ? colors.accent : colors.muted} />
        </Pressable>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.surface2, borderRadius: 999, paddingHorizontal: 14, paddingVertical: 9 }}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder={t('social.typeMsg')}
            placeholderTextColor={colors.faint}
            style={{ flex: 1, fontSize: 14, color: colors.ink }}
            onSubmitEditing={() => draft.trim() && send({ text: { en: draft, zh: draft }, origLang: lang })}
          />
          <Icon name="mic" size={19} stroke={colors.faint} />
        </View>
        <Pressable
          onPress={() => draft.trim() && send({ text: { en: draft, zh: draft }, origLang: lang })}
          style={{ width: 40, height: 40, borderRadius: 99, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="arrow" size={19} stroke={colors.onAccent} sw={2.2} />
        </Pressable>
      </View>
    </View>
  );
}
