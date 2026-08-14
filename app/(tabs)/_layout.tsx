import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Svg, { Path, Circle, Rect as SvgRect } from 'react-native-svg';
import { Icon } from '@/components/ui';
import { useLang } from '@/i18n/useLang';
import { colors, fonts } from '@/constants/theme';

function NavGlyph({ name, on }: { name: 'home' | 'discover' | 'plan' | 'you'; on: boolean }) {
  const c = on ? colors.accent : colors.muted;
  const p = { fill: 'none', stroke: c, strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const glyphs: Record<typeof name, React.ReactNode> = {
    home: (
      <>
        <Path {...p} d="M4 11l8-7 8 7" />
        <Path {...p} d="M6 9.5V20h12V9.5" />
      </>
    ),
    discover: (
      <>
        <Circle cx="12" cy="12" r="8.5" {...p} />
        <Path d="M15.5 8.5l-2 5-5 2 2-5z" fill={c} stroke={c} strokeWidth={1.6} strokeLinejoin="round" />
      </>
    ),
    plan: (
      <>
        <SvgRect x={4} y={5} width={16} height={16} rx={3} {...p} />
        <Path {...p} d="M4 9.5h16M8 3v4M16 3v4M8.5 14l2.2 2.2 4-4.2" />
      </>
    ),
    you: (
      <>
        <Circle cx="12" cy="8.5" r="3.6" {...p} />
        <Path {...p} d="M5 20a7 7 0 0114 0" />
      </>
    ),
  };
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24">
      {glyphs[name]}
    </Svg>
  );
}

function Header() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { lang, toggleLang } = useLang();
  const router = useRouter();
  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: 11,
        paddingLeft: 18,
        paddingRight: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: colors.bg,
      }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 7 }}>
        <View style={{ width: 26, height: 26, borderRadius: 9, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="leaf" size={15} stroke={colors.onAccent} />
        </View>
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 22, fontWeight: '700', color: colors.accent, letterSpacing: -0.2 }}>
          {t('appName')}
        </Text>
      </View>
      <Pressable
        onPress={toggleLang}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 12,
          paddingVertical: 7,
          borderRadius: 99,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
        }}
      >
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: lang === 'en' ? colors.accent : colors.faint }}>EN</Text>
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: colors.faint }}>/</Text>
        <Text style={{ fontSize: 12.5, fontWeight: '700', color: lang === 'zh' ? colors.accent : colors.faint }}>中</Text>
      </Pressable>
      <Pressable
        onPress={() => router.push('/messages')}
        style={{
          width: 38,
          height: 38,
          borderRadius: 99,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.line,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon name="people" size={19} stroke={colors.ink} />
      </Pressable>
    </View>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Header />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.line,
            height: 58 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: { fontSize: 10.5, fontWeight: '700' },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t('nav.home'),
            tabBarIcon: ({ focused }) => <NavGlyph name="home" on={focused} />,
          }}
        />
        <Tabs.Screen
          name="discover"
          options={{
            title: t('nav.discover'),
            tabBarIcon: ({ focused }) => <NavGlyph name="discover" on={focused} />,
          }}
        />
        <Tabs.Screen
          name="move"
          options={{
            title: t('nav.move'),
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 19,
                  marginTop: -26,
                  backgroundColor: colors.accent,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: colors.surface,
                }}
              >
                <Icon name="headset" size={26} stroke={colors.onAccent} sw={1.9} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="plan"
          options={{
            title: t('nav.plan'),
            tabBarIcon: ({ focused }) => <NavGlyph name="plan" on={focused} />,
          }}
        />
        <Tabs.Screen
          name="you"
          options={{
            title: t('nav.you'),
            tabBarIcon: ({ focused }) => <NavGlyph name="you" on={focused} />,
          }}
        />
      </Tabs>
    </View>
  );
}
