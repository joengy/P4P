import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { Avatar, Card, Btn } from '@/components/ui';
import { RhythmHero } from '@/components/you/RhythmHero';
import { SavedBlock } from '@/components/you/SavedBlock';
import { TipsBlock } from '@/components/you/TipsBlock';
import { KnowledgeBlock } from '@/components/you/KnowledgeBlock';
import { useAuth } from '@/lib/auth';
import { useProfile } from '@/data/queries';
import { useLang } from '@/i18n/useLang';

export default function YouScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signOut } = useAuth();
  const { lang } = useLang();
  const { data: profile } = useProfile();
  const name = profile?.name ?? '';
  const since = profile ? new Date(profile.since).toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-NZ', { month: 'long' }) : '';

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, paddingBottom: insets.bottom + 24, gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 2 }}>
        <Avatar name={name || '?'} size={62} idx={0} />
        <View>
          <Text style={{ fontSize: 25, fontWeight: '600', letterSpacing: -0.4, color: colors.ink, marginBottom: 3 }}>
            {name}
          </Text>
          <Text style={{ fontSize: 13, color: colors.muted }}>{t('profile.youSub', { month: since })}</Text>
        </View>
      </View>

      <RhythmHero />

      <SavedBlock />

      <TipsBlock />

      <KnowledgeBlock />

      <Card pad={15} soft style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.calmSoft }}>
        <Avatar name="Mei Lin" size={46} idx={3} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 11.5, fontWeight: '700', color: colors.calmInk, marginBottom: 2 }}>{t('profile.yourGuide')}</Text>
          <Text style={{ fontWeight: '700', fontSize: 14.5, color: colors.ink }}>Mei-Lin · {t('badges.bilingual')}</Text>
        </View>
        <Btn size="sm" tone="calm" ghost onPress={() => router.push('/messages/c1')}>
          {t('profile.message')}
        </Btn>
      </Card>

      <Btn size="sm" ghost onPress={signOut}>
        {t('auth.signOut')}
      </Btn>
    </ScrollView>
  );
}
