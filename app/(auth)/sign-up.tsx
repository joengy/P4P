import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Btn, TextField } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function SignUpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length >= 6;

  const onSignUp = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    const { data, error: err } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: { data: { display_name: name.trim() || undefined } },
    });
    setBusy(false);
    if (err) {
      setError(err.message);
      return;
    }
    if (!data.session) {
      // Email confirmation required — profiles row is created server-side
      // by the on_auth_user_created trigger regardless of confirmation state.
      setDone(true);
    }
  };

  if (done) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 }}>
        <View style={{ width: 58, height: 58, borderRadius: 99, backgroundColor: colors.calmSoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="check" size={27} stroke={colors.calmInk} sw={2.4} />
        </View>
        <Text style={{ fontFamily: fonts.display, fontSize: 19, fontWeight: '600', color: colors.ink, textAlign: 'center' }}>
          {t('auth.confirmEmailNotice')}
        </Text>
        <Btn size="md" tone="calm" ghost onPress={() => router.replace('/(auth)/sign-in')}>
          {t('auth.signInCta')}
        </Btn>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: insets.top + 24, gap: 22 }}>
        <View style={{ alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <View style={{ width: 46, height: 46, borderRadius: 15, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="leaf" size={24} stroke={colors.onAccent} />
          </View>
          <Text style={{ fontFamily: fonts.display, fontSize: 26, fontWeight: '600', color: colors.ink }}>{t('auth.welcomeTitle')}</Text>
          <Text style={{ fontSize: 14, color: colors.muted }}>{t('auth.welcomeSub')}</Text>
        </View>

        <View style={{ gap: 12 }}>
          <TextField value={name} onChangeText={setName} placeholder={t('auth.displayName')} autoComplete="name" />
          <TextField
            value={email}
            onChangeText={setEmail}
            placeholder={t('auth.email')}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField value={password} onChangeText={setPassword} placeholder={t('auth.password')} secureTextEntry autoComplete="password" />
        </View>

        {error && (
          <Text style={{ fontSize: 12.5, color: colors.accentInk, backgroundColor: colors.accentSoft, padding: 10, borderRadius: 10 }}>
            {error}
          </Text>
        )}

        <Btn full size="lg" onPress={onSignUp} disabled={!canSubmit || busy}>
          {t('auth.signUp')}
        </Btn>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          <Text style={{ fontSize: 13, color: colors.muted }}>{t('auth.haveAccount')}</Text>
          <Pressable onPress={() => router.replace('/(auth)/sign-in')}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent }}>{t('auth.signInCta')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
