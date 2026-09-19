import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Sheet } from '@/components/sheets/Sheet';
import { Btn, Icon, TextField } from '@/components/ui';
import { colors, radii, fonts } from '@/constants/theme';
import { useDeviceStore } from '@/store/device';

const CODE_LENGTH = 6;

/// Pairs this phone with a VR headset.
///
/// Direction matters: the headset shows the code and the phone types it in,
/// because there is no comfortable keyboard in VR. One code per headset, typed
/// once, then stored — see store/device.ts.
export default function PairScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const code = useDeviceStore((s) => s.code);
  const setCode = useDeviceStore((s) => s.setCode);
  const [draft, setDraft] = useState('');

  const onClose = () => router.back();
  const valid = draft.trim().length === CODE_LENGTH;

  const onPair = () => {
    if (!valid) return;
    setCode(draft);
    router.back();
  };

  return (
    <Sheet onClose={onClose}>
      <View style={{ padding: 20, gap: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Icon name="headset" size={22} stroke={colors.accent} sw={1.8} />
          <Text style={{ fontSize: 21, fontWeight: '700', color: colors.ink, fontFamily: fonts.display }}>
            {t('move.pairTitle')}
          </Text>
        </View>

        <Text style={{ fontSize: 13.5, color: colors.muted, lineHeight: 20 }}>{t('move.pairBody')}</Text>

        {code ? (
          <View style={{ gap: 12 }}>
            <View
              style={{
                backgroundColor: colors.surface2,
                borderRadius: radii.sm,
                paddingVertical: 18,
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 11.5, color: colors.faint, fontWeight: '700', letterSpacing: 0.5 }}>
                {t('move.pairCurrent')}
              </Text>
              <Text style={{ fontSize: 26, fontWeight: '800', color: colors.ink, letterSpacing: 4 }}>{code}</Text>
            </View>
            <Btn full ghost onPress={() => setCode(null)}>
              {t('move.pairForget')}
            </Btn>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            <TextField
              value={draft}
              onChangeText={(v) => setDraft(v.toUpperCase().slice(0, CODE_LENGTH))}
              placeholder={t('move.pairPlaceholder')}
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={CODE_LENGTH}
              style={{ fontSize: 24, letterSpacing: 6, textAlign: 'center', fontWeight: '700' }}
            />
            <Btn full onPress={onPair} disabled={!valid}>
              {t('move.pairCta')}
            </Btn>
          </View>
        )}
      </View>
    </Sheet>
  );
}
