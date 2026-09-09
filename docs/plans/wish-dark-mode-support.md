# Implementation Plan: Dark Mode Support

## 1. Executive Summary & Objectives
This specification outlines the architectural approach for introducing dark mode support across Acme Analytics and the Make-a-Wish feedback board. The objective is to provide a smooth, accessible theme-switching experience supporting light, dark, and system preference modes, while completely eliminating flash of unstyled content (FOUC) during Next.js hydration.

## 2. User Requirements & Acceptance Criteria
- Users can toggle between Light, Dark, and System (auto) appearance modes.
- User preference persists across browser sessions using `localStorage`.
- Changes apply immediately without requiring a full page refresh.
- Dark mode adheres to WCAG 2.1 AA contrast requirements (minimum 4.5:1 for standard text and 3:1 for UI components).
- All surfaces must support dark themes: top navigation, KPI cards, revenue charts, data tables, status badges, and feedback widget surfaces.

## 3. Proposed Architecture & Impacted Components
- `src/components/theme-provider.tsx`: React Context provider and `useTheme` hook managing active theme state, system preference listeners, and DOM `.dark` class toggling.
- `src/components/theme-toggle.tsx`: Header toggle component allowing users to switch between Light, Dark, and System modes.
- `src/app/layout.tsx`: Inclusion of an inline blocking script in `<head>` to read `localStorage`/`prefers-color-scheme` before rendering to avoid FOUC, and wrapping children with `ThemeProvider`.
- `src/app/globals.css`: Extension of Tailwind CSS tokens and CSS custom properties for `--background`, `--foreground`, card surfaces, and border colors in `.dark` mode.
- `src/app/page.tsx`: Application of `dark:` variant utility classes across navigation, KPI metrics, chart bars, and accounts table.
- `src/app/feedback/page.tsx`: Theme-aware styling for feedback cards, status chips, and voting buttons.
- `src/components/feedback-widget/FeedbackWidget.tsx`: Dark styling support for widget trigger and submission dialogs.

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
- Storage Key: `theme_preference`
- Allowed values: `"light" | "dark" | "system"`

## 5. Phased Implementation Steps
- Phase 1: Theme Infrastructure & Tokens
  - Update `src/app/globals.css` with semantic color tokens (`--background-card`, `--border-muted`, etc.).
  - Create `src/components/theme-provider.tsx` and integrate blocking script in `src/app/layout.tsx`.
- Phase 2: Theme Toggle & Dashboard Refactor
  - Build `src/components/theme-toggle.tsx` and place it in the top navigation header in `src/app/page.tsx`.
  - Refactor all cards, tables, text elements, and chart bars in `src/app/page.tsx` with Tailwind `dark:` variants.
- Phase 3: Feedback Surfaces & Widget
  - Update `src/app/feedback/page.tsx` and `FeedbackWidget.tsx` to respect dark mode styling.
- Phase 4: Quality & Contrast Verification
  - Audit WCAG 2.1 AA color contrast and test SSR hydration across desktop and mobile browsers.

## 6. Testing, Verification & Rollout Strategy
- Unit test `ThemeProvider` local storage reading, writing, and system `change` event listener teardown.
- Manual verification of theme transitions across Safari, Chrome, and Firefox.
- Automated Lighthouse accessibility audit ensuring no contrast violations.
- Gradual deployment through standard preview deployment workflows.

## 7. Risks & Mitigation
- Risk: Flash of Unstyled Content (FOUC) on SSR page load. Mitigation: Inline blocking script in document head before React mount sets `.dark` class directly on `<html>`.
- Risk: Inconsistent contrast on table badges or chart elements. Mitigation: Define dedicated semantic CSS tokens for light and dark status states.