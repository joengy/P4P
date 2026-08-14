// Soft Clay design tokens — ported 1:1 from design_handoff_hoa_movement_app/index.html
// (.app[data-theme="clay"] custom properties). Single theme per product decision —
// Garden/Editorial token sets are intentionally not implemented.

export const colors = {
  bg: '#EFE7DA',
  surface: '#FFFCF7',
  surface2: '#F7F0E6',
  surface3: '#F1E8DA',
  ink: '#2D2722',
  muted: '#8B8073',
  faint: '#B7AC9C',
  line: '#E8DFCF',
  accent: '#A8503A',
  onAccent: '#FFF7F1',
  accentSoft: '#F2DDD3',
  accentInk: '#8C3E2A',
  calm: '#5F7E57',
  calmSoft: '#E5EEDC',
  calmInk: '#3E5638',
  lav: '#8E7FA8',
  lavSoft: '#EDE7F2',
  lavInk: '#5F5179',
} as const;

export type Tone = 'neutral' | 'calm' | 'lav' | 'accent';

export function toneColors(tone: Tone = 'neutral') {
  switch (tone) {
    case 'calm':
      return { bg: colors.calmSoft, fg: colors.calmInk, solid: colors.calm };
    case 'lav':
      return { bg: colors.lavSoft, fg: colors.lavInk, solid: colors.lav };
    case 'accent':
      return { bg: colors.accentSoft, fg: colors.accentInk, solid: colors.accent };
    default:
      return { bg: colors.surface2, fg: colors.muted, solid: colors.ink };
  }
}

export const radii = {
  card: 22,
  sm: 14,
  xs: 10,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: 'rgba(60,45,30,1)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 3,
  },
  soft: {
    shadowColor: 'rgba(60,45,30,1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  pop: {
    shadowColor: 'rgba(45,35,22,1)',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.16,
    shadowRadius: 30,
    elevation: 10,
  },
} as const;

// Font family names as registered by useFonts() in app/_layout.tsx
export const fonts = {
  display: 'Newsreader_600SemiBold',
  displayMedium: 'Newsreader_500Medium',
  displayBold: 'Newsreader_700Bold',
  body: 'HankenGrotesk_400Regular',
  bodyMedium: 'HankenGrotesk_500Medium',
  bodySemiBold: 'HankenGrotesk_600SemiBold',
  bodyBold: 'HankenGrotesk_700Bold',
  bodyExtraBold: 'HankenGrotesk_800ExtraBold',
  // CJK fallback (react-native does font fallback per-glyph automatically on iOS/Android
  // when the primary family lacks a glyph, so these are mostly documentation here)
  displayZh: 'NotoSansSC_600SemiBold',
  bodyZh: 'NotoSansSC_400Regular',
} as const;

export const type = {
  h1: { fontSize: 30, lineHeight: 36 },
  cardTitle: { fontSize: 22, lineHeight: 28 },
  h3: { fontSize: 18, lineHeight: 23 },
  body: { fontSize: 14.5, lineHeight: 21 },
  bodySm: { fontSize: 13, lineHeight: 19 },
  label: { fontSize: 12.5, lineHeight: 17 },
  micro: { fontSize: 11.5, lineHeight: 15 },
  tiny: { fontSize: 10.5, lineHeight: 14 },
} as const;

// PHOTO_GRAD from components.jsx — gradient stops per placeholder "kind".
// Real photography (Supabase Storage) replaces these once photo_url is present.
export const photoGradients: Record<string, [string, string, string]> = {
  'sunset-trail': ['#e8b27a', '#c66a4e', '#7a4a4f'],
  forest: ['#9fc08a', '#5c8b56', '#2f5436'],
  'forest-vr': ['#a7c79b', '#4f8460', '#274b46'],
  beach: ['#cfe0d8', '#8fb8b0', '#dcc69a'],
  park: ['#cdd99a', '#8fb274', '#5b7e4e'],
  court: ['#d8cbb6', '#b59e84', '#8a7a66'],
  home: ['#ead9c4', '#cdb79c', '#a98f74'],
  sky: ['#cfe3ec', '#a9c8dd', '#d8c9b0'],
  lake: ['#bcd6dc', '#6fa1ad', '#436b73'],
};

export const avatarGradients: [string, string][] = [
  ['#c98a6a', '#9c5440'],
  ['#7f9b6f', '#4f7150'],
  ['#9387ab', '#62567f'],
  ['#cdaa72', '#9c7a44'],
  ['#7fa3ac', '#4f7780'],
];
