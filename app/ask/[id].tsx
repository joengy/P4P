import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Icon, Btn, Avatar } from '@/components/ui';
import { colors, fonts, radii } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useCircleIdea } from '@/data/queries';

export default function AskSheetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: idea, isLoading: loading } = useCircleIdea(id);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState(false);

  const onClose = () => router.back();

  const prompts =
    lang === 'zh'
      ? ['是初学者友好的吗？', '大概会走多久？', '可以带朋友吗？']
      : ['Is it beginner-friendly?', 'How long will it take?', 'Can I bring a friend?'];

  if (!idea) {
    return (
      <Sheet onClose={onClose} snapPoints={['50%']}>
        <View style={{ padding: 24 }}>
          {!loading && <Text>Not found</Text>}
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose} snapPoints={['55%']}>
      <View style={{ paddingHorizontal: 20 }}>
        {!sent ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 11, marginBottom: 14 }}>
              <Avatar name={L(idea.who, lang)} size={40} idx={idea.idx} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.ink }}>
                  {t('plan.askQ')} · {L(idea.who, lang)}
                </Text>
                <Text style={{ fontSize: 11.5, color: colors.faint }}>{L(idea.relation, lang)}</Text>
              </View>
              <Pressable onPress={onClose} style={{ width: 32, height: 32, borderRadius: 99, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="x" size={17} stroke={colors.muted} />
              </Pressable>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 12 }}>
              {prompts.map((p, i) => (
                <Pressable
                  key={i}
                  onPress={() => setDraft(p)}
                  style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill, backgroundColor: colors.surface2, borderWidth: 1, borderColor: colors.line }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '700', color: colors.muted }}>{p}</Text>
                </Pressable>
              ))}
            </View>

            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={t('plan.askPlaceholder')}
              placeholderTextColor={colors.faint}
              multiline
              numberOfLines={3}
              style={{
                borderWidth: 1,
                borderColor: colors.line,
                borderRadius: 14,
                backgroundColor: colors.surface2,
                padding: 14,
                fontSize: 14,
                color: colors.ink,
                marginBottom: 14,
                minHeight: 76,
                textAlignVertical: 'top',
              }}
            />

            <Btn
              full
              size="lg"
              onPress={() => draft.trim() && setSent(true)}
              disabled={!draft.trim()}
              icon={<Icon name="send" size={16} stroke={colors.onAccent} sw={2} />}
            >
              {t('common.send')}
            </Btn>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 14 }}>
            <View style={{ width: 58, height: 58, borderRadius: 99, backgroundColor: colors.calmSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="check" size={27} stroke={colors.calmInk} sw={2.4} />
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: '600', marginBottom: 6, color: colors.ink }}>
              {lang === 'zh' ? '已发送' : 'Sent'}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, lineHeight: 19, textAlign: 'center', marginBottom: 18 }}>
              {L(idea.who, lang)} {lang === 'zh' ? '会私下回复你——没有加入的压力。' : 'will reply privately — no pressure to join.'}
            </Text>
            <Btn full size="md" tone="calm" ghost onPress={onClose}>
              {t('common.done')}
            </Btn>
          </View>
        )}
      </View>
    </Sheet>
  );
}
