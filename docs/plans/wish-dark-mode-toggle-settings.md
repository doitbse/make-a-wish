# Implementation Plan: Dark Mode Toggle and Theming System

## 1. Executive Summary & Objectives
This specification outlines the architecture and execution plan for introducing application-wide dark mode theming and a dedicated Settings page into Acme Analytics. Currently, the dashboard navigation contains an anchor link to `#settings`, but no settings page or section exists, and UI styling relies on hardcoded light-theme Tailwind CSS utilities. This initiative provides a robust, hydration-safe theme switching mechanism (Light, Dark, System) and a dedicated user settings surface.

## 2. User Requirements & Acceptance Criteria
- A dedicated Settings view accessible from the top navigation.
- A theme selector allowing users to switch between Light, Dark, and System Preference modes.
- Seamless persistence of theme selection across reloads and sessions via `localStorage` and client cookies.
- Zero flash of unstyled or incorrect content (FOUC) during Next.js server-side rendering and initial hydration.
- Full dark mode visual styling across all Acme Analytics dashboard components (KPI cards, revenue charts, accounts table, and feedback board).
- Graceful fallback to OS `prefers-color-scheme` when no explicit user preference has been stored.

## 3. Proposed Architecture & Impacted Components
- `src/app/globals.css`: Define semantic CSS theme variables (`--background`, `--foreground`, `--card-bg`, `--border-color`) and configure Tailwind CSS v4 dark variant support (`@variant dark (&:where(.dark, .dark *));`).
- `src/app/layout.tsx`: Inject an inline, blocking script in `<head>` to resolve and apply the theme class to `document.documentElement` before first paint, and wrap application content in `ThemeProvider`.
- `src/components/theme-provider.tsx`: Context provider managing active theme state (`light`, `dark`, `system`), resolved active theme, and transition handlers.
- `src/components/theme-toggle.tsx`: Accessible toggle / segmented control component for switching theme modes.
- `src/app/settings/page.tsx`: New App Router settings page hosting user preference controls including the theme switcher.
- `src/app/page.tsx`: Update top navigation to route to `/settings` and add `dark:` variant classes across KPI cards, chart containers, and the accounts table.

## 4. Data Models & API Contracts
```typescript
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
}

export interface UserPreferences {
  theme: ThemeMode;
  updatedAt: string;
}
```
- Storage Key: `localStorage.getItem('acme_theme_mode')`
- Cookie Name (optional for SSR optimization): `acme_theme`

## 5. Phased Implementation Steps
- Phase 1: Theme Infrastructure & Tokens
  - Update `src/app/globals.css` with CSS custom properties for light and dark palettes.
  - Implement `src/components/theme-provider.tsx` with hydration safety and `prefers-color-scheme` listeners.
  - Add pre-hydration theme detector script to `src/app/layout.tsx`.
- Phase 2: Settings Route & Theme Toggle UI
  - Build `src/components/theme-toggle.tsx` supporting keyboard navigation and ARIA attributes.
  - Create `src/app/settings/page.tsx` and connect navigation in `src/app/page.tsx`.
- Phase 3: Dashboard Dark Variant Styling & Verification
  - Style `src/app/page.tsx` cards, tables, headers, and SVG chart elements with `dark:` utilities.
  - Style `src/app/feedback/page.tsx` board elements for consistent dark mode presentation.

## 6. Testing, Verification & Rollout Strategy
- Hydration Testing: Verify zero React hydration mismatches or layout shifts across Chrome, Safari, and Firefox.
- Storage Persistence: Verify preference persists across browser restarts and tab sessions.
- Accessibility: Ensure contrast ratios meet WCAG AA standards in both light and dark modes, and toggle controls support ARIA state attributes.
- Rollout: Deploy behind a feature flag or staging environment prior to general availability.

## 7. Risks & Mitigation
- Risk: Flash of Incorrect Theme (FOIT/FOUC) during Next.js SSR hydration.
  - Mitigation: Execute a synchronous, inline script in document head to apply `.dark` class to `<html>` prior to layout render.
- Risk: Color illegibility or low contrast in dynamic SVG charts.
  - Mitigation: Bind SVG bar fills and text labels to CSS custom properties rather than hardcoded hex values.
