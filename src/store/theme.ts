// Migration candidate: useTheme hook (src/hooks/use-theme.ts)
// Wire up when #24 (theme switcher) or #17 (theme palette) lands.
// The hook manages localStorage persistence + DOM class toggling which
// requires a useEffect anyway, so migrate only if cross-component sharing
// is needed (e.g., server-component-aware theme reads).

export type {};
