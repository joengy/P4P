import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { colors } from '@/constants/theme';

// Hand-drawn-style line icon set — ported 1:1 from components.jsx's Icon component.
export type IconName =
  | 'bell' | 'leaf' | 'arrow' | 'chev' | 'play' | 'check' | 'plus' | 'heart'
  | 'clap' | 'rain' | 'sun' | 'people' | 'x' | 'moon' | 'spark' | 'pin'
  | 'headset' | 'wave' | 'mic' | 'send' | 'chat' | 'quote' | 'bookmark';

type Props = {
  name: IconName;
  size?: number;
  stroke?: string;
  sw?: number;
  fill?: string;
  style?: any;
};

export function Icon({ name, size = 20, stroke = colors.ink, sw = 1.8, fill = 'none', style }: Props) {
  const p = { fill: 'none', stroke, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  const body = (() => {
    switch (name) {
      case 'bell':
        return (
          <>
            <Path {...p} d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8" />
            <Path {...p} d="M10.5 21a1.8 1.8 0 003 0" />
          </>
        );
      case 'leaf':
        return (
          <>
            <Path {...p} d="M5 18C5 9 12 4 20 4c0 8-5 15-14 15-1.5 0-3-.3-3-.3" />
            <Path {...p} d="M5 18c2.5-4 5.5-6.5 9-8" />
          </>
        );
      case 'arrow':
        return (
          <>
            <Path {...p} d="M5 12h13" />
            <Path {...p} d="M13 6l6 6-6 6" />
          </>
        );
      case 'chev':
        return <Path {...p} d="M9 6l6 6-6 6" />;
      case 'play':
        return <Path d="M8 5.5v13l11-6.5z" fill={stroke} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />;
      case 'check':
        return <Path {...p} d="M5 13l4 4L19 6" />;
      case 'plus':
        return (
          <>
            <Path {...p} d="M12 5v14" />
            <Path {...p} d="M5 12h14" />
          </>
        );
      case 'heart':
        return (
          <Path
            d="M12 20s-7-4.5-9.2-9.2C1.3 7.6 3 4.6 6 4.6c2 0 3.2 1.4 4 2.6.8-1.2 2-2.6 4-2.6 3 0 4.7 3 3.2 6.2C19 15.5 12 20 12 20z"
            fill={fill === 'cur' ? stroke : 'none'}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      case 'clap':
        return (
          <>
            <Path {...p} d="M8 13l-2.5 2.5a2 2 0 002.8 2.8L18 8.6a2 2 0 00-2.8-2.8L13 8" />
            <Path {...p} d="M11 6l1-2M16 7l2-1M16 12l2 .5" />
          </>
        );
      case 'rain':
        return (
          <>
            <Path {...p} d="M7 16a4.5 4.5 0 01-.5-9 5.5 5.5 0 0110.6 1.4A3.6 3.6 0 0117 16" />
            <Path {...p} d="M8 19l-1 2M12 19l-1 2M16 19l-1 2" />
          </>
        );
      case 'sun':
        return (
          <>
            <Circle cx="12" cy="12" r="4" {...p} />
            <Path {...p} d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
          </>
        );
      case 'people':
        return (
          <>
            <Circle cx="9" cy="8" r="3.2" {...p} />
            <Path {...p} d="M3.5 19a5.5 5.5 0 0111 0" />
            <Path {...p} d="M16 5.2a3.2 3.2 0 010 5.8M17 19a5.5 5.5 0 00-2.5-4.6" />
          </>
        );
      case 'x':
        return <Path {...p} d="M6 6l12 12M18 6L6 18" />;
      case 'moon':
        return <Path {...p} d="M20 14.5A8 8 0 119.5 4 6.5 6.5 0 0020 14.5z" />;
      case 'spark':
        return <Path {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />;
      case 'pin':
        return (
          <>
            <Path {...p} d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
            <Circle cx="12" cy="10" r="2.4" {...p} />
          </>
        );
      case 'headset':
        return (
          <>
            <Path {...p} d="M4 13v-1a8 8 0 0116 0v1" />
            <Rect x="2.5" y="13" width="4" height="6" rx="1.6" {...p} />
            <Rect x="17.5" y="13" width="4" height="6" rx="1.6" {...p} />
          </>
        );
      case 'wave':
        return <Path {...p} d="M3 14c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2 2-2 2-2" />;
      case 'mic':
        return (
          <>
            <Rect x="9" y="3" width="6" height="11" rx="3" {...p} />
            <Path {...p} d="M5 11a7 7 0 0014 0M12 18v3" />
          </>
        );
      case 'send':
        return (
          <>
            <Path {...p} d="M21 3L3 10l7 2.5L13 21l8-18z" />
            <Path {...p} d="M10 12.5L21 3" />
          </>
        );
      case 'chat':
        return <Path {...p} d="M4 5a2 2 0 012-2h12a2 2 0 012 2v9a2 2 0 01-2 2h-7l-4 4v-4H6a2 2 0 01-2-2V5z" />;
      case 'quote':
        return (
          <>
            <Path {...p} d="M7 17q-3 0-3-4 0-5 4-7" />
            <Path {...p} d="M17 17q-3 0-3-4 0-5 4-7" />
          </>
        );
      case 'bookmark':
        return (
          <Path
            d="M7 4.5a1 1 0 011-1h8a1 1 0 011 1V20l-5-3.4L7 20V4.5z"
            fill={fill}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        );
      default:
        return null;
    }
  })();

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      {body}
    </Svg>
  );
}
