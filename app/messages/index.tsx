import React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Icon, Avatar, Tag } from '@/components/ui';
import { colors, fonts, type Tone } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useConversations } from '@/data/queries';
import type { Conversation } from '@/data/mock';

function kindTagFor(kind: Conversation['kind']): { key: string; tone: Tone } | null {
  if (kind === 'coach') return { key: 'social.coachTag', tone: 'calm' };
  if (kind === 'family') return { key: 'social.familyTag', tone: 'accent' };
  if (kind === 'group') return { key: 'social.groupTag', tone: 'lav' };
  return null;
}

function ConversationRow({ conv, onPress }: { conv: Conversation; onPress: () => void }) {
  const { t } = useTranslation();
  const { lang } = useLang();
  const tag = kindTagFor(conv.kind);
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingHorizontal: 8, borderRadius: 14 }}>
      <View>
        <Avatar name={L(conv.name, lang)} size={50} idx={conv.idx} />
        {conv.online && (
          <View style={{ position: 'absolute', right: 1, bottom: 1, width: 13, height: 13, borderRadius: 99, backgroundColor: colors.calm, borderWidth: 2.5, borderColor: colors.bg }} />
        )}
      </View>
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 2 }}>
          <Text style={{ fontWeight: '700', fontSize: 15, color: colors.ink }}>{L(conv.name, lang)}</Text>
          {conv.count && (
            <Text style={{ fontSize: 11.5, color: colors.faint }}>
              · {conv.count} {t('social.members')}
            </Text>
          )}
          {tag && <Tag tone={tag.tone}>{t(tag.key)}</Tag>}
        </View>
        <Text numberOfLines={1} style={{ fontSize: 13, color: colors.muted }}>
          {L(conv.last.text, lang)}
        </Text>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 5 }}>
        <Text style={{ fontSize: 11, color: colors.faint }}>{L(conv.time, lang)}</Text>
        {conv.unread > 0 && (
          <View style={{ minWidth: 19, height: 19, paddingHorizontal: 5, borderRadius: 99, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: colors.onAccent, fontSize: 11, fontWeight: '800' }}>{conv.unread}</Text>
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data: conversations } = useConversations();

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
        <Pressable
          onPress={() => router.back()}
          style={{ width: 38, height: 38, borderRadius: 99, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="x" size={19} stroke={colors.ink} />
        </Pressable>
        <Text style={{ flex: 1, fontFamily: fonts.display, fontSize: 21, fontWeight: '600', color: colors.ink }}>{t('social.messages')}</Text>
        <View style={{ width: 38, height: 38, borderRadius: 99, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="plus" size={19} stroke={colors.onAccent} sw={2.2} />
        </View>
      </View>

      <FlatList
        data={conversations ?? []}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 14, paddingTop: 12 }}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 9,
              backgroundColor: colors.surface,
              borderRadius: 999,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderWidth: 1,
              borderColor: colors.line,
              marginBottom: 14,
            }}
          >
            <Icon name="spark" size={17} stroke={colors.faint} />
            <Text style={{ fontSize: 13.5, color: colors.faint }}>{t('social.searchPh')}</Text>
          </View>
        }
        renderItem={({ item }) => <ConversationRow conv={item} onPress={() => router.push(`/messages/${item.id}`)} />}
      />
    </View>
  );
}
