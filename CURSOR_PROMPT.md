# Cursor Composer Prompt - Convo AI: Duolingo-Style UI/UX (Next.js)

**Frozen reference for the `frontend/` app.** Implementation lives only under [`frontend/`](frontend/); the Python/Streamlit tree is separate.

## Tech stack

- **Framework:** Next.js 14, App Router (`frontend/app/`)
- **Styling:** Tailwind CSS 3 + CSS Modules for selected complex animations (e.g. voice waveform)
- **Motion:** Framer Motion (page transitions, progress bar, micro-interactions)
- **State:** React Context + `useReducer` for onboarding; Zustand (`persist`) for XP, streak, profile, daily goal
- **Icons:** Lucide React
- **Fonts:** Inter (body) + DM Sans (headings) via `next/font/google`
- **Package manager:** npm

## Project structure (target)

See [`frontend/`](frontend/) - `app/`, `components/`, `lib/`, `public/mascot/`, API routes under `app/api/`.

## Design system (summary)

CSS variables in [`frontend/app/globals.css`](frontend/app/globals.css): light/dark surfaces, `--brand-green` (#58cc02), `--brand-blue`, etc. Typography: DM Sans headings, Inter body. Spacing, radii, shadows per Duolingo-like spec.

## Mascot “Convo”

Six SVGs in `frontend/public/mascot/`. **Do not** use emoji as the mascot. [`MascotAvatar`](frontend/components/ui/MascotAvatar.tsx) maps `mood` → file. Chat: **speaking** while AI outputs; **listening** while waiting for the user (when appropriate).

## Onboarding

Routes: `domain` → `subdomain` → `experience` → `discovery` → `goal` → `level` → `daily` → `path` → `ready`. Progress % steps 11–100. Dark theme shell: top progress bar (Framer, including shared `layoutId` on fill), back, mascot + question bubble, `AnimatePresence` step transitions, fixed **NEXT** bar. Single-select steps: **400ms** auto-advance after selection; discovery/goal require **NEXT**. [`lib/constants.ts`](frontend/lib/constants.ts) is the single source for domains/options.

## Learn + chat

- **Learn:** Sidebar (~280px), skill map path, XP/streak, **daily goal progress ring**, domain selector synced to store.
- **Chat:** Messages (AI typewriter ~20ms/char), timer bar, feedback panel (desktop sidebar / mobile drawer), voice control with **waveform** placeholder while “recording”, scaffold comments for STT/backend.

## API scaffolds

- `POST /api/chat` - mock AI payload shape until Python backend is wired.
- `GET`/`PUT /api/user` - profile scaffold.
- `GET /api/skills` - skill tree scaffold.

Optional: on first load of learn routes, `GET /api/user` may hydrate store (guarded, e.g. once per tab session).

## Critical implementation notes

1. Framer Motion transitions on onboarding steps (`AnimatePresence` + direction).
2. Progress bar animates smoothly; shared `layoutId` on progress fill where applicable.
3. Skill map: motion on active/locked bubbles.
4. Mobile-first; feedback drawer on small screens.
5. Persist onboarding + app store to `localStorage` where configured.
6. No duplicate domain data outside `lib/constants.ts`.
7. `// SCAFFOLD:` at all backend integration points.

## Build order (historical)

Bootstrap → design tokens → landing → onboarding shell + steps → learn layout + skill map → chat + feedback → API stubs → polish.

## Deferred

Auth provider for “I already have an account”, production API base URL, analytics, i18n.

## Verification

From `frontend/`: `npm run build`. Smoke: landing → onboarding → ready → `/learn` or `/learn/chat?first=1`.
