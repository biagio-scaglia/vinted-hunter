import { Platform } from 'react-native';

// Android emulator uses 10.0.2.2 to reach host's localhost.
// For a real device, set this to your machine's LAN IP (e.g. 192.168.1.x:8000).
export const BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:8000'
    : 'http://192.168.1.12:8000';

export const INTEGRITY_HEADER = 'secure-radar-v2';

export const COLORS = {
  bg:         '#020212',
  surface:    '#0a0a1f',
  surfaceAlt: '#0f0f2d',
  card:       '#11112a',
  border:     'rgba(139,92,246,0.15)',
  primary:    '#8b5cf6',
  primaryDim: 'rgba(139,92,246,0.15)',
  text:       '#e2e8f0',
  textDim:    'rgba(226,232,240,0.6)',
  muted:      'rgba(255,255,255,0.35)',
  error:      '#ef4444',
  success:    '#22c55e',
  warning:    '#f59e0b',
} as const;

export const SOURCE_COLORS: Record<string, string> = {
  vinted: '#8b5cf6',
  subito: '#f97316',
};

export const SOURCE_LABELS: Record<string, string> = {
  vinted: 'Vinted',
  subito: 'Subito',
};
