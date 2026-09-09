# Implementation Plan: Dark Mode Support and Theme Preference Management

## 1. Executive Summary & Objectives
This specification defines the architectural and user interface strategy for introducing dark mode support across the Acme Analytics platform and Make-a-Wish feedback surfaces. The goal is to provide a seamless dark theme that honors operating system preferences (`prefers-color-scheme`), allows explicit user overrides (`light`, `dark`, `system`), persists choices across sessions without Flash of Unstyled Content (FOUC), and ensures WCAG AA color contrast compliance.

## 2. User Requirements & Acceptance Criteria
- **Theme Modes**: Users can select between `Light`, `Dark`, and `System` default preferences.
- **Navigation Controls**: A responsive theme toggle switch is accessible in the main application header.
- **Zero-FOUC Hydration**: When reloading in dark mode, the page immediately renders dark background and typography with no white flicker before client hydration.
- **Persistence**: User selection persists in browser `localStorage` across page refreshes and route transitions.
- **Full Surface Coverage**: All primary dashboard views (`/`), KPI summary cards, bar charts, data tables, and the feedback board (`/feedback`) render appropriate dark styles.
- **Accessibility**: All text, status indicators, and interactive controls maintain minimum 4.5:1 contrast ratios in both light and dark modes.

## 3. Proposed Architecture & Impacted Components
- **Global Theme Tokens**: `src/app/globals.css`
  - Define semantic CSS custom properties for light and dark palettes (`--background`, `--foreground`, `--card-bg`, `--card-border`, `--muted-text`).
  - Configure Tailwind CSS v4 `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));` or `.dark` class targeting.
- **Hydration Guard & Script**: `src/app/layout.tsx`
  - Add an inline blocking `<script>` inside `<head>` to evaluate stored theme or system preference and apply the `dark` class to `<html>` synchronously before paint.
- **Theme State Management**: `src/lib/theme.ts`
  - Create `useTheme` hook and context provider managing active mode, resolved theme, and `prefers-color-scheme` media query listeners.
- **Header Switcher Component**: `src/components/ThemeToggle.tsx`
  - Implement an accessible dropdown/toggle button with Sun, Moon, and Monitor icons placed in the navigation header.
- **Dashboard Restyling**: `src/app/page.tsx`
  - Update header, KPI cards, revenue chart containers, accounts table, and status badges to use dark-mode compatible Tailwind classes (`dark:bg-slate-900`, `dark:border-slate-800`, `dark:text-slate-100`).
- **Feedback Board Restyling**: `src/app/feedback/page.tsx`
  - Modernize filter controls, submission cards, feedback detail modal, and screenshot preview container for dark theme compatibility.

## 4. Data Models & API Contracts
```typescript
// src/lib/theme.ts
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
}
```

Storage Contract:
- `localStorage` key: `acme_theme_preference` (`'light' | 'dark' | 'system'`)

## 5. Phased Implementation Steps
- **Phase 1: Token Architecture & Styling Setup**
  - Update `src/app/globals.css` with dark theme variable mappings.
  - Add pre-hydration theme initialization script to `src/app/layout.tsx`.
- **Phase 2: Theme State & UI Controls**
  - Implement `src/lib/theme.ts` context provider and `useTheme` hook.
  - Create `src/components/ThemeToggle.tsx` and integrate it into `src/app/page.tsx` and `src/app/feedback/page.tsx` header navs.
- **Phase 3: Core Dashboard Adaptation**
  - Refactor `src/app/page.tsx` hardcoded light backgrounds and borders to responsive dark tokens.
  - Adjust bar chart SVG/CSS fill colors for optimal visibility against dark backgrounds.
- **Phase 4: Feedback Board & Secondary Pages**
  - Refactor `src/app/feedback/page.tsx` filters, table rows, and modal dialogs.
  - Ensure feedback category pills (`Bug`, `Wish`, `Confusing`) have readable dark-mode variants.
- **Phase 5: Verification & Polish**
  - Test theme switching performance, mobile viewport compatibility, and verify zero-FOUC on hard reload.

## 6. Testing, Verification & Rollout Strategy
- **Unit Tests**: Test `theme.ts` resolution logic for default fallback, system match media events, and localStorage persistence.
- **Visual Regression Testing**: Compare light and dark mode snapshots across `/` and `/feedback`.
- **FOUC Validation**: Verify cold-boot page reloads in Chrome DevTools with CPU throttling enabled.
- **Rollout**: Deploy to staging preview environment, perform cross-browser testing (Chrome, Safari, Firefox), and enable globally.

## 7. Risks & Mitigation
- **Flash of White (FOUC)**: If theme resolution runs only inside React `useEffect`, a visible white flash occurs on SSR pages. *Mitigation*: Run a tiny, synchronous inline `<script>` in the document `<head>` before body rendering.
- **Chart Legibility**: Revenue chart bars may blend into dark card backgrounds. *Mitigation*: Adjust bar opacity and introduce subtle borders or lighter accent fills in dark mode.
- **Feedback Widget Style Bleed**: Injected feedback widget could be affected by parent dark mode classes. *Mitigation*: Maintain scoped CSS rules within the widget bundle to prevent host style contamination.
