import React, { useState } from 'react';
import { View, Text, Pressable, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon, Btn, TextField } from '@/components/ui';
import { colors, fonts } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const canSubmit = email.trim().length > 3 && password.length >= 6;

  const onSignIn = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) setError(err.message);
  };

  const onMagicLink = async () => {
    if (!email.trim() || busy) return;
    setBusy(true);
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({ email: email.trim() });
    setBusy(false);
    if (err) setError(err.message);
    else setMagicLinkSent(true);
  };

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
          <TextField
            value={email}
            onChangeText={(v) => {
              setEmail(v);
              setMagicLinkSent(false);
            }}
            placeholder={t('auth.email')}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextField
            value={password}
            onChangeText={setPassword}
            placeholder={t('auth.password')}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        {error && (
          <Text style={{ fontSize: 12.5, color: colors.accentInk, backgroundColor: colors.accentSoft, padding: 10, borderRadius: 10 }}>
            {error}
          </Text>
        )}
        {magicLinkSent && (
          <Text style={{ fontSize: 12.5, color: colors.calmInk, backgroundColor: colors.calmSoft, padding: 10, borderRadius: 10 }}>
            {t('auth.magicLinkSent')}
          </Text>
        )}

        <Btn full size="lg" onPress={onSignIn} disabled={!canSubmit || busy}>
          {t('auth.signIn')}
        </Btn>

        <Pressable onPress={onMagicLink} disabled={busy || !email.trim()} style={{ alignSelf: 'center' }}>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: colors.accent }}>{t('auth.sendMagicLink')}</Text>
        </Pressable>

        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 8 }}>
          <Text style={{ fontSize: 13, color: colors.muted }}>{t('auth.noAccount')}</Text>
          <Pressable onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.accent }}>{t('auth.signUpCta')}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
