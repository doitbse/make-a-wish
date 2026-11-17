# Implementation Plan: Dark Mode Support

## 1. Executive Summary & Objectives
This specification outlines the architectural approach for introducing comprehensive dark mode support across Acme Analytics. The objective is to provide a seamless visual theme experience supporting Light, Dark, and System preference modes, eliminating flash of unstyled content (FOUC) during initial load and Next.js hydration, while adhering to WCAG 2.1 AA accessibility contrast standards.

## 2. User Requirements & Acceptance Criteria
- Users can toggle between Light, Dark, and System appearance modes via a header toggle.
- User theme preference is persisted across browser sessions via `localStorage`.
- The application automatically adapts to system appearance changes when in System mode.
- Initial page load eliminates flash of unstyled content (FOUC) using a blocking pre-hydration script in `<head>`.
- All dashboard surfaces (navigation, KPI metric cards, revenue charts, and the accounts data table) properly reflect dark mode styling with WCAG 2.1 AA compliant contrast.

## 3. Proposed Architecture & Impacted Components
- `src/app/globals.css`: Extend Tailwind CSS and CSS custom properties for `:root` and `.dark` variables (`--background`, `--foreground`, `--card`, `--card-foreground`, `--border`, `--muted`).
- `src/app/layout.tsx`: Add `suppressHydrationWarning` on `<html>`, inject inline blocking theme initialization script in `<head>`, and wrap application children with `ThemeProvider`.
- `src/components/theme-provider.tsx`: React Context provider and `useTheme` hook to manage active theme state, system media query listeners, and DOM `.dark` class synchronization.
- `src/components/theme-toggle.tsx`: Header toggle control allowing users to switch between Light, Dark, and System modes.
- `src/app/page.tsx`: Update overview dashboard components (header, KPI metric cards, revenue chart bars, and accounts table) with Tailwind `dark:` variant styling.

## 4. Data Models & API Contracts
```typescript
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}
```
- Storage Key: `theme_preference` in `localStorage`
- Values: `'light' | 'dark' | 'system'`
- DOM State: Class `dark` added to `document.documentElement`

## 5. Phased Implementation Steps
- Phase 1: Theme Infrastructure & Tokens
  - Define CSS custom properties for dark surfaces and borders in `src/app/globals.css`.
  - Implement `src/components/theme-provider.tsx` and integrate blocking inline script in `src/app/layout.tsx`.
- Phase 2: Theme Toggle & Dashboard Refactor
  - Create `src/components/theme-toggle.tsx` and integrate it into the top header navigation.
  - Update KPI cards, metric labels, and the revenue chart in `src/app/page.tsx` with `dark:` variants.
- Phase 3: Table & Feedback Widget Theming
  - Refactor accounts table rows, borders, and status badge pill styles for dark mode contrast.
  - Verify embedded feedback widget presentation against dark host backgrounds.
- Phase 4: Verification & Quality Assurance
  - Perform automated contrast checks and cross-browser testing in Light, Dark, and System preference modes.

## 6. Testing, Verification & Rollout Strategy
- Verify theme switching across Chrome, Safari, and Firefox.
- Test SSR initial load and hard refresh to guarantee zero FOUC.
- Run Lighthouse accessibility audit to ensure all text elements achieve >= 4.5:1 contrast in dark mode.
- Verify system theme changes dynamically update the UI when 'system' is selected.

## 7. Risks & Mitigation
- Risk: Flash of Unstyled Content (FOUC) on SSR hydration. Mitigation: Use inline blocking script in document `<head>` to resolve theme from `localStorage` or `matchMedia` prior to initial paint.
- Risk: Inadequate contrast on table status badges. Mitigation: Define specific accessible color tokens for active, trial, and past due badges in dark mode.