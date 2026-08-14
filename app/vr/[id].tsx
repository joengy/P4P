import React from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Photo, Tag, Btn, Icon, SaveButton, Bar, Avatar } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useSavedStore } from '@/store/saved';
import { useVrSession } from '@/data/queries';

function SafetyRow({ icon, label }: { icon: 'check' | 'x' | 'pin' | 'heart'; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 4 }}>
      <Icon name={icon} size={15} stroke={colors.calmInk} />
      <Text style={{ fontSize: 13.5, color: colors.ink }}>{label}</Text>
    </View>
  );
}

export default function VrDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { lang } = useLang();
  const saved = useSavedStore((s) => s.isSaved(id));
  const toggleSaved = useSavedStore((s) => s.toggleSaved);
  const { data: v } = useVrSession(id);

  const onClose = () => router.back();
  if (!v) {
    return (
      <Sheet onClose={onClose}>
        <View style={{ padding: 24 }}>
          <Text>Not found</Text>
        </View>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={onClose}>
      <Photo kind={v.env} height={190} round={0} />
      <View style={{ padding: 18, gap: 16 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 24, fontWeight: '600', color: colors.ink }}>{L(v.title, lang)}</Text>
          <Text style={{ fontSize: 13.5, color: colors.muted }}>{L(v.sub, lang)}</Text>
        </View>

        <View style={{ backgroundColor: colors.calmSoft, borderRadius: 16, padding: 14, gap: 4 }}>
          <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.calmInk, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            {t('move.vrSafety')}
          </Text>
          {v.beginnerSafe && <SafetyRow icon="check" label={t('move.vrSafeBeginners')} />}
          {v.canStop && <SafetyRow icon="check" label={t('move.vrCanStop')} />}
          <SafetyRow icon="pin" label={L(v.space, lang)} />
          <SafetyRow icon="heart" label={L(v.movement, lang)} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Avatar name={v.guide.name} size={40} idx={v.guide.idx} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.ink }}>
              {v.guide.name}
              {v.guide.bilingual ? ` · ${t('badges.bilingual')}` : ''}
            </Text>
            <Text style={{ fontSize: 12.5, color: colors.muted }}>{L(v.guide.bio, lang)}</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: colors.surface2, borderRadius: 14, padding: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: colors.faint, fontWeight: '700' }}>{t('move.vrMovement')}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 4, textTransform: 'capitalize' }}>{v.feltIntensity}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.surface2, borderRadius: 14, padding: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: colors.faint, fontWeight: '700' }}>{t('profile.energyKcal')}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 4 }}>
              {v.energyKcal} {t('profile.kcal')}
            </Text>
          </View>
          <View style={{ flex: 1, backgroundColor: colors.surface2, borderRadius: 14, padding: 12, alignItems: 'center' }}>
            <Text style={{ fontSize: 11, color: colors.faint, fontWeight: '700' }}>{t('session.durationLabel')}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.ink, marginTop: 4 }}>
              {v.min} {t('common.min')}
            </Text>
          </View>
        </View>

        <View style={{ gap: 10 }}>
          <Text style={{ fontSize: 11.5, fontWeight: '800', color: colors.accent, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            {t('move.vrFeltBy')} · {v.triedBy} {t('move.vrTriedBy')}
          </Text>
          {v.feedback.map((f) => (
            <View key={f.id} style={{ gap: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12.5, color: colors.ink }}>{L(f.label, lang)}</Text>
                <Text style={{ fontSize: 12.5, color: colors.faint }}>{f.pct}%</Text>
              </View>
              <Bar pct={f.pct} tone={v.tone === 'accent' ? 'accent' : v.tone === 'lav' ? 'lav' : 'calm'} />
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Btn full>{t('move.startSession')}</Btn>
          </View>
          <SaveButton saved={saved} onToggle={() => toggleSaved(v.id)} />
        </View>
      </View>
    </Sheet>
  );
}
