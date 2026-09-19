import 'react-native-gesture-handler';
import { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Newsreader_500Medium, Newsreader_600SemiBold, Newsreader_700Bold } from '@expo-google-fonts/newsreader';
import {
  HankenGrotesk_400Regular,
  HankenGrotesk_500Medium,
  HankenGrotesk_600SemiBold,
  HankenGrotesk_700Bold,
  HankenGrotesk_800ExtraBold,
} from '@expo-google-fonts/hanken-grotesk';
import { NotoSansSC_400Regular, NotoSansSC_600SemiBold } from '@expo-google-fonts/noto-sans-sc';
import { I18nextProvider } from 'react-i18next';
import { View } from 'react-native';
import { initI18n } from '@/i18n';
import { colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, retry: 1 } },
});

// There is no sign-in step at the moment: the app opens straight on the tabs
// and every screen reads from the mock layer in data/queries.ts. The auth gate,
// the AuthProvider and the (auth) sign-in/sign-up screens were removed in the
// commit that added this note — restore them from git history when Phase 3
// wires real per-user data.

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Newsreader_500Medium,
    Newsreader_600SemiBold,
    Newsreader_700Bold,
    HankenGrotesk_400Regular,
    HankenGrotesk_500Medium,
    HankenGrotesk_600SemiBold,
    HankenGrotesk_700Bold,
    HankenGrotesk_800ExtraBold,
    NotoSansSC_400Regular,
    NotoSansSC_600SemiBold,
  });
  const [i18nInstance, setI18nInstance] = useState<Awaited<ReturnType<typeof initI18n>> | null>(null);

  useEffect(() => {
    initI18n().then(setI18nInstance);
  }, []);

  const ready = fontsLoaded && i18nInstance;

  const onLayoutRootView = useCallback(async () => {
    if (ready) await SplashScreen.hideAsync();
  }, [ready]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18nInstance}>
            <BottomSheetModalProvider>
              <View style={{ flex: 1, backgroundColor: colors.bg }}>
                <StatusBar style="dark" />
                <Stack screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="activity/[id]" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="vr/[id]" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="plan/[id]" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="fit/[id]" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="ask/[id]" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="session/[id]" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="share/[id]" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="mood" options={{ presentation: 'transparentModal' }} />
                  <Stack.Screen name="pair" options={{ presentation: 'transparentModal' }} />
                </Stack>
              </View>
            </BottomSheetModalProvider>
          </I18nextProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
