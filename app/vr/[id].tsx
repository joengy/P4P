import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Photo, Tag, Btn, Icon, SaveButton, Bar, Avatar } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { L } from '@/lib/L';
import { useLang } from '@/i18n/useLang';
import { useSaved } from '@/data/queries';
import { useDeviceStore } from '@/store/device';
import { queueVrSession, fetchHandoffState } from '@/lib/vrBridge';
import { useQuery } from '@tanstack/react-query';
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
  const { isSaved, toggleSaved } = useSaved();
  const saved = isSaved(id);
  const deviceCode = useDeviceStore((s) => s.code);
  const { data: v, isLoading: loading } = useVrSession(id);
  const [queue, setQueue] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [queuedId, setQueuedId] = useState<string | null>(null);

  // Testers could not tell whether the phone had reached the headset, so after
  // queuing we watch the row until the game marks it started. Nothing is
  // claimed until the headset itself writes started_at.
  const { data: handoff } = useQuery({
    queryKey: ['handoff', queuedId],
    queryFn: () => fetchHandoffState(queuedId!),
    enabled: !!queuedId,
    refetchInterval: (q) => (q.state.data === 'finished' ? false : 3000),
    // Keep checking while the phone is in the background, i.e. while the user
    // has the headset on, so the status is current when they look again.
    refetchIntervalInBackground: true,
  });

  const onClose = () => router.back();

  let startLabel = t('move.startSession');
  if (queue === 'sent') {
    startLabel =
      handoff === 'finished' ? t('move.headsetFinished') : handoff === 'started' ? t('move.headsetStarted') : t('move.waitingForHeadset');
  }
  else if (!deviceCode) startLabel = t('move.pairFirst');

  // Hands the session to the paired headset. The player still confirms the
  // check-in in VR — this only pre-fills it, so there is nothing to wait for
  // here. Unpaired phones get sent to the pairing sheet first.
  const onStart = async () => {
    if (!v) return;
    if (!deviceCode) {
      router.push('/pair');
      return;
    }
    setQueue('sending');
    try {
      const queued = await queueVrSession({
        deviceCode,
        vrSessionRef: v.id,
        title: v.title,
        mode: v.feltIntensity,
        minutes: v.min,
      });
      setQueuedId(queued);
      setQueue('sent');
    } catch {
      setQueue('error');
    }
  };
  if (!v) {
    return (
      <Sheet onClose={onClose}>
        <View style={{ padding: 24 }}>
          {!loading && <Text>Not found</Text>}
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

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Btn full onPress={onStart} disabled={queue === 'sending' || queue === 'sent'}>
                {startLabel}
              </Btn>
            </View>
            <SaveButton saved={saved} onToggle={() => toggleSaved(v.id)} />
          </View>
          {queue === 'sent' && (
            <Text style={{ fontSize: 12.5, color: colors.muted, textAlign: 'center' }}>
              {handoff === 'started' || handoff === 'finished' ? t('move.headsetStartedHint') : t('move.waitingForHeadsetHint')}
            </Text>
          )}
          {queue === 'error' && (
            <Text style={{ fontSize: 12.5, color: colors.accentInk, textAlign: 'center' }}>
              {t('move.sendFailed')}
            </Text>
          )}
        </View>
      </View>
    </Sheet>
  );
}
