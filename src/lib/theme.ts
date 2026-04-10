import tokens from '../tokens';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedColorScheme = 'light' | 'dark';

export type ThemePalette = {
  appBackground: string;
  surfacePrimary: string;
  surfaceSecondary: string;
  surfaceElevated: string;
  contentPrimary: string;
  contentSecondary: string;
  contentInverse: string;
  contentDanger: string;
  contentBrand: string;
  contentDisabled: string;
  borderDefault: string;
  borderStrong: string;
  overlay: string;
  authGradient: string;
  cardShadow: string;
  modalShadow: string;
};

export const lightThemePalette: ThemePalette = {
  appBackground: '#F3F4F6',
  surfacePrimary: tokens.colorSurfacePrimary,
  surfaceSecondary: tokens.colorSurfaceSecondary,
  surfaceElevated: tokens.colorSurfaceElevated,
  contentPrimary: tokens.colorContentPrimary,
  contentSecondary: tokens.colorContentSecondary,
  contentInverse: tokens.colorContentInverse,
  contentDanger: tokens.colorContentDanger,
  contentBrand: tokens.colorContentBrand,
  contentDisabled: tokens.colorContentDisabled,
  borderDefault: tokens.colorBorderDefault,
  borderStrong: tokens.colorBorderStrong,
  overlay: tokens.colorSurfaceOverlay,
  authGradient: 'linear-gradient(180deg, rgba(232,241,255,0.95) 0%, rgba(243,244,246,1) 100%)',
  cardShadow: tokens.shadowCard,
  modalShadow: '0 20px 48px rgba(15, 23, 42, 0.24)',
};

export const darkThemePalette: ThemePalette = {
  appBackground: '#020617',
  surfacePrimary: '#0F172A',
  surfaceSecondary: '#111827',
  surfaceElevated: '#111C33',
  contentPrimary: '#F8FAFC',
  contentSecondary: '#CBD5E1',
  contentInverse: '#FFFFFF',
  contentDanger: '#FCA5A5',
  contentBrand: '#93C5FD',
  contentDisabled: '#64748B',
  borderDefault: '#334155',
  borderStrong: '#475569',
  overlay: 'rgba(2, 6, 23, 0.82)',
  authGradient: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,1) 100%)',
  cardShadow: '0 16px 40px rgba(2, 6, 23, 0.5)',
  modalShadow: '0 24px 56px rgba(2, 6, 23, 0.72)',
};

export function getThemePalette(colorScheme: ResolvedColorScheme): ThemePalette {
  return colorScheme === 'dark' ? darkThemePalette : lightThemePalette;
}
