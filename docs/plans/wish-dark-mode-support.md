# Implementation Plan: Dark Mode Support

## 1. Executive Summary & Objectives
This specification defines the architectural and implementation strategy for adding end-to-end dark mode support across Acme Analytics (`make-a-wish`). The objective is to provide a seamless visual experience that respects user preference (System default, Light mode, or Dark mode) while avoiding Flash of Unstyled Content (FOUC), maintaining accessible contrast ratios (WCAG AA), and ensuring harmonious theming across the core analytics dashboard, the feedback board, and the embedded feedback widget.

## 2. User Requirements & Acceptance Criteria
- **Theme Modes**: Users can switch between "Light", "Dark", and "System" (defaulting to system preference via `prefers-color-scheme`).
- **Theme Persistence**: Selected theme is persisted across page reloads and browser sessions using `localStorage`.
- **Zero FOUC**: Pre-hydration inline script prevents visual flickering or white flash on initial load.
- **Contrast & Accessibility**: All text, interactive controls, charts, and status badges meet WCAG AA contrast standards in both modes.
- **Visual Consistency**: Consistent dark palette (e.g., Slate 900 / 950 backgrounds, neutral borders, legible charts, and accessible badge variants) applied across the top navigation, KPI cards, revenue charts, accounts table, and feedback board.

## 3. Proposed Architecture & Impacted Components
- `src/app/globals.css`: Extend Tailwind CSS v4 theme variables to support `.dark` class tokens (`--background`, `--foreground`, `--card`, `--card-foreground`, `--border`, `--muted`, `--muted-foreground`).
- `src/app/layout.tsx`: Add `suppressHydrationWarning` on `<html>`, integrate inline blocking theme initialization script, and wrap layout children with `ThemeProvider`.
- `src/components/theme-provider.tsx` (New): React client context provider managing active theme state, system listeners, and DOM `.dark` class toggling.
- `src/components/theme-toggle.tsx` (New): Interactive button/dropdown in the top navigation header to toggle between light, dark, and system modes.
- `src/app/page.tsx`: Update hardcoded slate and white classes (header `bg-white/80`, KPI cards `bg-white`, chart background, accounts table, borders) with theme-aware Tailwind variants.
- `src/app/feedback/page.tsx`: Update feedback submission list, status filters, and detail drawer with dark variants.
- `src/widget/ui.ts`: Provide dark-mode styling support for the Shadow DOM widget so that feedback annotation and submission dialogs blend with dark host pages.

## 4. Data Models & API Contracts
```typescript
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
}
```
- Stored Key: `localStorage.getItem('theme')` with values `'light' | 'dark' | 'system'`.
- HTML Root Attribute: `<html class="dark">` or `<html class="light">`.

## 5. Phased Implementation Steps
### Phase 1: Foundation & Theme Infrastructure
1. Define CSS custom properties in `src/app/globals.css` for background, text, borders, and card surfaces in `:root` and `.dark`.
2. Create `src/components/theme-provider.tsx` with React context and `localStorage` synchronization.
3. Add non-blocking head script in `src/app/layout.tsx` to read `localStorage` / `prefers-color-scheme` before paint.
4. Build `src/components/theme-toggle.tsx` and place it in the header navigation next to user profile details.

### Phase 2: Core Dashboard & KPI Theming
1. Refactor `src/app/page.tsx` top navigation header to use dark border, backdrop blur, and text tokens.
2. Update KPI cards with `dark:bg-slate-900`, `dark:border-slate-800`, and updated label colors.
3. Adapt Revenue by Month chart bars and axis labels for dark backgrounds (`dark:bg-indigo-400`, `dark:text-slate-400`).
4. Update Accounts table: header borders, alternating row hover states (`dark:hover:bg-slate-800/50`), and status badges (adjusting active/trial/past due badges for dark backgrounds).

### Phase 3: Feedback Board & Embedded Widget Theming
1. Refactor `src/app/feedback/page.tsx` components to support dark mode.
2. Enhance `src/widget/ui.ts` to detect the parent document theme or host `.dark` selector and adjust shadow DOM styles accordingly.

## 6. Testing, Verification & Rollout Strategy
- **Manual Verification**: Test light, dark, and system modes across Chrome, Firefox, and Safari on desktop and mobile viewports.
- **FOUC Validation**: Verify hard refresh (Ctrl+F5) in dark mode shows zero light flash during Next.js hydration.
- **Accessibility**: Run Axe / Lighthouse accessibility audits ensuring minimum 4.5:1 text contrast on dark backgrounds.
- **Widget Screenshot Verification**: Ensure `html-to-image` captures dark mode canvases correctly when submitting feedback.

## 7. Risks & Mitigation
- **Risk: Hydration Mismatch**: Server rendering light mode while client has dark stored in `localStorage`.
  - *Mitigation*: Use `suppressHydrationWarning` on `<html>` and apply theme class via inline script before React mounts.
- **Risk: Embedded Widget Incompatibility**: Shadow DOM styles in `widget.js` might look washed out or invisible on dark pages.
  - *Mitigation*: Detect `html.dark` in the parent document and inject dark CSS variables into the shadow root style block.