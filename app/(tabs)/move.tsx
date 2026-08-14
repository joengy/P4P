import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fonts } from '@/constants/theme';
import { Segmented, SectionHead } from '@/components/ui';
import { EntryPromptCard } from '@/components/move/EntryPromptCard';
import { VrSessionRow } from '@/components/move/VrSessionRow';
import { AfterVrBridge } from '@/components/move/AfterVrBridge';
import { useVrSessions } from '@/data/queries';

export default function MoveScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: sessions } = useVrSessions();
  const [state, setState] = useState<'before' | 'after'>('before');

  const sessionWithBridge = sessions?.find((s) => s.realWorld) ?? sessions?.[0];
  const otherSessions = sessions?.filter((s) => s.id !== sessionWithBridge?.id) ?? [];

  return (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24, gap: 18 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ gap: 4 }}>
        <Text style={{ fontFamily: fonts.display, fontSize: 30, fontWeight: '600', color: colors.ink, letterSpacing: -0.4 }}>
          {t('move.moveTitle')}
        </Text>
        <Text style={{ fontSize: 14, color: colors.muted, lineHeight: 20 }}>{t('move.moveSub')}</Text>
      </View>

      <EntryPromptCard />

      <Segmented
        options={[
          { id: 'before', label: t('move.beforeVr') },
          { id: 'after', label: t('move.afterVr') },
        ]}
        value={state}
        onChange={(v) => setState(v as 'before' | 'after')}
      />

      {state === 'before' ? (
        <View>
          <SectionHead>{t('move.vrToday')}</SectionHead>
          <View style={{ gap: 10 }}>{sessions?.map((s) => <VrSessionRow key={s.id} session={s} />)}</View>
        </View>
      ) : (
        <View style={{ gap: 18 }}>
          {sessionWithBridge && <AfterVrBridge session={sessionWithBridge} />}
          <View>
            <SectionHead>{t('move.moreVrSessions')}</SectionHead>
            <View style={{ gap: 10 }}>{otherSessions.map((s) => <VrSessionRow key={s.id} session={s} />)}</View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
