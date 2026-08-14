import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Icon, Btn, Avatar } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useConversations } from '@/data/queries';
import { HOME_REC_LIBRARY, DISCOVER_ITEMS, VR_SESSIONS } from '@/data/mock';

function titleForShareId(id: string) {
  if (HOME_REC_LIBRARY[id]) return HOME_REC_LIBRARY[id].invite;
  const vr = VR_SESSIONS.find((v) => v.id === id);
  if (vr) return vr.title;
  const disc = DISCOVER_ITEMS.find((d) => d.id === id);
  if (disc) return disc.title;
  return { en: '', zh: '' };
}

export default function ShareSheetScreen() {
  const { id, invite } = useLocalSearchParams<{ id: string; invite?: string }>();
  const inviteMode = invite === '1';
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const { data: conversations } = useConversations();
  const [picks, setPicks] = useState<Record<string, boolean>>({});
  const [sent, setSent] = useState(false);

  const onClose = () => router.back();
  const title = titleForShareId(id);
  const friends = (conversations ?? []).filter((c) => c.kind !== 'coach');
  const count = Object.values(picks).filter(Boolean).length;
  const toggle = (cid: string) => setPicks((p) => ({ ...p, [cid]: !p[cid] }));

  return (
    <Sheet onClose={onClose} snapPoints={['62%']}>
      <View style={{ paddingHorizontal: 20 }}>
        {!sent ? (
          <>
            <View style={{ marginBottom: 13 }}>
              <Text style={{ fontSize: 11, fontWeight: '800', color: colors.accent, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 }}>
                {inviteMode ? t('social.inviteFriendLong') : t('social.shareWithLong')}
              </Text>
              <Text style={{ fontFamily: fonts.display, fontSize: 17, fontWeight: '600', lineHeight: 22, color: colors.ink }}>{L(title, lang)}</Text>
            </View>

            <View style={{ gap: 4, marginBottom: 14 }}>
              {friends.map((c) => {
                const on = !!picks[c.id];
                const nm = L(c.name, lang);
                return (
                  <Pressable
                    key={c.id}
                    onPress={() => toggle(c.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      paddingVertical: 9,
                      paddingHorizontal: 8,
                      borderRadius: 14,
                      backgroundColor: on ? colors.accentSoft : 'transparent',
                    }}
                  >
                    <Avatar name={nm} size={40} idx={c.idx} />
                    <View style={{ flex: 1, minWidth: 0 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>{nm}</Text>
                      <Text style={{ fontSize: 11.5, color: colors.faint }}>
                        {c.kind === 'group' || c.kind === 'family' ? `${c.count ?? ''} ${t('social.members')}` : c.online ? t('social.online') : ''}
                      </Text>
                    </View>
                    <View
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 99,
                        borderWidth: on ? 0 : 1.5,
                        borderColor: colors.line,
                        backgroundColor: on ? colors.accent : 'transparent',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {on && <Icon name="check" size={14} stroke={colors.onAccent} sw={2.6} />}
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Btn
              full
              size="lg"
              onPress={() => count && setSent(true)}
              disabled={!count}
              icon={<Icon name={inviteMode ? 'people' : 'send'} size={16} stroke={colors.onAccent} sw={2} />}
            >
              {inviteMode ? t('social.sendInvite') : t('social.sendShare')}
              {count > 0 ? ` · ${count}` : ''}
            </Btn>
            <Pressable onPress={onClose} style={{ alignSelf: 'center', marginTop: 12 }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.faint }}>{t('common.cancel')}</Text>
            </Pressable>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 18 }}>
            <View style={{ width: 60, height: 60, borderRadius: 99, backgroundColor: colors.calmSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
              <Icon name="check" size={28} stroke={colors.calmInk} sw={2.4} />
            </View>
            <Text style={{ fontFamily: fonts.display, fontSize: 20, fontWeight: '600', marginBottom: 5, color: colors.ink }}>
              {inviteMode ? t('social.inviteSent') : t('social.sharedSent')} · {count}
            </Text>
            <Text style={{ fontSize: 13, color: colors.muted, textAlign: 'center', marginBottom: 18 }}>
              {inviteMode ? t('social.inviteSentNote') : t('social.shareSentNote')}
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
